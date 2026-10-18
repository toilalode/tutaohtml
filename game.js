'use strict';
const $=id=>document.getElementById(id);
const GOLD=0xffd646,PURP=0xc8a0ff,COL={TL:0x50e696,BH:0xf5f5ff,CT:0xff6e28,HV:0x468cff};
const STYLES=['Cửu Ngũ Chí Tôn Kiếm','Thiên Mệnh Kiếm Pháp','Tứ Tượng Kiếm Pháp','Thái Cực Kiếm Pháp','Định Hải Kiếm Pháp'];
const STCOL=[GOLD,GOLD,0x50e696,PURP,0xff9632];
const SWORDS=[['Titan Sword (Common)',1],['Taichi Sword (Genies)',1.25],['Thiên Mệnh Kiếm (History)',1.7]];
const BUFFN={R:'Kiếm Hồn Cửu Ngũ Chí Tôn',T:'Thiên Địa Chi Cảnh',Y:'Thiên Mệnh Xích Giáp',U:'Phản Hồi Sát Thương'};
const F=1000/60,wait=f=>new Promise(r=>setTimeout(r,f*F));
const P={hp:100,st:100,sw:2,sty:1,vy:0,ground:true,cd:{},kh:0,td:0,xich:0,pwr:0,dom4:0,dom5:0,form:0,law:0,rule:[0,0,0,0],guard:0,inv:0,fat:0,fly:0,absorb:0,busy:0,block:0,dashT:0,flyN:0,flyH:8,swing:0,mv:0,dvx:0,dvz:0,lk:0,lt:0};
let enemies=[],fx=[],keys={},joy={x:0,y:0},kills=0,wave=0,paused=false,shake=0,yaw=0,camYaw=0,camPitch=.427,camDist=12.1,DC=null;
let MAP='main',dmgSum=0,dmgT=0,bhC='';
const castBusy=()=>{if(P.busy>0||P.lk>0||P.cut>0){toast('Đang thi triển chiêu');return true}return false};
function wrapP(a){a%=6.2832;return a<0?a+6.2832:a}
// ===== 3D =====
const HOR=0xbfe3ff;const scene=new THREE.Scene();scene.background=new THREE.Color(HOR);scene.fog=new THREE.Fog(HOR,60,230);
const VP=()=>innerHeight>innerWidth,VW=()=>VP()?innerHeight:innerWidth,VH=()=>VP()?innerWidth:innerHeight; // VP: đang dọc → CSS tự xoay ngang
const cam=new THREE.PerspectiveCamera(65,VW()/VH(),.1,300);
const ren=new THREE.WebGLRenderer({antialias:false});const MOB=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent),WEAK=(navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);ren.setPixelRatio(MOB?(WEAK?1:1.25):Math.min(devicePixelRatio,1.5));ren.setSize(VW(),VH(),false);document.body.prepend(ren.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x88aa77,.85));const dl=new THREE.DirectionalLight(0xffffff,.55);dl.position.set(10,20,5);scene.add(dl);
// ===== BẦU TRỜI + MẶT ĐẤT =====
function skyTex(){const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d');
 const gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,'#1f5fc4');gr.addColorStop(.35,'#4f9be8');gr.addColorStop(.5,'#bfe3ff');gr.addColorStop(1,'#cfe9d0');g.fillStyle=gr;g.fillRect(0,0,1024,512);
 const sg=g.createRadialGradient(760,150,4,760,150,70);sg.addColorStop(0,'#fff');sg.addColorStop(.25,'rgba(255,248,200,.95)');sg.addColorStop(1,'rgba(255,240,180,0)');g.fillStyle=sg;g.fillRect(660,50,200,200);
 for(let i=0;i<28;i++){const x=Math.random()*1024,y=40+Math.random()*200,w=60+Math.random()*110;for(let j=0;j<6;j++){g.fillStyle='rgba(255,255,255,'+(.22+Math.random()*.2)+')';g.beginPath();g.ellipse(x+(j-3)*w*.18,y+Math.sin(j)*6,w*.28,w*.12,0,0,7);g.fill()}}
 return new THREE.CanvasTexture(c)}
function grassTex(){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#4d8f3f';g.fillRect(0,0,256,256);
 for(let i=0;i<900;i++){g.fillStyle=Math.random()<.5?'rgba(30,90,30,.35)':'rgba(120,190,80,.3)';g.fillRect(Math.random()*256,Math.random()*256,2,3+Math.random()*4)}
 g.strokeStyle='rgba(20,60,20,.35)';g.lineWidth=2;g.strokeRect(0,0,256,256);
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(70,70);return t}
const skyM=new THREE.Mesh(new THREE.SphereGeometry(270,24,16),new THREE.MeshBasicMaterial({map:skyTex(),side:THREE.BackSide,fog:false,depthWrite:false}));skyM.renderOrder=-1;scene.add(skyM);
const gtex=grassTex(),gr=new THREE.Mesh(new THREE.PlaneGeometry(700,700),new THREE.MeshLambertMaterial({map:gtex}));gr.rotation.x=-Math.PI/2;scene.add(gr);
const shadow=new THREE.Mesh(new THREE.CircleGeometry(.9,16),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.35,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.05;scene.add(shadow);
const mat=(c,o=.8)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,side:THREE.DoubleSide,depthWrite:false});
// Dùng lại geometry (cache) + giải phóng tài nguyên khi hiệu ứng/quái bị xoá
const GC={};const G=(k,f)=>GC[k]||(GC[k]=f(),GC[k]._sh=1,GC[k]);
function freeObj(o){o.traverse(c=>{if(!c.isMesh)return;if(c.geometry&&!c.geometry._sh)c.geometry.dispose();(Array.isArray(c.material)?c.material:[c.material]).forEach(m=>m&&m.dispose&&m.dispose())})}
const _v=new THREE.Vector3(),_d=new THREE.Vector3(),_tc={};
function sT(id,v){if(_tc[id]!==v){_tc[id]=v;$(id).textContent=v}}
function sX(id,v){if(_tc['x'+id]!==v){_tc['x'+id]=v;$(id).style.transform=v}}
// ===== NGƯỜI ROBLOX (người chơi, quái, hình bóng vàng) =====
function faceTex(angry){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle=angry?'#b9b4a0':'#f5cd30';g.fillRect(0,0,64,64);
 g.fillStyle=angry?'#d00':'#111';g.fillRect(16,22,8,10);g.fillRect(40,22,8,10);g.strokeStyle='#111';g.lineWidth=4;g.beginPath();
 if(angry){g.moveTo(18,50);g.lineTo(46,50);g.moveTo(12,14);g.lineTo(26,21);g.moveTo(52,14);g.lineTo(38,21)}else g.arc(32,38,12,.2,Math.PI-.2);g.stroke();return new THREE.CanvasTexture(c)}
const TEXF=faceTex(0),TEXE=faceTex(1);
function roblox(o={}){
 const g=new THREE.Group(),sh=o.mat,Lm=c=>sh||new THREE.MeshLambertMaterial({color:c});
 const box=(w,h,d,c,x,y,z,par,mt)=>{const m=new THREE.Mesh(G('B'+w+','+h+','+d,()=>new THREE.BoxGeometry(w,h,d)),mt||Lm(c));m.position.set(x,y,z);(par||g).add(m);return m};
 const skin=o.skin??0xf5cd30,shirt=o.shirt??0x2c6bd6,pants=o.pants??0x2e8b3a;
 box(.72,.72,.36,shirt,0,1.08,0);
 box(.45,.45,.45,skin,0,1.665,0,null,sh||[Lm(skin),Lm(skin),Lm(skin),Lm(skin),new THREE.MeshLambertMaterial({map:o.angry?TEXE:TEXF}),Lm(skin)]);
 const limb=(x,y,c)=>{const p=new THREE.Group();p.position.set(x,y,0);g.add(p);box(.36,.72,.36,c,0,-.36,0,p);return p};
 const aL=limb(-.54,1.44,skin),aR=limb(.54,1.44,skin),lL=limb(-.18,.72,pants),lR=limb(.18,.72,pants);
 let sb,sg;if(o.sword){const Ln=o.sword,w=sh?0.1:0.07;sb=box(w,w,Ln,0xdde6ee,0,-.72,Ln/2,aR,sh||new THREE.MeshBasicMaterial({color:0xdde6ee}));sg=box(.34,.06,.06,GOLD,0,-.72,.04,aR,sh||new THREE.MeshBasicMaterial({color:GOLD}))}
 aR.rotation.x=-.35;g.userData={aL,aR,lL,lR,sb,sg};return g}
// Hình bóng vàng của KIẾM HỒN Cửu Ngũ Chí Tôn: có vòng hào quang, vương miện, cánh, áo choàng, hai tay cầm đại kiếm cắm trước mặt
function figSoul(m){const g=roblox({mat:m}),u=g.userData;u.aL.rotation.x=u.aR.rotation.x=-1.25;
 const ad=(geo,x,y,z,rx=0,ry=0,rz=0)=>{const k=new THREE.Mesh(geo,m);k.position.set(x,y,z);k.rotation.set(rx,ry,rz);g.add(k);return k};
 ad(new THREE.BoxGeometry(.16,2.6,.06),0,.2,.68);ad(new THREE.BoxGeometry(.7,.1,.1),0,1.5,.68);ad(new THREE.BoxGeometry(.08,.4,.08),0,1.75,.68);
 ad(new THREE.TorusGeometry(.5,.045,6,24),0,2.35,0,Math.PI/2);
 ad(new THREE.PlaneGeometry(.8,1.4),0,1.0,-.24);
 return g}
