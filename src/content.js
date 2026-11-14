/* =========================================================
   CONTENT
   Transliteration internal format: "A" = long a (آ/ا), "a" = short a (ـَ)
   fam = look-alike shape family · vg = vowel group (used to pick good quiz distractors)
   ========================================================= */
function fi(s){ return '<span class="fi">'+s+'</span>'; }   // inline Farsi inside English notes
function ex(pos, fa, tr, en, spFa, sp){ var e = { pos:pos, fa:fa, tr:tr, en:en }; if (spFa){ e.spokenFa = spFa; e.spoken = sp; } return e; }

var LETTERS = [
  /* ---------- Lesson 1 ---------- */
  { id:'alef', ch:'ا', name:'alef', sound:'A', joins:false, vg:'vowel',
    forms:['ا','ا','ـا','ـا'],
    exs:[ ex('start','اَسب','asb','horse'), ex('middle','کِتاب','ketAb','book'), ex('end','دَریا','daryA','sea') ],
    note:'At the start of a word, '+fi('ا')+' carries a short vowel (asb). The â sound there is written '+fi('آ')+'.' },
  { id:'be', ch:'ب', name:'be', sound:'b', joins:true, fam:'be',
    forms:['ب','بـ','ـبـ','ـب'],
    exs:[ ex('start','باران','bArAn','rain'), ex('middle','سَبز','sabz','green'), ex('end','شَب','shab','night') ] },
  { id:'dal', ch:'د', name:'dAl', sound:'d', joins:false, fam:'dal',
    forms:['د','د','ـد','ـد'],
    exs:[ ex('start','دَست','dast','hand'), ex('middle','پِدَر','pedar','father'), ex('end','سِفید','sefid','white') ] },
  { id:'re', ch:'ر', name:'re', sound:'r', joins:false, fam:'re',
    forms:['ر','ر','ـر','ـر'],
    exs:[ ex('start','روز','ruz','day'), ex('middle','بَرف','barf','snow'), ex('end','شیر','shir','milk') ] },
  { id:'mim', ch:'م', name:'mim', sound:'m', joins:true,
    forms:['م','مـ','ـمـ','ـم'],
    exs:[ ex('start','مادَر','mAdar','mother'), ex('middle','نَمَک','namak','salt'), ex('end','اِسم','esm','name') ] },
  { id:'nun', ch:'ن', name:'nun', sound:'n', joins:true, fam:'be',
    forms:['ن','نـ','ـنـ','ـن'],
    exs:[ ex('start','نان','nAn','bread'), ex('middle','سَنگ','sang','stone'), ex('end','مَن','man','I, me') ],
    note:'At the start and in the middle it looks like '+fi('ب')+', but with one dot above.' },

  /* ---------- Lesson 2: vowels ---------- */
  { id:'zebar', kind:'mark', ch:'ـَ', show:'بَ', name:'zebar', sound:'a', vg:'vowel',
    row:[['بَ','ba'],['دَ','da'],['مَ','ma'],['نَ','na']], quiz:['بَ','دَ','مَ','نَ','رَ'],
    exs:[ ex('','بَد','bad','bad'), ex('','دَر','dar','door'), ex('','سَر','sar','head') ],
    note:'A short a: a small dash above the letter.' },
  { id:'zir', kind:'mark', ch:'ـِ', show:'بِ', name:'zir', sound:'e', vg:'vowel',
    row:[['بِ','be'],['دِ','de'],['مِ','me'],['نِ','ne']], quiz:['بِ','دِ','مِ','نِ','رِ'],
    exs:[ ex('','دِل','del','heart'), ex('','پِدَر','pedar','father'), ex('','اِسم','esm','name') ],
    note:'A short e: a small dash below the letter.' },
  { id:'pish', kind:'mark', ch:'ـُ', show:'بُ', name:'pish', sound:'o', vg:'vowel',
    row:[['بُ','bo'],['دُ','do'],['مُ','mo'],['نُ','no']], quiz:['بُ','دُ','مُ','نُ','رُ'],
    exs:[ ex('','گُل','gol','flower'), ex('','دُم','dom','tail'), ex('','بُرد','bord','won') ],
    note:'A short o: a small curl above the letter.' },
  { id:'vav', ch:'و', name:'vAv', sound:'v · u', joins:false, vg:'vowel',
    forms:['و','و','ـو','ـو'],
    exs:[ ex('start','وَقت','vaght','time'), ex('middle','توت','tut','mulberry'), ex('end','تو','to','you') ],
    note:'A consonant (v) or the long vowel u. In a few common words it\'s o, like '+fi('تو')+' (to, you). Doesn\'t join to the next letter.' },
  { id:'ye', ch:'ی', name:'ye', sound:'y · i', joins:true, vg:'vowel',
    forms:['ی','یـ','ـیـ','ـی'],
    exs:[ ex('start','یِک','yek','one'), ex('middle','سیب','sib','apple'), ex('end','ماهی','mAhi','fish') ],
    note:'A consonant (y) or the long vowel i. Two dots below at the start and in the middle; no dots alone or at the end.' },

  /* ---------- Lesson 3 ---------- */
  { id:'te', ch:'ت', name:'te', sound:'t', joins:true, fam:'be',
    forms:['ت','تـ','ـتـ','ـت'],
    exs:[ ex('start','تو','to','you'), ex('middle','کِتاب','ketAb','book'), ex('end','دَست','dast','hand') ],
    note:'Same shape as '+fi('ب')+', with two dots above.' },
  { id:'pe', ch:'پ', name:'pe', sound:'p', joins:true, fam:'be',
    forms:['پ','پـ','ـپـ','ـپ'],
    exs:[ ex('start','پِدَر','pedar','father'), ex('middle','سِپاس','sepAs','thanks'), ex('end','چَپ','chap','left') ],
    note:'Same shape as '+fi('ب')+', with three dots below.' },
  { id:'ze', ch:'ز', name:'ze', sound:'z', joins:false, fam:'re',
    forms:['ز','ز','ـز','ـز'],
    exs:[ ex('start','زَن','zan','woman'), ex('middle','مَزه','maze','taste'), ex('end','سَبز','sabz','green') ],
    note:'Same shape as '+fi('ر')+', with one dot above.' },
  { id:'sin', ch:'س', name:'sin', sound:'s', joins:true, fam:'sin',
    forms:['س','سـ','ـسـ','ـس'],
    exs:[ ex('start','سَلام','salAm','hello'), ex('middle','پِسَر','pesar','boy'), ex('end','عَکس','aks','photo') ],
    note:'Three small teeth. The most common way to write s.' },
  { id:'shin', ch:'ش', name:'shin', sound:'sh', joins:true, fam:'sin',
    forms:['ش','شـ','ـشـ','ـش'],
    exs:[ ex('start','شَب','shab','night'), ex('middle','مِشکی','meshki','black'), ex('end','آتَش','Atash','fire') ],
    note:'Same shape as '+fi('س')+', with three dots above.' },
  { id:'lam', ch:'ل', name:'lAm', sound:'l', joins:true,
    forms:['ل','لـ','ـلـ','ـل'],
    exs:[ ex('start','لَب','lab','lip'), ex('middle','گُلابی','golAbi','pear'), ex('end','فیل','fil','elephant') ] },

  /* ---------- Lesson 4 ---------- */
  { id:'kaf', ch:'ک', name:'kAf', sound:'k', joins:true, fam:'kaf',
    forms:['ک','کـ','ـکـ','ـک'],
    exs:[ ex('start','کِتاب','ketAb','book'), ex('middle','شِکَر','shekar','sugar'), ex('end','یِک','yek','one') ],
    note:'A tall letter with one slanted line inside.' },
  { id:'gaf', ch:'گ', name:'gAf', sound:'g', joins:true, fam:'kaf',
    forms:['گ','گـ','ـگـ','ـگ'],
    exs:[ ex('start','گُل','gol','flower'), ex('middle','اَنگور','angur','grape'), ex('end','سَگ','sag','dog') ],
    note:'Same as '+fi('ک')+', with two slanted lines.' },
  { id:'he', ch:'ه', name:'he', sound:'h', joins:true, fam:'he',
    forms:['ه','هـ','ـهـ','ـه'],
    exs:[ ex('start','هَفت','haft','seven'), ex('middle','شَهر','shahr','city'), ex('end','خانه','khAne','house','خونه','khune') ],
    note:'Changes shape a lot. At the end of a word, '+fi('ـه')+' often just sounds e (khâne).' },
  { id:'fe', ch:'ف', name:'fe', sound:'f', joins:true, fam:'fe',
    forms:['ف','فـ','ـفـ','ـف'],
    exs:[ ex('start','فارسی','fArsi','Persian'), ex('middle','کَفش','kafsh','shoe'), ex('end','کیف','kif','bag') ],
    note:'A small loop with one dot above.' },
  { id:'qaf', ch:'ق', name:'ghAf', sound:'gh', joins:true, fam:'fe',
    forms:['ق','قـ','ـقـ','ـق'],
    exs:[ ex('start','قَند','ghand','sugar cube'), ex('middle','دَقیقه','daghighe','minute'), ex('end','عِشق','eshgh','love') ],
    note:'Like '+fi('ف')+' with two dots and a deeper bowl. gh: a soft gargled g from the throat.' },

  /* ---------- Lesson 5 ---------- */
  { id:'jim', ch:'ج', name:'jim', sound:'j', joins:true, fam:'jim',
    forms:['ج','جـ','ـجـ','ـج'],
    exs:[ ex('start','جا','jA','place'), ex('middle','اَنجیر','anjir','fig'), ex('end','گَنج','ganj','treasure') ],
    note:'One dot below the bend.' },
  { id:'che', ch:'چ', name:'che', sound:'ch', joins:true, fam:'jim',
    forms:['چ','چـ','ـچـ','ـچ'],
    exs:[ ex('start','چای','chAy','tea'), ex('middle','بَچّه','bachche','child'), ex('end','هیچ','hich','nothing') ],
    note:'Same shape as '+fi('ج')+', with three dots.' },
  { id:'khe', ch:'خ', name:'khe', sound:'kh', joins:true, fam:'jim',
    forms:['خ','خـ','ـخـ','ـخ'],
    exs:[ ex('start','خانه','khAne','house','خونه','khune'), ex('middle','تَخت','takht','bed'), ex('end','تَلخ','talkh','bitter') ],
    note:'Same shape as '+fi('ج')+', with one dot above. kh is a rough sound from the throat, like Scottish "loch".' },
  { id:'he2', ch:'ح', name:'he jimi', sound:'h', joins:true, fam:'jim',
    forms:['ح','حـ','ـحـ','ـح'],
    exs:[ ex('start','حال','hAl','mood, state'), ex('middle','صُبحانه','sobhAne','breakfast','صبحونه','sobhune'), ex('end','صُبح','sobh','morning') ],
    note:'Same shape as '+fi('ج')+', no dots. Sounds h, just like '+fi('ه')+'.' },
  { id:'eyn', ch:'ع', name:'eyn', sound:"'", say:"' · silent", joins:true, fam:'eyn',
    forms:['ع','عـ','ـعـ','ـع'],
    exs:[ ex('start','عَسَل',"'asal",'honey'), ex('middle','مُعَلِّم',"mo'allem",'teacher'), ex('end','شَمع',"sham'",'candle') ],
    note:'Usually a tiny catch in the voice (like the break in "uh-oh"), or silent. Written \' in transliteration.' },
  { id:'gheyn', ch:'غ', name:'gheyn', sound:'gh', joins:true, fam:'eyn',
    forms:['غ','غـ','ـغـ','ـغ'],
    exs:[ ex('start','غَذا','ghazA','food'), ex('middle','مَغازه','maghAze','shop'), ex('end','جیغ','jigh','scream') ],
    note:'Same shape as '+fi('ع')+', with one dot above. In Tehran it sounds the same as '+fi('ق')+' (gh).' },

  /* ---------- Lesson 6: same sound, different letter ---------- */
  { id:'se', ch:'ث', name:'se', sound:'s', joins:true, fam:'be',
    forms:['ث','ثـ','ـثـ','ـث'],
    exs:[ ex('start','ثانیه','sAniye','second'), ex('middle','مِثال','mesAl','example'), ex('end','مُثَلَّث','mosallas','triangle') ],
    note:'Like '+fi('ب')+' with three dots above. Sounds s, like '+fi('س')+'. Mostly in words from Arabic.' },
  { id:'sad', ch:'ص', name:'sAd', sound:'s', joins:true, fam:'sad',
    forms:['ص','صـ','ـصـ','ـص'],
    exs:[ ex('start','صُبح','sobh','morning'), ex('middle','قِصّه','ghesse','story'), ex('end','رَقص','raghs','dance') ],
    note:'Sounds s, like '+fi('س')+'. Mostly in words from Arabic.' },
  { id:'ta', ch:'ط', name:'tA', sound:'t', joins:true, fam:'ta',
    forms:['ط','طـ','ـطـ','ـط'],
    exs:[ ex('start','طَلا','talA','gold'), ex('middle','بَطری','batri','bottle'), ex('end','خَط','khat','line') ],
    note:'Sounds t, like '+fi('ت')+'. The tall stroke is added last.' },
  { id:'zal', ch:'ذ', name:'zAl', sound:'z', joins:false, fam:'dal',
    forms:['ذ','ذ','ـذ','ـذ'],
    exs:[ ex('start','ذُرَّت','zorrat','corn'), ex('middle','لَذیذ','laziz','delicious'), ex('end','کاغَذ','kAghaz','paper') ],
    note:'Like '+fi('د')+' with one dot. Sounds z, like '+fi('ز')+'.' },
  { id:'zad', ch:'ض', name:'zAd', sound:'z', joins:true, fam:'sad',
    forms:['ض','ضـ','ـضـ','ـض'],
    exs:[ ex('start','ضَعیف',"za'if",'weak'), ex('middle','حُضور','hozur','presence'), ex('end','مَریض','mariz','sick') ],
    note:'Like '+fi('ص')+' with one dot. Sounds z.' },
  { id:'za', ch:'ظ', name:'zA', sound:'z', joins:true, fam:'ta',
    forms:['ظ','ظـ','ـظـ','ـظ'],
    exs:[ ex('start','ظُهر','zohr','noon'), ex('middle','نَظَر','nazar','opinion'), ex('end','حافِظ','hAfez','Hafez (poet)') ],
    note:'Like '+fi('ط')+' with one dot. Sounds z.' },
  { id:'zhe', ch:'ژ', name:'zhe', sound:'zh', joins:false, fam:'re',
    forms:['ژ','ژ','ـژ','ـژ'],
    exs:[ ex('start','ژاپُن','zhApon','Japan'), ex('middle','مُژه','mozhe','eyelash'), ex('end','بِژ','bezh','beige') ],
    note:'Like '+fi('ر')+' with three dots. zh as in "measure". Rare.' }
];
/* ---------- Lesson 7: extra marks and spellings (kind 'extra') ----------
   quizWords: read-the-word quiz; 'wrong' = near-miss readings */
