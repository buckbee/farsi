#!/usr/bin/env python3
"""Build index.html from the files in src/.

Usage:  python3 build.py
Edit the files in src/, run this, then open index.html (or push to GitHub Pages).
"""
from pathlib import Path

SRC = Path(__file__).parent / 'src'
CSS = ['base.css', 'extra.css']
JS = ['content.js', 'vocab.js', 'phrases.js', 'course.js', 'strokes.js', 'app.js']   # order matters

template = (SRC / 'template.html').read_text(encoding='utf-8')
css = '\n'.join((SRC / f).read_text(encoding='utf-8') for f in CSS)
js = '\n'.join((SRC / f).read_text(encoding='utf-8') for f in JS)
out = template.replace('{{CSS}}', css).replace('{{JS}}', js)
(Path(__file__).parent / 'index.html').write_text(out, encoding='utf-8')
print(f'Built index.html ({len(out):,} characters)')