// Hình bóng vàng khi THI TRIỂN Cửu Ngũ Chí Tôn Kiếm: người trơn giơ thẳng kiếm lên trời (khác hình Kiếm Hồn)
function figCast(m){return roblox({mat:m,sword:1.5})}
const player=new THREE.Group();scene.add(player);
const pb=roblox({sword:1.5});player.add(pb);const PA=pb.userData;
const SWH=new THREE.Mesh(new THREE.BoxGeometry(.095,.095,.75),new THREE.MeshBasicMaterial({color:0x000000}));SWH.position.set(0,-.72,1.125);PA.aR.add(SWH);
const SWC=[[0x9a9a9a,0x666666],[0xffffff,0x111111],[0xffd646,0xff9d00]]; // Titan xám · Taichi đen trắng · Thiên Mệnh vàng kim
function swordLook(){const c=SWC[P.sw]||SWC[0];PA.sb.material.color.setHex(c[0]);PA.sg.material.color.setHex(c[1]);SWH.visible=P.sw==1}
// hiệu ứng trạng thái bám theo người
const S={};
S.kh=figSoul(mat(GOLD,.42));S.kh.scale.setScalar(2.2);S.blk=new THREE.Mesh(new THREE.SphereGeometry(1.7,16,12),mat(0x7fd0ff,.28));
S.xich=new THREE.Group();for(let i=0;i<12;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.18,.05,6,8),mat(GOLD,.9));S.xich.add(m)}
S.td=new THREE.Mesh(new THREE.RingGeometry(10,11,48),mat(GOLD,.6));S.td.rotation.x=-Math.PI/2;S.td.position.y=.08;
S.pwr=new THREE.Mesh(new THREE.SphereGeometry(1.5,14,10),mat(0xff5030,.3));S.pwr.position.y=1;
S.f1=new THREE.Group();for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.15,1,.15),mat(GOLD,.7));m.position.set(Math.cos(i*.785)*2.6,1,Math.sin(i*.785)*2.6);S.f1.add(m)}
S.f2=new THREE.Group();S.f2.add(new THREE.Mesh(new THREE.SphereGeometry(1.7,16,12),mat(0xff7820,.35)),new THREE.Mesh(new THREE.SphereGeometry(1.3,12,8),mat(GOLD,.3)),(()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,6,8),mat(0xc82820,1));m.position.set(1.4,3,0);return m})());S.f2.position.y=1;
S.f3=new THREE.Group();['long','ho','tuoc','vu'].forEach(t=>{const b=buildBeast(t);b.scale.setScalar(.55);b.traverse(o=>{o.frustumCulled=false;if(o.material){o.material.depthTest=false;o.material.opacity=1}o.renderOrder=999});S.f3.add(b)});S.f3.frustumCulled=false;
function tex(draw,sz=256){const c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.translate(sz/2,sz/2);draw(g,sz/2);return new THREE.CanvasTexture(c)}
function taijiDraw(g,r,col='#fff'){g.fillStyle=col;g.beginPath();g.arc(0,0,r*.9,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(0,0,r*.9,-1.57,1.57);g.arc(0,r*.45,r*.45,1.57,-1.57,true);g.arc(0,-r*.45,r*.45,1.57,-1.57,false);g.fill();
 g.fillStyle='#111';g.beginPath();g.arc(0,-r*.45,r*.12,0,7);g.fill();g.fillStyle=col;g.beginPath();g.arc(0,r*.45,r*.12,0,7);g.fill()}
function baguaDraw(g,r,col='#ffd646'){g.strokeStyle=col;g.fillStyle=col;g.lineWidth=5;g.beginPath();g.arc(0,0,r*.95,0,7);g.stroke();g.beginPath();g.arc(0,0,r*.6,0,7);g.stroke();
 for(let i=0;i<8;i++){g.save();g.rotate(i*.785);for(let j=0;j<3;j++){const y=-r*.68-j*9;(i>>j&1)?(g.fillRect(-18,y,14,5),g.fillRect(4,y,14,5)):g.fillRect(-18,y,36,5)}g.restore()}taijiDraw(g,r*.35)}
const texBagua=tex(baguaDraw),texBaguaP=tex((g,r)=>baguaDraw(g,r,'#c8a0ff')),texTaiji=tex((g,r)=>taijiDraw(g,r));
const texTrung=tex((g,r)=>{g.strokeStyle='#ffd646';g.lineWidth=8;g.beginPath();g.arc(0,0,r*.96,0,7);g.stroke();g.fillStyle='#ffd646';g.font='bold 34px sans-serif';g.textAlign='center';
 for(let i=0;i<8;i++){g.save();g.rotate(i*.785);g.fillText('中',0,-r*.72);g.restore()}g.save();g.scale(.5,.5);taijiDraw(g,r*.7);g.restore()},512);
const plane=(t,s,o=.9)=>new THREE.Mesh(G('PL'+s,()=>new THREE.PlaneGeometry(s,s)),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:o,side:THREE.DoubleSide,depthWrite:false}));
S.dom4=plane(texBagua,22,.7);S.dom4.rotation.x=-Math.PI/2;S.dom4.position.y=.06;
S.dom5=plane(texBaguaP,44,.7);S.dom5.rotation.x=-Math.PI/2;S.dom5.position.y=.07;
S.dom5b=plane(texTaiji,26,.8); // sau lưng
S.law=plane(texTrung,10,.85);
S.gap=(()=>{const g=figSoul(mat(GOLD,.4));g.scale.setScalar(5);return g})();S.f1g=plane(texBagua,6,.9);S.f1g.position.set(0,1.3,-.8);
S.dancers=[0,1,2].map(()=>{return roblox({mat:mat(PURP,.5)})});
// ===== LÃNH ĐỊA (Nhất Trảm Độc Tôn Vực) =====
const DR=62;
const domeM=(()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,'#05020f');gr.addColorStop(.6,'#1a0c3a');gr.addColorStop(1,'#4a3000');g.fillStyle=gr;g.fillRect(0,0,1024,512);
 for(let i=0;i<260;i++){g.fillStyle='rgba(255,230,150,'+Math.random()*.9+')';g.fillRect(Math.random()*1024,Math.random()*400,2,2)}
 g.strokeStyle='rgba(255,214,70,.55)';g.lineWidth=3;for(let i=0;i<16;i++){g.beginPath();g.moveTo(i*64,0);g.lineTo(i*64,512);g.stroke()}for(let j=1;j<5;j++){g.beginPath();g.moveTo(0,j*100);g.lineTo(1024,j*100);g.stroke()}
 return new THREE.Mesh(new THREE.SphereGeometry(DR,32,20),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.BackSide,transparent:true,opacity:.82,fog:false,depthWrite:false}))})();
const domeG=plane(texBagua,DR*2,.75);domeG.rotation.x=-Math.PI/2;
function domainOpen(){DC={x:player.position.x,z:player.position.z};domeM.position.set(DC.x,0,DC.z);domeG.position.set(DC.x,.09,DC.z);scene.add(domeM);scene.add(domeG);P.lt=1e9;scene.fog.color.set(0x1a0c3a);scene.fog.near=30;scene.fog.far=140}
function domainClose(){P.lt=0;DC=null;domeG.scale.setScalar(1);scene.remove(domeM);scene.remove(domeG);scene.fog.color.set(HOR);scene.fog.near=60;scene.fog.far=230}
// ===== TIỆN ÍCH =====
function say(t,ms=1500){const b=$('banner');b.style.bottom=($('btns').offsetHeight+8+3)+'px';b.textContent=t;b.style.opacity=1;clearTimeout(say.t);say.t=setTimeout(()=>b.style.opacity=0,ms)}
function toast(t){const e=$('toast');e.textContent=t;clearTimeout(toast.t);toast.t=setTimeout(()=>e.textContent='',1800)}
function flash(c){const e=$('flash');e.style.background='#'+c.toString(16).padStart(6,'0');e.style.opacity=.7;setTimeout(()=>e.style.opacity=0,120)}
function add(m,life,upd){scene.add(m);fx.push({m,life,max:life,upd});if(fx.length>220){const f=fx.shift();scene.remove(f.m);freeObj(f.m)}return m}
const cnSty=()=>P.sty==0||P.sty==1; // Cửu Ngũ Chí Tôn + Thiên Mệnh Kiếm Pháp
const rtyuOk=()=>P.sw==2&&cnSty();
function syncRT(){if(!rtyuOk()){P.kh=P.td=P.xich=P.absorb=P.pwr=P.ap=0}if(P.sty!=0){P.kh=0;P.ap=0}}
function dmgMul(){const sw=P.sw,s=P.sty;let m=SWORDS[sw][1]*(P.pwr>0?2:1)*(P.rule[2]?2:1);
 if(sw==2&&cnSty())m*=1.5;            // Thiên Mệnh Kiếm +50%
 if(sw==1&&s==3)m*=3;                  // Taichi Sword +200% Thái Cực
 if(P.kh&&s==0)m*=101;                 // Kiếm Hồn +10000% Cửu Ngũ Chí Tôn
 if(P.td>0&&cnSty())m*=2.3;            // Thiên Địa Chi Cảnh +130%
 if(s==3){if(P.dom4>0)m*=2.5;if(P.dom5>0)m*=4.5}   // Đệ Tứ +150%, Đệ Ngũ +350%
 if(s==2&&P.form==3)m*=6;               // Tứ Thánh Khí Tức +500% Tứ Tượng
 if(s==4){if(P.form==1)m*=3.5;if(P.form==2)m*=6}   // Đại Thánh +250%, Định Hải Thần Châm +500%
 return m}
const hbMul=()=>(P.sw==2&&cnSty())?1.5:1;   // Thiên Mệnh Kiếm: hitbox +50%
function costMul(){if(P.sw==2&&cnSty())return{cd:.4,st:.4};if(P.sw==1&&P.sty==3)return{cd:.6,st:.5};return{cd:1,st:1}}
function hit(x,z,r,d,kb=.6){r=Math.max(r*hbMul(),12);if(P.dom5>0)kb=0;enemies.forEach(e=>{const p=e.m.position,dx=p.x-x,dz=p.z-z;if(e.hp>0&&Math.hypot(dx,dz)<r+.8){e.hp-=d*dmgMul()/3;e.hit=8;const l=Math.hypot(dx,dz)||1;if(!e.dummy){p.x+=dx/l*kb;p.z+=dz/l*kb}if(P.td>0)P.hp=Math.min(100,P.hp+.3)}})}
function target(){let b=null,bd=1e9;enemies.forEach(e=>{const d=e.m.position.distanceTo(player.position);if(e.hp>0&&d<bd){bd=d;b=e}});
 if(b&&bd<60)return[b.m.position.x,b.m.position.z];return[player.position.x+Math.sin(yaw)*12,player.position.z+Math.cos(yaw)*12]}
