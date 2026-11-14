'use strict';
(function(){
const ST=3,LINES=['Âm Dương Vô Cực','Nhất Kiếm Vô Thùy','Nhất Niệm Vị Sinh!'];
const FLY=300,CONV=54,DROP=9,AFTER=44,BLAST=44,SPARKS=1600,STORM=6e9,SLAM=12e9,BOOM=12e9,TAIJI=5e10;
const HOLD=30,CHARGE=240,CLONE_GAP=10,TAP_HIT=1e10,CLONE_HIT=1e11,FINAL_HIT=5e11,FORBID_SLASH=1e11,FORBID_BOOM=1.5e11,FAR_EXTRA=90,INK=0x16161c,PAPER=0xffffff;
SK[ST].g={n:'Tối Cao Áo Nghĩa',cd:2400,sp:'supreme',sta:80,tot:(STORM+SLAM+BOOM)/3+TAIJI};
NOTE[ST].g='Đồ hình Thái Cực khổng lồ hiện dưới chân, niệm 3 câu chú. Thiên Mệnh Kiếm đổi màu, tự bay lên uốn lượn, mỗi giây tung hàng nghìn nhát chém Thái Cực. Sau đó Thái Cực khổng lồ hiện trên trời, kiếm hội tụ sức mạnh chém xuống đất tạo hố Thái Cực khổng lồ và vụ nổ siêu mạnh. Cuối cùng là vụ nổ Thái Cực 50 tỷ sát thương, thanh kiếm đổi màu âm dương đen trắng.';
NOTE[ST].n='Bấm nhẹ: 1 nhát chém 10 tỷ. Giữ hơn 0,5 giây: hiện thanh tích luỹ tinh tuý trên hàng chiêu, phân thân chém liên tục (tổng khoảng 100 tỷ); tích luỹ đầy thì cùng phân thân chém 500 tỷ, chưa đầy thì sát thương theo phần trăm tích luỹ.';
NOTE[ST].j='Cutscene quay từ xa, thấy rõ mặt nhân vật và trọn cả chiêu, niệm 8 quẻ rồi Thái Cực Thần Trảm 1000 tỷ sát thương.';
NOTE[ST].f='Chém ra những đường nét Thái Cực, niệm 4 câu chú, bay lên tung nhát chém Nhất Họa Khai Thiên kèm vụ nổ Bát Quái siêu mạnh, tổng 250 tỷ; sau đó cơ thể mệt, hồi chiêu ×1.5 trong 10 giây.';
GUIDE['Mẹo']=GUIDE['Mẹo'].replace('cutscene cận mặt nhân vật lúc niệm chú','cutscene quay từ xa, thấy rõ mặt nhân vật và trọn cả chiêu');
let away=false,craterTex=null;
const baseLook=swordLook;
swordLook=function(){baseLook();PA.sb.visible=PA.sg.visible=!away;if(away)SWH.visible=false};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const crater=()=>craterTex||(craterTex=tex((g,r)=>{
 const gd=g.createRadialGradient(0,0,r*.08,0,0,r);
 gd.addColorStop(0,'rgba(0,0,0,1)');gd.addColorStop(.62,'rgba(12,0,28,.96)');gd.addColorStop(.86,'rgba(255,214,70,.92)');gd.addColorStop(1,'rgba(255,214,70,0)');
 g.fillStyle=gd;g.beginPath();g.arc(0,0,r,0,7);g.fill();
 g.save();g.scale(.66,.66);taijiDraw(g,r,'#d8d0ff');g.restore()},512));
function buildSword(){
 const g=new THREE.Group(),mats=[];
 const part=(geo,x,z,o)=>{const m=mat(GOLD,o),k=new THREE.Mesh(geo,m);k.position.set(x,0,z);g.add(k);mats.push(m);return k};
 part(new THREE.BoxGeometry(.45,.14,6.4),0,3.6,.95);
 part(new THREE.BoxGeometry(1.8,.2,.28),0,.4,.95);
 part(new THREE.BoxGeometry(.2,.2,1.4),0,-.5,.95);
 part(new THREE.SphereGeometry(1,12,8),0,3,.28).scale.set(1.6,1.6,4.6);
 g.scale.setScalar(1.8);
 return{g,mats}}
function buildSparks(){
 const pos=new Float32Array(SPARKS*3),col=new Float32Array(SPARKS*3);
 for(let i=0;i<SPARKS;i++){pos[i*3+1]=-500;col.fill(i%2?1:.06,i*3,i*3+3)}
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
 const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:1.1,vertexColors:true,transparent:true,opacity:.95,depthWrite:false}));
 pts.frustumCulled=false;
 return{pts,pos,geo}}
