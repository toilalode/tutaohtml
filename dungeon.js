'use strict';
(function(){
const KEY='tm_dungeon_v1',RED=0xff2a2a,VIO=0xb050ff;
const DG={power:0,hon:0,bone:0,kills:0,fused:0,style:0,khItem:0,vq:0,extreme:0,eq:0};
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d)for(const k in DG)if(Number.isFinite(d[k])&&d[k]>=0)DG[k]=d[k]}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(DG))}catch(e){}};
setInterval(save,2000);addEventListener('pagehide',save);
const rs=window.resetSave;window.resetSave=()=>{try{localStorage.removeItem(KEY)}catch(e){}rs()};
const MAXST=500000;let realSw=P.sw,st=MAXST;
Object.defineProperty(P,'st',{get:()=>st,set:v=>{if(v===100&&st>100)return;st=v},configurable:true,enumerable:true});
Object.defineProperty(P,'sw',{get:()=>realSw==3?2:realSw,set:v=>{realSw=v},configurable:true,enumerable:true});
if(DG.fused&&DG.eq)realSw=3;
const hyp=Math.hypot,now=()=>performance.now(),pl=()=>player.position;
const fusedOn=()=>!!DG.fused&&realSw==3,bigSty=()=>P.sty==0||P.sty==1||P.sty==5,boosted=()=>fusedOn()&&bigSty(),soulOn=()=>!!DG.khItem&&P.kh>0&&boosted();
const frozen=()=>P.dom5>0||P.tf>0||P.ap>0;
const fmt=n=>n>=1e9?(n/1e9).toFixed(2)+' tỷ':n>=1e6?(n/1e6).toFixed(1)+' tr':Math.ceil(n).toLocaleString('vi-VN');
let swOv=0,prev='main',B=null,world=null,npcs=[],near=null,dfx=[],souls=[],army=null,giant=null,origSky=null,dgSkyT=null,leaving=0,m2T=0,tw=0,tone=false,toneK=false,toneR=false,lunge=null,pose={k:'',t:0},xb={};

const refill=()=>{st=MAXST};
const baseDmg=dmgMul,baseCost=costMul,baseHit=hit,baseMk=mk,baseCast=cast,baseSet=setMap,baseResp=respawn,baseBuild=buildBtns,baseSay=say,baseRule=ruleSkill,baseBuff=buff,baseSync=syncRT,baseStyle=setStyle,basePopup=popup;
dmgMul=function(){let m=baseDmg();if(boosted()){m*=50;if(soulOn())m*=P.sty==0?1000:101000;if(DG.khItem&&(P.ap>0||now()<m2T))m*=5}return m};
costMul=function(){const c=baseCost();return fusedOn()?{cd:c.cd*.01,st:c.st*.01}:c};
const M1=[5e4,7.5e4,1.25e5],M1F=2e5,baseAtk=atk;let m1=false;
atk=function(){m1=true;try{baseAtk()}finally{m1=false}};
hit=function(x,z,r,d,kb){if(m1)d=3*(fusedOn()?M1F:M1[Math.max(0,Math.min(2,P.sw))])/SWORDS[P.sw][1];return baseHit(x,z,boosted()?r*15:r,d,kb)};
mk=function(kind,o){if(fusedOn()&&o&&o.col!==undefined&&o.col!==0xffffff&&o.col!==0x9fd8ff){if(P.sty==5)o=Object.assign({},o,{col:RED});else if(P.sty<2){tw^=1;o=Object.assign({},o,{col:tw?GOLD:RED})}}return baseMk(kind,o)};
cast=function(k){if(P.sty==5&&!fusedOn())return;const lk=k.toLowerCase(),sp=(SK[P.sty]||{})[lk],ck=sp&&P.sty+(sp.cdk||lk),was=ck?P.cd[ck]||0:0;baseCast(k);if(B&&B.ext&&ck&&!(was>0)&&P.cd[ck]>0)P.cd[ck]*=1.05};
setStyle=function(n){if(n==5&&!fusedOn())return toast('Chung Yên Kiếm Pháp chỉ dùng với Thiên Mệnh Kiếm — Dung Hợp Chung Yên');baseStyle(n)};
ruleSkill=function(k){m2T=now()+8000;return baseRule(k)};
const khCY=()=>fusedOn()&&!!DG.khItem&&(P.sty==5||(P.sty==1&&rtyuOk()));
syncRT=function(){const k=P.kh,a=P.ap,ok=khCY();baseSync();if(ok){P.kh=k;P.ap=a}};
buff=function(k){k=k.toUpperCase();if(k=='R'&&khCY()){if(paused)return;if(P.td||P.xich)return toast('Đang bật Thiên Địa/Xích Giáp (T/Y): cấm dùng Kiếm Hồn (R)');P.kh=P.kh?0:1;if(!P.kh)P.ap=0;say('Kiếm Hồn Chung Yên — '+(P.kh?'BẬT':'TẮT'),1000);if(P.kh)flash(GOLD);return}return baseBuff(k)};
say=function(t,ms){const r=baseSay(t,ms);if(t==='Vô Đầu Dục Huyết!')setPose('raise');else if(t==='Bại Nhi Bất Chỉ!')setPose('back');else if(t==='Kiếm Thích Vũ Bộ Trảm!'){setPose('dash');startLunge()}return r};
mapMenu=function(){if(castBusy())return;popup('Chọn map',['Map chính (đợt quái)','Test (quái bù nhìn)','Phó bản Chung Yên Hoàng Đế'],MAP=='test'?1:MAP=='dungeon'?2:0,i=>setMap(['main','test','dungeon'][i]))};
setMap=function(m){const was=MAP;if(was=='dungeon')dgLeave();if(m!='dungeon'){baseSet(m);refill();return}if(was!='dungeon')prev=was;baseSet('main');enemies.forEach(e=>{scene.remove(e.m);freeObj(e.m)});enemies=[];wave=0;MAP='dungeon';refill();dgEnter()};
respawn=function(){if(MAP=='dungeon'){setMap(prev);return}baseResp();refill()};
buildBtns=function(){baseBuild();extra()};
popup=function(title,opts,cur,fn){return basePopup(title,opts,title=='Chọn kiếm'?realSw:cur,fn)};

