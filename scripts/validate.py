#!/usr/bin/env python3
from pathlib import Path
import json
import sys
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def main():
    errors = 0

    for folder in sorted(p for p in DATA.iterdir() if p.is_dir()):
        schema_path = DATA / f"{folder.name}.schema.json"
        if not schema_path.exists():
            print(f"skip {folder.name}: no schema")
            continue

        with schema_path.open("r", encoding="utf-8") as f:
            validator = Draft202012Validator(json.load(f))

        count = 0
        for path in sorted(folder.rglob("*.json")):
            count += 1
            with path.open("r", encoding="utf-8") as f:
                data = json.load(f)

            for error in validator.iter_errors(data):
                errors += 1
                where = "/".join(str(p) for p in error.path) or "."
                print(f"{path.relative_to(ROOT)}:{where}: {error.message}")

        print(f"ok {folder.name}: {count} files")

    if errors:
        print(f"failed: {errors} errors")
        sys.exit(1)


if __name__ == "__main__":
    main()
