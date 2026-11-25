'use strict';
(function(){
const WHT=0xfff4d0,GLD=0xffd646,BLK=0x111111,rnd=Math.random,now=()=>performance.now();
const drop=g=>{scene.remove(g);freeObj(g)};
const mkSword=(col,sc)=>{const g=new THREE.Group(),b=new THREE.Mesh(G('PTSB',()=>new THREE.BoxGeometry(.5,.15,7)),mat(col,.95)),gd=new THREE.Mesh(G('PTSG',()=>new THREE.BoxGeometry(2,.22,.3)),mat(GLD,.95));b.position.z=3.6;gd.position.z=.2;g.add(b,gd);g.scale.setScalar(sc);scene.add(g);return g};
function boom(x,z,r,col,d,kb){FXK('boom',{x,z,r,col});FXK('ring',{r:r*1.4,life:40,col:WHT});flash(col);shake=Math.max(shake,Math.min(60,r/2));if(d)hit(x,z,r,d*3,kb||3)}
let lockFoe=null;
const baseTarget=target;
target=function(){if(lockFoe&&lockFoe.hp>0)return[lockFoe.m.position.x,lockFoe.m.position.z];return baseTarget()};
function lockOn(){let b=null,bd=1e9;enemies.forEach(e=>{if(e.hp>0){const d=e.m.position.distanceTo(player.position);if(d<bd){bd=d;b=e}}});lockFoe=b;return b}
async function rush(fe,fx,fz,n,keep,step){
 const p=player.position,x0=p.x,z0=p.z,live=()=>fe&&fe.hp>0?[fe.m.position.x,fe.m.position.z]:[fx,fz];
 let[ex,ez]=live();const d0=Math.hypot(ex-x0,ez-z0);n=Math.max(n,Math.min(45,Math.ceil(d0/4)));P.flyH=1;
 for(let f=0;f<n;f++){const k=(f+1)/n;[ex,ez]=live();const d=Math.hypot(ex-x0,ez-z0)||1,r=d>keep?(d-keep)/d:0;p.x=x0+(ex-x0)*k*r;p.z=z0+(ez-z0)*k*r;if(step)step(f);await wait(1)}
 return live()}
const dive=(fe,fx,fz,n,slashCol)=>rush(fe,fx,fz,n,2.5,f=>{if(f%2==0)FXK('slash',{x:player.position.x,z:player.position.z,r:6,col:f&2?slashCol:WHT})});
async function s7(){
 const fe=lockOn(),[tx,tz]=target();say('Nhất Vương Tài Quyết Lục — Hoành Quán Vạn Cổ',2000);FXK('ring',{r:16,life:40,col:0xffffff});FXK('ring',{r:10,life:40,col:BLK});await wait(50);
 say('Khúc Chung Trảm!',1600);FXK('sky',{col:0xffffff});FXK('sky',{col:BLK});
 const[ax,az]=await dive(fe,tx,tz,14,BLK);
 boom(ax,az,110,WHT,5.5e14);FXK('boom',{x:ax,z:az,r:70,col:BLK});await wait(12)}
async function s8(){
 const fe=lockOn(),[tx,tz]=target();say('Nhất Vương Tài Quyết Lục — Tung Hoành Thiên Hạ',2000);await wait(30);
 const[ax,az]=await dive(fe,tx,tz,12,BLK);
 boom(ax,az,45,WHT,2e14);await wait(10);
 say('Chúng Sinh Bình Giới Điệu!',1600);
 const p=player.position,s=mkSword(0xffffff,6),foePos=()=>fe&&fe.hp>0?[fe.m.position.x,fe.m.position.z]:[ax,az];
 let bx=ax,bz=az;
 try{
  P.flyH=34;
  for(let f=0;f<26;f++){const[ex,ez]=foePos();s.position.set(p.x,p.y+4,p.z);s.lookAt(ex,0,ez);await wait(1)}
  [bx,bz]=await rush(fe,ax,az,16,1.2,()=>{const[ex,ez]=foePos();s.position.set(p.x,p.y+4,p.z);s.lookAt(ex,0,ez)})
 }finally{drop(s)}
 boom(bx,bz,130,WHT,5e14);FXK('boom',{x:bx,z:bz,r:80,col:BLK});await wait(12)}
async function exec(f,fly){P.busy++;P.lk++;P.flyN++;P.flyH=fly;try{await f()}catch(e){console.error(e)}finally{lockFoe=null;P.busy--;P.lk--;P.flyN--;P.fly=Math.max(P.fly,25)}}
const baseRun=run;
run=function(sp,k0){
 if(sp&&sp.sp=='pt7')return exec(s7,28);
 if(sp&&sp.sp=='pt8')return exec(s8,22);
 return baseRun(sp,k0)};

const baseSay=say;
say=function(t,ms){
 if(t==='Phụng Tước Bát Điểu, Chung Chương!')t='Phượng Tước Kiếm Pháp Chung Chương!';
 else if(t==='Phượng Tước Kiếm Pháp Chung Chương'&&ms===1200)return;
 return baseSay(t,ms)};

const bp=popup;
popup=function(title,opts,cur,fn){
 if(typeof title==='string'&&title.indexOf('Thiên Tướng (bật/tắt')===0){
  const on=opts.some(o=>o.includes('[BẬT]')),has=opts.some(o=>o.includes('[BẬT]')||o.includes('[TẮT]'));
  if(!has)toast('Chưa mở khóa Thiên Tướng — hạ Định Vương (Map 3)');
  else opts.forEach((o,i)=>{if(on?o.includes('[BẬT]'):o.includes('[TẮT]'))fn(i)});
  bp(title,['.'],-1,()=>{});$('popup').style.display='none';paused=false;return}
 return bp(title,opts,cur,fn)};

const baseSync=syncRT;
syncRT=function(){const k=P.kh,a=P.ap;baseSync();if(P.sty>=6&&k)P.ap=a};

const baseMk=mk;
let beamN=0;
mk=function(k,o){if(k==='beam'&&P.ap>0&&P.sty>=6&&o)o=Object.assign({},o,{col:beamN++%4==3?0xff2020:0x050507});return baseMk(k,o)};

const own=()=>P.sw==4;
const TKEYS=['dinh','thi','tinh','viem','hon','xv'];
let ttC=0,gold=0,ttCt=0,ttBtn=null;
const rd1=()=>{const n=now();if(n-ttCt>200){ttCt=n;try{const d=JSON.parse(localStorage.getItem('tm_pt_v1')||'{}'),b=d.beat||{},t=d.tt||[];ttC=(b[TKEYS[0]]&&t[0])?1:0;gold=(d.up&&d.skin)?1:0}catch(e){ttC=0;gold=0}}};
const ttOn=()=>{rd1();return ttC};
const hbMul=()=>{rd1();return (gold?1000:250)*(P.kh>0?750:1)};
const baseHit=hit;
hit=function(x,z,r,d,kb){if(P.sw==4&&P.sty>=6)r*=hbMul();return baseHit(x,z,r,d,kb)};
let gb=false;const BM=mat(0x060608,.6);
const RM=new THREE.MeshBasicMaterial({color:0xff2020,transparent:true,opacity:.95,depthWrite:false});
const mkRed=sc=>{
 const g=new THREE.Group();
 [-1,1].forEach(s=>{const e=new THREE.Mesh(G('PFEY',()=>new THREE.BoxGeometry(.1,.05,.05)),RM);e.position.set(s*.11,1.7,.23);g.add(e)});
 [[.38,2.35,.02],[1.05,.06,.025]].forEach(([r,y,w])=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,w,6,32),RM);m.rotation.x=Math.PI/2;m.position.y=y;g.add(m)});
 g.scale.setScalar(sc);g.visible=false;scene.add(g);return g};