const setPose=k=>{pose={k,t:now()+1100}};
function startLunge(){const q=pl(),y=yaw;lunge={t:.28,vx:Math.sin(y)*28,vz:Math.cos(y)*28};for(let i=0;i<4;i++)FXK('ghost',{x:q.x-Math.sin(y)*i*1.5,z:q.z-Math.cos(y)*i*1.5,col:GOLD,life:16});FXK('ring',{r:5,life:16,col:GOLD})}
function applyPose(){
 $('st').style.transform='scaleX('+Math.max(0,Math.min(1,st/MAXST)).toFixed(3)+')';
 if(fusedOn()){PA.sb.material.color.setHex(0xffb000);PA.sg.material.color.setHex(RED)}
 const a=PA.aR;
 if(pose.t>now()){if(pose.k=='raise'){a.rotation.x=-3;a.rotation.z=0}else if(pose.k=='back'){a.rotation.x=-1.6;a.rotation.z=-1.4}else{a.rotation.x=-2.3;a.rotation.z=0}}else a.rotation.z=0}
{const rd=ren.render.bind(ren);ren.render=function(s,c){applyPose();return rd(s,c)}}

const mG=mat(GOLD,.5),mR=mat(RED,.5);
// Kiếm Hồn Chung Yên (S.kh) và bóng Áp Chế (S.gap): luôn màu đỏ. Xích Giáp: nửa vàng nửa đỏ (đỏ hoàn toàn khi dùng Chung Yên Kiếm Pháp)
function setTone(on,kh,red){[[S.kh,kh||red,1],[S.gap,kh||red,1],[S.xich,on,red]].forEach(([g,o,r])=>{let i=0;g.traverse(c=>{if(!c.isMesh)return;if(!c.userData.om)c.userData.om=c.material;c.material=o?(r?mR:(i++%2?mR:mG)):c.userData.om})});S.td.material.color.setHex(on?0xff7a1a:GOLD)}

function owned(){
 if(DG.fused&&SWORDS.length<4)SWORDS.push(['Thiên Mệnh Kiếm — Dung Hợp Chung Yên (Chung Yên)',1.7]);
 if(DG.style&&STYLES.length<6){STYLES.push('Chung Yên Kiếm Pháp');STCOL.push(RED)}
 if(!DG.style&&P.sty==5){P.sty=1;syncRT()}}

const dialog=(title,opts,fn)=>{popup(title,opts,-1,fn);const o=$('popts');o.lastChild.textContent='Hủy Popup';o.style.pointerEvents='none';setTimeout(()=>{o.style.pointerEvents=''},450)};
const ITEMS=[['fused','Thiên Mệnh Kiếm — Dung Hợp Chung Yên','power',70],['style','Chung Yên Kiếm Pháp','power',30],['khItem','Kiếm Hồn Chung Yên (nút R)','hon',40],['vq','Vạn Quái Cận Kiến + Vạn Quái Quy Nhất','bone',100000]],CN={power:'lõi sức mạnh',hon:'lõi kiếm hồn',bone:'xương quái'};
function bossNpc(){dialog('Chung Yên Tận Diệt',['Khiêu chiến Chung Yên Hoàng Đế','Xem chiến tích','Chế độ Cực Hạn: '+(DG.extreme?'BẬT':'TẮT')],i=>{if(i==0)startFight();else if(i==1)setTimeout(stats,0);else toggleExt()})}
function stats(){dialog('Chiến tích Chung Yên',['Boss đã hạ: '+DG.kills,'Lõi sức mạnh: '+DG.power,'Lõi kiếm hồn: '+DG.hon,'Xương quái ngoài hành tinh: '+DG.bone],()=>{})}
function toggleExt(){if(B)toast('Không đổi Cực Hạn khi đang đánh boss');else{DG.extreme^=1;save();toast(DG.extreme?'Cực Hạn BẬT: máu boss ×10, sát thương boss ×3, hồi chiêu +5%':'Cực Hạn TẮT')}setTimeout(bossNpc,0)}
function shopNpc(){dialog('Thương Nhân Chung Yên — SM '+DG.power+' | KH '+DG.hon+' | Xương '+DG.bone,ITEMS.map((it,i)=>(i+1)+'. '+it[1]+' — '+it[3]+' '+CN[it[2]]+(DG[it[0]]?' [ĐÃ CÓ]':'')),i=>buy(ITEMS[i]))}
function buy(it){const[k,n,c,p]=it;if(DG[k])toast('Đã sở hữu '+n);else if(DG[c]<p)toast('Không đủ '+CN[c]+' (cần '+p+')');else{DG[c]-=p;DG[k]=1;owned();buildBtns();save();say('Đã đổi: '+n+(k=='fused'?' — mở menu Kiếm (phím 2) để chọn':''),2600);flash(GOLD)}setTimeout(shopNpc,0)}
function talk(){if(paused||MAP!='dungeon'||!near)return;near.fn()}
const VQM=1e11,iosV=(/\bOS (\d+)_/.exec(navigator.userAgent)||[])[1],LOW=!!(WEAK||(iosV&&+iosV<=14));window.LOW=LOW;
const BONE=[{n:'Vạn Quái Cận Kiến',cd:30,sta:40,fn:canKien},{n:'Vạn Quái Quy Nhất',cd:20,sta:40,fn:quyNhat}];
function castBone(i){
 if(paused||P.block||P.lk>0||!DG.vq)return;
 if(!fusedOn())return toast('Chỉ dùng được với Thiên Mệnh Kiếm — Dung Hợp Chung Yên');
 if(i==0&&army)return endArmy(true);
 if(i==1&&giant)return endGiant(true);
 const s=BONE[i],ck='vq'+i;if(P.cd[ck]>0)return;
 const cm=costMul(),sc=s.sta*cm.st;if(!(P.nost>0)){if(P.st<sc)return toast('Thiếu thể lực');P.st-=sc}
 P.cd[ck]=s.cd*cm.cd*((B&&B.ext)?1.05:1);say(s.n,1500);s.fn()}

