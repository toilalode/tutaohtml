'use strict';
(function(){
const KEY='tm_pt_v1',DGK='tm_dungeon_v1',RED=0xff2a2a,GLD=0xffd646,WHT=0xfff4d0,hyp=Math.hypot,now=()=>performance.now(),pl=()=>player.position,rnd=Math.random;
const PT={sword:0,up:0,eq:0,np:0,kh:0,bone:0,core:0,lkh:0,xuong:0,ngoc:{dinh:0,thi:0,tinh:0,viem:0,hon:0,np:0},beat:{}};
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d){Object.assign(PT,d);PT.ngoc=Object.assign({dinh:0,thi:0,tinh:0,viem:0,hon:0,np:0},d.ngoc||{});PT.beat=d.beat||{}}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(PT))}catch(e){}};
setInterval(save,3000);addEventListener('pagehide',save);
const dgOwn=()=>{try{return JSON.parse(localStorage.getItem(DGK)||'{}')||{}}catch(e){return{}}};
const TIERS=[['dinh',3,'Định Hoàng Thiên Tướng'],['thi',10,'Song Hoàng Thiên Tướng'],['tinh',20,'Tam Hoàng Thiên Tướng'],['viem',25,'Viêm Đế Thiên Tướng'],['hon',35,'Hỗn Độn Thiên Tướng'],['xv',50,'Xi Vưu Thiên Tướng']];
const tier=()=>{let r=null,n=0;TIERS.forEach((t,i)=>{if(PT.beat[t[0]]){r=t;n=i+1}});return r?{n,mul:r[1],name:r[2]}:null};
let tienT=0,khOn=false;
const PW=()=>{let m=PT.eq==2?1500:PT.eq==1?100:1;if(PT.np)m*=40;if(PT.ngoc.dinh)m*=1.5;if(PT.ngoc.thi)m*=2;if(PT.ngoc.tinh)m*=6;if(tienT>0){const t=tier();if(t)m*=t.mul}if(khOn)m*=1e6;return m};

if(STYLES.length<6){STYLES.push('Chung Yên Kiếm Pháp');STCOL.push(RED)}
STYLES.push('Phượng Tước Kiếm Pháp','Nhất Vương Tài Quyết Lục');STCOL.push(0xff3a1a,0xdcdcf0);
const U=k=>()=>!!PT.beat[k];
const TT={n:'Thiên Tướng',cd:2400,sta:30,sp:'ptTT',pt:()=>!!tier()},VQ={n:'Vạn Quái Vàng',cd:1500,sta:40,sp:'ptVQ',pt:()=>!!PT.bone},HD={n:'Hố Đen Vàng',cd:1800,sta:40,sp:'ptHD',pt:()=>!!PT.bone};
SK[6]={
 z:{n:'Đệ Nhất Thức: Đoạn Linh Tiêu',cd:540,sta:25,sp:'pt1',pt:U('dinh')},
 x:{n:'Đệ Nhị Thức: Di Tinh Đầu',cd:600,sta:25,sp:'pt2',pt:U('thi')},
 c:{n:'Đệ Tam Thức: Mẫn Vạn Tượng',cd:660,sta:30,sp:'pt3',pt:U('tinh')},
 v:{n:'Đệ Tứ Thức: Sí Sơn Hà',cd:720,sta:30,sp:'pt4',pt:U('viem')},
 b:{n:'Đệ Ngũ Thức: Chém Xoay',cd:780,sta:35,sp:'pt5',pt:U('viem')},
 n:{n:'Chung Chương: Nguyên Phượng Thiên Giáng',cd:1200,sta:50,sp:'pt6',pt:U('xv')},
 g:TT,j:VQ,f:HD};
SK[7]={
 z:{n:'Khúc Chung Điếu',cd:900,sta:40,sp:'pt7',pt:U('hon')},
 x:{n:'Chúng Sinh Bình Giới Điệu',cd:1000,sta:45,sp:'pt8',pt:U('hon')},
 g:TT,j:VQ,f:HD};

const css=document.createElement('style');
css.textContent='#ptBoss{position:fixed;top:2px;left:50%;transform:translateX(-50%);width:min(34%,300px);z-index:140;display:none;text-align:center;font:bold 10px "Courier New",monospace;color:#ffd646;pointer-events:none;will-change:transform}'
+'#ptBar{height:16px;border:1px solid #9945ff;background-color:rgba(10,0,15,.85);background-image:linear-gradient(90deg,#ffb000,#ff2a2a);background-repeat:no-repeat;background-size:var(--p,100%) 100%;line-height:16px}'
+'#ptHud{position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:140;display:none;font:bold 12px "Courier New",monospace;color:#ffd646;text-shadow:0 0 3px #000,0 0 3px #000;pointer-events:none;will-change:transform;white-space:nowrap}'
+'#ptTalk{position:fixed;right:76px;bottom:62px;z-index:300;display:none;padding:10px 18px;font:bold 14px "Courier New",monospace;color:#ffd646;background:rgba(10,5,25,.92);border:2px solid #ffd646;border-radius:10px;box-shadow:0 0 10px rgba(255,214,70,.7);will-change:transform}';
document.head.appendChild(css);
const ui=document.createElement('div');ui.id='ptBoss';ui.innerHTML='<div id="ptBossN"></div><div id="ptBar"><span id="ptBossT"></span></div>';document.body.appendChild(ui);
const hud=document.createElement('div');hud.id='ptHud';document.body.appendChild(hud);
const talkBtn=document.createElement('button');talkBtn.id='ptTalk';talkBtn.textContent='Nói chuyện (I)';document.body.appendChild(talkBtn);
const show=(el,on)=>{if(el._v!==on){el._v=on;el.style.display=on?'block':'none'}};
const fmtB=n=>(n/1e9).toLocaleString('vi-VN',{maximumFractionDigits:1})+' tỷ';

