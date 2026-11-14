/* ---------------------------------------------------------
   HANDWRITING STROKES (drawn approximations, right to left)
   viewBox 0 0 300 220, baseline y = 130.
   Each form: list of steps in writing order.
   {d, at} = pen stroke (at = where the direction arrow sits, 0–1)
   {dots:[[x,y],…]} = dot(s), added together as one step.
   --------------------------------------------------------- */
var BEND_IN  = 'M232 130 L162 130 Q152 130 152 100 Q152 130 142 130 L74 130'; // tooth in the middle of a word
var TOOTH_ST = 'M196 100 Q200 130 181 130 L100 130';                          // tooth at the start of a word

/* Hand-tuned letters from Lesson 1 (reviewed: alef, be) */
var STROKES = {
  alef: { alone:[ {d:'M150 30 L150 130'} ],
          start:[ {d:'M150 58 L150 130'}, {d:'M180 30 Q169 16 157 27 Q145 38 128 26', madda:true, at:0.8} ],
          end:  [ {d:'M212 130 L162 130 Q150 130 150 118 L150 30', at:0.75} ] },
  be:   { alone:[ {d:'M235 100 Q240 130 218 130 L82 130 Q62 130 62 106'}, {dots:[[150,160]]} ],
          start:[ {d:TOOTH_ST}, {dots:[[180,160]]} ],
          middle:[ {d:BEND_IN, at:0.85}, {dots:[[152,160]]} ],
          end:  [ {d:'M262 130 L216 130 Q206 130 206 102 Q206 130 192 130 L92 130 Q68 130 68 106', at:0.7}, {dots:[[150,160]]} ] },
  dal:  { alone:[ {d:'M128 62 L176 118 Q184 130 168 130 L112 130', at:0.3} ],
          end:  [ {d:'M262 130 L192 130'}, {d:'M140 62 L184 118 Q190 130 176 130 L118 130', at:0.3} ] },
  re:   { alone:[ {d:'M178 108 Q176 130 166 146 Q148 176 104 180', at:0.65} ],
          end:  [ {d:'M262 130 L180 130 Q170 132 164 146 Q148 176 104 180', at:0.75} ] },
  mim:  { alone:[ {d:'M137 124 C137 100 165 100 165 118 C165 132 142 133 137 126 L137 200', at:0.85} ],
          start:[ {d:'M137 124 C137 100 165 100 165 118 C165 130 146 131 137 130 L60 130', at:0.8} ],
          middle:[ {d:'M262 130 L168 130 C168 106 136 106 136 122 C136 136 156 138 162 130 L50 130', at:0.86} ],
          end:  [ {d:'M262 130 L168 130 C168 106 136 106 136 122 C136 136 156 138 160 130 L142 130 Q136 132 136 150 L136 200', at:0.9} ] },
  nun:  { alone:[ {d:'M212 92 Q218 132 196 150 Q150 182 106 150 Q92 136 96 112'}, {dots:[[155,88]]} ],
          start:[ {d:TOOTH_ST}, {dots:[[190,80]]} ],
          middle:[ {d:BEND_IN, at:0.85}, {dots:[[152,78]]} ],
          end:  [ {d:'M262 130 L212 130 Q216 146 198 158 Q152 186 110 156 Q96 144 100 120'}, {dots:[[155,98]]} ] }
};

