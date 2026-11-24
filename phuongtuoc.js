'use strict';
(function(){
const KEY='tm_pt_v1',DGK='tm_dungeon_v1',RED=0xff2a2a,GLD=0xffd646,WHT=0xfff4d0,ORG=0xff8a1a,hyp=Math.hypot,now=()=>performance.now(),pl=()=>player.position,rnd=Math.random;
const PT={sword:0,up:0,skin:0,np:0,kh:0,bone:0,core:0,lkh:0,xuong:0,ngoc:{dinh:0,thi:0,tinh:0,viem:0,hon:0,np:0},beat:{},tt:[0,0,0,0,0,0]};
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d){Object.assign(PT,d);PT.ngoc=Object.assign({dinh:0,thi:0,tinh:0,viem:0,hon:0,np:0},d.ngoc||{});PT.beat=d.beat||{};if(!Array.isArray(PT.tt)||PT.tt.length!=6)PT.tt=[0,0,0,0,0,0]}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(PT))}catch(e){}};
setInterval(save,3000);addEventListener('pagehide',save);
const dgOwn=()=>{try{return JSON.parse(localStorage.getItem(DGK)||'{}')||{}}catch(e){return{}}};
const TIERS=[['dinh',3,'Định Hoàng Thiên Tướng'],['thi',10,'Song Hoàng Thiên Tướng'],['tinh',20,'Tam Hoàng Thiên Tướng'],['viem',25,'Viêm Đế Thiên Tướng'],['hon',35,'Hỗn Độn Thiên Tướng'],['xv',50,'Xi Vưu Thiên Tướng']];
const unl=i=>!!PT.beat[TIERS[i][0]];
const chain=()=>{let n=0;while(n<6&&unl(n)&&PT.tt[n])n++;return n};
const ttMul=()=>{const n=chain();return n?TIERS[n-1][1]:1};
const own=()=>P.sw==4,skinOn=()=>!!(PT.up&&PT.skin),useTT=()=>own();
const PW=()=>{let m=own()?(skinOn()?1500:100):1;if(PT.np)m*=40;if(PT.ngoc.dinh)m*=1.5;if(PT.ngoc.thi)m*=2;if(PT.ngoc.tinh)m*=6;m*=ttMul();if(P.kh>0&&PT.kh)m*=1e6;return m};

if(STYLES.length<6){STYLES.push('Chung Yên Kiếm Pháp');STCOL.push(RED)}
STYLES.push('Phượng Tước Kiếm Pháp','Nhất Vương Tài Quyết Lục');STCOL.push(0xff3a1a,0xdcdcf0);
if(SWORDS.length<4)SWORDS.push(['Thiên Mệnh Kiếm — Dung Hợp Chung Yên (Chung Yên)',1.7]);
SWORDS.push(['Kiếm Phượng Tước (Phượng Tước)',1.7]);
const U=k=>()=>!!PT.beat[k];
SK[6]={
 z:{n:'Đệ Nhất Thức: Đoạn Linh Tiêu',cd:540,sta:25,sp:'pt1',pt:U('dinh')},
 x:{n:'Đệ Nhị Thức: Di Tinh Đầu',cd:600,sta:25,sp:'pt2',pt:U('thi')},
 c:{n:'Đệ Tam Thức: Mẫn Vạn Tượng',cd:660,sta:30,sp:'pt3',pt:U('tinh')},
 v:{n:'Đệ Tứ Thức: Sí Sơn Hà',cd:720,sta:30,sp:'pt4',pt:U('viem')},
 b:{n:'Đệ Ngũ Thức: Dung Vạn Hắc - Truyền Tân Hỏa',cd:780,sta:35,sp:'pt5',pt:U('viem')},
 n:{n:'Chung Chương: Nguyên Phượng Thiên Giáng',cd:1200,sta:50,sp:'pt6',pt:U('xv')}};
