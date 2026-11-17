'use strict';
// AI điều khiển boss Chung Yên Hoàng Đế: chọn chiêu tiếp theo dựa trên tình huống.
// Gọi API bất đồng bộ — chiêu AI chọn xong sẽ được dùng ở lượt sau; chưa có thì boss chọn ngẫu nhiên như cũ.
// Nút "3" (hoặc phím 3) dưới HUD máu mở bảng chỉnh model / thinking / prompt.
(function(){
const URL='https://my-ai-worker.vudanhquy1002.workers.dev/api/external/chat',KEY='vlx_e0107531b2bb4ce7afeaa38262724d92',LS='tm_bossai_v1';
const MODELS=[['auto','Tự chọn (auto)'],['gemma-4-31b-it','Gemma 4 31B'],['gemma-4-26b-a4b-it','Gemma 4 26B A4B']];
const DEF_PROMPT='Bạn là trí tuệ của boss "Chung Yên Hoàng Đế" trong game kiếm hiệp. Mỗi lượt hãy chọn MỘT chiêu để đánh bại người chơi một cách thông minh: đổi chiêu liên tục (đừng lặp lại chiêu vừa dùng), đọc khoảng cách và máu để chọn chiêu hợp lý, và thỉnh thoảng nói một câu khiêu khích ngắn.';
const FORMAT='\n\nĐịnh dạng bắt buộc: chỉ trả về JSON một dòng, không giải thích, dạng {"atk":"tên_chiêu","say":"câu nói ngắn dưới 10 từ hoặc rỗng"}. "atk" phải nằm trong danh sách pool được cho.';
const INFO={
 cleave:'chém vòng quanh boss (bán kính 7), hợp khi người chơi đứng sát',
 beams:'các tia kiếm khí thẳng về phía người chơi, hợp khi người chơi ở xa hoặc đứng yên',
 rain:'mưa kiếm rơi quanh người chơi, ép người chơi phải di chuyển',
 nova:'vụ nổ lớn quanh boss, phạt người chơi đứng gần',
 souls:'triệu hồi kiếm hồn lao vào người chơi',
 dash:'lao thẳng vào vị trí người chơi',
 wave:'sóng đất lan rộng, chỉ ở dạng 2'};

// ---- cấu hình (lưu localStorage) ----
const CFG={on:true,model:'auto',thinking:false,prompt:DEF_PROMPT};
try{const d=JSON.parse(localStorage.getItem(LS)||'null');if(d){if(typeof d.on==='boolean')CFG.on=d.on;if(MODELS.some(m=>m[0]===d.model))CFG.model=d.model;if(typeof d.thinking==='boolean')CFG.thinking=d.thinking;if(typeof d.prompt==='string'&&d.prompt.trim())CFG.prompt=d.prompt.slice(0,2000)}}catch(e){}
const saveCfg=()=>{try{localStorage.setItem(LS,JSON.stringify(CFG))}catch(e){}};
window.bossAIon=CFG.on;

async function askGemma(prompt,{model='auto',thinking=false,systemPrompt='',signal}={}){
 const r=await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':KEY},body:JSON.stringify({prompt,model,thinking,systemPrompt}),signal});
 const data=await r.json();
 if(!r.ok)throw new Error(data.error||'Lỗi gọi API');
 return data.text}

let ready=null,busy=0,fail=0,lastReq=0,deadUntil=0,hist=[],status='Chưa gọi lần nào';
const setStatus=s=>{status=s;const el=document.getElementById('aiSt');if(el)el.textContent='Trạng thái: '+s};

function buildPrompt(ctx){
 return JSON.stringify({dang:ctx.form,mau_boss_phan_tram:Math.round(ctx.boss*100),mau_nguoi_choi_phan_tram:Math.round(ctx.me),khoang_cach:Math.round(ctx.dist),kiem_hon_dang_bay:ctx.souls,chieu_vua_dung:hist.slice(-4),pool:ctx.pool.map(k=>({atk:k,mo_ta:INFO[k]||''}))})}
function parse(txt,pool){
 const m=String(txt).match(/\{[\s\S]*?\}/);
 if(!m)throw new Error('AI trả lời sai định dạng');
 const o=JSON.parse(m[0]),atk=String(o.atk||'').trim().toLowerCase();
 if(pool.indexOf(atk)<0)throw new Error('AI chọn chiêu không hợp lệ: '+atk);
 return{atk,say:String(o.say||'').slice(0,70)}}

async function request(ctx){
 const t=Date.now();
 if(busy||t<deadUntil||t-lastReq<1500)return;
 busy=1;lastReq=t;
 const ac=new AbortController(),to=setTimeout(()=>ac.abort(),CFG.thinking?20000:8000);
 try{
  const txt=await askGemma(buildPrompt(ctx),{model:CFG.model,thinking:CFG.thinking,systemPrompt:CFG.prompt+FORMAT,signal:ac.signal});
  ready=parse(txt,ctx.pool);fail=0;setStatus('OK — chiêu kế tiếp: '+ready.atk)}
 catch(e){
  setStatus('lỗi — '+(e&&e.name==='AbortError'?'quá thời gian chờ':(e&&e.message)||e));
  if(++fail>=3){fail=0;deadUntil=Date.now()+60000;if(typeof toast==='function')toast('AI boss lỗi — boss tạm dùng chiêu ngẫu nhiên (thử lại sau 1 phút)')}}
 finally{clearTimeout(to);busy=0}}

// dungeon.js gọi hàm này mỗi khi boss chọn chiêu; trả về tên chiêu hoặc null (= chọn ngẫu nhiên)
window.bossAI=function(ctx){
 if(!window.bossAIon)return null;
 const a=ready;ready=null;
 request(ctx);
 if(!a)return null;
 hist.push(a.atk);if(hist.length>8)hist.shift();
 if(a.say&&typeof say==='function')say(a.say,1800);
 return a.atk};

// ---- giao diện: nút 3 (dưới HUD máu) + bảng chỉnh ----
const css=document.createElement('style');
css.textContent='#aiBtn{position:fixed;left:8px;top:90px;z-index:101;padding:5px 10px;font:bold 12px "Courier New",monospace;color:#ffd646;background:rgba(10,5,25,.9);border:1px solid #9945ff;border-radius:6px;touch-action:manipulation}#aiBtn.off{color:#888;border-color:#555}'
+'#aiP{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(92vw,380px);max-height:88vh;overflow:auto;display:none;z-index:960;background:rgba(8,2,22,.98);border:2px solid #9945ff;border-radius:14px;padding:12px;color:#ddd;font:12px "Courier New",monospace;touch-action:pan-y}'
+'#aiP h3{margin:0 0 8px;color:#ffd646;font-size:14px}#aiP label{display:block;margin:8px 0 3px;color:#9fd8ff}#aiP select,#aiP textarea{width:100%;box-sizing:border-box;background:#150a2a;color:#fff;border:1px solid #6a3ad0;border-radius:6px;padding:6px;font:13px "Courier New",monospace}#aiP textarea{height:150px;resize:vertical}'
+'#aiP .row{display:flex;align-items:center;margin-top:8px}#aiP .row input{width:20px;height:20px;margin:0 8px 0 0}#aiP .btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}#aiP button{flex:1 1 auto;padding:8px;font:bold 12px "Courier New",monospace;color:#fff;background:#3a1a80;border:1px solid #9945ff;border-radius:6px}'
+'#aiSt{margin-top:8px;color:#fc0;word-break:break-word}#aiOut{margin-top:6px;color:#aaa;white-space:pre-wrap;word-break:break-word;max-height:90px;overflow:auto}';
document.head.appendChild(css);

const btn=document.createElement('button');btn.id='aiBtn';btn.textContent='3 · AI';btn.title='Chỉnh AI điều khiển boss (phím 3)';
document.body.appendChild(btn);
const refreshBtn=()=>btn.classList.toggle('off',!CFG.on);

const P_=document.createElement('div');P_.id='aiP';
P_.innerHTML='<h3>AI điều khiển boss</h3>'
+'<div class="row"><input type="checkbox" id="aiOn"><span>Bật AI điều khiển boss</span></div>'
+'<label for="aiModel">Model</label><select id="aiModel"></select>'
+'<div class="row"><input type="checkbox" id="aiTh"><span>Thinking (suy nghĩ kỹ hơn, chậm hơn)</span></div>'
+'<label for="aiPr">Prompt hệ thống (chiến thuật, tính cách boss)</label><textarea id="aiPr" spellcheck="false"></textarea>'
+'<div id="aiSt"></div><div id="aiOut"></div>'
+'<div class="btns"><button id="aiSave">Lưu</button><button id="aiTest">Thử AI</button><button id="aiDef">Prompt mặc định</button><button id="aiClose">Đóng</button></div>';
document.body.appendChild(P_);
const $$=id=>document.getElementById(id);
const sel=$$('aiModel');MODELS.forEach(m=>{const o=document.createElement('option');o.value=m[0];o.textContent=m[1];sel.appendChild(o)});

// không để game nhận phím / chạm khi đang gõ trong bảng
['keydown','keyup','pointerdown','touchstart','touchend','mousedown','wheel'].forEach(t=>P_.addEventListener(t,e=>e.stopPropagation(),{passive:true}));

let wasPaused=false,isOpen=false;
function fill(){$$('aiOn').checked=CFG.on;sel.value=CFG.model;$$('aiTh').checked=CFG.thinking;$$('aiPr').value=CFG.prompt;setStatus(status)}
function apply(){CFG.on=$$('aiOn').checked;CFG.model=sel.value;CFG.thinking=$$('aiTh').checked;CFG.prompt=$$('aiPr').value.trim()||DEF_PROMPT;window.bossAIon=CFG.on;ready=null;fail=0;deadUntil=0;saveCfg();refreshBtn()}
function open(){if(isOpen)return;isOpen=true;wasPaused=paused;paused=true;fill();P_.style.display='block'}
function close(){if(!isOpen)return;isOpen=false;P_.style.display='none';paused=wasPaused}
const toggle=()=>isOpen?close():open();

btn.addEventListener('click',e=>{e.preventDefault();toggle()});
$$('aiClose').addEventListener('click',close);
$$('aiSave').addEventListener('click',()=>{apply();setStatus('đã lưu cấu hình');if(typeof toast==='function')toast('Đã lưu cấu hình AI boss')});
$$('aiDef').addEventListener('click',()=>{$$('aiPr').value=DEF_PROMPT});
$$('aiTest').addEventListener('click',async()=>{
 apply();const out=$$('aiOut');out.textContent='Đang hỏi AI…';
 const ctx={form:1,boss:.8,me:90,dist:12,souls:0,pool:['beams','rain','souls','dash','nova']};
 try{const t0=performance.now(),txt=await askGemma(buildPrompt(ctx),{model:CFG.model,thinking:CFG.thinking,systemPrompt:CFG.prompt+FORMAT});
  const ms=Math.round(performance.now()-t0);let r='không đọc được';try{r=JSON.stringify(parse(txt,ctx.pool))}catch(e){r='lỗi: '+e.message}
  out.textContent='('+ms+' ms) '+r+'\nTrả lời gốc: '+String(txt).slice(0,300)}
 catch(e){out.textContent='Lỗi: '+(e&&e.message||e)}});

addEventListener('keydown',e=>{
 if(e.code!=='Digit3'||e.repeat)return;
 const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'))return;
 if(!isOpen&&paused)return; // đang mở menu khác
 toggle()});

// đặt nút ngay dưới HUD máu (#hudL), không chèn vào HUD
function place(){
 const h=document.getElementById('hudL');if(!h)return;
 const r=h.getBoundingClientRect();if(!r.width)return;
 const top=Math.round(r.bottom+6)+'px',left=Math.round(r.left)+'px';
 if(btn.style.top!==top)btn.style.top=top;if(btn.style.left!==left)btn.style.left=left}
setInterval(place,250);addEventListener('resize',place);addEventListener('orientationchange',()=>setTimeout(place,350));
refreshBtn();place();
})();