const redKh=mkRed(2.2),redAp=mkRed(5);
const followRed=(src,dst,on)=>{dst.visible=!!(on&&src.parent);if(dst.visible){dst.position.copy(src.position);dst.rotation.y=src.rotation.y}};
{const rd=ren.render.bind(ren);ren.render=function(s,c){
 try{const w=P.sty>=6&&P.ap>0;if(w!==gb){gb=w;S.gap.traverse(o=>{if(o.isMesh){if(!o.userData.pm2)o.userData.pm2=o.material;o.material=w?BM:o.userData.pm2}})}
  if(w)enemies.forEach(e=>{if(e.ms&&!(e.hit>0))e.ms.forEach(m=>m.emissive.setHex(0))})}catch(e){}
 try{const k0=S.kh.children[0];followRed(S.kh,redKh,P.sty>=6&&P.kh>0&&k0&&k0.material.color.getHex()===0x060608);followRed(S.gap,redAp,gb&&P.ap>0)}catch(e){}
 const r=rd(s,c);
 try{if(own()){if(bt.M2)bt.M2.classList.toggle('on',P.ap>0);if(ttBtn)ttBtn.classList.toggle('on',ttOn()>0)}}catch(e){}
 return r}}

(function tick(){
 requestAnimationFrame(tick);
 try{
  scene.children.forEach(g=>{const u=g.userData;if(u&&u.aL&&!u.ptTT&&(g.scale.x===2.4||Math.abs(g.scale.x-3.2)<1e-6)){u.ptTT=1;g.scale.setScalar(1.1)}});
  const arr=scene.children.filter(g=>g.userData&&g.userData.ptTT);
  arr.forEach((g,i)=>{g.visible=i===arr.length-1})
 }catch(e){}
})();

