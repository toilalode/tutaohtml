'use strict';
// Vá Phượng Tước Kiếm Pháp: Đệ Nhị (xoay kiếm trước mắt + nổ), Đệ Tam (xoay chém sau lưng, KHÔNG quay người, phi kiếm, không nổ), Đệ Ngũ (bánh xe dọc, mỗi 2s xoay chém mạnh 1 lần, không nổ). Nạp sau ptfix.js.
(function(){
const RED=0xff2a2a,GLD=0xffd646,WHT=0xfff4d0,hyp=Math.hypot,rnd=Math.random;
const drop=g=>{scene.remove(g);freeObj(g)};
const mkSword=(col,sc)=>{const g=new THREE.Group(),b=new THREE.Mesh(G('PTSB',()=>new THREE.BoxGeometry(.5,.15,7)),mat(col,.95)),gd=new THREE.Mesh(G('PTSG',()=>new THREE.BoxGeometry(2,.22,.3)),mat(GLD,.95));b.position.z=3.6;gd.position.z=.2;g.add(b,gd);g.scale.setScalar(sc);scene.add(g);return g};
function boom(x,z,r,col,d,kb){FXK('boom',{x,z,r,col});FXK('ring',{r:r*1.4,life:40,col:WHT});flash(col);shake=Math.max(shake,Math.min(60,r/2));if(d)hit(x,z,r,d*3,kb||3)}
const nearFoe=(x,z)=>{let b=null,bd=1e9;enemies.forEach(e=>{if(e.hp>0){const d=hyp(e.m.position.x-x,e.m.position.z-z);if(d<bd){bd=d;b=e}}});return b?{e:b,d:bd}:null};
function stunAt(x,z,r,sec){enemies.forEach(e=>{if(hyp(e.m.position.x-x,e.m.position.z-z)<r){if(e.dummy)e.stun=Math.max(e.stun||0,sec);else e.cd=Math.max(e.cd,sec)}})}
const lock=()=>{const p=player.position,F=nearFoe(p.x,p.z);return F&&F.d<60?F.e:null};
const posOf=(fe,fx,fz)=>()=>fe&&fe.hp>0?[fe.m.position.x,fe.m.position.z]:[fx,fz];
async function fling(col,sc,x0,y0,z0,x1,y1,z1,n){const s=mkSword(col,sc);try{for(let f=0;f<=n;f++){const k=f/n,e=k*k;s.position.set(x0+(x1-x0)*e,y0+(y1-y0)*e,z0+(z1-z0)*e);s.lookAt(x1,y1,z1);await wait(1)}}finally{drop(s)}}

// Xoay người + ẩn kiếm thật (khi kiếm bay/xoay) — áp ngay trước khi vẽ
let spinOn=false,spinA=0,hid=false;
{const rd=ren.render.bind(ren);ren.render=function(s,c){
 try{if(spinOn)player.rotation.y=spinA;if(hid){PA.sb.visible=false;PA.sg.visible=false;PA.aR.rotation.x=PA.aL.rotation.x=-1.5}}catch(e){}
 return rd(s,c)}}
const reset=()=>{spinOn=false;if(hid){hid=false;try{PA.sb.visible=true;PA.sg.visible=true}catch(e){}}};

// Vòng tròn đứng (nhìn từ phía lưng nhân vật thấy là một vòng tròn), 3 cung quay ngược chiều nhau
function ringV(r){
 const g=new THREE.Group(),arcs=[];
 [[r,4.6,RED,.16],[r*.72,3.6,GLD,.13],[r*1.25,2.8,WHT,.1]].forEach(([rr,arc,c,w],i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(rr,w,6,36,arc),mat(c,.85));m.rotation.z=i*2.1;g.add(m);arcs.push(m)});
 scene.add(g);return{g,arcs}}
// Vòng tròn nằm ngang (xoay chém quanh người/quái)
function ringH(r,c1,c2){
 const g=new THREE.Group(),ws=[];
 [[r,4.2,c1,.2],[r*.8,3.2,c2,.16]].forEach(([rr,arc,c,w],i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(rr,w,6,36,arc),mat(c,.85));m.rotation.x=Math.PI/2;const q=new THREE.Group();q.add(m);q.rotation.y=i*3.1;g.add(q);ws.push(q)});
 scene.add(g);return{g,ws}}
// Kiếm bay vòng theo vòng tròn đứng, mũi kiếm theo tiếp tuyến
function orbit(sw,cx,cy,cz,fx,fz,r,th){
 const rx=fz,rz=-fx,c=Math.cos(th),s=Math.sin(th),px=cx+rx*r*c,py=cy+r*s,pz=cz+rz*r*c;
 sw.position.set(px,py,pz);sw.lookAt(px-rx*s,py+c,pz-rz*s)}

