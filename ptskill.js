'use strict';
(function(){
const RED=0xff2a2a,GLD=0xffd646,WHT=0xfff4d0,ORG=0xff8a1a,hyp=Math.hypot,rnd=Math.random;
const NPHP=1e14;
const goldSkin=()=>{try{const d=JSON.parse(localStorage.getItem('tm_pt_v1')||'{}');return !!(d.up&&d.skin)}catch(e){return false}};
const drop=g=>{scene.remove(g);freeObj(g)};
const mkSword=(col,sc)=>{const g=new THREE.Group(),b=new THREE.Mesh(G('PTSB',()=>new THREE.BoxGeometry(.5,.15,7)),mat(col,.95)),gd=new THREE.Mesh(G('PTSG',()=>new THREE.BoxGeometry(2,.22,.3)),mat(GLD,.95));b.position.z=3.6;gd.position.z=.2;g.add(b,gd);g.scale.setScalar(sc);scene.add(g);return g};
/* Nhát chém cong (vầng trăng khuyết dựng đứng) như hiệu ứng slash; luôn cùng một hướng, bay thẳng từ người chơi về phía quái */
const crescent=(R,A,w)=>{
 const sh=new THREE.Shape(),N=24;
 for(let i=0;i<=N;i++){const t=-A/2+A*i/N,x=Math.cos(t)*R,y=Math.sin(t)*R;i?sh.lineTo(x,y):sh.moveTo(x,y)}
 for(let i=N;i>=0;i--){const t=-A/2+A*i/N,r=R-w*Math.sin(Math.PI*i/N);sh.lineTo(Math.cos(t)*r,Math.sin(t)*r)}
 return new THREE.ShapeGeometry(sh)};
const vslash=(sx,sz,fx,fz,l)=>{
 const R=8.5,A=2.4,th=Math.atan2(fx,fz)-Math.PI/2,reach=Math.max(6,l-4),
  m=new THREE.Mesh(G('PTCR1',()=>crescent(R,A,3.2)),mat(RED,.95)),
  c=new THREE.Mesh(G('PTCR2',()=>crescent(R,A,1.4)),mat(WHT,.95)),
  place=t=>{const d=1+(reach-1)*t;m.position.set(sx+fx*d,2,sz+fz*d);m.rotation.set(0,th,1.1-t);m.scale.setScalar(1+t*.3)};
 c.renderOrder=1;m.add(c);place(0);
 add(m,12,(f,t)=>{place(t);const o=.95*(1-t);m.material.opacity=o;c.material.opacity=o})};
function boom(x,z,r,col,d,kb){FXK('boom',{x,z,r,col});FXK('ring',{r:r*1.4,life:40,col:WHT});flash(col);shake=Math.max(shake,Math.min(60,r/2));if(d)hit(x,z,r,d*3,kb||3)}
const nearFoe=(x,z)=>{let b=null,bd=1e9;enemies.forEach(e=>{if(e.hp>0){const d=hyp(e.m.position.x-x,e.m.position.z-z);if(d<bd){bd=d;b=e}}});return b?{e:b,d:bd}:null};
function stunAt(x,z,r,sec){enemies.forEach(e=>{if(hyp(e.m.position.x-x,e.m.position.z-z)<r){if(e.dummy)e.stun=Math.max(e.stun||0,sec);else e.cd=Math.max(e.cd,sec)}})}
const lock=()=>{const p=player.position,F=nearFoe(p.x,p.z);return F&&F.d<60?F.e:null};
const posOf=(fe,fx,fz)=>()=>fe&&fe.hp>0?[fe.m.position.x,fe.m.position.z]:[fx,fz];
async function fling(col,sc,x0,y0,z0,x1,y1,z1,n){const s=mkSword(col,sc);try{for(let f=0;f<=n;f++){const k=f/n,e=k*k;s.position.set(x0+(x1-x0)*e,y0+(y1-y0)*e,z0+(z1-z0)*e);s.lookAt(x1,y1,z1);await wait(1)}}finally{drop(s)}}

let spinOn=false,spinA=0,hid=false,flipOn=false,flipA=0,flipY=0,pose=null,drawing=false,kneel=null;
{const rd=ren.render.bind(ren);ren.render=function(s,c){
 try{if(spinOn)player.rotation.y=spinA;if(flipOn){player.rotation.order='YXZ';player.rotation.set(flipA,flipY,0);pb.position.set(0,1.1*(Math.cos(flipA)-1),-1.1*Math.sin(flipA))}if(hid){PA.sb.visible=false;PA.sg.visible=false;PA.aR.rotation.x=PA.aL.rotation.x=-1.5}if(pose)pose()}catch(e){}
 try{for(const x of enemies)if(!x.bigNP&&x.hp>0&&x.m&&x.m.userData&&x.m.userData.wings){x.bigNP=1;x.max=x.hp=x.lh=NPHP}}catch(e){}
 return rd(s,c)}}
function kneelOn(){
 if(kneel)return;
 const m=new THREE.MeshLambertMaterial({color:0x2e8b3a}),a=new THREE.Mesh(new THREE.BoxGeometry(.36,.36,.72),m),b=new THREE.Mesh(new THREE.BoxGeometry(.36,.54,.36),m);
 a.position.set(-.18,.72,.18);b.position.set(-.18,.63,.36);pb.add(a,b);PA.lL.visible=false;kneel=[a,b,m]}
function kneelOff(){
 if(!kneel)return;
 const[a,b,m]=kneel;pb.remove(a);pb.remove(b);a.geometry.dispose();b.geometry.dispose();m.dispose();PA.lL.visible=true;pb.position.set(0,0,0);pb.rotation.x=0;kneel=null}
const kpose=()=>{pb.position.set(0,-.36,0);pb.rotation.x=drawing?.25:.12;PA.lR.rotation.set(1.047,0,0);PA.lL.rotation.set(0,0,0);PA.aL.rotation.set(-.2,0,0);PA.aR.rotation.set(drawing?-1.6:-.15,0,0)};
const pose2=()=>{const t=performance.now()/1000*12;PA.aL.rotation.set(1.9,0,.25);PA.aR.rotation.set(-2.2+Math.sin(t)*.45,0,Math.cos(t)*.6)};
const pose3=()=>{const t=performance.now()/1000*12;PA.aL.rotation.set(-1.57,0,0);PA.aR.rotation.set(1.9+Math.sin(t)*.45,0,Math.cos(t)*.6)};
const reset=()=>{spinOn=false;pose=null;drawing=false;kneelOff();if(flipOn){flipOn=false;try{player.rotation.order='XYZ';player.rotation.x=0;pb.position.set(0,0,0)}catch(e){}}if(hid){hid=false;try{PA.sb.visible=true;PA.sg.visible=true}catch(e){}}};

function ringV(r){
 const g=new THREE.Group(),arcs=[];
 [[r,4.6,RED,.16],[r*.72,3.6,GLD,.13],[r*1.25,2.8,WHT,.1]].forEach(([rr,arc,c,w],i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(rr,w,6,36,arc),mat(c,.85));m.rotation.z=i*2.1;g.add(m);arcs.push(m)});
 scene.add(g);return{g,arcs}}
function ringFire(r){
 const pal=goldSkin()?[0xffb81a,0xffe14a,0xfff6b0]:[0xd01414,0xff3a22,0xff8c50],g=new THREE.Group(),arcs=[];
 [[r,4.6,.1],[r*.72,3.6,.08],[r*1.25,2.8,.06]].forEach(([rr,arc,w],i)=>{
  const q=new THREE.Group();
  [[w*3.4,.35],[w*2,.6],[w,.95]].forEach(([tube,o],j)=>q.add(new THREE.Mesh(G('PTFR'+i+j+r,()=>new THREE.TorusGeometry(rr,tube,6,36,arc)),mat(pal[j],o))));
  q.rotation.z=i*2.1;g.add(q);arcs.push(q)});
 scene.add(g);return{g,arcs}}
function ringH(r,c1,c2){
 const g=new THREE.Group(),ws=[];
 [[r,4.2,c1,.2],[r*.8,3.2,c2,.16]].forEach(([rr,arc,c,w],i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(rr,w,6,36,arc),mat(c,.85));m.rotation.x=Math.PI/2;const q=new THREE.Group();q.add(m);q.rotation.y=i*3.1;g.add(q);ws.push(q)});
 scene.add(g);return{g,ws}}