const foe=(d,x,z,r)=>{enemies.forEach(e=>{if(e.hp>0&&hyp(e.m.position.x-x,e.m.position.z-z)<r){e.hp-=d;e.hit=8}})};
const nearFoe=(x,z)=>{let b=null,bd=1e9;enemies.forEach(e=>{if(e.hp>0){const d=hyp(e.m.position.x-x,e.m.position.z-z);if(d<bd){bd=d;b=e}}});return b?{e:b,d:bd}:null};
const STUN=3;
function addStars(e){const g=new THREE.Group();for(let i=0;i<4;i++)g.add(new THREE.Mesh(G('DGSTR',()=>new THREE.SphereGeometry(.14,8,6)),new THREE.MeshBasicMaterial({color:0xffe14d})));g.position.y=2.9;e.m.add(g);e.stk=g}
function dropStars(e){if(!e.stk)return;e.m.remove(e.stk);e.stk.children.forEach(c=>c.material.dispose());e.stk=null}
function stunFoe(e,sec){if(e.hp<=0)return;if(!e.dummy){e.dummy=1;e.sk=1;e.wind=0}if(!e.stars&&!e.stk)addStars(e);e.stunT=Math.max(e.stunT||0,sec)}
const stunAt=(x,z,r,sec)=>{enemies.forEach(e=>{if(hyp(e.m.position.x-x,e.m.position.z-z)<r)stunFoe(e,sec)})};
function stunStep(dt,T){enemies.forEach(e=>{if(!(e.stunT>0))return;e.stunT-=dt;if(e.stk)e.stk.children.forEach((s,i)=>{const a=T*3+i*1.57;s.position.set(Math.cos(a)*.7,Math.sin(T*5+i)*.08,Math.sin(a)*.7)});if(e.stunT<=0||e.hp<=0){e.stunT=0;if(e.sk){e.sk=0;e.dummy=0;e.cd=Math.max(e.cd,.6)}dropStars(e)}})}
function canKien(){
 endArmy(false);const[tx,tz]=target(),n=10000;
 baseMk('hole',{x:tx,z:tz,r:6,col:VIO});flash(VIO);
 const ox=new Float32Array(n),oz=new Float32Array(n),ph=new Float32Array(n),pos=new Float32Array(n*3),cols=new Float32Array(n*3);
 for(let i=0;i<n;i++){const c=i%2?[.69,.31,1]:[.48,.19,.75];cols.set(c,i*3)}
 for(let i=0;i<n;i++){const r=Math.sqrt(Math.random())*22,a=Math.random()*6.283;ox[i]=Math.cos(a)*r;oz[i]=Math.sin(a)*r;ph[i]=Math.random()*6.283}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(cols,3));
 const pts=new THREE.Points(geo,new THREE.PointsMaterial({vertexColors:true,size:1.2,transparent:true,opacity:.9,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);
 const figs=[];for(let i=0;i<(LOW?8:18);i++){const f=roblox({angry:1,skin:0x7a30c0,shirt:0x2a0a40,pants:0x120020});f.scale.setScalar(1.8);scene.add(f);figs.push(f)}
 army={x:tx,z:tz,n,n0:LOW?3000:n,t:0,life:25,acc:0,ox,oz,ph,pos,geo,pts,figs}}
function armyStep(dt,T){
 const a=army;if(!a)return;
 a.t+=dt;const f=nearFoe(a.x,a.z),q=pl(),tx=f?f.e.m.position.x:q.x+8,tz=f?f.e.m.position.z:q.z+8,d=hyp(tx-a.x,tz-a.z);
 if(d>(f?9:2)){const s=Math.min(d,16*dt);a.x+=(tx-a.x)/d*s;a.z+=(tz-a.z)/d*s}
 if(f){stunAt(a.x,a.z,90,STUN);foe(a.n*1e6*VQM*2*dt,a.x,a.z,90)}
 for(let i=0;i<a.n0;i++){const j=i*3;a.pos[j]=a.x+a.ox[i]+Math.sin(T*3+a.ph[i])*.6;a.pos[j+1]=.5+Math.abs(Math.sin(T*6+a.ph[i]))*.8;a.pos[j+2]=a.z+a.oz[i]+Math.cos(T*3+a.ph[i])*.6}
 a.geo.attributes.position.needsUpdate=true;a.geo.setDrawRange(0,Math.max(1,Math.min(a.n0,Math.ceil(a.n))));
 a.figs.forEach((f2,i)=>{const an=i*.349+T*.5,w=Math.sin(T*10+i);f2.position.set(a.x+Math.cos(an)*(6+i%3*4),0,a.z+Math.sin(an)*(6+i%3*4));f2.rotation.y=Math.atan2(tx-f2.position.x,tz-f2.position.z);const u=f2.userData;u.lL.rotation.x=w*.7;u.lR.rotation.x=-w*.7;u.aL.rotation.x=u.aR.rotation.x=-1.4+w*.3});
 }
function endArmy(ex){
 const a=army;if(!a)return;army=null;
 if(ex&&a.n>0){stunAt(a.x,a.z,140,STUN);foe(a.n*1e8*VQM,a.x,a.z,140);baseMk('boom',{x:a.x,z:a.z,r:24,col:VIO});baseMk('boom',{x:a.x,z:a.z,r:18,col:0x7a30c0});flash(VIO);shake=Math.max(shake,18)}
 scene.remove(a.pts);a.geo.dispose();a.pts.material.dispose();a.figs.forEach(f=>{scene.remove(f);freeObj(f)})}
function quyNhat(){
 const[tx,tz]=target(),a=army||{x:tx,z:tz};endArmy(false);
 const g=roblox({angry:1,skin:0x7a30c0,shirt:0x2a0a40,pants:0x120020,sword:2});g.scale.setScalar(9);g.position.set(a.x,0,a.z);scene.add(g);
 giant={g,x:a.x,z:a.z,hp:1e5,t:0,life:14,acc:0};baseMk('ring',{r:20,life:30,col:VIO});baseMk('ring',{r:14,life:30,col:0x7a30c0});flash(VIO);shake=Math.max(shake,12)}
function giantStep(dt,T){
 const g=giant;if(!g)return;
 g.t+=dt;const f=nearFoe(g.x,g.z),q=pl(),tx=f?f.e.m.position.x:q.x,tz=f?f.e.m.position.z:q.z,d=hyp(tx-g.x,tz-g.z);
 if(d>10){const s=Math.min(d,28*dt);g.x+=(tx-g.x)/d*s;g.z+=(tz-g.z)/d*s}
 if(f){stunAt(g.x,g.z,22,STUN);foe(1e8*VQM*20*dt,g.x,g.z,22)}
 g.g.position.set(g.x,0,g.z);g.g.rotation.y=Math.atan2(tx-g.x,tz-g.z);
 const u=g.g.userData,w=Math.sin(T*10);u.aL.rotation.x=u.aR.rotation.x=-1.4+w*.3;u.lL.rotation.x=w*.6;u.lR.rotation.x=-w*.6;
 }
function endGiant(ex){
 const g=giant;if(!g)return;giant=null;
 if(ex){stunAt(g.x,g.z,150,STUN);foe(1e11*VQM,g.x,g.z,150);baseMk('boom',{x:g.x,z:g.z,r:30,col:VIO});baseMk('boom',{x:g.x,z:g.z,r:22,col:0x7a30c0});flash(VIO);shake=Math.max(shake,22)}
 scene.remove(g.g);freeObj(g.g)}
function armyHit(x,z,r,d){
 const w=Math.ceil(d*80)*1e8*VQM;
 if(army&&hyp(army.x-x,army.z-z)<r+22)foe(w,army.x,army.z,120);
 if(giant&&hyp(giant.x-x,giant.z-z)<r+8)foe(w,giant.x,giant.z,120)}

const fxAdd=(m,sec,upd)=>{scene.add(m);dfx.push({m,t:0,max:sec,upd})};
function fxStep(dt){dfx=dfx.filter(f=>{f.t+=dt;if(f.upd)f.upd(Math.min(1,f.t/f.max));if(f.t>=f.max){scene.remove(f.m);freeObj(f.m);return false}return true})}
const disc=(x,z,r,c,o)=>{const m=new THREE.Mesh(G('DGD',()=>new THREE.CircleGeometry(1,40)),mat(c,o));m.rotation.x=-Math.PI/2;m.position.set(x,.14,z);m.scale.setScalar(r);return m};
const ringM=(x,z,c,o)=>{const m=new THREE.Mesh(G('DGR',()=>new THREE.RingGeometry(.9,1,40)),mat(c,o));m.rotation.x=-Math.PI/2;m.position.set(x,.16,z);return m};
const bar=(x,z,a,len,w,c,o)=>{const m=new THREE.Mesh(G('DGB',()=>new THREE.BoxGeometry(1,.12,1)),mat(c,o));m.scale.set(w,1,len);m.position.set(x+Math.sin(a)*len/2,.2,z+Math.cos(a)*len/2);m.rotation.y=a;return m};
function warn(x,z,r,sec){const d=disc(x,z,r,RED,.2),o=ringM(x,z,RED,.8);o.scale.setScalar(r);fxAdd(d,sec,k=>{d.material.opacity=.12+.3*k});fxAdd(o,sec)}
function burst(x,z,r,c){const o=ringM(x,z,c,.9);fxAdd(o,.45,k=>{o.scale.setScalar(r*(.3+k*.7));o.material.opacity=.9*(1-k)})}
const later=(sec,fn)=>{B.q.push({t:sec,fn})};
const bp=()=>B.e.m.position;
const arm=(a,ms)=>{B.arm=a;B.armT=now()+ms};
const harm=d=>{if(B&&P.hp>0)hurt(d*B.dm)};
const inR=(x,z,r)=>{const q=pl();return q.y<3.5&&hyp(q.x-x,q.z-z)<r};

const ATK={
 cleave(){const p=bp(),x=p.x,z=p.z,w=B.form==1?1.6:1.2;B.busy=w+.9;arm(-2.9,w*1000);warn(x,z,7,w);later(w,()=>{arm(.3,300);burst(x,z,7,GOLD);shake=Math.max(shake,8);if(inR(x,z,7))harm(22);armyHit(x,z,7,22)})},
 beams(){const p=bp(),px=p.x,pz=p.z,n=B.form==1?3:5,w=1.5,base=Math.atan2(pl().x-px,pl().z-pz);B.busy=w+.9;arm(-2.9,w*1000);
  for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*.3;fxAdd(bar(px,pz,a,75,1.8,RED,.35),w);
   later(w,()=>{const b=bar(px,pz,a,75,1.8,GOLD,.9);fxAdd(b,.3,k=>{b.material.opacity=.9*(1-k)});arm(.3,300);const q=pl(),dx=q.x-px,dz=q.z-pz,pr=dx*Math.sin(a)+dz*Math.cos(a),pe=Math.abs(dx*Math.cos(a)-dz*Math.sin(a));if(pr>0&&pr<75&&pe<1.2&&q.y<3.5)harm(18)})}},
 rain(){const n=B.form==1?10:16;B.busy=n*.12+1.8;arm(-2.9,n*120);
  for(let i=0;i<n;i++)later(i*.12,()=>{const q=pl(),a=Math.random()*6.283,r=Math.random()*14,x=q.x+Math.cos(a)*r,z=q.z+Math.sin(a)*r;warn(x,z,2.2,1.5);later(1.5,()=>{baseMk('blade',{x,z,col:RED});if(inR(x,z,2.2))harm(14);armyHit(x,z,2.2,14)})})},
 nova(){const p=bp(),x=p.x,z=p.z,r=B.form==1?16:18,w=2.6;B.busy=w+.9;arm(-3,w*1000);say('Chung Yên Bạo!',1200);warn(x,z,r,w);
  later(w,()=>{arm(.3,300);const s=new THREE.Mesh(G('DGS',()=>new THREE.SphereGeometry(1,16,12)),mat(GOLD,.5));s.position.set(x,1,z);fxAdd(s,.6,k=>{s.scale.setScalar(r*k+.1);s.material.opacity=.5*(1-k)});burst(x,z,r,RED);flash(GOLD);shake=Math.max(shake,16);if(inR(x,z,r))harm(B.form==1?38:46);armyHit(x,z,r,38)})},
 souls(){B.busy=1.3;arm(-2.9,900);say('Kiếm Hồn Hộ Chủ!',1200);spawnSouls()},
 dash(){const p=bp(),x=p.x,z=p.z,q=pl(),a=Math.atan2(q.x-x,q.z-z),d=Math.min(40,hyp(q.x-x,q.z-z));B.busy=2.4;arm(-2.9,1100);fxAdd(bar(x,z,a,d,3.5,RED,.3),1.1);
  later(1.1,()=>{B.rush={t:.3,vx:Math.sin(a)*d/.3,vz:Math.cos(a)*d/.3};later(.35,()=>{const e=bp(),ex=e.x,ez=e.z;arm(.3,300);burst(ex,ez,6,GOLD);if(inR(ex,ez,6))harm(24);armyHit(ex,ez,6,24)})})},
 wave(){const p=bp(),px=p.x,pz=p.z;B.busy=3;say('Chung Yên Trảm Địa!',1200);arm(-2.9,1000);
  later(1,()=>{arm(.3,300);const o=ringM(px,pz,GOLD,.9);let done=0;fxAdd(o,1.7,k=>{const r=3+k*60;o.scale.setScalar(r);o.material.opacity=.9*(1-k*.6);const q=pl();if(!done&&B&&q.y<3.5&&Math.abs(hyp(q.x-px,q.z-pz)-r)<1.5){done=1;harm(26)}})})},
 heal(){B.busy=2.4;B.hl={t:2,acc:0};B.healCd=12;say('Chung Yên Hồi Sinh!',1400);arm(-3,3000)},
 ult(){const p=bp(),x=p.x,z=p.z;B.busy=6.2;B.ultCd=45;say('Chung Yên Hủy Diệt — tránh ra khỏi vòng đỏ!',3000);arm(-3,5000);warn(x,z,45,5);flash(RED);
  later(5,()=>{burst(x,z,45,GOLD);flash(0xffffff);shake=Math.max(shake,20);if(inR(x,z,45))harm(70);armyHit(x,z,45,70)})}
};
function pick(){
 const e=B.e,p=e.m.position,q=pl(),d=hyp(q.x-p.x,q.z-p.z),f2=B.form==2;
 if(B.healCd<=0&&e.hp<B.max*.9)return ATK.heal();
 if(f2&&B.ultCd<=0&&e.hp<B.max*.3)return ATK.ult();
 const pool=d<18?['cleave','cleave','nova','rain','beams','souls']:['beams','rain','souls','dash','nova'];if(f2)pool.push('wave','dash');
 let k=pool[Math.random()*pool.length|0];if(window.bossAI){let a=null;try{a=window.bossAI({form:B.form,boss:e.hp/B.max,dist:d,pool:pool.slice(),me:P.hp,souls:souls.length})}catch(_){}if(a&&pool.includes(a))k=a}if(k=='souls'&&souls.length)k='rain';
 ATK[k]();B.cd=f2?.8:1.6}