function path(f,o){
 const u=f/FLY,r=clamp(f/40,0,1),e=1-(1-r)*(1-r),a=u*20.1,rad=4+9*e*(.65+.35*Math.sin(u*9.4));
 o[0]=player.position.x+Math.cos(a)*rad;o[1]=2+e*14+Math.sin(a*1.7)*4*e;o[2]=player.position.z+Math.sin(a)*rad;return o}
async function supreme(){
 const pp=player.position,cam0=camDist,p1=[0,0,0],p2=[0,0,0],from=[0,0,0],ahead=[0,0,0];
 const floor=plane(texTaiji,64,.9),halo=plane(texBagua,96,.7),sky=plane(texTaiji,72,.9),skyH=plane(texBaguaP,110,.7);
 const swd=buildSword(),spk=buildSparks(),flats=[floor,halo,sky,skyH];
 flats.forEach(m=>{m.rotation.x=-Math.PI/2});
 let fs=.05,ss=.001,goal=Math.max(cam0,32),ck=.05,tx=pp.x,tz=pp.z;
 const tick=()=>{
  floor.position.set(pp.x,.12,pp.z);halo.position.set(pp.x,.11,pp.z);
  floor.rotation.z+=.04;halo.rotation.z-=.025;floor.scale.setScalar(fs);halo.scale.setScalar(fs);
  sky.position.set(tx,38,tz);skyH.position.set(tx,37.6,tz);
  sky.rotation.z+=.05;skyH.rotation.z-=.03;sky.scale.setScalar(ss);skyH.scale.setScalar(ss);
  camDist+=(goal-camDist)*ck};
 const go=async(n,fn)=>{for(let f=0;f<n;f++){fn(f,n,f/Math.max(1,n-1));tick();await wait(1)}};
 const place=f=>{path(f,p1);swd.g.position.set(p1[0],p1[1],p1[2]);path(f+3,p2);swd.g.lookAt(p2[0],p2[1],p2[2])};
 const paint=f=>swd.mats.forEach((m,i)=>m.color.setHex((((f>>3)+i)&1)?0x0c0c10:PAPER));
 const retarget=()=>{const t=target();tx=t[0];tz=t[1]};
 const ball=(c,o,s,life)=>{const m=new THREE.Mesh(G('S16',()=>new THREE.SphereGeometry(1,16,12)),mat(c,o));m.position.set(tx,2,tz);add(m,life,(f,t)=>{m.scale.setScalar(.5+t*s);m.material.opacity=o*(1-t*t)})};
 const rg=(c,s,life)=>{const m=new THREE.Mesh(G('R40',()=>new THREE.RingGeometry(.9,1,40)),mat(c,.9));m.rotation.x=-Math.PI/2;m.position.set(tx,.3,tz);add(m,life,(f,t)=>{m.scale.setScalar(2+t*s);m.material.opacity=.9*(1-t)})};
 P.busy++;P.lk++;
 try{
  scene.add(floor,halo);flash(PURP);shake=Math.max(shake,10);
  await go(26,(f,n,k)=>{fs=.05+.95*Math.sin(k*Math.PI/2)});
  for(let i=0;i<LINES.length;i++){
   say(LINES[i],1100);FXK('ring',{r:8+i*8,life:30,col:i==2?GOLD:PURP});shake=Math.max(shake,6+i*4);
   await go(36,()=>{})}
  flash(0xffffff);
  scene.add(swd.g,spk.pts);away=true;
  await go(FLY,f=>{
   retarget();place(f);paint(f);hit(tx,tz,26,STORM/FLY,.2);
   for(let n=0;n<SPARKS/3;n++){
    const i=(Math.random()*SPARKS)|0;path(Math.max(0,f-Math.random()*36),p1);
    spk.pos[i*3]=p1[0]+(Math.random()-.5)*6;spk.pos[i*3+1]=p1[1]+(Math.random()-.5)*6;spk.pos[i*3+2]=p1[2]+(Math.random()-.5)*6}
   spk.geo.attributes.position.needsUpdate=true;
   for(let n=0;n<2;n++)FXK('slash',{x:tx+(Math.random()-.5)*34,z:tz+(Math.random()-.5)*34,r:3+(Math.random()*3|0)*1.5,col:n?0xffffff:PURP});
   if(f%30==0)shake=Math.max(shake,8)});
  scene.add(sky,skyH);path(FLY,from);path(FLY+3,ahead);flash(PURP);
  await go(CONV,(f,n,k)=>{
   const e=k*k*(3-2*k),g=swd.g,q=g.position;
   retarget();
   g.position.set(from[0]+(tx-from[0])*e,from[1]+(36-from[1])*e,from[2]+(tz-from[2])*e);
   g.lookAt(q.x+(ahead[0]-from[0])*(1-e),q.y+(ahead[1]-from[1])*(1-e)-e*6,q.z+(ahead[2]-from[2])*(1-e));
   g.scale.setScalar(1.8+1.4*e);paint(FLY+f*2);ss=e;
   for(let i=0;i<SPARKS;i++){const j=i*3;spk.pos[j]+=(q.x-spk.pos[j])*.09;spk.pos[j+1]+=(q.y-spk.pos[j+1])*.09;spk.pos[j+2]+=(q.z-spk.pos[j+2])*.09}
   spk.geo.attributes.position.needsUpdate=true;
   if(f%12==0)shake=Math.max(shake,5)});
  const hx=tx,hz=tz;
  await go(DROP,(f,n,k)=>{
   const e=k*k,g=swd.g,q=g.position;
   g.position.set(hx,36*(1-e)+1,hz);g.lookAt(hx,-20,hz);
   for(let i=0;i<SPARKS;i++){const j=i*3;spk.pos[j]=q.x+(Math.random()-.5)*3;spk.pos[j+1]=q.y+Math.random()*4;spk.pos[j+2]=q.z+(Math.random()-.5)*3}
   spk.geo.attributes.position.needsUpdate=true});
  flash(0xffffff);shake=Math.max(shake,36);
  hit(hx,hz,40,SLAM,4);
  const cr=plane(crater(),76,.95);cr.rotation.x=-Math.PI/2;cr.position.set(hx,.2,hz);
  add(cr,190,(f,t)=>{cr.scale.setScalar(Math.min(1,.12+t*9));cr.rotation.z+=.01;cr.material.opacity=t>.72?.95*(1-t)/.28:.95});
  ball(0xffffff,.85,BLAST,44);ball(PURP,.55,BLAST*1.4,60);ball(GOLD,.4,BLAST*1.8,76);
  rg(0xffffff,120,50);rg(PURP,160,64);rg(GOLD,200,80);
  const pl=new THREE.Mesh(G('CYP',()=>new THREE.CylinderGeometry(1,1,1,20,1,true)),mat(0xffffff,.7));
  pl.scale.set(9,140,9);pl.position.set(hx,70,hz);
  add(pl,34,(f,t)=>{pl.scale.x=pl.scale.z=9+t*16;pl.material.opacity=.7*(1-t)});
  hit(hx,hz,60,BOOM,6);
  ck=.12;goal=cam0;
  await go(AFTER,(f,n,k)=>{
   ss=Math.max(.001,1-k*2);
   swd.mats.forEach(m=>{m.opacity=Math.max(0,m.opacity-.03)});
   for(let i=0;i<SPARKS;i++){const j=i*3;spk.pos[j]+=(spk.pos[j]-hx)*.08;spk.pos[j+1]+=Math.random()*.8;spk.pos[j+2]+=(spk.pos[j+2]-hz)*.08}
   spk.geo.attributes.position.needsUpdate=true;
   if(f%8==0)shake=Math.max(shake,20)});
  flash(PAPER);shake=Math.max(shake,40);
  hit(hx,hz,80,TAIJI*3,8);
  const tj=plane(texTaiji,1,.95);tj.rotation.x=-Math.PI/2;tj.position.set(hx,.35,hz);
  add(tj,80,(f,t)=>{tj.scale.setScalar(8+t*170);tj.rotation.z+=.1;tj.material.opacity=.95*(1-t*t)});
  ball(PAPER,.85,BLAST*2.2,60);ball(0x0c0c10,.75,BLAST*1.7,76);
  rg(PAPER,240,60);rg(0x0c0c10,300,76);
  await go(50,f=>{if(f%6==0)shake=Math.max(shake,28)})
 }finally{
  away=false;camDist=cam0;
  flats.concat(swd.g,spk.pts).forEach(o=>scene.remove(o));
  flats.concat(swd.g).forEach(freeObj);
  spk.geo.dispose();spk.pts.material.dispose();
  P.busy--;P.lk--}}