SK[7]={
 z:{n:'Khúc Chung Trảm',cd:900,sta:40,sp:'pt7',pt:U('hon')},
 x:{n:'Chúng Sinh Bình Giới Điệu',cd:1000,sta:45,sp:'pt8',pt:U('hon')}};

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
function phoenixBig(){
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
const flapBig=(g,T,sp)=>{if(!g||!g.userData.wings)return;g.userData.wings.forEach(([w,s])=>{w.rotation.y=s*Math.sin(T*(sp||3))*.3})};

let org=null,phx=null,applied=false,blk=false,stab=0,stabOn=false;
const BM=mat(0x060608,.6);
function swordVis(){
 if(own()){const up=skinOn();if(!org)org=[PA.sb.material.color.getHex(),PA.sg.material.color.getHex()];
  PA.sb.material.color.setHex(up?WHT:0xff2020);PA.sg.material.color.setHex(up?0xffe070:0xffb000);
  if(!phx){phx=phoenix(0xff3010,0xffb000);phx.scale.setScalar(.35);phx.position.set(0,.12,0);PA.sb.add(phx)}
  phx.userData.m1.color.setHex(up?0xffffff:0xff3010);phx.userData.m2.color.setHex(up?0xffe070:0xffb000);applied=true}
 else if(applied){applied=false;if(org){PA.sb.material.color.setHex(org[0]);PA.sg.material.color.setHex(org[1])}if(phx){PA.sb.remove(phx);freeObj(phx);phx=null}}
 const want=P.sty>=6&&P.kh>0&&!!PT.kh;
 if(want!==blk){blk=want;S.kh.traverse(c=>{if(c.isMesh){if(!c.userData.pm)c.userData.pm=c.material;c.material=want?BM:c.userData.pm}})}
 if(stab&&!stabOn){stabOn=true;PA.sb.visible=false;PA.sg.visible=false}
 else if(!stab&&stabOn){stabOn=false;PA.sb.visible=true;PA.sg.visible=true}
 if(stab)PA.aR.rotation.x=PA.aL.rotation.x=-1.5}
const syncTTBtn=()=>{const b=bt.M2;if(!b||!useTT())return;const on=chain()>0;if(b.classList.contains('on')!==on)b.classList.toggle('on',on)};
{const rd=ren.render.bind(ren);ren.render=function(s,c){try{swordVis()}catch(e){}try{syncTTBtn()}catch(e){}return rd(s,c)}}

const basePopup=popup;
const fixHi=idx=>{const o=$('popts');if(!o)return;const n=o.children.length-1;[...o.children].forEach((b,i)=>{if(i<n)b.className=i==idx?'on':''})};
const ptOnly=()=>MAP=='pt'&&ptMap>=2;
popup=function(title,opts,cur,fn){
 if(title=='Chọn kiếm'){
  const dg=dgOwn(),vis=[];opts.forEach((s,i)=>{if(ptOnly()&&i!=4)return;if(i==3&&!dg.fused)return;if(i==4&&!PT.sword)return;vis.push(i)});
  const f=fn,full=(dg.fused&&dg.eq)?3:P.sw;opts=vis.map(i=>opts[i]);fn=j=>f(vis[j]);
  const r=basePopup(title,opts,cur,fn);fixHi(vis.indexOf(full));return r}
 if(title=='Chọn kiếm pháp'){
  const dg=dgOwn(),vis=[];STYLES.forEach((s,i)=>{if(ptOnly()&&i<6)return;if(i==5&&!dg.style)return;if(i==6&&!own())return;if(i==7&&(!own()||!PT.beat.hon))return;vis.push(i)});
  const f=fn;opts=vis.map(i=>STYLES[i]);cur=vis.indexOf(cur);fn=j=>f(vis[j])}
 return basePopup(title,opts,cur,fn)};

const baseDmg=dmgMul;dmgMul=function(){let m=baseDmg();if(P.sty>=6)m*=PW();return m};
const baseCost=costMul;costMul=function(){const c=baseCost();if(P.sty<6)return c;const k=own()?(skinOn()?0:.2):1;return{cd:c.cd*k*(P.kh>0&&PT.kh?.5:1),st:c.st*k}};
const baseCast=cast;cast=function(k){const sp=SK[P.sty]&&SK[P.sty][k.toLowerCase()];if(sp&&sp.pt&&!sp.pt())return toast('Chưa mở khóa — hạ boss trong phó bản Phượng Tước');return baseCast(k)};
const baseBuff=buff;buff=function(k){if(P.sty>=6){if(k.toUpperCase()=='R')toggleKH();return}return baseBuff(k)};
const baseSync=syncRT;syncRT=function(){const k=P.kh;baseSync();if(P.sty>=6&&PT.kh)P.kh=k};
function toggleKH(){
 if(!PT.kh)return toast('Chưa có Kiếm Hồn Nhất Vương — hạ Xi Vưu (Map 3)');
 P.kh=P.kh?0:1;say('Kiếm Hồn Nhất Vương — '+(P.kh?'BẬT':'TẮT'),1000);if(P.kh)flash(0x202020)}
const baseLaw=lawMenu;lawMenu=function(){if(useTT())return ttMenu();return baseLaw()};
function ttMenu(){
 if(castBusy())return;
 dialog('Thiên Tướng (bật/tắt, cộng dồn theo thứ tự)',TIERS.map((t,i)=>t[2]+' x'+t[1]+(unl(i)?(PT.tt[i]?' [BẬT]':' [TẮT]'):' [KHÓA]')),i=>{
  if(!unl(i))return toast('Chưa mở khóa — hạ '+BD[ORDER[i]].n);
  PT.tt[i]=PT.tt[i]?0:1;save();const n=chain();say(n?TIERS[n-1][2]+' — x'+TIERS[n-1][1]+' sức mạnh':'Tắt Thiên Tướng',1600);if(n)flash(GLD)})}

const baseBuild=buildBtns;let xb={};
buildBtns=function(){
 baseBuild();xb={};
 const bot=$('btns');
 if(useTT()&&bt.M2){bt.M2.innerHTML='<b>TT</b><i>Thiên Tướng</i>'}
 if(P.sty>=6&&PT.kh){const b=document.createElement('button');b.innerHTML='<b>R</b><i>Hồn Nhất Vương</i>';b.className='rt rR';b.addEventListener('pointerdown',e=>{e.preventDefault();toggleKH()});bot.appendChild(b);bt.R=b}
 if(own()&&P.sty>=6&&PT.bone){
  const mk2=(l,n,i)=>{const b=document.createElement('button');b.innerHTML='<b>'+l+'</b><i>'+n+'</i>';b.className='rt '+(i?'rU':'rT');b.style.borderColor='#ff8a1a';b.style.background='rgba(130,55,0,.88)';b.style.color='#ffd0a0';b.addEventListener('pointerdown',e=>{e.preventDefault();castBone(i)});bot.appendChild(b);return b};
  xb.v1=mk2('K','Cận Kiến',0);xb.v2=mk2('L','Quy Nhất',1)}
 placeCols()};
addEventListener('keydown',e=>{
 if(e.repeat||P.sty<6)return;const t=e.target;if(t&&(t.tagName=='INPUT'||t.tagName=='TEXTAREA'))return;
 if(e.code=='KeyK'||e.code=='KeyL'){e.stopImmediatePropagation();castBone(e.code=='KeyK'?0:1)}
 else if(e.code=='KeyG'){e.stopImmediatePropagation();ttMenu()}},true);

const drop=g=>{scene.remove(g);freeObj(g)};
const disc=(x,z,r,c,o)=>{const m=new THREE.Mesh(G('PTD',()=>new THREE.CircleGeometry(1,40)),mat(c,o));m.rotation.x=-Math.PI/2;m.position.set(x,.14,z);m.scale.setScalar(r);return m};
const warn=(x,z,r,sec)=>{const d=disc(x,z,r,RED,.2);add(d,Math.round(sec*60),(f,t)=>{d.material.opacity=.12+.3*t})};
const burst=(x,z,r,c)=>{const o=new THREE.Mesh(G('PTR',()=>new THREE.RingGeometry(.9,1,40)),mat(c,.9));o.rotation.x=-Math.PI/2;o.position.set(x,.16,z);add(o,27,(f,t)=>{o.scale.setScalar(r*(.3+t*.7));o.material.opacity=.9*(1-t)})};
const mkSword=(col,sc)=>{const g=new THREE.Group(),b=new THREE.Mesh(G('PTSB',()=>new THREE.BoxGeometry(.5,.15,7)),mat(col,.95)),gd=new THREE.Mesh(G('PTSG',()=>new THREE.BoxGeometry(2,.22,.3)),mat(GLD,.95));b.position.z=3.6;gd.position.z=.2;g.add(b,gd);g.scale.setScalar(sc);scene.add(g);return g};
async function fling(col,sc,x0,y0,z0,x1,y1,z1,n){const s=mkSword(col,sc);for(let f=0;f<=n;f++){const k=f/n,e=k*k;s.position.set(x0+(x1-x0)*e,y0+(y1-y0)*e,z0+(z1-z0)*e);s.lookAt(x1,y1,z1);await wait(1)}drop(s)}
function boom(x,z,r,col,d,kb){FXK('boom',{x,z,r,col});FXK('ring',{r:r*1.4,life:40,col:WHT});flash(col);shake=Math.max(shake,Math.min(60,r/2));if(d)hit(x,z,r,d*3,kb||3)}
function stunAt(x,z,r,sec){enemies.forEach(e=>{if(hyp(e.m.position.x-x,e.m.position.z-z)<r){if(e.dummy)e.stun=Math.max(e.stun||0,sec);else e.cd=Math.max(e.cd,sec)}})}
function mandala(){
 const g=new THREE.Group(),rs=[];
 for(let i=0;i<10;i++){const m=new THREE.Mesh(G('PTR2',()=>new THREE.RingGeometry(.9,1,48)),mat(i&1?0xff9a20:GLD,.85));m.scale.setScalar(5+i*2.4);m.position.z=-i*.12;g.add(m);rs.push([m,i&1?-.02:.015])}
 scene.add(g);return{g,rs}}

async function s1(){
 const[tx,tz]=target();say('Phượng Tước Kiếm Pháp — Đệ Nhất Thức',1000);FXK('ring',{r:10,life:30,col:RED});await wait(26);
 say('Đoạn Linh Tiêu — Trấn Tinh Hà!',1500);const p=pl();
 await fling(RED,4,p.x,26,p.z,tx,0,tz,26);
 boom(tx,tz,60,RED,1e14)}
async function s2(){
 const[tx,tz]=target();say('Phượng Tước Kiếm Pháp — Đệ Nhị Thức',1000);await wait(16);say('Di Tinh Đầu — Chuyển Tuế Hoa!',1500);
 for(let i=0;i<16;i++){const a=i*.8;FXK('slash',{x:tx+Math.cos(a)*5,z:tz+Math.sin(a)*5,r:8,col:i&1?RED:GLD});hit(tx,tz,10,4e12*3,.4);shake=Math.max(shake,4);await wait(3)}
 const p=pl();await fling(RED,4,p.x,26,p.z,tx,0,tz,20);hit(tx,tz,60,1.5e14*3,3)}
async function s3(){
 const p=pl(),F=nearFoe(p.x,p.z),fe=F&&F.d<60?F.e:null,pos=()=>fe&&fe.hp>0?[fe.m.position.x,fe.m.position.z]:null;
 const[tx,tz]=pos()||target(),a=Math.atan2(tx-p.x,tz-p.z);say('Phượng Tước Kiếm Pháp — Đệ Tam Thức',1000);
 for(let i=0;i<12;i++){const b=a+Math.PI+(i-6)*.35,[cx,cz]=pos()||[tx,tz];FXK('slash',{x:cx+Math.sin(b)*4,z:cz+Math.cos(b)*4,r:7,col:i&1?RED:GLD});hit(cx,cz,12,4e12*3,.2);shake=Math.max(shake,3);await wait(3)}
 say('Mẫn Vạn Tượng — Khai Thiên Kỷ!',1600);stunAt(tx,tz,30,3);
 const sw=mkSword(RED,.38);
 const place=d=>{const[ex,ez]=pos()||[tx,tz],dx=ex-p.x,dz=ez-p.z,l=Math.hypot(dx,dz)||1,ux=dx/l,uz=dz/l;p.x=ex-ux*d;p.z=ez-uz*d;sw.position.set(p.x+ux*.6,p.y+1.3,p.z+uz*.6);sw.lookAt(ex,p.y+1.3,ez)};
 stab=1;
 try{
  for(let f=0;f<10;f++){const[ex,ez]=pos()||[tx,tz],l=Math.hypot(ex-p.x,ez-p.z);place(l>4.2?l-(l-4.2)/(10-f):l);await wait(1)}
  const reach=[4.2,3,1.5,1.5];
  for(let i=0;i<10;i++){for(let f=0;f<4;f++){place(reach[f]);if(f==2){const[ex,ez]=pos()||[tx,tz];FXK('slash',{x:ex+rnd()*2-1,z:ez+rnd()*2-1,r:6,col:i&1?RED:WHT});hit(ex,ez,12,8e12*3,.2);shake=Math.max(shake,5)}await wait(1)}}
  const[fx,fz]=pos()||[tx,tz];boom(fx,fz,55,RED,2.5e14)}
 finally{stab=0;drop(sw)}}
async function s4(){
 const[tx,tz]=target();say('Đệ Tứ Thức: Sí Sơn Hà — Phần Thương Vũ!',1600);
 for(let i=0;i<36;i++){FXK('slash',{x:tx+rnd()*14-7,z:tz+rnd()*14-7,r:4+rnd()*3,col:i&1?RED:GLD});hit(tx,tz,12,1.1e13*3,.2);shake=Math.max(shake,3);await wait(2)}}
async function s5(){
 const[tx,tz]=target();say('Đệ Ngũ Thức: Dung Vạn Hắc — Truyền Tân Hỏa!',1800);
 for(let i=0;i<10;i++){if(i&1){FXK('boom',{x:tx,z:tz,r:16,col:GLD});flash(RED);shake=Math.max(shake,10);hit(tx,tz,16,9e13*3,.6);await wait(8)}else{for(let j=0;j<4;j++){const a=(i*4+j)*.9;FXK('slash',{x:tx+Math.cos(a)*5,z:tz+Math.sin(a)*5,r:7,col:RED});hit(tx,tz,10,1e12*3,.2);await wait(2)}}}
 boom(tx,tz,30,GLD,0)}
async function s6(){
 const[tx,tz]=target(),p=pl();say('Phượng Tước Kiếm Pháp Chung Chương',1200);
 const md=mandala(),dx=Math.sin(yaw),dz=Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
 const sw=mkSword(GLD,2.4);let k0=0;
 const upd=()=>{md.g.position.set(p.x-dx*8,p.y+9,p.z-dz*8);md.g.lookAt(cam.position);md.g.scale.setScalar(Math.max(.01,k0));md.rs.forEach(([m,v])=>{m.rotation.z+=v})};
 try{
  for(let f=0;f<30;f++){k0=Math.sin((f+1)/30*Math.PI/2);upd();await wait(1)}
  say('Phụng Tước Bát Điểu, Chung Chương!',2000);FXK('ring',{r:20,life:40,col:GLD});
  for(let f=0;f<44;f++){const cx=p.x+dx*1.6,cy=p.y+2.3,cz=p.z+dz*1.6;sw.position.set(cx-rx*3,cy,cz-rz*3);sw.lookAt(cx+rx*10,cy,cz+rz*10);if(f%11==0)FXK('ring',{r:8+f/3,life:24,col:f&1?ORG:GLD});upd();await wait(1)}
  for(let f=0;f<18;f++){const k=(f+1)/18;sw.position.set(p.x+dx*1.6,p.y+2.3+k*2,p.z+dz*1.6);sw.lookAt(tx,0,tz);upd();await wait(1)}
  say('Nguyên Phượng Thiên Giáng — Vạn Quái Câu Tổn!',2000);
  const cols=[0xffd646,0xff7a1a,0xe8e8ff,0xff2a2a,0x303040,0x8a2be2,0xffa030],gs=[];
  cols.forEach((c,i)=>{const g=roblox({angry:1,skin:0xe8c8a0,shirt:c,pants:0x201018,sword:2});g.scale.setScalar(i==6?8:6);const a=i/7*6.283;g.position.set(tx+Math.cos(a)*10,70,tz+Math.sin(a)*10);scene.add(g);gs.push(g)});
  for(let f=0;f<30;f++){const k=f/29,e=k*k;gs.forEach(g=>{g.position.y=70*(1-e)});upd();await wait(1)}
  gs.forEach(drop);boom(tx,tz,90,GLD,8e14);FXK('boom',{x:tx,z:tz,r:60,col:RED});await wait(10)}
 finally{drop(sw);drop(md.g)}}
async function s7(){
 const[tx,tz]=target();say('Nhất Vương Tài Quyết Lục — Hoành Quán Vạn Cổ',2000);FXK('ring',{r:16,life:40,col:0xffffff});FXK('ring',{r:10,life:40,col:0x111111});await wait(50);
 say('Khúc Chung Trảm!',1600);FXK('sky',{col:0xffffff});FXK('sky',{col:0x111111});
 for(let i=0;i<8;i++){FXK('slash',{x:tx+rnd()*8-4,z:tz+rnd()*8-4,r:9,col:i&1?0x111111:WHT});await wait(2)}
 boom(tx,tz,110,WHT,5.5e14);FXK('boom',{x:tx,z:tz,r:70,col:0x111111});await wait(12)}
async function s8(){
 const[tx,tz]=target();say('Nhất Vương Tài Quyết Lục — Tung Hoành Thiên Hạ',2000);await wait(30);
 for(let i=0;i<12;i++){FXK('slash',{x:tx+rnd()*20-10,z:tz+rnd()*20-10,r:8,col:i&1?0x111111:WHT});await wait(1)}
 boom(tx,tz,45,WHT,2e14);await wait(14);
 say('Chúng Sinh Bình Giới Điệu!',1600);
 const s=mkSword(0xffffff,6);s.position.set(tx,40,tz);s.lookAt(tx,0,tz);
 for(let f=0;f<24;f++){s.position.y=40+f*.4;await wait(1)}
 for(let f=0;f<14;f++){const k=(f+1)/14;s.position.y=50*(1-k*k);await wait(1)}
 drop(s);boom(tx,tz,130,WHT,5e14);FXK('boom',{x:tx,z:tz,r:80,col:0x111111});await wait(12)}

let figs=[],figN=0;
const FCOL=[0xffd646,0xff7a1a,0xe8e8ff,0xff2a2a,0x303040,0x8a2be2];
function clearFigs(){figs.forEach(drop);figs=[];figN=0}
function syncFigs(){
 const n=useTT()?chain():0;if(n===figN)return;
 clearFigs();figN=n;
 for(let i=0;i<n;i++){const g=roblox({angry:1,skin:0xe8c8a0,shirt:FCOL[i],pants:0x201018,sword:2});g.scale.setScalar(2.4+(i>=3?.8:0));scene.add(g);figs.push(g)}}
function figsStep(T){const p=pl();figs.forEach((g,i)=>{const a=T*.8+i/figs.length*6.283;g.position.set(p.x+Math.cos(a)*7,0,p.z+Math.sin(a)*7);g.rotation.y=-a})}

const VQM=1e11,KM=1000,VIO=ORG,DARK=0xcc5500;
const LOW=!!window.LOW;
const foe=(d,x,z,r)=>{enemies.forEach(e=>{if(e.hp>0&&hyp(e.m.position.x-x,e.m.position.z-z)<r){e.hp-=d;e.hit=8}})};
const nearFoe=(x,z)=>{let b=null,bd=1e9;enemies.forEach(e=>{if(e.hp>0){const d=hyp(e.m.position.x-x,e.m.position.z-z);if(d<bd){bd=d;b=e}}});return b?{e:b,d:bd}:null};
const STUN=3;
function addStars(e){const g=new THREE.Group();for(let i=0;i<4;i++)g.add(new THREE.Mesh(G('PVSTR',()=>new THREE.SphereGeometry(.14,8,6)),new THREE.MeshBasicMaterial({color:0xffe14d})));g.position.y=2.9;e.m.add(g);e.stk=g}
function dropStars(e){if(!e.stk)return;e.m.remove(e.stk);e.stk.children.forEach(c=>c.material.dispose());e.stk=null}
function stunFoe(e,sec){if(e.hp<=0)return;if(!e.dummy){e.dummy=1;e.sk=1;e.wind=0}if(!e.stars&&!e.stk)addStars(e);e.stunT=Math.max(e.stunT||0,sec)}
const stunV=(x,z,r,sec)=>{enemies.forEach(e=>{if(hyp(e.m.position.x-x,e.m.position.z-z)<r)stunFoe(e,sec)})};
function stunStep(dt,T){enemies.forEach(e=>{if(!(e.stunT>0))return;e.stunT-=dt;if(e.stk)e.stk.children.forEach((s,i)=>{const a=T*3+i*1.57;s.position.set(Math.cos(a)*.7,Math.sin(T*5+i)*.08,Math.sin(a)*.7)});if(e.stunT<=0||e.hp<=0){e.stunT=0;if(e.sk){e.sk=0;e.dummy=0;e.cd=Math.max(e.cd,.6)}dropStars(e)}})}
let army=null,giant=null;
function canKien(){
 endArmy(false);const[tx,tz]=target(),n=10000;
 FXK('hole',{x:tx,z:tz,r:6,col:VIO});flash(VIO);
 const ox=new Float32Array(n),oz=new Float32Array(n),ph=new Float32Array(n),pos=new Float32Array(n*3),cols=new Float32Array(n*3);
 for(let i=0;i<n;i++){const c=i%2?[1,.54,.1]:[.8,.33,0];cols.set(c,i*3)}
 for(let i=0;i<n;i++){const r=Math.sqrt(Math.random())*22,a=Math.random()*6.283;ox[i]=Math.cos(a)*r;oz[i]=Math.sin(a)*r;ph[i]=Math.random()*6.283}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(cols,3));
 const pts=new THREE.Points(geo,new THREE.PointsMaterial({vertexColors:true,size:1.2,transparent:true,opacity:.9,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);
 const figsA=[];for(let i=0;i<(LOW?8:18);i++){const f=roblox({angry:1,skin:0xffa040,shirt:0x502000,pants:0x201000});f.scale.setScalar(1.8);scene.add(f);figsA.push(f)}
 army={x:tx,z:tz,n,n0:LOW?3000:n,t:0,life:25,acc:0,ox,oz,ph,pos,geo,pts,figs:figsA}}
function armyStep(dt,T){
 const a=army;if(!a)return;
 a.t+=dt;const f=nearFoe(a.x,a.z),q=pl(),tx=f?f.e.m.position.x:q.x+8,tz=f?f.e.m.position.z:q.z+8,d=hyp(tx-a.x,tz-a.z);
 if(d>(f?9:2)){const s=Math.min(d,16*dt);a.x+=(tx-a.x)/d*s;a.z+=(tz-a.z)/d*s}
 if(f){stunV(a.x,a.z,90,STUN);foe(a.n*1e6*VQM*2*KM*dt,a.x,a.z,90)}
 for(let i=0;i<a.n0;i++){const j=i*3;a.pos[j]=a.x+a.ox[i]+Math.sin(T*3+a.ph[i])*.6;a.pos[j+1]=.5+Math.abs(Math.sin(T*6+a.ph[i]))*.8;a.pos[j+2]=a.z+a.oz[i]+Math.cos(T*3+a.ph[i])*.6}
 a.geo.attributes.position.needsUpdate=true;a.geo.setDrawRange(0,Math.max(1,Math.min(a.n0,Math.ceil(a.n))));
 a.figs.forEach((f2,i)=>{const an=i*.349+T*.5,w=Math.sin(T*10+i);f2.position.set(a.x+Math.cos(an)*(6+i%3*4),0,a.z+Math.sin(an)*(6+i%3*4));f2.rotation.y=Math.atan2(tx-f2.position.x,tz-f2.position.z);const u=f2.userData;u.lL.rotation.x=w*.7;u.lR.rotation.x=-w*.7;u.aL.rotation.x=u.aR.rotation.x=-1.4+w*.3})}
function endArmy(ex){
 const a=army;if(!a)return;army=null;
 if(ex&&a.n>0){stunV(a.x,a.z,140,STUN);foe(a.n*1e8*VQM*KM,a.x,a.z,140);FXK('boom',{x:a.x,z:a.z,r:24,col:VIO});FXK('boom',{x:a.x,z:a.z,r:18,col:DARK});flash(VIO);shake=Math.max(shake,18)}
 scene.remove(a.pts);a.geo.dispose();a.pts.material.dispose();a.figs.forEach(f=>{scene.remove(f);freeObj(f)})}
function quyNhat(){
 const[tx,tz]=target(),a=army||{x:tx,z:tz};endArmy(false);
 const g=roblox({angry:1,skin:0xffa040,shirt:0x502000,pants:0x201000,sword:2});g.scale.setScalar(9);g.position.set(a.x,0,a.z);scene.add(g);
 giant={g,x:a.x,z:a.z,hp:1e5,t:0,life:14,acc:0};FXK('ring',{r:20,life:30,col:VIO});FXK('ring',{r:14,life:30,col:DARK});flash(VIO);shake=Math.max(shake,12)}
function giantStep(dt,T){
 const g=giant;if(!g)return;
 g.t+=dt;const f=nearFoe(g.x,g.z),q=pl(),tx=f?f.e.m.position.x:q.x,tz=f?f.e.m.position.z:q.z,d=hyp(tx-g.x,tz-g.z);
 if(d>10){const s=Math.min(d,28*dt);g.x+=(tx-g.x)/d*s;g.z+=(tz-g.z)/d*s}
 if(f){stunV(g.x,g.z,22,STUN);foe(1e8*VQM*20*KM*dt,g.x,g.z,22)}
 g.g.position.set(g.x,0,g.z);g.g.rotation.y=Math.atan2(tx-g.x,tz-g.z);
 const u=g.g.userData,w=Math.sin(T*10);u.aL.rotation.x=u.aR.rotation.x=-1.4+w*.3;u.lL.rotation.x=w*.6;u.lR.rotation.x=-w*.6}
function endGiant(ex){
 const g=giant;if(!g)return;giant=null;
 if(ex){stunV(g.x,g.z,150,STUN);foe(1e11*VQM*KM,g.x,g.z,150);FXK('boom',{x:g.x,z:g.z,r:30,col:VIO});FXK('boom',{x:g.x,z:g.z,r:22,col:DARK});flash(VIO);shake=Math.max(shake,22)}
 scene.remove(g.g);freeObj(g.g)}
function armyHit(x,z,r,d){
 const w=Math.ceil(d*80)*1e8*VQM*KM;
 if(army&&hyp(army.x-x,army.z-z)<r+22)foe(w,army.x,army.z,120);
 if(giant&&hyp(giant.x-x,giant.z-z)<r+8)foe(w,giant.x,giant.z,120)}
const BONE=[{n:'Vạn Quái Cận Kiến',cd:30,sta:40,fn:canKien},{n:'Vạn Quái Quy Nhất',cd:20,sta:40,fn:quyNhat}];
function castBone(i){
 if(paused||P.block||P.lk>0||P.sty<6||!own())return;
 if(!PT.bone)return toast('Chưa mở khóa — hạ Xi Vưu (Map 3) để mở Vạn Quái');
 if(i==0&&army)return endArmy(true);
 if(i==1&&giant)return endGiant(true);
 const s=BONE[i],ck='pvq'+i;if(P.cd[ck]>0)return;
 const cm=costMul(),sc=s.sta*cm.st;if(!(P.nost>0)){if(P.st<sc)return toast('Thiếu thể lực');P.st-=sc}
 P.cd[ck]=s.cd*cm.cd;say(s.n,1500);s.fn()}
function xbUpdate(){
 [['v1','pvq0','K'],['v2','pvq1','L']].forEach(([k,ck,l])=>{const b=xb[k];if(!b)return;const c=P.cd[ck]||0,tx=c>0?(c>=10?Math.ceil(c):c.toFixed(1)):l;b.classList.toggle('cd',c>0);if(b.firstChild.textContent!==tx)b.firstChild.textContent=tx})}

const SKL={pt1:[s1,24],pt2:[s2,24],pt3:[s3,0],pt4:[s4,0],pt5:[s5,0],pt6:[s6,22],pt7:[s7,28],pt8:[s8,22]};
async function exec(f,fly){P.busy++;P.lk++;if(fly){P.flyN++;P.flyH=fly}try{await f()}catch(e){console.error(e)}finally{P.busy--;P.lk--;if(fly){P.flyN--;P.fly=Math.max(P.fly,25)}}}
const baseRun=run;run=function(sp,k0){const d=sp&&sp.sp&&SKL[sp.sp];if(!d)return baseRun(sp,k0);return exec(d[0],d[1])};

const BD={
 dinh:{n:'Định Vương',hp:1e10,c:0xc9a227,sc:3.6,k:300},
 thi:{n:'Thí Vương',hp:1.5e10,c:0x6a1a8a,sc:3.8,k:350},
 tinh:{n:'Tĩnh Vương',hp:2.5e10,c:0x1a6a8a,sc:4,k:400},
 viem:{n:'Viêm Đế',hp:5e10,c:0xd04010,sc:4.2,k:450},
 hon:{n:'Hỗn Độn',hp:6e10,c:0x202030,sc:4.4,k:500},
 xv:{n:'Xi Vưu',hp:1e11,c:0x7a0a14,sc:4.8,k:600},
 np:{n:'Nguyên Phượng',hp:1e11,c:0xffa030,sc:5.4,k:1000}};
const ORDER=['dinh','thi','tinh','viem','hon','xv'];
let PB=null;
const bpos=()=>PB.e.m.position;
const harm=d=>{if(PB&&P.hp>0)hurt(d*PB.d.k)};
const inR=(x,z,r)=>{const q=pl();return q.y<3.5&&hyp(q.x-x,q.z-z)<r};
const later=(s,f)=>PB.q.push({t:s,fn:f});
const armA=(a,ms)=>{PB.arm=a;PB.armT=now()+ms};
const ATT={
 cleave(){const p=bpos(),x=p.x,z=p.z;PB.busy=2.1;armA(-2.9,1200);warn(x,z,8,1.2);later(1.2,()=>{armA(.3,300);burst(x,z,8,GLD);shake=Math.max(shake,8);if(inR(x,z,8))harm(22);armyHit(x,z,8,22)})},
 rain(){PB.busy=3;armA(-2.9,1500);for(let i=0;i<12;i++)later(i*.12,()=>{const q=pl(),a=rnd()*6.283,r=rnd()*14,x=q.x+Math.cos(a)*r,z=q.z+Math.sin(a)*r;warn(x,z,2.4,1.4);later(1.4,()=>{FXK('blade',{x,z,col:RED});if(inR(x,z,2.4))harm(14);armyHit(x,z,2.4,14)})})},
 nova(){const p=bpos(),x=p.x,z=p.z,r=17;PB.busy=3.4;armA(-3,2600);say(PB.d.n+' — Bạo Kích!',1200);warn(x,z,r,2.5);later(2.5,()=>{armA(.3,300);burst(x,z,r,RED);flash(GLD);shake=Math.max(shake,14);if(inR(x,z,r))harm(36);armyHit(x,z,r,36)})},
 dash(){const p=bpos(),x=p.x,z=p.z,q=pl(),a=Math.atan2(q.x-x,q.z-z),d=Math.min(36,hyp(q.x-x,q.z-z));PB.busy=2.4;armA(-2.9,1000);later(1,()=>{PB.rush={t:.3,vx:Math.sin(a)*d/.3,vz:Math.cos(a)*d/.3};later(.35,()=>{const e=bpos();burst(e.x,e.z,6,GLD);if(inR(e.x,e.z,6))harm(24);armyHit(e.x,e.z,6,24)})})},
 swoop(){const q=pl(),x=q.x,z=q.z;PB.busy=3.4;PB.fy=30;say('Nguyên Phượng — Lăng Không Hạ Sát!',1400);warn(x,z,10,1.7);later(1.7,()=>{const b=bpos();PB.fy=1;PB.rush={t:.25,vx:(x-b.x)/.25,vz:(z-b.z)/.25};later(.3,()=>{FXK('boom',{x,z,r:11,col:ORG});burst(x,z,11,GLD);flash(ORG);shake=Math.max(shake,16);if(inR(x,z,11))harm(30);armyHit(x,z,11,30);PB.fy=10})})},
 fire(){PB.busy=3.8;PB.fy=14;say('Nguyên Phượng — Hỏa Vũ Thiên Giáng!',1400);for(let i=0;i<24;i++)later(i*.1,()=>{const q=pl(),a=rnd()*6.283,r=rnd()*16,x=q.x+Math.cos(a)*r,z=q.z+Math.sin(a)*r;warn(x,z,3,1);later(1,()=>{FXK('blade',{x,z,col:ORG});FXK('boom',{x,z,r:3,col:ORG});if(inR(x,z,3))harm(10);armyHit(x,z,3,10)})});later(3.6,()=>{PB.fy=10})},
 gale(){const p=bpos(),x=p.x,z=p.z,r=28;PB.busy=3.6;PB.fy=16;say('Nguyên Phượng — Phong Bạo Triển Dực!',1400);warn(x,z,r,2.6);later(2.6,()=>{burst(x,z,r,ORG);burst(x,z,r*.6,GLD);flash(GLD);shake=Math.max(shake,18);if(inR(x,z,r))harm(45);armyHit(x,z,r,45);PB.fy=10})}};
function startBoss(key){
 if(PB)return toast('Đang giao chiến');
 const d=BD[key],ms=[];let g;
 if(key=='np'){g=phoenixBig();g.scale.setScalar(4.2);g.position.set(0,10,-34)}
 else{g=roblox({skin:0xe8c8a0,shirt:d.c,pants:0x16080c,sword:2.2});g.scale.setScalar(d.sc);g.position.set(0,0,-34);
  g.traverse(c=>{if(c.isMesh)(Array.isArray(c.material)?c.material:[c.material]).forEach(x=>{if(x.emissive&&!ms.includes(x))ms.push(x)})})}
 scene.add(g);const e={m:g,ms,hp:d.hp,max:d.hp,lh:d.hp,hit:0,cd:99,wind:0,ph:0,dummy:1};enemies.push(e);
 PB={e,d,key,cd:2.2,busy:0,q:[],ph:0,arm:0,armT:0,rush:null,fy:10,rage:0};say(d.n+' xuất hiện!',2200);flash(RED);shake=Math.max(shake,12)}
function reward(k){
 const f=!PT.beat[k];let m='';
 if(k=='np'){if(!PT.np){PT.np=1;m+='+x40 sức mạnh cho 2 bộ chiêu. '}if(rnd()<.4){PT.ngoc.np++;m+='Nhận Ngọc Nguyên Phượng! '}if(!m)m='Không rớt Ngọc Nguyên Phượng lần này.'}
 else if(f){PT.beat[k]=1;
  if(k=='dinh'){PT.ngoc.dinh=1;m='Ngọc Định Vương (x1,5), Đệ Nhất Thức, Định Hoàng Thiên Tướng (x3)'}
  else if(k=='thi'){PT.ngoc.thi=1;m='Ngọc Thí Vương (x2), Đệ Nhị Thức, Song Hoàng Thiên Tướng (x10)'}
  else if(k=='tinh'){PT.ngoc.tinh=1;m='Ngọc Tĩnh Vương (x6), Đệ Tam Thức, Tam Hoàng Thiên Tướng (x20)'}
  else if(k=='viem'){PT.ngoc.viem+=2;m='2 Ngọc Viêm Đế, Đệ Tứ + Đệ Ngũ Thức, Viêm Đế Thiên Tướng (x25)'}
  else if(k=='hon'){PT.ngoc.hon+=2;m='2 Ngọc Hỗn Độn, Nhất Vương Tài Quyết Lục, Hỗn Độn Thiên Tướng (x35)'}
  else{PT.core++;PT.lkh++;PT.kh=1;PT.bone=1;PT.xuong+=1e6;m='1 Lõi Sức Mạnh, 1 Lõi Kiếm Hồn (Kiếm Hồn Nhất Vương, nút R), 1.000.000 xương cá, Vạn Quái cam x1.000 (K, L), Xi Vưu Thiên Tướng (x50)'}}
 else m='Đã nhận thưởng lần đầu';
 save();buildBtns();say('Chiến thắng! '+m,5200);flash(GLD)}
function bossWin(){const k=PB.key;scene.remove(PB.e.m);freeObj(PB.e.m);enemies=enemies.filter(x=>x!==PB.e);PB=null;reward(k)}
function bossStep(dt,T){
 const e=PB.e,g=e.m,p=g.position,q=pl(),u=g.userData,f2=PB.key=='np';
 if(e.hp<=0||!enemies.includes(e))return bossWin();
 const tp=Math.atan2(q.x-p.x,q.z-p.z);g.rotation.y=tp;
 if(e.stun>0)e.stun-=dt;
 const bdt=(e.stun>0||e.stunT>0||P.tf>0||P.dom5>0||P.ap>0)?0:dt;
 const rage=f2&&e.hp<e.max*.5;
 if(rage&&!PB.rage){PB.rage=1;say('Nguyên Phượng — Hóa Cuồng!',2200);flash(ORG);shake=Math.max(shake,16);FXK('ring',{r:30,life:40,col:ORG})}
 if(bdt>0){
  if(f2)p.y+=(PB.fy+Math.sin(T*2)*1.2-p.y)*Math.min(1,bdt*(PB.rush?14:3));
  if(PB.rush){p.x+=PB.rush.vx*bdt;p.z+=PB.rush.vz*bdt;PB.rush.t-=bdt;if(PB.rush.t<=0)PB.rush=null}
  else if(PB.busy<=0){const d=hyp(q.x-p.x,q.z-p.z);if(d>10){const s=(f2?(rage?12:8):5.5)*bdt;p.x+=Math.sin(tp)*s;p.z+=Math.cos(tp)*s;PB.ph+=bdt*7}}
  const r=hyp(p.x,p.z);if(r>90){p.x*=90/r;p.z*=90/r}
  const old=PB.q;PB.q=[];old.forEach(a=>{a.t-=bdt;if(a.t<=0)a.fn();else PB.q.push(a)});
  PB.busy-=bdt;PB.cd-=bdt;
  if(PB.busy<=0&&PB.cd<=0){const pool=f2?(rage?['cleave','rain','nova','swoop','swoop','fire','fire','gale']:['cleave','rain','nova','dash','swoop','fire']):['cleave','cleave','rain','nova','dash'];ATT[pool[rnd()*pool.length|0]]();PB.cd=f2?(rage?.45:.8):1.5}}
 if(u.aL){const a=PB.armT>now()?PB.arm:-.9+Math.sin(T*2)*.12;u.aL.rotation.x=a;u.aR.rotation.x=a;u.lL.rotation.x=Math.sin(PB.ph)*.6;u.lR.rotation.x=-Math.sin(PB.ph)*.6}
 if(f2)flapBig(g,T,rage?5:3);
 $('ptBossN').textContent=PB.d.n.toUpperCase()+(rage?' — HÓA CUỒNG':'');
 $('ptBar').style.setProperty('--p',(Math.max(0,Math.min(1,e.hp/e.max))*100).toFixed(1)+'%');
 $('ptBossT').textContent=fmtB(Math.max(0,e.hp))+' / '+fmtB(e.max)}

const Q1N=1000,Q1HP=1e4,Q1T=600;
let Q=null;
function q1Start(){if(Q)return;Q={t:Q1T,n:0,cur:null,gap:0,x:null,z:null};say('Nhiệm vụ: diệt 1 con quái '+Q1N.toLocaleString('vi-VN')+' dạng (mỗi dạng '+Q1HP.toLocaleString('vi-VN')+' máu) trong '+Q1T/60+' phút!',3000);flash(RED)}
function q1End(){if(Q&&Q.cur&&enemies.includes(Q.cur)){scene.remove(Q.cur.m);freeObj(Q.cur.m);enemies=enemies.filter(x=>x!==Q.cur)}Q=null}
function q1Form(){
 const{m,ms}=mkEnemy(),q=pl(),n=Q.n;let x,z;
 if(Q.x==null){const a=rnd()*6.283,r=12+rnd()*6;x=q.x+Math.cos(a)*r;z=q.z+Math.sin(a)*r}else{x=Q.x;z=Q.z}
 m.position.set(x,0,z);m.scale.setScalar(1.15+(n%7)*.1);
 const sh=m.children[0];if(sh&&sh.material&&sh.material.color)sh.material.color.setHSL((n*.0618)%1,.75,.42);
 scene.add(m);const e={m,ms,hp:Q1HP,lh:Q1HP,hit:0,cd:.6,wind:0,ph:rnd()*6};enemies.push(e);Q.cur=e;FXK('ring',{r:4,life:16,col:n%2?GLD:RED})}
function q1Step(dt){
 Q.t-=dt;
 if(Q.t<=0){q1End();say('Nhiệm vụ thất bại: hết '+Q1T/60+' phút',3000);return}
 if(!Q.cur){Q.gap-=dt;if(Q.gap<=0)q1Form()}
 else if(Q.cur.hp<=0||!enemies.includes(Q.cur)){
  Q.x=Q.cur.m.position.x;Q.z=Q.cur.m.position.z;Q.n++;Q.cur=null;Q.gap=.05;
  if(Q.n%100==0&&Q.n<Q1N)say('Dạng '+Q.n+'/'+Q1N,1000);
  if(Q.n>=Q1N){Q=null;if(!PT.sword){PT.sword=1;P.sw=4;syncRT();buildBtns();save();say('Hoàn thành! Nhận Kiếm Phượng Tước (x100 sức mạnh, -80% hồi chiêu & thể lực)',5000);flash(RED)}else say('Hoàn thành nhiệm vụ!',2500)}}}

let world=null,npcs=[],near=null,ptMap=0,prev='main';
function npc(label,shirt,x,z,fn){
 const g=roblox({skin:0xf0d4b0,shirt,pants:0x1a1020,sword:1.4});g.scale.setScalar(1.7);g.position.set(x,0,z);
 const c=document.createElement('canvas');c.width=512;c.height=96;const t=c.getContext('2d');t.font='bold 40px "Courier New",monospace';t.textAlign='center';t.lineWidth=6;t.strokeStyle='#000';t.strokeText(label,256,60);t.fillStyle='#ffd646';t.fillText(label,256,60);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,fog:false}));sp.scale.set(5.2,.98,1);sp.position.y=3.5;sp.renderOrder=20;g.add(sp);scene.add(g);
 return{g,sp,fn,x,z}}