function qw(fa, tr, en, wrong){ return { fa:fa, tr:tr, en:en, wrong:wrong }; }
LETTERS = LETTERS.concat([
  { id:'tashdid', kind:'extra', ch:'ـّ', show:'بّ', name:'tashdid', sound:'double', sayRaw:'doubled letter',
    row:[['بّ','bb'],['دّ','dd'],['مّ','mm'],['لّ','ll']],
    exs:[ ex('','بَچّه','bachche','child'), ex('','اَوَّل','avval','first'), ex('','مُعَلِّم',"mo'allem",'teacher') ],
    note:'A small w-shaped mark above a letter: say the letter twice, or hold it longer. Often left out in normal writing.',
    quizWords:[ qw('بَچّه','bachche','child',['bache','bachehe']), qw('اَوَّل','avval','first',['aval','avvel']),
                qw('مُعَلِّم',"mo'allem",'teacher',["mo'alem","mo'allam"]), qw('تَشَکُّر','tashakkor','thanks',['tashakor','tashkor']) ] },
  { id:'hamze', kind:'extra', ch:'ء', show:'ء', name:'hamze', sound:'hamze', sayRaw:"' (a catch)",
    row:[['ء','','alone'],['أ','','on '+fi('ا')],['ئ','','on '+fi('ی')],['ؤ','','on '+fi('و')]],
    exs:[ ex('','مَسئَله',"mas'ale",'problem'), ex('','سُؤال',"so'Al",'question'), ex('','رَئیس',"ra'is",'boss') ],
    note:'A small catch in the voice, like '+fi('ع')+'. Stands alone or sits on a "seat": '+fi('ا')+', '+fi('و')+' or '+fi('ئ')+'.',
    quizWords:[ qw('مَسئَله',"mas'ale",'problem',['masale',"mas'ele"]), qw('سُؤال',"so'Al",'question',['sovAl','sAl']),
                qw('رَئیس',"ra'is",'boss',['rais','rayis']) ] },
  { id:'khva', kind:'extra', ch:'خوا', show:'خوا', name:'silent vAv', sound:'khA',
    exs:[ ex('','خواهَر','khAhar','sister'), ex('','خواب','khAb','sleep'), ex('','خواستَن','khAstan','to want') ],
    note:'After '+fi('خ')+', the '+fi('و')+' in '+fi('خوا')+' is not pronounced: '+fi('خوا')+' = khâ.',
    quizWords:[ qw('خواهَر','khAhar','sister',['khvAhar','khuAhar']), qw('خواب','khAb','sleep',['khvAb','khub']),
                qw('خواستَن','khAstan','to want',['khvAstan','khustan']) ] },
  { id:'tanvin', kind:'extra', ch:'ـاً', show:'اً', name:'tanvin', sound:'-an',
    row:[['اً','an']],
    exs:[ ex('','لُطفاً','lotfan','please'), ex('','حَتماً','hatman','definitely'), ex('','اَصلاً','aslan','not at all') ],
    note:'A double dash on a final '+fi('ا')+' adds -an. Only in a few common words from Arabic.',
    quizWords:[ qw('لُطفاً','lotfan','please',['lotfA','lotfa']), qw('حَتماً','hatman','definitely',['hatmA','hatam']),
                qw('تَقریباً','taghriban','almost',['taghribA','taghrib']) ] }
]);