function spawnSouls(){
 const n=B.form==1?3:5;
 for(let i=0;i<n;i++){const g=new THREE.Group(),b=new THREE.Mesh(G('DGSB',()=>new THREE.BoxGeometry(.3,.3,5)),mat(GOLD,.9)),c=new THREE.Mesh(G('DGSG',()=>new THREE.BoxGeometry(1.7,.2,.3)),mat(RED,.9));c.position.z=-1.4;g.add(b,c);g.scale.setScalar(1.5);scene.add(g);souls.push({m:g,i,a:i/n*6.283,mode:0,t:1.2+i*.45,k:0,life:10,x:0,y:7,z:0,fx:0,fy:0,fz:0,tx:0,tz:0})}}
function clearSouls(){souls.forEach(s=>{scene.remove(s.m);freeObj(s.m)});souls=[]}

function makeBoss(form,ext){
 const g=roblox({skin:0xe8c8a0,shirt:0x4a0c12,pants:0x16080c,sword:2.4}),ms=[];
 g.scale.setScalar(4.4);g.position.set(0,0,-48);
 g.traverse(c=>{if(c.isMesh)(Array.isArray(c.material)?c.material:[c.material]).forEach(x=>{if(x.emissive&&!ms.includes(x))ms.push(x)})});
 const gold=new THREE.MeshBasicMaterial({color:GOLD});
 for(let i=0;i<5;i++){const a=i*1.2566,k=new THREE.Mesh(G('DGC5',()=>new THREE.ConeGeometry(.08,.3,4)),gold);k.position.set(Math.cos(a)*.2,2.05,Math.sin(a)*.2);g.add(k)}
 const cape=new THREE.Mesh(G('DGCP',()=>new THREE.PlaneGeometry(.9,1.5)),new THREE.MeshBasicMaterial({color:0x8a0a1a,side:THREE.DoubleSide}));cape.position.set(0,1.05,-.25);g.add(cape);
 scene.add(g);
 const max=(form==1?1e11:1.5e11)*(ext?10:1),e={m:g,ms,hp:max,max,lh:max,hit:0,cd:99,wind:0,ph:0,dummy:1,boss:1};enemies.push(e);
 return{e,form,ext,dm:(ext?3:1)*600,max,q:[],cd:2.5,busy:0,healCd:14,ultCd:30,hl:null,inv:0,ph:0,arm:0,armT:0,rush:null,lastHp:max}}