function clearNpcs(){npcs.forEach(n=>{scene.remove(n.g);n.sp.material.map.dispose();n.sp.material.dispose();freeObj(n.g)});npcs=[];near=null}
function buildNpcs(){
 clearNpcs();npcs.push(npc('Người Chuyển Đổi',0x1a4a8a,-10,-8,convMenu));npcs.push(npc('Đổi Skin Kiếm',0xc0a030,38,16,skinMenu));
 if(ptMap==1)npcs.push(npc('Lấy Kiếm Phượng Tước',0xaa2222,10,-8,q1Menu));
 if(ptMap==2){npcs.push(npc('Nguyên Phượng',0xd07010,10,-8,()=>startBoss('np')));npcs.push(npc('Người Đổi Đồ',0xc0a030,0,-14,swapMenu))}
 if(ptMap==3)npcs.push(npc('Khiêu Chiến Vương',0x7a0a14,10,-8,bossMenu))}
const dialog=(title,opts,fn)=>{popup(title,opts,-1,fn);const o=$('popts');o.lastChild.textContent='Hủy Popup';o.style.pointerEvents='none';setTimeout(()=>{o.style.pointerEvents=''},450)};
function endAll(){if(PB){scene.remove(PB.e.m);freeObj(PB.e.m);enemies=enemies.filter(x=>x!==PB.e);PB=null}q1End()}
function enforcePT(){
 if(P.sw!=4)P.sw=4;
 if(P.sty<6)setStyle(6);
 else if(P.sw!=4)buildBtns()}
