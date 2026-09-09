"""Build original Oxford-3000-aligned learner vocabulary JSON batches."""
from __future__ import annotations

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
BATCH = ROOT / "scripts" / "batches"
DATA = ROOT / "src" / "data"

DIFF = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 4, "C2": 5}


def wrap_ipa(ipa: str) -> str:
    ipa = ipa.strip()
    if not ipa.startswith("/"):
        ipa = "/" + ipa
    if not ipa.endswith("/"):
        ipa = ipa + "/"
    return ipa


def parse_block(level: str, block: str) -> list[dict]:
    rows = []
    for raw in block.strip().splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("|")
        if len(parts) != 9:
            raise SystemExit(f"Bad row ({len(parts)} fields): {line[:80]}")
        word, pos, cat, th, en, ipa, phon, ex, exth = [p.strip() for p in parts]
        rows.append(
            {
                "word": word,
                "partOfSpeech": pos,
                "category": cat,
                "meaningTh": th,
                "meaningEn": en,
                "ipa": wrap_ipa(ipa),
                "phoneticThai": phon,
                "example": ex,
                "exampleThai": exth,
                "level": level,
                "difficulty": DIFF[level],
            }
        )
    return rows


def write_all(groups: dict[str, list[dict]]) -> None:
    BATCH.mkdir(parents=True, exist_ok=True)
    DATA.mkdir(parents=True, exist_ok=True)
    all_rows = []
    i = 1
    for level in ["A1", "A2", "B1", "B2", "C1", "C2"]:
        items = groups[level]
        out = []
        for item in items:
            row = {"id": i, **item}
            out.append(row)
            all_rows.append(row)
            i += 1
        (BATCH / f"batch-{level.lower()}.json").write_text(
            json.dumps(out, ensure_ascii=False, indent=0), encoding="utf-8"
        )
        (DATA / f"words-{level.lower()}.json").write_text(
            json.dumps(out, ensure_ascii=False), encoding="utf-8"
        )
        print(f"{level}: {len(out)}")
    (DATA / "words.json").write_text(json.dumps(all_rows, ensure_ascii=False), encoding="utf-8")
    print("total", len(all_rows))
