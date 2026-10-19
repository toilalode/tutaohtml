'use strict';
(function(){
 const ZMIN=3,ZMAX=220;
 cam.far=1200;cam.updateProjectionMatrix();
 skyM.scale.setScalar(3);
 gr.scale.setScalar(3);gtex.repeat.set(210,210);
 const skip='#guide,#popup,#tp,#kp';
 addEventListener('wheel',e=>{
  if(e.target.closest&&e.target.closest(skip))return;
  e.preventDefault();e.stopImmediatePropagation();
  const dy=e.deltaY*(e.deltaMode===1?33:e.deltaMode===2?400:1);
  camDist=Math.max(ZMIN,Math.min(ZMAX,camDist*Math.exp(dy*.0015)));
 },{passive:false,capture:true});
 (function tick(){requestAnimationFrame(tick);
  const ex=Math.max(0,camDist-12),n=DC?30:60,f=DC?140:230;
  scene.fog.near=n+ex;scene.fog.far=f+ex*1.6;
  if(DC)domeM.material.opacity=camDist>DR*.85?.15:.82;
 })();
 try{GUIDE['Điều khiển']=GUIDE['Điều khiển'].replace('thu phóng gần/xa để xem chiêu rõ hơn.','thu phóng gần/xa (xa tới 220) để xem toàn bộ chiêu bao quanh.')}catch(_){}
 const cl=v=>Math.max(ZMIN,Math.min(ZMAX,v));
 let pd=0,pz=0;
 const cvs=ren.domElement;
 const two=e=>e.touches.length>=2&&e.touches[0].target===cvs&&e.touches[1].target===cvs;
 addEventListener('touchstart',e=>{if(two(e)){const a=e.touches[0],b=e.touches[1];pd=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);pz=camDist;lastX=lastY=null}},{passive:true,capture:true});
 addEventListener('touchmove',e=>{if(!two(e)||!pd)return;e.preventDefault();e.stopImmediatePropagation();
  const a=e.touches[0],b=e.touches[1],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)||1;camDist=cl(pz*pd/d);lastX=lastY=null},{passive:false,capture:true});
 addEventListener('touchend',e=>{if(e.touches.length<2)pd=0},{passive:true,capture:true});
 let aimOn=false,zk=0;
 const zb=(t,lb,k)=>{const b=document.createElement('button');b.className='c4';b.style.cssText='width:54px;height:38px;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:bold;padding:0';b.innerHTML='<b style="font-size:13px">'+t+'</b><i style="font-size:7px;font-style:normal;color:#aaa;white-space:nowrap">'+lb+'</i>';let iv=0;
  const stop=()=>{clearInterval(iv);iv=0};
  b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}stop();camDist=cl(camDist*k);iv=setInterval(()=>{camDist=cl(camDist*k)},16)});
  b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);return b};
 const aim=document.createElement('div');aim.style.cssText='position:fixed;left:50%;top:50%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:#fff;z-index:120;pointer-events:none;display:none';
 document.body.appendChild(aim);
 const lockB=document.createElement('button');lockB.setAttribute('aria-label','Bật/tắt tâm (Shift)');
 const setAim=v=>{aimOn=v;paint()};
 function paint(){const b=lockB;b.textContent=aimOn?'🔒':'🔓';aim.style.display=aimOn?'block':'none';b.style.cssText='width:38px;height:38px;border-radius:50%;padding:0;font-size:17px;display:flex;align-items:center;justify-content:center;border:2px solid '+(aimOn?'#fa0':'#667')+';background:'+(aimOn?'#5a3a00':'#0a0a1a')+';opacity:'+(aimOn?1:.75)}
 paint();lockB.addEventListener('pointerdown',e=>{e.preventDefault();setAim(!aimOn)});
 const ab=document.createElement('button');ab.textContent='Tấn công';$('tpFull').after(ab);
 const dummy=()=>MAP==='test'?enemies.find(x=>x.dummy):null;
 ab.addEventListener('click',()=>{const e=dummy();if(!e)return;e.atk=!e.atk;e.wind=0;e.cd=.8;e.hx=e.m.position.x;e.hz=e.m.position.z;const u=e.m.userData;u.lL.rotation.x=u.lR.rotation.x=0;if(e.stars)e.stars.visible=!e.atk});
 let lt=performance.now(),abOn=null;
 function dummyStep(){const now=performance.now(),dt=Math.min(.05,(now-lt)/1000);lt=now;
  const e=dummy();if(!e)return;const on=!!e.atk;if(on!==abOn){abOn=on;ab.style.background=on?'#e03030':'';ab.style.boxShadow=on?'0 0 6px #f44':''}
  if(!on)return;
  e.stars&&(e.stars.visible=false);e.m.rotation.z=0;
  const ep=e.m.position;if(e.hx===undefined){e.hx=ep.x;e.hz=ep.z}ep.x=e.hx;ep.z=e.hz;
  if(paused||P.hp<=0||e.hp<=0)return;
  const u=e.m.userData,pp=player.position,dx=pp.x-ep.x,dz=pp.z-ep.z,l=Math.hypot(dx,dz)||.001;
  let sl=(P.dom5>0||P.tf?0:1);if(P.dom4>0&&l<12)sl=0;if(P.lt>0&&DC&&Math.hypot(ep.x-DC.x,ep.z-DC.z)<DR)sl=0;if(P.ap>0)sl=0;
  if(sl<=0)return;
  e.m.rotation.y=Math.atan2(dx,dz);e.cd-=dt;u.lL.rotation.x=u.lR.rotation.x=0;
  if(e.wind>0){e.wind-=dt;u.aL.rotation.x=u.aR.rotation.x=-2.7;
   if(e.wind<=0){if(l<2.6&&pp.y<3.5)hurt(12);e.cd=1.7;u.aL.rotation.x=u.aR.rotation.x=-.7}}
  else if(e.cd<=0)e.wind=.6;
  else u.aL.rotation.x=u.aR.rotation.x=e.cd>1.2?-.7:-1.45}
 const _rd=ren.render.bind(ren);
 ren.render=function(sc,c){dummyStep();if(aimOn&&!paused&&P.hp>0&&!(P.busy>0)&&!(P.cut>0)){yaw=wrapP(camYaw+Math.PI);player.rotation.y=yaw}_rd(sc,c)};
 const ot=target;
 target=function(){if(!aimOn)return ot();const fx=Math.sin(yaw),fz=Math.cos(yaw),pp=player.position;let b=null,ba=.6;
  enemies.forEach(e=>{if(e.hp<=0)return;const dx=e.m.position.x-pp.x,dz=e.m.position.z-pp.z,d=Math.hypot(dx,dz);if(d>60||d<.01)return;const an=Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(an<ba){ba=an;b=e}});
  return b?[b.m.position.x,b.m.position.z]:[pp.x+fx*12,pp.z+fz*12]};
 const row=document.createElement('div');row.style.cssText='display:flex;gap:6px;align-items:center;justify-content:flex-end;margin-top:6px;pointer-events:auto';
 row.append(lockB,zb('＋','Zoom gần (O)',.97),zb('－','Zoom xa (P)',1.03));$('hudR').appendChild(row);
 addEventListener('keydown',e=>{const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
  if(e.code==='KeyO')zk=-1;else if(e.code==='KeyP')zk=1;
  else if((e.code==='ShiftLeft'||e.code==='ShiftRight')&&!e.repeat)setAim(!aimOn)},true);
 addEventListener('keyup',e=>{if((e.code==='KeyO'&&zk<0)||(e.code==='KeyP'&&zk>0))zk=0},true);
 addEventListener('blur',()=>{zk=0});
 (function zkl(){requestAnimationFrame(zkl);if(zk)camDist=cl(camDist*(zk<0?.97:1.03))})();
 let dWas=false,dLast=null,dSnap=[],dAcc=0;
 const dHit=(c,list,m)=>{const k=m*dmgMul();list.forEach(e=>{if(e.hp>0&&Math.hypot(e.m.position.x-c.x,e.m.position.z-c.z)<DR){e.hp-=k;e.hit=8}})};
 (function domLoop(){requestAnimationFrame(domLoop);const now=performance.now();
  if(DC){if(!dWas){dWas=true;dAcc=now}dLast={x:DC.x,z:DC.z};dSnap=enemies.slice();
   if(!paused&&now-dAcc>=200){dAcc=now;dHit(dLast,dSnap,150)}}
  else if(dWas){dWas=false;if(dLast&&!paused){dHit(dLast,dSnap,1500);try{FXK('blade',{x:dLast.x,z:dLast.z,col:GOLD});flash(GOLD)}catch(_){}}dSnap=[]}
 })();
 const fit=(C,bottom,hud)=>{const n=C.children.length||1,a=VH()-(hud.offsetHeight+8)-bottom-6;
  let g=n>1?(a-n*38)/(n-1):6;g=Math.max(1,Math.min(6,g));return[g,Math.max(.55,Math.min(1,a/(n*38+(n-1)*g)))]};
 let _k='';
 (function lay(){requestAnimationFrame(lay);
  const h=$('btns').offsetHeight,bl=Math.max(67,h+27),br=Math.max(84,h+38),L=$('colL'),R=$('colR');
  const[gL,sL]=fit(L,bl,$('hudL')),[gR,sR]=fit(R,br,$('hudR'));
  const k=[bl,br,L.children.length,R.children.length,gL.toFixed(2),gR.toFixed(2),sL.toFixed(3),sR.toFixed(3)].join();if(k===_k&&R.style.bottom===br+'px'&&L.style.bottom===bl+'px')return;_k=k;
  L.style.bottom=bl+'px';R.style.bottom=br+'px';L.style.gap=gL+'px';R.style.gap=gR+'px';
  L.style.transformOrigin='left bottom';R.style.transformOrigin='right bottom';
  L.style.transform=sL<1?'scale('+sL+')':'';R.style.transform=sR<1?'scale('+sR+')':'';
 })();
})();