/* ---------- Lessons 8–10: numbers (kind 'num') ----------
   ch = Persian digit(s) · sound = value · name = word (transliterated) · word = Farsi word
   spoken = Tehran pronunciation if different · arabic = Arabic-style digit if it looks different */
function num(v, digits, word, name, spoken, arabic, note){
  return { id:'n'+v, kind:'num', vg:'num', ch:digits, sound:String(v), name:name, word:word, spoken:spoken, arabic:arabic,
           quiz:[digits, word], note:note };
}
LETTERS = LETTERS.concat([
  num(1,'۱','یِک','yek', null, null, 'Persian digits. Numbers are written left to right, even inside right-to-left text: '+fi('۱۲')+' = 12.'),
  num(2,'۲','دو','do'),
  num(3,'۳','سه','se'),
  num(4,'۴','چَهار','chahAr','chAr','٤'),
  num(5,'۵','پَنج','panj', null, '٥', 'Looks like an upside-down heart. Don\'t confuse it with '+fi('۰')+' (zero).'),
  num(6,'۶','شِش','shesh','shish','٦'),
  num(7,'۷','هَفت','haft', null, null, 'Opens upward like a V.'),
  num(8,'۸','هَشت','hasht', null, null, 'Opens downward, like an upside-down V.'),
  num(9,'۹','نُه','noh'),
  num(10,'۱۰','دَه','dah'),
  num(0,'۰','صِفر','sefr', null, null, 'Zero is a small dot.'),
  num(11,'۱۱','یازدَه','yAzdah','yAzda'),
  num(12,'۱۲','دَوازدَه','davAzdah','davAzda'),
  num(13,'۱۳','سیزدَه','sizdah','sizda'),
  num(14,'۱۴','چَهاردَه','chahArdah','chArda'),
  num(15,'۱۵','پانزدَه','pAnzdah','punzda'),
  num(16,'۱۶','شانزدَه','shAnzdah','shunzda'),
  num(17,'۱۷','هِفدَه','hefdah','hifda'),
  num(18,'۱۸','هِجدَه','hejdah','hijda'),
  num(19,'۱۹','نوزدَه','nuzdah','nuzda'),
  num(20,'۲۰','بیست','bist', null, null, 'Build numbers with '+fi('و')+' (-o-, "and"): '+fi('بیست و یِک')+' bist-o yek = 21.'),
  num(30,'۳۰','سی','si'),
  num(40,'۴۰','چِهِل','chehel'),
  num(50,'۵۰','پَنجاه','panjAh','panjA'),
  num(60,'۶۰','شَصت','shast'),
  num(70,'۷۰','هَفتاد','haftAd'),
  num(80,'۸۰','هَشتاد','hashtAd'),
  num(90,'۹۰','نَوَد','navad'),
  num(100,'۱۰۰','صَد','sad', null, null, '120 = '+fi('صَد و بیست')+' sad-o bist.')
]);
var BY = {}; LETTERS.forEach(function(L){ BY[L.id] = L; });
function glyph(L){ return L.show || L.ch; }

