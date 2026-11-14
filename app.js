/* ===================== Melody 的班级工作台 ===================== */
/* 纯前端 · localStorage 持久化 · 吉卜力可爱风 */
/* 数据模型：班级(classes) → 学员(students) → 宠物/积分/服装 */

const SAVE_KEY = 'classPetWorkbench_v2';

/* 物种定义：身体色 / 点缀色 / 稀有度 / 领养价 */
const SPECIES = {
  dango:    { name:'团子精灵', body:'#ffd6e0', accent:'#fff3b0', rarity:'common', cost:30 },
  cat:      { name:'喵喵猫',   body:'#f7c59f', accent:'#fff',    rarity:'common', cost:30 },
  bunny:    { name:'蹦蹦兔',   body:'#f3e9dc', accent:'#ffd6e0', rarity:'common', cost:30 },
  bird:     { name:'啾啾鸟',   body:'#a8d8ea', accent:'#ffe066', rarity:'rare',   cost:80 },
  fox:      { name:'火火狐',   body:'#ff9a76', accent:'#fff',    rarity:'rare',   cost:80 },
  dog:      { name:'旺旺狗',   body:'#d4a574', accent:'#f5e6d3', rarity:'rare',   cost:80 },
  dragon:   { name:'云朵龙',   body:'#b8e0d2', accent:'#fff3b0', rarity:'legend', cost:100 },
  pig:      { name:'猪猪侠',   body:'#f8b8c8', accent:'#ff9fb0', rarity:'legend', cost:100 },
  elephant: { name:'大象宝',   body:'#a8b8c8', accent:'#c8d8e8', rarity:'legend', cost:100 },
};

/* 服装定义：插槽类型 / 颜色 / 价格 / 渲染样式 */
const CLOTHES = {
  /* 背景（新增品类） */
  cloud_bg:      { type:'bg', name:'云朵天空', color:'#a8d8ea', price:18, emoji:'☁️', style:'cloud' },
  starry_bg:     { type:'bg', name:'璀璨星空', color:'#2d3561', price:25, emoji:'🌌', style:'starry' },
  sakura_bg:     { type:'bg', name:'浪漫樱花', color:'#ffd6e0', price:22, emoji:'🌸', style:'sakura' },
  rainbow_bg:    { type:'bg', name:'彩虹大地', color:'#a5d6a7', price:28, emoji:'🌈', style:'rainbow' },
  ocean_bg:      { type:'bg', name:'海底世界', color:'#64b5f6', price:24, emoji:'🌊', style:'ocean' },
  candy_bg:      { type:'bg', name:'糖果世界', color:'#ffb6c1', price:26, emoji:'🍬', style:'candy' },
  aurora_bg:     { type:'bg', name:'极光夜空', color:'#5f27cd', price:30, emoji:'🌌', style:'aurora' },
  forest_bg:     { type:'bg', name:'森林清晨', color:'#a5d6a7', price:22, emoji:'🌲', style:'forest' },
  desert_bg:     { type:'bg', name:'沙漠黄昏', color:'#f5c27a', price:26, emoji:'🏜️', style:'desert' },
  snow_bg:       { type:'bg', name:'雪山冬景', color:'#dceefb', price:24, emoji:'🏔️', style:'snow' },
  space_bg:      { type:'bg', name:'星际太空', color:'#1a1a2e', price:32, emoji:'🚀', style:'space' },
  castle_bg:     { type:'bg', name:'童话城堡', color:'#c8b6e2', price:30, emoji:'🏰', style:'castle' },
  /* 帽子 */
  straw_hat:     { type:'hat', name:'草帽',     color:'#e8c879', price:15,  emoji:'👒', style:'straw' },
  party_hat:     { type:'hat', name:'派对帽',   color:'#ff6b81', price:18,  emoji:'🥳', style:'party' },
  beret:         { type:'hat', name:'贝雷帽',   color:'#e17055', price:15,  emoji:'🎩', style:'beret' },
  flower_crown:  { type:'hat', name:'花环',     color:'#ff9ff3', price:25,  emoji:'🌸', style:'flower' },
  wizard_hat:    { type:'hat', name:'巫师帽',   color:'#6c5ce7', price:28,  emoji:'🧙', style:'wizard' },
  crown:         { type:'hat', name:'小王冠',   color:'#ffd700', price:40,  emoji:'👑', style:'crown' },
  santa_hat:     { type:'hat', name:'圣诞帽',   color:'#e74c3c', price:18,  emoji:'🎅', style:'santa' },
  bunny_band:     { type:'hat', name:'兔耳发箍', color:'#ffffff', price:22,  emoji:'🐰', style:'bunnyband' },
  mushroom_hat:  { type:'hat', name:'蘑菇帽',   color:'#e17055', price:20,  emoji:'🍄', style:'mushroom' },
  grad_cap:      { type:'hat', name:'学士帽',   color:'#2d3436', price:24,  emoji:'🎓', style:'grad' },
  sailor_cap:    { type:'hat', name:'水手帽',   color:'#f5f6fa', price:20,  emoji:'⚓', style:'sailorcap' },
  strawberry_hat:{ type:'hat', name:'草莓帽',   color:'#ff6b81', price:22,  emoji:'🍓', style:'strawberry' },
  chef_hat:      { type:'hat', name:'厨师帽',   color:'#ffffff', price:20,  emoji:'👨‍🍳', style:'chef' },
  /* 发型 */
  bowl_cut:      { type:'hair', name:'锅盖头',   color:'#4a3520', price:10,  emoji:'✂️', style:'bowl' },
  ponytail:      { type:'hair', name:'双马尾',   color:'#8b4513', price:12,  emoji:'🎀', style:'ponytail' },
  spiky_hair:    { type:'hair', name:'刺猬头',   color:'#2d3436', price:10,  emoji:'🦔', style:'spiky' },
  long_hair:     { type:'hair', name:'飘逸长发', color:'#a0522d', price:14,  emoji:'💇', style:'long' },
  afro:          { type:'hair', name:'爆炸头',   color:'#1e1e1e', price:16,  emoji:'🎓', style:'afro' },
  bun_hair:      { type:'hair', name:'丸子头',   color:'#3d2b1f', price:12,  emoji:'🍡', style:'bun' },
  curly_hair:    { type:'hair', name:'卷卷发',   color:'#6d4c41', price:14,  emoji:'🌀', style:'curly' },
  mint_hair:     { type:'hair', name:'薄荷短发', color:'#55b98a', price:16,  emoji:'🌿', style:'mint' },
  /* 眼镜 */
  star_glasses:  { type:'glasses', name:'星星眼镜', color:'#ffd966', price:10, emoji:'👓', style:'star' },
  round_glasses: { type:'glasses', name:'圆框眼镜', color:'#2d3436', price:12, emoji:'🤓', style:'round' },
  sunglasses:    { type:'glasses', name:'太阳镜',   color:'#1a1a2e', price:14, emoji:'😎', style:'sun' },
  heart_glasses: { type:'glasses', name:'爱心眼镜', color:'#ff6b81', price:16, emoji:'😍', style:'heart' },
  rainbow_shades:{ type:'glasses', name:'彩虹墨镜', color:'#a29bfe', price:18, emoji:'🌈', style:'rainsun' },
  moon_glasses:  { type:'glasses', name:'月牙眼镜', color:'#ffd966', price:16, emoji:'🌙', style:'moon' },
  pixel_glasses: { type:'glasses', name:'像素眼镜', color:'#00b894', price:18, emoji:'🎮', style:'pixel' },
  /* 围巾 */
  red_scarf:     { type:'scarf', name:'红围巾',   color:'#e8607a', price:10, emoji:'🧣', style:'plain' },
  fluffy_scarf:  { type:'scarf', name:'毛绒围巾', color:'#fab1a0', price:14, emoji:'🧶', style:'fluffy' },
  rainbow_scarf: { type:'scarf', name:'彩虹围巾', color:'#a29bfe', price:18, emoji:'🌈', style:'rainbow' },
  bell_scarf:    { type:'scarf', name:'铃铛围巾', color:'#e17055', price:16, emoji:'🔔', style:'bell' },
  star_scarf:    { type:'scarf', name:'星星围巾', color:'#6c5ce7', price:18, emoji:'⭐', style:'star' },
  /* 衣服套装 */
  hoodie:        { type:'outfit', name:'连帽衫',   color:'#00b894', price:16,  emoji:'🧥', style:'hoodie' },
  overalls:      { type:'outfit', name:'背带裤',   color:'#fdcb6e', price:14,  emoji:'👖', style:'overalls' },
  sailor:        { type:'outfit', name:'水手服',   color:'#0984e3', price:18,  emoji:'⚓', style:'sailor' },
  blue_dress:    { type:'outfit', name:'小蓝裙',   color:'#7ec8e3', price:20,  emoji:'👗', style:'dress' },
  superhero:     { type:'outfit', name:'超人披风', color:'#e74c3c', price:24,  emoji:'🦸', style:'cape' },
  kimono:        { type:'outfit', name:'和服',     color:'#fd79a8', price:26,  emoji:'👘', style:'kimono' },
  tuxedo:        { type:'outfit', name:'小礼服',   color:'#2d3436', price:28,  emoji:'🤵', style:'tux' },
  princess_dress:{ type:'outfit', name:'公主裙',   color:'#ff9ff3', price:30,  emoji:'👸', style:'princess' },
  sport_suit:    { type:'outfit', name:'运动服',   color:'#e17055', price:15,  emoji:'⚽', style:'sport' },
  dino_pajamas:  { type:'outfit', name:'恐龙睡衣', color:'#55b98a', price:22,  emoji:'🦖', style:'dino' },
  qipao:         { type:'outfit', name:'小旗袍',   color:'#c0392b', price:24,  emoji:'🏮', style:'qipao' },
  astronaut:     { type:'outfit', name:'宇航服',   color:'#dfe6e9', price:32,  emoji:'🧑‍🚀', style:'astro' },
  /* 翅膀 */
  butterfly:     { type:'wings', name:'蝴蝶翅膀', color:'#fd79a8', price:28,  emoji:'🦋', style:'butterfly' },
  dragonfly:     { type:'wings', name:'蜻蜓翅膀', color:'#81ecec', price:26,  emoji:'🪰', style:'dragonfly' },
  wings:         { type:'wings', name:'闪光翅膀', color:'#ffd1dc', price:30,  emoji:'🪽', style:'feather' },
  demon_wings:   { type:'wings', name:'恶魔翅膀', color:'#6c5ce7', price:32,  emoji:'😈', style:'demon' },
  angel_wings:   { type:'wings', name:'天使翅膀', color:'#ffffff', price:36,  emoji:'😇', style:'angel' },
  star_wings:    { type:'wings', name:'星光翅膀', color:'#ffe066', price:34,  emoji:'🌟', style:'star' },
};

/* 等级无上限：Lv.n 需要 5*n*(n-1)/2 次累计照料（Lv2→5, Lv3→15, Lv4→30, Lv5→50, Lv6→75 …） */
function careThreshold(lv){ return lv<=1 ? 0 : Math.floor(5*lv*(lv-1)/2); }
/* 体型缩放：每级 +0.12，上限 1.6 防止溢出 SVG 画布 */
function levelScale(lv){ return Math.min(0.74 + (lv-1)*0.12, 1.6); }
const CREATE_COST = 120;
const CARE_COST = 1;          // 每次照料消耗积分
const CARE_DAILY_MAX = 5;     // 每天每项最多次数

/* ---------- 状态 ---------- */
let state = load() || defaultState();
let currentView = 'home';
let selectedPetId = null;

function defaultState(){
  return {
    currentClass: null,
    currentStudent: null,
    personalStudents: [],
    classes: [],
    log: [],
  };
}

function isPersonalMode(){ return state.currentClass === '__personal__'; }
/* 兼容旧版 v1 数据迁移 */
function load(){
  try{
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if(d && d.classes){
      if(!d.personalStudents) d.personalStudents = [];
      /* 迁移：移除旧版初始默认班级「三年二班」（仅匹配原始默认学生时） */
      const defaultNames = ['小爱','小明','乐乐'];
      const before = d.classes.length;
      d.classes = d.classes.filter(c => {
        if(c.name !== '三年二班') return true;
        const names = (c.students||[]).map(s=>s.name);
        return JSON.stringify(names) !== JSON.stringify(defaultNames);
      });
      if(d.classes.length !== before){
        /* 默认班级被移除，修正 currentClass/currentStudent */
        const hasPersonal = d.personalStudents && d.personalStudents.length > 0;
        const hasClass = d.classes.length > 0;
        if(hasPersonal){
          d.currentClass = '__personal__';
          d.currentStudent = d.personalStudents[0].name;
        } else if(hasClass){
          d.currentClass = d.classes[0].name;
          d.currentStudent = d.classes[0].students[0]?.name || null;
        } else {
          d.currentClass = null;
          d.currentStudent = null;
        }
      }
      return d;
    }
    /* 迁移 v1（扁平 students） */
    const old = JSON.parse(localStorage.getItem('classPetWorkbench_v1'));
    if(old && old.students){
      old.classes = [{ name:'默认班级', students: old.students }];
      old.currentClass = '默认班级';
      old.personalStudents = [];
      delete old.students;
      return old;
    }
    return null;
  }catch(e){ return null; }
}
function save(){
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  /* 清理旧版 key */
  localStorage.removeItem('classPetWorkbench_v1');
}