function goMap(n){
 if(PB)return toast('Đang giao chiến boss');
 if(n>=2&&!PT.sword)return toast('Cần có Kiếm Phượng Tước (Map 1) trước');
 endAll();ptMap=n;player.position.set(0,0,0);buildNpcs();
 if(n>=2){syncRT();enforcePT();buildBtns()}
 say('Map '+n+['',' — Lấy Kiếm Phượng Tước',' — Nguyên Phượng & Nâng Cấp Kiếm',' — Khiêu Chiến Boss'][n],2200)}
function convMenu(){dialog('Người Chuyển Đổi',['Map 1 — Lấy Kiếm Phượng Tước','Map 2 — Nguyên Phượng & Nâng Cấp Kiếm','Map 3 — Khiêu Chiến Boss','Xem hành trang'],i=>{if(i<3)goMap(i+1);else setTimeout(inv,0)})}
function inv(){const g=PT.ngoc,n=chain();dialog('Hành trang Phượng Tước',['Kiếm Phượng Tước: '+(PT.sword?'đã có':'chưa')+' | Skin Vàng Trắng: '+(PT.up?(PT.skin?'đang dùng':'đã có'):'chưa'),'Ngọc: Định '+g.dinh+' | Thí '+g.thi+' | Tĩnh '+g.tinh+' | Viêm '+g.viem+' | Hỗn '+g.hon+' | Nguyên Phượng '+g.np,'Lõi Sức Mạnh: '+PT.core+' | Lõi Kiếm Hồn: '+PT.lkh+' | Xương quái vạn quốc: '+PT.xuong.toLocaleString('vi-VN'),'Thiên Tướng: '+(n?TIERS[n-1][2]+' x'+TIERS[n-1][1]:'đang tắt')+' | Sức mạnh hiện tại x'+PW().toLocaleString('vi-VN')],()=>{})}
function q1Menu(){dialog('Lấy Kiếm Phượng Tước',[Q?'Hủy nhiệm vụ đang làm':'Bắt đầu: diệt 1 quái '+Q1N.toLocaleString('vi-VN')+' dạng (mỗi dạng '+Q1HP.toLocaleString('vi-VN')+' máu) trong '+Q1T/60+' phút'+(PT.sword?' (đã có kiếm)':'')],()=>{if(Q){q1End();say('Đã hủy nhiệm vụ',1500)}else q1Start()})}
function swapMenu(){dialog('Người Đổi Đồ',['Đổi 1 Ngọc Nguyên Phượng (có '+PT.ngoc.np+') → mở Skin Vàng Trắng cho Kiếm Phượng Tước'],()=>{
 if(!PT.sword)toast('Cần có Kiếm Phượng Tước (Map 1) trước');else if(PT.up)toast('Đã mở skin rồi — dùng NPC Đổi Skin Kiếm');else if(PT.ngoc.np<1)toast('Chưa có Ngọc Nguyên Phượng — đánh Nguyên Phượng (40% rớt)');
 else{PT.ngoc.np--;PT.up=1;PT.skin=1;save();say('Mở skin Kiếm Phượng Tước — Vàng Trắng!',3500);flash(WHT)}})}
