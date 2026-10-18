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
 // nút ＋ (dưới Map, cột trái) và － (dưới E, cột phải): cùng cỡ nút Map (54x38)
 const zb=(t,lb,k)=>{const b=document.createElement('button');b.className='c4';b.innerHTML='<b>'+t+'</b><i>'+lb+'</i>';let iv=0;
  const stop=()=>{clearInterval(iv);iv=0};
  b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}stop();camDist=cl(camDist*k);iv=setInterval(()=>{camDist=cl(camDist*k)},16)});
  b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);return b};
 buildBtns=function(){ob();
  $('colL').appendChild(zb('＋','Zoom gần',.97));
  const R=$('colR');R.insertBefore(zb('－','Zoom xa',1.03),R.children[3]||null)};
 buildBtns();
 // cột trái lùi xuống 15px, cột phải lên 15px; thu nhỏ cả cột nếu không đủ chỗ (không chèn HUD / hàng chiêu)
 let _k='';
 (function lay(){requestAnimationFrame(lay);
  const h=$('btns').offsetHeight,bl=Math.max(67,h+27),br=Math.max(107,h+29),L=$('colL'),R=$('colR');
  const aL=VH()-($('hudL').offsetHeight+8)-bl-6,aR=VH()-($('hudR').offsetHeight+8)-br-6;
  const sL=Math.max(.55,Math.min(1,aL/(L.offsetHeight||1))),sR=Math.max(.55,Math.min(1,aR/(R.offsetHeight||1)));
  const k=[bl,br,sL.toFixed(3),sR.toFixed(3)].join();if(k===_k)return;_k=k;
  L.style.bottom=bl+'px';R.style.bottom=br+'px';
  L.style.transformOrigin='left bottom';R.style.transformOrigin='right bottom';
  L.style.transform=sL<1?'scale('+sL+')':'';R.style.transform=sR<1?'scale('+sR+')':'';
 })();
})();