/* ---------- 工具 ---------- */
function curClass(){ if(isPersonalMode()) return null; return state.classes.find(c=>c.name===state.currentClass); }
function classStudents(){ if(isPersonalMode()) return state.personalStudents||[]; const c=curClass(); return c?c.students:[]; }
function cur(){ return classStudents().find(s=>s.name===state.currentStudent); }
function findStudent(name){ return classStudents().find(s=>s.name===name); }
function totalCare(p){ return (p.feed||0)+(p.bath||0)+(p.play||0); }
function levelOf(p){ const t=totalCare(p); return Math.max(1, Math.floor((1+Math.sqrt(1+8*t/5))/2)); }
function nextThreshold(lv){ return careThreshold(lv+1); }
/* 等级阶段：不同阶段有不同光环颜色、闪烁数量、皇冠类型 */
function levelTier(lv){
  if(lv <= 2)  return { name:'初心', emoji:'🌱', aura:null,      sparkles:0,  crown:null   };
  if(lv <= 4)  return { name:'成长', emoji:'🍃', aura:'#a5d6a7', sparkles:3,  crown:null   };
  if(lv <= 6)  return { name:'蜕变', emoji:'💧', aura:'#64b5f6', sparkles:5,  crown:null   };
  if(lv <= 8)  return { name:'璀璨', emoji:'⭐', aura:'#9c7ede', sparkles:7,  crown:'star' };
  if(lv <= 10) return { name:'王者', emoji:'👑', aura:'#ffd700', sparkles:9,  crown:'crown'};
  return         { name:'传说', emoji:'🌈', aura:'rainbow',sparkles:12, crown:'crown'};
}
function todayStr(){ return new Date().toISOString().slice(0,10); }
/* 获取宠物今日某项照料次数（跨天自动归零） */
function careToday(p, kind){
  const log = p.careLog || (p.careLog={});
  if(log.date !== todayStr()){ log.date = todayStr(); log.feed=0; log.bath=0; log.play=0; }
  return log[kind] || 0;
}
function petById(id){ for(const s of classStudents()){ const p=s.pets.find(x=>x.id===id); if(p) return {pet:p, owner:s}; } return null; }
function avatar(name){ return ['🦊','🐱','🐰','🐤','🌸','⭐','🍀','🌈'][[...name].reduce((a,c)=>a+c.charCodeAt(0),0)%8]; }
function addLog(txt){ state.log.unshift({t:txt, d:new Date().toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}); state.log=state.log.slice(0,30); }

function toast(msg, kind){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + (kind||'');
  clearTimeout(el._t);
  el._t = setTimeout(()=>{ el.className='toast'; }, 1800);
}

/* ---------- 通用弹窗（替代浏览器 prompt / confirm） ---------- */
let _promptResolve = null;
function customPrompt(title, msg, defVal){
  return new Promise(resolve=>{
    _promptResolve = resolve;
    document.getElementById('promptTitle').textContent = title;
    document.getElementById('promptMsg').textContent = msg || '';
    const inp = document.getElementById('promptInput');
    inp.value = defVal || '';
    inp.style.display = 'block';
    document.getElementById('promptModal').style.display = 'flex';
    setTimeout(()=>{ inp.focus(); inp.select(); }, 60);
  });
}
function _okPrompt(){
  const val = document.getElementById('promptInput').value.trim();
  document.getElementById('promptModal').style.display = 'none';
  if(_promptResolve){ _promptResolve(val); _promptResolve = null; }
}
function _closePrompt(val){
  document.getElementById('promptModal').style.display = 'none';
  if(_promptResolve){ _promptResolve(val); _promptResolve = null; }
}
let _confirmResolve = null;
function customConfirm(msg){
  return new Promise(resolve=>{
    _confirmResolve = resolve;
    document.getElementById('confirmMsg').textContent = msg;
    document.getElementById('confirmModal').style.display = 'flex';
  });
}
function _closeConfirm(val){
  document.getElementById('confirmModal').style.display = 'none';
  if(_confirmResolve){ _confirmResolve(val); _confirmResolve = null; }
}

/* ---------- 宠物 SVG 绘制 ---------- */
function earsSVG(sp, body, accent){
  switch(sp){
    case 'cat': return `
      <path d="M62 58 L50 16 L94 44 Z" fill="${body}"/>
      <path d="M158 58 L170 16 L126 44 Z" fill="${body}"/>
      <path d="M64 52 L56 28 L86 44 Z" fill="#ffb6c1"/>
      <path d="M156 52 L164 28 L134 44 Z" fill="#ffb6c1"/>`;
    case 'bunny': return `
      <ellipse cx="78" cy="34" rx="15" ry="36" fill="${body}"/>
      <ellipse cx="142" cy="34" rx="15" ry="36" fill="${body}"/>
      <ellipse cx="78" cy="40" rx="7" ry="24" fill="#ffd6e0"/>
      <ellipse cx="142" cy="40" rx="7" ry="24" fill="#ffd6e0"/>`;
    case 'fox': return `
      <path d="M58 56 L42 14 L94 42 Z" fill="${body}"/>
      <path d="M162 56 L178 14 L126 42 Z" fill="${body}"/>
      <path d="M62 50 L52 26 L86 42 Z" fill="#fff"/>
      <path d="M158 50 L168 26 L134 42 Z" fill="#fff"/>`;
    case 'dog': return `
      <path d="M52 70 q-18 28 -4 54 q16 -8 22 -40 Z" fill="${body}"/>
      <path d="M168 70 q18 28 4 54 q-16 -8 -22 -40 Z" fill="${body}"/>
      <path d="M56 74 q-10 20 -2 38 q10 -6 14 -24 Z" fill="${accent}"/>
      <path d="M164 74 q10 20 2 38 q-10 -6 -14 -24 Z" fill="${accent}"/>`;
    case 'bird': return `<path d="M110 38 q-16 -22 16 -22 q32 0 16 22 Z" fill="${accent}"/>`;
    case 'dragon': return `
      <path d="M84 50 q-6 -28 6 -32 q10 20 -6 32 Z" fill="${accent}"/>
      <path d="M136 50 q6 -28 -6 -32 q-10 20 6 32 Z" fill="${accent}"/>`;
    case 'pig': return `
      <path d="M70 54 q-8 -20 8 -22 q8 14 0 24 Z" fill="${body}"/>
      <path d="M150 54 q8 -20 -8 -22 q-8 14 0 24 Z" fill="${body}"/>
      <path d="M72 52 q-4 -12 5 -14 q4 10 0 16 Z" fill="${accent}"/>
      <path d="M148 52 q4 -12 -5 -14 q-4 10 0 16 Z" fill="${accent}"/>`;
    case 'elephant': return `
      <ellipse cx="42" cy="96" rx="28" ry="38" fill="${body}"/>
      <ellipse cx="178" cy="96" rx="28" ry="38" fill="${body}"/>
      <ellipse cx="46" cy="96" rx="17" ry="24" fill="${accent}"/>
      <ellipse cx="174" cy="96" rx="17" ry="24" fill="${accent}"/>`;
    default: return `<path d="M96 44 q14 -16 28 0 q-14 -6 -28 0 Z" fill="${accent}"/>`;
  }
}

/* ---------- 等级视觉效果 ---------- */
function levelAuraSVG(lv){
  const t = levelTier(lv);
  if(!t.aura) return '';
  if(t.aura === 'rainbow'){
    return `<circle cx="110" cy="120" r="88" fill="#ff6b81" opacity=".1" class="pet-aura"/>
            <circle cx="110" cy="120" r="76" fill="#ffd86b" opacity=".1" class="pet-aura"/>
            <circle cx="110" cy="120" r="64" fill="#64b5f6" opacity=".1" class="pet-aura"/>`;
  }
  return `<circle cx="110" cy="120" r="84" fill="${t.aura}" opacity=".18" class="pet-aura"/>`;
}
function sparkleSVG(lv){
  const t = levelTier(lv);
  if(t.sparkles === 0) return '';
  const pos = [
    {x:28,y:55,d:0},{x:192,y:65,d:.3},{x:35,y:160,d:.6},{x:185,y:150,d:.9},
    {x:18,y:108,d:.2},{x:202,y:108,d:.5},{x:62,y:22,d:.8},{x:158,y:26,d:1.1},
    {x:10,y:140,d:.4},{x:210,y:132,d:.7},{x:78,y:200,d:.3},{x:142,y:205,d:.6}
  ];
  return pos.slice(0, t.sparkles).map(p=>
    `<text x="${p.x}" y="${p.y}" font-size="13" text-anchor="middle" class="pet-sparkle" style="animation-delay:${p.d}s">✨</text>`
  ).join('');
}
function crownSVG(lv){
  const t = levelTier(lv);
  if(!t.crown) return '';
  if(t.crown === 'star')
    return `<text x="110" y="20" font-size="20" text-anchor="middle" class="pet-crown">⭐</text>`;
  let svg = `<text x="110" y="22" font-size="24" text-anchor="middle" class="pet-crown">👑</text>`;
  if(t.name === '传说')
    svg += `<text x="70" y="28" font-size="13" text-anchor="middle" class="pet-sparkle" style="animation-delay:0s">🌟</text>
            <text x="150" y="28" font-size="13" text-anchor="middle" class="pet-sparkle" style="animation-delay:.5s">🌟</text>`;
  return svg;
}

/* 等级身体变化：不同阶段宠物本体外观发生变化 */
function tierBodyDecor(lv, body, accent){
  const t = levelTier(lv);
  if(t.name === '初心') return '';
  let s = '';
  /* 成长：头顶小芽 */
  if(t.name === '成长'){
    s += `<path d="M110 40 q-6 -10 -1 -16 q8 5 3 14 Z" fill="#7ec850"/>
          <path d="M110 38 q5 -8 2 -14 q-7 4 -4 12 Z" fill="#9bd96a"/>`;
  }
  /* 蜕变：肚子发光印记 */
  if(t.name === '蜕变'){
    s += `<ellipse cx="110" cy="170" rx="16" ry="12" fill="${accent}" opacity=".35" class="pet-belly-glow"/>
          <circle cx="110" cy="170" r="6" fill="#fff" opacity=".5" class="pet-belly-glow"/>`;
  }
  /* 璀璨：身体星点 + 肚子微光 */
  if(t.name === '璀璨'){
    s += `<ellipse cx="110" cy="170" rx="14" ry="10" fill="${accent}" opacity=".3" class="pet-belly-glow"/>
          <text x="82" y="172" font-size="11" class="pet-body-sparkle">⭐</text>
          <text x="138" y="172" font-size="11" class="pet-body-sparkle" style="animation-delay:.4s">⭐</text>
          <text x="110" y="198" font-size="9" class="pet-body-sparkle" style="animation-delay:.8s">✨</text>`;
  }
  /* 王者：披风 + 身体宝石点 */
  if(t.name === '王者'){
    s += `<path d="M62 145 Q42 180 55 210 Q78 200 88 178 Z" fill="${accent}" opacity=".35" class="pet-cape"/>
          <path d="M158 145 Q178 180 165 210 Q142 200 132 178 Z" fill="${accent}" opacity=".35" class="pet-cape"/>
          <circle cx="92" cy="185" r="3.5" fill="#fff" opacity=".7"/>
          <circle cx="128" cy="185" r="3.5" fill="#fff" opacity=".7"/>
          <circle cx="110" cy="200" r="3" fill="#fff" opacity=".6"/>`;
  }
  /* 传说：彩虹身体覆盖 + 星阵 */
  if(t.name === '传说'){
    s += `<ellipse cx="110" cy="178" rx="50" ry="44" fill="url(#rainbowGrad)" opacity=".2"/>
          <ellipse cx="110" cy="95" rx="58" ry="54" fill="url(#rainbowGrad)" opacity=".15"/>
          <text x="82" y="172" font-size="11" class="pet-body-sparkle">🌟</text>
          <text x="138" y="172" font-size="11" class="pet-body-sparkle" style="animation-delay:.3s">🌟</text>
          <text x="110" y="200" font-size="10" class="pet-body-sparkle" style="animation-delay:.6s">🌟</text>
          <text x="92" y="195" font-size="8" class="pet-body-sparkle" style="animation-delay:.9s">✨</text>
          <text x="128" y="195" font-size="8" class="pet-body-sparkle" style="animation-delay:1.2s">✨</text>`;
  }
  return s;
}
/* 等级眼睛变化 */
function tierEyes(lv){
  const t = levelTier(lv);
  if(t.name === '初心' || t.name === '成长')
    return `<circle cx="90" cy="92" r="12" fill="#3a3a3a"/><circle cx="130" cy="92" r="12" fill="#3a3a3a"/>
            <circle cx="94" cy="88" r="4" fill="#fff"/><circle cx="134" cy="88" r="4" fill="#fff"/>`;
  if(t.name === '蜕变')
    return `<circle cx="90" cy="92" r="12" fill="#3a3a3a"/><circle cx="130" cy="92" r="12" fill="#3a3a3a"/>
            <circle cx="94" cy="87" r="5" fill="#fff"/><circle cx="134" cy="87" r="5" fill="#fff"/>
            <circle cx="86" cy="95" r="2.5" fill="#fff" opacity=".7"/><circle cx="126" cy="95" r="2.5" fill="#fff" opacity=".7"/>`;
  if(t.name === '璀璨' || t.name === '王者')
    return `<circle cx="90" cy="92" r="12" fill="#3a3a3a"/><circle cx="130" cy="92" r="12" fill="#3a3a3a"/>
            <circle cx="94" cy="88" r="5" fill="#fff"/><circle cx="134" cy="88" r="5" fill="#fff"/>
            <text x="93" y="96" font-size="9" text-anchor="middle" fill="#ffd700" class="pet-eye-sparkle">✦</text>
            <text x="133" y="96" font-size="9" text-anchor="middle" fill="#ffd700" class="pet-eye-sparkle" style="animation-delay:.3s">✦</text>`;
  /* 传说：彩虹星光眼 */
  return `<circle cx="90" cy="92" r="13" fill="#2a2a3a"/><circle cx="130" cy="92" r="13" fill="#2a2a3a"/>
          <circle cx="94" cy="87" r="6" fill="#fff"/><circle cx="134" cy="87" r="6" fill="#fff"/>
          <text x="93" y="97" font-size="10" text-anchor="middle" fill="url(#rainbowGrad)" class="pet-eye-sparkle">✦</text>
          <text x="133" y="97" font-size="10" text-anchor="middle" fill="url(#rainbowGrad)" class="pet-eye-sparkle" style="animation-delay:.3s">✦</text>`;
}
/* 等级腮红变化 */
function tierCheeks(lv){
  const t = levelTier(lv);
  if(t.name === '初心')
    return `<ellipse cx="74" cy="110" rx="9" ry="6" fill="#ffb0c0" opacity=".7"/>
            <ellipse cx="146" cy="110" rx="9" ry="6" fill="#ffb0c0" opacity=".7"/>`;
  if(t.name === '成长')
    return `<ellipse cx="74" cy="110" rx="10" ry="7" fill="#ffb0c0" opacity=".8"/>
            <ellipse cx="146" cy="110" rx="10" ry="7" fill="#ffb0c0" opacity=".8"/>`;
  if(t.name === '蜕变')
    return `<ellipse cx="72" cy="112" rx="11" ry="7" fill="#ff9ab0" opacity=".85"/>
            <ellipse cx="148" cy="112" rx="11" ry="7" fill="#ff9ab0" opacity=".85"/>`;
  if(t.name === '璀璨')
    return `<ellipse cx="72" cy="112" rx="11" ry="7" fill="#ff8aac" opacity=".9"/>
            <ellipse cx="148" cy="112" rx="11" ry="7" fill="#ff8aac" opacity=".9"/>`;
  return `<ellipse cx="70" cy="113" rx="12" ry="8" fill="#ff7aa0" opacity=".9"/>
          <ellipse cx="150" cy="113" rx="12" ry="8" fill="#ff7aa0" opacity=".9"/>`;
}
/* 等级笑容变化 */
function tierSmile(lv){
  const t = levelTier(lv);
  if(t.name === '王者' || t.name === '传说')
    return `<path d="M98 107 q12 13 24 0" stroke="#3a3a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M104 112 q6 4 12 0" stroke="#ff6b81" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`;
  return `<path d="M102 108 q8 8 16 0" stroke="#3a3a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
/* 等级项圈/胸饰变化 */
function tierCollar(lv, accent){
  const t = levelTier(lv);
  if(t.name === '蜕变')
    return `<path d="M82 140 Q110 150 138 140" stroke="${accent}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`;
  if(t.name === '璀璨')
    return `<path d="M80 140 Q110 152 140 140" stroke="#9c7ede" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="110" cy="148" r="4" fill="#9c7ede" opacity=".8"/>`;
  if(t.name === '王者')
    return `<path d="M78 140 Q110 153 142 140" stroke="#ffd700" stroke-width="4" fill="none" stroke-linecap="round"/>
            <circle cx="110" cy="149" r="6" fill="#ff4444" stroke="#ffd700" stroke-width="2"/>`;
  if(t.name === '传说')
    return `<path d="M76 139 Q110 154 144 139" stroke="#ffd700" stroke-width="4" fill="none" stroke-linecap="round"/>
            <polygon points="110,137 119,149 110,161 101,149" fill="url(#gemGrad)" stroke="#fff" stroke-width="1.5" class="pet-gem"/>`;
  return '';
}