const P3=(x,y,z)=>new THREE.Vector3(x,y,z);
// ===== FX =====
function mk(kind,o){
 const px=player.position.x,pz=player.position.z,c=o.col;
 if(kind=='slash'){const m=new THREE.Mesh(G('T'+Math.round(Math.max(3,o.r)*3.2),()=>new THREE.TorusGeometry(Math.round(Math.max(3,o.r)*3.2)/4,.18,6,24,3.6)),mat(c));m.position.set(o.x,2,o.z);m.rotation.set(Math.random()*1.2+.3,Math.random()*6.28,Math.random()*6.28);add(m,14,(f,t)=>{m.scale.setScalar(.5+t*1.2)})}
 else if(kind=='beam'){const dx=o.x-px,dz=o.z-pz,l=Math.hypot(dx,dz)||1,m=new THREE.Mesh(G('CY',()=>new THREE.CylinderGeometry(.25,.25,1,6)),mat(c,.9));m.scale.y=l;m.position.set(px+dx/2,1.4,pz+dz/2);m.rotation.set(Math.PI/2,0,0);m.rotation.order='YXZ';m.rotation.y=Math.atan2(dx,dz);add(m,10)}
 else if(kind=='boom'){const m=new THREE.Mesh(G('S16',()=>new THREE.SphereGeometry(1,16,12)),mat(c,.6));m.position.set(o.x,1,o.z);add(m,26,(f,t)=>m.scale.setScalar(.3+t*o.r));
  const r=new THREE.Mesh(G('R40',()=>new THREE.RingGeometry(.9,1,40)),mat(0xffffff,.8));r.rotation.x=-Math.PI/2;r.position.set(o.x,.2,o.z);add(r,26,(f,t)=>r.scale.setScalar(.3+t*o.r*1.3))}
 else if(kind=='sky'){const m=new THREE.Mesh(G('P390',()=>new THREE.PlaneGeometry(3,90)),mat(c,.85));const a=yaw;m.position.set(px+Math.sin(a)*14,40,pz+Math.cos(a)*14);m.rotation.y=a;m.rotation.z=.3;add(m,26,(f,t)=>{m.scale.x=1+t*6;m.material.opacity=.9*(1-t)});shake=Math.max(shake,14)}
 else if(kind=='hole'){const m=new THREE.Mesh(G('S16',()=>new THREE.SphereGeometry(1,16,12)),mat(0x110018,.95));m.position.set(o.x,14,o.z);add(m,60,(f,t)=>m.scale.setScalar(.5+t*o.r*1.6));
  for(let i=0;i<3;i++){const r=new THREE.Mesh(G('R32',()=>new THREE.RingGeometry(.9,1,32)),mat(c,.8));r.position.set(o.x,14,o.z);r.rotation.set(Math.random(),Math.random(),0);add(r,60,(f,t)=>r.scale.setScalar(1+t*(5+i*3)*o.r/4))}}
 else if(kind=='blade'){const m=new THREE.Mesh(G('BK',()=>new THREE.BoxGeometry(.35,6,.35)),mat(c,.9));m.position.set(o.x,24,o.z);add(m,14,(f,t)=>{m.position.y=24-t*23})}
 else if(kind=='ghost'){const m=mat(c,.55),g=roblox({mat:m,sword:1.2});g.userData.aR.rotation.x=-1.9;g.position.set(o.x,player.position.y,o.z);g.rotation.y=yaw;add(g,o.life||28,(f,t)=>{m.opacity=.55*(1-t);g.position.x+=(px-g.position.x)*.03*t;g.position.z+=(pz-g.position.z)*.03*t})}
 else if(kind=='giant'){const m=mat(c,.38),g=figCast(m);g.scale.setScalar(8);g.position.set(px-Math.sin(yaw)*9,0,pz-Math.cos(yaw)*9);g.rotation.y=yaw;add(g,70,(f,t)=>{m.opacity=.38*(1-t*t);const a=g.userData;['aL','aR','lL','lR'].forEach(n=>a[n].rotation.x=PA[n].rotation.x)})}
 else if(kind=='soul'){const m=mat(c,.5),g=figSoul(m);g.scale.setScalar(9);g.position.set(px-Math.sin(yaw)*10,0,pz-Math.cos(yaw)*10);g.rotation.y=yaw;add(g,80,(f,t)=>{m.opacity=.5*(1-t*t);g.position.y=Math.sin(t*6)*.8})}
 else if(kind=='aura'){const m=new THREE.Mesh(G('S14',()=>new THREE.SphereGeometry(1,14,10)),mat(c,.4));add(m,o.life,(f,t)=>{m.position.set(player.position.x,1.2,player.position.z);m.scale.setScalar(3-t*2)})}
 else if(kind=='ring'){const m=new THREE.Mesh(G('R40',()=>new THREE.RingGeometry(.9,1,40)),mat(c,.85));m.rotation.x=-Math.PI/2;m.position.set(px,.2,pz);add(m,o.life,(f,t)=>m.scale.setScalar(1+t*o.r))}
 else if(kind=='back'){const m=plane(o.tex,o.size,.9);add(m,o.life,(f,t)=>{m.position.set(player.position.x+Math.sin(camYaw)*3.5,3.8,player.position.z+Math.cos(camYaw)*3.5);m.lookAt(cam.position);m.rotateZ(t*8);m.material.opacity=.9*(t>.8?(1-t)*5:1)})}
 else if(kind=='floor'){const m=plane(o.tex,o.size,.9);m.rotation.x=-Math.PI/2;add(m,o.life,(f,t)=>{m.position.set(player.position.x,player.position.y+.12,player.position.z);m.rotation.z+=.06;m.material.opacity=.9*(t>.8?(1-t)*5:1)})}
 else if(kind=='bagua'){const m=plane(texBagua,1,.9);m.rotation.x=-Math.PI/2;m.position.set(px,.1,pz);add(m,o.life,(f,t)=>{m.scale.setScalar(o.r*2);m.rotation.z+=.04;m.material.opacity=.9*(1-t)})}}
const FXK=(k,o={})=>mk(k,o);
// ===== KỸ NĂNG (theo bảng skills.js trích từ thienmenh.py) =====
const cpick=sp=>sp.col?COL[sp.col]:STCOL[P.sty];
function clones(n,col){for(let i=0;i<n;i++){let ox,oz;if(n==8){ox=(i<4?-1:1)*(3+(i%4)*1.4);oz=(i%4-1.5)*1.2}else{const a=6.283*i/n;ox=Math.cos(a)*4;oz=Math.sin(a)*3}FXK('ghost',{x:player.position.x+ox,z:player.position.z+oz,col,life:28})}}
function strike(kind,tx,tz,dm,r,col){const vr=r*hbMul();
 if(kind=='slash'){FXK('slash',{x:tx,z:tz,r:vr,col});hit(tx,tz,r,dm)}
 else if(kind=='beam'){FXK('beam',{x:tx,z:tz,col});hit(tx,tz,r,dm)}
 else if(kind=='boom'){FXK('boom',{x:tx,z:tz,r:vr,col});shake=Math.max(shake,r);hit(tx,tz,r,dm,2)}
 else if(kind=='sky'){FXK('sky',{col});flash(col);hit(player.position.x+Math.sin(yaw)*10,player.position.z+Math.cos(yaw)*10,60,dm,1.5)}
 else if(kind=='hole')FXK('hole',{x:tx,z:tz,r:vr,col})}
const BEAST={'2z':'long','2x':'long','2c':'ho','2v':'tuoc','2b':'tuoc','2n':'vu','2j':'all','2f':'all'};
async function run(sp,k0){
 const col=cpick(sp),k=sp.sp,pl=P,flyUp=(P.sty==0&&k!='counter'&&!sp.nofly)||!!sp.skyfly,lk=k!='counter';P.busy++;if(lk)P.lk++;if(flyUp){P.flyN++;P.flyH=24}
 let dotT=0,dotN=sp.dot&&sp.dot[2]||999;if(sp.dot)dotT=setInterval(()=>{if(paused)return;if(dotN--<=0){clearInterval(dotT);return}const px=player.position.x,pz=player.position.z;hit(px,pz,sp.dot[0],sp.dot[1],.2);FXK('slash',{x:px+Math.random()*8-4,z:pz+Math.random()*8-4,r:3,col})},220);
 try{
 if(sp.fat)P.tf=1;if(sp.cutscene)P.cutMax=P.cut=30+(sp.lines||[]).length*(sp.ld||24)+10;
 if(sp.skyfly)await wait(30);
 if(k=='counter'){P.guard=100;say(sp.n);FXK('ring',{r:6,life:20,col});await wait(100);return}
 if(k=='dom4'){P.dom4=1;say('Thái Cực Hình Ý — Vô Địch Chi Cảnh',2000);await wait(30);return}
 if(k=='dom5'){P.dom5=1;say('Đệ Ngũ Thức — Ngưng Động Thời Gian! Thao Túng Quy Luật Vạn Vật',2200);flash(PURP);await wait(30);return}
 if(k&&k.startsWith('form')){const v=+k[4];P.form=P.form==v?0:v;say(sp.n+(P.form?' — BẬT':' — TẮT'),1200);await wait(20);return}
 if(k=='rewrite'){P.inv=3600;P.nost=3600;flash(PURP);FXK('ring',{r:40,life:40,col:GOLD})}
 if(k=='guard2')P.inv=60;if(sp.inv)P.inv=sp.inv;
 const lines=sp.lines||[];if(!lines.length)say(sp.n,1000);
 for(const t of lines){say(t,sp.ld?600:700);await wait(sp.ld||24)}
 if(sp.domain){domainOpen();say('LÃNH ĐỊA — Nhất Trảm Độc Tôn Vực!',1400);flash(PURP);shake=Math.max(shake,16);FXK('ring',{r:DR/1.2,life:50,col:GOLD});await wait(40)}
 if(sp.bagua){if(!sp.nogr)FXK('bagua',{r:8,life:100,col});FXK('back',{tex:texBagua,size:9,life:100})}
 if(sp.n.includes('Cửu Cung'))FXK('floor',{tex:texTaiji,size:10,life:100});
 if(sp.ring)[0x50e696,0xf5f5ff,0xff6e28,0x468cff].forEach((c,i)=>FXK('ring',{r:3+i*3,life:40,col:c}));
 if(sp.fly){P.fly=90;if(!P.flyN)P.flyH=8}
 if(sp.cl){clones(sp.cl,col);await wait(28);flash(col)}
 if(sp.gi)FXK('giant',{col});
 const bst=BEAST[P.sty+k0];if(bst){const[bx,bz]=target();spawnBeast(bst,bx,bz)}
 const ch=sp.ch||10;FXK('aura',{life:ch+5,col});await wait(ch);
 let[tx,tz]=target();
 for(let i=0;i<(sp.rain||0);i++){const rx=tx+Math.random()*12-6,rz=tz+Math.random()*8-4;FXK('blade',{x:rx,z:rz,col});setTimeout(()=>hit(rx,rz,2.6,sp.rd||25,.3),200);await wait(2)}
 if(sp.end)say(sp.end,1000);
 if(sp.domain&&DC){enemies.forEach(e=>{if(e.hp>0&&Math.hypot(e.m.position.x-DC.x,e.m.position.z-DC.z)<DR){e.hit=10;FXK('blade',{x:e.m.position.x,z:e.m.position.z,col:GOLD});e.hp-=1500*dmgMul()}});FXK('sky',{col:GOLD});flash(GOLD);shake=Math.max(shake,20)}
 for(const[kind,dm,r]of sp.seq||[]){[tx,tz]=target();strike(kind,tx,tz,dm,r,col);await wait(sp.gap||12)}
 if(sp.domain&&DC){domainClose();flash(0xffffff);shake=Math.max(shake,18);FXK('ring',{r:30,life:30,col:GOLD})}
 if(sp.fat){P.fat=600;toast('Cấm Kị: cơ thể mệt, hồi chiêu lâu hơn')}
 }finally{clearInterval(dotT);if(sp.domain&&DC)domainClose();P.busy--;if(lk)P.lk--;if(sp.fat)P.tf=0;if(flyUp){P.flyN--;P.fly=Math.max(P.fly,25)}}}
