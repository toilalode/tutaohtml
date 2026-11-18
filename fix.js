'use strict';
/* fix.js - vá lỗi hiển thị, nạp sau cùng. Chỉ đọc trạng thái game, không sửa logic.
   Mỗi mục nằm trong try riêng để một mục lỗi không làm mất các mục còn lại. */
(function(){
const el=id=>document.getElementById(id);

/* 1) Thanh máu quái Test + boss: đọc scaleX của phần fill gốc -> đặt biến --p trên thanh (fill vẽ bằng background).
      Phần tử boss do dungeon.js tạo MUỘN nên tìm lại mỗi khung hình. */
try{
 const mirror=(fid,bid)=>{
  let last=null;
  (function loop(){requestAnimationFrame(loop);
   const f=el(fid),b=el(bid);if(!f||!b)return;
   const t=f.style.transform;if(t===last)return;last=t;
   const m=/scaleX\(([-+\d.eE]+)\)/.exec(t),k=m?Math.max(0,Math.min(1,+m[1])):1;
   b.style.setProperty('--p',(k*100).toFixed(1)+'%');
  })();
 };
 mirror('ehF','eh');mirror('dgBossF','dgBossBar');
}catch(e){console.error('fix.js #1',e)}

/* 2) Thanh tích luỹ (giữ N): phản chiếu thanh gốc của taicuc.js sang #chargeBar */
try{
 const src=Array.from(document.body.children).find(n=>n.tagName==='DIV'&&!n.id&&n.style.zIndex==='250'&&n.children.length===2);
 if(src){
  src.id='charge';
  const bar=document.createElement('div');bar.id='chargeBar';document.body.appendChild(bar);
  const sf=src.children[0],st=src.children[1],btns=el('btns');
  let on0=null,w0='',t0='',b0='';
  (function loop(){requestAnimationFrame(loop);
   const on=src.style.display==='block';
   if(on!==on0){on0=on;bar.style.display=on?'block':'none'}
   if(!on)return;
   const w=sf.style.width,t=st.textContent,b=(btns.offsetHeight+44)+'px';
   if(w!==w0){w0=w;bar.style.setProperty('--p',w||'0%')}
   if(t!==t0){t0=t;bar.textContent=t?'☯ TÍCH LỰC '+t+' ☯':''}
   if(b!==b0){b0=b;bar.style.bottom=b}
  })();
 }
}catch(e){console.error('fix.js #2',e)}

/* 3) Nút Nói chuyện: dungeon.js tạo nút này MUỘN (khi vào phó bản) => phải tìm lại mỗi khung hình.
      Luôn hiện khi ở phó bản, mờ nếu còn xa NPC. */
try{
 const NPC=[[-8,-7],[8,-7]],R=9;
 const near=()=>{const p=player.position;return NPC.some(n=>Math.hypot(p.x-n[0],p.z-n[1])<R)};
 (function loop(){requestAnimationFrame(loop);
  const tk=el('dgTalk');if(!tk)return;
  if(!tk._fx){tk._fx=1;tk.addEventListener('click',()=>{if(MAP==='dungeon'&&!paused&&!near())toast('Lại gần NPC (Chung Yên Tận Diệt / Thương Nhân) rồi bấm Nói chuyện')})}
  const on=MAP==='dungeon'&&!paused;
  const d=on?'block':'none';
  if(tk.style.display!==d)tk.style.display=d;
  if(on){try{tk.classList.toggle('far',!near())}catch(_){}}
 })();
}catch(e){console.error('fix.js #3',e)}

/* 4) Nút "3 · AI": nếu chưa có vị trí người chơi tự kéo thì dịch sang phải để khỏi bị nút "1" che (xem fix.css mục 6) */
try{
 const ab=el('aiBtn');
 if(ab){
  const upd=()=>{let has=false;try{has=!!localStorage.getItem('tm_bossai_v1_pos')}catch(_){}ab.classList.toggle('aiDef',!has)};
  upd();setInterval(upd,400);
 }
}catch(e){console.error('fix.js #4',e)}

/* 5) Panel MÁU QUÁI (map Test): thu gọn, chỉ hiện chip nhỏ; bấm chip để mở/đóng */
try{
 const tp=el('tp');
 if(tp){
  const chip=document.createElement('div');chip.id='tpTog';chip.textContent='⚙ MÁU QUÁI';document.body.appendChild(chip);
  ['touchstart','touchend','mousedown'].forEach(t=>chip.addEventListener(t,e=>e.stopPropagation(),{passive:true}));
  chip.addEventListener('click',()=>{const o=tp.classList.toggle('tpOpen');chip.textContent=(o?'✖ ':'⚙ ')+'MÁU QUÁI'});
  setInterval(()=>{const d=getComputedStyle(tp).display!=='none'?'block':'none';if(chip.style.display!==d)chip.style.display=d},300);
 }
}catch(e){console.error('fix.js #5',e)}
})();
