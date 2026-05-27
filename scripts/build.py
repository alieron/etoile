#!/usr/bin/env python3
from pathlib import Path
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DIST = ROOT / "dist"


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(DATA, DIST)

    for folder in sorted(p for p in DATA.iterdir() if p.is_dir()):
        items = []
        for path in sorted(folder.rglob("*.json")):
            with path.open("r", encoding="utf-8") as f:
                items.append(json.load(f))

        out = DIST / f"{folder.name}.json"
        with out.open("w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
            f.write("\n")

        print(f"{out.relative_to(ROOT)}: {len(items)} files")


if __name__ == "__main__":
    main()