function cast(k){
 if(paused||P.block)return;k=k.toLowerCase();const sp=SK[P.sty][k];if(!sp)return;if(P.lk>0)return;
 if(sp.sp=='dom4'&&P.dom4>0){P.dom4=0;return say('Tắt Vô Địch Chi Cảnh',900)}
 if(sp.sp=='dom5'&&P.dom5>0){P.dom5=0;return say('Tắt Thao Túng Quy Luật Vạn Vật',900)}
 if(P.sty==3&&P.dom5>0&&k!='j'&&k!='m')return toast('Đệ Ngũ đang bật: chỉ dùng Thần Trảm (J) — bấm M để tắt');
 if(sp.need=='dom4'&&!(P.dom4>0))return toast('Cần Đệ Tứ Thức đang thi triển');
 if(sp.need=='dom5'&&!(P.dom5>0))return toast('Cần Đệ Ngũ Thức đang thi triển');
 if(sp.need=='form12'&&P.form!=1&&P.form!=2)return toast('Cần Đại Thánh hoặc Định Hải Thần Châm');
 if(sp.sp=='dom4'&&P.dom5>0)return toast('Đệ Ngũ đang dùng: cấm Đệ Tứ');
 if(sp.sp=='dom5'&&P.dom4>0)return toast('Đệ Tứ đang dùng: cấm Đệ Ngũ');
 const ck=P.sty+(sp.cdk||k);if(P.cd[ck]>0)return;
 const cm=costMul(),sc=sp.sta*cm.st;if(!(P.nost>0)){if(P.st<sc)return toast('Thiếu thể lực');P.st-=sc}P.cd[ck]=sp.cd/60*(P.fat>0?1.5:1)*cm.cd;
 run(sp,k)}
function atk(){if(paused||P.block||P.cd.atk>0||P.busy>0||P.lk>0||P.cut>0)return;P.cd.atk=.28;P.swing=.25;const[tx,tz]=target();
 FXK('slash',{x:tx,z:tz,r:2.5,col:P.form?GOLD:0xffffff});hit(tx,tz,3,40,.8)}
// ===== BUFF (bật/tắt tự do, KHÔNG hồi chiêu) & QUY LUẬT =====
function buff(k){
 if(paused)return;k=k.toUpperCase();
 if(!rtyuOk())return toast('Buff cần Thiên Mệnh Kiếm + Cửu Ngũ Chí Tôn / Thiên Mệnh Kiếm Pháp');
 if(k=='R'&&P.sty!=0)return toast('Kiếm Hồn (R) chỉ dùng với Cửu Ngũ Chí Tôn Kiếm');
 if(k=='R'&&(P.td||P.xich))return toast('Đang bật Thiên Địa/Xích Giáp (T/Y): cấm dùng Kiếm Hồn (R)');
 if((k=='T'||k=='Y'||k=='U')&&P.kh)return toast('Đang bật Kiếm Hồn (R): cấm dùng T, Y, U');
 if(k=='U'){if(P.absorb<=0)return toast('Chưa hấp thụ sát thương (bật Y rồi chịu đòn)');
  const d=P.absorb*2;P.absorb=0;P.pwr=600;FXK('boom',{x:player.position.x,z:player.position.z,r:14,col:GOLD});hit(player.position.x,player.position.z,14,d*3,2);shake=12;return}
 const key={R:'kh',T:'td',Y:'xich'}[k];P[key]=P[key]?0:1;if(key=='kh'&&!P.kh)P.ap=0;say(P[key]?BUFFN[k]+' — BẬT':BUFFN[k]+' — TẮT',1000);if(P[key])flash(GOLD)}
function popup(title,opts,cur,fn){paused=true;$('ptitle').textContent=title;const o=$('popts');o.innerHTML='';
 opts.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t;if(i==cur)b.className='on';b.onclick=()=>{fn(i);close()};o.appendChild(b)});
 const x=document.createElement('button');x.textContent='Đóng';x.onclick=close;o.appendChild(x);$('popup').style.display='block';
 function close(){$('popup').style.display='none';paused=false}}
function setStyle(n){P.sty=n;P.dom4=P.dom5=P.form=P.law=P.guard=P.ap=0;syncRT();buildBtns();if(cnSty()&&P.sw!=2)toast('Chọn Thiên Mệnh Kiếm (nút 2) để dùng R T Y U')}
const styleMenu=()=>castBusy()||popup('Chọn kiếm pháp',STYLES,P.sty,setStyle),swordMenu=()=>castBusy()||popup('Chọn kiếm',SWORDS.map(s=>s[0]),P.sw,i=>{P.sw=i;syncRT();buildBtns()});
// ===== ĐIỀU KHIỂN =====
addEventListener('keydown',e=>{keys[e.code]=1;const c=e.code;if(c.startsWith('Arrow'))e.preventDefault();if(e.repeat&&c!='Tab')return;
 if(c=='Tab'){e.preventDefault();atk()}else if(c=='Digit1')styleMenu();else if(c=='Digit2')swordMenu();else if(c=='KeyH')lawMenu();else if(c=='KeyQ')dash();else if(c=='KeyE')blockOn(1);
 else if('RTYU'.includes(c.slice(3))&&c.startsWith('Key')&&c.length==4)buff(c[3]);
 else if(c.startsWith('Key')&&'ZXCVBNMJFG'.includes(c[3]))cast(c[3]);
 else if(c=='Space')jump();else if(c=='Enter'&&P.hp<=0)respawn()});
addEventListener('keyup',e=>{keys[e.code]=0;if(e.code=='KeyE')blockOn(0)});
addEventListener('contextmenu',e=>e.preventDefault());
const jump=()=>{if(P.ground&&!paused&&!P.lk&&!(P.busy>0)&&!(P.cut>0)){P.vy=P.rule[0]?15:9;P.ground=false}};
function blockOn(v){if(v&&(paused||P.hp<=0||P.cd.block>0||P.busy>0||P.lk>0||P.cut>0))return;P.block=v?1:0}
function dash(){if(paused||P.lk>0||P.busy>0||P.cut>0)return;if(!(P.nost>0)){if(P.st<8)return toast('Thiếu thể lực');P.st-=8}
 const c=Math.cos(camYaw),s=Math.sin(camYaw),ix=(keys.KeyD?1:0)-(keys.KeyA?1:0)+joy.x,iz=(keys.KeyS?1:0)-(keys.KeyW?1:0)+joy.y;let dx,dz;
 if(Math.hypot(ix,iz)>.2){dx=c*ix+s*iz;dz=-s*ix+c*iz}else{dx=Math.sin(yaw);dz=Math.cos(yaw)}
 const l=Math.hypot(dx,dz)||1;P.dvx=dx/l*42;P.dvz=dz/l*42;P.dashT=.2;P.inv=Math.max(P.inv,14);yaw=Math.atan2(dx,dz);
 for(let i=0;i<3;i++)FXK('ghost',{x:player.position.x-P.dvx*.02*i,z:player.position.z-P.dvz*.02*i,col:0x9fd8ff,life:16});FXK('ring',{r:3,life:14,col:0x9fd8ff})}
const joyEl=$('joy'),kn=$('knob');
joyEl.addEventListener('touchmove',e=>{const r=joyEl.getBoundingClientRect(),t=e.touches[0],dx=t.clientX-r.left-r.width/2,dy=t.clientY-r.top-r.height/2;
 let x=(VP()?dy:dx)/45,y=(VP()?-dx:dy)/45;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}joy.x=x;joy.y=y;kn.style.transform=`translate(${x*35}px,${y*35}px)`});