function orbit(sw,cx,cy,cz,fx,fz,r,th){
 const rx=fz,rz=-fx,c=Math.cos(th),s=Math.sin(th),px=cx+rx*r*c,py=cy+r*s,pz=cz+rz*r*c;
 sw.position.set(px,py,pz);sw.lookAt(px-rx*s,py+c,pz-rz*s)}

function mandala(){
 const g=new THREE.Group(),rs=[];
 for(let i=0;i<10;i++){const m=new THREE.Mesh(G('PTR2',()=>new THREE.RingGeometry(.9,1,48)),mat(i&1?0xff9a20:GLD,.85));m.scale.setScalar(5+i*2.4);m.position.z=-i*.12;g.add(m);rs.push([m,i&1?-.02:.015])}
 scene.add(g);return{g,rs}}
function phxBig(){
 const g=new THREE.Group(),cr=mat(0xfff0c8,.95),or=mat(0xff9a30,.95),ye=mat(0xffd646,.95),hl=mat(0xd8ff30,.8);
 const body=new THREE.Mesh(G('PBB',()=>new THREE.SphereGeometry(1,14,10)),cr);body.scale.set(1.1,1.4,1);g.add(body);
 const head=new THREE.Mesh(G('PBB',()=>new THREE.SphereGeometry(1,14,10)),cr);head.scale.setScalar(.7);head.position.set(0,1.8,.3);g.add(head);
 const beak=new THREE.Mesh(G('PBK',()=>new THREE.ConeGeometry(.22,.7,6)),or);beak.rotation.x=Math.PI/2;beak.position.set(0,1.7,.95);g.add(beak);
 for(let i=-2;i<=2;i++){const c=new THREE.Mesh(G('PBC',()=>new THREE.ConeGeometry(.12,1.3,5)),i&1?or:ye);c.position.set(i*.25,2.7,.1);c.rotation.z=-i*.3;g.add(c)}
 const fg=G('PBF',()=>{const q=new THREE.PlaneGeometry(1,4.6);q.translate(0,2.3,0);return q}),wings=[];
 [-1,1].forEach(s=>{const w=new THREE.Group();w.position.set(s*.9,.8,0);
  for(let i=0;i<8;i++){const f=new THREE.Mesh(fg,i&1?or:cr);f.rotation.z=s*(-Math.PI/2+(i-2)*.28);f.scale.y=.7+(i%3)*.15;f.position.z=i*.01;w.add(f)}
  g.add(w);wings.push([w,s])});
 for(let i=0;i<5;i++){const t=new THREE.Mesh(G('PBT',()=>new THREE.ConeGeometry(.22,3.6,5)),i&1?or:ye);t.rotation.x=-Math.PI/2;t.rotation.z=(i-2)*.25;t.position.set((i-2)*.5,-.8,-2.4);g.add(t)}
 [5.2,6.4,7.6].forEach((r,i)=>{const m=new THREE.Mesh(G('PBH',()=>new THREE.RingGeometry(.92,1,48)),hl);m.scale.setScalar(r);m.position.set(0,1.8,-.9-i*.1);g.add(m)});
 g.userData={wings};return g}

