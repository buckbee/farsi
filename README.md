# Farsi — personal language learning app

A personal web app for learning Farsi (Tehran Persian) from zero: one path of 19 mixed lessons (speaking, letters, reading, grammar), spaced-repetition reviews, a word and phrase library, and a writing guide for every letter.

Plain HTML, CSS and JavaScript. No framework, no dependencies and no server: progress is stored in the browser, with a copy/paste backup in Settings.

## Project layout

```
index.html        ← the built app (one self-contained file); this is what the site serves
build.py          ← rebuilds index.html from src/
src/
  template.html   ← page skeleton (head, font link)
  base.css        ← core styles
  extra.css       ← styles added later (lessons, words, grammar…)
  content.js      ← letters, vowel marks, numbers, reading words, extra spelling rules
  vocab.js        ← starter vocabulary (8 themes, 119 words)
  phrases.js      ← phrase sets (60 phrases), "Spoken Tehran" tips, extra reading sentences
  course.js       ← the lesson path (0–18), Say-it phrases, grammar cards
  strokes.js      ← handwriting guide drawings
  app.js          ← app logic: screens, lessons, quizzes, reviews, settings
tests/
  course-test.js      ← plays through every lesson and review card type
  math-read-test.js   ← checks number sums and which sentences are readable when
```

Edit files in `src/`, never `index.html` directly.

## Build

```
python3 build.py
```

Run it after any change in `src/`, and commit the rebuilt `index.html` along with the source.

## Preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000 and use the browser's responsive (mobile) view. To try it on a phone on the same network, open `http://<your-computer's-IP>:8000`.

## Tests

The tests play through every lesson, check every generated question (one correct answer, no duplicate options) and check the number sums. They need Playwright:

```
npm init -y
npm install playwright
npx playwright install chromium
python3 build.py && node tests/course-test.js && node tests/math-read-test.js
```

Screenshots are saved to `tests/` and are not committed (`*.png` is in `.gitignore`).

## Notes

- Storage key: `farsi.demo.v3`. Changing it in `src/app.js` starts everyone from scratch.
- Settings → **Unlock all lessons** is a testing switch.
- Content (letters, words, phrases, grammar, Tehran spoken forms) still needs a native-speaker check, and the handwriting drawings need review (only ا and ب are reviewed so far).