/* Base shapes shared by letter families (no dots). DRAFT — to be reviewed. */
var SHAPES = {
  be: { alone:[ {d:'M235 100 Q240 130 218 130 L82 130 Q62 130 62 106'} ],
        start:[ {d:TOOTH_ST} ], middle:[ {d:BEND_IN, at:0.85} ],
        end:[ {d:'M262 130 L216 130 Q206 130 206 102 Q206 130 192 130 L92 130 Q68 130 68 106', at:0.7} ] },
  dal: STROKES.dal,
  re:  STROKES.re,
  jim: { alone:[ {d:'M112 94 Q146 82 182 98 L120 134 Q94 152 102 176 Q112 196 172 190', at:0.35} ],
         start:[ {d:'M112 96 Q146 84 182 100 L128 130 L70 130', at:0.45} ],
         middle:[ {d:'M262 130 L206 130 Q190 130 182 102 Q156 90 126 100 Q122 118 110 130 L50 130', at:0.9} ],
         end:[ {d:'M262 130 L210 130 Q194 130 186 104 Q160 90 128 100 L170 126 Q112 146 112 174 Q116 196 172 190', at:0.55} ] },
  sin: { alone:[ {d:'M236 100 Q238 130 226 130 Q214 130 214 110 Q214 130 202 130 Q190 130 190 110 Q190 132 178 142 Q154 164 118 158 Q92 152 90 128', at:0.8} ],
         start:[ {d:'M222 100 Q224 130 212 130 Q200 130 200 110 Q200 130 188 130 Q176 130 176 110 Q176 130 164 130 L90 130', at:0.85} ],
         middle:[ {d:'M262 130 L234 130 Q224 130 224 110 Q224 130 212 130 Q200 130 200 110 Q200 130 188 130 Q176 130 176 110 Q176 130 164 130 L70 130', at:0.88} ],
         end:[ {d:'M262 130 L236 130 Q226 130 226 110 Q226 130 214 130 Q202 130 202 110 Q202 130 190 130 Q178 130 178 110 Q178 134 166 144 Q144 164 114 158 Q90 152 88 128', at:0.82} ] },
  sad: { alone:[ {d:'M196 130 Q192 104 222 102 Q248 102 238 124 Q232 130 196 130 L186 130 Q176 130 176 110 Q176 134 164 144 Q142 162 112 156 Q90 150 88 128', at:0.8} ],
         start:[ {d:'M196 130 Q192 104 222 102 Q248 102 238 124 Q232 130 196 130 L186 130 Q176 130 176 110 Q176 130 164 130 L80 130', at:0.88} ],
         middle:[ {d:'M262 130 L190 130 Q186 104 216 102 Q242 102 232 124 Q226 130 194 130 L180 130 Q170 130 170 110 Q170 130 158 130 L70 130', at:0.9} ],
         end:[ {d:'M262 130 L190 130 Q186 104 216 102 Q242 102 232 124 Q226 130 194 130 L180 130 Q170 130 170 110 Q170 134 158 144 Q136 162 108 156 Q88 150 86 128', at:0.85} ] },
  ta:  { alone:[ {d:'M150 130 Q146 104 180 102 Q206 102 196 124 Q190 130 150 130 L112 130', at:0.92}, {d:'M152 36 L152 126'} ],
         start:[ {d:'M150 130 Q146 104 180 102 Q206 102 196 124 Q190 130 150 130 L70 130', at:0.92}, {d:'M152 36 L152 126'} ],
         middle:[ {d:'M262 130 L200 130 Q206 104 178 102 Q148 104 150 128 L150 130 L60 130', at:0.15}, {d:'M152 36 L152 126'} ],
         end:[ {d:'M262 130 L200 130 Q206 104 178 102 Q148 104 150 128 L150 130 L112 130', at:0.15}, {d:'M152 36 L152 126'} ] },
  eyn: { alone:[ {d:'M178 96 Q152 86 140 102 Q134 120 168 124 L118 140 Q94 156 102 178 Q112 196 168 190', at:0.5} ],
         start:[ {d:'M180 98 Q154 88 142 104 Q136 124 168 130 L80 130', at:0.85} ],
         middle:[ {d:'M262 130 L184 130 Q178 104 160 104 Q142 104 150 122 Q156 130 144 130 L60 130', at:0.88} ],
         end:[ {d:'M262 130 L184 130 Q178 104 160 104 Q142 104 150 122 L116 140 Q94 156 102 178 Q112 196 168 190', at:0.15} ] },
  fe:  { alone:[ {d:'M206 128 Q184 118 192 102 Q204 90 214 108 Q218 130 196 130 L86 130 Q64 130 64 106', at:0.7} ],
         start:[ {d:'M206 128 Q184 118 192 102 Q204 90 214 108 Q218 130 196 130 L100 130', at:0.85} ],
         middle:[ {d:'M262 130 L222 130 Q206 130 198 116 Q194 100 208 98 Q222 100 216 120 Q212 130 196 130 L80 130', at:0.88} ],
         end:[ {d:'M262 130 L222 130 Q206 130 198 116 Q194 100 208 98 Q222 100 216 120 Q212 130 196 130 L86 130 Q64 130 64 106', at:0.75} ] },
  qaf: { alone:[ {d:'M206 128 Q184 118 192 102 Q204 90 214 108 Q220 134 202 148 Q164 176 118 156 Q96 146 96 124', at:0.7} ],
         end:[ {d:'M262 130 L222 130 Q206 130 198 116 Q194 100 208 98 Q222 100 218 120 Q220 136 202 150 Q164 176 118 156 Q96 146 96 124', at:0.75} ] },
  kaf: { alone:[ {d:'M198 40 L204 120 Q206 130 194 130 L86 130 Q64 130 64 106', at:0.7}, {d:'M196 66 L152 90'} ],
         start:[ {d:'M198 40 L204 122 Q206 130 194 130 L96 130', at:0.3}, {d:'M196 66 L152 90'} ],
         middle:[ {d:'M262 130 L80 130', at:0.8}, {d:'M200 40 L204 126'}, {d:'M196 66 L152 90'} ],
         end:[ {d:'M262 130 L86 130 Q64 130 64 106', at:0.7}, {d:'M200 40 L204 126'}, {d:'M196 66 L152 90'} ] },
  gaf: { alone:[ {d:'M198 40 L204 120 Q206 130 194 130 L86 130 Q64 130 64 106', at:0.7}, {d:'M196 58 L152 82'}, {d:'M196 80 L152 104'} ],
         start:[ {d:'M198 40 L204 122 Q206 130 194 130 L96 130', at:0.3}, {d:'M196 58 L152 82'}, {d:'M196 80 L152 104'} ],
         middle:[ {d:'M262 130 L80 130', at:0.8}, {d:'M200 40 L204 126'}, {d:'M196 58 L152 82'}, {d:'M196 80 L152 104'} ],
         end:[ {d:'M262 130 L86 130 Q64 130 64 106', at:0.7}, {d:'M200 40 L204 126'}, {d:'M196 58 L152 82'}, {d:'M196 80 L152 104'} ] },
  lam: { alone:[ {d:'M200 30 L200 122 Q200 152 168 162 Q128 172 104 150 Q92 138 96 118', at:0.3} ],
         start:[ {d:'M180 30 L180 122 Q180 130 168 130 L96 130', at:0.3} ],
         middle:[ {d:'M262 130 L70 130', at:0.8}, {d:'M180 30 L180 128'} ],
         end:[ {d:'M262 130 L204 130'}, {d:'M200 30 L200 122 Q200 152 168 162 Q128 172 104 150 Q92 138 96 118', at:0.3} ] },
  vav: { alone:[ {d:'M188 128 Q168 120 174 104 Q184 92 198 104 Q206 118 198 136 Q184 164 140 178', at:0.8} ],
         end:[ {d:'M262 130 L208 130 Q194 130 188 118 Q180 100 196 98 Q210 98 206 120 Q200 150 148 176', at:0.85} ] },
  he:  { alone:[ {d:'M160 92 Q126 96 128 120 Q132 138 160 134 Q186 128 180 108 Q174 92 160 92', at:0.3} ],
         start:[ {d:'M170 84 Q138 104 146 126 Q152 136 180 131 Q200 126 190 108 Q180 94 166 112 Q158 126 146 130 L90 130', at:0.93} ],
         middle:[ {d:'M262 130 L180 130 Q194 112 172 104 Q152 104 160 128 Q164 148 152 154 Q138 154 146 130 L70 130', at:0.92} ],
         end:[ {d:'M262 130 L180 130 Q156 130 154 112 Q156 92 176 98 Q194 106 178 128', at:0.25} ] },
  ye:  { alone:[ {d:'M196 92 Q178 92 176 106 Q176 120 200 126 Q224 134 206 150 Q178 170 128 162 Q100 156 96 134', at:0.75} ],
         end:[ {d:'M262 130 L216 130 Q204 130 204 142 Q202 154 184 160 Q154 168 124 160 Q100 152 98 132', at:0.7} ] }
};