/* ---------- Lessons ---------- */
var LESSONS = [
  { id:'l1', title:'First letters', groups:[['alef','be','dal'],['re','mim','nun']] },
  { id:'l2', title:'Vowels',        groups:[['zebar','zir','pish'],['vav','ye']] },
  { id:'l3', title:'Dots and teeth', groups:[['te','pe','ze'],['sin','shin','lam']] },
  { id:'l4', title:'Tall letters and loops', groups:[['kaf','gaf','he'],['fe','qaf']] },
  { id:'l5', title:'The jim family', groups:[['jim','che','khe'],['he2','eyn','gheyn']] },
  { id:'l6', title:'Same sound, different letter', groups:[['se','sad','ta'],['zal','zad','za','zhe']] },
  { id:'l7', title:'Extra marks and spellings', groups:[['tashdid','hamze'],['khva','tanvin']] },
  { id:'l8', title:'Numbers 0–10', groups:[['n1','n2','n3'],['n4','n5','n6'],['n7','n8','n9'],['n10','n0']] },
  { id:'l9', title:'Numbers 11–19', groups:[['n11','n12','n13'],['n14','n15','n16'],['n17','n18','n19']] },
  { id:'l10', title:'Tens and 100', groups:[['n20','n30','n40'],['n50','n60','n70'],['n80','n90','n100']] }
];
LESSONS.forEach(function(Ls, i){ Ls.n = i + 1; Ls.items = [].concat.apply([], Ls.groups); });

