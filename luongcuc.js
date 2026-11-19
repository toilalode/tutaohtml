'use strict';
(function(){
const ST=3,LINES=['Thái Cực Kiếm Pháp','Lưỡng Cực Vô Lượng','Hào Nạp Tam Thiên Đại Đạo','Nhất Kiếm Quy Nhất'],DRAW=1e12,SLASH=2e12,BOOM=5e12,RISE=70,HB=[240,420],INK=0x16161c,PAPER=0xffffff,SPARKS=window.LOW?500:1600;
SK[ST].h={n:'Lưỡng Cực Vô Lượng',cd:900,sta:70,sp:'luongcuc',tot:DRAW+SLASH+BOOM};
NOTE[ST].h='Thái Cực khổng lồ cùng các vòng hiện sau lưng, niệm chú, chém rồi phi kiếm lên trời. Nhất Kiếm Quy Nhất tạo vết chém trên trời và vụ nổ cực lớn, tổng 8000 tỷ sát thương gốc, hồi chiêu 15 giây.';
const BOOST=new Map([[SK[ST].j,1e13/SK[ST].j.tot],[SK[ST].g,4e12/SK[ST].g.tot]]);
SK[ST].j.tot=1e13;SK[ST].g.tot=4e12;
GUIDE['Điều khiển']=GUIDE['Điều khiển'].replace('(H / chuột phải / nút M2)','(chuột phải / nút M2)');
GUIDE['Mẹo']+='<br>• <b>Lưỡng Cực Vô Lượng</b> (Thái Cực Kiếm Pháp, phím H): Thái Cực và các vòng hiện sau lưng, phi kiếm lên trời rồi Nhất Kiếm Quy Nhất chém xuống tạo vụ nổ. Menu Quy Luật M2 chỉ mở bằng chuột phải hoặc nút M2.';
let away=false,mul=1;
const baseLook=swordLook;
swordLook=function(){baseLook();if(away){PA.sb.visible=PA.sg.visible=false;SWH.visible=false}};
const flatDisc=(x,z,t,size,life,spin)=>{const m=plane(t,1,.9);m.rotation.x=-Math.PI/2;m.position.set(x,.3,z);add(m,life,(f,k)=>{m.scale.setScalar(6+k*size);m.rotation.z+=spin;m.material.opacity=.9*(1-k)});return m};
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
async function luongcuc(){
 const pp=player.position,cam0=camDist,emb=new THREE.Group(),spins=[];
 const face=(t,s,o,z,v)=>{const m=plane(t,s,o);m.position.z=z;emb.add(m);spins.push([m,v])};
 face(texTaiji,96,.4,-3,.01);face(texBagua,50,.8,-1.5,-.02);face(texTaiji,32,.95,0,.05);
 [[17,PAPER],[22,INK],[28,PAPER]].forEach(([r,c])=>{const m=new THREE.Mesh(G('R40',()=>new THREE.RingGeometry(.9,1,40)),mat(c,.9));m.scale.setScalar(r);m.position.z=-.8;emb.add(m)});
 const swd=buildSword(),spk=buildSparks();
 let es=.05,goal=Math.max(cam0,52),ck=.05;
 const tick=()=>{
  emb.position.set(pp.x-Math.sin(yaw)*7,pp.y+9,pp.z-Math.cos(yaw)*7);emb.lookAt(cam.position);emb.scale.setScalar(es);
  spins.forEach(([m,v])=>{m.rotation.z+=v});
  camDist+=(goal-camDist)*ck};
 const go=async(n,fn)=>{for(let f=0;f<n;f++){fn(f,n,f/Math.max(1,n-1));tick();await wait(1)}};
 const paint=f=>swd.mats.forEach((m,i)=>m.color.setHex((((f>>3)+i)&1)?0x0c0c10:PAPER));
 const mark=(c,w,len,x,z)=>{const m=new THREE.Mesh(G('LLP',()=>new THREE.PlaneGeometry(1,1)),mat(c,.95));m.position.set(x,46,z);m.lookAt(cam.position);m.rotateZ(.62);add(m,46,(f,t)=>{m.scale.set(len*Math.min(1,t*6+.05),w*(1-t*.6),1);m.material.opacity=.95*(1-t*t)})};
 P.busy++;P.lk++;
 try{
  scene.add(emb);flash(PURP);shake=Math.max(shake,8);
  await go(30,(f,n,k)=>{es=.05+.95*Math.sin(k*Math.PI/2)});
  say(LINES[0],1000);FXK('ring',{r:12,life:30,col:PURP});await go(36,()=>{});
  say(LINES[1],1100);FXK('ring',{r:22,life:36,col:GOLD});FXK('aura',{life:50,col:PAPER});flash(PAPER);shake=Math.max(shake,12);await go(40,()=>{});
  const[ax,az]=target();
  FXK('slash',{x:ax,z:az,r:16,col:PAPER});FXK('slash',{x:ax,z:az,r:12,col:INK});hit(ax,az,HB[0],DRAW*3,2);shake=Math.max(shake,16);
  await go(26,()=>{});
  say(LINES[2],1300);flash(PURP);
  scene.add(swd.g,spk.pts);away=true;
  const rx=pp.x,rz=pp.z;
  await go(RISE,(f,n,k)=>{
   const e=k*k*(3-2*k),a=k*12,rad=3+e*10,y=2+e*58,g=swd.g;
   g.position.set(rx+Math.cos(a)*rad,y,rz+Math.sin(a)*rad);
   g.lookAt(rx+Math.cos(a+.3)*rad,y+4,rz+Math.sin(a+.3)*rad);
   g.scale.setScalar(1.8+e*2);paint(f);
   for(let j=0;j<SPARKS/6;j++){const i=(Math.random()*SPARKS)|0;spk.pos[i*3]=g.position.x+(Math.random()-.5)*8;spk.pos[i*3+1]=y+(Math.random()-.5)*8;spk.pos[i*3+2]=g.position.z+(Math.random()-.5)*8}
   spk.geo.attributes.position.needsUpdate=true;
   if(f%10==0){shake=Math.max(shake,6);FXK('ring',{r:6+e*10,life:20,col:f&1?PAPER:INK})}});
  const[tx,tz]=target(),sx=swd.g.position.x,sz=swd.g.position.z;
  say(LINES[3],1500);flash(0xffffff);
  await go(40,(f,n,k)=>{
   const g=swd.g,e=k*k*(3-2*k);
   g.position.set(sx+(tx-sx)*e*.6,60-e*8,sz+(tz-sz)*e*.6);g.lookAt(tx,0,tz);g.scale.setScalar(3.8+e*6);paint(f*2);
   for(let i=0;i<SPARKS;i++){const j=i*3;spk.pos[j]+=(g.position.x-spk.pos[j])*.12;spk.pos[j+1]+=(g.position.y-spk.pos[j+1])*.12;spk.pos[j+2]+=(g.position.z-spk.pos[j+2])*.12}
   spk.geo.attributes.position.needsUpdate=true;
   if(f%8==0)shake=Math.max(shake,8)});
  mark(INK,7,260,tx,tz);mark(PAPER,3.4,250,tx,tz);
  FXK('sky',{col:PAPER});FXK('sky',{col:INK});
  flash(PAPER);shake=Math.max(shake,40);
  hit(tx,tz,HB[0],SLASH*3,3);
  await go(14,()=>{});
  FXK('boom',{x:tx,z:tz,r:140,col:PAPER});FXK('boom',{x:tx,z:tz,r:105,col:INK});FXK('boom',{x:tx,z:tz,r:80,col:PURP});
  flatDisc(tx,tz,texTaiji,420,60,.1);flatDisc(tx,tz,texBagua,520,64,-.08);
  FXK('ring',{r:240,life:44,col:PAPER});FXK('ring',{r:160,life:44,col:INK});
  flash(GOLD);shake=Math.max(shake,56);
  hit(tx,tz,HB[1],BOOM*3,6);
  goal=cam0;ck=.12;
  await go(50,(f,n,k)=>{
   es=Math.max(.001,1-k);swd.g.scale.setScalar(Math.max(.1,9.8*(1-k)));
   if(f%6==0)shake=Math.max(shake,30)})
 }finally{
  away=false;camDist=cam0;
  scene.remove(emb);scene.remove(swd.g);scene.remove(spk.pts);
  freeObj(emb);freeObj(swd.g);spk.geo.dispose();spk.pts.material.dispose();
  P.busy--;P.lk--}}
const baseHit=hit;
hit=function(x,z,r,d,kb){return baseHit(x,z,r,d*mul,kb)};
const baseRun=run;
run=function(sp,k0){
 if(sp.sp==='luongcuc')return luongcuc();
 const f=BOOST.get(sp);
 if(!f)return baseRun(sp,k0);
 mul=f;
 const r=baseRun(sp,k0),done=()=>{mul=1};
 r.then(done,done);
 return r};
const baseLaw=lawMenu;
lawMenu=function(){const e=window.event;if(e&&e.type==='keydown'&&e.code==='KeyH')return;return baseLaw()};
addEventListener('keydown',e=>{
 if(e.code!=='KeyH'||e.repeat)return;
 const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
 cast('h')});
const baseBuild=buildBtns;
buildBtns=function(){
 baseBuild();
 if(bt.H){bt.M2=bt.H;delete bt.H}
 const sp=SK[P.sty].h;
 if(sp){
  const b=document.createElement('button');b.innerHTML='<b>H</b><i>'+sp.n.slice(0,11)+'</i>';
  b.addEventListener('pointerdown',e=>{e.preventDefault();cast('h')});
  $('btns').appendChild(b);bt.H=b}
 placeCols()};
setInterval(()=>{if(bt.M2)bt.M2.classList.toggle('on',P.ap>0)},120);
buildBtns();
})();
