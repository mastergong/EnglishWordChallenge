from __future__ import annotations

import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from lexicon_lib import parse_block, write_all

ROOT = pathlib.Path(__file__).resolve().parent
FILES = {
    "A1": ROOT / "vocab_a1.txt",
    "A2": ROOT / "vocab_a2.txt",
    "B1": ROOT / "vocab_b1.txt",
    "B2": ROOT / "vocab_b2.txt",
    "C1": ROOT / "vocab_c1.txt",
    "C2": ROOT / "vocab_c2.txt",
}


def main() -> None:
    groups = {level: parse_block(level, path.read_text(encoding="utf-8")) for level, path in FILES.items()}
    seen: dict[str, str] = {}
    for level, rows in groups.items():
        for row in rows:
            key = " ".join(row["word"].lower().split())
            if key in seen:
                raise SystemExit(f"Duplicate word '{row['word']}' in {level} and {seen[key]}")
            seen[key] = level
    write_all(groups)


if __name__ == "__main__":
    main()
