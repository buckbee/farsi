const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + require('path').resolve(__dirname, '../index.html')); await p.waitForTimeout(400);

  // 1. every generated question is sound
  const check = await p.evaluate(() => {
    const bad = [];
    const okQ = (q, name) => {
      if (!q) { bad.push('null ' + name); return; }
      if (!q.correct || q.keys.indexOf(q.correct) < 0) bad.push('no correct ' + name);
      const labels = q.keys.map(k => q.labels[k]);
      if (new Set(labels).size !== labels.length) bad.push('dupe labels ' + name + ' ' + labels.join('|'));
      if (q.keys.length < 3) bad.push('few options ' + name);
    };
    for (let r = 0; r < 15; r++) {
      SAY.forEach(x => okQ(sayQ(x.id), x.id));
      LETTERS.filter(L => !L.kind).forEach(L => {
        const q = spotQ(L.id); okQ(q, 'spot ' + L.id);
        // exactly one option contains the letter
        const chars = letterChars(L);
        const hits = q.keys.filter(k => { const t = normFa(q.labels[k].replace(/<[^>]+>/g, '')); return chars.some(c => t.indexOf(c) >= 0); });
        if (hits.length !== 1) bad.push('spot hits ' + hits.length + ' ' + L.id);
      });
      GRAMMAR.forEach(g => g.pr.forEach((x, i) => okQ(gramQ(g.id, i), g.id + '-' + i)));
      PHRASES.filter(P => P.gap).forEach(P => okQ(clozeQ(P), 'cloze ' + P.id));
      LESSONS.forEach(Ls => { buildLesson(Ls); LESSON.queue.filter(s => s.t === 'quiz').forEach(s => okQ(makeQuiz(s), 'quiz ' + s.id)); });
    }
    const unknownSay = LESSONS.flatMap(Ls => Ls.say).filter(id => !SAYBY[id]);
    const unknownG = LESSONS.filter(Ls => Ls.g && !GBY[Ls.g]).map(Ls => Ls.id);
    const noRead = LESSONS.filter(Ls => Ls.read && !WORDS.some(W => W.lesson === Ls.read)).map(Ls => Ls.id);
    return { bad: [...new Set(bad)].slice(0, 30), unknownSay, unknownG, noRead, lessons: LESSONS.length };
  });
  console.log(JSON.stringify(check));

  // 2. play every lesson in order through the UI
  const w = () => p.waitForTimeout(360);
  await p.evaluate(() => { S = freshState(); go({ name:'home' }); }); await w();
  await p.screenshot({ path: 'tests/ct-home0.png' });
  const counts = {}, shots = {};
  for (let n = 0; n <= 18; n++) {
    await p.click('button:has-text("Continue · Lesson")'); await w();
    let steps = 0;
    for (; steps < 400; steps++) {
      if (await p.$('text=Finish')) break;
      const v = await p.evaluate(() => view.name);
      if (!shots[v] || (v === 'mc' && !shots['mc' + n] && [1, 4, 10, 12].includes(n))) {
        shots[v] = 1; if (v === 'mc') shots['mc' + n] = 1;
        await p.screenshot({ path: `tests/ct-${v}-${n}.png` });
      }
      if (v === 'sayc' || v === 'intro' || v === 'gram') { await p.click('button:has-text("Next")'); await w(); continue; }
      if (v === 'quiz' || v === 'mc') {
        const k = await p.evaluate(() => view.q.correct);
        await p.click(`[data-arg="${k}"]`); await w();
        await p.click('button:has-text("Continue")'); await w(); continue;
      }
      if (v === 'flash') { await p.click('button:has-text("Show")'); await w(); await p.click('[data-act=rate][data-arg="2"]'); await w(); continue; }
      throw new Error('unexpected view ' + v + ' in lesson ' + n);
    }
    counts[n] = steps + ' · ' + await p.evaluate(() => document.querySelector('.home-sub').textContent);
    await p.click('text=Finish'); await w();
  }
  console.log(JSON.stringify(counts, null, 1));
  await p.screenshot({ path: 'tests/ct-home-end.png' });
  await p.evaluate(() => go({ name:'lessons' })); await w(); await p.screenshot({ path: 'tests/ct-lessons.png' });

  // 3. review everything (all card types)
  const types = await p.evaluate(() => { Object.values(S.cards).forEach(c => c.due = 0); const k = {}; dueIds().forEach(id => { const it = itemFor(id); k[it.kind] = (k[it.kind] || 0) + 1; }); return k; });
  console.log('due by type', JSON.stringify(types));
  await p.evaluate(() => { const ids = dueIds(); const byKind = {}; ids.forEach(id => { const k = itemFor(id).kind; (byKind[k] = byKind[k] || []).push(id); }); const q = Object.values(byKind).flatMap(a => a.slice(0, 3)); REVIEW = { queue:q, total:q.length }; reviewStep(); });
  await w();
  let r = 0;
  for (; r < 60; r++) {
    if (await p.$('text=Finish')) break;
    const v = await p.evaluate(() => view.name + ':' + (view.item ? view.item.kind : (view.q ? 'q' : '')));
    if (!shots['rev' + v]) { shots['rev' + v] = 1; await p.screenshot({ path: `tests/ct-rev-${v.replace(':', '-')}.png` }); }
    if (v.startsWith('mc')) { const k = await p.evaluate(() => view.q.correct); await p.click(`[data-arg="${k}"]`); await w(); await p.click('button:has-text("Continue")'); await w(); }
    else { await p.click('button:has-text("Show")'); await w(); await p.click('[data-act=rate][data-arg="2"]'); await w(); }
  }
  console.log('reviewed', r);
  console.log('errors:', errs);
  await b.close();
})();
