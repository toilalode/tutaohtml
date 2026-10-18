'use strict';
// Thu phóng camera bằng con lăn chuột giữa (cuộn lên = gần, cuộn xuống = xa) để xem chiêu bao quanh rõ hơn.
// Mũi tên ← → ↑ ↓ xoay camera (xử lý sẵn trong game.js).
(function(){
 const ZMIN=3,ZMAX=220;
 cam.far=1200;cam.updateProjectionMatrix();
 skyM.scale.setScalar(3);          // bầu trời lớn hơn để không bị cắt khi zoom xa
 gr.scale.setScalar(3);gtex.repeat.set(210,210); // mặt đất rộng hơn, giữ nguyên cỡ ô cỏ
 const skip='#guide,#popup,#tp,#kp';
 addEventListener('wheel',e=>{
  if(e.target.closest&&e.target.closest(skip))return;
  e.preventDefault();e.stopImmediatePropagation();
  const dy=e.deltaY*(e.deltaMode===1?33:e.deltaMode===2?400:1);
  camDist=Math.max(ZMIN,Math.min(ZMAX,camDist*Math.exp(dy*.0015)));
 },{passive:false,capture:true});
 // sương mù và vòm Lãnh Địa theo khoảng cách camera: zoom xa vẫn thấy nhân vật và chiêu
 (function tick(){requestAnimationFrame(tick);
  const ex=Math.max(0,camDist-12),n=DC?30:60,f=DC?140:230;
  scene.fog.near=n+ex;scene.fog.far=f+ex*1.6;
  if(DC)domeM.material.opacity=camDist>DR*.85?.15:.82;
 })();
 try{GUIDE['Điều khiển']=GUIDE['Điều khiển'].replace('thu phóng gần/xa để xem chiêu rõ hơn.','thu phóng gần/xa (xa tới 220) để xem toàn bộ chiêu bao quanh.')}catch(_){}

 // ===== ĐIỆN THOẠI: chụm 2 ngón để thu phóng + 2 nút ＋ － (giữ để zoom liên tục) =====
 const cl=v=>Math.max(ZMIN,Math.min(ZMAX,v));
 let pd=0,pz=0;
 const cvs=ren.domElement;
 const two=e=>e.touches.length>=2&&e.touches[0].target===cvs&&e.touches[1].target===cvs;
 addEventListener('touchstart',e=>{if(two(e)){const a=e.touches[0],b=e.touches[1];pd=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);pz=camDist;lastX=lastY=null}},{passive:true,capture:true});
 addEventListener('touchmove',e=>{if(!two(e)||!pd)return;e.preventDefault();e.stopImmediatePropagation();
  const a=e.touches[0],b=e.touches[1],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)||1;camDist=cl(pz*pd/d);lastX=lastY=null},{passive:false,capture:true});
 addEventListener('touchend',e=>{if(e.touches.length<2)pd=0},{passive:true,capture:true});
 const ob=buildBtns;
 // Hàng trên nút Q (cột phải): [nút tròn khoá tâm] [＋] [－]. － nằm ngay trên Q (cách 6px = gap cột).
 let aimOn=false;
 const zb=(t,lb,k)=>{const b=document.createElement('button');b.className='c4';b.innerHTML='<b>'+t+'</b><i>'+lb+'</i>';let iv=0;
  const stop=()=>{clearInterval(iv);iv=0};
  b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}stop();camDist=cl(camDist*k);iv=setInterval(()=>{camDist=cl(camDist*k)},16)});
  b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);return b};
 // Nút tròn có khoá: 🔓 tắt tâm · 🔒 bật tâm = chấm trắng cố định giữa màn hình + nhân vật tự xoay theo hướng camera (như Roblox shift-lock)
 const aim=document.createElement('div');aim.style.cssText='position:fixed;left:50%;top:50%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:#fff;z-index:120;pointer-events:none;display:none';
 document.body.appendChild(aim);
 const lockBtn=()=>{const b=document.createElement('button');b.setAttribute('aria-label','Bật/tắt tâm');
  const paint=()=>{b.textContent=aimOn?'🔒':'🔓';aim.style.display=aimOn?'block':'none';b.style.cssText='width:38px;height:38px;border-radius:50%;padding:0;font-size:17px;display:flex;align-items:center;justify-content:center;border:2px solid '+(aimOn?'#fa0':'#667')+';background:'+(aimOn?'#5a3a00':'#0a0a1a')+';opacity:'+(aimOn?1:.75)};
  paint();b.addEventListener('pointerdown',e=>{e.preventDefault();aimOn=!aimOn;paint()});return b};
 // Khi bật tâm: người chơi luôn quay mặt theo hướng camera (xoay cam = xoay người); chiêu đánh vào quái gần tâm nhất
 const _rd=ren.render.bind(ren);
 ren.render=function(sc,c){if(aimOn&&!paused&&P.hp>0&&!(P.busy>0)&&!(P.cut>0)){yaw=wrapP(camYaw+Math.PI);player.rotation.y=yaw}_rd(sc,c)};
 const ot=target;
 target=function(){if(!aimOn)return ot();const fx=Math.sin(yaw),fz=Math.cos(yaw),pp=player.position;let b=null,ba=.6;
  enemies.forEach(e=>{if(e.hp<=0)return;const dx=e.m.position.x-pp.x,dz=e.m.position.z-pp.z,d=Math.hypot(dx,dz);if(d>60||d<.01)return;const an=Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(an<ba){ba=an;b=e}});
  return b?[b.m.position.x,b.m.position.z]:[pp.x+fx*12,pp.z+fz*12]};
 buildBtns=function(){ob();
  const R=$('colR'),row=document.createElement('div');row.style.cssText='display:flex;gap:6px;align-items:center;justify-content:flex-end';
  R.style.alignItems='flex-end'; // Q, Nhảy, E, M2 thẳng hàng ngay dưới nút －
  row.append(lockBtn(),zb('＋','Zoom gần',.97),zb('－','Zoom xa',1.03));R.insertBefore(row,R.firstChild)};
 buildBtns();
 // cột trái lùi xuống 15px, cột phải lùi xuống 8px; thu nhỏ cả cột nếu không đủ chỗ (không chèn HUD / hàng chiêu)
 let _k='';
 (function lay(){requestAnimationFrame(lay);
  const h=$('btns').offsetHeight,bl=Math.max(67,h+27),br=Math.max(99,h+21),L=$('colL'),R=$('colR');
  const aL=VH()-($('hudL').offsetHeight+8)-bl-6,aR=VH()-($('hudR').offsetHeight+8)-br-6;
  const sL=Math.max(.55,Math.min(1,aL/(L.offsetHeight||1))),sR=Math.max(.55,Math.min(1,aR/(R.offsetHeight||1)));
  const k=[bl,br,sL.toFixed(3),sR.toFixed(3)].join();if(k===_k)return;_k=k;
  L.style.bottom=bl+'px';R.style.bottom=br+'px';
  L.style.transformOrigin='left bottom';R.style.transformOrigin='right bottom';
  L.style.transform=sL<1?'scale('+sL+')':'';R.style.transform=sR<1?'scale('+sR+')':'';
 })();
})();