function phoenix(c1,c2){
 const g=new THREE.Group(),m1=mat(c1,.95),m2=mat(c2,.9);
 const body=new THREE.Mesh(G('PTB',()=>new THREE.SphereGeometry(.5,10,8)),m1);body.scale.set(.7,.7,1.5);g.add(body);
 const head=new THREE.Mesh(G('PTB',()=>new THREE.SphereGeometry(.5,10,8)),m1);head.scale.setScalar(.55);head.position.set(0,.35,.9);g.add(head);
 const beak=new THREE.Mesh(G('PTK',()=>new THREE.ConeGeometry(.12,.45,5)),m2);beak.rotation.x=Math.PI/2;beak.position.set(0,.33,1.3);g.add(beak);
 const wg=G('PTW',()=>new THREE.PlaneGeometry(2.2,1.1)),ws=[];
 [-1,1].forEach(s=>{const w=new THREE.Mesh(wg,m2);w.position.set(s*1.2,.2,0);w.rotation.x=-Math.PI/2;g.add(w);ws.push([w,s])});
 for(let i=-1;i<=1;i++){const t=new THREE.Mesh(G('PTT',()=>new THREE.ConeGeometry(.14,2.2,5)),m2);t.rotation.x=-Math.PI/2;t.rotation.z=i*.35;t.position.set(i*.35,0,-1.9);g.add(t)}
 g.userData={m1,m2,ws};return g}
const flap=(g,T)=>{if(!g||!g.userData.ws)return;g.userData.ws.forEach(([w,s])=>{w.rotation.z=s*Math.sin(T*7)*.7})};

let org=null,phx=null,applied=false,bossPhx=null,lblSet=false;
function swordVis(){
 if(PT.eq){const up=PT.eq==2;if(!org)org=[PA.sb.material.color.getHex(),PA.sg.material.color.getHex()];
  PA.sb.material.color.setHex(up?WHT:0xff2020);PA.sg.material.color.setHex(up?0xffe070:0xffb000);
  if(!phx){phx=phoenix(0xff3010,0xffb000);phx.scale.setScalar(.9);phx.position.set(0,.3,2.6);SWH.add(phx)}
  phx.userData.m1.color.setHex(up?0xffffff:0xff3010);phx.userData.m2.color.setHex(up?0xffe070:0xffb000);applied=true}
 else if(applied){applied=false;if(org){PA.sb.material.color.setHex(org[0]);PA.sg.material.color.setHex(org[1])}if(phx){SWH.remove(phx);freeObj(phx);phx=null}}}
{const rd=ren.render.bind(ren);ren.render=function(s,c){try{swordVis()}catch(e){}return rd(s,c)}}

const basePopup=popup;
popup=function(title,opts,cur,fn){
 if(title=='Chọn kiếm'){
  const n=opts.length,ex=[];if(PT.sword)ex.push(['Kiếm Phượng Tước (Đỏ)',1]);if(PT.up)ex.push(['Kiếm Phượng Tước — Vàng Trắng',2]);
  const f=fn;opts=opts.concat(ex.map(a=>a[0]));
  fn=i=>{if(i>=n){PT.eq=ex[i-n][1];save();f(2)}else{PT.eq=0;save();f(i)}}}
 else if(title=='Chọn kiếm pháp'){
  const dg=dgOwn(),vis=[];STYLES.forEach((s,i)=>{if(i==5&&!dg.style)return;if(i==6&&!PT.sword&&!Object.keys(PT.beat).length)return;if(i==7&&!PT.beat.hon)return;vis.push(i)});
  const f=fn;opts=vis.map(i=>STYLES[i]);cur=vis.indexOf(cur);fn=j=>f(vis[j])}
 return basePopup(title,opts,cur,fn)};

const baseDmg=dmgMul;dmgMul=function(){let m=baseDmg();if(P.sty>=6)m*=PW();return m};
const baseCost=costMul;costMul=function(){const c=baseCost();if(P.sty<6)return c;const k=PT.eq==2?0:PT.eq==1?.2:1;return{cd:c.cd*k*(khOn?.5:1),st:c.st*k}};
const baseCast=cast;cast=function(k){const sp=SK[P.sty]&&SK[P.sty][k.toLowerCase()];if(sp&&sp.pt&&!sp.pt())return toast('Chưa mở khóa — hạ boss trong phó bản Phượng Tước');return baseCast(k)};
const baseBuff=buff;buff=function(k){if(P.sty>=6){if(k.toUpperCase()=='R')toggleKH();return}return baseBuff(k)};
const baseBuild=buildBtns;
buildBtns=function(){
 baseBuild();
 if(P.sty>=6&&PT.kh){const bot=$('btns'),b=document.createElement('button');b.innerHTML='<b>R</b><i>Hồn Nhất Vương</i>';b.className='rt rR';b.addEventListener('pointerdown',e=>{e.preventDefault();toggleKH()});bot.insertBefore(b,bot.firstChild);bt.R=b}
 placeCols()};

let aura=null;
function toggleKH(){
 if(!PT.kh)return toast('Chưa có Kiếm Hồn Nhất Vương');
 khOn=!khOn;say('Kiếm Hồn Nhất Vương — '+(khOn?'BẬT':'TẮT'),1100);if(khOn)flash(0x202020);
 if(khOn&&!aura){aura=new THREE.Mesh(G('PTA',()=>new THREE.SphereGeometry(3.2,16,12)),mat(0x050508,.4));scene.add(aura)}
 if(aura)aura.visible=khOn}