function formTwo(){
 const g=B.e.m;g.scale.setScalar(5);
 [-1,1].forEach(s=>{const w=new THREE.Mesh(G('DGW',()=>new THREE.PlaneGeometry(2.6,2)),new THREE.MeshBasicMaterial({color:s<0?GOLD:RED,transparent:true,opacity:.85,side:THREE.DoubleSide}));w.position.set(s*1.3,1.5,-.35);w.rotation.z=-s*.5;g.add(w)})}
function startFight(){
 if(B)return toast('Đang giao chiến với Chung Yên Hoàng Đế');
 B=makeBoss(1,DG.extreme?1:0);say('Chung Yên Hoàng Đế giáng thế!',2600);flash(RED);shake=Math.max(shake,14)}
function reward(x){
 let p,h,b;if(x){p=15;h=10;b=6000}else{p=Math.random()<.9?1:0;h=Math.random()<.7?1:0;b=500}
 DG.power+=p;DG.hon+=h;DG.bone+=b;DG.kills++;save();
 return '+'+p+' lõi sức mạnh, +'+h+' lõi kiếm hồn, +'+b+' xương quái'}
function bossDown(){
 const e=B.e;
 if(B.form==1){
  B.form=2;B.max=1.5e11*(B.ext?10:1);e.hp=B.max;e.lh=B.max;B.lastHp=B.max;B.inv=0;B.q=[];B.hl=null;B.rush=null;B.busy=0;B.cd=3.4;clearSouls();formTwo();
  say('Chung Yên Hoàng Đế — Dạng Hai!',2800);flash(GOLD);shake=Math.max(shake,18);burst(e.m.position.x,e.m.position.z,30,GOLD)}
 else{
  scene.remove(e.m);freeObj(e.m);enemies=enemies.filter(x=>x!==e);clearSouls();
  const r=reward(B.ext);B=null;say('Chiến thắng! '+r,5000);flash(GOLD)}}