const FORBID_LINES=['Càn Vi Thiên','Khôn Vi Địa','Âm Dương Lưỡng Nghi','Phủ Cái Âm Dương Bát Cực'],FORBID_FINAL='Thái Cực Kiếm Pháp - Cấm Kị Chung Chương: Nhất Họa Khai Thiên';
const flatDisc=(x,z,t,size,life,spin)=>{const m=plane(t,1,.9);m.rotation.x=-Math.PI/2;m.position.set(x,.3,z);add(m,life,(f,k)=>{m.scale.setScalar(6+k*size);m.rotation.z+=spin;m.material.opacity=.9*(1-k)});return m};
function taijiStroke(i){
 const pp=player.position,n=6+i*2,rad=4+i*2.5;
 for(let k=0;k<n;k++){const a=k/n*6.283+i;FXK('slash',{x:pp.x+Math.cos(a)*rad,z:pp.z+Math.sin(a)*rad,r:4+i,col:k&1?PAPER:INK})}
 FXK('floor',{tex:i&1?texTaiji:texBagua,size:8+i*5,life:70});
 FXK('ring',{r:6+i*7,life:36,col:i&1?PAPER:INK});
 shake=Math.max(shake,5+i*2)}
async function forbid(){
 let rose=false;
 P.busy++;P.lk++;P.tf=1;
 try{
  for(let i=0;i<FORBID_LINES.length;i++){say(FORBID_LINES[i],1000);taijiStroke(i);await wait(28)}
  P.flyN++;P.flyH=26;rose=true;flash(PURP);
  await wait(46);
  say(FORBID_FINAL,2800);
  FXK('aura',{life:56,col:GOLD});FXK('ring',{r:34,life:44,col:GOLD});FXK('back',{tex:texBagua,size:12,life:64});
  await wait(56);
  const[tx,tz]=target();
  FXK('sky',{col:PAPER});FXK('sky',{col:INK});
  FXK('slash',{x:tx,z:tz,r:30,col:PAPER});FXK('slash',{x:tx,z:tz,r:24,col:INK});FXK('beam',{x:tx,z:tz,col:GOLD});
  flash(PAPER);shake=Math.max(shake,40);
  hit(tx,tz,60,FORBID_SLASH*3,3);
  await wait(12);
  FXK('boom',{x:tx,z:tz,r:44,col:PAPER});FXK('boom',{x:tx,z:tz,r:32,col:INK});
  flatDisc(tx,tz,texBagua,150,60,.08);flatDisc(tx,tz,texBaguaP,110,50,-.1);flatDisc(tx,tz,texTaiji,70,44,.12);
  FXK('ring',{r:60,life:40,col:PAPER});
  flash(GOLD);shake=Math.max(shake,52);
  hit(tx,tz,90,FORBID_BOOM*3,6);
  await wait(44);
  P.fat=600;toast('Cấm Kị: cơ thể mệt, hồi chiêu lâu hơn')
 }finally{P.busy--;P.lk--;P.tf=0;if(rose){P.flyN--;P.fly=Math.max(P.fly,25)}}}