async function s2(){
 const fe=lock(),[tx,tz]=target(),p=player.position,live=posOf(fe,tx,tz);
 say('Phượng Tước Kiếm Pháp — Đệ Nhị Thức',1000);await wait(16);say('Di Tinh Đầu — Chuyển Tuế Hoa!',1500);
 const R=ringV(3.2),sw=mkSword(RED,.45);hid=true;pose=pose2;
 try{
  for(let f=0;f<48;f++){
   const[ex,ez]=live(),dx=ex-p.x,dz=ez-p.z,l=hyp(dx,dz)||1,fx=dx/l,fz=dz/l,cx=p.x+fx*3.4,cy=p.y+1.9,cz=p.z+fz*3.4;
   R.g.position.set(cx,cy,cz);R.g.rotation.y=Math.atan2(fx,fz);
   R.arcs.forEach((m,i)=>{m.rotation.z+=(i&1?-1:1)*.42});
   orbit(sw,cx,cy,cz,fx,fz,3.2,f*.55);
   if(f%3==0){hit(ex,ez,10,4e12*3,.4);shake=Math.max(shake,4)}
   await wait(1)}
 }finally{reset();drop(R.g);drop(sw)}
 const[ex,ez]=live();await fling(RED,4,p.x,26,p.z,ex,0,ez,20);
 const[bx,bz]=live();boom(bx,bz,60,GLD,1.5e14)}

