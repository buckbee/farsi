/* =========================================================
   COURSE (restructure, 4 Nov 2026): one path, Lesson 0 – Lesson 18
   Text conventions in this file:
     {…}  = transliteration in the app's internal format (A = â); shown with the chosen scheme
     fi() = inline Farsi
   ========================================================= */

/* ---------- Say it: spoken phrases learned from transliteration ---------- */
function say_(id, fa, tr, en, spFa, sp){ var o = { id:'say-'+id, fa:fa, tr:tr, en:en }; if (spFa){ o.spokenFa = spFa; o.spoken = sp; } return o; }
var SAY = [
  say_('salam-chetori', 'سَلام، چِطوری؟', 'salAm, chetori?', 'Hi, how are you? (casual)'),
  say_('khubam-to', 'مِرسی، مَن خوبَم. تو چِطوری؟', 'mersi, man khubam. to chetori?', 'Thanks, I\'m good. How are you?'),
  say_('manham', 'مَن هَم خوبَم، مِرسی.', 'man ham khubam, mersi.', 'I\'m good too, thanks.'),
  say_('esm', 'اِسمِ مَن … است.', 'esm-e man … ast.', 'My name is …', 'اسمم … ـه.', 'esmam …-e.'),
  say_('khodahafez', 'خُداحافِظ!', 'khodAhAfez!', 'Goodbye!'),
  say_('salam', 'سَلام!', 'salAm!', 'Hello!'),
  say_('tochetori', 'تو چِطوری؟', 'to chetori?', 'How are you? (casual)'),
  say_('dotachay', 'دو تا چای', 'do tA chAy', 'two teas'),
  say_('esmet', 'اِسمِت چیه؟', 'esmet chiye?', 'What\'s your name? (casual)'),
  say_('halet', 'حالِت چِطوره؟', 'hAlet chetore?', 'How are you? (casual, "how\'s your state?")'),
  say_('halshoma', 'حالِ شُما چِطوره؟', 'hAl-e shomA chetore?', 'How are you? (polite)'),
  say_('mamnun', 'خِیلی مَمنون.', 'kheyli mamnun.', 'Thank you very much.'),
  say_('bebakhshid', 'بِبَخشید.', 'bebakhshid.', 'Excuse me. / Sorry.'),
  say_('sobh', 'صُبح بِخِیر!', 'sobh bekheyr!', 'Good morning!'),
  say_('shab', 'شَب بِخِیر.', 'shab bekheyr.', 'Good night.'),
  say_('lotfan', 'لُطفاً.', 'lotfan.', 'Please.'),
  say_('balelotfan', 'بَله، لُطفاً.', 'bale, lotfan.', 'Yes, please.'),
  say_('chandsal', 'چَند سال داری؟', 'chand sAl dAri?', 'How old are you? (casual)'),
  say_('bistsalame', 'بیست سالَمه.', 'bist sAlame.', 'I\'m twenty. (spoken)'),
  say_('chande', 'چَنده؟', 'chande?', 'How much is it? (casual)'),
  say_('gerune', 'گِرونه!', 'gerune!', 'It\'s expensive! (spoken)')
];
var SAYBY = {}; SAY.forEach(function(s){ SAYBY[s.id] = s; });

/* ---------- Grammar: one short card per lesson + practice questions (they come back in reviews) ----------
   ex: [Farsi, {translit}, English] · pr: { q, o:[correct, wrong, wrong] } (options are shuffled) */