const innerLaw=lawMenu;
function toggleTT(){if(own())innerLaw()}
function toggleAP(){
 if(P.sty<6)return toast('Cần dùng Phượng Tước Kiếm Pháp hoặc Nhất Vương Tài Quyết Lục');
 if(!P.kh)return toast('Bật Kiếm Hồn Nhất Vương (R) trước');
 P.ap=P.ap?0:1;say(P.ap?'Áp Chế Nhất Vương — BẬT (một đòn diệt tất cả)':'Áp Chế Nhất Vương — TẮT',1400);if(P.ap)flash(0x000000)}
lawMenu=function(){if(own())return toggleAP();return innerLaw()};
addEventListener('keydown',e=>{
 if(e.code!=='KeyT'||!own())return;
 const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
 e.stopImmediatePropagation();if(!e.repeat)toggleTT()},true);
const baseBuild=buildBtns;
buildBtns=function(){
 baseBuild();ttBtn=null;
 if(own()){
  if(bt.M2)bt.M2.innerHTML='<b>M2</b><i>Áp Chế</i>';
  const bot=$('btns'),b=document.createElement('button');
  b.innerHTML='<b>T</b><i>Thiên Tướng</i>';b.className='rt rT';
  b.addEventListener('pointerdown',e=>{e.preventDefault();toggleTT()});
  if(bt.R)bt.R.after(b);else{const k=bot.querySelector('.rt');if(k)bot.insertBefore(b,k);else bot.appendChild(b)}
  ttBtn=b}
 placeCols()};
GUIDE['Phượng Tước']+='<h3>Kiếm Hồn Nhất Vương, Áp Chế, Thiên Tướng</h3>Nút R: bật/tắt Kiếm Hồn Nhất Vương (đen, mắt và vòng hào quang đỏ, x1.000.000). Nút M2 (hoặc chuột phải): bật/tắt Áp Chế Nhất Vương màu đen (bóng, tia và quái đều đen, thỉnh thoảng có tia, mắt và vòng đỏ), một đòn diệt tất cả, cần bật Kiếm Hồn trước. Nút T (bên phải nút R): bật/tắt Thiên Tướng, nhân sức mạnh theo boss cao nhất đã hạ, kèm một quái nhỏ đi theo.<h3>Hitbox</h3>Skin Đỏ: hitbox x250. Skin Vàng Trắng: hitbox x1.000. Bật Kiếm Hồn Nhất Vương: hitbox nhân thêm x750.';
buildBtns();
})();