const drop=g=>{scene.remove(g);freeObj(g)};
const disc=(x,z,r,c,o)=>{const m=new THREE.Mesh(G('PTD',()=>new THREE.CircleGeometry(1,40)),mat(c,o));m.rotation.x=-Math.PI/2;m.position.set(x,.14,z);m.scale.setScalar(r);return m};
const warn=(x,z,r,sec)=>{const d=disc(x,z,r,RED,.2);add(d,Math.round(sec*60),(f,t)=>{d.material.opacity=.12+.3*t})};
const burst=(x,z,r,c)=>{const o=new THREE.Mesh(G('PTR',()=>new THREE.RingGeometry(.9,1,40)),mat(c,.9));o.rotation.x=-Math.PI/2;o.position.set(x,.16,z);add(o,27,(f,t)=>{o.scale.setScalar(r*(.3+t*.7));o.material.opacity=.9*(1-t)})};
const mkSword=(col,sc)=>{const g=new THREE.Group(),b=new THREE.Mesh(G('PTSB',()=>new THREE.BoxGeometry(.5,.15,7)),mat(col,.95)),gd=new THREE.Mesh(G('PTSG',()=>new THREE.BoxGeometry(2,.22,.3)),mat(GLD,.95));b.position.z=3.6;gd.position.z=.2;g.add(b,gd);g.scale.setScalar(sc);scene.add(g);return g};
async function fling(col,sc,x0,y0,z0,x1,y1,z1,n){const s=mkSword(col,sc);for(let f=0;f<=n;f++){const k=f/n,e=k*k;s.position.set(x0+(x1-x0)*e,y0+(y1-y0)*e,z0+(z1-z0)*e);s.lookAt(x1,y1,z1);await wait(1)}drop(s)}
function boom(x,z,r,col,d,kb){FXK('boom',{x,z,r,col});FXK('ring',{r:r*1.4,life:40,col:WHT});flash(col);shake=Math.max(shake,Math.min(60,r/2));if(d)hit(x,z,r,d*3,kb||3)}
function stunAt(x,z,r,sec){enemies.forEach(e=>{if(hyp(e.m.position.x-x,e.m.position.z-z)<r){if(e.dummy)e.stun=Math.max(e.stun||0,sec);else e.cd=Math.max(e.cd,sec)}})}

async function s1(){
 const[tx,tz]=target();say('Phượng Tước Kiếm Pháp — Đệ Nhất Thức',1000);FXK('ring',{r:10,life:30,col:RED});await wait(26);
 say('Đoạn Linh Tiêu — Trấn Tinh Hà!',1500);const p=pl();
 await fling(RED,4,p.x,26,p.z,tx,0,tz,26);
 boom(tx,tz,60,RED,1e14)}
async function s2(){
 const[tx,tz]=target();say('Phượng Tước Kiếm Pháp — Đệ Nhị Thức',1000);await wait(16);say('Di Tinh Đầu — Chuyển Tuế Hoa!',1500);
 for(let i=0;i<16;i++){const a=i*.8;FXK('slash',{x:tx+Math.cos(a)*5,z:tz+Math.sin(a)*5,r:8,col:i&1?RED:GLD});hit(tx,tz,10,4e12*3,.4);shake=Math.max(shake,4);await wait(3)}
 const p=pl();await fling(RED,4,p.x,26,p.z,tx,0,tz,20);boom(tx,tz,60,GLD,1.5e14)}
async function s3(){
 const[tx,tz]=target(),p=pl(),a=Math.atan2(tx-p.x,tz-p.z);say('Phượng Tước Kiếm Pháp — Đệ Tam Thức',1000);
 for(let i=0;i<12;i++){const b=a+Math.PI+(i-6)*.35;FXK('slash',{x:p.x+Math.sin(b)*5,z:p.z+Math.cos(b)*5,r:7,col:i&1?RED:GLD});await wait(3)}
 say('Mẫn Vạn Tượng — Khai Thiên Kỷ!',1600);
 const ex=tx+Math.sin(a)*14,ez=tz+Math.cos(a)*14;await fling(RED,3.5,p.x,3,p.z,ex,3,ez,14);
 player.position.set(ex,player.position.y,ez);stunAt(tx,tz,30,3);
 for(let i=0;i<10;i++){FXK('slash',{x:tx+rnd()*6-3,z:tz+rnd()*6-3,r:6,col:i&1?RED:WHT});hit(tx,tz,12,8e12*3,.2);shake=Math.max(shake,5);await wait(4)}
 boom(tx,tz,55,RED,2.5e14)}
async function s4(){
 const[tx,tz]=target();say('Đệ Tứ Thức: Sí Sơn Hà — Phần Thương Vũ!',1600);
 for(let i=0;i<36;i++){FXK('slash',{x:tx+rnd()*14-7,z:tz+rnd()*14-7,r:4+rnd()*3,col:i&1?RED:GLD});hit(tx,tz,12,1.1e13*3,.2);shake=Math.max(shake,3);await wait(2)}
 boom(tx,tz,40,RED,0)}
async function s5(){
 const[tx,tz]=target();say('Đệ Ngũ Thức — Xoay Người Chém',1500);let h=0;
 for(let i=0;i<10;i++){if(i&1){h++;FXK('boom',{x:tx,z:tz,r:16,col:GLD});flash(RED);shake=Math.max(shake,10);hit(tx,tz,16,9e13*3,.6);await wait(8)}else{for(let j=0;j<4;j++){const a=(i*4+j)*.9;FXK('slash',{x:tx+Math.cos(a)*5,z:tz+Math.sin(a)*5,r:7,col:RED});hit(tx,tz,10,1e12*3,.2);await wait(2)}}}
 boom(tx,tz,30,GLD,0)}
