'use strict';
// AI điều khiển boss Chung Yên Hoàng Đế: chọn chiêu tiếp theo dựa trên tình huống.
// Gọi API bất đồng bộ — chiêu AI chọn xong sẽ được dùng ở lượt sau; chưa có thì boss chọn ngẫu nhiên như cũ.
// Nút "3" (hoặc phím 3) mặc định dưới HUD máu, kéo thả được; mở bảng chỉnh model / thinking / prompt.
// Boss nói một câu mỗi 5 giây (ưu tiên câu AI vừa viết, không có thì dùng câu mẫu theo tình huống).
(function(){
const URL='https://my-ai-worker.vudanhquy1002.workers.dev/api/external/chat',KEY='vlx_e0107531b2bb4ce7afeaa38262724d92',LS='tm_bossai_v1';
const MODELS=[['auto','Tự chọn (auto)'],['gemma-4-31b-it','Gemma 4 31B'],['gemma-4-26b-a4b-it','Gemma 4 26B A4B']];
const OLD_DEF='Bạn là trí tuệ của boss "Chung Yên Hoàng Đế" trong game kiếm hiệp. Mỗi lượt hãy chọn MỘT chiêu để đánh bại người chơi một cách thông minh: đổi chiêu liên tục (đừng lặp lại chiêu vừa dùng), đọc khoảng cách và máu để chọn chiêu hợp lý, và thỉnh thoảng nói một câu khiêu khích ngắn.';
const DEF_PROMPT='Bạn là trí tuệ của boss "Chung Yên Hoàng Đế" trong game kiếm hiệp. Mỗi lượt hãy chọn MỘT chiêu để đánh bại người chơi một cách thông minh: đổi chiêu liên tục (đừng lặp lại chiêu vừa dùng), đọc khoảng cách và máu để chọn chiêu hợp lý, và thỉnh thoảng nói một câu khiêu khích ngắn. Khi máu boss dưới 20% thì kêu cứu hoặc hét lên như "Không không không!". Khi máu người chơi dưới 10% thì khiêu khích cực mạnh. Khi thấy người chơi dùng chiêu mạnh (nguoi_choi_dung_chieu_manh là true) thì nói "Ngươi điên rồi!" rồi bỏ chạy (đặt flee là true).';
const FORMAT='\n\nĐịnh dạng bắt buộc: chỉ trả về JSON một dòng, không giải thích, dạng {"atk":"tên_chiêu","say":"câu nói ngắn dưới 10 từ","flee":false}. "atk" phải nằm trong danh sách pool được cho. "say" luôn có nội dung (boss nói một câu mỗi 5 giây). "flee" là true khi boss bỏ chạy, còn lại là false.';
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
try{const d=JSON.parse(localStorage.getItem(LS)||'null');if(d){if(typeof d.on==='boolean')CFG.on=d.on;if(MODELS.some(m=>m[0]===d.model))CFG.model=d.model;if(typeof d.thinking==='boolean')CFG.thinking=d.thinking;if(typeof d.prompt==='string'&&d.prompt.trim()&&d.prompt.trim()!==OLD_DEF)CFG.prompt=d.prompt.slice(0,2000)}}catch(e){}
const saveCfg=()=>{try{localStorage.setItem(LS,JSON.stringify(CFG))}catch(e){}};
window.bossAIon=CFG.on;

async function askGemma(prompt,{model='auto',thinking=false,systemPrompt='',signal}={}){
 const r=await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':KEY},body:JSON.stringify({prompt,model,thinking,systemPrompt}),signal});
 const data=await r.json();
 if(!r.ok)throw new Error(data.error||'Lỗi gọi API');
 return data.text}

let ready=null,busy=0,hist=[],status='Chưa gọi lần nào',nReq=0,nOk=0;
const setStatus=s=>{status=s;const el=document.getElementById('aiSt');if(el)el.textContent='Trạng thái: '+s+'  ['+nOk+'/'+nReq+' lần gọi thành công]'};

// Người chơi đang dùng chiêu mạnh? (Kiếm Hồn, Quy Luật, sức mạnh U, Dom, đóng băng, Vạn Quái làm quái choáng)
const strong=()=>{try{return !!(P.kh>0||P.ap>0||P.pwr>0||P.dom5>0||P.tf>0||enemies.some(e=>e.stunT>0))}catch(_){return false}};

function buildPrompt(ctx){
 return 'Chọn chiêu tiếp theo cho boss. Chỉ trả về JSON một dòng dạng {"atk":"tên_chiêu","say":"câu ngắn","flee":false}, "atk" phải nằm trong pool.\nTình huống: '
 +JSON.stringify({dang:ctx.form,mau_boss_phan_tram:Math.round(ctx.boss*100),mau_nguoi_choi_phan_tram:Math.round(ctx.me),khoang_cach:Math.round(ctx.dist),kiem_hon_dang_bay:ctx.souls,nguoi_choi_dung_chieu_manh:!!ctx.strong,chieu_vua_dung:hist.slice(-4),pool:ctx.pool.map(k=>({atk:k,mo_ta:INFO[k]||''}))})}

// Đọc trả lời của AI một cách dễ tính: JSON (kể cả bọc ```json hoặc có giải thích), dạng atk: xxx, hoặc chỉ nhắc tên chiêu
function parse(txt,pool){
 let s=txt;
 if(s&&typeof s==='object')s=s.text||s.content||JSON.stringify(s);
 s=String(s==null?'':s);
 if(!s.trim())throw new Error('AI trả lời rỗng');
 let atk='',say='',flee=false;
 const a=s.indexOf('{'),b=s.lastIndexOf('}');
 if(a>=0&&b>a){try{const o=JSON.parse(s.slice(a,b+1));atk=String(o.atk||'').trim().toLowerCase();say=String(o.say||'');flee=o.flee===true||o.flee==='true'}catch(_){}}
 if(pool.indexOf(atk)<0){const m=s.match(/atk["'\s]*[:=]\s*["']?([a-zA-Z_]+)/i);if(m)atk=m[1].toLowerCase()}
 if(pool.indexOf(atk)<0){
  const low=s.toLowerCase();let best=null,bi=1e9;
  pool.forEach(k=>{const i=low.search(new RegExp('\\b'+k+'\\b'));if(i>=0&&i<bi){bi=i;best=k}});
  if(best)atk=best}
 if(pool.indexOf(atk)<0)throw new Error('AI trả lời sai định dạng: "'+s.replace(/\s+/g,' ').slice(0,80)+'"');
 return{atk,say:say.slice(0,70),flee}}

// Không có giới hạn tần suất hay khoá tạm: mỗi lần boss chọn chiêu là gọi một request mới.
// Chỉ không gọi chồng khi request trước chưa trả lời (tránh dồn hàng chờ).
async function request(ctx){
 if(busy)return;
 busy=1;nReq++;
 const ac=new AbortController(),to=setTimeout(()=>ac.abort(),CFG.thinking?20000:8000);
 try{
  const txt=await askGemma(buildPrompt(ctx),{model:CFG.model,thinking:CFG.thinking,systemPrompt:CFG.prompt+FORMAT,signal:ac.signal});
  ready=parse(txt,ctx.pool);nOk++;setStatus('OK — chiêu kế tiếp: '+ready.atk+(ready.flee?' (bỏ chạy)':''))}
 catch(e){
  setStatus('lỗi — '+(e&&e.name==='AbortError'?'quá thời gian chờ':(e&&e.message)||e))}
 finally{clearTimeout(to);busy=0}}

// ---- boss nói 5 giây một lần ----
let lines=[];
const FB={
 low:['Không không không!','Cứu ta với!','Không thể nào!','Ta không muốn chết!'],
 win:['Yếu đuối! Quỳ xuống đi!','Hahaha, ngươi sắp chết rồi!','Đến cả đứng cũng không nổi sao?'],
 strong:['Ngươi điên rồi!','Sức mạnh gì thế này?!'],
 norm:['Chịu chết đi!','Ngươi chạy đâu cho thoát?','Chung Yên bất diệt!','Kiếm của ngươi chỉ đến thế thôi sao?']};
const rnd=a=>a[Math.random()*a.length|0];
function quip(b){
 if(lines.length)return lines.shift();
 const pc=b.hp/(b.max||b.hp||1);
 if(pc<.2)return rnd(FB.low);
 if(P.hp<10)return rnd(FB.win);
 if(strong())return rnd(FB.strong);
 return rnd(FB.norm)}
setInterval(()=>{
 try{
  const b=enemies.find(e=>e.boss&&e.hp>0);
  if(!b){lines=[];return}
  if(paused)return;
  say('Boss: '+quip(b),2500)}catch(_){}},5000);

// Boss bỏ chạy: chạy ngược hướng người chơi một lúc (dungeon.js vẫn tự đánh bình thường)
let fleeT=0,lastF=0;
function fleeTick(t){
 requestAnimationFrame(fleeTick);
 const dt=Math.min(.05,(t-lastF)/1000);lastF=t;
 if(fleeT<=0||paused)return;
 fleeT-=dt;
 try{
  const b=enemies.find(e=>e.boss&&e.hp>0);if(!b)return;
  const p=b.m.position,q=player.position,dx=p.x-q.x,dz=p.z-q.z,d=Math.hypot(dx,dz)||1,s=16*dt;
  p.x+=dx/d*s;p.z+=dz/d*s;
  const r=Math.hypot(p.x,p.z);if(r>96){p.x*=96/r;p.z*=96/r}}catch(_){}}
requestAnimationFrame(t=>{lastF=t;fleeTick(t)});

// dungeon.js gọi hàm này mỗi khi boss chọn chiêu; trả về tên chiêu hoặc null (= chọn ngẫu nhiên)
window.bossAI=function(ctx){
 if(!window.bossAIon)return null;
 ctx.strong=strong();
 const a=ready;ready=null;
 request(ctx);
 if(!a)return null;
 hist.push(a.atk);if(hist.length>8)hist.shift();
 if(a.say){lines.push(a.say);if(lines.length>3)lines.shift()}
 if(a.flee)fleeT=1.8;
 return a.atk};

// ---- giao diện: nút 3 (kéo thả được) + bảng chỉnh ----
const css=document.createElement('style');
css.textContent='#aiBtn{position:fixed;left:8px;top:90px;z-index:101;padding:5px 10px;font:bold 12px "Courier New",monospace;color:#ffd646;background:rgba(10,5,25,.9);border:1px solid #9945ff;border-radius:6px;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab}#aiBtn.off{color:#888;border-color:#555}#aiBtn.drag{cursor:grabbing;border-color:#ffd646}'
+'#aiP{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(92vw,380px);max-height:88vh;overflow:auto;display:none;z-index:960;background:rgba(8,2,22,.98);border:2px solid #9945ff;border-radius:14px;padding:12px;color:#ddd;font:12px "Courier New",monospace;touch-action:pan-x pan-y;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}'
+'#aiP h3{margin:0 0 8px;color:#ffd646;font-size:14px}#aiP label{display:block;margin:8px 0 3px;color:#9fd8ff}#aiP select,#aiP textarea{width:100%;box-sizing:border-box;background:#150a2a;color:#fff;border:1px solid #6a3ad0;border-radius:6px;padding:6px;font:13px "Courier New",monospace}#aiP textarea{height:150px;resize:vertical}'
+'#aiP .row{display:flex;align-items:center;margin-top:8px}#aiP .row input{width:20px;height:20px;margin:0 8px 0 0}#aiP .btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}#aiP button{flex:1 1 auto;padding:8px;font:bold 12px "Courier New",monospace;color:#fff;background:#3a1a80;border:1px solid #9945ff;border-radius:6px}'
+'#aiSt{margin-top:8px;color:#fc0;word-break:break-word}#aiOut{margin-top:6px;color:#aaa;white-space:pre-wrap;word-break:break-word;max-height:90px;overflow:auto}';
document.head.appendChild(css);

const btn=document.createElement('button');btn.id='aiBtn';btn.textContent='3 · AI';btn.title='Chỉnh AI điều khiển boss (phím 3) — kéo để di chuyển';
document.body.appendChild(btn);
const refreshBtn=()=>btn.classList.toggle('off',!CFG.on);

const P_=document.createElement('div');P_.id='aiP';
P_.innerHTML='<h3>AI điều khiển boss</h3>'
+'<div class="row"><input type="checkbox" id="aiOn"><span>Bật AI điều khiển boss</span></div>'
+'<label for="aiModel">Model</label><select id="aiModel"></select>'
+'<div class="row"><input type="checkbox" id="aiTh"><span>Thinking (suy nghĩ kỹ hơn, chậm hơn)</span></div>'
+'<label for="aiPr">Prompt hệ thống (chiến thuật, tính cách boss)</label><textarea id="aiPr" spellcheck="false"></textarea>'
+'<div id="aiSt"></div><div id="aiOut"></div>'
+'<div class="btns"><button id="aiSave">Lưu</button><button id="aiTest">Thử AI</button><button id="aiDef">Prompt mặc định</button><button id="aiPos">Vị trí nút mặc định</button><button id="aiClose">Đóng</button></div>';
document.body.appendChild(P_);
const $$=id=>document.getElementById(id);
const sel=$$('aiModel');MODELS.forEach(m=>{const o=document.createElement('option');o.value=m[0];o.textContent=m[1];sel.appendChild(o)});

// không để game nhận phím / chạm khi đang gõ trong bảng
['keydown','keyup','pointerdown','touchstart','touchend','mousedown','wheel'].forEach(t=>P_.addEventListener(t,e=>e.stopPropagation(),{passive:true}));

let wasPaused=false,isOpen=false;
function fill(){$$('aiOn').checked=CFG.on;sel.value=CFG.model;$$('aiTh').checked=CFG.thinking;$$('aiPr').value=CFG.prompt;setStatus(status)}
function apply(){CFG.on=$$('aiOn').checked;CFG.model=sel.value;CFG.thinking=$$('aiTh').checked;CFG.prompt=$$('aiPr').value.trim()||DEF_PROMPT;window.bossAIon=CFG.on;ready=null;saveCfg();refreshBtn()}
function fitP(){P_.style.maxHeight=Math.floor((typeof LH==='function'?LH():innerHeight)*.88)+'px'}
function open(){if(isOpen)return;isOpen=true;wasPaused=paused;paused=true;fill();fitP();P_.style.display='block'}
function close(){if(!isOpen)return;isOpen=false;P_.style.display='none';paused=wasPaused}
const toggle=()=>isOpen?close():open();

$$('aiClose').addEventListener('click',close);
$$('aiSave').addEventListener('click',()=>{apply();setStatus('đã lưu cấu hình');if(typeof toast==='function')toast('Đã lưu cấu hình AI boss')});
$$('aiDef').addEventListener('click',()=>{$$('aiPr').value=DEF_PROMPT});
$$('aiTest').addEventListener('click',async()=>{
 apply();const out=$$('aiOut');out.textContent='Đang hỏi AI…';
 const ctx={form:1,boss:.15,me:90,dist:12,souls:0,strong:true,pool:['beams','rain','souls','dash','nova']};
 try{const t0=performance.now(),txt=await askGemma(buildPrompt(ctx),{model:CFG.model,thinking:CFG.thinking,systemPrompt:CFG.prompt+FORMAT});
  const ms=Math.round(performance.now()-t0);let r='không đọc được';try{r=JSON.stringify(parse(txt,ctx.pool))}catch(e){r='lỗi: '+e.message}
  out.textContent='(Tình huống thử: boss 15% máu, người chơi dùng chiêu mạnh)\n('+ms+' ms) '+r+'\nTrả lời gốc: '+String(txt).slice(0,300)}
 catch(e){out.textContent='Lỗi: '+(e&&e.message||e)}});

addEventListener('keydown',e=>{
 if(e.code!=='Digit3'||e.repeat)return;
 const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'))return;
 if(!isOpen&&paused)return; // đang mở menu khác
 toggle()});

// ---- vị trí nút: mặc định ngay dưới HUD máu (#hudL), hoặc vị trí người chơi kéo tới ----
const LSP=LS+'_pos',clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let pos=null;
try{const d=JSON.parse(localStorage.getItem(LSP)||'null');if(d&&Number.isFinite(d.x)&&Number.isFinite(d.y))pos=d}catch(e){}
const savePos=()=>{try{if(pos)localStorage.setItem(LSP,JSON.stringify(pos));else localStorage.removeItem(LSP)}catch(e){}};
// Khi máy để dọc, body bị xoay 90° (style.css) nên toạ độ chạm (màn hình) phải đổi sang toạ độ cục bộ của body
const rot=()=>matchMedia('(orientation:portrait)').matches;
const toLocal=(sx,sy)=>rot()?{x:sy,y:innerWidth-sx}:{x:sx,y:sy};
const LW=()=>rot()?innerHeight:innerWidth,LH=()=>rot()?innerWidth:innerHeight;
function setXY(x,y){const w=btn.offsetWidth||60,h=btn.offsetHeight||26;x=Math.round(clamp(x,0,Math.max(0,LW()-w)));y=Math.round(clamp(y,0,Math.max(0,LH()-h)));btn.style.left=x+'px';btn.style.top=y+'px';return{x,y}}
function place(){
 if(drag)return;
 if(pos){setXY(pos.x,pos.y);return}
 const h=document.getElementById('hudL');if(!h)return;
 const r=h.getBoundingClientRect();if(!r.width)return;
 if(rot())setXY(r.top,innerWidth-r.left+6);else setXY(r.left,r.bottom+6)}

let drag=null,moved=false;
btn.addEventListener('pointerdown',e=>{
 e.stopPropagation();moved=false;
 const l=toLocal(e.clientX,e.clientY);
 drag={id:e.pointerId,sx:l.x,sy:l.y,bx:parseFloat(btn.style.left)||0,by:parseFloat(btn.style.top)||0};
 try{btn.setPointerCapture(e.pointerId)}catch(_){}});
btn.addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==drag.id)return;
 const l=toLocal(e.clientX,e.clientY),dx=l.x-drag.sx,dy=l.y-drag.sy;
 if(!moved&&Math.hypot(dx,dy)<6)return;
 moved=true;btn.classList.add('drag');e.preventDefault();
 pos=setXY(drag.bx+dx,drag.by+dy)});
const endDrag=e=>{
 if(!drag||(e&&e.pointerId!==drag.id))return;
 try{btn.releasePointerCapture(drag.id)}catch(_){}
 drag=null;btn.classList.remove('drag');if(moved)savePos()};
btn.addEventListener('pointerup',endDrag);
btn.addEventListener('pointercancel',endDrag);
['touchstart','touchend','mousedown'].forEach(t=>btn.addEventListener(t,e=>e.stopPropagation(),{passive:true}));
btn.addEventListener('click',e=>{e.preventDefault();if(moved){moved=false;return}toggle()});
$$('aiPos').addEventListener('click',()=>{pos=null;savePos();place();if(typeof toast==='function')toast('Đã đặt lại vị trí nút 3')});

setInterval(place,250);addEventListener('resize',()=>{place();fitP()});addEventListener('orientationchange',()=>setTimeout(place,350));
refreshBtn();place();
})();