function gram(id, title, body, ex, pr){ return { id:id, title:title, body:body, ex:ex || [], pr:pr || [] }; }
var GRAMMAR = [
  gram('g0', 'What\'s ahead',
    'Each lesson mixes a little speaking, a few new letters, reading and one grammar point. Persian is written right to left with 32 letters. You\'ll learn to say things before you can read them.'),
  gram('g1', 'Right to left, and no "the" or "a"',
    'Persian is read from right to left. There\'s no word for "the" or "a": '+fi('کتاب')+' {ketAb} means "book", "a book" or "the book". '+fi('یک')+' {yek} ("one") can mean "a".',
    [['کتاب','{ketAb}','book · a book · the book'], ['یک کتاب','{yek ketAb}','a book, one book']],
    [ { q:'Which way is Persian read?', o:['right to left','left to right','top to bottom'] },
      { q:fi('کتاب')+' {ketAb} means…', o:['book, a book or the book','only "the book"','only "a book"'] } ]),
  gram('g2', 'Short vowels are usually not written',
    'Long vowels are letters: {A} '+fi('ا')+', {i} '+fi('ی')+', {u} '+fi('و')+'. Short {a}, {e}, {o} are only small marks, and normal writing leaves them out: '+fi('کتاب')+' is read {ketAb}, though the e isn\'t written.',
    [['کِتاب','{ketAb}','with the vowel mark'], ['کتاب','{ketAb}','as normally written']],
    [ { q:'In normal writing, which vowels are left out?', o:['short a, e, o','long â, i, u','all vowels'] },
      { q:'Which letter writes the long vowel {i}?', o:[fi('ی'), fi('و'), fi('ا')] } ]),
  gram('g3', 'Counting with tâ',
    'When counting things, put '+fi('تا')+' {tA} between the number and the thing, and keep the thing singular: {do tA chAy} "two teas".',
    [['دو تا چای','{do tA chAy}','two teas'], ['سه تا کتاب','{se tA ketAb}','three books']],
    [ { q:'"two teas" in everyday Persian', o:['{do tA chAy}','{do chAy-hA}','{chAy do tA}'] },
      { q:'After a number, the thing is…', o:['singular','plural','either'] } ]),
  gram('g4', 'Pronouns',
    '{man} I · {to} you (casual) · {u} he or she · {mA} we · {shomA} you (polite, or more than one) · {AnhA} they (spoken {unA}). One word covers both he and she.',
    [['من','{man}','I'], ['شما','{shomA}','you (polite)'], ['او','{u}','he, she']],
    [ { q:'"we"', o:['{mA}','{man}','{shomA}'] },
      { q:'Polite "you", e.g. to a stranger', o:['{shomA}','{to}','{u}'] },
      { q:'{u} means…', o:['he or she','only he','they'] } ]),
  gram('g5', '"To be": -am, -i, -e',
    'Short endings mean "am / are / is": {khub-am} I am good · {khub-i} you are good · {khub-e} he or she is good (written {khub ast}). That\'s why {chetor-i?} means "how are you?".',
    [['خوبم','{khubam}','I am good'], ['خوبی','{khubi}','you are good'], ['خوبه','{khube}','she / he is good (spoken)']],
    [ { q:'{khub__} "I\'m good"', o:['-am','-i','-e'] },
      { q:'{chetor__?} "how are you?" (casual)', o:['-i','-am','-e'] },
      { q:'{khub__} "she\'s good" (spoken)', o:['-e','-am','-i'] } ]),
  gram('g6', 'Plurals with -hâ',
    'Add '+fi('ها')+' {-hA} to make most nouns plural: {ketAb-hA} books. In speech it often shrinks to {-A}: {ketAbA}.',
    [['کتاب‌ها','{ketAb-hA}','books'], ['بچه‌ها','{bachche-hA}','children']],
    [ { q:'"books"', o:['{ketAb-hA}','{ketAb-am}','{ketAb-e}'] },
      { q:'"children"', o:['{bachche-hA}','{bachche-i}','{bachche-am}'] } ]),
  gram('g7', 'Linking words with -e (ezafe)',
    'To join two words, like "name of me" or "big book", add {-e} to the first: {esm-e man} my name · {ketAb-e bozorg} big book. It\'s usually not written.',
    [['اسمِ من','{esm-e man}','my name'], ['کتابِ بزرگ','{ketAb-e bozorg}','big book']],
    [ { q:'{esm__ man} "my name"', o:['-e','-am','-hA'] },
      { q:'"big book"', o:['{ketAb-e bozorg}','{bozorg ketAb}','{ketAb bozorg-e}'] } ]),
  gram('g8', 'My, your, his: -am, -et, -esh',
    'Instead of {esm-e man}, add an ending: {esm-am} my name · {esm-et} your name · {esm-esh} his / her name. Very common in speech: {hAl-et chetore?} "how\'s your state?".',
    [['اسمم','{esmam}','my name'], ['اسمت','{esmet}','your name'], ['اسمش','{esmesh}','his / her name']],
    [ { q:'{esm__} "my name"', o:['-am','-et','-esh'] },
      { q:'{hAl__ chetore?} "how are you?"', o:['-et','-am','-hA'] },
      { q:'{esm__} "her name"', o:['-esh','-et','-e'] } ]),
  gram('g9', 'Saying your age',
    'Age is counted in years: {chand sAl dAri?} "how many years do you have?". Answer {bist sAlame} "I\'m twenty" (spoken; written {bist sAl dAram}).',
    [['چند سال داری؟','{chand sAl dAri?}','how old are you?'], ['بیست سالمه','{bist sAlame}','I\'m twenty (spoken)']],
    [ { q:'"How old are you?" (casual)', o:['{chand sAl dAri?}','{sAl chande?}','{chetori?}'] },
      { q:'"I\'m twenty" (spoken)', o:['{bist sAlame}','{bist sAl-hA}','{sAl-e bist}'] } ]),
  gram('g10', 'Asking questions',
    'A question uses the same word order as a statement. Just raise your voice at the end: {khubi.} "you\'re good." → {khubi?} "are you good?". In writing you may see '+fi('آیا')+' {AyA} at the start.',
    [['خوبی.','{khubi.}','You\'re good.'], ['خوبی؟','{khubi?}','Are you good?']],
    [ { q:'Turn {khubi.} into a question', o:['{khubi?} with a rising voice','{AyA-khub?}','{khubi-hA?}'] },
      { q:'Written word that can start a yes/no question', o:['{AyA}','{ham}','{tA}'] } ]),
  gram('g11', 'Two ways to say "my mother"',
    '{mAdar-e man} (linking {-e} + "me") or {mAdar-am} (ending). Both are correct; the ending is more casual.',
    [['مادرِ من','{mAdar-e man}','my mother'], ['مادرم','{mAdaram}','my mother']],
    [ { q:'"my father": {pedar-e man} or…', o:['{pedaram}','{pedar-hA}','{pedari}'] },
      { q:'"your sister" (casual)', o:['{khAharet}','{khAharam}','{khAhar-e man}'] } ]),
  gram('g12', 'Present tense, and "I want"',
    'Present tense = {mi-} + verb stem + ending: {mi-khor-am} I eat · {mi-khor-i} you eat. "I want" is {mikhAm} in speech (written {mikhAham}): {ye chAy mikhAm} "I want a tea".',
    [['می‌خورم','{mikhoram}','I eat'], ['یه چای می‌خوام','{ye chAy mikhAm}','I want a tea (spoken)']],
    [ { q:'"I eat"', o:['{mikhoram}','{khordam}','{mikhori}'] },
      { q:'"I want" (spoken)', o:['{mikhAm}','{mikhAi}','{khAstam}'] },
      { q:'Present tense verbs start with…', o:['{mi-}','{na-}','{be-}'] } ]),
  gram('g13', 'Bigger numbers and prices',
    'Join numbers with {-o-} ("and"): {bist-o yek} 21 · {sad-o bist} 120. Asking a price: {chande?} "how much is it?". Prices are usually said in {tomAn} (1 tomân = 10 rials).',
    [['بیست و یک','{bist-o yek}','21'], ['صد و بیست','{sad-o bist}','120']],
    [ { q:'35', o:['{si-o panj}','{panj-o si}','{si panj-e}'] },
      { q:'"How much is it?" (casual)', o:['{chande?}','{chetori?}','{kojA?}'] } ]),
  gram('g14', 'Saying "not"',
    'Put {na-} before a verb: {dAram} I have → {nadAram} I don\'t have. Before {mi-} it\'s {ne-}: {mikhAm} → {nemikhAm} I don\'t want.',
    [['ندارم','{nadAram}','I don\'t have'], ['نمی‌خوام','{nemikhAm}','I don\'t want (spoken)']],
    [ { q:'"I don\'t have"', o:['{nadAram}','{dAram-na}','{midAram}'] },
      { q:'"I don\'t want" (spoken)', o:['{nemikhAm}','{namikhAm-e}','{mikhAm-na}'] } ]),
  gram('g15', 'râ (ro), and little words for place',
    'A specific object gets '+fi('را')+' {rA} after it, spoken {ro} or {-o}: {dar rA beband} → {daro beband} "close the door". Small words: {be} to · {az} from · {dar} in · {bA} with.',
    [['درو ببند','{daro beband}','close the door (spoken)'], ['با من','{bA man}','with me']],
    [ { q:'"Close the door" (spoken)', o:['{daro beband}','{dar beband-o}','{beband dar}'] },
      { q:'{bA} means…', o:['with','from','to'] },
      { q:'{az} means…', o:['from','in','with'] } ]),
  gram('g16', 'Describing: adjective after the noun',
    'Adjectives come after the noun, linked with {-e}: {mAshin-e ghermez} red car. Add {-tar} for "more": {bozorgtar} bigger.',
    [['ماشینِ قرمز','{mAshin-e ghermez}','red car'], ['بزرگ‌تر','{bozorgtar}','bigger']],
    [ { q:'"red car"', o:['{mAshin-e ghermez}','{ghermez mAshin}','{mAshin ghermez-tar}'] },
      { q:'"smaller"', o:['{kuchaktar}','{kuchak-hA}','{kuchak-e}'] } ]),
  gram('g17', 'Past tense',
    'Past tense = past stem + ending: {raft-am} I went · {did-am} I saw · {khord-am} I ate. The past stem is the "to …" form without {-an}: {raftan} → {raft}.',
    [['رفتم','{raftam}','I went'], ['دیدم','{didam}','I saw']],
    [ { q:'"I went"', o:['{raftam}','{miravam}','{raftan}'] },
      { q:'Past stem of {khordan} (to eat)', o:['{khord}','{khor}','{khordan}'] } ]),
  gram('g18', 'Word order: the verb goes last',
    'The verb comes at the end: {man ketAb mikhunam} "I read a book" (I · book · read). Question words sit where the answer would go: {kojA miri?} "where are you going?".',
    [['من کتاب می‌خونم','{man ketAb mikhunam}','I read a book (spoken)'], ['کجا می‌ری؟','{kojA miri?}','where are you going? (spoken)']],
    [ { q:'Where does the verb go?', o:['at the end','at the start','right after "I"'] },
      { q:'"I drink tea"', o:['{man chAy minusham}','{man minusham chAy}','{minusham man chAy}'] } ])
];
var GBY = {}; GRAMMAR.forEach(function(g){ GBY[g.id] = g; });