async function s3(){
 const fe=lock(),[tx,tz]=target(),p=player.position,live=posOf(fe,tx,tz);
 say('Phượng Tước Kiếm Pháp — Đệ Tam Thức',1000);
 const R=ringV(3.4),sw0=mkSword(RED,.45);let sw=null;hid=true;pose=pose3;
 try{
  for(let f=0;f<48;f++){
   const[ex,ez]=live(),dx=ex-p.x,dz=ez-p.z,l=hyp(dx,dz)||1,fx=dx/l,fz=dz/l,cx=p.x-fx*3.4,cy=p.y+1.7,cz=p.z-fz*3.4;
   R.g.position.set(cx,cy,cz);R.g.rotation.y=Math.atan2(fx,fz);
   R.arcs.forEach((m,i)=>{m.rotation.z+=(i&1?-1:1)*.42});
   orbit(sw0,cx,cy,cz,fx,fz,3.4,f*.6);
   if(f%4==0){hit(ex,ez,12,4e12*3,.2);shake=Math.max(shake,3)}
   await wait(1)}
  pose=null;
  drop(R.g);drop(sw0);
  say('Mẫn Vạn Tượng — Khai Thiên Kỷ!',1600);
  {const[ex,ez]=live();stunAt(ex,ez,30,3);
   const a=Math.atan2(ex-p.x,ez-p.z),bx=ex+Math.sin(a)*14,bz=ez+Math.cos(a)*14;
   await fling(RED,3.5,p.x,p.y+1.3,p.z,bx,p.y+1.3,bz,14);
   const[hx,hz]=live();hit(hx,hz,12,1.92e14*3,.2);shake=Math.max(shake,12)}
  sw=mkSword(RED,.38);
  const place=d=>{const[ex,ez]=live(),dx=ex-p.x,dz=ez-p.z,l=hyp(dx,dz)||1,ux=dx/l,uz=dz/l;p.x=ex-ux*d;p.z=ez-uz*d;sw.position.set(p.x+ux*.6,p.y+1.3,p.z+uz*.6);sw.lookAt(ex,p.y+1.3,ez)};
  for(let f=0;f<10;f++){const[ex,ez]=live(),l=hyp(ex-p.x,ez-p.z);place(l>4.2?l-(l-4.2)/(10-f):l);await wait(1)}
  const reach=[4.2,3,1.5,1.5];
  for(let i=0;i<10;i++){for(let f=0;f<4;f++){place(reach[f]);if(f==2){const[ex,ez]=live();FXK('slash',{x:ex+rnd()*2-1,z:ez+rnd()*2-1,r:6,col:i&1?RED:WHT});hit(ex,ez,12,8e12*3,.2);shake=Math.max(shake,5)}await wait(1)}}
 } finally{reset();drop(R.g);drop(sw0);if(sw)drop(sw)}}

