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
})();
