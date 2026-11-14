/* =========================================================
   STARTER VOCABULARY (Phase 2) — to be checked by a native speaker
   fa = written form with vowel marks · tr = transliteration (Tehran pronunciation of the written form)
   spokenFa / spoken = everyday Tehran form, only where it clearly differs
   ========================================================= */
function v(fa, tr, en, spFa, sp){ var o = { fa:fa, tr:tr, en:en }; if (spFa){ o.spokenFa = spFa; o.spoken = sp; } return o; }
var THEMES = [
  { id:'greet', title:'Greetings and basics', words:[
    v('سَلام','salAm','hello'), v('خُداحافِظ','khodAhAfez','goodbye'), v('مِرسی','mersi','thanks'),
    v('مُتِشَکِّرَم','moteshakkeram','thank you'), v('لُطفاً','lotfan','please'), v('بَله','bale','yes'),
    v('نَه','na','no'), v('آره','Are','yeah'), v('باشه','bAshe','okay'), v('بِبَخشید','bebakhshid','excuse me, sorry'),
    v('صُبح بِخِیر','sobh bekheyr','good morning'), v('شَب بِخِیر','shab bekheyr','good night'),
    v('خوش آمَدید','khosh Amadid','welcome','خوش اومدین','khosh omadin'), v('اِسم','esm','name'), v('خوب','khub','good, well') ] },
  { id:'family', title:'People and family', words:[
    v('مادَر','mAdar','mother'), v('پِدَر','pedar','father'), v('مامان','mAmAn','mom'), v('بابا','bAbA','dad'),
    v('بَرادَر','barAdar','brother'), v('خواهَر','khAhar','sister'), v('بَچّه','bachche','child'), v('پِسَر','pesar','boy, son'),
    v('دُختَر','dokhtar','girl, daughter'), v('مَرد','mard','man'), v('زَن','zan','woman, wife'), v('دوست','dust','friend'),
    v('خانِواده','khAnevAde','family'), v('پِدَربُزُرگ','pedarbozorg','grandfather'), v('مادَربُزُرگ','mAdarbozorg','grandmother') ] },
  { id:'food', title:'Food and drink', words:[
    v('آب','Ab','water'), v('نان','nAn','bread','نون','nun'), v('چای','chAy','tea'), v('قَهوه','ghahve','coffee'),
    v('شیر','shir','milk'), v('غَذا','ghazA','food'), v('بِرِنج','berenj','rice'), v('گوشت','gusht','meat'),
    v('مُرغ','morgh','chicken'), v('تُخمِ مُرغ','tokhm-e morgh','egg','تخم‌مرغ','tokhmorgh'), v('پَنیر','panir','cheese'),
    v('سیب','sib','apple'), v('میوه','mive','fruit'), v('سَبزی','sabzi','herbs'), v('کَباب','kabAb','kebab') ] },
  { id:'home', title:'Home and things', words:[
    v('خانه','khAne','house, home','خونه','khune'), v('اُتاق','otAgh','room'), v('دَر','dar','door'), v('پَنجَره','panjare','window'),
    v('میز','miz','table, desk'), v('صَندَلی','sandali','chair'), v('تَخت','takht','bed'), v('کِتاب','ketAb','book'),
    v('کیف','kif','bag'), v('کَفش','kafsh','shoe'), v('گوشی','gushi','mobile phone'), v('ماشین','mAshin','car'),
    v('پول','pul','money'), v('کِلید','kelid','key'), v('لِباس','lebAs','clothes') ] },
  { id:'time', title:'Places and time', words:[
    v('شَهر','shahr','city'), v('خیابان','khiyAbAn','street','خیابون','khiyAbun'), v('مَدرِسه','madrese','school'),
    v('کار','kAr','work, job'), v('بازار','bAzAr','bazaar, market'), v('روز','ruz','day'), v('شَب','shab','night'),
    v('صُبح','sobh','morning'), v('اِمروز','emruz','today'), v('فَردا','fardA','tomorrow'), v('دیروز','diruz','yesterday'),
    v('ساعَت',"sA'at",'hour, clock'), v('هَفته','hafte','week'), v('ماه','mAh','month, moon'), v('سال','sAl','year') ] },
  { id:'describe', title:'Describing things', words:[
    v('بُزُرگ','bozorg','big'), v('کوچَک','kuchak','small','کوچیک','kuchik'), v('گَرم','garm','warm'), v('سَرد','sard','cold'),
    v('نو','no','new'), v('کُهنه','kohne','old (things)'), v('قَشَنگ','ghashang','pretty'), v('زیاد','ziyAd','a lot, many'),
    v('کَم','kam','a little, few'), v('بَد','bad','bad'), v('سَفید','sefid','white'), v('سیاه','siyAh','black'),
    v('قِرمِز','ghermez','red'), v('آبی','Abi','blue'), v('سَبز','sabz','green') ] },
  { id:'verbs', title:'Everyday verbs', words:[
    v('رَفتَن','raftan','to go'), v('آمَدَن','Amadan','to come','اومدن','omadan'), v('خوردَن','khordan','to eat'),
    v('نوشیدَن','nushidan','to drink'), v('خواندَن','khAndan','to read','خوندن','khundan'), v('نِوِشتَن','neveshtan','to write'),
    v('دیدَن','didan','to see'), v('گُفتَن','goftan','to say'), v('داشتَن','dAshtan','to have'), v('کَردَن','kardan','to do'),
    v('خوابیدَن','khAbidan','to sleep'), v('دانِستَن','dAnestan','to know'), v('خواستَن','khAstan','to want'),
    v('کار کَردَن','kAr kardan','to work'), v('حَرف زَدَن','harf zadan','to talk') ] },
  { id:'small', title:'Question words and pronouns', words:[
    v('چه','che','what','چی','chi'), v('کی','ki','who'), v('کُجا','kojA','where'), v('کِی','key','when'),
    v('چِرا','cherA','why'), v('چِطور','chetor','how'), v('چَند','chand','how many'), v('مَن','man','I, me'),
    v('تو','to','you'), v('او','u','he, she'), v('ما','mA','we'), v('شُما','shomA','you (polite, plural)'),
    v('اینجا','injA','here'), v('آنجا','AnjA','there','اونجا','unjA') ] }
];
var VOCAB = [], VBY = {};
THEMES.forEach(function(T){
  T.words.forEach(function(W){
    var base = 'v-' + W.tr.replace(/[^A-Za-z]/g,'').toLowerCase(), id = base, k = 2;
    while (VBY[id]) id = base + (k++);
    W.id = id; W.theme = T.id; VOCAB.push(W); VBY[id] = W;
  });
});