function skinMenu(){dialog('Đổi Skin Kiếm Phượng Tước',['Skin Đỏ (x100, -80% hồi chiêu và thể lực)','Skin Vàng Trắng (x1.500, không hồi chiêu, không tốn thể lực)'+(PT.up?'':' [CHƯA MỞ]')],i=>{
 if(!PT.sword)return toast('Chưa có Kiếm Phượng Tước');
 if(i==1&&!PT.up)return toast('Chưa mở skin Vàng Trắng — đổi Ngọc Nguyên Phượng ở Map 2');
 PT.skin=i;save();say(i?'Skin Vàng Trắng':'Skin Đỏ',1500);flash(i?WHT:RED)})}
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
function ptLeave(){endAll();clearNpcs();if(world){scene.remove(world);freeObj(world);world=null}ptMap=0;show(ui,false);show(hud,false);show(talkBtn,false)}

const baseSet=setMap;
setMap=function(m){
 const was=MAP;if(was=='pt')ptLeave();
 if(m!='pt')return baseSet(m);
 if(was!='pt')prev=was=='dungeon'?'main':was;
 baseSet('main');enemies.forEach(e=>{scene.remove(e.m);freeObj(e.m)});enemies=[];wave=0;MAP='pt';ptEnter()};
const baseResp=respawn;respawn=function(){if(MAP=='pt'){setMap(prev);return}baseResp()};
mapMenu=function(){if(castBusy())return;popup('Chọn map',['Map chính (đợt quái)','Test (quái bù nhìn)','Phó bản Chung Yên Hoàng Đế','Phó bản Phượng Tước Kiếm'],MAP=='test'?1:MAP=='dungeon'?2:MAP=='pt'?3:0,i=>setMap(['main','test','dungeon','pt'][i]))};