async function s6(){
 const[tx,tz]=target();say('Phượng Tước Kiếm Pháp Chung Chương',1200);FXK('back',{tex:texBagua,size:14,life:150});FXK('ring',{r:22,life:50,col:GLD});await wait(36);
 say('Nguyên Phượng Thiên Giáng — Vạn Quái Câu Tổn!',2000);
 const cols=[0xffd646,0xff7a1a,0xe8e8ff,0xff2a2a,0x303040,0x8a2be2,0xffa030],gs=[];
 cols.forEach((c,i)=>{const g=roblox({angry:1,skin:0xe8c8a0,shirt:c,pants:0x201018,sword:2});g.scale.setScalar(i==6?8:6);const a=i/7*6.283;g.position.set(tx+Math.cos(a)*10,70,tz+Math.sin(a)*10);scene.add(g);gs.push(g)});
 for(let f=0;f<30;f++){const k=f/29,e=k*k;gs.forEach(g=>{g.position.y=70*(1-e)});await wait(1)}
 gs.forEach(drop);boom(tx,tz,90,GLD,8e14);FXK('boom',{x:tx,z:tz,r:60,col:RED});await wait(10)}
async function s7(){
 const[tx,tz]=target();say('Nhất Vương Tài Quyết Lục — Hoành Quán Vạn Cổ',2000);FXK('ring',{r:16,life:40,col:0xffffff});FXK('ring',{r:10,life:40,col:0x111111});await wait(50);
 say('Khúc Chung Điếu!',1600);const p=pl(),x0=p.x,z0=p.z;
 for(let f=0;f<14;f++){const k=(f+1)/14;player.position.x=x0+(tx-x0)*k*.85;player.position.z=z0+(tz-z0)*k*.85;await wait(1)}
 boom(tx,tz,110,WHT,5.5e14);FXK('boom',{x:tx,z:tz,r:70,col:0x111111});await wait(12)}
async function s8(){
 const[tx,tz]=target();say('Nhất Vương Tài Quyết Lục — Tung Hoành Thiên Hạ',2000);await wait(30);
 const p=pl(),x0=p.x,z0=p.z;
 for(let f=0;f<12;f++){const k=(f+1)/12;player.position.x=x0+(tx-x0)*k;player.position.z=z0+(tz-z0)*k;FXK('slash',{x:player.position.x,z:player.position.z,r:6,col:f&1?0x111111:WHT});await wait(1)}
 boom(tx,tz,45,WHT,2e14);await wait(14);
 say('Chúng Sinh Bình Giới Điệu!',1600);
 const s=mkSword(0xffffff,6);s.position.set(tx,40,tz);s.lookAt(tx,0,tz);
 for(let f=0;f<24;f++){s.position.y=40+f*.4;await wait(1)}
 for(let f=0;f<14;f++){const k=(f+1)/14;s.position.y=50*(1-k*k);await wait(1)}
 drop(s);boom(tx,tz,130,WHT,5e14);FXK('boom',{x:tx,z:tz,r:80,col:0x111111});await wait(12)}

let figs=[];
const FCOL=[0xffd646,0xff7a1a,0xe8e8ff,0xff2a2a,0x303040,0x8a2be2];
function clearFigs(){figs.forEach(drop);figs=[]}
async function stt(){
 const t=tier();if(!t)return;tienT=30;say(t.name+' — x'+t.mul+' sức mạnh',2200);flash(GLD);FXK('ring',{r:20,life:40,col:GLD});
 clearFigs();for(let i=0;i<t.n;i++){const g=roblox({angry:1,skin:0xe8c8a0,shirt:FCOL[i],pants:0x201018,sword:2});g.scale.setScalar(2.4+(i>=3?.8:0));scene.add(g);figs.push(g)}
 await wait(30)}
function figsStep(T){const p=pl();figs.forEach((g,i)=>{const a=T*.8+i/figs.length*6.283;g.position.set(p.x+Math.cos(a)*7,0,p.z+Math.sin(a)*7);g.rotation.y=-a})}

async function svq(){
 const[tx,tz]=target(),n=window.LOW?1500:4000;say('Vạn Quái Vàng!',1400);flash(GLD);
 const pos=new Float32Array(n*3),geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:GLD,size:1.3,transparent:true,opacity:.9,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);
 try{for(let k=0;k<24;k++){for(let i=0;i<n;i++){const r=Math.sqrt(rnd())*22,a=rnd()*6.283;pos[i*3]=tx+Math.cos(a)*r;pos[i*3+1]=.5+rnd()*2;pos[i*3+2]=tz+Math.sin(a)*r}
  geo.attributes.position.needsUpdate=true;stunAt(tx,tz,60,1);hit(tx,tz,60,5e23*3,.1);shake=Math.max(shake,4);await wait(15)}}
 finally{scene.remove(pts);geo.dispose();pts.material.dispose()}
 boom(tx,tz,70,GLD,0)}
