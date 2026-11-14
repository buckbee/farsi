/* =========================================================
   PHRASES (Phase 3) — to be checked by a native speaker
   Each set unlocks right after the word theme it builds on.
   p(fa, tr, en, spokenFa, spoken, gap)
     fa / tr  = written form and its reading
     spoken   = everyday Tehran form, where it differs
     gap      = word blanked out in the fill-in-the-blank card (must appear in fa)
   Z = zero-width non-joiner (half-space), e.g. می‌روم
   ========================================================= */
var Z = '‌';
function p(fa, tr, en, spFa, sp, gap){ var o = { fa:fa, tr:tr, en:en, gap:gap || null }; if (spFa){ o.spokenFa = spFa; o.spoken = sp; } return o; }

var PHRASESETS = [
  { id:'ph-greet', after:'greet', title:'Greetings', phrases:[
    p('سَلام، حالِت چِطوره؟', 'salAm, hAlet chetore?', 'Hi, how are you? (casual)', null, null, 'سلام'),
    p('خوبَم، مِرسی.', 'khubam, mersi.', 'I\'m good, thanks.', null, null, 'مرسی'),
    p('حالِ شُما چِطور است؟', 'hAl-e shomA chetor ast?', 'How are you? (polite)', 'حال شما چطوره؟', 'hAl-e shomA chetore?', 'شما'),
    p('صُبح بِخِیر!', 'sobh bekheyr!', 'Good morning!', null, null, 'صبح'),
    p('شَب بِخِیر.', 'shab bekheyr.', 'Good night.', null, null, 'شب'),
    p('خوش آمَدید!', 'khosh Amadid!', 'Welcome!', 'خوش اومدین!', 'khosh omadin!'),
    p('خِیلی مَمنون.', 'kheyli mamnun.', 'Thank you very much.'),
    p('بَله، لُطفاً.', 'bale, lotfan.', 'Yes, please.', null, null, 'لطفاً'),
    p('نَه، مِرسی.', 'na, mersi.', 'No, thanks.', null, null, 'نه'),
    p('بِبَخشید.', 'bebakhshid.', 'Excuse me. / Sorry.'),
    p('خُداحافِظ!', 'khodAhAfez!', 'Goodbye!') ] },

  { id:'ph-me', after:'family', title:'About me', phrases:[
    p('اِسمِ مَن سارا است.', 'esm-e man SArA ast.', 'My name is Sara.', 'اسمم ساراست.', 'esmam SArAst.', 'اسم'),
    p('اِسمِت چیه؟', 'esmet chiye?', 'What\'s your name? (casual)'),
    p('مَن دانِشجو هَستَم.', 'man dAneshju hastam.', 'I\'m a student.', 'من دانشجوام.', 'man dAneshjuam.', 'من'),
    p('این مادَرِ مَن است.', 'in mAdar-e man ast.', 'This is my mother.', 'این مادر منه.', 'in mAdar-e mane.', 'مادر'),
    p('یِک بَرادَر و دو خواهَر دارَم.', 'yek barAdar o do khAhar dAram.', 'I have one brother and two sisters.', null, null, 'خواهر'),
    p('پِدَرَم مُعَلِّم است.', "pedaram mo'allem ast.", 'My father is a teacher.', 'پدرم معلمه.', "pedaram mo'alleme.", 'معلم'),
    p('مَن فارسی یاد می'+Z+'گیرَم.', 'man fArsi yAd migiram.', 'I\'m learning Persian.', null, null, 'فارسی'),
    p('کَمی فارسی بَلَدَم.', 'kami fArsi baladam.', 'I know a little Persian.'),
    p('خانِواده'+Z+'ام بُزُرگ است.', 'khAnevAde-am bozorg ast.', 'My family is big.', 'خانواده‌م بزرگه.', 'khAnevAdam bozorge.', 'بزرگ'),
    p('دوستِ مَن اینجاست.', 'dust-e man injAst.', 'My friend is here.', null, null, 'دوست') ] },

  { id:'ph-food', after:'food', title:'Food and café', phrases:[
    p('یِک چای، لُطفاً.', 'yek chAy, lotfan.', 'One tea, please.', null, null, 'چای'),
    p('آب دارید؟', 'Ab dArid?', 'Do you have water?', 'آب دارین؟', 'Ab dArin?', 'آب'),
    p('غَذا خِیلی خوشمَزه است.', 'ghazA kheyli khoshmaze ast.', 'The food is very tasty.', 'غذا خیلی خوشمزه‌ست.', 'ghazA kheyli khoshmazast.', 'غذا'),
    p('نان و پَنیر می'+Z+'خورَم.', 'nAn o panir mikhoram.', 'I eat bread and cheese.', 'نون و پنیر می‌خورم.', 'nun o panir mikhoram.', 'پنیر'),
    p('قَهوه نِمی'+Z+'خواهَم.', 'ghahve nemikhAham.', 'I don\'t want coffee.', 'قهوه نمی‌خوام.', 'ghahve nemikhAm.', 'قهوه'),
    p('بِرِنج با مُرغ، لُطفاً.', 'berenj bA morgh, lotfan.', 'Rice with chicken, please.', null, null, 'مرغ'),
    p('میوه دوست دارَم.', 'mive dust dAram.', 'I like fruit.', null, null, 'میوه'),
    p('مَن گُرسنه'+Z+'ام.', 'man gorosne-am.', 'I\'m hungry.', 'من گشنمه.', 'man goshname.'),
    p('چِقَدر می'+Z+'شود؟', 'cheghadr mishavad?', 'How much is it?', 'چقدر میشه؟', 'cheghadr mishe?'),
    p('صورَتحِساب، لُطفاً.', 'surat-hesAb, lotfan.', 'The bill, please.') ] },

  { id:'ph-home', after:'home', title:'At home', phrases:[
    p('خانه'+Z+'یِ مَن کوچَک است.', 'khAne-ye man kuchak ast.', 'My house is small.', 'خونه‌ی من کوچیکه.', 'khune-ye man kuchike.', 'کوچک'),
    p('کِتاب روی میز است.', 'ketAb ru-ye miz ast.', 'The book is on the table.', 'کتاب رو میزه.', 'ketAb ru mize.', 'میز'),
    p('دَر را بِبَند.', 'dar rA beband.', 'Close the door.', 'درو ببند.', 'daro beband.', 'در'),
    p('پَنجَره را باز کُن.', 'panjare rA bAz kon.', 'Open the window.', 'پنجره رو باز کن.', 'panjare ro bAz kon.', 'پنجره'),
    p('ماشین دارید؟', 'mAshin dArid?', 'Do you have a car?', 'ماشین دارین؟', 'mAshin dArin?', 'ماشین'),
    p('پول نَدارَم.', 'pul nadAram.', 'I don\'t have money.', null, null, 'پول'),
    p('این کیفِ مَن است.', 'in kif-e man ast.', 'This is my bag.', 'این کیف منه.', 'in kif-e mane.', 'کیف'),
    p('کِلیدَم کُجاست؟', 'kelidam kojAst?', 'Where is my key?'),
    p('گوشی'+Z+'اَم کُجاست؟', 'gushi-am kojAst?', 'Where is my phone?', 'گوشیم کجاست؟', 'gushim kojAst?') ] },

  { id:'ph-time', after:'time', title:'Time and plans', phrases:[
    p('اِمروز کار دارَم.', 'emruz kAr dAram.', 'I have work today.', null, null, 'امروز'),
    p('فَردا می'+Z+'آیَم.', 'fardA miAyam.', 'I\'ll come tomorrow.', 'فردا میام.', 'fardA miyAm.', 'فردا'),
    p('ساعَت چَند است؟', "sA'at chand ast?", 'What time is it?', 'ساعت چنده؟', "sA'at chande?", 'ساعت'),
    p('دیروز بازار رَفتَم.', 'diruz bAzAr raftam.', 'Yesterday I went to the bazaar.', null, null, 'دیروز'),
    p('هَر روز فارسی می'+Z+'خوانَم.', 'har ruz fArsi mikhAnam.', 'I study Persian every day.', 'هر روز فارسی می‌خونم.', 'har ruz fArsi mikhunam.', 'روز'),
    p('شَب به خانه می'+Z+'رَوَم.', 'shab be khAne miravam.', 'At night I go home.', 'شب می‌رم خونه.', 'shab miram khune.', 'شب'),
    p('این هَفته خِیلی کار دارَم.', 'in hafte kheyli kAr dAram.', 'I have a lot of work this week.', null, null, 'هفته'),
    p('مَدرِسه کُجاست؟', 'madrese kojAst?', 'Where is the school?', null, null, 'مدرسه'),
    p('اِمروز هَوا سَرد است.', 'emruz havA sard ast.', 'It\'s cold today.', 'امروز هوا سرده.', 'emruz havA sarde.', 'سرد'),
    p('یِک سال اینجا بودَم.', 'yek sAl injA budam.', 'I was here for a year.', null, null, 'سال') ] },

  { id:'ph-ask', after:'small', title:'Simple questions', phrases:[
    p('کُجا می'+Z+'رَوی؟', 'kojA miravi?', 'Where are you going?', 'کجا می‌ری؟', 'kojA miri?', 'کجا'),
    p('کِی می'+Z+'آیی؟', 'key miAyi?', 'When are you coming?', 'کی میای؟', 'key miyAy?', 'کی'),
    p('او کیست؟', 'u kist?', 'Who is he / she?', 'اون کیه؟', 'un kiye?', 'او'),
    p('این چیست؟', 'in chist?', 'What is this?', 'این چیه؟', 'in chiye?'),
    p('چَند سال داری؟', 'chand sAl dAri?', 'How old are you?', null, null, 'چند'),
    p('شُما فارسی بَلَدید؟', 'shomA fArsi baladid?', 'Do you speak Persian?', 'شما فارسی بلدین؟', 'shomA fArsi baladin?', 'شما'),
    p('ما اینجا هَستیم.', 'mA injA hastim.', 'We are here.', 'ما اینجاییم.', 'mA injAyim.', 'اینجا'),
    p('آنجا چه هَست؟', 'AnjA che hast?', 'What\'s over there?', 'اونجا چی هست؟', 'unjA chi hast?', 'آنجا'),
    p('مَن نِمی'+Z+'دانَم.', 'man nemidAnam.', 'I don\'t know.', 'من نمی‌دونم.', 'man nemidunam.', 'من'),
    p('لُطفاً آهِسته'+Z+'تَر حَرف بِزَنید.', 'lotfan Aheste-tar harf bezanid.', 'Please speak more slowly.', 'لطفاً آروم‌تر حرف بزنین.', 'lotfan Arumtar harf bezanin.', 'حرف') ] }
];
var PHRASES = [], PBY = {};
PHRASESETS.forEach(function(Ps){
  Ps.phrases.forEach(function(P, i){ P.id = 'p-' + Ps.id.slice(3) + '-' + (i + 1); P.set = Ps.id; P.kind = 'phrase'; PHRASES.push(P); PBY[P.id] = P; });
});