function petSVG(pet){
  const sp = SPECIES[pet.species] || SPECIES.dango;
  const body = pet.color || sp.body;
  const accent = pet.accent || sp.accent;
  const lv = levelOf(pet);
  const scale = levelScale(lv);
  const eq = pet.equipped || {};

  const ears = earsSVG(pet.species, body, accent);
  const wings = eq.wings ? renderWings(eq.wings) : '';
  const hair = eq.hair ? renderHair(eq.hair) : '';
  const hat = eq.hat ? renderHat(eq.hat) : '';
  const glasses = eq.glasses ? renderGlasses(eq.glasses) : '';
  const scarf = eq.scarf ? renderScarf(eq.scarf) : '';
  const outfit = eq.outfit ? renderOutfit(eq.outfit) : '';
  const beak = pet.species==='bird' ? `<path d="M103 104 l14 0 l-7 12 Z" fill="#ffb347"/>` : '';
  const snout = pet.species==='pig' ? `<ellipse cx="110" cy="113" rx="17" ry="12" fill="${accent}"/>
      <ellipse cx="103" cy="113" rx="2.5" ry="3.5" fill="#8a5a5a"/><ellipse cx="117" cy="113" rx="2.5" ry="3.5" fill="#8a5a5a"/>` : '';
  const trunk = pet.species==='elephant' ? `<path d="M103 106 q-3 22 3 36 q6 -14 3 -36 q4 14 9 4 q-2 -20 -15 -4 Z" fill="${accent}"/>` : '';
  const faceExtra = beak + snout + trunk;

  const aura = levelAuraSVG(lv);
  const sparkles = sparkleSVG(lv);
  const crown = crownSVG(lv);
  const bodyDecor = tierBodyDecor(lv, body, accent);
  const eyes = tierEyes(lv);
  const cheeks = tierCheeks(lv);
  const smile = tierSmile(lv);
  const collar = tierCollar(lv, accent);
  const bg = eq.bg ? renderBackground(eq.bg) : '';

  return `<svg viewBox="0 0 220 250" class="pet-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff6b81"/>
        <stop offset="33%" stop-color="#ffd86b"/>
        <stop offset="66%" stop-color="#64b5f6"/>
        <stop offset="100%" stop-color="#a084dc"/>
      </linearGradient>
      <radialGradient id="gemGrad">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="50%" stop-color="#64b5f6"/>
        <stop offset="100%" stop-color="#9c7ede"/>
      </radialGradient>
    </defs>
    ${bg}
    ${aura}
    <ellipse cx="110" cy="234" rx="64" ry="12" fill="rgba(80,120,80,.16)"/>
    <g transform="translate(110,118) scale(${scale}) translate(-110,-118)">
      ${wings}
      <ellipse cx="110" cy="178" rx="50" ry="44" fill="${body}"/>
      <ellipse cx="110" cy="95" rx="58" ry="54" fill="${body}"/>
      ${bodyDecor}
      ${ears}
      ${hair}
      ${eyes}
      ${cheeks}
      ${smile}
      ${faceExtra}
      ${collar}
      ${outfit}${scarf}${hat}${glasses}
    </g>
    ${sparkles}
    ${crown}
  </svg>`;
}

/* ---------- 服装 SVG 渲染 ---------- */
function _cl(key, fb){ return CLOTHES[key] || {color:fb, style:'default'}; }