async function shd(){
 const[tx,tz]=target();say('Hố Đen Vàng!',1400);flash(0x000000);
 const h=disc(tx,tz,1,0x000000,.95),r=disc(tx,tz,1,GLD,.6);r.position.y=.12;scene.add(h,r);
 try{for(let f=0;f<48;f++){const k=Math.min(1,f/30),s=2+k*30;h.scale.setScalar(s);r.scale.setScalar(s*1.15);
  enemies.forEach(e=>{const p=e.m.position,d=hyp(tx-p.x,tz-p.z);if(d>2&&d<70){p.x+=(tx-p.x)/d*.6;p.z+=(tz-p.z)/d*.6}});shake=Math.max(shake,3);await wait(1)}}
 finally{drop(h);drop(r)}
 boom(tx,tz,140,GLD,1e25)}

const SKL={pt1:[s1,24],pt2:[s2,24],pt3:[s3,0],pt4:[s4,0],pt5:[s5,0],pt6:[s6,22],pt7:[s7,28],pt8:[s8,22],ptTT:[stt,0],ptVQ:[svq,0],ptHD:[shd,0]};
async function exec(f,fly){P.busy++;P.lk++;if(fly){P.flyN++;P.flyH=fly}try{await f()}catch(e){console.error(e)}finally{P.busy--;P.lk--;if(fly){P.flyN--;P.fly=Math.max(P.fly,25)}}}
const baseRun=run;run=function(sp,k0){const d=sp&&sp.sp&&SKL[sp.sp];if(!d)return baseRun(sp,k0);return exec(d[0],d[1])};

const BD={
 dinh:{n:'Định Vương',hp:1e10,c:0xc9a227,sc:3.6,k:300},
 thi:{n:'Thí Vương',hp:1.5e10,c:0x6a1a8a,sc:3.8,k:350},
 tinh:{n:'Tĩnh Vương',hp:2.5e10,c:0x1a6a8a,sc:4,k:400},
 viem:{n:'Viêm Đế',hp:5e10,c:0xd04010,sc:4.2,k:450},
 hon:{n:'Hỗn Độn',hp:6e10,c:0x202030,sc:4.4,k:500},
 xv:{n:'Xi Vưu',hp:1e11,c:0x7a0a14,sc:4.8,k:600},
 np:{n:'Nguyên Phượng',hp:1e13,c:0xffa030,sc:5.4,k:700}};
const ORDER=['dinh','thi','tinh','viem','hon','xv'];
let PB=null;
const bpos=()=>PB.e.m.position;
const harm=d=>{if(PB&&P.hp>0)hurt(d*PB.d.k)};
const inR=(x,z,r)=>{const q=pl();return q.y<3.5&&hyp(q.x-x,q.z-z)<r};
const later=(s,f)=>PB.q.push({t:s,fn:f});
const armA=(a,ms)=>{PB.arm=a;PB.armT=now()+ms};
const ATT={
 cleave(){const p=bpos(),x=p.x,z=p.z;PB.busy=2.1;armA(-2.9,1200);warn(x,z,8,1.2);later(1.2,()=>{armA(.3,300);burst(x,z,8,GLD);shake=Math.max(shake,8);if(inR(x,z,8))harm(22)})},
 rain(){PB.busy=3;armA(-2.9,1500);for(let i=0;i<12;i++)later(i*.12,()=>{const q=pl(),a=rnd()*6.283,r=rnd()*14,x=q.x+Math.cos(a)*r,z=q.z+Math.sin(a)*r;warn(x,z,2.4,1.4);later(1.4,()=>{FXK('blade',{x,z,col:RED});if(inR(x,z,2.4))harm(14)})})},
 nova(){const p=bpos(),x=p.x,z=p.z,r=17;PB.busy=3.4;armA(-3,2600);say(PB.d.n+' — Bạo Kích!',1200);warn(x,z,r,2.5);later(2.5,()=>{armA(.3,300);burst(x,z,r,RED);flash(GLD);shake=Math.max(shake,14);if(inR(x,z,r))harm(36)})},
 dash(){const p=bpos(),x=p.x,z=p.z,q=pl(),a=Math.atan2(q.x-x,q.z-z),d=Math.min(36,hyp(q.x-x,q.z-z));PB.busy=2.4;armA(-2.9,1000);later(1,()=>{PB.rush={t:.3,vx:Math.sin(a)*d/.3,vz:Math.cos(a)*d/.3};later(.35,()=>{const e=bpos();burst(e.x,e.z,6,GLD);if(inR(e.x,e.z,6))harm(24)})})}};
function startBoss(key){
 if(PB)return toast('Đang giao chiến');
 const d=BD[key],g=roblox({skin:0xe8c8a0,shirt:d.c,pants:0x16080c,sword:2.2}),ms=[];
 g.scale.setScalar(d.sc);g.position.set(0,0,-34);
 g.traverse(c=>{if(c.isMesh)(Array.isArray(c.material)?c.material:[c.material]).forEach(x=>{if(x.emissive&&!ms.includes(x))ms.push(x)})});
 if(key=='np'){bossPhx=phoenix(0xff6020,0xffd646);bossPhx.scale.setScalar(2.2);bossPhx.position.set(0,2.6,0);g.add(bossPhx)}
 scene.add(g);const e={m:g,ms,hp:d.hp,max:d.hp,lh:d.hp,hit:0,cd:99,wind:0,ph:0,dummy:1};enemies.push(e);
 PB={e,d,key,cd:2.2,busy:0,q:[],ph:0,arm:0,armT:0,rush:null};say(d.n+' xuất hiện!',2200);flash(RED);shake=Math.max(shake,12)}