// Đệ Nhị: xoay kiếm thành vòng tròn trước mắt, rồi kiếm giáng từ trời và NỔ
async function s2(){
 const fe=lock(),[tx,tz]=target(),p=player.position,live=posOf(fe,tx,tz);
 say('Phượng Tước Kiếm Pháp — Đệ Nhị Thức',1000);await wait(16);say('Di Tinh Đầu — Chuyển Tuế Hoa!',1500);
 const R=ringV(3.2),sw=mkSword(RED,.45);hid=true;
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

// Đệ Tam: xoay chém vòng tròn sau lưng, phi kiếm xuyên quái, đâm liên hoàn — KHÔNG nổ
async function s3(){
 const fe=lock(),[tx,tz]=target(),p=player.position,live=posOf(fe,tx,tz);
 say('Phượng Tước Kiếm Pháp — Đệ Tam Thức',1000);
 const R=ringV(3.4),sw0=mkSword(RED,.45);let sw=null;hid=true;
 try{
  for(let f=0;f<48;f++){
   const[ex,ez]=live(),dx=ex-p.x,dz=ez-p.z,l=hyp(dx,dz)||1,fx=dx/l,fz=dz/l,cx=p.x-fx*3.4,cy=p.y+1.7,cz=p.z-fz*3.4;
   R.g.position.set(cx,cy,cz);R.g.rotation.y=Math.atan2(fx,fz);
   R.arcs.forEach((m,i)=>{m.rotation.z+=(i&1?-1:1)*.42});
   orbit(sw0,cx,cy,cz,fx,fz,3.4,f*.6);
   if(f%4==0){hit(ex,ez,12,4e12*3,.2);shake=Math.max(shake,3)}
   await wait(1)}
  drop(R.g);drop(sw0);
  say('Mẫn Vạn Tượng — Khai Thiên Kỷ!',1600);
  {const[ex,ez]=live();stunAt(ex,ez,30,3);
   const a=Math.atan2(ex-p.x,ez-p.z),bx=ex+Math.sin(a)*14,bz=ez+Math.cos(a)*14;
   await fling(RED,3.5,p.x,p.y+1.3,p.z,bx,p.y+1.3,bz,14);
   const[hx,hz]=live();hit(hx,hz,12,8e12*3,.2);shake=Math.max(shake,5)}
  sw=mkSword(RED,.38);
  const place=d=>{const[ex,ez]=live(),dx=ex-p.x,dz=ez-p.z,l=hyp(dx,dz)||1,ux=dx/l,uz=dz/l;p.x=ex-ux*d;p.z=ez-uz*d;sw.position.set(p.x+ux*.6,p.y+1.3,p.z+uz*.6);sw.lookAt(ex,p.y+1.3,ez)};
  for(let f=0;f<10;f++){const[ex,ez]=live(),l=hyp(ex-p.x,ez-p.z);place(l>4.2?l-(l-4.2)/(10-f):l);await wait(1)}
  const reach=[4.2,3,1.5,1.5];
  for(let i=0;i<10;i++){for(let f=0;f<4;f++){place(reach[f]);if(f==2){const[ex,ez]=live();FXK('slash',{x:ex+rnd()*2-1,z:ez+rnd()*2-1,r:6,col:i&1?RED:WHT});hit(ex,ez,12,8e12*3,.2);shake=Math.max(shake,5)}await wait(1)}}
 } finally{reset();drop(R.g);drop(sw0);if(sw)drop(sw)}}

// Đệ Ngũ: bánh xe dọc (xoay trong mặt phẳng đứng, trục ngang) quanh người và quanh quái; mỗi 2 giây xoay thì chém mạnh 1 nhát — KHÔNG nổ
async function s5(){
 const fe=lock(),[tx,tz]=target(),p=player.position,live=posOf(fe,tx,tz);
 say('Đệ Ngũ Thức: Dung Vạn Hắc — Truyền Tân Hỏa!',1800);
 const A=ringV(3.6),B=ringV(6.5),sw=mkSword(RED,.5);hid=true;
 const wheel=(R,cx,cy,cz,fx,fz,dir)=>{R.g.position.set(cx,cy,cz);R.g.rotation.y=Math.atan2(fx,fz)+Math.PI/2;R.arcs.forEach((m,i)=>{m.rotation.z+=dir*(i&1?-1:1)*.5})};
 try{
  for(let c=0;c<3;c++){
   for(let f=0;f<120;f++){
    const[ex,ez]=live(),dx=ex-p.x,dz=ez-p.z,l=hyp(dx,dz)||1,fx=dx/l,fz=dz/l;
    wheel(A,p.x,p.y+1.7,p.z,fx,fz,-1);wheel(B,ex,2.6,ez,fx,fz,1);
    orbit(sw,p.x,p.y+1.7,p.z,-fz,fx,3.6,-f*.5);
    if(f%6==0)hit(ex,ez,10,1e12*3,.2);
    await wait(1)}
   const[ex,ez]=live();
   say('Truyền Tân Hỏa — Trảm!',700);
   for(let k=0;k<3;k++)FXK('slash',{x:ex+rnd()*3-1.5,z:ez+rnd()*3-1.5,r:16,col:k&1?GLD:RED});
   hit(ex,ez,16,9e13*3,.6);shake=Math.max(shake,10);flash(RED);
   await wait(8)}
 }finally{reset();drop(A.g);drop(B.g);drop(sw)}}

async function exec(f,fly){P.busy++;P.lk++;if(fly){P.flyN++;P.flyH=fly}try{await f()}catch(e){console.error(e)}finally{reset();P.busy--;P.lk--;if(fly){P.flyN--;P.fly=Math.max(P.fly,25)}}}
const baseRun=run;
run=function(sp,k0){const k=sp&&sp.sp;if(k=='pt2')return exec(s2,24);if(k=='pt3')return exec(s3,0);if(k=='pt5')return exec(s5,0);return baseRun(sp,k0)};
})();