function bossStep(dt,T){
 const e=B.e,g=e.m,p=g.position,q=pl(),u=g.userData,f2=B.form==2;
 if(e.hp<=0&&B.inv<=0)return bossDown();
 if(B.inv>0){B.inv-=dt;e.hp=B.max;e.lh=B.max;B.lastHp=B.max}
 const bdt=frozen()||e.stunT>0?0:dt,tp=Math.atan2(q.x-p.x,q.z-p.z),lost=B.lastHp-e.hp;
 if(B.hl&&lost>0){B.hl.acc+=lost;if(B.hl.acc>=B.max*.03){B.hl=null;B.busy=0;B.cd=1.2;arm(.3,300);say('Hồi Sinh bị gián đoạn!',1200)}}
 g.rotation.y=tp;
 if(B.inv<=0&&bdt>0){
  if(B.rush){p.x+=B.rush.vx*bdt;p.z+=B.rush.vz*bdt;B.rush.t-=bdt;if(B.rush.t<=0)B.rush=null}
  else if(B.busy<=0&&!B.hl){const d=hyp(q.x-p.x,q.z-p.z);if(d>10){const s=(f2?7.5:5)*bdt;p.x+=Math.sin(tp)*s;p.z+=Math.cos(tp)*s;B.ph+=bdt*7}}
  const r=hyp(p.x,p.z);if(r>100){p.x*=100/r;p.z*=100/r}
  const old=B.q;B.q=[];old.forEach(a=>{a.t-=bdt;if(a.t<=0)a.fn();else B.q.push(a)});
  B.busy-=bdt;B.cd-=bdt;B.healCd-=bdt;B.ultCd-=bdt;
  if(B.hl){B.hl.t-=bdt;e.hp=Math.min(B.max,e.hp+B.max*(f2?.10:.14)*bdt);if(Math.random()<.12)burst(p.x,p.z,9,0x50ff90);if(B.hl.t<=0){B.hl=null;B.busy=Math.max(B.busy,.3);arm(.3,300)}}
  else if(B.busy<=0&&B.cd<=0)pick()}
 souls=souls.filter(s=>{
  s.life-=bdt;if(s.life<=0){scene.remove(s.m);freeObj(s.m);return false}
  if(s.mode==0){s.a+=bdt*2.2;s.x=p.x+Math.cos(s.a)*8;s.y=7+Math.sin(T*3+s.i)*.7;s.z=p.z+Math.sin(s.a)*8;s.t-=bdt;
   if(s.t<=0){s.mode=1;s.k=0;s.fx=s.x;s.fy=s.y;s.fz=s.z;s.tx=q.x;s.tz=q.z;warn(q.x,q.z,2,.9)}}
  else{s.k+=bdt/.9;const k=Math.min(1,s.k);s.x=s.fx+(s.tx-s.fx)*k;s.y=s.fy+(.6-s.fy)*k;s.z=s.fz+(s.tz-s.fz)*k;
   if(s.k>=1){burst(s.tx,s.tz,2.5,RED);if(inR(s.tx,s.tz,2)){harm(16*(f2?1.25:1));e.hp=Math.min(B.max,e.hp+B.max*.004)}s.mode=0;s.t=1.4+Math.random()*1.6}}
  s.m.position.set(s.x,s.y,s.z);s.m.lookAt(s.mode?s.tx:q.x,s.mode?0:1.5,s.mode?s.tz:q.z);return true});
 const a=B.armT>now()?B.arm:-.9+Math.sin(T*2)*.12;
 u.aL.rotation.x=a;u.aR.rotation.x=a;u.lL.rotation.x=Math.sin(B.ph)*.6;u.lR.rotation.x=-Math.sin(B.ph)*.6;
 B.lastHp=e.hp}