GUIDE['Phượng Tước']='<h3>Phó bản Phượng Tước Kiếm</h3>Nút Map → Phó bản Phượng Tước Kiếm. Nói chuyện với Người Chuyển Đổi (phím I) để chọn map.<h3>Map 1</h3>Diệt 1 con quái có 1.000 dạng (mỗi dạng 10.000 máu, diệt dạng này thì hiện dạng kế tiếp ngay tại chỗ) trong 10 phút → Kiếm Phượng Tước (đỏ, phượng hoàng 3D): x100 sức mạnh, -80% hồi chiêu và thể lực cho Phượng Tước Kiếm Pháp và Nhất Vương Tài Quyết Lục (chọn kiếm ở nút 2). Phượng Tước Kiếm Pháp, Nhất Vương Tài Quyết Lục, Thiên Tướng, Vạn Quái Cận Kiến (K) và Quy Nhất (L) chỉ dùng được khi đang cầm Kiếm Phượng Tước.<h3>Map 2</h3>Chỉ dùng được Kiếm Phượng Tước và kiếm pháp của nó. Đánh Nguyên Phượng (100 tỷ máu, biết bay: lượn trên không, lao từ trời xuống, mưa lửa, bão cánh; dưới 50% máu thì hóa cuồng, đánh nhanh và dày hơn): lần đầu nhận x40 sức mạnh, mỗi lần 40% rớt Ngọc Nguyên Phượng. Người Đổi Đồ đổi ngọc để mở skin Vàng Trắng. NPC Đổi Skin Kiếm (có ở mọi map, đứng xa Người Chuyển Đổi) chuyển qua lại giữa skin Đỏ và Vàng Trắng (x1.500, không hồi chiêu, không tốn thể lực).<h3>Map 3</h3>Chỉ dùng được Kiếm Phượng Tước và kiếm pháp của nó. Khiêu chiến lần lượt: Định Vương, Thí Vương, Tĩnh Vương, Viêm Đế, Hỗn Độn, Xi Vưu. Mỗi boss mở chiêu, ngọc và Thiên Tướng. Xi Vưu rớt Lõi Sức Mạnh, Lõi Kiếm Hồn (Kiếm Hồn Nhất Vương, nút R, x1.000.000, -50% hồi chiêu) và 1.000.000 xương cá (mở Vạn Quái Cận Kiến K và Vạn Quái Quy Nhất L màu cam, y hệt bản Chung Yên, x1.000 sát thương).';

