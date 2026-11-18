'use strict';
/* fix.js - vá lỗi hiển thị, nạp sau cùng. Chỉ đọc trạng thái game, không sửa logic. */
(function(){
try{
const el=id=>document.getElementById(id);

/* 1) Thanh tích luỹ (giữ N): phản chiếu thanh gốc của taicuc.js sang #chargeBar (CSS sạch, lớp trên cùng) */
const src=Array.from(document.body.children).find(n=>n.tagName==='DIV'&&!n.id&&n.style.zIndex==='250'&&n.style.pointerEvents==='none'&&n.children.length===2);
if(src){
 src.id='charge';
 const bar=document.createElement('div'),fill=document.createElement('i'),txt=document.createElement('span');
 bar.id='chargeBar';bar.appendChild(fill);bar.appendChild(txt);document.body.appendChild(bar);
 const sf=src.children[0],st=src.children[1],btns=el('btns');
 let on0=null,w0='',t0='',b0='';
 (function loop(){requestAnimationFrame(loop);
  const on=src.style.display==='block';
  if(on!==on0){on0=on;bar.style.display=on?'block':'none'}
  if(!on)return;
  const w=sf.style.width,t=st.textContent,b=(btns.offsetHeight+44)+'px';
  if(w!==w0){w0=w;fill.style.width=w}
  if(t!==t0){t0=t;txt.textContent=t}
  if(b!==b0){b0=b;bar.style.bottom=b}
 })();
}

/* 2) Nút Nói chuyện: luôn hiện khi ở phó bản (mờ nếu còn xa NPC) */
const tk=el('dgTalk');
if(tk){
 const NPC=[[-8,-7],[8,-7]],R=9;
 const near=()=>{const p=player.position;return NPC.some(n=>Math.hypot(p.x-n[0],p.z-n[1])<R)};
 tk.addEventListener('click',()=>{if(MAP==='dungeon'&&!paused&&!near())toast('Lại gần NPC (Chung Yên Tận Diệt / Thương Nhân) rồi bấm Nói chuyện')});
 (function loop(){requestAnimationFrame(loop);
  const on=MAP==='dungeon'&&!paused;
  const d=on?'block':'none';
  if(tk.style.display!==d)tk.style.display=d;
  if(on)tk.classList.toggle('far',!near());
 })();
}
}catch(e){console.error('fix.js',e)}
})();