function dgSky(){
 if(dgSkyT)return dgSkyT;
 const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d'),gr2=g.createLinearGradient(0,0,0,512);
 gr2.addColorStop(0,'#0a0208');gr2.addColorStop(.5,'#3a0a16');gr2.addColorStop(.52,'#8a2a14');gr2.addColorStop(1,'#2a0a0a');g.fillStyle=gr2;g.fillRect(0,0,1024,512);
 for(let i=0;i<220;i++){g.fillStyle='rgba(255,200,120,'+Math.random()*.8+')';g.fillRect(Math.random()*1024,Math.random()*250,2,2)}
 return dgSkyT=new THREE.CanvasTexture(c)}
function buildWorld(){
 const w=new THREE.Group(),pil=G('DGP',()=>new THREE.CylinderGeometry(2.2,2.8,30,10)),cap=G('DGK',()=>new THREE.BoxGeometry(3.6,1,3.6));
 for(let i=0;i<16;i++){const a=i/16*6.283,x=Math.cos(a)*92,z=Math.sin(a)*92,p=new THREE.Mesh(pil,new THREE.MeshLambertMaterial({color:0x3a1018})),k=new THREE.Mesh(cap,new THREE.MeshBasicMaterial({color:i%2?GOLD:RED}));p.position.set(x,15,z);k.position.set(x,30.5,z);w.add(p,k)}
 const s=plane(texBagua,76,.55);s.rotation.x=-Math.PI/2;s.position.set(0,.06,-48);w.add(s);
 const h=new THREE.Mesh(G('DGD',()=>new THREE.CircleGeometry(1,40)),new THREE.MeshLambertMaterial({color:0x2a0c14}));h.rotation.x=-Math.PI/2;h.scale.setScalar(16);h.position.set(0,.08,-4);w.add(h);
 return w}
function npc(label,shirt,x,z,fn){
 const g=roblox({skin:0xf0d4b0,shirt,pants:0x1a1020,sword:1.4});g.scale.setScalar(1.7);g.position.set(x,0,z);
 const c=document.createElement('canvas');c.width=512;c.height=96;const t=c.getContext('2d');t.font='bold 40px "Courier New",monospace';t.textAlign='center';t.lineWidth=6;t.strokeStyle='#000';t.strokeText(label,256,60);t.fillStyle='#ffd646';t.fillText(label,256,60);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,fog:false}));sp.scale.set(5.2,.98,1);sp.position.y=3.5;sp.renderOrder=20;g.add(sp);scene.add(g);
 return{g,sp,fn,x,z}}
function dgEnter(){
 world=buildWorld();scene.add(world);
 origSky=skyM.material.map;skyM.material.map=dgSky();skyM.material.needsUpdate=true;
 gr.material.color.setHex(0x9a5a62);
 npcs=[npc('Chung Yên Tận Diệt',0x7a0a14,-8,-7,bossNpc),npc('Thương Nhân Chung Yên',0x1a4a8a,8,-7,shopNpc)];
 toast('Phó bản Chung Yên: lại gần NPC rồi bấm Nói chuyện (phím I)')}
function dgLeave(){
 if(B){scene.remove(B.e.m);freeObj(B.e.m);B=null}
 clearSouls();dfx.forEach(f=>{scene.remove(f.m);freeObj(f.m)});dfx=[];
 endArmy(false);endGiant(false);
 npcs.forEach(n=>{scene.remove(n.g);n.sp.material.map.dispose();n.sp.material.dispose();freeObj(n.g)});npcs=[];near=null;
 if(world){scene.remove(world);freeObj(world);world=null}
 if(origSky){skyM.material.map=origSky;skyM.material.needsUpdate=true;origSky=null}
 scene.fog.color.set(HOR);leaving=0}

const sT0=v=>{$('bSword').textContent=v};
const show=(el,on)=>{if(el._v!==on){el._v=on;el.style.display=on?'block':'none'}};
function mkUI(){
 const b=document.createElement('div');b.id='dgBoss';b.innerHTML='<div id="dgBossN"></div><div id="dgBossBar"><i id="dgBossF"></i><span id="dgBossT"></span></div>';document.body.appendChild(b);
 const btn=(id,t,fn)=>{const x=document.createElement('button');x.id=id;x.className='dgBtn';x.textContent=t;x.addEventListener('click',e=>{e.preventDefault();fn()});document.body.appendChild(x)};
 btn('dgTalk','Nói chuyện (I)',talk)}
function extra(){
 const bot=$('btns');xb={};
 const addBtn=(l,n,fn,cls)=>{const b=document.createElement('button');b.innerHTML='<b>'+l+'</b><i>'+n+'</i>';b.className=cls;b.addEventListener('pointerdown',e=>{e.preventDefault();fn()});bot.appendChild(b);return b};
 if(khCY()){const b=addBtn('R','Hồn Chung Yên',()=>buff('R'),'rt rR');if(bt.T)bot.insertBefore(b,bt.T);bt.R=b}
 else if(fusedOn()&&DG.khItem&&bt.R)bt.R.lastChild.textContent='Hồn Chung Yên'
 if(DG.vq&&fusedOn()){xb.v1=addBtn('K','Cận Kiến',()=>castBone(0),'rt rT');xb.v2=addBtn('L','Quy Nhất',()=>castBone(1),'rt rU')}
 placeCols()}
function xbUpdate(){
 [['v1','vq0','K'],['v2','vq1','L']].forEach(([k,ck,l])=>{const b=xb[k];if(!b)return;const c=P.cd[ck]||0,tx=c>0?(c>=10?Math.ceil(c):c.toFixed(1)):l;b.classList.toggle('cd',c>0);if(b.firstChild.textContent!==tx)b.firstChild.textContent=tx})}

