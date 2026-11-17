'use strict';
// AI điều khiển boss Chung Yên Hoàng Đế: chọn chiêu tiếp theo dựa trên tình huống.
// Gọi API bất đồng bộ — chiêu AI chọn xong sẽ được dùng ở lượt sau; chưa có thì boss chọn ngẫu nhiên như cũ.
// Tắt AI: gõ bossAIon=false trong console.
(function(){
const URL='https://my-ai-worker.vudanhquy1002.workers.dev/api/external/chat',KEY='vlx_e0107531b2bb4ce7afeaa38262724d92';
async function askGemma(prompt,{model='auto',thinking=false,systemPrompt='',signal}={}){
 const r=await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':KEY},body:JSON.stringify({prompt,model,thinking,systemPrompt}),signal});
 const data=await r.json();
 if(!r.ok)throw new Error(data.error||'Lỗi gọi API');
 return data.text}

const SYS='Bạn là trí tuệ của boss "Chung Yên Hoàng Đế" trong game kiếm hiệp. Mỗi lượt hãy chọn MỘT chiêu để đánh bại người chơi một cách thông minh: đổi chiêu liên tục (đừng lặp lại chiêu vừa dùng), đọc khoảng cách và máu để chọn chiêu hợp lý. Chỉ trả về JSON một dòng, không giải thích, dạng {"atk":"tên_chiêu","say":"câu nói ngắn khiêu khích dưới 10 từ hoặc rỗng"}. "atk" phải nằm trong danh sách pool được cho.';
const INFO={
 cleave:'chém vòng quanh boss (bán kính 7), hợp khi người chơi đứng sát',
 beams:'các tia kiếm khí thẳng về phía người chơi, hợp khi người chơi ở xa hoặc đứng yên',
 rain:'mưa kiếm rơi quanh người chơi, ép người chơi phải di chuyển',
 nova:'vụ nổ lớn quanh boss, phạt người chơi đứng gần',
 souls:'triệu hồi kiếm hồn lao vào người chơi',
 dash:'lao thẳng vào vị trí người chơi',
 wave:'sóng đất lan rộng, chỉ ở dạng 2'};

let ready=null,busy=0,fail=0,lastReq=0,deadUntil=0,hist=[];
window.bossAIon=true;

async function request(ctx){
 const t=Date.now();
 if(busy||t<deadUntil||t-lastReq<1500)return;
 busy=1;lastReq=t;
 const ac=new AbortController(),to=setTimeout(()=>ac.abort(),7000);
 try{
  const prompt=JSON.stringify({dang:ctx.form,mau_boss_phan_tram:Math.round(ctx.boss*100),mau_nguoi_choi_phan_tram:Math.round(ctx.me),khoang_cach:Math.round(ctx.dist),kiem_hon_dang_bay:ctx.souls,chieu_vua_dung:hist.slice(-4),pool:ctx.pool.map(k=>({atk:k,mo_ta:INFO[k]||''}))});
  const txt=await askGemma(prompt,{model:'auto',thinking:false,systemPrompt:SYS,signal:ac.signal});
  const m=String(txt).match(/\{[\s\S]*?\}/);
  if(!m)throw new Error('AI trả lời sai định dạng');
  const o=JSON.parse(m[0]),atk=String(o.atk||'').trim().toLowerCase();
  if(ctx.pool.indexOf(atk)<0)throw new Error('AI chọn chiêu không hợp lệ');
  ready={atk,say:String(o.say||'').slice(0,70)};fail=0}
 catch(e){
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
})();