/* Where dots go for each shape and position: x, y above (up), y below (dn) */
var ANCHOR = {
  be:  { alone:{x:150,up:104,dn:160}, start:{x:186,up:80,dn:160}, middle:{x:152,up:80,dn:160}, end:{x:150,up:108,dn:160} },
  dal: { alone:{x:124,up:42}, end:{x:136,up:42} },
  re:  { alone:{x:184,up:88}, end:{x:170,up:104} },
  jim: { alone:{x:142,dn:156,up:66}, start:{x:142,dn:156,up:70}, middle:{x:152,dn:154,up:76}, end:{x:146,dn:162,up:76} },
  sin: { alone:{x:212,up:82}, start:{x:199,up:82}, middle:{x:200,up:82}, end:{x:202,up:82} },
  sad: { alone:{x:218,up:80}, start:{x:218,up:80}, middle:{x:212,up:80}, end:{x:212,up:80} },
  ta:  { alone:{x:184,up:82}, start:{x:184,up:82}, middle:{x:182,up:82}, end:{x:182,up:82} },
  eyn: { alone:{x:160,up:72}, start:{x:162,up:74}, middle:{x:160,up:82}, end:{x:160,up:82} },
  fe:  { alone:{x:204,up:76}, start:{x:204,up:76}, middle:{x:208,up:76}, end:{x:208,up:76} },
  qaf: { alone:{x:204,up:76}, end:{x:208,up:76} }
};
function dotGroup(n, x, y, below){
  if (n === 1) return [[x, y]];
  if (n === 2) return [[x - 11, y], [x + 11, y]];
  return below ? [[x - 11, y], [x + 11, y], [x, y + 17]] : [[x - 11, y], [x + 11, y], [x, y - 17]];
}
/* Letter → shape + dots. pos-specific shape where a letter borrows another shape. */
var BUILD = {
  pe:   { shape:'be', n:3, below:true },
  te:   { shape:'be', n:2 },
  se:   { shape:'be', n:3 },
  ye:   { shape:{ start:'be', middle:'be', alone:'ye', end:'ye' }, n:{ start:2, middle:2 }, below:true },
  jim:  { shape:'jim', n:1, below:true },
  che:  { shape:'jim', n:3, below:true },
  he2:  { shape:'jim' },
  khe:  { shape:'jim', n:1 },
  zal:  { shape:'dal', n:1 },
  ze:   { shape:'re', n:1 },
  zhe:  { shape:'re', n:3 },
  sin:  { shape:'sin' },
  shin: { shape:'sin', n:3 },
  sad:  { shape:'sad' },
  zad:  { shape:'sad', n:1 },
  ta:   { shape:'ta' },
  za:   { shape:'ta', n:1 },
  eyn:  { shape:'eyn' },
  gheyn:{ shape:'eyn', n:1 },
  fe:   { shape:'fe', n:1 },
  qaf:  { shape:{ start:'fe', middle:'fe', alone:'qaf', end:'qaf' }, n:2 },
  kaf:  { shape:'kaf' }, gaf:{ shape:'gaf' }, lam:{ shape:'lam' }, vav:{ shape:'vav' }, he:{ shape:'he' }
};

function strokesFor(L, k){
  var pos = POS[k];
  if (!L.joins){ if (pos === 'start') pos = 'alone'; if (pos === 'middle') pos = 'end'; }
  var own = STROKES[L.id];
  if (own){ return own[POS[k]] || own[pos]; }
  var b = BUILD[L.id]; if (!b) return null;
  var shape = typeof b.shape === 'string' ? b.shape : b.shape[pos];
  var base = SHAPES[shape][pos]; if (!base) return null;
  var n = typeof b.n === 'object' ? (b.n[pos] || 0) : (b.n || 0);
  var steps = base.slice();
  if (n){
    var a = (ANCHOR[shape] || {})[pos] || { x:150, up:90, dn:160 };
    steps.push({ dots: dotGroup(n, a.x, b.below ? a.dn : a.up, !!b.below) });
  }
  return steps;
}
