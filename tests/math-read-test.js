const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + require('path').resolve(__dirname, '../index.html')); await p.waitForTimeout(400);
  const res = await p.evaluate(() => {
    const bad = [], seen = { c3:new Set(), c9:new Set(), c13:new Set() }, styles = {};
    const toV = {}; LETTERS.filter(L => L.kind === 'num').forEach(L => { toV[stripVow(L.word)] = +L.sound; toV[L.ch] = +L.sound; });
    ['c3','c9','c13'].forEach(id => {
      const n = LESSONS.find(l => l.id === id).n;
      for (let i = 0; i < 300; i++) {
        const q = mathQ(n);
        const tmp = document.createElement('div'); tmp.innerHTML = q.prompt;
        const parts = [...tmp.querySelectorAll('.math .fa')].map(e => toV[stripVow(e.textContent)]);
        const op = tmp.querySelector('.op').textContent;
        const want = op === '+' ? parts[0] + parts[1] : parts[0] - parts[1];
        const ans = toV[stripVow(q.labels[q.correct].replace(/<[^>]+>/g, ''))];
        if (ans !== want) bad.push(id + ' wrong answer ' + parts.join(op) + '=' + ans);
        const labels = q.keys.map(k => q.labels[k]);
        if (new Set(labels).size !== 4) bad.push(id + ' options ' + labels.length);
        if (parts.some(v => v === undefined)) bad.push(id + ' unreadable operand');
        seen[id].add(parts.join(op) + '=' + want);
      }
    });
    const per = LESSONS.map(Ls => READ_POOL.filter(X => X.readAt === Ls.n).length);
    const never = READ_POOL.filter(X => X.readAt === 99).map(X => X.tr);
    return { bad: [...new Set(bad)].slice(0, 20), variety: Object.fromEntries(Object.entries(seen).map(([k, v]) => [k, v.size])),
             sample: [...seen.c3].slice(0, 4).concat([...seen.c13].slice(0, 3)), newlyReadablePerLesson: per.join(' '), never, pool: READ_POOL.length };
  });
  console.log(JSON.stringify(res, null, 1));
  // screens
  for (const [n, name] of [[3, 'm3'], [9, 'm9'], [13, 'm13']]) {
    await p.evaluate((n) => { buildLesson(LESSONS[n]); go({ name:'mc', mode:'lesson', step:5, marks:{}, tries:0, src:{}, q:mathQ(n) }); }, n);
    await p.waitForTimeout(250); await p.screenshot({ path: `tests/mr-${name}.png` });
    await p.evaluate(() => { view.marks[view.q.correct] = 'ok'; view.answered = true; render(); });
    await p.waitForTimeout(250); await p.screenshot({ path: `tests/mr-${name}-done.png` });
  }
  await p.evaluate(() => { const X = READBY['rs-baba-nan']; buildLesson(LESSONS[1]); go({ name:'flash', mode:'lesson', src:{}, item:{ kind:'read', id:'rd:'+X.id, W:X }, done:20, total:40 }); });
  await p.waitForTimeout(250); await p.screenshot({ path: 'tests/mr-read.png' });
  await p.click('button:has-text("Show")'); await p.waitForTimeout(900); await p.screenshot({ path: 'tests/mr-read-done.png' });
  console.log('read steps per lesson:', await p.evaluate(() => { S = freshState(); return LESSONS.map(Ls => { buildLesson(Ls); const r = LESSON.queue.filter(s => s.t === 'readit').length; Ls.items.length; LESSON.queue.filter(s => s.t === 'readit').forEach(s => card('rd:' + s.X.id)); return r; }).join(' '); }));
  console.log('errors', errs);
  await b.close();
})();