function reward(k){
 const f=!PT.beat[k];let m='';
 if(k=='np'){if(!PT.np){PT.np=1;m+='+x40 sức mạnh cho 2 bộ chiêu. '}if(rnd()<.1){PT.ngoc.np++;m+='Nhận Ngọc Nguyên Phượng! '}if(!m)m='Không rớt Ngọc Nguyên Phượng lần này.'}
 else if(f){PT.beat[k]=1;
  if(k=='dinh'){PT.ngoc.dinh=1;m='Ngọc Định Vương (x1,5), Đệ Nhất Thức, Định Hoàng Thiên Tướng (x3)'}
  else if(k=='thi'){PT.ngoc.thi=1;m='Ngọc Thí Vương (x2), Đệ Nhị Thức, Song Hoàng Thiên Tướng (x10)'}
  else if(k=='tinh'){PT.ngoc.tinh=1;m='Ngọc Tĩnh Vương (x6), Đệ Tam Thức, Tam Hoàng Thiên Tướng (x20)'}
  else if(k=='viem'){PT.ngoc.viem+=2;m='2 Ngọc Viêm Đế, Đệ Tứ + Đệ Ngũ Thức, Viêm Đế Thiên Tướng (x25)'}
  else if(k=='hon'){PT.ngoc.hon+=2;m='2 Ngọc Hỗn Độn, Nhất Vương Tài Quyết Lục, Hỗn Độn Thiên Tướng (x35)'}
  else{PT.core++;PT.lkh++;PT.kh=1;PT.bone=1;PT.xuong+=1e6;m='1 Lõi Sức Mạnh, 1 Lõi Kiếm Hồn (Kiếm Hồn Nhất Vương, nút R), 1.000.000 xương cá, Vạn Quái + Hố Đen màu vàng x1.000, Xi Vưu Thiên Tướng (x50)'}}
 else m='Đã nhận thưởng lần đầu';
 save();say('Chiến thắng! '+m,5200);flash(GLD)}
function bossWin(){const k=PB.key;scene.remove(PB.e.m);freeObj(PB.e.m);enemies=enemies.filter(x=>x!==PB.e);PB=null;bossPhx=null;reward(k)}
function bossStep(dt,T){
 const e=PB.e,g=e.m,p=g.position,q=pl(),u=g.userData,f2=PB.key=='np';
 if(e.hp<=0||!enemies.includes(e))return bossWin();
 const tp=Math.atan2(q.x-p.x,q.z-p.z);g.rotation.y=tp;
 if(e.stun>0)e.stun-=dt;
 const bdt=(e.stun>0||P.tf>0||P.dom5>0||P.ap>0)?0:dt;
 if(bdt>0){
  if(PB.rush){p.x+=PB.rush.vx*bdt;p.z+=PB.rush.vz*bdt;PB.rush.t-=bdt;if(PB.rush.t<=0)PB.rush=null}
  else if(PB.busy<=0){const d=hyp(q.x-p.x,q.z-p.z);if(d>10){const s=(f2?8:5.5)*bdt;p.x+=Math.sin(tp)*s;p.z+=Math.cos(tp)*s;PB.ph+=bdt*7}}
  const r=hyp(p.x,p.z);if(r>90){p.x*=90/r;p.z*=90/r}
  const old=PB.q;PB.q=[];old.forEach(a=>{a.t-=bdt;if(a.t<=0)a.fn();else PB.q.push(a)});
  PB.busy-=bdt;PB.cd-=bdt;
  if(PB.busy<=0&&PB.cd<=0){const pool=['cleave','cleave','rain','nova','dash'];ATT[pool[rnd()*pool.length|0]]();PB.cd=f2?.9:1.5}}
 const a=PB.armT>now()?PB.arm:-.9+Math.sin(T*2)*.12;
 u.aL.rotation.x=a;u.aR.rotation.x=a;u.lL.rotation.x=Math.sin(PB.ph)*.6;u.lR.rotation.x=-Math.sin(PB.ph)*.6;
 flap(bossPhx,T);
 $('ptBossN').textContent=PB.d.n.toUpperCase();
 $('ptBar').style.setProperty('--p',(Math.max(0,Math.min(1,e.hp/e.max))*100).toFixed(1)+'%');
 $('ptBossT').textContent=fmtB(Math.max(0,e.hp))+' / '+fmtB(e.max)}

let Q=null;
function q1Start(){if(Q)return;Q={t:600,n:0,cur:null,gap:0};say('Nhiệm vụ: diệt 1.000 quái trong 10 phút!',2600);flash(RED)}
function q1End(){if(Q&&Q.cur&&enemies.includes(Q.cur)){scene.remove(Q.cur.m);freeObj(Q.cur.m);enemies=enemies.filter(x=>x!==Q.cur)}Q=null}
function q1Step(dt){
 Q.t-=dt;
 if(Q.t<=0){q1End();say('Nhiệm vụ thất bại: hết 10 phút',3000);return}
 if(!Q.cur){Q.gap-=dt;if(Q.gap<=0){const{m,ms}=mkEnemy(),q=pl(),a=rnd()*6.283,r=12+rnd()*6;m.position.set(q.x+Math.cos(a)*r,0,q.z+Math.sin(a)*r);scene.add(m);const e={m,ms,hp:1000,lh:1000,hit:0,cd:.6,wind:0,ph:rnd()*6};enemies.push(e);Q.cur=e;FXK('ring',{r:4,life:16,col:RED})}}
 else if(Q.cur.hp<=0||!enemies.includes(Q.cur)){Q.n++;Q.cur=null;Q.gap=.12;
  if(Q.n>=1000){Q=null;if(!PT.sword){PT.sword=1;PT.eq=1;P.sw=2;syncRT();buildBtns();save();say('Hoàn thành! Nhận Kiếm Phượng Tước (x100 sức mạnh, -80% hồi chiêu & thể lực)',5000);flash(RED)}else say('Hoàn thành nhiệm vụ!',2500)}}}

