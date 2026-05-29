import { readdirSync, readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';

const root = join(import.meta.dirname, '..');
const dataDir = join(root, 'public', 'data');
const ajv = new Ajv2020({ allErrors: true });
let errors = 0;

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

  for (const file of files) {
    validate(JSON.parse(readFileSync(file, 'utf8')));

    for (const error of validate.errors ?? []) {
      errors += 1;
      console.log(`${relative(root, file)}:${error.instancePath || '.'}: ${error.message}`);
    }
  }

  console.log(`ok ${folder.name}: ${files.length} files`);
}

if (errors) {
  console.log(`failed: ${errors} errors`);
  process.exit(1);
}
