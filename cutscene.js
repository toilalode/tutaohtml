'use strict';
(function(){
const NAMES={'Càn':'乾','Khôn':'坤','Chấn':'震','Tốn':'巽','Khảm':'坎','Ly':'離','Cấn':'艮','Đoài':'兌'};
const ORDER=Object.keys(NAMES),RING=3,BACK=3.6,VBACK=8;
const CS={on:0,t0:0,convT:0,endT:0,pulseT:0};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),now=()=>performance.now();
const cvs=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return[c,c.getContext('2d')]};
const FONT='"Songti SC","Noto Serif CJK SC","PingFang SC","Heiti SC",serif';
const HZ={};let VT=null,DT=null;
function basis(){const s=Math.sin(yaw),c=Math.cos(yaw);return{pp:player.position,dx:s,dz:c,rx:c,rz:-s}}
const pulse=()=>CS.pulseT?clamp(1-(now()-CS.pulseT)/900,0,1):0;
function hanzi(ch){
 if(HZ[ch])return HZ[ch];
 const[c,g]=cvs(128,128);g.textAlign='center';g.textBaseline='middle';g.font='bold 104px '+FONT;
 g.shadowColor='#ff8a00';g.shadowBlur=18;
 const gr=g.createLinearGradient(0,10,0,118);gr.addColorStop(0,'#fff6c0');gr.addColorStop(.5,'#ffc83a');gr.addColorStop(1,'#ff7a1a');
 g.fillStyle=gr;g.fillText(ch,64,68);g.fillText(ch,64,68);
 return HZ[ch]=new THREE.CanvasTexture(c)}
function vortexTex(){
 if(VT)return VT;
 const[c,g]=cvs(512,512);g.translate(256,256);g.globalCompositeOperation='lighter';
 const pal=[['#ffe14a','#ff9a1f','#ff3b1f'],['#7dff6a','#2fd06a','#0b8a4a'],['#ffffff','#ffe9a0','#ffc040']];
 [[-5,0,'#ff3030'],[5,0,'#30ff60'],[0,5,'#3080ff']].forEach(([ox,oy,tint],pi)=>{
  g.save();g.translate(ox,oy);
  for(let i=0;i<46;i++){
   const r=14+i*5.2,a0=Math.random()*6.283,len=1.2+Math.random()*3.2,w=2+Math.random()*(5+i*.12);
   g.strokeStyle=i%7==0?tint:pal[(i+pi)%3][i%3];g.globalAlpha=Math.max(.15,.55-i*.006);g.lineWidth=w;
   g.beginPath();g.arc(0,0,r,a0,a0+len);g.stroke()}
  g.restore()});
 g.globalAlpha=1;
 const rg=g.createRadialGradient(0,0,0,0,0,150);rg.addColorStop(0,'rgba(255,255,230,.95)');rg.addColorStop(.35,'rgba(255,214,70,.55)');rg.addColorStop(1,'rgba(255,120,20,0)');
 g.fillStyle=rg;g.beginPath();g.arc(0,0,256,0,7);g.fill();
 g.globalCompositeOperation='destination-in';
 const mk=g.createRadialGradient(0,0,0,0,0,256);mk.addColorStop(0,'rgba(0,0,0,1)');mk.addColorStop(.6,'rgba(0,0,0,1)');mk.addColorStop(1,'rgba(0,0,0,0)');
 g.fillStyle=mk;g.fillRect(-256,-256,512,512);
 return VT=new THREE.CanvasTexture(c)}
function domeTex(){
 if(DT)return DT;
 const[c,g]=cvs(1024,512);
 const gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,'#5a1400');gr.addColorStop(.35,'#ff7a12');gr.addColorStop(.55,'#ffd23a');gr.addColorStop(.8,'#ff6a10');gr.addColorStop(1,'#4a0c00');
 g.fillStyle=gr;g.fillRect(0,0,1024,512);g.globalCompositeOperation='lighter';
 for(let i=0;i<70;i++){
  const x=Math.random()*1024,y=Math.random()*512,w=60+Math.random()*320;
  g.fillStyle='rgba('+(i%5==0?'60,255,120':'255,'+(120+Math.random()*120|0)+',30')+','+(.05+Math.random()*.12)+')';
  g.fillRect(x,y,w,2+Math.random()*10)}
 g.font='bold 150px '+FONT;g.fillStyle='rgba(255,210,80,.38)';g.textAlign='center';
 '乾坤震巽坎離艮兌'.split('').forEach((ch,i)=>g.fillText(ch,64+i*128,120+(i%2)*260));
 g.strokeStyle='rgba(255,225,120,.55)';g.lineWidth=4;
 for(let i=0;i<12;i++){g.beginPath();g.moveTo(i*86,0);g.lineTo(i*86+30,512);g.stroke()}
 return DT=new THREE.CanvasTexture(c)}