async function s5(){
 const fe=lock(),[tx,tz]=target(),p=player.position,live=posOf(fe,tx,tz);
 say('Đệ Ngũ Thức: Dung Vạn Hắc — Truyền Tân Hỏa!',1800);
 const A=ringFire(3.6),sw=mkSword(RED,.5);hid=true;
 const wheel=(R,cx,cy,cz,fx,fz,dir)=>{R.g.position.set(cx,cy,cz);R.g.rotation.y=Math.atan2(fx,fz)+Math.PI/2;const t=performance.now()/80;R.arcs.forEach((m,i)=>{m.rotation.z+=dir*(i&1?-1:1)*.5;m.scale.setScalar(1+Math.sin(t+i*2.1)*.05)})};
 try{
  let n=0,nx=performance.now()+400;
  for(let f=0;n<15;f++){
   const[ex,ez]=live(),dx=ex-p.x,dz=ez-p.z,l=hyp(dx,dz)||1,fx=dx/l,fz=dz/l;
   wheel(A,p.x,p.y+1.7,p.z,fx,fz,-1);
   orbit(sw,p.x,p.y+1.7,p.z,-fz,fx,3.6,-f*.5);
   flipY=Math.atan2(fx,fz);flipA=f*.5;flipOn=true;
   if(f%6==0)hit(ex,ez,10,1e12*3,.2);
   const t=performance.now();
   if(t>=nx){
    nx=t+400;n++;
    if(n==1)flash(RED);
    vslash(p.x,p.z,fx,fz,l);
    hit(ex,ez,16,9e13*3,.6);shake=Math.max(shake,10)}
   await wait(1)}
 }finally{reset();drop(A.g);drop(sw)}}

async function s6(){
 const[tx,tz]=target(),p=player.position;say('Phượng Tước Kiếm Pháp Chung Chương',1200);
 const md=mandala(),dx=Math.sin(yaw),dz=Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
 const sw=mkSword(GLD,2.4);let k0=0;const gs=[];
 const upd=()=>{md.g.position.set(p.x-dx*8,p.y+9,p.z-dz*8);md.g.lookAt(cam.position);md.g.scale.setScalar(Math.max(.01,k0));md.rs.forEach(([m,v])=>{m.rotation.z+=v})};
 try{
  for(let f=0;f<30;f++){k0=Math.sin((f+1)/30*Math.PI/2);upd();await wait(1)}
  say('Phụng Tước Bát Điểu, Chung Chương!',2000);FXK('ring',{r:20,life:40,col:GLD});
  for(let f=0;f<44;f++){const cx=p.x+dx*1.6,cy=p.y+2.3,cz=p.z+dz*1.6;sw.position.set(cx-rx*3,cy,cz-rz*3);sw.lookAt(cx+rx*10,cy,cz+rz*10);if(f%11==0)FXK('ring',{r:8+f/3,life:24,col:f&1?ORG:GLD});upd();await wait(1)}
  for(let f=0;f<18;f++){const k=(f+1)/18;sw.position.set(p.x+dx*1.6,p.y+2.3+k*2,p.z+dz*1.6);sw.lookAt(tx,0,tz);upd();await wait(1)}
  say('Nguyên Phượng Thiên Giáng — Vạn Quái Câu Tổn!',2000);
  const FC=[0xffd646,0xff7a1a,0xe8e8ff,0xff2a2a,0x303040,0x8a2be2,0x2ecc71,0x3aa0ff];
  const pg=phxBig(),ps={sx:tx-dx*25,sz:tz-dz*25};pg.scale.setScalar(4.2);scene.add(pg);gs.push(pg);
  const ring=[];
  for(let i=0;i<8;i++){const g=roblox({angry:1,skin:0xe8c8a0,shirt:FC[i],pants:0x201018,sword:2});g.scale.setScalar(3);scene.add(g);gs.push(g);const a=i/8*6.283;ring.push({sx:tx+Math.cos(a)*45,sz:tz+Math.sin(a)*45,ex:tx+Math.cos(a)*18,ez:tz+Math.sin(a)*18})}
  for(let f=0;f<30;f++){
   const k=f/29,e=k*k;
   pg.position.set(ps.sx+(tx-ps.sx)*e,70*(1-e)+2,ps.sz+(tz-ps.sz)*e);pg.lookAt(tx,0,tz);pg.userData.wings.forEach(([w,sd])=>{w.rotation.y=sd*Math.sin(f*.6)*.3});
   ring.forEach((r,i)=>{const g=gs[i+1],x=r.sx+(r.ex-r.sx)*e,z=r.sz+(r.ez-r.sz)*e;g.position.set(x,70*(1-e),z);g.rotation.y=Math.atan2(tx-x,tz-z)});
   upd();await wait(1)}
  gs.forEach(drop);gs.length=0;
  boom(tx,tz,90,GLD,8e14);FXK('boom',{x:tx,z:tz,r:60,col:RED});await wait(10)}
 finally{drop(sw);drop(md.g);gs.forEach(drop)}}