/* ---------- The path ---------- */
var LESSONS = [
  { id:'c0',  title:'Hello', say:['say-salam-chetori','say-khubam-to','say-manham','say-esm','say-khodahafez'], g:'g0' },
  { id:'c1',  title:'First letters', say:['say-salam','say-khodahafez'], groups:[['alef','be','dal'],['re','mim','nun']], read:'l1', g:'g1' },
  { id:'c2',  title:'Vowels', say:['say-tochetori','say-manham'], groups:[['zebar','zir','pish'],['vav','ye']], read:'l2', g:'g2' },
  { id:'c3',  title:'Numbers 0–10', say:['say-dotachay'], groups:[['n1','n2','n3'],['n4','n5','n6'],['n7','n8','n9'],['n10','n0']], read:'l8', g:'g3' },
  { id:'c4',  title:'Dots and teeth', say:['say-esm','say-esmet'], groups:[['te','pe','ze'],['sin','shin','lam']], read:'l3', g:'g4' },
  { id:'c5',  title:'Tall letters and loops', say:['say-tochetori','say-halet','say-halshoma'], groups:[['kaf','gaf','he'],['fe','qaf']], read:'l4', g:'g5' },
  { id:'c6',  title:'The jim family', say:['say-mamnun','say-bebakhshid'], groups:[['jim','che','khe'],['he2','eyn','gheyn']], read:'l5', g:'g6' },
  { id:'c7',  title:'Same sound, different letter', say:['say-sobh','say-shab'], groups:[['se','sad','ta'],['zal','zad','za','zhe']], read:'l6', g:'g7' },
  { id:'c8',  title:'Extra marks and spellings', say:['say-lotfan','say-balelotfan'], groups:[['tashdid','hamze'],['khva','tanvin']], read:'l7', g:'g8' },
  { id:'c9',  title:'Numbers 11–19', say:['say-chandsal','say-bistsalame'], groups:[['n11','n12','n13'],['n14','n15','n16'],['n17','n18','n19']], read:'l9', g:'g9' },
  { id:'c10', title:'Greetings and basics', theme:'greet', set:'ph-greet', g:'g10' },
  { id:'c11', title:'People and family', theme:'family', set:'ph-me', g:'g11' },
  { id:'c12', title:'Food and drink', theme:'food', set:'ph-food', g:'g12' },
  { id:'c13', title:'Tens, 100 and prices', say:['say-chande','say-gerune'], groups:[['n20','n30','n40'],['n50','n60','n70'],['n80','n90','n100']], read:'l10', g:'g13' },
  { id:'c14', title:'Home and things', theme:'home', set:'ph-home', g:'g14' },
  { id:'c15', title:'Places and time', theme:'time', set:'ph-time', g:'g15' },
  { id:'c16', title:'Describing things', theme:'describe', g:'g16' },
  { id:'c17', title:'Everyday verbs', theme:'verbs', g:'g17' },
  { id:'c18', title:'Question words and pronouns', theme:'small', set:'ph-ask', g:'g18' }
];
LESSONS.forEach(function(Ls, i){
  Ls.n = i; Ls.groups = Ls.groups || []; Ls.say = Ls.say || [];
  Ls.items = [].concat.apply([], Ls.groups);
  Ls.T = Ls.theme ? THEMES.filter(function(T){ return T.id === Ls.theme; })[0] : null;
  Ls.P = Ls.set ? PHRASESETS.filter(function(P){ return P.id === Ls.set; })[0] : null;
});
function lessonOfTheme(themeId){ return LESSONS.filter(function(Ls){ return Ls.theme === themeId || Ls.set === themeId; })[0]; }