let nPid=-1,nTouch=false;
const nHeld=()=>!!keys.KeyN||nTouch;
const nRelease=e=>{if(e.pointerId===nPid){nPid=-1;nTouch=false}};
addEventListener('pointerup',nRelease);addEventListener('pointercancel',nRelease);
const baseBuild=buildBtns;
buildBtns=function(){baseBuild();const b=bt.N;if(b)b.addEventListener('pointerdown',e=>{nPid=e.pointerId;nTouch=true})};
const charge=document.createElement('div'),chargeFill=document.createElement('i');
Object.assign(charge.style,{position:'fixed',display:'none',height:'5px',background:'rgba(0,0,0,.55)',border:'1px solid #fff',borderRadius:'3px',zIndex:'250',pointerEvents:'none',overflow:'hidden'});
Object.assign(chargeFill.style,{display:'block',height:'100%',width:'0%',background:'linear-gradient(90deg,#fff,#222,#fff)'});
charge.appendChild(chargeFill);document.body.appendChild(charge);
function chargeShow(k){
 const kids=$('btns').children;if(!kids.length)return;
 let l=1e9,r=0,t=1e9;
 for(const b of kids){const q=b.getBoundingClientRect();l=Math.min(l,q.left);r=Math.max(r,q.right);t=Math.min(t,q.top)}
 const bn=$('banner').getBoundingClientRect();
 charge.style.left=l+'px';charge.style.width=(r-l)+'px';charge.style.top=((bn.height>0?bn.top:t)-12)+'px';charge.style.display='block';
 chargeFill.style.width=(k*100).toFixed(1)+'%'}
