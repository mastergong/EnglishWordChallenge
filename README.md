# English Word Challenge

Mobile-first English vocabulary quiz game (Thai + English UI). Static site, works offline after load, deployable to GitHub Pages.

This vocabulary is **Oxford 3000-aligned** and intended for English learning. It is **not** an official Oxford dataset.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

Preview production output:

```bash
npm run preview
```

## Testing

```bash
npm test
```

## Vocabulary validation

```bash
npm run validate-words
```

The production build runs validation first and fails if critical vocabulary errors exist.

## Vocabulary generation

Source lists live in `scripts/vocab_*.txt` (pipe-separated batches by CEFR). Rebuild JSON with:

```bash
python scripts/build_lexicon.py
npm run build-lexicon
npm run build-vocabulary
```

`npm run generate-words` merges validated batch JSON into `src/data`.

Do **not** call AI APIs from the browser. Generation is development-only.

## Adding new words

1. Add a line to the matching `scripts/vocab_xx.txt` file:

   `word|partOfSpeech|category|meaningTh|meaningEn|ipa|phoneticThai|example|exampleThai`

2. Keep the word unique (case-insensitive).
3. Use original Thai meanings and original example sentences (do not copy dictionary publisher text).
4. Run `npm run build-lexicon` then `npm run validate-words`.

## Changing levels

Players pick A1–C2 on the home screen. Unlocking uses accuracy on the previous level unless **Level lock** is turned off in Settings.

## GitHub Pages deployment

The workflow `.github/workflows/deploy.yml`:

1. Checkout
2. Setup Node.js
3. Install dependencies
4. Validate vocabulary
5. Run tests
6. Build
7. Deploy `dist`

In the GitHub repo: **Settings → Pages → Source: GitHub Actions**.

The app uses `HashRouter`, so routes work under `https://USERNAME.github.io/REPOSITORY/`.

## Changing repository name / base path

Vite reads `VITE_BASE_PATH` (default `/`).

Local example:

```bash
VITE_BASE_PATH=/english-word-challenge/ npm run build
```

The GitHub Actions workflow sets:

```
VITE_BASE_PATH: /${{ github.event.repository.name }}/
```

If the site is a user/organization page (`username.github.io`), set `VITE_BASE_PATH=/` in the workflow.

## Resetting LocalStorage

In Settings, tap **Reset LocalStorage**. In the browser console:

```js
Object.keys(localStorage).filter((k) => k.startsWith("ewc.")).forEach((k) => localStorage.removeItem(k));
```

## Game modes

Classic, Challenge, Endless, Time Attack, Practice, Adaptive, Daily Challenge.

Daily Challenge uses a seeded RNG from `YYYY-MM-DD` so the same date always yields the same questions for this app version.