let world=null,npcs=[],near=null,ptMap=0,prev='main';
function npc(label,shirt,x,z,fn){
 const g=roblox({skin:0xf0d4b0,shirt,pants:0x1a1020,sword:1.4});g.scale.setScalar(1.7);g.position.set(x,0,z);
 const c=document.createElement('canvas');c.width=512;c.height=96;const t=c.getContext('2d');t.font='bold 40px "Courier New",monospace';t.textAlign='center';t.lineWidth=6;t.strokeStyle='#000';t.strokeText(label,256,60);t.fillStyle='#ffd646';t.fillText(label,256,60);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,fog:false}));sp.scale.set(5.2,.98,1);sp.position.y=3.5;sp.renderOrder=20;g.add(sp);scene.add(g);
 return{g,sp,fn,x,z}}
function clearNpcs(){npcs.forEach(n=>{scene.remove(n.g);n.sp.material.map.dispose();n.sp.material.dispose();freeObj(n.g)});npcs=[];near=null}
function buildNpcs(){
 clearNpcs();npcs.push(npc('Người Chuyển Đổi',0x1a4a8a,-10,-8,convMenu));
 if(ptMap==1)npcs.push(npc('Lấy Kiếm Phượng Tước',0xaa2222,10,-8,q1Menu));
 if(ptMap==2){npcs.push(npc('Nguyên Phượng',0xd07010,10,-8,()=>startBoss('np')));npcs.push(npc('Người Đổi Đồ',0xc0a030,0,-14,swapMenu))}
 if(ptMap==3)npcs.push(npc('Khiêu Chiến Vương',0x7a0a14,10,-8,bossMenu))}
const dialog=(title,opts,fn)=>{popup(title,opts,-1,fn);const o=$('popts');o.lastChild.textContent='Hủy Popup';o.style.pointerEvents='none';setTimeout(()=>{o.style.pointerEvents=''},450)};
function endAll(){if(PB){scene.remove(PB.e.m);freeObj(PB.e.m);enemies=enemies.filter(x=>x!==PB.e);PB=null;bossPhx=null}q1End()}
function goMap(n){if(PB)return toast('Đang giao chiến boss');endAll();ptMap=n;player.position.set(0,0,0);buildNpcs();say('Map '+n+['',' — Lấy Kiếm Phượng Tước',' — Nguyên Phượng & Nâng Cấp Kiếm',' — Khiêu Chiến Boss'][n],2200)}
function convMenu(){dialog('Người Chuyển Đổi',['Map 1 — Lấy Kiếm Phượng Tước','Map 2 — Nguyên Phượng & Nâng Cấp Kiếm','Map 3 — Khiêu Chiến Boss','Xem hành trang'],i=>{if(i<3)goMap(i+1);else setTimeout(inv,0)})}
function inv(){const t=tier(),g=PT.ngoc;dialog('Hành trang Phượng Tước',['Kiếm Phượng Tước: '+(PT.sword?'đã có':'chưa')+' | Vàng Trắng: '+(PT.up?'đã có':'chưa'),'Ngọc: Định '+g.dinh+' | Thí '+g.thi+' | Tĩnh '+g.tinh+' | Viêm '+g.viem+' | Hỗn '+g.hon+' | Nguyên Phượng '+g.np,'Lõi Sức Mạnh: '+PT.core+' | Lõi Kiếm Hồn: '+PT.lkh+' | Xương cá: '+PT.xuong.toLocaleString('vi-VN'),'Thiên Tướng: '+(t?t.name+' x'+t.mul:'chưa có')+' | Sức mạnh hiện tại x'+PW().toLocaleString('vi-VN')],()=>{})}
function q1Menu(){dialog('Lấy Kiếm Phượng Tước',[Q?'Hủy nhiệm vụ đang làm':'Bắt đầu: diệt 1.000 quái (1.000 máu/con) trong 10 phút'+(PT.sword?' (đã có kiếm)':'')],()=>{if(Q){q1End();say('Đã hủy nhiệm vụ',1500)}else q1Start()})}
function swapMenu(){dialog('Người Đổi Đồ',['Đổi 1 Ngọc Nguyên Phượng (có '+PT.ngoc.np+') → Kiếm Vàng Trắng (x1.500, không hồi chiêu, không tốn thể lực)'],()=>{
 if(!PT.sword)toast('Cần có Kiếm Phượng Tước (Map 1) trước');else if(PT.up)toast('Đã nâng cấp rồi');else if(PT.ngoc.np<1)toast('Chưa có Ngọc Nguyên Phượng — đánh Nguyên Phượng (10% rớt)');
 else{PT.ngoc.np--;PT.up=1;PT.eq=2;P.sw=2;syncRT();buildBtns();save();say('Kiếm Phượng Tước — Vàng Trắng!',3500);flash(WHT)}})}
function bossMenu(){
 dialog('Khiêu Chiến Vua',ORDER.map((k,i)=>BD[k].n+' ('+fmtB(BD[k].hp)+')'+(PT.beat[k]?' [ĐÃ HẠ]':i&&!PT.beat[ORDER[i-1]]?' [KHÓA]':'')),i=>{
  if(i&&!PT.beat[ORDER[i-1]])return toast('Hạ '+BD[ORDER[i-1]].n+' trước');startBoss(ORDER[i])})}
function talk(){if(paused||MAP!='pt'||!near)return;near.fn()}
talkBtn.addEventListener('click',e=>{e.preventDefault();talk()});
addEventListener('keydown',e=>{if(e.repeat||e.code!='KeyI')return;const t=e.target;if(t&&(t.tagName=='INPUT'||t.tagName=='TEXTAREA'))return;talk()});