const chargeHide=()=>{charge.style.display='none';chargeFill.style.width='0%'};
function makeClone(){const g=roblox({mat:mat(0xeee8ff,.55),sword:1.5});scene.add(g);return g}
async function baquai(sp){
 let clone=null;
 P.busy++;P.lk++;
 try{
  await wait(2);
  let f=0;
  while(f<HOLD&&nHeld()){f++;await wait(1)}
  if(!nHeld()){
   say(sp.n,900);await wait(14);
   const[ax,az]=target();strike('slash',ax,az,TAP_HIT*3,9,PURP);
   return}
  say('Tích Luỹ Tinh Tuý',1100);
  clone=makeClone();
  const u=clone.userData,pp=player.position;
  let c=0;
  while(c<CHARGE&&nHeld()){
   c++;
   const[cx,cz]=target();
   clone.position.set(pp.x+Math.cos(yaw)*3.2,pp.y,pp.z-Math.sin(yaw)*3.2);clone.rotation.y=yaw;
   u.aR.rotation.x=-1.2-Math.abs(Math.sin(c*.45))*1.7;
   if(c%CLONE_GAP==0){FXK('slash',{x:cx,z:cz,r:5,col:c%(CLONE_GAP*2)?PAPER:INK});hit(cx,cz,9,CLONE_HIT*3*CLONE_GAP/CHARGE,.2)}
   chargeShow(c/CHARGE);
   await wait(1)}
  const k=c/CHARGE,[tx,tz]=target();
  chargeHide();
  say(k>=1?'Âm Dương Bát Quái Trảm — Viên Mãn!':'Âm Dương Bát Quái Trảm!',1200);
  FXK('slash',{x:tx,z:tz,r:14+12*k,col:PAPER});FXK('slash',{x:tx,z:tz,r:10+12*k,col:INK});
  FXK('boom',{x:tx,z:tz,r:12+14*k,col:PURP});FXK('ring',{r:14+16*k,life:30,col:PAPER});
  flash(PAPER);shake=Math.max(shake,12+20*k);
  hit(tx,tz,18+12*k,FINAL_HIT*3*k,3);
  await wait(20)
 }finally{
  chargeHide();
  if(clone){scene.remove(clone);freeObj(clone)}
  P.busy--;P.lk--}}
const baseRender=ren.render.bind(ren);
ren.render=function(s,c){
 if(P.cutFar&&P.cut>0){
  const pp=player.position,k=1-P.cut/(P.cutMax||1),a=yaw+.9,d=15-k*4;
  c.up.set(0,1,0);c.position.set(pp.x+Math.sin(a)*d,pp.y+3.4,pp.z+Math.cos(a)*d);c.lookAt(pp.x+Math.sin(yaw)*3,pp.y+2.8,pp.z+Math.cos(yaw)*3)}
 return baseRender(s,c)};
const baseRun=run;
run=function(sp,k0){
 if(sp.sp==='supreme')return supreme();
 if(sp.sp==='baquai')return baquai(sp);
 if(sp.sp==='forbid')return forbid();
 const r=baseRun(sp,k0);
 if(sp.cutfar){P.cut+=FAR_EXTRA;P.cutMax=P.cut;P.cutFar=1;r.finally(()=>{P.cutFar=0})}
 return r};
buildBtns();
})();
