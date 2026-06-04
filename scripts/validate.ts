import { readdirSync, readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import type { ErrorObject } from 'ajv';

const root = join(import.meta.dirname, '..');
const dataDir = join(root, 'public', 'data');
const ajv = new Ajv2020({ allErrors: false });
let errors = 0;
let filesWithErrors = 0;

function positionToLine(text: string, position: number): number {
  return text.slice(0, position).split('\n').length;
}

function pointerSegments(pointer: string): string[] {
  return pointer
    .split('/')
    .slice(1)
    .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function lineForError(text: string, error: ErrorObject): number | undefined {
  if (!error.instancePath) {
    return 1;
  }

  const segment = pointerSegments(error.instancePath).findLast((part) => !/^\d+$/.test(part));
  if (!segment) {
    return 1;
  }

  const needle = `"${segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`;
  const regex = new RegExp(`^\\s*${needle}\\s*:`);
  const lines = text.split('\n');
  const index = lines.findIndex((line) => regex.test(line));
  return index >= 0 ? index + 1 : undefined;
}

function formatError(file: string, text: string, error: ErrorObject): string {
  const line = lineForError(text, error);
  const location = line ? `:${line}` : '';
  return `${relative(root, file)}${location}:${error.instancePath || '.'}: ${error.message}`;
}

for (const folder of readdirSync(dataDir, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const schemaPath = join(dataDir, `${folder.name}.schema.json`);

  if (!existsSync(schemaPath)) {
    console.log(`skip ${folder.name}: no schema`);
    continue;
  }

  const validate = ajv.compile(JSON.parse(readFileSync(schemaPath, 'utf8')));
  const dir = join(dataDir, folder.name);
  const files = readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();

  let folderFilesWithErrors = 0;

  for (const file of files) {
    const text = readFileSync(file, 'utf8');

    try {
      validate(JSON.parse(text));
    } catch (error) {
      errors += 1;
      filesWithErrors += 1;
      folderFilesWithErrors += 1;
      const message = error instanceof Error ? error.message : String(error);
      const match = message.match(/position (\d+)/);
      const line = match ? positionToLine(text, Number(match[1])) : undefined;
      console.log(`${relative(root, file)}${line ? `:${line}` : ''}:.: ${message}`);
      continue;
    }

    const error = validate.errors?.[0];
    if (error) {
      errors += 1;
      filesWithErrors += 1;
      folderFilesWithErrors += 1;
      console.log(formatError(file, text, error));
    }
  }

  console.log(`ok ${folder.name}: ${files.length} files, ${folderFilesWithErrors} files with errors`);
}

if (errors) {
  console.log(`failed: ${errors} errors in ${filesWithErrors} files`);
  process.exit(1);
}
