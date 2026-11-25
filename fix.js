'use strict';
(function(){
const el=id=>document.getElementById(id);

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

try{
 const NPC=[[-8,-7],[8,-7]],R=9;
 const near=()=>{const p=player.position;return NPC.some(n=>Math.hypot(p.x-n[0],p.z-n[1])<R)};
 (function loop(){requestAnimationFrame(loop);
  const tk=el('dgTalk');if(!tk)return;
  let on=false;
  try{on=MAP==='dungeon'&&!paused&&near()}catch(_){}
  const d=on?'block':'none';
  if(tk.style.display!==d)tk.style.display=d;
 })();
}catch(e){console.error('fix.js #3',e)}

try{
 const ab=el('aiBtn');
 if(ab){
  const upd=()=>{let has=false;try{has=!!localStorage.getItem('tm_bossai_v1_pos')}catch(_){}ab.classList.toggle('aiDef',!has)};
  upd();setInterval(upd,400);
 }
}catch(e){console.error('fix.js #4',e)}

try{
 const tp=el('tp');
 if(tp){
  const chip=document.createElement('div');chip.id='tpTog';chip.textContent='⚙ MÁU QUÁI';document.body.appendChild(chip);
  ['touchstart','touchend','mousedown'].forEach(t=>chip.addEventListener(t,e=>e.stopPropagation(),{passive:true}));
  chip.addEventListener('click',()=>{const o=tp.classList.toggle('tpOpen');chip.textContent=(o?'✖ ':'⚙ ')+'MÁU QUÁI'});
  setInterval(()=>{const d=getComputedStyle(tp).display!=='none'?'block':'none';if(chip.style.display!==d)chip.style.display=d},300);
 }
}catch(e){console.error('fix.js #5',e)}

try{
 const joyEl=el('joy'),kn=el('knob');
 if(joyEl&&kn){
  let on=false,tT=0;
  const upd=e=>{
   const r=joyEl.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;
   let x=(VP()?dy:dx)/45,y=(VP()?-dx:dy)/45;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}
   joy.x=x;joy.y=y;kn.style.transform='translate('+(x*35)+'px,'+(y*35)+'px)';
  };
  const stop=()=>{if(!on)return;on=false;joy.x=joy.y=0;kn.style.transform=''};
  ['touchstart','touchend'].forEach(t=>joyEl.addEventListener(t,()=>{tT=Date.now()},{passive:true}));
  joyEl.addEventListener('mousedown',e=>{if(e.button!==0||Date.now()-tT<800)return;on=true;e.preventDefault();e.stopPropagation();upd(e)});
  addEventListener('mousemove',e=>{if(on){e.preventDefault();upd(e)}});
  addEventListener('mouseup',stop);
  addEventListener('blur',stop);
  joyEl.style.cursor='grab';
 }
}catch(e){console.error('fix.js #6',e)}
})();
