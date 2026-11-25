'use strict';
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

const CFG={on:true,model:'auto',thinking:false,prompt:DEF_PROMPT};
try{const d=JSON.parse(localStorage.getItem(LS)||'null');if(d){if(typeof d.on==='boolean')CFG.on=d.on;if(MODELS.some(m=>m[0]===d.model))CFG.model=d.model;if(typeof d.thinking==='boolean')CFG.thinking=d.thinking;if(typeof d.prompt==='string'&&d.prompt.trim()&&d.prompt.trim()!==OLD_DEF)CFG.prompt=d.prompt.slice(0,2000)}}catch(e){}
window.bossAIon=CFG.on;

async function askGemma(prompt,{model='auto',thinking=false,systemPrompt='',signal}={}){
 const r=await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':KEY},body:JSON.stringify({prompt,model,thinking,systemPrompt}),signal});
 const data=await r.json();
 if(!r.ok)throw new Error(data.error||'Lỗi gọi API');
 return data.text}

let ready=null,busy=0,hist=[],status='Chưa gọi lần nào',nReq=0,nOk=0;
const setStatus=s=>{status=s};

const strong=()=>{try{return !!(P.kh>0||P.ap>0||P.pwr>0||P.dom5>0||P.tf>0||enemies.some(e=>e.stunT>0))}catch(_){return false}};

function buildPrompt(ctx){
 return 'Chọn chiêu tiếp theo cho boss. Chỉ trả về JSON một dòng dạng {"atk":"tên_chiêu","say":"câu ngắn","flee":false}, "atk" phải nằm trong pool.\nTình huống: '
 +JSON.stringify({dang:ctx.form,mau_boss_phan_tram:Math.round(ctx.boss*100),mau_nguoi_choi_phan_tram:Math.round(ctx.me),khoang_cach:Math.round(ctx.dist),kiem_hon_dang_bay:ctx.souls,nguoi_choi_dung_chieu_manh:!!ctx.strong,chieu_vua_dung:hist.slice(-4),pool:ctx.pool.map(k=>({atk:k,mo_ta:INFO[k]||''}))})}

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
})();
