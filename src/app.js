/* =========================================================
   STATE (saved when the browser allows; demo works without)
   ========================================================= */
var KEY = 'farsi.demo.v3';
function freshState(keep){ keep = keep || {}; return { scheme:keep.scheme || 'default', vowels:keep.vowels !== false, unlockAll:!!keep.unlockAll,
  newPerDay:keep.newPerDay || 10, fade:keep.fade !== false, newLog:{ date:'', n:0 }, myWords:keep.myWords || [], done:{}, cards:{}, seen:{} }; }
var S = load() || freshState();
(function(){ var d = freshState(); for (var k in d) if (S[k] === undefined) S[k] = d[k]; })();
function load(){ try { return JSON.parse(localStorage.getItem(KEY)); } catch(e){ return null; } }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }

/* =========================================================
   TEXT HELPERS
   ========================================================= */
function tr(t){
  return S.scheme === 'finnish'
    ? t.replace(/a/g,'ä').replace(/A/g,'a')
    : t.replace(/A/g,'â');
}
function vow(fa){ return S.vowels ? fa : fa.replace(/[ً-ْٰ]/g,''); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function onLine(html, cls){ return '<span class="ln"><span class="fa '+(cls||'')+'">'+html+'</span><i class="bm"></i><b class="bl"></b></span>'; }
function placeLines(){
  Array.prototype.forEach.call(app.querySelectorAll('.ln'), function(el){
    var m = el.querySelector('.bm'), l = el.querySelector('.bl');
    if (m && l) l.style.top = (m.offsetTop - 0.75) + 'px';
  });
}
function shuffle(a){ a = a.slice(); for (var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function pickN(a, n){ return shuffle(a).slice(0, n); }

/* =========================================================
   SCHEDULER (simple SM-2 style; kept separate from the UI)
   ========================================================= */
var DAY = 86400000;
function card(id){ return S.cards[id] || (S.cards[id] = { due:Date.now(), ivl:0, ease:2.5, reps:0, lapses:0 }); }
function rate(id, r){ // r: 0 didn't get it, 2 got it
  var c = card(id), now = Date.now();
  if (r === 0){ c.reps = 0; c.lapses++; c.ivl = 0; c.ease = Math.max(1.3, c.ease - 0.2); c.due = now + 60*1000; }
  else {
    if (c.reps === 0) c.ivl = 1; else if (c.reps === 1) c.ivl = 3; else c.ivl = c.ivl * c.ease;
    c.reps++; c.due = now + c.ivl * DAY;
  }
  save();
}
function dueIds(){
  var now = Date.now();
  return Object.keys(S.cards).filter(function(id){ return S.cards[id].due <= now && itemFor(id); });
}

/* =========================================================
   WORDS (Phase 2)
   Card ids: vocab word = its id (Farsi → English); id + ':r' = English → Farsi
   ========================================================= */
var BACKLOG = 50;       // more reviews than this: new words pause
var SESSION_NEW = 10;   // new words per session
function todayKey(){ return new Date().toDateString(); }
function newDoneToday(){ return S.newLog && S.newLog.date === todayKey() ? S.newLog.n : 0; }
function newLeft(){ return Math.max(0, S.newPerDay - newDoneToday()); }
function countNew(){ if (S.newLog.date !== todayKey()) S.newLog = { date:todayKey(), n:0 }; S.newLog.n++; }
function wordsOpen(){ return S.unlockAll || isDone(LESSONS[5]); }
function vocabById(id){ return VBY[id] || S.myWords.filter(function(w){ return w.id === id; })[0]; }
/* New items in order: your own words, then each theme's words followed by the phrases that build on it */
function newOrder(){
  var out = S.myWords.slice();
  THEMES.forEach(function(T){
    out = out.concat(T.words);
    PHRASESETS.forEach(function(Ps){ if (Ps.after === T.id) out = out.concat(Ps.phrases); });
  });
  return out;
}
function unseenVocab(){ return newOrder().filter(function(W){ return !S.cards[W.id]; }); }

/* Farsi text helpers for phrases and fill-in-the-blank cards */
var PUNCT = /[\u060C\u061B\u061F!.,?:«»]+/g;
function normFa(t){
  return t.replace(/[\u064B-\u0652\u0670\u0640\u200C]/g,'').replace(/\u064A/g,'\u06CC').replace(/\u0643/g,'\u06A9').replace(PUNCT,'').trim();
}
function stripVow(t){ return t.replace(/[\u064B-\u0652\u0670]/g,''); }
function knownWell(id){ var c = S.cards[id]; return S.fade && c && c.reps >= 3; }
function faFront(W, id){ return knownWell(id) ? stripVow(W.fa) : vow(W.fa); }   // vowel marks fade on well-known cards
/* First phrase that uses a given single word: shown as an example on the word's card */
var EXAMPLE = {};
VOCAB.forEach(function(W){
  if (W.fa.indexOf(' ') >= 0) return;
  var n = normFa(W.fa);
  for (var i = 0; i < PHRASES.length; i++){
    if (PHRASES[i].fa.split(' ').some(function(t){ return normFa(t) === n; })){ EXAMPLE[W.id] = PHRASES[i]; break; }
  }
});
function exampleLine(W){
  var P = EXAMPLE[W.id]; if (!P) return '';
  return '<div class="exline">'+fi(vow(P.fa))+'<br>'+esc(P.en)+'</div>';
}
/* Fill-in-the-blank card from a phrase */
function makeCloze(P){
  var toks = P.fa.split(' '), g = normFa(P.gap), idx = -1;
  toks.forEach(function(t, i){ if (idx < 0 && normFa(t) === g) idx = i; });
  if (idx < 0) return null;
  var tail = (toks[idx].match(/[\u060C\u061B\u061F!.]+$/) || [''])[0];
  var answer = toks[idx].slice(0, toks[idx].length - tail.length);
  var inSentence = toks.map(normFa);
  var Ps = PHRASESETS.filter(function(x){ return x.id === P.set; })[0];
  var pool = VOCAB.filter(function(W){ return W.fa.indexOf(' ') < 0 && normFa(W.fa) !== g && inSentence.indexOf(normFa(W.fa)) < 0; });
  var near = pool.filter(function(W){ return Ps && W.theme === Ps.after; });
  var seen = {}, opts = [];
  pickN(near, 3).concat(pickN(pool, 6)).forEach(function(W){ var k = normFa(W.fa); if (!seen[k] && opts.length < 3){ seen[k] = 1; opts.push(W.fa); } });
  opts = shuffle(opts.concat(answer));
  var q = { keys:[], labels:{}, correct:null, P:P };
  opts.forEach(function(o, i){ var k = 'o'+i; q.keys.push(k); q.labels[k] = '<span class="fa">'+vow(o)+'</span>'; if (o === answer) q.correct = k; });
  q.before = toks.slice(0, idx).join(' '); q.after = toks.slice(idx + 1).join(' '); q.tail = tail; q.answer = answer;
  return q;
}
function backlogged(){ return dueIds().length > BACKLOG; }
function canPractise(id){ var Ls = lessonOfTheme(id); return id === 'mine' || S.unlockAll || (Ls && isDone(Ls)); }
function learnedIn(list){ return list.filter(function(W){ return S.cards[W.id]; }).length; }
function allPhrasesSeen(){ return learnedIn(PHRASES); }

/* =========================================================
   PROGRESS
   ========================================================= */
function isDone(Ls){ return !!S.done[Ls.id]; }
function isOpen(Ls){ return S.unlockAll || Ls.n === 0 || isDone(LESSONS[Ls.n - 1]); }
function nextLesson(){ for (var i = 0; i < LESSONS.length; i++) if (!isDone(LESSONS[i])) return LESSONS[i]; return null; }
function lettersLearned(){
  var n = 0; LESSONS.forEach(function(Ls){ if (isDone(Ls)) Ls.items.forEach(function(id){ if (!BY[id].kind) n++; }); }); return n;
}
function knownBefore(Ls){ var k = []; LESSONS.forEach(function(x){ if (x.n < Ls.n) k = k.concat(x.items); }); return k; }

/* =========================================================
   RENDER
   ========================================================= */
var app = document.getElementById('app');
var view = { name:'home' };
function go(v){ view = v; render(); }
var lastRender = 0;
var lastView = null;
function render(){
  // keep the scroll position when the same screen re-draws (e.g. toggling a setting)
  var keep = [];
  if (lastView === view.name) Array.prototype.forEach.call(app.querySelectorAll('.plain, .lessons'), function(el){ keep.push(el.scrollTop); });
  app.innerHTML = VIEWS[view.name](view); lastRender = Date.now(); lastView = view.name; bind(); placeLines();
  if (keep.length) Array.prototype.forEach.call(app.querySelectorAll('.plain, .lessons'), function(el, i){ if (keep[i] != null) el.scrollTop = keep[i]; });
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeLines);
window.addEventListener('resize', placeLines);
function bind(){
  Array.prototype.forEach.call(app.querySelectorAll('[data-act]'), function(el){
    el.addEventListener('click', function(e){ e.stopPropagation(); if (Date.now() - lastRender < 350) return; ACT[el.getAttribute('data-act')](el.getAttribute('data-arg')); });
  });
}
var LEFT_ACT = { 'Close':'home', 'Back':'home', 'Lessons':'lessons' };
function bar(left, right, frac){
  return '<div class="top"><button class="left" data-act="'+(LEFT_ACT[left]||'noop')+'">'+(left||'')+'</button>' +
         '<button class="right" data-act="'+(right==='Settings'?'settings':'noop')+'">'+(right||'')+'</button></div>' +
         (frac != null ? '<div class="progress"><i style="width:'+Math.round(frac*100)+'%"></i></div>' : '');
}
function lessonGlyphs(Ls){
  if (Ls.items.length) return Ls.items.map(function(id){ return glyph(BY[id]); }).join(' ');
  if (Ls.T) return Ls.T.words.slice(0, 3).map(function(W){ return stripVow(W.fa); }).join(' · ');
  return 'سلام';
}
/* {translit} in course text → shown with the chosen transliteration scheme */
function gx(t){ return String(t).replace(/\{([^}]+)\}/g, function(m, x){ return '<i>'+esc(tr(x))+'</i>'; }); }
/* Text-to-speech, if the device has a Persian voice (Settings → Test Persian voice) */
function faVoice(){
  try { var vs = speechSynthesis.getVoices(); return vs.filter(function(v){ return v.voiceURI === S.voice; })[0] || vs.filter(function(v){ return /^fa/i.test(v.lang); })[0] || null; } catch(e){ return null; }
}
function speak(text){
  try { var u = new SpeechSynthesisUtterance(text.replace(/…/g, '')); var v = faVoice(); if (v) u.voice = v; u.lang = 'fa-IR'; u.rate = 0.85; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch(e){}
}
function playBtn(fa){ return S.voice ? '<button class="play" data-act="speak" data-arg="'+encodeURIComponent(stripVow(fa))+'">▶</button>' : ''; }

var VIEWS = {
  home: function(){
    var due = dueIds().length, nx = nextLesson(), btns = [], lines = [];
    var cont = nx ? '<button class="b" data-act="lesson" data-arg="'+nx.id+'">Continue · Lesson '+nx.n+'</button>' : '';
    var rev = due ? '<button class="b" data-act="review">Review · '+due+'</button>' : '';
    if (backlogged()){ lines.push('Over '+BACKLOG+' cards due: review first.'); btns = [rev, cont]; }
    else btns = [cont, rev];
    btns = btns.filter(Boolean);
    if (btns.length) btns[0] = btns[0].replace('class="b"', 'class="b dark"');
    else btns.push('<button class="b off" disabled>All done for now</button>');
    var main = nx
      ? '<div class="kicker">Lesson '+nx.n+'</div><div class="h1">'+nx.title+'</div><div class="fa home-letters">'+lessonGlyphs(nx)+'</div>'
      : '<div class="big-num">'+due+'</div><div class="home-sub">'+(due===1?'card':'cards')+' to review</div>';
    main += '<div class="home-stats">'+lettersLearned()+' / 32 letters &nbsp;·&nbsp; '+learnedIn(VOCAB.concat(S.myWords))+' words &nbsp;·&nbsp; '+allPhrasesSeen()+' phrases</div>' +
      (nx && due ? '<div class="home-note">'+due+' '+(due===1?'card':'cards')+' to review</div>' : '') +
      lines.map(function(l){ return '<div class="home-note">'+l+'</div>'; }).join('');
    return '<div class="top"><div><button class="left" data-act="lessons">Lessons</button><button class="left" style="margin-left:18px" data-act="words">Words</button></div>' +
           '<button class="right" data-act="settings">Settings</button></div>' +
      '<div class="plain">'+main+'</div><div class="btns">'+btns.join('')+'</div>';
  },

  words: function(){
    var rows = THEMES.map(function(T){
      return '<div class="lrow" data-act="theme" data-arg="'+T.id+'"><div class="ln-t"><div>'+T.title+' <span class="muted-s">· Lesson '+lessonOfTheme(T.id).n+'</span></div>' +
        '<div class="fa ln-g" style="letter-spacing:0">'+T.words.slice(0,3).map(function(W){ return vow(W.fa); }).join('  ·  ')+'</div></div>' +
        '<div class="ln-s">'+learnedIn(T.words)+' / '+T.words.length+'</div></div>';
    }).join('');
    var mine = '<div class="lrow" data-act="theme" data-arg="mine"><div class="ln-t"><div>My words</div>' +
      '<div class="muted-s">'+(S.myWords.length ? S.myWords.length+' added' : 'Add your own words')+'</div></div><div class="ln-s">›</div></div>';
    var prow = PHRASESETS.map(function(Ps){
      var T = THEMES.filter(function(x){ return x.id === Ps.after; })[0];
      return '<div class="lrow" data-act="theme" data-arg="'+Ps.id+'"><div class="ln-t"><div>'+Ps.title+'</div>' +
        '<div class="muted-s">Lesson '+lessonOfTheme(Ps.id).n+'</div></div>' +
        '<div class="ln-s">'+learnedIn(Ps.phrases)+' / '+Ps.phrases.length+'</div></div>';
    }).join('');
    var tips = '<div class="lrow" data-act="spoken"><div class="ln-t"><div>Spoken Tehran</div><div class="muted-s">How everyday speech differs from writing</div></div><div class="ln-s">›</div></div>';
    return bar('Back', '') +
      '<div class="h1" style="margin:10px 0 6px">Words</div>' +
      '<div class="home-sub" style="margin:0 0 10px">Everything you\'ll learn, by theme. New words and phrases arrive through lessons; your own words go straight into reviews.</div>' +
      '<div class="lessons">'+mine+rows+'<div class="sect">Phrases</div>'+tips+prow+'</div>';
  },

  theme: function(v){
    var mine = v.id === 'mine', Ps = PHRASESETS.filter(function(x){ return x.id === v.id; })[0];
    var T = mine ? { title:'My words', words:S.myWords } : Ps ? { title:Ps.title, words:Ps.phrases } : THEMES.filter(function(x){ return x.id === v.id; })[0];
    var rows = T.words.map(function(W){
      var c = S.cards[W.id], st = c ? (c.reps >= 2 ? '●' : '◐') : '○';
      return '<div class="wrow"'+(mine ? ' data-act="editword" data-arg="'+W.id+'"' : '')+'><span class="st">'+st+'</span>' +
        '<span class="wt"><b>'+esc(tr(W.tr))+'</b> · '+esc(W.en)+'</span><span class="fa">'+vow(W.fa)+'</span></div>';
    }).join('') || '<div class="home-sub" style="margin-top:20px">No words yet.</div>';
    return '<div class="top"><button class="left" data-act="words">Back</button><button class="right" data-act="'+(mine?'addword':'noop')+'">'+(mine?'+ Add':'')+'</button></div>' +
      '<div class="h1" style="margin:10px 0 4px">'+esc(T.title)+'</div>' +
      '<div class="home-sub" style="margin:0 0 8px">○ new &nbsp; ◐ learning &nbsp; ● known</div>' +
      '<div class="lessons">'+rows+'</div>' +
      (canPractise(v.id) && T.words.length ? '<div class="btns" style="margin-top:12px"><button class="b dark" data-act="trytheme" data-arg="'+v.id+'">Practise all '+T.words.length+(Ps ? ' phrases' : ' words')+'</button></div>' : '');
  },

  spoken: function(){
    var rows = SPOKEN_TIPS.map(function(t){
      return '<div class="tip"><div class="tip-r">'+t.rule+'</div>' +
        '<div class="tip-e"><span>'+fi(vow(t.ex[0][0]))+' <i>'+esc(tr(t.ex[0][1]))+'</i></span><span class="arr">→</span><span>'+fi(t.ex[1][0])+' <i>'+esc(tr(t.ex[1][1]))+'</i></span></div></div>';
    }).join('');
    return '<div class="top"><button class="left" data-act="words">Back</button><button class="right"></button></div>' +
      '<div class="h1" style="margin:10px 0 4px">Spoken Tehran</div>' +
      '<div class="home-sub" style="margin:0 0 10px;text-align:left">Written Persian is the same everywhere. Everyday speech in Tehran shortens it in a few regular ways. Cards show the spoken form under "Spoken in Tehran".</div>' +
      '<div class="lessons">'+rows+'</div>';
  },

  wordform: function(v){
    var W = v.id ? vocabById(v.id) : { fa:'', tr:'', en:'' };
    return '<div class="top"><button class="left" data-act="theme" data-arg="mine">Cancel</button><button class="right"></button></div>' +
      '<div class="h1" style="margin:10px 0 14px">'+(v.id ? 'Edit word' : 'Add a word')+'</div>' +
      '<div class="form-f"><label>Farsi</label><input id="f-fa" dir="rtl" class="fa-in" autocomplete="off" autocorrect="off" spellcheck="false" value="'+esc(W.fa)+'"></div>' +
      '<div class="form-f"><label>Transliteration</label><input id="f-tr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="e.g. ketâb" value="'+esc(tr(W.tr))+'"></div>' +
      '<div class="form-f"><label>English</label><input id="f-en" autocomplete="off" value="'+esc(W.en)+'"></div>' +
      '<div class="home-note" id="f-msg" style="text-align:left"></div>' +
      '<div style="flex:1"></div>' +
      '<div class="btns">' + (v.id ? '<button class="b" data-act="delword" data-arg="'+v.id+'">'+(v.confirm ? 'Tap again to delete' : 'Delete')+'</button>' : '') +
      '<button class="b dark" data-act="saveword" data-arg="'+(v.id||'')+'">Save</button></div>';
  },

  lessons: function(){
    var rows = LESSONS.map(function(Ls){
      var open = isOpen(Ls), done = isDone(Ls);
      var status = done ? '✓' : (open ? 'Start' : '');
      return '<div class="lrow'+(open?'':' locked')+'"'+(open?' data-act="lesson" data-arg="'+Ls.id+'"':'')+'>' +
        '<div class="ln-n">'+Ls.n+'</div>' +
        '<div class="ln-t"><div>'+Ls.title+'</div><div class="fa ln-g"'+(Ls.items.length ? '' : ' style="letter-spacing:0"')+'>'+lessonGlyphs(Ls)+'</div></div>' +
        '<div class="ln-s">'+status+'</div></div>';
    }).join('');
    return bar('Back', '') +
      '<div class="h1" style="margin:10px 0 6px">Lessons</div>' +
      '<div class="home-sub" style="margin:0 0 10px">'+lettersLearned()+' of 32 letters learned</div>' +
      '<div class="lessons">'+rows+'</div>';
  },

  // ---- lesson: introduce one letter or vowel mark ----
  intro: function(v){
    var L = BY[v.id], total = LESSON.steps, help = '', top, row = '', exRows = L.exs || [];
    if (L.kind === 'num'){
      top = onLine(L.ch, 'letter intro');
      exRows = [ { pos:'word', fa:L.word, tr:'', en:'' } ];
      if (L.spoken) exRows.push({ pos:'spoken', fa:'', tr:L.spoken, en:'in Tehran' });
      if (L.arabic) exRows.push({ pos:'also seen', fa:L.arabic, tr:'', en:'Arabic-style digit' });
    } else if (L.kind === 'mark' || L.kind === 'extra'){
      if (L.kind === 'mark' && !S.seen.marks) help = 'Short vowels are small marks above or below a letter. Normal Persian writing leaves them out; this app shows them until you turn them off in Settings.';
      top = onLine(L.show, 'letter intro');
      if (L.row) row = '<div class="forms syl">' + L.row.map(function(s){ return '<div>'+onLine(s[0])+'<small>'+(s[2] != null ? s[2] : esc(tr(s[1])))+'</small></div>'; }).join('') + '</div>';
    } else {
      if (!S.seen.forms) help = 'Letters change shape by position. Tap a shape to see how it\'s written.';
      else if (!L.joins && !S.seen.nj) help = 'Doesn\'t join to the next letter, so a small gap follows it.';
      if (!help && !S.seen.write) help = 'Tap a shape to see how it\'s written.';
      top = onLine(L.ch, 'letter intro');
      row = '<div class="forms">' + L.forms.map(function(f,k){ return '<div class="form" data-act="write" data-arg="'+k+'">'+onLine(f)+'<small>'+POS[k]+'</small></div>'; }).join('') + '</div>';
    }
    var exs = exRows.map(function(e){
      var t = [e.tr ? esc(tr(e.tr)) : '', e.en || ''].filter(Boolean).join(' · ');
      return '<div class="ex"><span class="pos">'+(e.pos||'')+'</span><span class="t">'+t+'</span><span class="fa">'+vow(e.fa||'')+'</span></div>';
    }).join('');
    return bar('Close', '', v.step/total) +
      '<div class="card">' + top +
        '<div class="sound">'+esc(say(L))+'</div>' +
        '<div class="meta">'+esc(tr(L.name))+'</div>' + row +
        '<div class="exs">'+exs+'</div>' +
        ((L.note || help) ? '<div class="notebox">' + (L.note ? '<div>'+L.note+'</div>' : '') + (help ? '<div>'+help+'</div>' : '') + '</div>' : '') +
      '</div>' +
      '<div class="btns"><button class="b dark" data-act="next">Next</button></div>' +
      (v.write != null ? writeSheet(L, v.write) : '');
  },

  // ---- lesson: quiz (two kinds) ----
  quiz: function(v){
    var q = v.q, L = BY[q.id], prompt, answered = '';
    var choices = q.keys.map(function(k){
      var cls = v.marks[k] || '', dis = v.answered || v.marks[k];
      return '<button class="b '+cls+(q.type==='pick'?' glyphb':'')+(q.type==='read'?' readb':'')+'" data-act="pick" data-arg="'+k+'"'+(dis?' disabled':'')+'>'+q.labels[k]+'</button>';
    }).join('');
    if (q.type === 'read'){
      prompt = onLine(vow(q.glyph), 'word') +
               '<div class="meta">'+(v.answered ? esc(tr(q.word.tr))+' · '+q.word.en : 'How is it read?')+'</div>';
    } else if (q.type === 'pick'){
      prompt = '<div class="big-sound">'+esc(say(L))+'</div><div class="meta">'+esc(tr(L.name))+'</div>' +
               '<div class="meta" style="margin-top:14px">'+(v.answered ? '' : 'Which letter?')+'</div>';
    } else {
      var isWord = q.glyph.length > 3;
      prompt = onLine(q.glyph, isWord ? 'word' : 'letter') +
               '<div class="meta">'+(v.answered ? esc(tr(L.name)) + (L.kind ? '' : ' · '+POS[q.form]) : (L.kind === 'num' ? 'Which number?' : 'Which sound?'))+'</div>';
    }
    return bar('Close', '', v.step/LESSON.steps) +
      '<div class="card">'+prompt+'</div>' +
      '<div class="choices">'+choices+'</div>' +
      '<div class="btns" style="margin-top:10px"><button class="b '+(v.answered?'dark':'off')+'" data-act="next"'+(v.answered?'':' disabled')+'>Continue</button></div>';
  },

  // ---- flashcard (lesson words + review) ----
  flash: function(v){
    var it = v.item, front, back = '';
    if (it.kind === 'letter'){
      front = onLine(glyph(it.L), 'letter');
      if (v.revealed) back = '<div class="sound">'+esc(say(it.L))+'</div><div class="meta">'+esc(tr(it.L.name))+'</div>';
    } else if (it.kind === 'vocab' && it.rev){
      var V = it.W;
      front = '<div class="big-en">'+esc(V.en)+'</div>' + (v.revealed ? '' : '<div class="meta">In Farsi?</div>');
      if (v.revealed){
        back = onLine(vow(V.fa), 'word') + '<div class="sound">'+esc(tr(V.tr))+'</div>';
        if (V.spoken) back += '<div class="note">Spoken in Tehran: '+fi(V.spokenFa)+' '+esc(tr(V.spoken))+'</div>';
        back += exampleLine(V);
      }
    } else if (it.kind === 'read'){
      var R = it.W;
      front = '<div class="fa phrase mv">'+faFront(R, it.id)+'</div><div class="meta" style="margin-top:12px">'+esc(R.en)+'</div>' +
        (!v.revealed && !S.seen.readit ? '<div class="notebox" style="margin-top:18px">Read it aloud, then tap to check the pronunciation.</div>' : '');
      if (v.revealed){
        back = '<div class="ptr" style="margin-top:14px">'+esc(tr(R.tr))+' '+playBtn(R.fa)+'</div>';
        if (R.spoken) back += '<div class="note">Spoken in Tehran: '+fi(R.spokenFa)+'<br>'+esc(tr(R.spoken))+'</div>';
      }
    } else if (it.kind === 'say'){
      var X = it.W;
      front = '<div class="big-tr mv">'+esc(tr(X.tr))+'</div>' + (v.revealed ? '' : '<div class="meta">Meaning?</div>');
      if (v.revealed){
        back = '<div class="meta" style="font-size:22px;color:#000;margin-top:10px">'+esc(X.en)+'</div><div class="say-fa">'+fi(vow(X.fa))+' '+playBtn(X.fa)+'</div>';
        if (X.spoken) back += '<div class="note">Spoken: '+fi(X.spokenFa)+' '+esc(tr(X.spoken))+'</div>';
      }
    } else if (it.kind === 'phrase'){
      var P = it.W;
      front = '<div class="fa phrase mv">'+faFront(P, it.id)+'</div>';
      if (v.revealed){
        back = '<div class="ptr">'+esc(tr(P.tr))+' '+playBtn(P.fa)+'</div><div class="meta">'+esc(P.en)+'</div>';
        if (P.spoken) back += '<div class="note">Spoken in Tehran: '+fi(P.spokenFa)+'<br>'+esc(tr(P.spoken))+'</div>';
      }
    } else {
      var W = it.W;
      front = onLine(faFront(W, it.id), 'word');
      if (v.revealed){
        back = '<div class="sound">'+esc(tr(W.tr))+' '+playBtn(W.fa)+'</div><div class="meta">'+W.en+'</div>';
        if (W.spoken) back += '<div class="note">Spoken in Tehran: '+fi(W.spokenFa)+' '+esc(tr(W.spoken))+'</div>';
        if (it.kind === 'vocab') back += exampleLine(W);
      }
    }
    var frac = v.total ? v.done / v.total : null;
    var btns = v.revealed
      ? '<div class="row"><button class="b" data-act="rate" data-arg="0">Didn\'t get it</button>' +
        '<button class="b dark" data-act="rate" data-arg="2">Got it</button></div>'
      : '<button class="b dark" data-act="reveal">Show</button>';
    return bar('Close', '', frac) +
      '<div class="card tap" data-act="reveal">' + (v.mode === 'new' && !S.cards[it.id] ? '<div class="tag">New</div>' : '') + front + (back ? '<div class="reveal-in">'+back+'</div>' : '') +
        (!v.revealed && !S.seen.tap && it.kind !== 'read' ? '<div class="hint">Try to read it, then tap.</div>' : '') +
      '</div>' +
      '<div class="btns">'+btns+'</div>';
  },

  // ---- generic multiple choice (meaning, spot the letter, fill the blank, grammar) ----
  mc: function(v){
    var q = v.q;
    var choices = q.keys.map(function(k){
      var cls = v.marks[k] || '', dis = v.answered || v.marks[k];
      return '<button class="b '+cls+' '+(q.cls||'')+'" data-act="mcpick" data-arg="'+k+'"'+(dis?' disabled':'')+'>'+q.labels[k]+'</button>';
    }).join('');
    var frac = v.mode === 'lesson' ? v.step / LESSON.steps : (v.total ? v.done / v.total : null);
    return bar('Close', '', frac) +
      '<div class="card">' + (v.answered && q.promptDone ? q.promptDone : q.prompt) + '</div>' +
      '<div class="choices">'+choices+'</div>' +
      '<div class="btns" style="margin-top:10px"><button class="b '+(v.answered?'dark':'off')+'" data-act="mcnext"'+(v.answered?'':' disabled')+'>Continue</button></div>';
  },

  // ---- Say it: a spoken phrase, from transliteration ----
  sayc: function(v){
    var X = SAYBY[v.id], first = !S.seen.say;
    return bar('Close', '', v.step / LESSON.steps) +
      '<div class="card">' +
        '<div class="kicker">Say it</div>' +
        '<div class="big-tr">'+esc(tr(X.tr))+'</div>' +
        '<div class="meta" style="margin-top:10px">'+esc(X.en)+'</div>' +
        '<div class="say-fa">'+fi(vow(X.fa))+' '+playBtn(X.fa)+'</div>' +
        (X.spoken ? '<div class="note">Spoken: '+fi(X.spokenFa)+' '+esc(tr(X.spoken))+'</div>' : '') +
        (first ? '<div class="notebox">Learn it from the transliteration. You don\'t need to read the Farsi yet; you\'ll be able to soon.</div>' : '') +
      '</div>' +
      '<div class="btns"><button class="b dark" data-act="next">Next</button></div>';
  },

  // ---- Grammar card ----
  gram: function(v){
    var g = GBY[v.g];
    var ex = g.ex.map(function(e){ return '<div class="ex"><span class="t">'+gx(e[1])+' · '+esc(e[2])+'</span><span></span><span class="fa">'+vow(e[0])+'</span></div>'; }).join('');
    return bar('Close', '', v.step / LESSON.steps) +
      '<div class="card" style="text-align:left;align-items:stretch">' +
        '<div class="kicker">Grammar</div>' +
        '<div class="gtitle">'+esc(g.title)+'</div>' +
        '<div class="gbody">'+gx(g.body)+'</div>' +
        (ex ? '<div class="exs gex">'+ex+'</div>' : '') +
      '</div>' +
      '<div class="btns"><button class="b dark" data-act="next">Next</button></div>';
  },

  done: function(v){
    return bar('', '') +
      '<div class="plain"><div class="h1">'+(v.title||'Done')+'</div><div class="home-sub">'+(v.sub||'')+'</div></div>' +
      '<div class="btns"><button class="b dark" data-act="home">Finish</button></div>';
  },

  restore: function(v){
    return bar('Back', '') +
      '<div class="h1" style="margin:10px 0 8px">Restore backup</div>' +
      '<div class="home-sub" style="margin:0 0 10px;text-align:left">Paste a backup copied from this app. It replaces the progress on this device.</div>' +
      '<textarea id="bk-in" class="bk" style="flex:1" placeholder="Paste here"></textarea>' +
      '<div class="home-note" id="bk-err" style="text-align:left"></div>' +
      '<div class="btns" style="margin-top:10px"><button class="b dark" data-act="restore">Restore</button></div>';
  },

  settings: function(){
    function on(c){ return c ? ' on' : ''; }
    return bar('Back', '') +
      '<div class="plain" style="justify-content:flex-start;overflow-y:auto"><div class="set">' +
        '<div class="h1" style="margin-top:8px">Settings</div>' +
        '<h3>Transliteration</h3>' +
        '<div class="row"><button class="b'+on(S.scheme==='default')+'" data-act="scheme" data-arg="default">â / a</button>' +
        '<button class="b'+on(S.scheme==='finnish')+'" data-act="scheme" data-arg="finnish">a / ä</button></div>' +
        '<div class="preview">'+fi('آب')+' '+tr('Ab')+' &nbsp;·&nbsp; '+fi('مَرد')+' '+tr('mard')+'</div>' +
        '<h3>Vowel marks</h3>' +
        '<div class="row"><button class="b'+on(S.vowels)+'" data-act="vowels" data-arg="1">Show</button>' +
        '<button class="b'+on(!S.vowels)+'" data-act="vowels" data-arg="0">Hide</button></div>' +
        '<div class="preview">'+fi(vow('مادَر'))+'</div>' +
        '<div class="row" style="margin-top:10px"><button class="b'+on(S.fade)+'" data-act="fade">'+(S.fade ? 'Fading on known cards' : 'Fade on known cards: off')+'</button></div>' +
        '<div class="preview">Vowel marks disappear from cards you\'ve got right three times in a row.</div>' +
        '<h3>Audio</h3>' +
        '<div class="row"><button class="b" data-act="voicetest">Test Persian voice</button></div>' +
        '<div class="preview" id="v-msg">'+(S.voice ? 'A Persian voice is on: cards show ▶.' : 'Checks whether this iPhone can speak Persian.')+'</div>' +
        '<h3>Backup</h3>' +
        '<div class="row"><button class="b" data-act="backup">Copy backup</button><button class="b" data-act="restoreview">Restore</button></div>' +
        '<div class="preview" id="bk-msg">Copies all progress and your own words as text you can paste into Notes.</div>' +
        '<textarea id="bk-out" class="bk" readonly style="display:none"></textarea>' +
        '<h3>Demo</h3>' +
        '<div class="row"><button class="b'+on(S.unlockAll)+'" data-act="unlock">'+(S.unlockAll?'All lessons unlocked':'Unlock all lessons')+'</button></div>' +
        '<h3>Progress</h3>' +
        '<div class="row"><button class="b" data-act="reset">Start over</button></div>' +
        '<div class="preview">Demo version: progress may not be kept after closing the app.</div>' +
      '</div></div>';
  }
};

/* =========================================================
   WRITING GUIDE
   ========================================================= */
function writeSheet(L, k){
  var parts = strokesFor(L, k) || [];
  function dotsOf(p){ return p.dots || (p.dot ? [p.dot] : null); }
  var svg = '<svg viewBox="0 0 300 220" id="wsvg">' +
    '<line x1="0" y1="130" x2="300" y2="130" stroke="#c8c8c8" stroke-width="1.5"/>' +
    parts.map(function(p){
      var ds = dotsOf(p);
      if (ds) return ds.map(function(d){ return '<circle cx="'+d[0]+'" cy="'+d[1]+'" r="8" fill="#e4e4e4"/>'; }).join('');
      return '<path d="'+p.d+'" fill="none" stroke="#e4e4e4" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>';
    }).join('') +
    parts.map(function(p, i){
      var ds = dotsOf(p);
      if (ds) return '<g class="ink" data-i="'+i+'" opacity="0">' + ds.map(function(d){ return '<circle cx="'+d[0]+'" cy="'+d[1]+'" r="8" fill="#000"/>'; }).join('') + '</g>';
      return '<path class="ink" data-i="'+i+'" data-at="'+(p.at || 0.5)+'" d="'+p.d+'" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>';
    }).join('') +
    '<g id="wmarks"></g><circle id="pen" r="7" fill="#fff" stroke="#000" stroke-width="3" opacity="0"/>' +
  '</svg>';
  var dotSteps = parts.filter(function(p){ return dotsOf(p); });
  var nDots = dotSteps.reduce(function(n, p){ return n + dotsOf(p).length; }, 0);
  var tips = ['Start at <b>1</b>, follow the arrow.'];
  if (k >= 2) tips.push('Right-hand line: joins from the previous letter.');
  if (L.joins && (k === 1 || k === 2)) tips.push('Left-hand line: joins to the next letter.');
  if (nDots) tips.push(nDots > 1 ? 'Dots last.' : 'Dot last.');
  if (parts.some(function(p){ return p.madda; })) tips.push('Stroke 2 (the hat, '+fi('آ')+') is only for the â sound.');
  return '<div class="sheet">' + bar('', '') +
    '<div class="card">' +
      '<div class="fa glyph">'+(L.id === 'alef' && k === 1 ? 'ا &nbsp; آ' : L.forms[k])+'</div>' +
      '<div class="meta">'+esc(tr(L.name))+' · '+POS[k]+'</div>' + svg +
      '<div class="steps">'+tips.join('<br>')+'</div>' +
      '<div class="wnav">' +
        '<button class="nav" data-act="wmove" data-arg="1"'+(k >= 3 ? ' disabled' : '')+'>&#8249;</button>' +
        '<div class="dots">'+[3,2,1,0].map(function(j){ return '<span class="'+(j===k?'on':'')+'">'+POS[j]+'</span>'; }).join('')+'</div>' +
        '<button class="nav" data-act="wmove" data-arg="-1"'+(k <= 0 ? ' disabled' : '')+'>&#8250;</button>' +
      '</div>' +
    '</div>' +
    '<div class="row"><button class="b" data-act="replay">Replay</button><button class="b dark" data-act="closewrite">Close</button></div>' +
  '</div>';
}
var animId = 0;
function animateWriting(){
  var svg = document.getElementById('wsvg'); if (!svg) return;
  var my = ++animId;
  var inks = Array.prototype.slice.call(svg.querySelectorAll('.ink'));
  var marks = svg.querySelector('#wmarks'), pen = svg.querySelector('#pen');
  marks.innerHTML = '';
  inks.forEach(function(el){
    if (el.tagName === 'path'){ var len = el.getTotalLength(); el.style.strokeDasharray = len; el.style.strokeDashoffset = len; }
    else el.setAttribute('opacity','0');
  });
  var NS = 'http://www.w3.org/2000/svg';
  function badge(x, y, num){
    var g = document.createElementNS(NS,'g');
    g.innerHTML = '<circle cx="'+x+'" cy="'+y+'" r="11" fill="#000"/><text x="'+x+'" y="'+(y+4.5)+'" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="-apple-system,Helvetica,Arial">'+num+'</text>';
    marks.appendChild(g);
  }
  function arrow(el){
    // open chevron ">" sitting on the stroke, pointing the way the pen moves
    var len = el.getTotalLength(), at = len * (+el.getAttribute('data-at') || 0.5);
    var a = el.getPointAtLength(Math.min(len, at + 6)), b = el.getPointAtLength(Math.max(0, at - 6));
    var ang = Math.atan2(a.y - b.y, a.x - b.x), arm = 15, spread = 0.75;
    var tip = { x: a.x + Math.cos(ang)*4, y: a.y + Math.sin(ang)*4 };
    var l = { x: tip.x - Math.cos(ang - spread)*arm, y: tip.y - Math.sin(ang - spread)*arm };
    var r = { x: tip.x - Math.cos(ang + spread)*arm, y: tip.y - Math.sin(ang + spread)*arm };
    var t = document.createElementNS(NS,'polyline');
    t.setAttribute('points', l.x+','+l.y+' '+tip.x+','+tip.y+' '+r.x+','+r.y);
    t.setAttribute('fill','none'); t.setAttribute('stroke','#000'); t.setAttribute('stroke-width','4');
    t.setAttribute('stroke-linecap','round'); t.setAttribute('stroke-linejoin','round');
    marks.appendChild(t);
  }
  var i = 0;
  function nextStroke(){
    if (my !== animId) return;
    if (i >= inks.length){ pen.setAttribute('opacity','0'); return; }
    var el = inks[i], num = i + 1; i++;
    if (el.tagName !== 'path'){
      var cs = el.querySelectorAll('circle'), minX = 999, cy = 0;
      Array.prototype.forEach.call(cs, function(c){ var x = +c.getAttribute('cx'); if (x < minX){ minX = x; cy = +c.getAttribute('cy'); } });
      pen.setAttribute('opacity','0');
      setTimeout(function(){ if (my !== animId) return; badge(minX - 24, cy, num); el.setAttribute('opacity','1'); setTimeout(nextStroke, 500); }, 250);
      return;
    }
    var len = el.getTotalLength(), p0 = el.getPointAtLength(0), dur = Math.max(900, len * 6), t0 = null;
    if (p0.y < 62) badge(p0.x + 22, p0.y + 4, num); else badge(p0.x, p0.y - 20, num);
    pen.setAttribute('opacity','1');
    function frame(ts){
      if (my !== animId) return;
      if (t0 === null) t0 = ts;
      var t = Math.min(1, (ts - t0) / dur), e = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2;
      el.style.strokeDashoffset = len * (1 - e);
      var pt = el.getPointAtLength(len * e); pen.setAttribute('cx', pt.x); pen.setAttribute('cy', pt.y);
      if (t < 1) requestAnimationFrame(frame);
      else { arrow(el); setTimeout(nextStroke, 350); }
    }
    requestAnimationFrame(frame);
  }
  setTimeout(nextStroke, 300);
}

/* =========================================================
   LESSON FLOW
   For each group: introduce letters → quiz them (plus earlier ones) → next group.
   Then read the lesson's words.
   ========================================================= */
var LESSON = null;
function quizStep(type, id, pool){ return { t:'quiz', type:type, id:id, pool:pool }; }
function hasLookalike(id, pool){
  var L = BY[id]; if (!L.fam) return false;
  return pool.some(function(o){ return o !== id && BY[o].fam === L.fam && !BY[o].kind; });
}
function typeFor(id, pool, second){
  if (BY[id].quizWords) return 'read';
  return second && hasLookalike(id, pool) ? 'pick' : 'sound';
}
function buildLesson(Ls){
  var steps = [], prev = knownBefore(Ls), known = prev.slice(), inLesson = [];
  // 1. Say it: phrase cards, then "what does it mean?"
  Ls.say.forEach(function(id){ steps.push({ t:'say', id:id }); });
  shuffle(Ls.say).forEach(function(id){ steps.push({ t:'sayq', id:id }); });
  // 2–3. New letters / numbers, each group followed by a quiz
  if (Ls.items.length){
    var isNum = BY[Ls.items[0]].kind === 'num';
    var prevSame = prev.filter(function(id){ return (BY[id].kind === 'num') === isNum; });
    Ls.groups.forEach(function(g){
      g.forEach(function(id){ steps.push({ t:'intro', id:id }); });
      known = known.concat(g);
      var pool = known.slice(), qs = [];
      g.forEach(function(id){
        qs.push(quizStep(typeFor(id, pool, false), id, pool));
        qs.push(quizStep(typeFor(id, pool, true), id, pool));
      });
      pickN(inLesson, 3).forEach(function(id){ qs.push(quizStep(typeFor(id, pool, false), id, pool)); });
      pickN(prevSame, Ls.groups.length > 2 ? 1 : 2).forEach(function(id){ qs.push(quizStep(typeFor(id, pool, true), id, pool)); });
      inLesson = inLesson.concat(g);
      shuffle(qs).forEach(function(s){ steps.push(s); });
    });
  }
  // Number lessons: a few sums
  if (Ls.items.some(function(id){ return BY[id].kind === 'num'; })) for (var m = 0; m < 3; m++) steps.push({ t:'math', n:Ls.n });
  // 4. Spot the letters: which of these words contains …?
  var spotable = Ls.items.filter(function(id){ return !BY[id].kind; });
  pickN(spotable, 3).forEach(function(id){ steps.push({ t:'spot', id:id }); });
  // 5. Read: words using only letters learned so far
  var words = Ls.read ? WORDS.filter(function(W){ return W.lesson === Ls.read; }) : [];
  shuffle(words).forEach(function(W){ steps.push({ t:'word', W:W }); });
  // Read it: sentences you can now read, with English, pronunciation on tap
  var reads = Ls.n >= 1 ? readSteps(Ls, Ls.T ? 2 : 3) : [];
  reads.forEach(function(x){ steps.push(x); });
  // Theme lessons: new words, then phrases, then a few fill-in-the-blanks
  if (Ls.T) Ls.T.words.forEach(function(W){ steps.push({ t:'new', W:W }); });
  if (Ls.P){
    Ls.P.phrases.forEach(function(P){ steps.push({ t:'new', W:P }); });
    pickN(Ls.P.phrases.filter(function(P){ return P.gap; }), 3).forEach(function(P){ steps.push({ t:'clz', P:P }); });
  }
  // 6. Grammar card + practice
  if (Ls.g){
    steps.push({ t:'gram', g:Ls.g });
    GBY[Ls.g].pr.forEach(function(x, i){ steps.push({ t:'gq', g:Ls.g, i:i }); });
  }
  LESSON = { L:Ls, steps:steps.length, queue:steps, nWords:words.length, nReads:reads.length };
}
function soundKey(L){ return L.sound; }
/* Generic multiple-choice question: { prompt, promptDone, sub, subDone, keys, labels, correct, cls } */
function mcFrom(opts, correctIdx, labelFn){
  var order = shuffle(opts.map(function(o, i){ return i; })), q = { keys:[], labels:{} };
  order.forEach(function(i, n){ var k = 'o'+n; q.keys.push(k); q.labels[k] = labelFn(opts[i]); if (i === correctIdx) q.correct = k; });
  return q;
}
function sayQ(id){
  var S0 = SAYBY[id], others = shuffle(SAY.filter(function(x){ return x.en !== S0.en; })).slice(0, 3).map(function(x){ return x.en; });
  var q = mcFrom([S0.en].concat(others), 0, esc);
  q.prompt = '<div class="big-tr">'+esc(tr(S0.tr))+'</div><div class="meta" style="margin-top:12px">What does it mean?</div>';
  q.promptDone = '<div class="big-tr">'+esc(tr(S0.tr))+'</div><div class="meta" style="margin-top:10px">'+fi(vow(S0.fa))+'</div>';
  q.cls = 'readb';
  return q;
}
/* Words to use in "which of these contains …?": everyday words, reading words and letter examples */
var SPOTPOOL = (function(){
  var seen = {}, out = [];
  VOCAB.concat(WORDS).concat([].concat.apply([], LETTERS.map(function(L){ return L.exs || []; }))).forEach(function(W){
    if (!W.fa || /[۰-۹]/.test(W.fa)) return;
    var k = normFa(W.fa); if (seen[k]) return; seen[k] = 1; out.push(W);
  });
  return out;
})();
/* ---------- Read it: sentences you can read with the letters learned so far ---------- */
function lettersIn(fa){ return fa.replace(/[ً-ْٰـ‌،؛؟!.?:«»…\s]/g, '').replace(/[آأ]/g, 'ا').split(''); }
var KNOWN_AFTER = [];   // KNOWN_AFTER[n] = letters known after lesson n
(function(){
  var known = {};
  LESSONS.forEach(function(Ls){
    Ls.items.forEach(function(id){
      var L = BY[id];
      if (!L.kind) known[L.ch] = 1;
      if (id === 'hamze') ['ء','ئ','ؤ'].forEach(function(c){ known[c] = 1; });
    });
    var copy = {}; for (var k in known) copy[k] = 1; KNOWN_AFTER[Ls.n] = copy;
  });
})();
var READ_POOL = READS.concat(PHRASES).concat(SAY).filter(function(X){ return X.fa.trim().indexOf(' ') > 0; });
var READBY = {};
READ_POOL.forEach(function(X){
  READBY[X.id] = X;
  X.readAt = 99;
  for (var n = 0; n < LESSONS.length; n++){
    var K = KNOWN_AFTER[n];
    if (lettersIn(X.fa).every(function(c){ return K[c]; })){ X.readAt = n; break; }
  }
});
function readSteps(Ls, howMany){
  var cand = READ_POOL.filter(function(X){ return X.readAt <= Ls.n && !S.cards['rd:'+X.id]; });
  // newly readable first, then this lesson's phrases, then anything else still unread
  cand.sort(function(a, b){
    var sa = (a.readAt === Ls.n ? 0 : (Ls.P && a.set === Ls.P.id ? 1 : 2)), sb = (b.readAt === Ls.n ? 0 : (Ls.P && b.set === Ls.P.id ? 1 : 2));
    return sa - sb || Math.random() - 0.5;
  });
  return cand.slice(0, howMany).map(function(X){ return { t:'readit', X:X }; });
}

/* ---------- Number maths: sums in words, digits or mixed ---------- */
var LOOKALIKE_NUM = { 2:[3], 3:[2,30], 4:[6,40], 6:[4,60], 7:[8,70], 8:[7,80], 0:[5], 5:[0,50], 9:[90], 13:[30], 30:[3,13], 60:[6], 50:[5], 70:[7], 80:[8], 90:[9] };
function numItemsUpTo(n){ var out = []; LESSONS.forEach(function(Ls){ if (Ls.n <= n) Ls.items.forEach(function(id){ if (BY[id].kind === 'num') out.push(BY[id]); }); }); return out; }
function mathQ(lessonN){
  var pool = numItemsUpTo(lessonN), byV = {};
  pool.forEach(function(N){ byV[+N.sound] = N; });
  var newV = LESSONS[lessonN].items.filter(function(id){ return BY[id].kind === 'num'; }).map(function(id){ return +BY[id].sound; });
  var tens = newV.some(function(v){ return v >= 20; });
  var a, b, r, op, ok = false;
  for (var tries = 0; tries < 500 && !ok; tries++){
    op = Math.random() < 0.6 ? '+' : '-';
    var src = tens ? pool.filter(function(N){ return +N.sound % 10 === 0 && +N.sound >= 10; }) : pool;
    a = +pickN(src, 1)[0].sound; b = +pickN(src, 1)[0].sound;
    r = op === '+' ? a + b : a - b;
    ok = r >= 0 && byV[r] && !(a === 0 && b === 0) && (a + b + r > 0) &&
         [a, b, r].some(function(v){ return newV.indexOf(v) >= 0; });
  }
  if (!ok){ op = '+'; a = 1; b = 1; r = 2; }
  var A = byV[a], B = byV[b], R = byV[r];
  var style = pickN(['words','digits','mixed'], 1)[0];
  var ansStyle = style === 'words' ? 'digits' : style === 'digits' ? 'words' : pickN(['words','digits'], 1)[0];
  function show(N, st){ return st === 'words' ? vow(N.word) : N.ch; }
  var sa = style === 'mixed' ? 'words' : style, sb = style === 'mixed' ? 'digits' : style;
  if (style === 'mixed' && Math.random() < 0.5){ sa = 'digits'; sb = 'words'; }
  // close wrong answers: off by one or ten, look-alike digits and words
  var near = [r+1, r-1, r+10, r-10, r*10, r/10].concat(LOOKALIKE_NUM[r] || []);
  var wrong = [];
  shuffle(near).concat(shuffle(Object.keys(byV).map(Number))).forEach(function(v){
    if (wrong.length < 3 && byV[v] && v !== r && wrong.indexOf(v) < 0) wrong.push(v);
  });
  var q = mcFrom([r].concat(wrong), 0, function(v){ return '<span class="fa">'+show(byV[v], ansStyle)+'</span>'; });
  function line(done){
    return '<div class="math" dir="ltr"><span class="fa">'+show(A, sa)+'</span><span class="op">'+(op === '+' ? '+' : '−')+'</span><span class="fa">'+show(B, sb)+'</span><span class="op">=</span>' +
      (done ? '<span class="fa">'+show(R, ansStyle)+'</span>' : '<span class="qm">?</span>') + '</div>';
  }
  var said = op === '+' ? A.name+' o '+B.name+' mishe '+R.name : A.name+' menhA-ye '+B.name+' mishe '+R.name;
  q.prompt = line(false) + '<div class="meta" style="margin-top:14px">'+(ansStyle === 'words' ? 'Pick the answer in words' : 'Pick the answer in digits')+'</div>';
  q.promptDone = line(true) + '<div class="ptr reveal-in" style="margin-top:14px">'+esc(tr(said))+'</div>' +
    '<div class="meta reveal-in">'+a+' '+(op === '+' ? 'plus' : 'minus')+' '+b+' makes '+r+'</div>';
  q.cls = ansStyle === 'words' ? 'clozeb' : 'clozeb numb';
  return q;
}
function letterChars(L){ return L.id === 'alef' ? ['ا','آ'] : L.id === 'ye' ? ['ی'] : [L.ch]; }
function spotQ(id){
  var L = BY[id], chars = letterChars(L);
  var has = function(W){ var n = normFa(W.fa); return chars.some(function(c){ return n.indexOf(c) >= 0; }); };
  var famChars = LETTERS.filter(function(o){ return o.fam && o.fam === L.fam && o.id !== L.id && !o.kind; }).map(function(o){ return o.ch; });
  var yes = SPOTPOOL.filter(has), no = SPOTPOOL.filter(function(W){ return !has(W); });
  var tricky = no.filter(function(W){ var n = normFa(W.fa); return famChars.some(function(c){ return n.indexOf(c) >= 0; }); });
  var right = pickN(yes, 1)[0], wrong = pickN(tricky, 2);
  pickN(no, 6).forEach(function(W){ if (wrong.length < 3 && wrong.indexOf(W) < 0) wrong.push(W); });
  var q = mcFrom([right].concat(wrong), 0, function(W){ return '<span class="fa">'+vow(W.fa)+'</span>'; });
  q.prompt = onLine(L.ch, 'letter') + '<div class="meta">Which word contains '+fi(L.ch)+'?</div>';
  q.promptDone = onLine(L.ch, 'letter') + '<div class="meta">'+fi(vow(right.fa))+' '+esc(tr(right.tr))+' · '+esc(right.en)+'</div>';
  q.cls = 'clozeb';
  return q;
}
function gramQ(gid, i){
  var g = GBY[gid], pr = g.pr[i];
  var q = mcFrom(pr.o, 0, gx);
  q.prompt = '<div class="kicker">'+esc(g.title)+'</div><div class="gq">'+gx(pr.q)+'</div>';
  q.cls = 'readb';
  return q;
}
function clozeQ(P){
  var c = makeCloze(P); if (!c) return null;
  var line = function(done){
    var gap = done ? '<span class="gapf">'+vow(c.answer)+'</span>' : '<span class="gap">   </span>';
    return '<div class="fa phrase">'+vow(c.before)+(c.before ? ' ' : '')+gap+c.tail+(c.after ? ' ' : '')+vow(c.after)+'</div><div class="meta" style="margin-top:12px">'+esc(P.en)+'</div>';
  };
  c.prompt = line(false) + '<div class="meta" style="margin-top:14px;font-size:15px">Which word fits?</div>';
  c.promptDone = line(true) + '<div class="ptr reveal-in" style="margin-top:14px">'+esc(tr(P.tr))+'</div>';
  c.cls = 'clozeb';
  return c;
}
function say(L){ return L.sayRaw || tr(L.say || L.sound); }
function makeQuiz(s){
  var L = BY[s.id], q = { type:s.type, id:s.id, labels:{} };
  if (s.type === 'read'){
    // read the word: the right reading among near-misses (e.g. bachche vs bache)
    var w = L.quizWords[Math.floor(Math.random()*L.quizWords.length)];
    var opts = shuffle([w.tr].concat(w.wrong));
    q.glyph = w.fa; q.word = w;
    q.keys = opts.map(function(o, i){ q.labels['o'+i] = esc(tr(o)); return 'o'+i; });
    q.correct = 'o' + opts.indexOf(w.tr);
    return q;
  }
  var choices;
  if (s.type === 'pick'){
    // look-alike drill: show the sound + name, pick the letter. Same-family letters first.
    var fam = s.pool.filter(function(o){ return o !== s.id && BY[o].fam === L.fam && !BY[o].kind; });
    var rest = s.pool.filter(function(o){ return o !== s.id && !BY[o].kind && fam.indexOf(o) < 0; });
    choices = shuffle(pickN(fam, 3).concat(pickN(rest, Math.max(0, 3 - Math.min(3, fam.length)))).concat(s.id));
    choices.forEach(function(id){ q.labels[id] = '<span class="fa cg">'+BY[id].ch+'</span>'; });
  } else {
    // which sound / number? never offer another item with the same sound (e.g. س and ص)
    var fits = function(o){ var k = BY[o].kind; return L.kind === 'num' ? k === 'num' : (k !== 'num' && k !== 'extra'); };
    var ok = s.pool.filter(function(o){ return o !== s.id && fits(o) && soundKey(BY[o]) !== soundKey(L); });
    var seen = {}; ok = ok.filter(function(o){ var k = soundKey(BY[o]); if (seen[k]) return false; seen[k] = 1; return true; });
    var near = ok.filter(function(o){ return (L.fam && BY[o].fam === L.fam) || (L.vg && BY[o].vg === L.vg); });
    var far = ok.filter(function(o){ return near.indexOf(o) < 0; });
    choices = shuffle(pickN(near, 3).concat(pickN(far, Math.max(0, 3 - Math.min(3, near.length)))).slice(0,3).concat(s.id));
    if (L.kind === 'num') choices.sort(function(a, b){ return +BY[a].sound - +BY[b].sound; });
    choices.forEach(function(id){ q.labels[id] = esc(say(BY[id])); });
    if (L.quiz){ q.glyph = L.quiz[Math.floor(Math.random()*L.quiz.length)]; }
    else { q.form = Math.floor(Math.random()*4); q.glyph = L.forms[q.form]; }
  }
  q.keys = choices; q.correct = s.id;
  return q;
}
function lessonStep(){
  if (!LESSON || !LESSON.queue.length){
    var Ls = LESSON.L, tomorrow = Date.now() + DAY;
    S.done[Ls.id] = true;
    // just practised: first review tomorrow
    function later(id){ if (!S.cards[id]){ var c = card(id); c.reps = 1; c.ivl = 1; c.due = tomorrow; } }
    Ls.items.forEach(function(id){ later('L-'+id); });
    Ls.say.forEach(later);
    if (Ls.g) GBY[Ls.g].pr.forEach(function(x, i){ later('g-'+Ls.g+'-'+i); });
    if (Ls.items.some(function(id){ return BY[id].kind === 'num'; })) later('math-'+Ls.id);
    save();
    var c = { letter:0, mark:0, extra:0, num:0 };
    Ls.items.forEach(function(id){ c[BY[id].kind || 'letter']++; });
    var parts = [];
    if (Ls.say.length) parts.push(Ls.say.length + ' to say');
    if (c.letter) parts.push(c.letter + ' letters');
    if (c.mark) parts.push(c.mark + ' vowel marks');
    if (c.extra) parts.push(c.extra + ' spelling rules');
    if (c.num) parts.push(c.num + ' numbers');
    if (Ls.T) parts.push(Ls.T.words.length + ' words');
    if (Ls.P) parts.push(Ls.P.phrases.length + ' phrases');
    if (LESSON.nWords) parts.push(LESSON.nWords + ' words to read');
    if (LESSON.nReads) parts.push(LESSON.nReads + ' sentences to read');
    return go({ name:'done', title:'Lesson '+Ls.n+' complete', sub: parts.join(' · ') });
  }
  var s = LESSON.queue.shift();
  var step = LESSON.steps - LESSON.queue.length - 1, base = { step:step, marks:{}, tries:0, src:s, mode:'lesson' };
  function mc(q){ if (!q) return lessonStep(); base.name = 'mc'; base.q = q; return go(base); }
  if (s.t === 'say') return go({ name:'sayc', id:s.id, step:step });
  if (s.t === 'sayq') return mc(sayQ(s.id));
  if (s.t === 'intro') return go({ name:'intro', id:s.id, step:step });
  if (s.t === 'quiz') return go({ name:'quiz', step:step, marks:{}, tries:0, src:s, q:makeQuiz(s) });
  if (s.t === 'spot') return mc(spotQ(s.id));
  if (s.t === 'math') return mc(mathQ(s.n));
  if (s.t === 'readit') return go({ name:'flash', mode:'lesson', src:s, item:{ kind:'read', id:'rd:'+s.X.id, W:s.X }, done:step, total:LESSON.steps });
  if (s.t === 'word') return go({ name:'flash', mode:'lesson', src:s, item:{ kind:'word', id:s.W.id, W:s.W }, done:step, total:LESSON.steps });
  if (s.t === 'new') return go({ name:'flash', mode:'lesson', src:s, item:{ kind:s.W.kind === 'phrase' ? 'phrase' : 'vocab', id:s.W.id, W:s.W, rev:false }, done:step, total:LESSON.steps });
  if (s.t === 'clz') return mc(clozeQ(s.P));
  if (s.t === 'gram') return go({ name:'gram', g:s.g, step:step });
  if (s.t === 'gq') return mc(gramQ(s.g, s.i));
}

/* =========================================================
   REVIEW FLOW
   ========================================================= */
var REVIEW = null;
function itemFor(id){
  if (id.indexOf('L-') === 0) return BY[id.slice(2)] ? { kind:'letter', id:id, L:BY[id.slice(2)] } : null;
  if (WBY[id]) return { kind:'word', id:id, W:WBY[id] };
  if (PBY[id]) return { kind:'phrase', id:id, W:PBY[id] };
  if (id.indexOf('c-') === 0) return PBY[id.slice(2)] ? { kind:'cloze', id:id, P:PBY[id.slice(2)] } : null;
  if (SAYBY[id]) return { kind:'say', id:id, W:SAYBY[id] };
  if (id.indexOf('rd:') === 0) return READBY[id.slice(3)] ? { kind:'read', id:id, W:READBY[id.slice(3)] } : null;
  if (id.indexOf('math-') === 0){ var ML = LESSONS.filter(function(x){ return x.id === id.slice(5); })[0]; return ML ? { kind:'math', id:id, n:ML.n } : null; }
  var gm = id.match(/^g-(g\d+)-(\d+)$/);
  if (gm) return GBY[gm[1]] && GBY[gm[1]].pr[+gm[2]] ? { kind:'gq', id:id, g:gm[1], i:+gm[2] } : null;
  var rev = /:r$/.test(id), W = vocabById(id.replace(/:r$/, ''));
  return W ? { kind:'vocab', id:id, W:W, rev:rev } : null;
}
var NEWS = null;
function newStep(){
  if (!NEWS.queue.length) return go({ name:'done', title: NEWS.demo ? 'Theme done' : 'New words done', sub:NEWS.total + ' words · they\'ll come back in reviews' });
  var W = NEWS.queue.shift();
  go({ name:'flash', mode:'new', item:{ kind:W.kind === 'phrase' ? 'phrase' : 'vocab', id:W.id, W:W, rev:false }, done:NEWS.total - NEWS.queue.length - 1, total:NEWS.total });
}
function reviewStep(){
  if (!REVIEW.queue.length) return go({ name:'done', title:'Review done', sub:REVIEW.total + ' cards' });
  var id = REVIEW.queue.shift(), it = itemFor(id), done = REVIEW.total - REVIEW.queue.length - 1;
  if (!it) return reviewStep();   // e.g. a deleted word
  if (it.kind === 'cloze' || it.kind === 'gq' || it.kind === 'math'){
    var q = it.kind === 'cloze' ? clozeQ(it.P) : it.kind === 'gq' ? gramQ(it.g, it.i) : mathQ(it.n);
    if (q) return go({ name:'mc', mode:'review', cardId:id, q:q, marks:{}, tries:0, done:done, total:REVIEW.total });
    return reviewStep();
  }
  go({ name:'flash', mode:'review', item:it, done:done, total:REVIEW.total });
}

/* =========================================================
   ACTIONS
   ========================================================= */
var ACT = {
  noop: function(){},
  home: function(){ animId++; LESSON = null; REVIEW = null; NEWS = null; go({ name:'home' }); },
  lessons: function(){ go({ name:'lessons' }); },
  words: function(){ go({ name:'words' }); },
  theme: function(id){ go({ name:'theme', id:id }); },
  learn: function(){
    var q = unseenVocab().slice(0, Math.min(newLeft(), SESSION_NEW));
    if (!q.length) return go({ name:'home' });
    NEWS = { queue:q, total:q.length, counted:{} }; newStep();
  },
  trytheme: function(id){   // demo: practise a whole theme, outside the daily limit
    var Ps = PHRASESETS.filter(function(x){ return x.id === id; })[0];
    var list = id === 'mine' ? S.myWords : Ps ? Ps.phrases : THEMES.filter(function(x){ return x.id === id; })[0].words;
    NEWS = { queue:list.slice(), total:list.length, counted:{}, demo:true, back:id }; newStep();
  },
  spoken: function(){ go({ name:'spoken' }); },
  fade: function(){ S.fade = !S.fade; save(); render(); },
  mcpick: function(k){
    if (view.answered || view.marks[k]) return;
    if (k === view.q.correct){ view.marks[k] = 'ok'; view.answered = true; }
    else {
      view.tries++; view.marks[k] = view.tries === 1 ? 'warn' : 'bad';
      if (view.tries >= 2 || view.q.keys.length <= 2){ view.marks[view.q.correct] = 'show'; view.answered = true; }
    }
    render();
  },
  mcnext: function(){
    var ok = view.tries === 0;
    if (view.mode === 'lesson'){
      if (!ok){ LESSON.queue.splice(Math.min(3, LESSON.queue.length), 0, view.src); LESSON.steps++; }
      return lessonStep();
    }
    rate(view.cardId, ok ? 2 : 0);
    if (!ok) REVIEW.queue.push(view.cardId);
    reviewStep();
  },
  speak: function(t){ speak(decodeURIComponent(t)); },
  voicetest: function(){
    var msg = document.getElementById('v-msg');
    function check(tries){
      var vs = []; try { vs = speechSynthesis.getVoices(); } catch(e){}
      var fa = vs.filter(function(v){ return /^fa/i.test(v.lang); });
      if (!fa.length && tries < 6) return setTimeout(function(){ check(tries + 1); }, 300);
      if (fa.length){ S.voice = fa[0].voiceURI; save(); msg.textContent = 'Found: ' + fa[0].name + ' (' + fa[0].lang + '). Play buttons are on.'; speak('سلام، حالت چطوره؟'); }
      else { S.voice = null; save(); msg.textContent = vs.length ? 'No Persian voice on this device (' + vs.length + ' other voices). Audio waits for the native app.' : 'Speech isn\'t available here. Audio waits for the native app.'; }
    }
    try { speechSynthesis.getVoices(); } catch(e){}
    msg.textContent = 'Checking…'; check(0);
  },
  addword: function(){ go({ name:'wordform' }); },
  editword: function(id){ go({ name:'wordform', id:id }); },
  saveword: function(id){
    var fa = document.getElementById('f-fa').value.trim(), t = document.getElementById('f-tr').value.trim(), en = document.getElementById('f-en').value.trim();
    if (!fa || !en){ document.getElementById('f-msg').textContent = 'Add at least the Farsi word and the English meaning.'; return; }
    fa = fa.replace(/\u064A/g,'\u06CC').replace(/\u0643/g,'\u06A9');   // Arabic ي ك → Persian ی ک
    if (id){ var W = vocabById(id); W.fa = fa; W.tr = t; W.en = en; }
    else { var nw = { id:'m-' + Date.now().toString(36), fa:fa, tr:t, en:en, theme:'mine' }; S.myWords.unshift(nw); card(nw.id); }   // due straight away
    save(); go({ name:'theme', id:'mine' });
  },
  delword: function(id){
    if (!view.confirm){ view.confirm = true; render(); return; }
    S.myWords = S.myWords.filter(function(w){ return w.id !== id; });
    delete S.cards[id]; delete S.cards[id + ':r'];
    save(); go({ name:'theme', id:'mine' });
  },
  perday: function(n){ S.newPerDay = +n; save(); render(); },
  backup: function(){
    var text = JSON.stringify({ app:'farsi', v:2, saved:new Date().toISOString(), state:S });
    var out = document.getElementById('bk-out'), msg = document.getElementById('bk-msg');
    function show(){ out.style.display = 'block'; out.value = text; out.focus(); out.select(); msg.textContent = 'Select the text below and copy it.'; }
    try { navigator.clipboard.writeText(text).then(function(){ msg.textContent = 'Backup copied. Paste it somewhere safe, like Notes.'; }, show); }
    catch(e){ show(); }
  },
  restoreview: function(){ go({ name:'restore' }); },
  restore: function(){
    var err = document.getElementById('bk-err');
    try {
      var data = JSON.parse(document.getElementById('bk-in').value);
      if (!data || data.app !== 'farsi' || !data.state || !data.state.cards) throw new Error('bad');
      S = data.state; var d = freshState(); for (var k in d) if (S[k] === undefined) S[k] = d[k];
      save(); go({ name:'home' });
    } catch(e){ err.textContent = 'That doesn\'t look like a backup from this app.'; }
  },
  settings: function(){ go({ name:'settings' }); },
  lesson: function(id){
    var Ls = LESSONS.filter(function(x){ return x.id === id; })[0] || nextLesson() || LESSONS[0];
    buildLesson(Ls); lessonStep();
  },
  review: function(){ var q = shuffle(dueIds()).slice(0,50); REVIEW = { queue:q, total:q.length }; reviewStep(); },
  next: function(){
    if (view.name === 'sayc'){ S.seen.say = true; save(); }
    if (view.name === 'intro'){
      var L = BY[view.id];
      if (L.kind === 'mark') S.seen.marks = true; else if (!L.kind){ S.seen.forms = true; if (!L.joins) S.seen.nj = true; }
      save();
    }
    lessonStep();
  },
  pick: function(id){
    if (view.answered || view.marks[id]) return;
    if (id === view.q.correct){ view.marks[id] = 'ok'; view.answered = true; }
    else {
      view.tries++;
      view.marks[id] = view.tries === 1 ? 'warn' : 'bad';
      if (view.tries >= 2 || view.q.keys.length <= 2){ view.marks[view.q.correct] = 'show'; view.answered = true; }
    }
    if (view.answered && view.tries > 0){
      LESSON.queue.splice(Math.min(3, LESSON.queue.length), 0, view.src); LESSON.steps++;
    }
    render();
  },
  reveal: function(){
    if (view.name !== 'flash' || view.revealed) return;
    var sel = '.card .ln, .card .mv';
    var before = app.querySelector(sel), y0 = before ? before.getBoundingClientRect().top : null;
    view.revealed = true; S.seen.tap = true; if (view.item && view.item.kind === 'read') S.seen.readit = true; save(); render();
    var after = app.querySelector(sel);
    if (after && y0 !== null){
      var dy = y0 - after.getBoundingClientRect().top;
      if (Math.abs(dy) > 1){
        after.style.transition = 'none'; after.style.transform = 'translateY('+dy+'px)';
        after.getBoundingClientRect();
        after.style.transition = 'transform .7s cubic-bezier(.2,.7,.2,1)'; after.style.transform = '';
      }
    }
  },
  rate: function(r){
    r = +r; rate(view.item.id, r);
    var it = view.item;
    if (it.kind === 'vocab' && !it.rev && r > 0 && S.cards[it.id].reps >= 2 && !S.cards[it.id + ':r']){
      var c = card(it.id + ':r'); c.due = Date.now() + DAY; save();   // now practise English → Farsi too
    }
    if (it.kind === 'phrase' && r > 0 && it.W.gap && S.cards[it.id].reps >= 2 && !S.cards['c-' + it.id]){
      var cz = card('c-' + it.id); cz.due = Date.now() + DAY; save();   // and fill-in-the-blank
    }
    if (view.mode === 'lesson'){
      if (r === 0){ LESSON.queue.splice(Math.min(3, LESSON.queue.length), 0, view.src); LESSON.steps++; }
      lessonStep();
    } else if (view.mode === 'new'){
      if (!NEWS.counted[view.item.id] && !NEWS.demo){ NEWS.counted[view.item.id] = 1; countNew(); save(); }
      if (r === 0) NEWS.queue.splice(Math.min(3, NEWS.queue.length), 0, view.item.W);
      newStep();
    } else {
      if (r === 0) REVIEW.queue.push(view.item.id);
      reviewStep();
    }
  },
  write: function(k){ view.write = +k; S.seen.write = true; save(); render(); animateWriting(); },
  replay: function(){ animateWriting(); },
  wmove: function(d){ var k = view.write + (+d); if (k < 0 || k > 3) return; view.write = k; render(); animateWriting(); },
  closewrite: function(){ animId++; view.write = null; render(); },
  scheme: function(s){ S.scheme = s; save(); render(); },
  vowels: function(v){ S.vowels = v === '1'; save(); render(); },
  unlock: function(){ S.unlockAll = !S.unlockAll; save(); render(); },
  reset: function(){
    if (view.confirm){ S = freshState(S); save(); go({ name:'home' }); }
    else { view.confirm = true; render(); app.querySelector('[data-act=reset]').textContent = 'Tap again to confirm'; }
  }
};

render();