joyEl.addEventListener('touchend',()=>{joy.x=joy.y=0;kn.style.transform=''});
let bt={},heldM1=0;
function buildBtns(){const bot=$('btns'),L=$('colL'),R=$('colR');bot.innerHTML=L.innerHTML=R.innerHTML='';bt={};
 const NM={R:'Kiếm Hồn',T:'Thiên Địa',Y:'Xích Giáp',U:'Phản Hồi'};
 // chỉ phản ứng khi ngón tay BẮT ĐẦU chạm trên nút (kéo ngón từ chỗ khác vào nút thì không tính là bấm)
 const ad=(par,l,name,fn,cls,id,up)=>{const b=document.createElement('button');b.innerHTML='<b>'+l+'</b><i>'+name+'</i>';b.className=cls||'';
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(up){try{b.setPointerCapture(e.pointerId)}catch(_){}}fn()});
  if(up){b.addEventListener('pointerup',()=>up());b.addEventListener('pointercancel',()=>up())}par.appendChild(b);bt[id||l]=b};
 ad(L,'1','Kiếm pháp',styleMenu,'c1');ad(L,'2','Kiếm',swordMenu,'c2');ad(L,'?','Hướng dẫn',guideOpen,'c5');ad(L,'🗺','Map',mapMenu,'c5');
 ad(R,'Q','Lướt',dash,'c6');ad(R,'⤒','Nhảy',jump,'c4');ad(R,'E','Đỡ đòn',()=>blockOn(1),'c7','E',()=>blockOn(0));ad(R,'M2','Quy Luật',lawMenu,'c3','H');
 if(rtyuOk())'RTYU'.split('').filter(k=>k!='R'||P.sty==0).forEach(k=>ad(bot,k,NM[k],()=>buff(k),'rt r'+k));
 'ZXCVBNMJFG'.split('').forEach(k=>{const sp=SK[P.sty][k.toLowerCase()];if(sp)ad(bot,k,sp.n.replace(/^Đệ (\S+) Thức[:\s—-]*/,'Đệ$1 ').slice(0,11),()=>cast(k))});placeCols()}
let lastX=null,lastY=null;addEventListener('touchmove',e=>{const t=e.touches[e.touches.length-1],cx=VP()?t.clientY:t.clientX,cy=VP()?-t.clientX:t.clientY;if(cx>VW()*.45&&t.target==ren.domElement){if(lastX!=null){camYaw-=(cx-lastX)*.01*(Math.cos(camPitch)<0?-1:1);camPitch=wrapP(camPitch+(cy-lastY)*.01)}lastX=cx;lastY=cy}});addEventListener('touchend',()=>{lastX=lastY=null});
// Con lăn chuột giữa: thu phóng camera (gần/xa) để xem chiêu bao quanh rõ hơn
addEventListener('wheel',e=>{if(e.target.closest&&e.target.closest('#guide,#popup'))return;e.preventDefault();camDist=Math.max(3,Math.min(80,camDist*Math.exp(e.deltaY*.0015)))},{passive:false});
// Chạm màn hình = M1: chạm nhanh đánh 1 lần, giữ yên đánh liên tục, kéo = xoay camera. (Chuột phải = M2)
let tp=null,tpT=0;const cv=ren.domElement;
cv.addEventListener('pointerdown',e=>{if(paused)return;if(e.button==2){lawMenu();return}if(e.button>0)return;tp={id:e.pointerId,x:e.clientX,y:e.clientY,mv:0,hold:0};clearTimeout(tpT);tpT=setTimeout(()=>{if(tp&&!tp.mv){tp.hold=1;heldM1=1}},240)});
cv.addEventListener('pointermove',e=>{if(!tp||e.pointerId!=tp.id)return;if(!tp.mv&&Math.hypot(e.clientX-tp.x,e.clientY-tp.y)>12){tp.mv=1;if(tp.hold){heldM1=0;tp.hold=0}}if(tp.mv&&e.pointerType=='mouse'){camYaw-=e.movementX*.01*(Math.cos(camPitch)<0?-1:1);camPitch=wrapP(camPitch+e.movementY*.01)}});
const tpEnd=ok=>e=>{if(!tp||e.pointerId!=tp.id)return;clearTimeout(tpT);if(ok&&!tp.mv&&!tp.hold)atk();heldM1=0;tp=null};
cv.addEventListener('pointerup',tpEnd(1));cv.addEventListener('pointercancel',tpEnd(0));
let tsOn='';
function fit(){pdone=false;cam.aspect=VW()/VH();cam.updateProjectionMatrix();ren.setSize(VW(),VH(),false);placeCols()}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,300));
// màn hình bắt đầu: toàn màn hình + khoá xoay ngang
paused=true;
$('start').addEventListener('pointerdown',async()=>{
 try{const d=document.documentElement;if(d.requestFullscreen)await d.requestFullscreen();else if(d.webkitRequestFullscreen)d.webkitRequestFullscreen()}catch(e){}
 try{await screen.orientation.lock('landscape')}catch(e){}
 $('start').style.display='none';paused=false;setTimeout(fit,400)});
// ===== KẺ ĐỊCH =====
function mkEnemy(){const m=roblox({angry:1,skin:0xb9b4a0,shirt:0xaa2222,pants:0x2a2230});m.scale.setScalar(1.15);const ms=[];
 m.traverse(c=>{if(c.isMesh)(Array.isArray(c.material)?c.material:[c.material]).forEach(x=>{if(x.emissive&&!ms.includes(x))ms.push(x)})});
 m.userData.aL.rotation.x=m.userData.aR.rotation.x=-1.45;return{m,ms}}
function spawn(){wave++;for(let i=0;i<Math.min(4+wave*2,16);i++){const{m,ms}=mkEnemy(),a=Math.random()*6.28,r=25+Math.random()*20;m.position.set(Math.cos(a)*r,0,Math.sin(a)*r);scene.add(m);enemies.push({m,ms,hp:140+wave*50,lh:140+wave*50,hit:0,cd:.4+Math.random()*1.2,wind:0,ph:Math.random()*6})}}
function mapMenu(){if(castBusy())return;popup('Chọn map',['Map chính (đợt quái)','Test (quái bù nhìn)'],MAP=='test'?1:0,i=>setMap(i?'test':'main'))}
function setMap(m){if(DC)domainClose();enemies.forEach(e=>{scene.remove(e.m);freeObj(e.m)});enemies=[];MAP=m;dmgSum=0;dmgT=0;
 player.position.set(0,0,0);P.vy=0;P.hp=100;P.st=100;
 gr.material.color.setHex(m=='test'?0xa9a9d4:0xffffff);
 $('tp').style.display=m=='test'?'flex':'none';tpClose();$('eh').style.display='none';
 if(m=='test'){const{m:mm,ms}=mkEnemy();mm.userData.aL.rotation.x=mm.userData.aR.rotation.x=0;mm.position.set(0,0,12);mm.rotation.y=Math.PI;
  const st=new THREE.Group();for(let i=0;i<4;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),new THREE.MeshBasicMaterial({color:0xffe14d}));st.add(s)}st.position.y=2.9;mm.add(st);
  scene.add(mm);enemies.push({m:mm,ms,hp:100000,max:100000,lh:100000,hit:0,cd:99,wind:0,ph:0,dummy:1,stars:st});
  $('tpC').value=100000;$('tpM').value=100000;toast('Map Test: quái bù nhìn bị choáng, không đánh, không hồi máu')}
 else{wave=0;spawn()}}
// Máu quái Map Test: nhập tối đa 25 chữ số; hiển thị từ 10 chữ số trở lên dạng 1e+N
const HP_MAX_DIGITS=25,HP_MAX=Number('9'.repeat(HP_MAX_DIGITS));
const fmtSci=n=>n.toExponential(4).replace(/\.?0+e/,'e');
const fmtHp=x=>{const s=String(x),n=Number(s);return s!=='∞'&&isFinite(n)&&n>=1e9?fmtSci(n):s};
const fmtNum=n=>n>=1e9?fmtSci(n):n.toLocaleString('vi-VN');
function tpApply(full){const e=enemies.find(x=>x.dummy);if(!e)return;if($('tpM').value=='∞'){e.inf=1;e.max=1e15;e.hp=1e15;e.lh=1e15;$('tpM').value='∞';$('tpC').value='∞';dmgSum=0;dmgT=0;tpClose();return}e.inf=0;let mx=Math.floor(+(tpEdit?tpBuf:String(e.max)))||0;if(mx<100){mx=100;toast('Máu tối đa tối thiểu 100')}mx=Math.min(mx,HP_MAX);tpClose();const c=mx;e.max=mx;e.hp=c;e.lh=c;$('tpM').value=fmtHp(mx);$('tpC').value=fmtHp(c);dmgSum=0;dmgT=0}
let tpEdit=false,tpBuf='';
function tpOpen(){tpEdit=true;{const e=enemies.find(x=>x.dummy);tpBuf=!e?'':e.inf?'∞':BigInt(Math.floor(e.max)).toString().slice(0,HP_MAX_DIGITS)}$('kp').style.display='grid';$('tpM').style.borderColor='#fc0'}
function tpClose(){tpEdit=false;$('kp').style.display='none';$('tpM').style.borderColor=''}
function tpKey(k){if(tpBuf=='∞'&&k!='inf')tpBuf='';if(k=='inf')tpBuf='∞';else if(k=='del')tpBuf=tpBuf.slice(0,-1);else if(k=='clr')tpBuf='';else if(tpBuf.length<HP_MAX_DIGITS)tpBuf=(tpBuf+k).replace(/^0+(?=\d)/,'');$('tpM').value=fmtHp(tpBuf)}
$('tpM').onclick=()=>tpEdit?tpClose():tpOpen();
[['1','1'],['2','2'],['3','3'],['4','4'],['5','5'],['6','6'],['7','7'],['8','8'],['9','9'],['0','0'],['Vô hạn','inf'],['Xóa','del'],['Xóa tất cả','clr']].forEach(([t,k])=>{const b=document.createElement('button');b.textContent=t;b.dataset.k=k;if(k=='clr')b.className='w2';if(k=='inf')b.className='w2';b.onclick=()=>tpKey(k);$('kp').appendChild(b)});
$('tpSet').onclick=()=>tpApply(0);$('tpFull').onclick=()=>tpApply(1);
['keydown','keyup','pointerdown','pointerup','pointermove','touchstart','touchend'].forEach(ev=>['tp','kp'].forEach(i=>$(i).addEventListener(ev,x=>x.stopPropagation())));
function respawn(){if(DC)domainClose();P.hp=100;P.st=100;kills=0;wave=0;enemies.forEach(e=>{scene.remove(e.m);freeObj(e.m)});enemies=[];MAP=='test'?setMap('test'):spawn()}
function hurt(d){if(P.inv>0||P.lk>0)return;
 if(P.block){const c=d*1.3;if(P.st>=c){P.st-=c;FXK('ring',{r:3,life:12,col:0x9fd8ff});shake=Math.max(shake,2);return}P.st=0;P.block=0;P.cd.block=1.5;toast('Vỡ thế đỡ!')}
 if(P.sty==2&&!(P.cd.vu>0)){P.cd.vu=.3;P.inv=Math.max(P.inv,24);spawnBeast('vu',0,0,{life:50,s:.9});const[ax,az]=target();strike('beam',ax,az,160,4,0x468cff);FXK('ring',{r:5,life:20,col:0x468cff});return}
 if(P.guard>0){P.guard=0;FXK('ring',{r:6,life:20,col:0xffffff});const[tx,tz]=target();strike('slash',tx,tz,300,6,GOLD);return}
 if(P.xich>0){P.absorb+=d;return}P.hp-=d;P.hurtT=3}