function begin(){
 if(CS.on)return;
 CS.on=1;CS.t0=now();CS.convT=0;CS.endT=0;CS.pulseT=0;
 const life=Math.max(P.cut,30);
 gr.visible=false;shadow.visible=false;cv.style.filter='saturate(1.7) contrast(1.12) brightness(1.05)';
 const dome=new THREE.Mesh(new THREE.SphereGeometry(48,24,16),new THREE.MeshBasicMaterial({map:domeTex(),side:THREE.BackSide,fog:false,depthWrite:false}));
 dome.renderOrder=-.5;
 add(dome,life,f=>{
  dome.position.copy(player.position);dome.rotation.y=(now()-CS.t0)/9000;
  if(f.life<=0){gr.visible=true;shadow.visible=true;cv.style.filter='';CS.on=0}});
 [[20,1,1.3],[34,.55,-.8]].forEach(([sz,op,sp])=>{
  const m=new THREE.Mesh(new THREE.PlaneGeometry(sz,sz),new THREE.MeshBasicMaterial({map:vortexTex(),transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,side:THREE.DoubleSide}));
  m.renderOrder=-.2;
  add(m,life,()=>{
   const b=basis();m.position.set(b.pp.x-b.dx*VBACK,b.pp.y+1.7,b.pp.z-b.dz*VBACK);
   m.lookAt(cam.position);m.rotateZ((now()-CS.t0)/1000*sp);m.scale.setScalar(1+pulse()*1.2)})});
 const sg=new THREE.Group(),sb=new THREE.Mesh(new THREE.BoxGeometry(44,.07,.07),new THREE.MeshBasicMaterial({color:0x0a0a0a}));
 sb.rotation.z=-.42;sg.add(sb);
 add(sg,life,f=>{
  const b=basis();sg.position.set(b.pp.x-b.dx*(VBACK-.6),b.pp.y+1.7,b.pp.z-b.dz*(VBACK-.6));
  sg.lookAt(cam.position);sg.scale.set(clamp((f.max-f.life)/14,.001,1),1,1)});
 const N=140,pos=new Float32Array(N*3),seed=[];
 for(let i=0;i<N;i++)seed.push([Math.random()*6.283,Math.random(),.5+Math.random()]);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const pm=new THREE.PointsMaterial({color:0xffe28a,size:.3,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false,fog:false});
 const pts=new THREE.Points(geo,pm);pts.frustumCulled=false;
 add(pts,life,f=>{
  const b=basis(),T=(now()-CS.t0)/1000,cx=b.pp.x-b.dx*VBACK,cy=b.pp.y+1.7,cz=b.pp.z-b.dz*VBACK;
  for(let i=0;i<N;i++){
   const s=seed[i],r=((s[1]+T*.35*s[2])%1)*13,ca=Math.cos(s[0]+T*.6),sa=Math.sin(s[0]+T*.6);
   pos[i*3]=cx+b.rx*ca*r;pos[i*3+1]=cy+sa*r*.8;pos[i*3+2]=cz+b.rz*ca*r}
  geo.attributes.position.needsUpdate=true;
  if(f.life<=0){geo.dispose();pm.dispose()}})}
function spawn(k){
 flash([0xffd646,0xff9a1f,0xff5030,0x7dff6a][k%4]);shake=Math.max(shake,5+k*.6);
 const a0=Math.PI/2-(k+.5)*Math.PI/4,mt=mat(0xfff2c0,.92),g=roblox({mat:mt}),u=g.userData;
 u.aL.rotation.x=-1.2-Math.random()*1.4;u.aR.rotation.x=-1.2-Math.random()*1.4;
 u.lL.rotation.x=Math.random()*.7-.35;u.lR.rotation.x=Math.random()*.7-.35;
 const h=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),new THREE.MeshBasicMaterial({map:hanzi(NAMES[ORDER[k]]),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false,fog:false,side:THREE.DoubleSide}));
 h.renderOrder=5;
 const grp=new THREE.Group();grp.add(g,h);
 add(grp,Math.max(P.cut,1),f=>{
  const b=basis(),T=(now()-CS.t0)/1000,pop=clamp((f.max-f.life)/8,0,1);
  const cp=CS.convT?clamp((now()-CS.convT)/650,0,1):0,e=cp*cp,gone=CS.endT?clamp((now()-CS.endT)/250,0,1):0;
  const s=Math.max(pop*(1-.97*e)*(1-gone),.001),a=a0-T*.22,ca=Math.cos(a),sa=Math.sin(a);
  const cx=b.pp.x-b.dx*BACK,cy=b.pp.y+1.7,cz=b.pp.z-b.dz*BACK,r=RING*(1-e),r2=r+1.9;
  g.position.set(cx+b.rx*ca*r,cy+sa*r-1.3*s,cz+b.rz*ca*r);g.rotation.y=yaw;g.scale.setScalar(1.1*s);
  h.position.set(cx+b.rx*ca*r2,cy+sa*r2,cz+b.rz*ca*r2);h.lookAt(cam.position);h.scale.setScalar(s*(1+.12*Math.sin(T*6+k)))})}
const baseSay=say;
say=function(t,ms){
 const r=baseSay(t,ms),b=$('banner');
 if(P.cut>0){
  b.style.color='#fff';b.style.fontSize='clamp(20px,5.5vw,38px)';b.style.textShadow='0 0 4px #000,0 0 4px #000,0 0 12px #f80,0 0 22px #f50';
  begin();
  const k=ORDER.indexOf(t);
  if(k>=0)spawn(k);
  else if(t=='Bát Quái Quy Nhất'){CS.convT=now();flash(0xffd646);shake=Math.max(shake,10)}
  else if(t=='Thái Cực Thần Trảm'){CS.endT=now();CS.pulseT=now();flash(0xffffff);shake=Math.max(shake,22)}
 }else{b.style.color='';b.style.fontSize='';b.style.textShadow=''}
 return r};
})();