function dungeonStep(dt,T){
 if(!DC)scene.fog.color.setHex(0x2a0a14);
 const q=pl(),d=hyp(q.x,q.z);if(d>96){q.x*=96/d;q.z*=96/d}
 near=null;npcs.forEach(n=>{n.g.rotation.y=Math.atan2(q.x-n.x,q.z-n.z);n.g.userData.aR.rotation.x=-.35+Math.sin(T*2+n.x)*.08;if(hyp(q.x-n.x,q.z-n.z)<9)near=n});
 show($('dgTalk'),!!near&&!paused);show($('dgBoss'),!!B);
 if(B){bossStep(dt,T);if(B){sT('dgBossN','CHUNG YÊN HOÀNG ĐẾ — DẠNG '+B.form+(B.ext?' — CỰC HẠN':''));sX('dgBossF','scaleX('+Math.max(0,Math.min(1,B.e.hp/B.max)).toFixed(3)+')');sT('dgBossT',fmt(Math.max(0,B.e.hp))+' / '+fmt(B.max))}}
 fxStep(dt);
 if(P.hp<=0&&!leaving){leaving=1;say('Bạn đã gục — trở về map cũ',2000);setTimeout(()=>{leaving=0;if(MAP=='dungeon')setMap(prev)},1200)}}
function step(dt){
 const T=now()/1000,t=fusedOn()&&P.sty!=5,kt=t&&!!DG.khItem,rd=fusedOn()&&P.sty==5&&!!DG.khItem;
 if(t!==tone||kt!==toneK||rd!==toneR){tone=t;toneK=kt;toneR=rd;setTone(t,kt,rd)}
 DG.eq=realSw==3?1:0;
 if(P.sty==5&&!fusedOn()){setStyle(1);toast('Chung Yên Kiếm Pháp cần kiếm Dung Hợp Chung Yên')}

 if(!P.block&&st<MAXST)st=Math.min(MAXST,st+MAXST*.02*(P.td>0?2:1)*dt);
 if(realSw==3){sT0('KIẾM: '+SWORDS[3][0].toUpperCase());swOv=1}else if(swOv){swOv=0;sT0('KIẾM: '+SWORDS[P.sw][0].toUpperCase())}
 if(lunge){const q=pl();q.x+=lunge.vx*dt;q.z+=lunge.vz*dt;lunge.t-=dt;if(lunge.t<=0)lunge=null}
 xbUpdate();stunStep(dt,T);armyStep(dt,T);giantStep(dt,T);
 if(MAP=='dungeon')dungeonStep(dt,T);else{show($('dgTalk'),false);show($('dgBoss'),false)}}

addEventListener('keydown',e=>{
 if(e.repeat)return;const t=e.target;if(t&&(t.tagName=='INPUT'||t.tagName=='TEXTAREA'))return;
 const c=e.code;if(c=='KeyI')talk();else if(c=='KeyK')castBone(0);else if(c=='KeyL')castBone(1)});

GUIDE['Phó bản']=`<h3>Vào phó bản</h3>Nút 🗺 Map → <b>Phó bản Chung Yên Hoàng Đế</b>. Lại gần NPC rồi bấm <b>Nói chuyện (I)</b>. Chết sẽ bị đưa về map cũ; muốn rời phó bản thì chọn map khác ở nút Map.<h3>NPC Chung Yên Tận Diệt</h3>1) Khiêu chiến boss · 2) Xem số boss đã hạ, lõi sức mạnh, lõi kiếm hồn, xương quái · 3) Bật/tắt Cực Hạn (máu boss ×10, sát thương boss ×3, hồi chiêu của bạn +5%, đổi lại chắc chắn nhận 15 lõi sức mạnh, 10 lõi kiếm hồn, 6000 xương).<h3>Boss Chung Yên Hoàng Đế</h3>Dạng 1: 100 tỷ máu. Hết máu sẽ hóa Dạng 2: 150 tỷ máu. Sát thương boss ×10. Có chém, kiếm khí, mưa kiếm, nổ lớn, kiếm hồn đánh hộ, hồi máu (bị gián đoạn nếu chịu đủ sát thương), Dạng 2 thêm Trảm Địa và Hủy Diệt. Thưởng thường: 90% 1 lõi sức mạnh, 70% 1 lõi kiếm hồn, 500 xương.<h3>Thương Nhân Chung Yên</h3>1) 70 lõi sức mạnh: kiếm Thiên Mệnh Kiếm — Dung Hợp Chung Yên, thêm vào menu Kiếm (phím 2); R T Y U dùng như Thiên Mệnh Kiếm (sát thương ×50, vùng trúng ×15 với Cửu Ngũ / Thiên Mệnh / Chung Yên Kiếm Pháp; hồi chiêu và thể lực -99%; hiệu ứng nửa vàng nửa đỏ cho Cửu Ngũ / Thiên Mệnh Kiếm Pháp, R T Y U).<br>2) 30 lõi sức mạnh: Chung Yên Kiếm Pháp (Z X C V, hiệu ứng đỏ, chỉ dùng được khi cầm kiếm Dung Hợp Chung Yên).<br>3) 40 lõi kiếm hồn: Kiếm Hồn Chung Yên (nút R với kiếm Dung Hợp, Cửu Ngũ / Thiên Mệnh / Chung Yên Kiếm Pháp, sát thương ×101.000, gấp 1000 lần Kiếm Hồn Thiên Mệnh; hình Kiếm Hồn Chung Yên luôn màu đỏ, với Chung Yên Kiếm Pháp các chiêu Quy Luật cũng đổi sang màu đỏ; M2 ×5).<br>4) 100000 xương: Vạn Quái Cận Kiến (phím K) và Vạn Quái Quy Nhất (phím L, dùng độc lập), quái màu tím. Chỉ dùng được khi đang cầm kiếm Dung Hợp Chung Yên; quái trong vùng đánh bị choáng 3 giây, đứng im và không đánh trả. Sát thương hai chiêu ×100 tỷ. Quái vô hạn máu, không tự nổ và không tự biến mất: chỉ bấm lại K / L thì quái mới chết và phát nổ. Quái gây sát thương liên tục và phản sát thương khi bị boss đánh trúng.`;

mkUI();owned();$('stT').nextSibling.textContent='/'+MAXST;buildBtns();
let last=now();
(function tick(){requestAnimationFrame(tick);const t=now(),dt=paused?0:Math.min(.05,(t-last)/1000);last=t;step(dt)})();
})();