buildBtns();
let last=now();
(function tick(){requestAnimationFrame(tick);const t=now(),dt=paused?0:Math.min(.05,(t-last)/1000);last=t;try{step(dt,t/1000)}catch(e){console.error(e)}})();
function step(dt,T){
 if(MAP=='pt'&&ptMap>=2&&PT.sword&&(P.sw!=4||P.sty<6))enforcePT();
 if(!own()){
  if(army)endArmy(false);if(giant)endGiant(false);
  if(P.sty>=6){P.sty=0;P.kh=0;P.ap=0;syncRT();buildBtns();toast('Chỉ dùng được khi cầm Kiếm Phượng Tước')}}
 {const apOn=P.ap>0&&own()&&P.sty>=6&&P.kh>0&&!!PT.kh;
  enemies.forEach(e=>{
   if(apOn){if(e.hp>0){if(e.inf){e.inf=0;e.apInf=1}e.hp=-1;e.hit=8}}
   else if(e.apInf){e.apInf=0;e.inf=1;e.max=e.hp=e.lh=1e15}})}
 if(phx)flap(phx,T);
 syncFigs();if(figs.length)figsStep(T);
 xbUpdate();stunStep(dt,T);armyStep(dt,T);giantStep(dt,T);
 if(MAP!='pt'){show(ui,false);show(hud,false);show(talkBtn,false);return}
 near=null;const q=pl();npcs.forEach(n=>{n.g.rotation.y=Math.atan2(q.x-n.x,q.z-n.z);n.g.userData.aR.rotation.x=-.35+Math.sin(T*2+n.x)*.08;if(hyp(q.x-n.x,q.z-n.z)<9)near=n});
 show(talkBtn,!!near&&!paused);
 show(ui,!!PB);
 if(PB)bossStep(dt,T);
 if(Q){q1Step(dt);if(Q){const s=Math.max(0,Math.ceil(Q.t));hud.textContent='Dạng: '+Math.min(Q.n+1,Q1N)+'/'+Q1N+' — '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');show(hud,true)}else show(hud,false)}
 else{const n=chain();if(n&&useTT()){hud.textContent=TIERS[n-1][2]+' x'+TIERS[n-1][1];show(hud,true)}else show(hud,false)}}
})();