/* ---------- 背景渲染（画在最底层） ---------- */
function renderBackground(key){
  const st = _cl(key,'#a8d8ea').style;
  switch(st){
    case 'cloud': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#d4f0fb"/>
      <ellipse cx="38" cy="42" rx="24" ry="13" fill="#fff" opacity=".9"/>
      <ellipse cx="62" cy="34" rx="18" ry="11" fill="#fff" opacity=".9"/>
      <ellipse cx="182" cy="52" rx="22" ry="12" fill="#fff" opacity=".85"/>
      <ellipse cx="26" cy="196" rx="20" ry="11" fill="#fff" opacity=".75"/>
      <ellipse cx="194" cy="206" rx="18" ry="10" fill="#fff" opacity=".7"/></g>`;
    case 'starry': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#2d3561"/>
      <circle cx="42" cy="38" r="14" fill="#fff9c4"/>
      <circle cx="36" cy="34" r="12" fill="#2d3561"/>
      <text x="170" y="42" font-size="12" fill="#fff">✦</text>
      <text x="62" y="72" font-size="8" fill="#fff" opacity=".8">✦</text>
      <text x="192" y="92" font-size="9" fill="#fff" opacity=".7">✦</text>
      <text x="18" y="152" font-size="10" fill="#fff" opacity=".6">✦</text>
      <text x="200" y="182" font-size="8" fill="#fff" opacity=".7">✦</text>
      <text x="30" y="88" font-size="7" fill="#fff" opacity=".5">✦</text></g>`;
    case 'sakura': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#ffe4ec"/>
      <circle cx="30" cy="36" r="7" fill="#ffb7c5"/><circle cx="30" cy="36" r="2.5" fill="#ffd700"/>
      <circle cx="52" cy="62" r="6" fill="#ffc2cf"/><circle cx="52" cy="62" r="2.2" fill="#ffd700"/>
      <circle cx="188" cy="44" r="7" fill="#ffb7c5"/><circle cx="188" cy="44" r="2.5" fill="#ffd700"/>
      <circle cx="168" cy="72" r="5" fill="#ffc2cf"/><circle cx="168" cy="72" r="2" fill="#ffd700"/>
      <circle cx="26" cy="182" r="6" fill="#ffb7c5"/><circle cx="26" cy="182" r="2.2" fill="#ffd700"/>
      <circle cx="194" cy="192" r="7" fill="#ffb7c5"/><circle cx="194" cy="192" r="2.5" fill="#ffd700"/>
      <ellipse cx="90" cy="26" rx="6" ry="3" fill="#ff9fb8" opacity=".7" transform="rotate(30 90 26)"/>
      <ellipse cx="140" cy="80" rx="6" ry="3" fill="#ff9fb8" opacity=".6" transform="rotate(-25 140 80)"/>
      <ellipse cx="46" cy="130" rx="5" ry="2.5" fill="#ff9fb8" opacity=".6" transform="rotate(50 46 130)"/>
      <ellipse cx="186" cy="140" rx="5" ry="2.5" fill="#ff9fb8" opacity=".6" transform="rotate(-40 186 140)"/></g>`;
    case 'rainbow': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#e0f4ff"/>
      <path d="M30 190 Q110 90 190 190" fill="none" stroke="#ff6b81" stroke-width="9" opacity=".85"/>
      <path d="M42 190 Q110 105 178 190" fill="none" stroke="#ffb347" stroke-width="9" opacity=".85"/>
      <path d="M54 190 Q110 120 166 190" fill="none" stroke="#ffe066" stroke-width="9" opacity=".85"/>
      <path d="M66 190 Q110 135 154 190" fill="none" stroke="#7bed9f" stroke-width="9" opacity=".85"/>
      <path d="M78 190 Q110 150 142 190" fill="none" stroke="#64b5f6" stroke-width="9" opacity=".85"/>
      <ellipse cx="110" cy="212" rx="72" ry="14" fill="#a5d6a7"/>
      <ellipse cx="36" cy="218" rx="24" ry="8" fill="#a5d6a7"/>
      <ellipse cx="184" cy="218" rx="24" ry="8" fill="#a5d6a7"/></g>`;
    case 'ocean': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#bfe6f5"/>
      <path d="M14 58 q12 -10 24 0 q12 10 24 0 q12 -10 24 0" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>
      <path d="M130 40 q12 -10 24 0 q12 10 24 0" fill="none" stroke="#fff" stroke-width="3" opacity=".45"/>
      <circle cx="40" cy="96" r="6" fill="#fff" opacity=".4"/>
      <circle cx="26" cy="116" r="4" fill="#fff" opacity=".35"/>
      <circle cx="196" cy="80" r="5" fill="#fff" opacity=".4"/>
      <rect x="2" y="196" width="216" height="52" rx="18" fill="#7ec8e3" opacity=".65"/>
      <path d="M20 216 q12 -8 24 0 q12 8 24 0 q12 -8 24 0 q12 8 24 0 q12 -8 24 0 q12 8 24 0 q12 -8 24 0" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>
      <text x="36" y="180" font-size="14">🐠</text>
      <text x="176" y="170" font-size="12">🪸</text></g>`;
    case 'candy': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#ffe3ef"/>
      <circle cx="36" cy="42" r="10" fill="none" stroke="#ff6b81" stroke-width="4"/>
      <circle cx="36" cy="42" r="3.5" fill="#fff"/>
      <line x1="36" y1="52" x2="36" y2="70" stroke="#fff" stroke-width="4"/>
      <circle cx="186" cy="50" r="9" fill="none" stroke="#a29bfe" stroke-width="4"/>
      <circle cx="186" cy="50" r="3" fill="#fff"/>
      <text x="26" y="186" font-size="14">🍬</text>
      <text x="180" y="196" font-size="12">🍭</text>
      <text x="60" y="30" font-size="10">🍬</text>
      <text x="160" y="96" font-size="10">🍭</text></g>`;
    case 'aurora': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#1e2749"/>
      <path d="M10 80 q50 -50 90 0 q50 50 100 -20 L210 2 L2 2 Z" fill="#5f27cd" opacity=".55"/>
      <path d="M10 60 q60 -40 100 0 q40 40 96 -14 L210 2 L2 2 Z" fill="#00cec9" opacity=".45"/>
      <path d="M20 42 q50 -28 90 0 q36 28 90 -10 L210 2 L2 2 Z" fill="#a29bfe" opacity=".4"/>
      <text x="40" y="150" font-size="9" fill="#fff" opacity=".8">✦</text>
      <text x="180" y="130" font-size="8" fill="#fff" opacity=".6">✦</text>
      <circle cx="186" cy="60" r="10" fill="#fff9c4" opacity=".9"/></g>`;
    case 'forest': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#e8f5e0"/>
      <ellipse cx="110" cy="18" rx="60" ry="12" fill="#fff" opacity=".8"/>
      <path d="M24 110 L38 62 L52 110 Z" fill="#7cb87c"/>
      <rect x="34" y="108" width="8" height="14" fill="#8a6d4a"/>
      <path d="M160 100 L176 46 L192 100 Z" fill="#5f9e6e"/>
      <rect x="172" y="98" width="9" height="16" fill="#8a6d4a"/>
      <path d="M186 150 L198 116 L210 150 Z" fill="#7cb87c"/>
      <rect x="196" y="148" width="6" height="10" fill="#8a6d4a"/>
      <rect x="2" y="200" width="216" height="48" rx="18" fill="#a5d6a7" opacity=".8"/>
      <circle cx="40" cy="72" r="4" fill="#fff" opacity=".7"/><circle cx="52" cy="64" r="3" fill="#fff" opacity=".7"/>
      <text x="70" y="60" font-size="10">🦋</text></g>`;
    case 'desert': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#fde8c8"/>
      <circle cx="164" cy="52" r="22" fill="#ff9a5a" opacity=".9"/>
      <circle cx="164" cy="52" r="30" fill="none" stroke="#ff9a5a" stroke-width="3" opacity=".4"/>
      <path d="M2 170 q54 -28 108 0 q54 28 108 0 L218 248 L2 248 Z" fill="#f0b45a"/>
      <path d="M2 192 q60 -22 110 0 q50 20 108 -6 L218 248 L2 248 Z" fill="#e0a03e"/>
      <path d="M40 168 q10 -40 26 -2 q-8 -36 0 -34 M56 132 q14 -4 12 6" fill="none" stroke="#3d8b5f" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="150" cy="150" rx="4" ry="8" fill="#8a6d4a"/>
      <text x="60" y="120" font-size="10" opacity=".7">🌵</text></g>`;
    case 'snow': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#e3f2fd"/>
      <path d="M2 130 L60 60 L110 130 Z" fill="#b8d8e8"/>
      <path d="M48 76 L60 60 L72 76 Q60 84 48 76 Z" fill="#fff"/>
      <path d="M90 150 L160 70 L216 150 Z" fill="#a8ccdd"/>
      <path d="M146 90 L160 70 L176 90 Q160 100 146 90 Z" fill="#fff"/>
      <rect x="2" y="190" width="216" height="58" rx="18" fill="#fff"/>
      <circle cx="30" cy="60" r="3" fill="#fff" opacity=".9"/><circle cx="90" cy="40" r="2.5" fill="#fff" opacity=".8"/>
      <circle cx="190" cy="110" r="3" fill="#fff" opacity=".85"/><circle cx="130" cy="30" r="2" fill="#fff" opacity=".7"/>
      <text x="34" y="222" font-size="12">❄️</text><text x="180" y="230" font-size="10">❄️</text></g>`;
    case 'space': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#1a1a2e"/>
      <circle cx="44" cy="48" r="16" fill="#e17055"/><ellipse cx="44" cy="48" rx="26" ry="7" fill="none" stroke="#f5c27a" stroke-width="3" transform="rotate(-18 44 48)"/>
      <circle cx="180" cy="180" r="12" fill="#81ecec"/>
      <text x="120" y="40" font-size="8" fill="#fff" opacity=".9">✦</text>
      <text x="80" y="90" font-size="6" fill="#fff" opacity=".6">✦</text>
      <text x="190" y="90" font-size="7" fill="#fff" opacity=".7">✦</text>
      <text x="30" y="140" font-size="6" fill="#fff" opacity=".5">✦</text>
      <text x="150" y="120" font-size="9" fill="#fff" opacity=".8">✦</text>
      <circle cx="36" cy="200" r="2" fill="#fff" opacity=".7"/><circle cx="200" cy="40" r="2" fill="#fff" opacity=".7"/></g>`;
    case 'castle': return `<g>
      <rect x="2" y="2" width="216" height="246" rx="18" fill="#efe0ff"/>
      <ellipse cx="60" cy="34" rx="26" ry="12" fill="#fff" opacity=".85"/>
      <path d="M150 120 L150 60 L162 40 L174 60 L174 120 Z" fill="#b39ddb"/>
      <path d="M158 46 L158 34 L160 38 L162 30 L164 38 L166 34 L166 46 Z" fill="#ff6b81"/>
      <path d="M182 140 L182 84 L194 66 L206 84 L206 140 Z" fill="#9575cd"/>
      <path d="M190 72 L190 60 L192 64 L194 56 L196 64 L198 60 L198 72 Z" fill="#ff6b81"/>
      <rect x="164" y="100" width="10" height="14" rx="5" fill="#fff3b0"/>
      <path d="M2 190 q110 -20 216 0 L218 248 L2 248 Z" fill="#c8b6e2"/>
      <text x="40" y="80" font-size="10" opacity=".8">⭐</text><text x="110" y="60" font-size="8" opacity=".7">✦</text></g>`;
    default: return '';
  }
}

function renderWings(key){
  const c = _cl(key,'#ffd1dc').color;
  const st = _cl(key).style;
  switch(st){
    case 'angel': return `<g opacity=".88">
      <path d="M40 145 q-40 -10 -34 -52 q30 8 40 36 Z" fill="${c}" stroke="#e8e8e8" stroke-width="1.5"/>
      <path d="M180 145 q40 -10 34 -52 q-30 8 -40 36 Z" fill="${c}" stroke="#e8e8e8" stroke-width="1.5"/></g>`;
    case 'demon': return `<g opacity=".9">
      <path d="M42 148 q-20 -8 -24 -40 q14 -4 24 18 q4 14 0 22 Z" fill="${c}"/>
      <path d="M178 148 q20 -8 24 -40 q-14 -4 -24 18 q-4 14 0 22 Z" fill="${c}"/></g>`;
    case 'butterfly': return `<g opacity=".85">
      <path d="M44 140 q-34 -6 -30 -44 q24 -2 34 28 Z" fill="${c}"/>
      <path d="M176 140 q34 -6 30 -44 q-24 -2 -34 28 Z" fill="${c}"/>
      <circle cx="24" cy="112" r="5" fill="#fff" opacity=".55"/><circle cx="196" cy="112" r="5" fill="#fff" opacity=".55"/></g>`;
    case 'dragonfly': return `<g opacity=".7">
      <ellipse cx="36" cy="118" rx="28" ry="8" fill="${c}" transform="rotate(-20 36 118)"/>
      <ellipse cx="38" cy="142" rx="24" ry="6" fill="${c}" opacity=".8" transform="rotate(-6 38 142)"/>
      <ellipse cx="184" cy="118" rx="28" ry="8" fill="${c}" transform="rotate(20 184 118)"/>
      <ellipse cx="182" cy="142" rx="24" ry="6" fill="${c}" opacity=".8" transform="rotate(6 182 142)"/></g>`;
    case 'star': return `<g opacity=".9">
      <path d="M44 150 q-36 -12 -32 -48 q28 10 36 34 Z" fill="${c}"/>
      <path d="M176 150 q36 -12 32 -48 q-28 10 -36 34 Z" fill="${c}"/>
      <text x="26" y="112" font-size="10">✦</text><text x="44" y="94" font-size="8">✦</text>
      <text x="176" y="94" font-size="8">✦</text><text x="190" y="112" font-size="10">✦</text></g>`;
    default: return `<g opacity=".92">
      <path d="M44 150 q-36 -12 -32 -48 q28 10 36 34 Z" fill="${c}"/>
      <path d="M176 150 q36 -12 32 -48 q-28 10 -36 34 Z" fill="${c}"/></g>`;
  }
}

function renderHair(key){
  const c = _cl(key,'#4a3520').color;
  const st = _cl(key).style;
  switch(st){
    case 'ponytail': return `<ellipse cx="46" cy="100" rx="14" ry="32" fill="${c}"/>
      <ellipse cx="174" cy="100" rx="14" ry="32" fill="${c}"/>
      <path d="M58 72 q52 -34 104 0 q-52 -10 -104 0 Z" fill="${c}"/>`;
    case 'spiky': return `<path d="M56 82 L64 38 L76 74 L88 34 L100 70 L110 30 L120 70 L132 34 L144 74 L156 38 L164 82 Z" fill="${c}"/>`;
    case 'long': return `<path d="M50 68 q-10 62 -2 104 q12 -42 8 -94 Z" fill="${c}"/>
      <path d="M170 68 q10 62 2 104 q-12 -42 -8 -94 Z" fill="${c}"/>
      <path d="M56 78 q54 -36 108 0 q-54 -10 -108 0 Z" fill="${c}"/>`;
    case 'afro': return `<circle cx="110" cy="52" r="50" fill="${c}"/>
      <circle cx="66" cy="64" r="22" fill="${c}"/><circle cx="154" cy="64" r="22" fill="${c}"/>`;
    case 'bun': return `<circle cx="110" cy="34" r="18" fill="${c}"/>
      <path d="M60 78 q50 -30 100 0 q-50 -10 -100 0 Z" fill="${c}"/>`;
    case 'curly': return `<circle cx="66" cy="52" r="16" fill="${c}"/>
      <circle cx="88" cy="40" r="16" fill="${c}"/><circle cx="110" cy="36" r="17" fill="${c}"/>
      <circle cx="132" cy="40" r="16" fill="${c}"/><circle cx="154" cy="52" r="16" fill="${c}"/>
      <circle cx="76" cy="64" r="12" fill="${c}"/><circle cx="144" cy="64" r="12" fill="${c}"/>`;
    case 'mint': return `<path d="M58 84 q0 -46 52 -46 q52 0 52 46 q-52 -12 -104 0 Z" fill="${c}"/>
      <path d="M56 80 q-8 20 -2 34 q10 -14 8 -32 Z" fill="${c}"/>
      <path d="M164 80 q8 20 2 34 q-10 -14 -8 -32 Z" fill="${c}"/>`;
    default: return `<path d="M52 88 q0 -50 58 -50 q58 0 58 50 q-58 -12 -116 0 Z" fill="${c}"/>`;
  }
}

function renderHat(key){
  const c = _cl(key,'#e8c879').color;
  const st = _cl(key).style;
  switch(st){
    case 'crown': return `<path d="M70 44 l10 -22 l14 16 l12 -20 l12 20 l14 -16 l10 22 Z" fill="${c}" stroke="#e6b800" stroke-width="2"/>
      <circle cx="80" cy="30" r="3" fill="#ff6b81"/><circle cx="110" cy="24" r="3" fill="#ff6b81"/><circle cx="140" cy="30" r="3" fill="#ff6b81"/>`;
    case 'party': return `<path d="M110 6 L78 48 L142 48 Z" fill="${c}"/>
      <circle cx="110" cy="6" r="7" fill="#ff6b81"/>
      <circle cx="95" cy="30" r="3" fill="#ffd700"/><circle cx="120" cy="36" r="2.5" fill="#7bed9f"/>`;
    case 'wizard': return `<path d="M110 -4 L72 50 L148 50 Z" fill="${c}"/>
      <path d="M66 50 q44 8 88 0 l-4 8 q-40 6 -80 0 Z" fill="${c}"/>
      <circle cx="100" cy="28" r="2" fill="#ffd700"/><circle cx="116" cy="18" r="2" fill="#ffd700"/><circle cx="108" cy="38" r="1.5" fill="#ffd700"/>`;
    case 'flower': return `<g>
      <circle cx="66" cy="48" r="7" fill="${c}"/><circle cx="66" cy="48" r="3.5" fill="#fff"/>
      <circle cx="86" cy="40" r="7" fill="${c}"/><circle cx="86" cy="40" r="3.5" fill="#fff"/>
      <circle cx="110" cy="36" r="7" fill="${c}"/><circle cx="110" cy="36" r="3.5" fill="#fff"/>
      <circle cx="134" cy="40" r="7" fill="${c}"/><circle cx="134" cy="40" r="3.5" fill="#fff"/>
      <circle cx="154" cy="48" r="7" fill="${c}"/><circle cx="154" cy="48" r="3.5" fill="#fff"/></g>`;
    case 'beret': return `<ellipse cx="106" cy="40" rx="44" ry="20" fill="${c}" transform="rotate(-6 106 40)"/>
      <circle cx="106" cy="26" r="6" fill="${c}"/>`;
    case 'santa': return `<path d="M66 44 Q100 -10 152 24 Q156 34 152 44 Z" fill="${c}"/>
      <ellipse cx="110" cy="44" rx="48" ry="11" fill="#fff"/>
      <circle cx="150" cy="20" r="8" fill="#fff"/>`;
    case 'bunnyband': return `<ellipse cx="76" cy="16" rx="10" ry="26" fill="${c}" transform="rotate(-12 76 16)"/>
      <ellipse cx="144" cy="16" rx="10" ry="26" fill="${c}" transform="rotate(12 144 16)"/>
      <ellipse cx="76" cy="18" rx="4.5" ry="16" fill="#ffb6c1" transform="rotate(-12 76 18)"/>
      <ellipse cx="144" cy="18" rx="4.5" ry="16" fill="#ffb6c1" transform="rotate(12 144 18)"/>
      <path d="M64 42 q46 -14 92 0" stroke="${c}" stroke-width="5" fill="none"/>`;
    case 'mushroom': return `<path d="M52 46 Q110 -14 168 46 Q110 58 52 46 Z" fill="${c}"/>
      <circle cx="86" cy="30" r="6" fill="#fff" opacity=".9"/>
      <circle cx="122" cy="22" r="5" fill="#fff" opacity=".9"/>
      <circle cx="148" cy="36" r="4.5" fill="#fff" opacity=".9"/>
      <rect x="92" y="44" width="36" height="13" rx="6" fill="#fff8ec"/>`;
    case 'grad': return `<path d="M62 40 L110 20 L158 40 L110 52 Z" fill="${c}"/>
      <rect x="100" y="24" width="20" height="14" rx="3" fill="${c}"/>
      <path d="M110 30 L110 60" stroke="${c}" stroke-width="3"/>
      <circle cx="110" cy="62" r="4" fill="#ffd700"/>`;
    case 'sailorcap': return `<ellipse cx="110" cy="42" rx="46" ry="15" fill="${c}"/>
      <path d="M64 40 q46 -16 92 0 q-46 -8 -92 0 Z" fill="#0984e3"/>
      <path d="M64 42 q46 14 92 0" fill="none" stroke="#0984e3" stroke-width="5"/>
      <circle cx="110" cy="30" r="4" fill="#ffd700"/>`;
    case 'strawberry': return `<path d="M66 44 Q110 4 154 44 Q110 62 66 44 Z" fill="${c}"/>
      <path d="M92 16 q18 -14 36 0 q-4 8 -8 8 l6 6 q-14 8 -32 0 l6 -6 q-4 0 -8 -8 Z" fill="#55b98a"/>
      <circle cx="88" cy="34" r="2.5" fill="#ffe066"/><circle cx="110" cy="28" r="2.5" fill="#ffe066"/>
      <circle cx="132" cy="34" r="2.5" fill="#ffe066"/><circle cx="100" cy="44" r="2.5" fill="#ffe066"/>
      <circle cx="122" cy="44" r="2.5" fill="#ffe066"/>`;
    case 'chef': return `<path d="M66 46 q-14 -22 6 -28 q2 -12 16 -8 q6 -12 22 -8 q16 -4 22 8 q14 -4 16 8 q20 6 6 28 Z" fill="${c}" stroke="#e8e8e8" stroke-width="2"/>
      <rect x="72" y="44" width="76" height="14" rx="4" fill="${c}" stroke="#e8e8e8" stroke-width="2"/>`;
    default: return `<ellipse cx="110" cy="42" rx="68" ry="16" fill="${c}"/>
      <path d="M62 42 q48 -58 96 0 Z" fill="${c}"/>
      <rect x="102" y="36" width="16" height="10" rx="3" fill="#c89b3c"/>`;
  }
}

function renderGlasses(key){
  const c = _cl(key,'#ffd966').color;
  const st = _cl(key).style;
  switch(st){
    case 'round': return `<g fill="none" stroke="${c}" stroke-width="5">
      <circle cx="90" cy="92" r="15"/><circle cx="130" cy="92" r="15"/><path d="M105 92 h10"/></g>`;
    case 'sun': return `<rect x="72" y="82" width="34" height="20" rx="8" fill="${c}" opacity=".88"/>
      <rect x="114" y="82" width="34" height="20" rx="8" fill="${c}" opacity=".88"/>
      <path d="M106 92 h8" stroke="${c}" stroke-width="3"/>`;
    case 'heart': return `<g fill="${c}" opacity=".82">
      <path d="M76 88 q0 -12 10 -12 q4 0 6 5 q2 -5 6 -5 q10 0 10 12 q0 8 -16 18 q-16 -10 -16 -18 Z"/>
      <path d="M116 88 q0 -12 10 -12 q4 0 6 5 q2 -5 6 -5 q10 0 10 12 q0 8 -16 18 q-16 -10 -16 -18 Z"/></g>`;
    case 'rainsun': return `<rect x="72" y="82" width="34" height="20" rx="8" fill="#ff6b81" opacity=".85"/>
      <rect x="114" y="82" width="34" height="20" rx="8" fill="#64b5f6" opacity=".85"/>
      <path d="M106 92 h8" stroke="#ffd700" stroke-width="3"/>
      <path d="M74 86 h30 M116 86 h30" stroke="#fff" stroke-width="3" opacity=".4"/>`;
    case 'moon': return `<path d="M84 82 q-14 10 0 20 q-10 -4 -10 -10 q0 -6 10 -10 Z" fill="${c}"/>
      <path d="M124 82 q14 10 0 20 q10 -4 10 -10 q0 -6 -10 -10 Z" fill="${c}"/>
      <path d="M100 88 h20" stroke="${c}" stroke-width="3"/>`;
    case 'pixel': return `<g fill="${c}" opacity=".9">
      <rect x="72" y="82" width="12" height="20"/><rect x="84" y="86" width="10" height="16"/>
      <rect x="114" y="86" width="10" height="16"/><rect x="124" y="82" width="12" height="20"/>
      <rect x="94" y="88" width="20" height="6"/></g>`;
    default: return `<g fill="none" stroke="${c}" stroke-width="4">
      <circle cx="90" cy="92" r="14"/><circle cx="130" cy="92" r="14"/><path d="M104 92 h12"/></g>
      <path d="M84 84 l4 -6 M136 84 l-4 -6" stroke="${c}" stroke-width="3"/>`;
  }
}

function renderScarf(key){
  const c = _cl(key,'#e8607a').color;
  const st = _cl(key).style;
  const base = `<path d="M78 138 q32 22 64 0 l8 16 q-40 26 -80 0 Z" fill="${c}"/>
    <path d="M120 150 l14 30 l-22 -6 Z" fill="${c}" opacity=".85"/>`;
  switch(st){
    case 'rainbow': return base +
      `<path d="M82 140 q28 18 56 0" fill="none" stroke="#ffd700" stroke-width="3" opacity=".7"/>
       <path d="M84 145 q26 14 52 0" fill="none" stroke="#7bed9f" stroke-width="3" opacity=".7"/>`;
    case 'fluffy': return `<path d="M76 136 q34 24 68 0 q4 6 8 18 q-42 28 -84 0 q4 -12 8 -18 Z" fill="${c}"/>
      <circle cx="78" cy="140" r="5" fill="${c}"/><circle cx="142" cy="140" r="5" fill="${c}"/>
      <path d="M122 150 l12 28 l-20 -6 Z" fill="${c}" opacity=".85"/>`;
    case 'bell': return base + `<circle cx="128" cy="172" r="6" fill="#ffd700" stroke="#e6b800" stroke-width="1.5"/>
      <path d="M125 171 l3 -6 l3 6" stroke="#e6b800" stroke-width="1.5" fill="none"/>
      <circle cx="128" cy="174" r="1.2" fill="#8a6d1a"/>`;
    case 'star': return base +
      `<text x="92" y="152" font-size="9" fill="#ffe066">✦</text>
       <text x="112" y="156" font-size="8" fill="#ffe066">✦</text>
       <text x="128" y="180" font-size="9" fill="#ffe066">⭐</text>`;
    default: return base;
  }
}

function renderOutfit(key){
  const c = _cl(key,'#7ec8e3').color;
  const st = _cl(key).style;
  const base = `<path d="M70 165 q40 26 80 0 l4 42 q-44 16 -88 0 Z" fill="${c}"/>`;
  switch(st){
    case 'tux': return base +
      `<path d="M100 165 l10 14 l10 -14 l6 30 q-16 6 -32 0 Z" fill="#fff"/>
       <path d="M104 170 l6 6 l6 -6" fill="none" stroke="#e74c3c" stroke-width="3"/>`;
    case 'kimono': return `<path d="M66 162 q44 30 88 0 l6 46 q-50 18 -100 0 Z" fill="${c}"/>
      <path d="M96 162 l28 0 l4 48 q-18 8 -36 0 Z" fill="#fff" opacity=".3"/>
      <rect x="72" y="186" width="76" height="10" rx="3" fill="#ffd700"/>`;
    case 'cape': return `<path d="M64 160 q46 18 92 0 l8 50 q-54 22 -108 0 Z" fill="${c}"/>
      <circle cx="110" cy="168" r="5" fill="#ffd700"/>`;
    case 'sailor': return base +
      `<path d="M86 163 l24 18 l24 -18 l4 10 q-28 8 -56 0 Z" fill="#fff"/>
       <rect x="104" y="170" width="12" height="6" rx="2" fill="#e74c3c"/>`;
    case 'hoodie': return `<path d="M66 160 q44 28 88 0 l6 48 q-50 18 -100 0 Z" fill="${c}"/>
      <path d="M84 160 q26 -10 52 0 q-4 14 -26 14 q-22 0 -26 -14 Z" fill="${c}" opacity=".7"/>
      <rect x="98" y="180" width="24" height="14" rx="4" fill="#000" opacity=".12"/>`;
    case 'overalls': return base +
      `<path d="M88 165 l0 -14 q22 -6 44 0 l0 14" fill="none" stroke="#5a4a2a" stroke-width="4"/>
       <circle cx="92" cy="168" r="3" fill="#ffd700"/><circle cx="128" cy="168" r="3" fill="#ffd700"/>`;
    case 'princess': return `<path d="M64 162 q46 28 92 0 l10 48 q-56 22 -112 0 Z" fill="${c}"/>
      <path d="M74 185 q36 18 72 0 l2 8 q-38 14 -76 0 Z" fill="#fff" opacity=".4"/>
      <path d="M82 200 q28 12 56 0 l2 8 q-30 10 -60 0 Z" fill="#fff" opacity=".3"/>
      <circle cx="110" cy="172" r="4" fill="#ffd700"/>`;
    case 'sport': return base +
      `<path d="M74 168 l4 36 M146 168 l-4 36" stroke="#fff" stroke-width="5" opacity=".7"/>
       <text x="110" y="192" font-size="13" text-anchor="middle" fill="#fff" opacity=".95" font-weight="bold" font-family="Baloo 2, sans-serif">01</text>`;
    case 'dino': return `<path d="M70 165 q40 26 80 0 l4 42 q-44 16 -88 0 Z" fill="${c}"/>
      <ellipse cx="110" cy="192" rx="20" ry="13" fill="#e8f0d8"/>
      <path d="M66 168 l-8 -8 l12 -2 Z M66 184 l-10 -4 l10 -4 Z" fill="#3d8b5f"/>
      <path d="M154 168 l8 -8 l-12 -2 Z M154 184 l10 -4 l-10 -4 Z" fill="#3d8b5f"/>`;
    case 'qipao': return `<path d="M74 162 q36 22 72 0 l6 46 q-42 16 -84 0 Z" fill="${c}"/>
      <path d="M98 162 l12 16 l12 -16 l8 8 q-20 16 -40 0 Z" fill="${c}"/>
      <path d="M110 178 q0 10 0 0" fill="none"/>
      <circle cx="110" cy="180" r="4" fill="#ffd700"/>
      <path d="M80 190 q30 14 60 0 l1 6 q-31 12 -62 0 Z" fill="#ffd700" opacity=".55"/>`;
    case 'astro': return `<path d="M66 160 q44 28 88 0 l6 48 q-50 18 -100 0 Z" fill="${c}"/>
      <circle cx="110" cy="186" r="16" fill="#74b9ff" opacity=".85"/>
      <circle cx="110" cy="186" r="16" fill="none" stroke="#fff" stroke-width="3"/>
      <rect x="76" y="164" width="16" height="10" rx="4" fill="#e74c3c" opacity=".8"/>
      <rect x="128" y="164" width="16" height="10" rx="4" fill="#e74c3c" opacity=".8"/>
      <path d="M96 214 l4 10 M124 214 l-4 10" stroke="#b2bec3" stroke-width="4"/>`;
    default: return base + `<circle cx="110" cy="180" r="4" fill="#fff"/>`;
  }
}

/* ===================== 视图路由 ===================== */
const VIEWS = { home:viewHome, points:viewPoints, students:viewClassStudents, adopt:viewAdopt, pets:viewPets, shop:viewShop };

function navigate(v){
  currentView = v;
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===v));
  render();
}
function render(){
  refreshClassSelect();
  document.getElementById('content').innerHTML = VIEWS[currentView]();
}

/* ---------- 顶栏：自定义下拉（个人学员 + 班级） ---------- */
function refreshClassSelect(){
  const menu = document.getElementById('ddMenu');
  if(!menu) return;
  let html = '';
  /* 个人学员 */
  const personal = state.personalStudents || [];
  html += '<div class="dd-section">👤 个人学员</div>';
  if(!personal.length){
    html += '<div class="dd-empty">暂无个人学员</div>';
  } else {
    personal.forEach(s=>{
      const active = isPersonalMode() && s.name===state.currentStudent;
      html += `<div class="dd-item ${active?'active':''}" onclick="ddSelectPersonal('${s.name}')">
        <span class="dd-ava">${avatar(s.name)}</span><span class="dd-nm">${s.name}</span><span class="dd-pts">${s.points} 分</span>
      </div>`;
    });
  }
  /* 班级 */
  html += '<div class="dd-section">👥 班级</div>';
  if(!state.classes.length){
    html += '<div class="dd-empty">暂无班级</div>';
  } else {
    state.classes.forEach(c=>{
      const expanded = !isPersonalMode() && c.name===state.currentClass;
      html += `<div class="dd-group ${expanded?'expanded':''}" onclick="ddToggleGroup('${c.name}',event)">
        <span class="dd-gname">👥 ${c.name}</span><span class="dd-count">${c.students.length} 人</span><span class="dd-garrow">${expanded?'▾':'▸'}</span>
      </div>`;
      html += `<div class="dd-subitems" id="ddgrp-${c.name}" style="display:${expanded?'block':'none'}">`;
      if(!c.students.length){
        html += '<div class="dd-empty">暂无学员</div>';
      } else {
        c.students.forEach(s=>{
          const active = !isPersonalMode() && c.name===state.currentClass && s.name===state.currentStudent;
          html += `<div class="dd-subitem ${active?'active':''}" onclick="ddSelectClassStudent('${c.name}','${s.name}')">
            <span class="dd-ava">${avatar(s.name)}</span><span class="dd-nm">${s.name}</span><span class="dd-pts">${s.points} 分</span>
          </div>`;
        });
      }
      html += '</div>';
    });
  }
  menu.innerHTML = html;
  /* 触发器标签 */
  const label = document.getElementById('ddLabel');
  if(label){
    if(isPersonalMode()){
      const s = personal.find(x=>x.name===state.currentStudent);
      label.textContent = s ? ('👤 '+s.name) : '👤 个人学员';
    } else {
      label.textContent = state.currentClass ? ('👥 '+state.currentClass) : '请选择';
    }
  }
  /* 积分徽章 */
  const c = cur();
  const badge = document.getElementById('curPointsBadge');
  if(badge){
    if(c) badge.textContent = c.points + ' 分';
    else badge.textContent = '0 分';
  }
}
function ddToggle(e){
  if(e) e.stopPropagation();
  const menu = document.getElementById('ddMenu');
  if(!menu) return;
  menu.style.display = menu.style.display==='block' ? 'none' : 'block';
}
function ddToggleGroup(name, e){
  if(e) e.stopPropagation();
  const sub = document.getElementById('ddgrp-'+name);
  if(!sub) return;
  const open = sub.style.display==='block';
  sub.style.display = open ? 'none' : 'block';
  const group = sub.previousElementSibling;
  if(group){
    group.classList.toggle('expanded', !open);
    const arrow = group.querySelector('.dd-garrow');
    if(arrow) arrow.textContent = open ? '▸' : '▾';
  }
}
function ddSelectPersonal(name){
  state.currentClass = '__personal__';
  state.currentStudent = name;
  selectedPetId = null;
  save(); ddClose(); render();
  toast('已切换到个人学员：'+name,'good');
}
function ddSelectClassStudent(className, studentName){
  state.currentClass = className;
  state.currentStudent = studentName;
  selectedPetId = null;
  save(); ddClose(); render();
  toast('已切换到 '+className+' · '+studentName,'good');
}
function ddClose(){
  const menu = document.getElementById('ddMenu');
  if(menu) menu.style.display = 'none';
}
document.addEventListener('click', e=>{
  const wrap = document.getElementById('classDd');
  if(wrap && !wrap.contains(e.target)) ddClose();
});

/* ---------- 创建新学员弹窗 ---------- */
function openCreateStudent(){
  /* 班级学员 tab 填充班级下拉 */
  const batSel = document.getElementById('batchClassSelect');
  batSel.innerHTML = state.classes.map(c=>
    `<option value="${c.name}" ${c.name===state.currentClass?'selected':''}>${c.name}（${c.students.length} 人）</option>`
  ).join('');
  /* 清空输入 */
  document.getElementById('indStuName').value = '';
  document.getElementById('batchStuNames').value = '';
  document.getElementById('batchNewClass').value = '';
  /* 默认显示个人学员 tab */
  switchCreateTab('individual');
  document.getElementById('createStudentModal').style.display = 'flex';
  setTimeout(()=>document.getElementById('indStuName').focus(), 60);
}
function closeCreateStudent(){
  document.getElementById('createStudentModal').style.display = 'none';
}
function switchCreateTab(tab){
  const isInd = tab==='individual';
  document.getElementById('csTabInd').classList.toggle('active', isInd);
  document.getElementById('csTabBat').classList.toggle('active', !isInd);
  document.getElementById('csIndividual').style.display = isInd ? 'block' : 'none';
  document.getElementById('csBatch').style.display = isInd ? 'none' : 'block';
  if(!isInd) setTimeout(()=>document.getElementById('batchStuNames').focus(), 60);
  else setTimeout(()=>document.getElementById('indStuName').focus(), 60);
}
/* 个人学员：添加单个 */
function createIndividualStudent(){
  const name = document.getElementById('indStuName').value.trim();
  if(!name){ toast('请输入学员姓名','warn'); return; }
  if(!state.personalStudents) state.personalStudents = [];
  if(state.personalStudents.find(s=>s.name===name)){ toast('该学员已存在','warn'); return; }
  state.personalStudents.push({ name, points:0, pets:[], clothes:[] });
  state.currentClass = '__personal__';
  state.currentStudent = name;
  addLog(`新建个人学员 ${name}`);
  save(); closeCreateStudent(); render();
  toast('已添加个人学员：'+name,'good');
}
/* 班级学员：批量添加 */
function createClassStudents(){
  const newCls = document.getElementById('batchNewClass').value.trim();
  const targetClsName = newCls || document.getElementById('batchClassSelect').value;
  if(!targetClsName){ toast('请选择或输入班级','warn'); return; }
  const names = document.getElementById('batchStuNames').value
    .split('\n').map(s=>s.trim()).filter(Boolean);
  if(!names.length){ toast('请至少输入一个学员名字','warn'); return; }
  /* 找到或创建目标班级 */
  let cls = state.classes.find(c=>c.name===targetClsName);
  let isNew = false;
  if(!cls){
    cls = { name:targetClsName, students:[] };
    state.classes.push(cls);
    isNew = true;
  }
  /* 去重添加 */
  let added = 0, skipped = 0;
  names.forEach(n=>{
    if(cls.students.find(s=>s.name===n)){ skipped++; return; }
    cls.students.push({ name:n, points:0, pets:[], clothes:[] });
    added++;
  });
  state.currentClass = targetClsName;
  state.currentStudent = cls.students[0]?.name || null;
  selectedPetId = null;
  if(isNew) addLog(`新建班级 ${targetClsName}，添加了 ${added} 位学员`);
  else addLog(`向 ${targetClsName} 批量添加了 ${added} 位学员${skipped?`（${skipped} 位已存在跳过）`:''}`);
  save(); closeCreateStudent(); render();
  toast(`成功添加 ${added} 位学员${skipped?`，${skipped} 位已存在`:''}到「${targetClsName}」`,'good');
}

/* ---------- 工作台首页 ---------- */
function viewHome(){
  const students = classStudents();
  const totalPets = students.reduce((a,s)=>a+s.pets.length,0);
  const totalPts = students.reduce((a,s)=>a+s.points,0);
  const board = [...students].sort((a,b)=>b.points-a.points).slice(0,5);
  const feed = state.log.length
    ? `<ul class="feed-list">${state.log.map(l=>`<li><span class="dot">●</span> ${l.t} <span style="float:right;font-size:11px">${l.d}</span></li>`).join('')}</ul>`
    : `<p class="empty-tip">还没有动态，去领养一只宠物开始吧～</p>`;
  const clsName = isPersonalMode() ? '个人学员' : (state.currentClass || '未选择');
  return `
  <section class="hero">
    <div class="hero-text">
      <h2>欢迎来到 Melody 的班级小天地 🌿</h2>
      <p>当前：<b>${clsName}</b>${cur()?' · 当前学员：<b>'+cur().name+'</b>':''}</p>
      <p>用积分领养、创作、照料你的小宠物，看它从 Lv.1 不断长大！</p>
      <div class="stat-row">
        <div class="stat"><b>${students.length}</b><span>位同学</span></div>
        <div class="stat"><b>${totalPets}</b><span>只宠物</span></div>
        <div class="stat"><b>${totalPts}</b><span>总积分</span></div>
      </div>
      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="primary-btn" onclick="navigate('adopt')">🥚 去领养</button>
        <button class="soft-btn" onclick="navigate('points')">⭐ 管理积分</button>
      </div>
    </div>
    <div class="hero-scene">${heroScene()}</div>
  </section>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div class="panel">
      <h2>🏆 积分排行榜</h2>
      <p class="sub">${clsName} 积分最多的同学</p>
      <ol class="board" style="list-style:none;margin:0;padding:0">
        ${board.length ? board.map((s,i)=>`<li><span class="rank">${i+1}</span><span class="nm">${avatar(s.name)} ${s.name}</span><span class="pts">${s.points} 分</span></li>`).join('') : '<p class="empty-tip">还没有同学～</p>'}
      </ol>
    </div>
    <div class="panel">
      <h2>📜 最近动态</h2>
      <p class="sub">班级里发生的小事</p>
      ${feed}
    </div>
  </div>
  <p class="foot-note">所有积分与宠物状态都会实时保存到本机浏览器 💾</p>`;
}

function heroScene(){
  return `<svg viewBox="0 0 230 200" width="100%" xmlns="http://www.w3.org/2000/svg">
    <circle cx="185" cy="40" r="22" fill="#ffd86b"/>
    <path d="M0 150 q40 -30 90 -10 q50 20 140 -6 v66 h-230 Z" fill="#9ed29b"/>
    <path d="M0 168 q60 -20 120 -4 q60 16 110 -4 v40 h-230 Z" fill="#6fae73"/>
    <ellipse cx="60" cy="140" rx="26" ry="20" fill="#fff" opacity=".7"/>
    <ellipse cx="150" cy="128" rx="20" ry="16" fill="#fff" opacity=".7"/>
    <g transform="translate(95,118) scale(.5) translate(-110,-118)">${petSVG({species:'dragon',equipped:{hat:'crown'}})}</g>
  </svg>`;
}

/* ---------- 积分管理 ---------- */
/* 预设加减分项 */
const POINT_ITEMS_ADD = [
  { label:'出席',     pts:5 },
  { label:'上课认真', pts:10 },
  { label:'作业完成', pts:10 },
  { label:'口语打卡', pts:5 },
  { label:'帮助同学', pts:3 },
];
const POINT_ITEMS_SUB = [
  { label:'上课迟到',       pts:2 },
  { label:'作业未完成',     pts:10 },
  { label:'课堂警告超5次', pts:10 },
  { label:'说脏话不文明',   pts:10 },
  { label:'乱扔垃圾',       pts:3 },
];

function viewPoints(){
  const c = cur();
  if(!c){
    return `<div class="panel"><h2>⭐ 积分管理</h2>
      <p class="empty-tip">请先在「班级学员」中选择一位同学</p>
      <div style="text-align:center;margin-top:12px"><button class="soft-btn" onclick="navigate('students')">前往班级学员</button></div></div>`;
  }
  const addItems = POINT_ITEMS_ADD.map(it=>
    `<button class="pt-item add" onclick="quickPoints('${it.label}',${it.pts})">
       <span class="pt-label">${it.label}</span>
       <span class="pt-val">+${it.pts}</span>
     </button>`).join('');
  const subItems = POINT_ITEMS_SUB.map(it=>
    `<button class="pt-item sub" onclick="quickPoints('${it.label}',-${it.pts})">
       <span class="pt-label">${it.label}</span>
       <span class="pt-val">-${it.pts}</span>
     </button>`).join('');
  return `
  <div class="panel">
    <h2>⭐ 积分管理</h2>
    <p class="sub">为「${c.name}」加减分（当前 ${c.points} 分）</p>
    <div class="big-points">
      <div class="num">${c.points}</div>
      <div class="lbl">当前积分</div>
    </div>
  </div>

  <div class="pt-columns">
    <div class="panel pt-col">
      <h3 style="color:var(--green-deep)">🟢 加分项</h3>
      <div class="pt-list">${addItems}</div>
    </div>
    <div class="panel pt-col">
      <h3 style="color:var(--pink-deep)">🔴 减分项</h3>
      <div class="pt-list">${subItems}</div>
    </div>
  </div>

  <div class="panel">
    <h3>✏️ 自定义加减分</h3>
    <p class="sub">输入任意分值进行加减</p>
    <div style="text-align:center;margin-top:6px">
      <input class="amt-input" id="amt" type="number" min="1" value="5" />
    </div>
    <div class="quick-row">
      <button class="soft-btn" onclick="changePoints(1)">＋ 加分</button>
      <button class="primary-btn" onclick="changePoints(-1)">－ 扣分</button>
    </div>
  </div>`;
}

function quickPoints(label, pts){
  const c = cur();
  if(!c){ toast('请先选择一位同学','warn'); return; }
  if(pts<0 && c.points+pts<0){ toast('积分不能为负数哦','warn'); return; }
  c.points += pts;
  addLog(`${c.name} ${label} ${pts>0?'+':''}${pts} 分（剩余 ${c.points}）`);
  save(); render();
  toast(`${label} ${pts>0?'+':''}${pts} 分`, pts>0?'good':'warn');
}

function quickSwitch(name){ state.currentStudent=name; selectedPetId=null; save(); render(); }
function changePoints(sign){
  const amt = parseInt(document.getElementById('amt')?.value || '0', 10);
  if(!amt || amt<=0){ toast('请输入有效的积分数量','warn'); return; }
  const c = cur();
  if(!c){ toast('请先选择一位同学','warn'); return; }
  const delta = amt*sign;
  if(delta<0 && c.points+delta<0){ toast('积分不能为负数哦','warn'); return; }
  c.points += delta;
  addLog(`${c.name} ${delta>0?'获得':'扣除'} ${amt} 分（剩余 ${c.points}）`);
  save(); render();
  toast((delta>0?'＋':'－')+amt+' 分', delta>0?'good':'warn');
}

/* ---------- 班级学员 ---------- */
function viewClassStudents(){
  const cls = curClass();
  const students = classStudents();
  const isP = isPersonalMode();
  const title = isP ? '个人学员' : '班级学员';
  const subtitle = isP ? `共 ${students.length} 位学员` : `${cls?cls.name:'未选择'} · 共 ${students.length} 位同学`;
  const list = students.map(s=>`
    <div class="stu-item">
      <div class="ava">${avatar(s.name)}</div>
      <div class="nm">${s.name}${s.name===state.currentStudent?' · <span style="color:var(--pink-deep)">当前</span>':''}</div>
      <div class="pp">${s.points} 分</div>
      <div style="display:flex;gap:6px">
        <button class="soft-btn" onclick="quickSwitch('${s.name}')">选中</button>
        <button class="ghost-btn" style="padding:8px 10px" onclick="delStudent('${s.name}')" title="移除">✕</button>
      </div>
    </div>`).join('');
  return `
  <div class="panel">
    <h2>👥 ${title}</h2>
    <p class="sub">${subtitle}</p>
    <div class="student-list">${list || '<p class="empty-tip">还没有学员，添加一位吧～</p>'}</div>
    <div class="add-stu">
      <input id="newStu" type="text" placeholder="输入新学员名字" maxlength="8" />
      <button class="primary-btn" onclick="addStudent()">添加学员</button>
    </div>
  </div>`;
}

function addStudent(){
  const v = document.getElementById('newStu')?.value.trim();
  if(!v){ toast('请输入名字','warn'); return; }
  if(findStudent(v)){ toast('这位学员已存在','warn'); return; }
  if(isPersonalMode()){
    if(!state.personalStudents) state.personalStudents = [];
    state.personalStudents.push({ name:v, points:0, pets:[], clothes:[] });
    state.currentStudent = v;
    addLog(`新个人学员 ${v}`);
    save(); render(); toast('已添加 '+v,'good');
    return;
  }
  const cls = curClass();
  if(!cls){ toast('请先选择或创建班级','warn'); return; }
  cls.students.push({ name:v, points:0, pets:[], clothes:[] });
  state.currentStudent = v;
  addLog(`新学员 ${v} 加入了${cls.name}`);
  save(); render(); toast('已添加 '+v,'good');
}
async function delStudent(name){
  if(isPersonalMode()){
    const ok = await customConfirm(`确定移除个人学员「${name}」吗？该学员的积分与宠物都会删除。`);
    if(!ok) return;
    state.personalStudents = (state.personalStudents||[]).filter(s=>s.name!==name);
    if(state.currentStudent===name) state.currentStudent = state.personalStudents[0]?.name || null;
    selectedPetId = null;
    addLog(`个人学员 ${name} 被移除`);
    save(); render(); toast('已移除 '+name,'warn');
    return;
  }
  const cls = curClass();
  if(!cls) return;
  const ok = await customConfirm(`确定从${cls.name}中移除「${name}」吗？该同学的积分与宠物都会删除。`);
  if(!ok) return;
  cls.students = cls.students.filter(s=>s.name!==name);
  if(state.currentStudent===name) state.currentStudent = cls.students[0]?.name || null;
  selectedPetId = null;
  addLog(`${name} 被移出 ${cls.name}`);
  save(); render(); toast('已移除 '+name,'warn');
}

/* ---------- 领养中心 ---------- */
function viewAdopt(){
  const c = cur();
  if(!c){
    return `<div class="panel"><h2>🥚 领养中心</h2>
      <p class="empty-tip">请先在「班级学员」中选择一位同学</p>
      <div style="text-align:center;margin-top:12px"><button class="soft-btn" onclick="navigate('students')">前往班级学员</button></div></div>`;
  }
  const catalog = Object.entries(SPECIES).map(([key,sp])=>{
    const can = c.points >= sp.cost;
    return `<div class="pet-card" style="cursor:default">
      <div class="pet-stage">${petSVG({species:key,equipped:{}})}</div>
      <div class="pn">${sp.name}</div>
      <div><span class="tier ${sp.rarity}">${rarityCN(sp.rarity)}</span></div>
      <div class="price-tag">💎 ${sp.cost} 分</div>
      <div style="margin-top:10px">
        <button class="${can?'soft-btn':'ghost-btn'}" ${can?'':'disabled style="opacity:.5;cursor:not-allowed"'} onclick="adopt('${key}')">领养</button>
      </div>
    </div>`;
  }).join('');

  const owned = c.pets.length
    ? c.pets.map(p=>petMini(p)).join('')
    : `<p class="empty-tip">还没有宠物，挑一只领养吧～</p>`;

  return `
  <div class="panel">
    <h2>🥚 领养中心</h2>
    <p class="sub">用「${c.name}」的积分领养不同等级的宠物（当前 ${c.points} 分）</p>
    <div class="card-grid">${catalog}</div>
    <div style="margin-top:18px;text-align:center">
      <button class="primary-btn" onclick="openCustom()">🎨 自创 / 改造独一无二的宠物（${CREATE_COST} 分）</button>
    </div>
  </div>

  <div class="panel">
    <h2>🐾 ${c.name} 的宠物（${c.pets.length}）</h2>
    <div class="card-grid">${owned}</div>
  </div>`;
}
function rarityCN(r){ return {common:'普通',rare:'稀有',legend:'传说'}[r]||r; }
function petMini(p){
  const sp = SPECIES[p.species];
  const lv = levelOf(p);
  return `<div class="pet-card" onclick="goPet('${p.id}')">
    <div class="pet-stage">${petSVG(p)}</div>
    <div class="pn">${p.name}</div>
    <div class="ps">${sp.name}${p.custom?' · 自创':''}</div>
    <span class="lv-badge">Lv.${lv}</span>
  </div>`;
}
async function adopt(key){
  const c = cur(); const sp = SPECIES[key];
  if(c.points < sp.cost){ toast('积分不足','warn'); return; }
  /* 弹出输入框让用户自定宠物姓名 */
  const inputName = await customPrompt('领养宠物', `给 ${sp.name} 起个名字吧：`, sp.name);
  if(inputName === null) return; /* 用户取消 */
  const petName = inputName || sp.name;
  c.points -= sp.cost;
  const pet = { id:'p'+Date.now()+Math.floor(Math.random()*999), name:petName, species:key, custom:false,
    feed:0, bath:0, play:0, color:null, accent:null, equipped:{} };
  c.pets.push(pet);
  addLog(`${c.name} 领养了 ${petName}（${sp.name}）`);
  save(); render(); toast('领养成功！'+petName,'good');
}
function goPet(id){ const r = petById(id); if(r){ state.currentStudent = r.owner.name; } selectedPetId=id; navigate('pets'); }

/* ---------- 我的宠物 ---------- */
function viewPets(){
  const c = cur();
  if(!c){
    return `<div class="panel"><h2>🌟 我的宠物</h2>
      <p class="empty-tip">请先在「班级学员」中选择一位同学</p>
      <div style="text-align:center;margin-top:12px"><button class="soft-btn" onclick="navigate('students')">前往班级学员</button></div></div>`;
  }
  if(!c.pets.length){
    return `<div class="panel"><h2>🌟 我的宠物</h2>
      <p class="empty-tip">「${c.name}」还没有宠物，去 <a href="javascript:navigate('adopt')" style="color:var(--pink-deep)">领养中心</a> 领一只吧～</p></div>`;
  }
  const grid = c.pets.map(p=>{
    const lv=levelOf(p);
    const sel = p.id===selectedPetId;
    return `<div class="pet-card ${sel?'selected':''}" onclick="selectPet('${p.id}')">
      <div class="pet-stage">${petSVG(p)}</div>
      <div class="pn">${p.name}</div>
      <span class="lv-badge">Lv.${lv}</span>
    </div>`;
  }).join('');

  let detail = `<p class="empty-tip">点击上方宠物，开始喂食、洗澡、玩耍与换装 ✨</p>`;
  if(selectedPetId){
    const r = petById(selectedPetId);
    if(r) detail = petDetail(r.pet, r.owner);
  }
  return `
  <div class="panel">
    <h2>🌟 ${c.name} 的宠物</h2>
    <p class="sub">点选一只宠物，照料它长大吧</p>
    <div class="card-grid">${grid}</div>
  </div>
  <div class="panel">${detail}</div>`;
}
function selectPet(id){ selectedPetId=id; render(); }

function careButton(p, kind, label){
  const used = careToday(p, kind);
  const maxed = used >= CARE_DAILY_MAX;
  const owner = cur();
  const noPoints = !owner || owner.points < CARE_COST;
  const disabled = maxed || noPoints;
  const cls = 'care-btn '+kind+(disabled?' maxed':'');
  const onClick = disabled ? '' : `onclick="care('${p.id}','${kind}','${label}')"`;
  const subText = maxed ? '今日已满' : (noPoints ? '积分不足' : `今日 ${used}/${CARE_DAILY_MAX}`);
  return `<button class="${cls}" ${onClick}>${label}<br><small>${p[kind]||0} 次 · ${subText}</small><span class="care-cost">💰 ${CARE_COST} 分/次</span></button>`;
}

function petDetail(p, owner){
  const lv = levelOf(p);
  const t = totalCare(p);
  const nt = nextThreshold(lv);
  const prevT = careThreshold(lv);
  const pct = Math.min(100, Math.round((t-prevT)/(nt-prevT)*100));
  const progTxt = `再照料 ${nt-t} 次升级到 Lv.${lv+1}`;
  const tier = levelTier(lv);

  const slots = ['bg','hair','hat','glasses','scarf','outfit','wings'];
  const slotCN = {bg:'背景',hair:'发型',hat:'帽子',glasses:'眼镜',scarf:'围巾',outfit:'衣服',wings:'翅膀'};
  const slotEmoji = {bg:'🖼️',hair:'💇',hat:'🎩',glasses:'👓',scarf:'🧣',outfit:'👗',wings:'🪽'};
  const ownedMap = {};
  owner.clothes.forEach(cid=>{ const cl=CLOTHES[cid]; (ownedMap[cl.type]=ownedMap[cl.type]||[]).push(cid); });
  const wardrobe = slots.map(slot=>{
    const owned = ownedMap[slot]||[];
    const label = `<div style="width:100%;font-size:13px;color:var(--ink-soft);margin:8px 0 4px;font-weight:600">${slotEmoji[slot]} ${slotCN[slot]}</div>`;
    if(!owned.length) return label + `<div class="cloth-chip" style="opacity:.5;cursor:default"><div class="sw" style="background:#eee"></div><div class="cn">空</div><div class="slot">未拥有</div></div>`;
    return label + owned.map(cid=>{
      const cl=CLOTHES[cid]; const on=(p.equipped||{})[slot]===cid;
      return `<div class="cloth-chip ${on?'on':''}" onclick="toggleCloth('${p.id}','${slot}','${cid}')">
        <div class="sw" style="background:${cl.color}"></div>
        <div class="cn">${cl.name}</div>
        <div class="slot">${on?'✓ 穿着':'点击穿'}</div>
      </div>`;
    }).join('');
  }).join('');

  return `
  <div class="pet-detail">
    <div>
      <div class="detail-stage" id="detailStage">${petSVG(p)}</div>
      <div style="text-align:center;margin-top:8px">
        <div class="pn" style="font-size:20px">${p.name}</div>
        <span class="lv-badge">Lv.${lv} · ${SPECIES[p.species].name}${p.custom?' · 自创':''}</span>
        ${tier.aura ? `<span class="lv-tier-badge" style="background:${tier.aura==='rainbow'?'linear-gradient(135deg,#ff6b81,#ffd86b,#64b5f6,#9c7ede)':tier.aura}">${tier.emoji} ${tier.name}</span>` : `<span class="lv-tier-badge lv-tier-base">${tier.emoji} ${tier.name}</span>`}
      </div>
      <div class="care-bar"><i style="width:${pct}%"></i></div>
      <p style="text-align:center;font-size:13px;color:var(--ink-soft);margin:6px 0 0">${progTxt}</p>
    </div>
    <div>
      <div class="section-title">💗 日常照料 <small style="font-size:12px;color:var(--ink-soft);font-weight:400">（每次消耗 ${CARE_COST} 分 · 每天每项 ${CARE_DAILY_MAX} 次）</small></div>
      <div class="care-actions">
        ${careButton(p,'feed','🍓 喂食')}
        ${careButton(p,'bath','🛁 洗澡')}
        ${careButton(p,'play','🎾 玩耍')}
      </div>
      <div class="section-title">👗 换装间（${owner.name} 拥有的服装）</div>
      <div class="wardrobe">${wardrobe}</div>
      <p style="margin-top:14px"><button class="ghost-btn" style="display:inline-block;width:auto;padding:8px 16px" onclick="stripPet('${p.id}')">🧼 一键脱下所有衣服</button></p>
    </div>
  </div>`;
}

function care(id, kind, label){
  const r = petById(id); if(!r) return;
  const owner = r.owner;
  /* 每日次数上限检查 */
  const used = careToday(r.pet, kind);
  if(used >= CARE_DAILY_MAX){
    toast(`今天「${kind==='feed'?'喂食':kind==='bath'?'洗澡':'玩耍'}」已达 ${CARE_DAILY_MAX} 次上限，明天再来吧～`, 'warn');
    return;
  }
  /* 积分消耗检查 */
  if(owner.points < CARE_COST){
    toast(`积分不足！每次照料需要 ${CARE_COST} 分`, 'warn');
    return;
  }
  owner.points -= CARE_COST;
  /* 更新今日计数 */
  const log = r.pet.careLog || (r.pet.careLog={});
  if(log.date !== todayStr()){ log.date = todayStr(); log.feed=0; log.bath=0; log.play=0; }
  log[kind] = (log[kind]||0) + 1;
  /* 更新累计次数 */
  const before = levelOf(r.pet);
  r.pet[kind] = (r.pet[kind]||0)+1;
  const after = levelOf(r.pet);
  const leveledUp = after > before;
  if(leveledUp){
    const tier = levelTier(after);
    toast(`${r.pet.name} 升级到 Lv.${after}！${tier.emoji} ${tier.name} 🎉`, 'good');
    addLog(`🎉 ${r.pet.name} 升级到 Lv.${after}（${tier.emoji} ${tier.name}）！${owner.name} 给 ${r.pet.name} ${label}（-${CARE_COST}分）`);
  } else {
    toast(`${label}完成～消耗 ${CARE_COST} 分`, 'good');
    addLog(`${owner.name} 给 ${r.pet.name} ${label}（-${CARE_COST}分）`);
  }
  save(); render();
  /* ⚠️ 特效和弹跳必须在 render() 之后执行，否则 DOM 重建会冲掉刚创建的特效元素 */
  playCareEffect(kind);
  const stage = document.getElementById('detailStage');
  if(stage){ stage.classList.remove('bounce'); void stage.offsetWidth; stage.classList.add('bounce'); }
  /* 升级专属爆发特效（在照料特效之后播放） */
  if(leveledUp) playLevelUpEffect();
}

/* ---------- 照料特效 ---------- */
function playCareEffect(kind){
  const stage = document.getElementById('detailStage');
  if(!stage) return;
  const overlay = document.createElement('div');
  overlay.className = 'care-fx-overlay';
  const items = {
    feed: ['🍓','🍎','🥕','🍪','🍞','🧀'],
    bath: ['💧','🫧','💧','✨','🫧','💧'],
    play: ['💕','⭐','💖','✨','🌟','💗'],
  };
  const pool = items[kind] || ['✨'];
  const count = 10;
  for(let i=0;i<count;i++){
    const el = document.createElement('span');
    el.className = 'care-fx-particle fx-'+kind;
    el.textContent = pool[i % pool.length];
    el.style.left = (15 + Math.random()*70) + '%';
    el.style.animationDelay = (i*0.08) + 's';
    el.style.fontSize = (18 + Math.random()*16) + 'px';
    overlay.appendChild(el);
  }
  /* 喂食额外加一个"吃饱"表情 */
  if(kind==='feed'){
    const yum = document.createElement('span');
    yum.className = 'care-fx-emote';
    yum.textContent = '😋';
    overlay.appendChild(yum);
  }
  /* 洗澡额外加泡沫覆盖 */
  if(kind==='bath'){
    const foam = document.createElement('div');
    foam.className = 'care-fx-foam';
    overlay.appendChild(foam);
  }
  /* 玩耍额外加跳跃音符 */
  if(kind==='play'){
    const note = document.createElement('span');
    note.className = 'care-fx-emote';
    note.textContent = '🎵';
    overlay.appendChild(note);
  }
  stage.appendChild(overlay);
  setTimeout(()=>overlay.remove(), 2200);
}

/* ---------- 升级爆发特效 ---------- */
function playLevelUpEffect(){
  const stage = document.getElementById('detailStage');
  if(!stage) return;
  const overlay = document.createElement('div');
  overlay.className = 'care-fx-overlay levelup-fx';

  /* 扩散光环 */
  const ring = document.createElement('div');
  ring.className = 'levelup-ring';
  overlay.appendChild(ring);

  /* 第二层光环（延迟） */
  const ring2 = document.createElement('div');
  ring2.className = 'levelup-ring levelup-ring-2';
  overlay.appendChild(ring2);

  /* "升级啦！"文字 */
  const text = document.createElement('div');
  text.className = 'levelup-text';
  text.textContent = '✨ 升级啦！✨';
  overlay.appendChild(text);

  /* 金色粒子放射状爆发 */
  const emojis = ['⭐','✨','🌟','💫','🎉'];
  for(let i=0; i<18; i++){
    const el = document.createElement('span');
    el.className = 'care-fx-particle fx-levelup';
    el.textContent = emojis[i % emojis.length];
    const angle = (i / 18) * Math.PI * 2;
    const dist = 70 + Math.random()*50;
    el.style.setProperty('--dx', Math.cos(angle)*dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle)*dist + 'px');
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.animationDelay = (i*0.04) + 's';
    el.style.fontSize = (14 + Math.random()*14) + 'px';
    overlay.appendChild(el);
  }

  stage.appendChild(overlay);
  setTimeout(()=>overlay.remove(), 3000);
}
function toggleCloth(id, slot, cid){
  const r = petById(id); if(!r) return;
  const eq = r.pet.equipped || (r.pet.equipped={});
  eq[slot] = eq[slot]===cid ? null : cid;
  addLog(`${r.owner.name} 给 ${r.pet.name} ${eq[slot]?'穿上':'脱下'}了${CLOTHES[cid].name}`);
  save(); render();
}
function stripPet(id){
  const r = petById(id); if(!r) return;
  r.pet.equipped = {};
  save(); render(); toast('已脱下所有衣服','good');
}

/* ---------- 商店 ---------- */
function viewShop(){
  const c = cur();
  if(!c){
    return `<div class="panel"><h2>🛍️ 宠物商店</h2>
      <p class="empty-tip">请先在「班级学员」中选择一位同学</p>
      <div style="text-align:center;margin-top:12px"><button class="soft-btn" onclick="navigate('students')">前往班级学员</button></div></div>`;
  }
  const ownedSet = new Set(c.clothes);
  const catOrder = ['bg','hair','hat','glasses','scarf','outfit','wings'];
  const catEmoji = {bg:'🖼️',hair:'💇',hat:'🎩',glasses:'👓',scarf:'🧣',outfit:'👗',wings:'🪽'};
  const sections = catOrder.map(type=>{
    const entries = Object.entries(CLOTHES).filter(([_,cl])=>cl.type===type);
    if(!entries.length) return '';
    const items = entries.map(([key,cl])=>{
      const can = c.points>=cl.price;
      const own = ownedSet.has(key);
      return `<div class="shop-item">
        <div class="ico">${cl.emoji}</div>
        <div class="cn">${cl.name}</div>
        <div class="price-tag">💎 ${cl.price} 分</div>
        <div class="own">${own?'已拥有':''}</div>
        <div style="margin-top:8px">
          <button class="${can&&!own?'soft-btn':'ghost-btn'}" ${can&&!own?'':'disabled style="opacity:.5;cursor:not-allowed"'} onclick="buyCloth('${key}')">${own?'已拥有':'购买'}</button>
        </div>
      </div>`;
    }).join('');
    return `<h3 style="margin:18px 0 10px;color:var(--ink)">${catEmoji[type]} ${slotCN(type)}</h3>
      <div class="card-grid">${items}</div>`;
  }).join('');
  return `
  <div class="panel">
    <h2>🛍️ 宠物商店</h2>
    <p class="sub">用「${c.name}」的积分购买装扮，买后可在「我的宠物 → 换装间」自由换装（当前 ${c.points} 分）</p>
    ${sections}
  </div>`;
}
function slotCN(t){ return {bg:'背景',hair:'发型',hat:'帽子',glasses:'眼镜',scarf:'围巾',outfit:'衣服',wings:'翅膀'}[t]||t; }
function buyCloth(key){
  const c = cur(); const cl = CLOTHES[key];
  if(c.points < cl.price){ toast('积分不足','warn'); return; }
  if(c.clothes.includes(key)){ toast('已拥有','warn'); return; }
  c.points -= cl.price;
  c.clothes.push(key);
  addLog(`${c.name} 购买了 ${cl.name}`);
  save(); render(); toast('购买成功：'+cl.name,'good');
}

/* ---------- 自创宠物弹窗 ---------- */
function openCustom(){
  const c = cur();
  if(!c){ toast('请先选择一位同学','warn'); return; }
  if(c.points < CREATE_COST){ toast('需要 '+CREATE_COST+' 分才能自创','warn'); return; }
  const sel = document.getElementById('cSpecies');
  sel.innerHTML = Object.entries(SPECIES).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('');
  document.getElementById('cName').value='';
  updateCustomPreview();
  document.getElementById('customModal').style.display='flex';
}
function closeCustom(){ document.getElementById('customModal').style.display='none'; }
function updateCustomPreview(){
  const sp = document.getElementById('cSpecies').value;
  const body = document.getElementById('cBody').value;
  const accent = document.getElementById('cAccent').value;
  document.getElementById('cPreview').innerHTML = petSVG({species:sp, color:body, accent, equipped:{}});
}
function createCustomPet(){
  const c = cur();
  if(!c){ toast('请先选择一位同学','warn'); return; }
  const name = document.getElementById('cName').value.trim();
  if(!name){ toast('给宠物起个名字吧','warn'); return; }
  if(c.points < CREATE_COST){ toast('积分不足','warn'); return; }
  c.points -= CREATE_COST;
  const pet = {
    id:'p'+Date.now()+Math.floor(Math.random()*999),
    name, species:document.getElementById('cSpecies').value, custom:true,
    feed:0, bath:0, play:0,
    color:document.getElementById('cBody').value,
    accent:document.getElementById('cAccent').value,
    equipped:{}
  };
  c.pets.push(pet);
  addLog(`${c.name} 自创了宠物 ${name}`);
  save(); closeCustom(); selectedPetId=pet.id; render(); toast('🎨 创作成功：'+name,'good');
}

/* ---------- 重置 ---------- */
async function resetAll(){
  const ok = await customConfirm('确定重置所有数据吗？班级、学员、积分与宠物都会清空。');
  if(!ok) return;
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem('classPetWorkbench_v1');
  state = defaultState();
  selectedPetId = null;
  save(); render(); toast('已重置','good');
}

/* ---------- 数据备份 / 恢复 ---------- */
function openDataModal(){
  document.getElementById('dataArea').value = localStorage.getItem(SAVE_KEY) || '';
  document.getElementById('dataModal').style.display = 'flex';
}
function closeDataModal(){ document.getElementById('dataModal').style.display='none'; }
function fillCurrentData(){
  document.getElementById('dataArea').value = localStorage.getItem(SAVE_KEY) || '';
  toast('已填入当前数据','good');
}
function copyDataArea(){
  const area = document.getElementById('dataArea');
  area.focus(); area.select();
  let ok = false;
  try{ ok = document.execCommand('copy'); }catch(e){}
  if(ok){ toast('已复制到剪贴板，请妥善保存～','good'); return; }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(area.value)
      .then(()=>toast('已复制到剪贴板，请妥善保存～','good'))
      .catch(()=>toast('自动复制失败，请手动全选后 ⌘C / Ctrl+C','warn'));
  } else {
    toast('请手动全选后 ⌘C / Ctrl+C','warn');
  }
}
async function importData(){
  const txt = document.getElementById('dataArea').value.trim();
  if(!txt){ toast('请先粘贴数据','warn'); return; }
  let d;
  try{ d = JSON.parse(txt); }
  catch(e){ toast('数据格式不正确，请检查','warn'); return; }
  if(!d || typeof d!=='object' || !Array.isArray(d.classes)){
    toast('数据不完整（缺少班级信息）','warn'); return;
  }
  const ok = await customConfirm('导入将覆盖当前所有数据，确定继续？');
  if(!ok) return;
  if(!d.personalStudents) d.personalStudents = [];
  if(!d.log) d.log = [];
  /* 修正当前选择指针 */
  const inClass = d.classes.find(c=>c.name===d.currentClass);
  if(d.currentClass !== '__personal__' && !inClass){
    if(d.personalStudents.length){ d.currentClass='__personal__'; d.currentStudent=d.personalStudents[0].name; }
    else if(d.classes.length){ d.currentClass=d.classes[0].name; d.currentStudent=(d.classes[0].students[0]||{}).name||null; }
    else { d.currentClass=null; d.currentStudent=null; }
  }
  if(d.currentClass==='__personal__' && !(d.personalStudents||[]).find(s=>s.name===d.currentStudent)){
    d.currentStudent = d.personalStudents[0] ? d.personalStudents[0].name : null;
  }
  if(inClass && !inClass.students.find(s=>s.name===d.currentStudent)){
    d.currentStudent = inClass.students[0] ? inClass.students[0].name : null;
  }
  state = d;
  save();
  closeDataModal();
  currentView = 'home'; navigate('home');
  toast('数据导入成功！','good');
}

/* 让颜色选择实时预览 */
document.addEventListener('input', e=>{
  if(e.target && (e.target.id==='cBody'||e.target.id==='cAccent'||e.target.id==='cSpecies')){
    if(document.getElementById('customModal').style.display==='flex') updateCustomPreview();
  }
});

/* 启动 */
refreshClassSelect();
render();