async function s8(){
 const[tx,tz]=target(),p=player.position;let fl=0,sw=null;
 const near=k=>{p.x+=(tx-p.x)*k;p.z+=(tz-p.z)*k};
 say('Nhất Vương Tài Quyết Lục — Tung Hoành Thiên Hạ',2000);
 kneelOn();pose=kpose;drawing=false;
 try{
  await wait(30);
  drawing=true;await wait(6);
  pose=null;drawing=false;kneelOff();
  P.flyN++;fl=1;P.flyH=10;
  for(let f=0;f<14;f++){near(.12);await wait(1)}
  P.flyH=-8;
  for(let f=0;f<40&&p.y>.3;f++){near(.3);await wait(1)}
  FXK('slash',{x:tx,z:tz,r:30,col:WHT});
  boom(tx,tz,60,WHT,3e14);FXK('boom',{x:tx,z:tz,r:40,col:0x111111});await wait(14);
  say('Chúng Sinh Bình Giới Điệu!',1600);
  P.flyH=42;
  for(let f=0;f<20;f++){near(.25);await wait(1)}
  sw=mkSword(WHT,.7);hid=true;
  pose=()=>{PA.aR.rotation.set(-1.2,0,-.45);PA.aL.rotation.set(-1.2,0,.45)};
  P.flyH=-8;
  for(let f=0;f<90&&p.y>.3;f++){
   const fx=Math.sin(yaw)*.7,fz=Math.cos(yaw)*.7;
   sw.position.set(p.x+fx,p.y+1.5,p.z+fz);sw.lookAt(p.x+fx,p.y-20,p.z+fz);
   await wait(1)}
  P.flyH=0;
  sw.position.set(tx,1,tz);
  boom(tx,tz,130,WHT,5e14);FXK('boom',{x:tx,z:tz,r:80,col:0x111111});await wait(12)}
 finally{reset();if(sw)drop(sw);if(fl){P.flyH=0;P.flyN--;P.fly=Math.max(P.fly,25)}}}

async function exec(f,fly){P.busy++;P.lk++;if(fly){P.flyN++;P.flyH=fly}try{await f()}catch(e){console.error(e)}finally{reset();P.busy--;P.lk--;if(fly){P.flyN--;P.fly=Math.max(P.fly,25)}}}
const baseRun=run;
run=function(sp,k0){const k=sp&&sp.sp;if(k=='pt2')return exec(s2,24);if(k=='pt3')return exec(s3,0);if(k=='pt5')return exec(s5,0);if(k=='pt6')return exec(s6,22);if(k=='pt8')return exec(s8,0);return baseRun(sp,k0)};

const M1P=5e7,M1BASE=1.25e5;
let m1p=false;
const baseAtk=atk;
atk=function(){m1p=P.sw==4;try{baseAtk()}finally{m1p=false}};
const baseMul=dmgMul;
dmgMul=function(){const m=baseMul();return m1p?m*M1P/M1BASE:m};

/* Áp Chế chỉ diệt được quái vô hạn máu khi là Áp Chế Nhất Vương (Phượng Tước/Nhất Vương + Kiếm Hồn Nhất Vương). Các Áp Chế khác vẫn gây sát thương nhưng không giết được. */
{const baseKillInf=killInf;killInf=function(e){if(P.sw==4&&P.sty>=6&&P.kh>0)baseKillInf(e)}}

try{GUIDE['Phượng Tước']=GUIDE['Phượng Tước'].replace('100 tỷ máu','100.000 tỷ máu')}catch(e){}
})();