/* Spoken Tehran: the most common differences from written Persian */
var SPOKEN_TIPS = [
  { rule:fi('است')+' (ast, "is") becomes '+fi('ـه')+' (-e)', ex:[['خوب است','khub ast'],['خوبه','khube']] },
  { rule:'â before n or m often becomes u', ex:[['نان · خانه','nAn · khAne'],['نون · خونه','nun · khune']] },
  { rule:'Common verbs get shorter', ex:[['می'+Z+'رَوَم · می'+Z+'خواهَم','miravam · mikhAham'],['می'+Z+'رم · می'+Z+'خوام','miram · mikhAm']] },
  { rule:fi('را')+' (râ, object marker) becomes '+fi('رو')+' (ro) or '+fi('ـو')+' (-o)', ex:[['دَر را بِبَند','dar rA beband'],['درو ببند','daro beband']] },
  { rule:'Polite verb ending -id becomes -in', ex:[['دارید','dArid'],['دارین','dArin']] },
  { rule:fi('چه')+' (che, "what") becomes '+fi('چی')+' (chi)', ex:[['چه هست؟','che hast?'],['چی هست؟','chi hast?']] }
];

/* ---------- Read it: extra simple sentences for the first lessons (few letters known) ---------- */
function rd(id, fa, tr, en, spFa, sp){ var o = { id:'rs-'+id, fa:fa, tr:tr, en:en }; if (spFa){ o.spokenFa = spFa; o.spoken = sp; } return o; }
var READS = [
  rd('baba-nan',   'بابا نان دارَد.',      'bAbA nAn dArad.',     'Dad has bread.',        'بابا نون داره.', 'bAbA nun dAre.'),
  rd('man-nan',    'مَن نان دارَم.',       'man nAn dAram.',      'I have bread.',         'من نون دارم.',   'man nun dAram.'),
  rd('madar-nan',  'مادَر نان دارَد.',     'mAdar nAn dArad.',    'Mom has bread.',        'مادر نون داره.', 'mAdar nun dAre.'),
  rd('madar-birun','مادَر بیرون بود.',     'mAdar birun bud.',    'Mom was outside.'),
  rd('baba-iran',  'بابا دَر ایران بود.',  'bAbA dar irAn bud.',  'Dad was in Iran.'),
  rd('man-birun',  'مَن بیرون بودَم.',     'man birun budam.',    'I was outside.'),
  rd('sib',        'این سیب است.',        'in sib ast.',         'This is an apple.',     'این سیبه.',      'in sibe.'),
  rd('shab',       'شَب است.',            'shab ast.',           'It\'s night.',          'شبه.',           'shabe.'),
  rd('pul',        'این پولِ مَن است.',    'in pul-e man ast.',   'This is my money.',     'این پول منه.',   'in pul-e mane.'),
  rd('salam-baba', 'سَلام، بابا!',         'salAm, bAbA!',        'Hi, Dad!')
];