function buildWorld(){
 const w=new THREE.Group(),s=plane(texBagua,70,.5);s.rotation.x=-Math.PI/2;s.position.set(0,.06,-20);w.add(s);
 const pil=G('PTP',()=>new THREE.CylinderGeometry(1.8,2.2,24,10)),cap=G('PTC',()=>new THREE.BoxGeometry(3,.8,3));
 for(let i=0;i<14;i++){const a=i/14*6.283,x=Math.cos(a)*80,z=Math.sin(a)*80,p=new THREE.Mesh(pil,new THREE.MeshLambertMaterial({color:0x5a2a10})),k=new THREE.Mesh(cap,new THREE.MeshBasicMaterial({color:i&1?GLD:RED}));p.position.set(x,12,z);k.position.set(x,24.4,z);w.add(p,k)}
 return w}
function ptEnter(){world=buildWorld();scene.add(world);gr.material.color.setHex(0xe9d9b8);ptMap=0;buildNpcs();toast('Phó bản Phượng Tước Kiếm: lại gần NPC rồi bấm Nói chuyện (phím I)')}
function ptLeave(){endAll();clearNpcs();clearFigs();tienT=0;if(world){scene.remove(world);freeObj(world);world=null}ptMap=0;show(ui,false);show(hud,false);show(talkBtn,false)}

const baseSet=setMap;
setMap=function(m){
 const was=MAP;if(was=='pt')ptLeave();
 if(m!='pt')return baseSet(m);
 if(was!='pt')prev=was=='dungeon'?'main':was;
 baseSet('main');enemies.forEach(e=>{scene.remove(e.m);freeObj(e.m)});enemies=[];wave=0;MAP='pt';ptEnter()};
const baseResp=respawn;respawn=function(){if(MAP=='pt'){setMap(prev);return}baseResp()};
mapMenu=function(){if(castBusy())return;popup('Chọn map',['Map chính (đợt quái)','Test (quái bù nhìn)','Phó bản Chung Yên Hoàng Đế','Phó bản Phượng Tước Kiếm'],MAP=='test'?1:MAP=='dungeon'?2:MAP=='pt'?3:0,i=>setMap(['main','test','dungeon','pt'][i]))};

GUIDE['Phượng Tước']='<h3>Phó bản Phượng Tước Kiếm</h3>Nút Map → Phó bản Phượng Tước Kiếm. Nói chuyện với Người Chuyển Đổi (phím I) để chọn map.<h3>Map 1</h3>Diệt 1.000 quái (1.000 máu/con, triệu hồi từng con) trong 10 phút → Kiếm Phượng Tước (đỏ, phượng hoàng 3D): x100 sức mạnh, -80% hồi chiêu và thể lực cho Phượng Tước Kiếm Pháp và Nhất Vương Tài Quyết Lục (chọn kiếm ở nút 2).<h3>Map 2</h3>Đánh Nguyên Phượng (10.000 tỷ máu): lần đầu nhận x40 sức mạnh, mỗi lần 10% rớt Ngọc Nguyên Phượng. Người Đổi Đồ đổi ngọc để nâng kiếm lên Vàng Trắng (x1.500, không hồi chiêu, không tốn thể lực).<h3>Map 3</h3>Khiêu chiến lần lượt: Định Vương, Thí Vương, Tĩnh Vương, Viêm Đế, Hỗn Độn, Xi Vưu. Mỗi boss mở chiêu, ngọc và Thiên Tướng (phím G, nhân sức mạnh 30 giây). Xi Vưu rớt Lõi Sức Mạnh, Lõi Kiếm Hồn (Kiếm Hồn Nhất Vương, nút R, x1.000.000) và 1.000.000 xương cá (mở Vạn Quái J / Hố Đen F màu vàng x1.000).';

buildBtns();
let last=now();
(function tick(){requestAnimationFrame(tick);const t=now(),dt=paused?0:Math.min(.05,(t-last)/1000);last=t;try{step(dt,t/1000)}catch(e){console.error(e)}})();
function step(dt,T){
 if(PT.eq){const nm='KIẾM PHƯỢNG TƯỚC'+(PT.eq==2?' — VÀNG TRẮNG':'');$('bSword').textContent='KIẾM: '+nm;lblSet=true}else if(lblSet){lblSet=false;$('bSword').textContent='KIẾM: '+SWORDS[P.sw][0].toUpperCase()}
 if(phx)flap(phx,T);
 if(aura&&khOn)aura.position.set(pl().x,1.6,pl().z);
 if(tienT>0){tienT-=dt;figsStep(T);if(tienT<=0)clearFigs()}
 if(MAP!='pt'){show(ui,false);show(hud,false);show(talkBtn,false);return}
 near=null;const q=pl();npcs.forEach(n=>{n.g.rotation.y=Math.atan2(q.x-n.x,q.z-n.z);n.g.userData.aR.rotation.x=-.35+Math.sin(T*2+n.x)*.08;if(hyp(q.x-n.x,q.z-n.z)<9)near=n});
 show(talkBtn,!!near&&!paused);
 show(ui,!!PB);
 if(PB)bossStep(dt,T);
 if(Q){q1Step(dt);if(Q){const s=Math.max(0,Math.ceil(Q.t));hud.textContent='Quái: '+Q.n+'/1000 — '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');show(hud,true)}else show(hud,false)}
 else if(tienT>0){hud.textContent='Thiên Tướng: '+Math.ceil(tienT)+'s';show(hud,true)}else show(hud,false)}
})();