/* ---------- Reading words (only letters taught up to that lesson) ----------
   fa = with vowel marks; tr = reading as written; spoken = Tehran colloquial (only if different) */
function w(lesson, fa, tr, en, spFa, sp){ var o = { lesson:lesson, fa:fa, tr:tr, en:en }; if (spFa){ o.spokenFa = spFa; o.spoken = sp; } return o; }
var WORDS = [
  w('l1','بابا','bAbA','dad'), w('l1','آب','Ab','water'), w('l1','بَد','bad','bad'), w('l1','دَر','dar','door'),
  w('l1','مَرد','mard','man'), w('l1','مادَر','mAdar','mother'), w('l1','نان','nAn','bread','نون','nun'),
  w('l1','باران','bArAn','rain','بارون','bArun'), w('l1','اَبر','abr','cloud'), w('l1','داماد','dAmAd','groom'),

  w('l2','بَرادَر','barAdar','brother'), w('l2','بود','bud','was'), w('l2','دور','dur','far'), w('l2','مو','mu','hair'),
  w('l2','نور','nur','light'), w('l2','بینی','bini','nose'), w('l2','ایران','irAn','Iran'), w('l2','بیرون','birun','outside'),
  w('l2','نو','no','new'), w('l2','دیر','dir','late'),

  w('l3','سَلام','salAm','hello'), w('l3','تو','to','you'), w('l3','زَن','zan','woman'), w('l3','سیب','sib','apple'),
  w('l3','شَب','shab','night'), w('l3','سال','sAl','year'), w('l3','پول','pul','money'), w('l3','لَب','lab','lip'),
  w('l3','اِسم','esm','name'), w('l3','شیر','shir','milk'),

  w('l4','کِتاب','ketAb','book'), w('l4','گُل','gol','flower'), w('l4','ماه','mAh','moon'), w('l4','سَگ','sag','dog'),
  w('l4','فارسی','fArsi','Persian'), w('l4','قَند','ghand','sugar cube'), w('l4','یِک','yek','one'), w('l4','کوه','kuh','mountain'),
  w('l4','هَفت','haft','seven'), w('l4','قَهوه','ghahve','coffee'),

  w('l5','چای','chAy','tea'), w('l5','خانه','khAne','house','خونه','khune'), w('l5','خوب','khub','good'), w('l5','بَچّه','bachche','child'),
  w('l5','چِشم','cheshm','eye'), w('l5','حال','hAl','mood, state'), w('l5','عَسَل',"'asal",'honey'), w('l5','باغ','bAgh','garden'),
  w('l5','جوجه','juje','chick'), w('l5','مُرغ','morgh','hen'),

  w('l6','صُبح','sobh','morning'), w('l6','غَذا','ghazA','food'), w('l6','طَلا','talA','gold'), w('l6','ظُهر','zohr','noon'),
  w('l6','مِثال','mesAl','example'), w('l6','ژاپُن','zhApon','Japan'), w('l6','مَریض','mariz','sick'), w('l6','خَط','khat','line'),
  w('l6','صُبحانه','sobhAne','breakfast','صبحونه','sobhune'), w('l6','لَذیذ','laziz','delicious'),

  w('l7','لُطفاً','lotfan','please'), w('l7','خواهَر','khAhar','sister'), w('l7','بَچّه','bachche','child'), w('l7','سُؤال',"so'Al",'question'),
  w('l7','اَوَّل','avval','first'), w('l7','خواب','khAb','sleep'), w('l7','مَسئَله',"mas'ale",'problem'), w('l7','حَتماً','hatman','definitely'),

  w('l8','یِک چای','yek chAy','one tea'), w('l8','دو سیب','do sib','two apples'), w('l8','سه روز','se ruz','three days'),
  w('l8','۴ کِتاب','chahAr ketAb','4 books','چار کتاب','chAr ketAb'), w('l8','هَفت شَب','haft shab','seven nights'),
  w('l8','۱۰ سال','dah sAl','10 years'), w('l8','۸','hasht','8'), w('l8','۵','panj','5'), w('l8','۶','shesh','6','شیش','shish'), w('l8','۰','sefr','0'),

  w('l9','۱۲','davAzdah','12'), w('l9','۱۵','pAnzdah','15'), w('l9','۱۷','hefdah','17'), w('l9','۱۳','sizdah','13'),
  w('l9','۱۹','nuzdah','19'), w('l9','۱۴ سال','chahArdah sAl','14 years'), w('l9','۱۱ روز','yAzdah ruz','11 days'), w('l9','۱۶','shAnzdah','16'),

  w('l10','۲۱','bist-o yek','21'), w('l10','۳۵','si-o panj','35'), w('l10','۴۸','chehel-o hasht','48'), w('l10','۵۰','panjAh','50','پنجا','panjA'),
  w('l10','۶۲','shast-o do','62'), w('l10','۷۷','haftAd-o haft','77'), w('l10','۹۹','navad-o noh','99'), w('l10','۱۰۰','sad','100'),
  w('l10','۱۲۰','sad-o bist','120'), w('l10','۸۰ سال','hashtAd sAl','80 years')
];
WORDS.forEach(function(W, i){ W.id = 'w' + i + '-' + W.lesson; });
var WBY = {}; WORDS.forEach(function(W){ WBY[W.id] = W; });
var POS = ['alone','start','middle','end'];