// ===== VÒNG LẶP =====
const SAVE='tm_save_v1';let best=0;
function save(){try{localStorage.setItem(SAVE,JSON.stringify({sw:P.sw,sty:P.sty,rule:P.rule,best:Math.max(best,wave)}))}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(SAVE)||'null');if(d){P.sw=d.sw??2;P.sty=d.sty??1;P.rule=d.rule||[0,0,0,0];best=d.best||0}}catch(e){}}
function resetSave(){try{localStorage.removeItem(SAVE)}catch(e){}location.reload()}
window.resetSave=resetSave;load();setInterval(save,2000);addEventListener('pagehide',save);
function placeCols(){const h=$('btns').offsetHeight;$('colR').style.bottom=Math.max(92,h+14)+'px'}
// ===== HƯỚNG DẪN =====
const NOTE=[
{z:'Triệu 1 phân thân, mưa 24 kiếm từ trời rồi nổ lớn.',x:'Bóng khổng lồ, 2 tia kiếm rồi 1 nhát chém lớn.',c:'6 phân thân hợp nhất thành 1 nhát chém lớn.',v:'3 nhát chém liên tiếp. Không bay lên trời.',b:'Thế phản đòn 1.7 giây: bị đánh thì chém trả 300 sát thương.',n:'1 nhát chém mạnh. Không bay lên trời.',m:'8 phân thân, hố đen trên trời rồi nổ cực lớn.',f:'Mưa 44 kiếm rồi nổ cực lớn, bóng khổng lồ.'},
{z:'Nhát chém nhanh, nhẹ, hồi chiêu ngắn.',x:'4 tia phi kiếm liên tiếp.',c:'Bất tử 1 phút và không tốn thể lực; chém quái 3500 sát thương gốc.',v:'Chém đầu 1750 rồi Nhất Trảm Khai Thiên 3750 (tổng 5500).',g:'8 phân thân, mở Lãnh Địa (quái trong vực đứng im, chịu 1500 sát thương, bát quái nằm sau lưng), chém cuối rồi phá Lãnh Địa. Tổng 18000.'},
{z:'Thanh Long: 4 tia sét liên tiếp rồi nổ.',x:'Thanh Long: 1 nhát chém sét lớn.',c:'Bạch Hổ: 1 tia kiếm xa.',v:'Chu Tước: nổ lửa lớn.',b:'Chu Tước: 6 tia lửa liên tiếp.',n:'Huyền Vũ: bất tử 1 giây, 1 tia rồi 1 nhát chém.',m:'Bật/tắt Tứ Thánh Khí Tức: 4 thú xoay quanh người, sát thương Tứ Tượng +500%.',j:'4 phân thân, chém lớn Tứ Thánh Quy Nhất.',f:'4 vòng sáng 4 thú rồi chém cực lớn. Thêm: khi bị đánh, Huyền Vũ tự đỡ và bắn trả (gần như liên tục).'},
{z:'3 phân thân, bát quái dưới chân, gây sát thương liên tục quanh người rồi chém.',x:'Bản mạnh hơn: tốn thể lực hơn, sát thương liên tục lớn hơn, kết thúc bằng nổ.',c:'Bất tử ~1.2 giây, 16 nhát chém liên hoàn rồi nổ.',v:'10 phân thân, Thái Cực xoay dưới chân rồi chém.',b:'Bật/tắt Vô Địch Chi Cảnh: quái trong tầm đứng im, sát thương ×2.5.',n:'Cần Vô Địch Chi Cảnh đang bật: chém bát quái rất mạnh.',m:'Bật/tắt Nghịch Thiên: ngưng thời gian, quái đứng im, sát thương ×4.5, chỉ dùng được Thần Trảm.',j:'Cần Nghịch Thiên đang bật: cutscene cận mặt, niệm 8 quẻ rồi tia chém từ trời.',f:'Bay lên, ngưng thời gian (màn hình xám) suốt lúc thi triển, chém và nổ cực lớn; sau đó cơ thể mệt, hồi chiêu ×1.5 trong 10 giây.'},
{z:'4 nhát chém nhanh rồi nổ.',x:'22 nhát chém dồn dập rồi nổ.',c:'4 phân thân, 1 nhát chém lớn.',v:'Bật/tắt Hình Thái Đại Thánh: sát thương ×3.5.',f:'Cần Đại Thánh hoặc Thần Châm đang bật: bay lên, bóng khổng lồ, tia chém từ trời rồi nổ cực lớn.',g:'Bật/tắt Định Hải Thần Châm: sát thương ×6.'}];
let guideCur='Điều khiển';
const GUIDE={
'Điều khiển':`<h3>Di chuyển & camera</h3><b>WASD</b> / joystick trái: chạy. <b>Space</b> / nút ⤒: nhảy.<br>Kéo ngón tay (hoặc giữ chuột trái rồi kéo) để xoay camera: <b>trái/phải và lên/xuống đều xoay được trọn 360°</b>.<br><b>Mũi tên ← → ↑ ↓</b>: xoay camera.<h3>Thu phóng & Tâm</h3><b>Máy tính:</b> con lăn chuột giữa thu phóng gần/xa (3 → 220); phím <b>O</b> phóng gần, <b>P</b> thu xa (giữ để zoom liên tục); phím <b>Shift</b> bật/tắt Tâm.<br><b>Điện thoại:</b> chụm 2 ngón trên khung cảnh để thu phóng; nút tròn <b>🔒/🔓</b> cạnh nút <b>＋ －</b> (nằm dưới HUD Kiếm pháp/Kiếm, góc trên phải) để bật/tắt Tâm.<br><b>Tâm (kiểu Roblox shift-lock):</b> bật lên sẽ hiện một chấm trắng cố định giữa màn hình; xoay camera thì <b>nhân vật tự xoay theo</b> hướng camera, và chiêu sẽ đánh vào quái gần tâm nhất phía trước mặt.<h3>Chiến đấu</h3><b>M1</b> (chạm / bấm màn hình): chạm nhanh = 1 đòn, giữ yên = đánh liên tục.<br><b>M2</b> (H / chuột phải / nút M2): menu Quy Luật (cần bật R).<br><b>Q</b> Lướt: né đòn, tốn 8 thể lực, <b>không hồi chiêu</b>.<br><b>E</b> (giữ) Đỡ đòn: tốn thể lực khi bị đánh, hết thể lực sẽ vỡ thế đỡ.<br><b>1</b> chọn kiếm pháp, <b>2</b> chọn kiếm.<br><b>Z X C V B N M J F G</b>: các chiêu (tuỳ kiếm pháp, xem tab Kiếm pháp).<h3>Lưu ý</h3>Đang thi triển chiêu thì <b>phải đứng yên, không lướt/nhảy được, quái không đánh trúng bạn</b>, và chưa dùng được chiêu khác — chờ chiêu xong. Nút đang hồi chiêu hiện số giây còn lại.`,
'Buff':`<h3>Điều kiện</h3>Nút R T Y U chỉ hiện khi dùng <b>Thiên Mệnh Kiếm</b> (phím 2) + kiếm pháp <b>Cửu Ngũ Chí Tôn Kiếm</b> hoặc <b>Thiên Mệnh Kiếm Pháp</b> (phím 1). Riêng <b>R</b> chỉ có ở Cửu Ngũ Chí Tôn Kiếm, Thiên Mệnh Kiếm Pháp không có R. Đổi sang kiếm/kiếm pháp khác thì các buff tự tắt.<h3>Các buff (bật/tắt, không hồi chiêu)</h3><b>R</b> Kiếm Hồn Cửu Ngũ Chí Tôn (cam): hình bóng vàng sau lưng, <b>sát thương ×4</b> (chỉ ở Cửu Ngũ Chí Tôn Kiếm), mở khoá M2 Quy Luật.<br><b>T</b> Thiên Địa Chi Cảnh (đỏ): <b>sát thương ×2.3</b>, hồi thể lực gấp đôi (18/giây), mỗi đòn trúng hút +0.3 máu. Không hấp thụ sát thương.<br><b>Y</b> Thiên Mệnh Xích Giáp (đỏ): mọi sát thương nhận vào không trừ máu mà <b>dồn lại thành điểm hấp thụ</b> (hiện trên thanh buff).<br><b>U</b> Phản Hồi (đỏ): dùng sau khi Y đã hấp thụ — nổ bán kính lớn trả lại sát thương đã hấp thụ (nhân 6), rồi <b>sát thương ×2 trong 10 giây</b>. Dùng xong điểm hấp thụ về 0.<h3>Quy tắc</h3>Bật R thì cấm T, Y, U. Bật T hoặc Y thì cấm R.<h3>M2 — Quy Luật Kiếm Hồn</h3>Vạn Kiếm Giáng Thế · Thiên Trảm · Áp Chế (bật/tắt, quái đứng im và bị thiêu đốt).`,
'Kiếm':`<h3>Titan Sword (xám)</h3>Kiếm thường: sát thương ×1, không có thưởng gì thêm.<h3>Taichi Sword (đen trắng)</h3>Sát thương ×1.25. Khi dùng <b>Thái Cực Kiếm Pháp</b>: sát thương ×3 (tổng ×3.75), hồi chiêu ×0.6, tốn thể lực ×0.5.<h3>Thiên Mệnh Kiếm (vàng kim)</h3>Sát thương ×1.7. Khi dùng <b>Cửu Ngũ Chí Tôn Kiếm</b> hoặc <b>Thiên Mệnh Kiếm Pháp</b>: thêm sát thương ×1.5, vùng trúng đòn rộng ×1.5, hồi chiêu và thể lực chỉ còn ×0.4. Chỉ kiếm này mới mở được nút R T Y U.<h3>Cộng dồn</h3>Các hệ số nhân với nhau: kiếm × buff (R/T/U) × trạng thái chiêu (Đệ Tứ ×2.5, Đệ Ngũ ×4.5, Đại Thánh ×3.5, Định Hải Thần Châm ×6).`,
'Chiêu':()=>STYLES.map((s,i)=>'<h3>'+s+'</h3>'+Object.keys(SK[i]).map(k=>{const q=SK[i][k];return '<b>'+k.toUpperCase()+'</b> '+q.n+' <small>(thể lực '+q.sta+(q.cd?', hồi '+(q.cd/60).toFixed(1)+'s':'')+(q.tot?', sát thương gốc '+q.tot:'')+')</small><br><small style="color:#bbb">'+((NOTE[i]||{})[k]||'')+'</small>'}).join('<br>')).join(''),
'Mẹo':`<h3>Mẹo chơi</h3>• <b>Nhất Trảm Độc Tôn</b> (Thiên Mệnh Kiếm Pháp, phím G): mở <b>Lãnh Địa</b> — quái trong vực đứng im, chịu sát thương liên tục mỗi 0,2 giây suốt lúc Lãnh Địa mở, rồi chịu đòn Vỡ Nát rất lớn ngay khi Lãnh Địa đóng (sau nhát chém cuối).<br>• <b>Đệ Ngũ Thức: Nghịch Thiên</b> ngưng động thời gian, quái đứng im; chỉ dùng được Thần Trảm.<br>• <b>Thái Cực Thần Trảm</b> có cutscene cận mặt nhân vật lúc niệm chú.<br>• <b>Cấm Kị Chung Chương</b> ngưng động thời gian (màn hình xám) suốt lúc thi triển.<br>• <b>Cửu Ngũ Chí Tôn Kiếm</b>: các chiêu bay lên trời (trừ Tam Liên Trảm, Vạn Tượng Lai Triều và Ngôn Xuất Pháp Tuỳ Thức).<br>• <b>Tứ Tượng</b>: Huyền Vũ tự đỡ đòn khi bị đánh.<br>• Thể lực hồi chậm khi đang đỡ đòn; bật T hồi nhanh gấp đôi.<br>• Tự hồi máu 2 HP/giây sau 3 giây không bị đánh.<br>• Map Test có thêm nút <b>Tấn công</b> cạnh nút Đầy: bật thì quái bù nhìn đứng yên tại chỗ và đánh bạn, bấm lại là quái trở về trạng thái choáng.<br>• Game tự lưu mỗi 2 giây. Xoá lưu: mở Console gõ <b>resetSave()</b>.<br>• Điện thoại: bật xoay tự động; giao diện tự xoay ngang.`};
function guideOpen(){if(castBusy())return;paused=true;const g=$('guide');g.style.display='flex';g.style.maxHeight=VH()*.92+'px';$('gbody').style.maxHeight=(VH()*.92-95)+'px';guideTab(guideCur)}
function guideTab(n){guideCur=n;const t=$('gtabs');t.innerHTML='';Object.keys(GUIDE).forEach(x=>{const b=document.createElement('button');b.textContent=x;if(x==n)b.className='on';b.onclick=()=>guideTab(x);t.appendChild(b)});const c=GUIDE[n];$('gbody').innerHTML=typeof c=='function'?c():c;$('gbody').scrollTop=0}
{const gb=$('gbody');let gy=null;const Y=t=>VP()?-t.clientX:t.clientY;gb.addEventListener('touchstart',e=>{gy=Y(e.touches[0])},{passive:true});gb.addEventListener('touchmove',e=>{const y=Y(e.touches[0]);if(gy!=null)gb.scrollTop-=y-gy;gy=y;e.preventDefault()},{passive:false});gb.addEventListener('touchend',()=>{gy=null})}
$('gclose').onclick=()=>{$('guide').style.display='none';paused=false};
const clock=new THREE.Clock();buildBtns();spawn();
let pdone=false;
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05),fr=dt*60;
 if(paused){if(pdone)return;pdone=true}else pdone=false;
 if(!paused){
  for(const k in P.cd)if(P.cd[k]>0)P.cd[k]-=dt;
  ['guard','inv','pwr','fat','cut','nost'].forEach(k=>{if(P[k]>0){P[k]-=fr;if(P[k]<0)P[k]=0}});if(P.fly>0)P.fly-=fr;
  if(P.lt>0){P.lt-=fr;domeM.rotation.y+=.002*fr;if(P.lt<=0){domainClose()}}if((!rtyuOk()&&(P.kh||P.td||P.xich||P.absorb||P.pwr||P.ap))||(P.sty!=0&&(P.kh||P.ap)))syncRT();
  if(heldM1)atk();if(keys.Tab)atk();
  {const ar=2.2*dt;if(keys.ArrowLeft)camYaw+=ar;if(keys.ArrowRight)camYaw-=ar;if(keys.ArrowUp)camPitch=wrapP(camPitch-ar);if(keys.ArrowDown)camPitch=wrapP(camPitch+ar)}   // mũi tên: xoay camera
  const lkf=P.lk>0?0:1,mx=((keys.KeyD?1:0)-(keys.KeyA?1:0)+joy.x)*lkf,mz=((keys.KeyS?1:0)-(keys.KeyW?1:0)+joy.y)*lkf;
  P.mv=0;if(P.lk>0)P.dashT=0;if(P.dashT>0){P.dashT-=dt;P.mv=1;player.position.x+=P.dvx*dt;player.position.z+=P.dvz*dt}
  else if(mx||mz){const c=Math.cos(camYaw),s=Math.sin(camYaw),dx=c*mx+s*mz,dz=-s*mx+c*mz,l=Math.hypot(dx,dz)||1,sp=P.block?4.5:9;
   player.position.x+=dx/l*sp*dt;player.position.z+=dz/l*sp*dt;yaw=Math.atan2(dx,dz);P.mv=1}
  const[tx0,tz0]=target();if(P.busy)yaw=Math.atan2(tx0-player.position.x,tz0-player.position.z);player.rotation.y=yaw;
  P.vy-=(P.rule[0]?10:26)*dt;player.position.y+=P.vy*dt;
  const fl=P.fly>0||P.flyN>0;if(fl){player.position.y+=((P.flyH||8)-player.position.y)*.08;P.vy=0}
  if(player.position.y<=0&&!fl){player.position.y=0;P.vy=0;P.ground=true}
  if(!P.block)P.st=Math.min(100,P.st+(P.td>0?18:9)*dt);
  if(P.hurtT>0)P.hurtT-=dt;else if(P.hp>0&&P.hp<100)P.hp=Math.min(100,P.hp+2*dt);if(P.rule[3])P.hp=Math.min(100,P.hp+3*dt);
  let apN=0;if(P.ap>0){P.apT=(P.apT||0)+dt;apN=Math.floor(P.apT/.005);P.apT-=apN*.005}else P.apT=0;
  enemies.forEach(e=>{if(e.hp<=0)return;const d=_d.copy(player.position).sub(e.m.position);d.y=0;const l=d.length(),ang=Math.atan2(d.x,d.z),u=e.m.userData;
   let sl=(P.dom5>0||P.tf?0:1);if(P.dom4>0&&l<12)sl=0;if(P.lt>0&&DC&&Math.hypot(e.m.position.x-DC.x,e.m.position.z-DC.z)<DR){sl=0}if(P.ap>0){sl=0;if(apN)e.hp-=AP_BASE*dmgMul()*apN}   // Đệ Ngũ: NGƯNG ĐỘNG THỜI GIAN (quái đứng im hoàn toàn)
   if(sl>0&&!e.dummy){e.m.rotation.y=ang;e.cd-=dt;
    if(l>1.9){e.m.position.add(d.normalize().multiplyScalar(3.4*dt));e.wind=0;e.ph+=dt*8;
     u.lL.rotation.x=Math.sin(e.ph)*.7;u.lR.rotation.x=-Math.sin(e.ph)*.7;u.aL.rotation.x=u.aR.rotation.x=-1.45+Math.sin(e.ph)*.15}
    else{u.lL.rotation.x=u.lR.rotation.x=0;
     if(e.wind>0){e.wind-=dt;u.aL.rotation.x=u.aR.rotation.x=-2.7;   // gồng đòn 0.6s rồi mới đánh
      if(e.wind<=0){if(l<2.6&&player.position.y<3.5)hurt(12);e.cd=1.7;u.aL.rotation.x=u.aR.rotation.x=-.7}}
     else if(e.cd<=0&&player.position.y<3.5)e.wind=.6;
     else u.aL.rotation.x=u.aR.rotation.x=e.cd>1.2?-.7:-1.45}}
   e.hit-=fr;e.ms.forEach(m=>m.emissive.setHex(e.hit>0?0xbbbbbb:P.ap>0?0x886600:0))});
  enemies.forEach(e=>{const h=Math.max(0,e.hp);if(e.lh===undefined)e.lh=h;const d=e.lh-h;e.lh=h;if(e.inf){e.hp=1e15;e.lh=1e15}if(d>0){dmgSum+=d;dmgT=3.5;const el=$('dmg');el.style.transition='none';el.style.transform='translateX(-50%) scale(1.3)';requestAnimationFrame(()=>{el.style.transition='transform .15s';el.style.transform='translateX(-50%) scale(1)'})}});
  if(dmgT>0){dmgT-=dt;if(dmgT<=0){dmgT=0;dmgSum=0}}
  enemies=enemies.filter(e=>{if(e.hp<=0&&!e.dummy){scene.remove(e.m);freeObj(e.m);kills++;return false}return true});if(!enemies.length&&MAP=='main')spawn();
  if(P.hp<=0)say('Gục! Nhấn Enter / chạm để chơi lại',3000),P.hp<=0&&setTimeout(()=>{if(P.hp<=0)respawn()},2500);
  fx=fx.filter(f=>{f.life-=fr;const t=1-Math.max(0,f.life)/f.max;if(f.upd)f.upd(f,t);
   if(f.m.material&&f.m.material.opacity!==undefined&&!f.upd)f.m.material.opacity=Math.max(0,.9*(1-t));
   if(f.life<=0){scene.remove(f.m);freeObj(f.m);return false}return true});
 }
 // hiển thị trạng thái
 const pp=player.position,T=performance.now()/1000;
 {const air=P.fly>0||P.flyN>0||pp.y>.6,sw=P.mv&&!air?Math.sin(T*12)*.8:0;if(P.swing>0&&!paused)P.swing-=dt;
  PA.lL.rotation.x=air?.3:sw;PA.lR.rotation.x=air?-.3:-sw;PA.aL.rotation.x=air?-.4:-sw*.7;
  if(P.block){PA.aL.rotation.x=PA.aR.rotation.x=-1.4}
  else if(P.swing>0)PA.aR.rotation.x=-.4-Math.sin((1-P.swing/.25)*Math.PI)*2.4;
  else if(P.busy>0)PA.aR.rotation.x=-2.3+Math.sin(T*14)*.3;
  else PA.aR.rotation.x=-.35+sw*.7;
  swordLook();shadow.position.set(pp.x,.05,pp.z);shadow.scale.setScalar(1+pp.y*.04);shadow.material.opacity=Math.max(.08,.35-pp.y*.012);
  const ts=P.tf?'g':'';{const cb=P.cut>0?1:0;$('cb1').style.opacity=cb;$('cb2').style.opacity=cb}if(ts!==tsOn){tsOn=ts;cv.style.filter=ts=='g'?'grayscale(.9) contrast(1.15)':ts=='y'?'sepia(.9) saturate(2.5) hue-rotate(-8deg) brightness(1.05)':''}}
 const show=(o,on,fn)=>{if(on&&!o.parent)scene.add(o);if(!on&&o.parent)o.parent.remove(o);if(on&&fn)fn(o)};
 const at=(o)=>{o.position.x=pp.x;o.position.z=pp.z};
 show(S.kh,P.kh,o=>{o.position.set(pp.x-Math.sin(camYaw)*3.5,pp.y+1.6+Math.sin(T*2)*.25,pp.z-Math.cos(camYaw)*3.5);o.rotation.y=camYaw});show(S.blk,P.block,o=>o.position.set(pp.x,pp.y+1,pp.z));
 show(S.xich,P.xich,o=>{o.position.set(pp.x,pp.y+1,pp.z);o.children.forEach((m,i)=>{const a=i*.52+T*2;m.position.set(Math.cos(a)*1,Math.sin(a*2)*.8,Math.sin(a)*1)})});
 show(S.td,P.td,o=>{at(o);o.rotation.z=T});show(S.pwr,P.pwr>0,o=>{at(o);o.position.y=pp.y+1});
 show(S.f1,P.form==1,o=>{o.position.set(pp.x,pp.y,pp.z);o.rotation.y=T*2});show(S.f1g,P.form==1,o=>{o.position.set(pp.x-Math.sin(yaw)*0.8,pp.y+1.5,pp.z-Math.cos(yaw)*.8);o.rotation.y=yaw;o.rotation.z=T});
 show(S.f2,P.form==2,o=>{o.position.set(pp.x,pp.y+1,pp.z)});
 show(S.f3,P.form==3,o=>{o.position.set(pp.x,pp.y+1.2,pp.z);o.children.forEach((m,i)=>{const a=i*1.57+T*3;m.position.set(Math.cos(a)*2.6,Math.sin(a)*.6,Math.sin(a)*2.6);m.rotation.y=-a+1.57;animBeast(m,T)})});
 show(S.dom4,P.dom4>0,o=>{at(o);o.rotation.z=T*.3});show(S.dom5,P.dom5>0,o=>{at(o);o.rotation.z=-T*.2});
 S.dancers.forEach((m,i)=>show(m,P.dom4>0,o=>{const a=i*2.09+T;o.position.set(pp.x+Math.cos(a)*5,Math.abs(Math.sin(T*5+i))*.8,pp.z+Math.sin(a)*5);o.rotation.z=Math.sin(T*6+i)*.3}));
 if(P.lt>0&&domeG.parent){domeG.position.set(pp.x-Math.sin(yaw)*6,pp.y+4.5,pp.z-Math.cos(yaw)*6);domeG.scale.setScalar(.1);domeG.lookAt(cam.position);domeG.rotateZ(T*.5)}
 show(S.law,P.dom5>0,o=>{o.position.set(pp.x-Math.sin(yaw)*3.5,pp.y+3.8,pp.z-Math.cos(yaw)*3.5);o.lookAt(cam.position);o.rotateZ(T*.5)});
 show(S.gap,P.ap>0,o=>{o.position.set(pp.x-Math.sin(yaw)*9,pp.y,pp.z-Math.cos(yaw)*9);const[ax,az]=target();o.rotation.y=Math.atan2(ax-o.position.x,az-o.position.z)});
 if(shake>0){shake*=.9;if(shake<.2)shake=0}
 const sx=(Math.random()-.5)*shake*.1,sz=(Math.random()-.5)*shake*.1;
 if(P.cut>0){const k=1-P.cut/(P.cutMax||100),d=3.4-k*1.6;cam.up.set(0,1,0);cam.position.set(pp.x+Math.sin(yaw)*d,pp.y+1.9,pp.z+Math.cos(yaw)*d);cam.lookAt(pp.x,pp.y+1.65,pp.z)}else{const cp=Math.cos(camPitch),sn=Math.sin(camPitch),D=camDist;cam.up.set(-Math.sin(camYaw)*sn,cp,-Math.cos(camYaw)*sn);cam.position.set(pp.x+Math.sin(camYaw)*cp*D+sx,pp.y+1.5+sn*D,pp.z+Math.cos(camYaw)*cp*D+sz);cam.lookAt(pp.x,pp.y+1.5,pp.z)}skyM.position.copy(cam.position);gr.position.set(pp.x,0,pp.z);gtex.offset.set(pp.x/10,-pp.z/10);
 sX('hp','scaleX('+(Math.max(0,Math.min(1,P.hp/100))).toFixed(3)+')');sX('st','scaleX('+(Math.max(0,Math.min(1,P.st/100))).toFixed(3)+')');sT('hpT',Math.max(0,Math.round(P.hp)));sT('stT',Math.round(P.st));
 sT('killT',kills+' | ĐỢT '+wave+' (kỷ lục '+Math.max(best,wave)+')');sT('bStyle','KIẾM PHÁP: '+STYLES[P.sty].toUpperCase());sT('bSword','KIẾM: '+SWORDS[P.sw][0].toUpperCase());
 const tg=[['Kiếm Hồn',P.kh],['Thiên Địa',P.td],['Xích Giáp',P.xich],['Đệ Tứ',P.dom4>0],['Đệ Ngũ: Ngưng Thời Gian',P.dom5>0],['Áp Chế',P.ap>0],['Lãnh Địa',P.lt>0],['Hình thái '+P.form,P.form],['Hấp thụ '+Math.round(P.absorb),P.absorb>0],['Đỡ đòn',P.block],['Bất Tử (không tốn thể lực)',P.nost>0]];
 {const bh=tg.filter(x=>x[1]).map(x=>`<span>${x[0]}</span>`).join('');if(bh!==bhC){bhC=bh;$('buffs').innerHTML=bh}}
 for(const k in bt){const sp=SK[P.sty][k.toLowerCase()];if(sp){const c=P.cd[P.sty+(sp.cdk||k.toLowerCase())]||0;bt[k].classList.toggle('cd',c>0);const be=bt[k].firstChild,tx=c>0?(c>=10?Math.ceil(c):c.toFixed(1)):k;if(be.textContent!==tx)be.textContent=tx}const on={R:P.kh,T:P.td,Y:P.xich,H:P.ap>0,E:P.block}[k];if(k in{R:1,T:1,Y:1,H:1,E:1})bt[k].classList.toggle('on',!!on)}
 
 if(bt.R)bt.R.classList.toggle('lock',!!(P.td||P.xich));['T','Y','U'].forEach(k=>bt[k]&&bt[k].classList.toggle('lock',!!P.kh));
 if(P.ap>0&&Math.floor(T*4)!=P._b){P._b=Math.floor(T*4);enemies.slice(0,6).forEach(e=>mk('beam',{x:e.m.position.x,z:e.m.position.z,col:GOLD}))}
 {const dm=$('dmg');if(dmgSum>0&&dmgT>0){sT('dmg','-'+fmtNum(Math.round(dmgSum)));const op=dmgT<.5?+(dmgT/.5).toFixed(2):1;if(dm._o!==op){dm._o=op;dm.style.opacity=op}}else if(dm._o!==0){dm._o=0;dm.style.opacity=0}
  const d0=MAP=='test'?enemies.find(x=>x.dummy):null,eh=$('eh');
  if(d0){const sw=Math.sin(T*2);d0.m.rotation.z=sw*.07;d0.m.userData.aL.rotation.x=d0.m.userData.aR.rotation.x=.15+sw*.05;d0.stars.children.forEach((s,i)=>{const a=T*3+i*1.57;s.position.set(Math.cos(a)*.7,Math.sin(T*5+i)*.08,Math.sin(a)*.7)});
   const v=_v.set(d0.m.position.x,d0.m.position.y+3.6,d0.m.position.z).project(cam);
   if(v.z<1&&Math.abs(v.x)<1.3){const hpv=Math.max(0,Math.ceil(d0.hp)),pc=d0.inf?100:Math.max(0,Math.min(100,hpv/d0.max*100));eh.style.display='block';sX('eh','translate('+((v.x*.5+.5)*VW()).toFixed(0)+'px,'+((-v.y*.5+.5)*VH()).toFixed(0)+'px) translate(-50%,-100%)');sX('ehF','scaleX('+(pc/100).toFixed(3)+')');const tcv=d0.inf?'∞':fmtHp(hpv);if($('tpC').value!==tcv)$('tpC').value=tcv;if(!tpEdit){const tmv=d0.inf?'∞':fmtHp(d0.max);if($('tpM').value!==tmv)$('tpM').value=tmv}sT('ehT',d0.inf?'∞ / ∞':fmtNum(hpv)+' / '+fmtNum(d0.max))}else eh.style.display='none'}
  else eh.style.display='none'}
 ren.render(scene,cam)}
loop();
