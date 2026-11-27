'use strict';
(function(){
 const KEEP=8,BOSSKEEP=20,FAR=12,LIMIT=140,TICK=110,NPCX=-8,NPCZ=-7,NPCNAME='Chung Yên Tận Diệt',PTCONV=[-10,-8],PTWORK=[10,-8],PTSWAP=[0,-14],SHOP=[8,-7],PTORDER=['dinh','thi','tinh','viem','hon','xv','xv2'];
 const NOCAST={dom4:1,dom5:1,counter:1,guard2:1};
 let on=false,timer=0,loadT=0,ptSel=0,ptLock=0,shopNext=0,swapNext=0,mapT=0,lsT=0,lsC={},strafe=1,strafeT=0,lastDash=0,talkT=0,wp=null,wpT=0;
 const busy=()=>P.busy>0||P.lk>0||P.cut>0;
 const started=()=>$('start').style.display==='none';
 const steer=(wx,wz)=>{
  const l=Math.hypot(wx,wz);
  if(l<.01){joy.x=joy.y=0;return}
  wx/=l;wz/=l;
  const c=Math.cos(camYaw),s=Math.sin(camYaw);
  joy.x=c*wx-s*wz;joy.y=s*wx+c*wz};
 const needOk=sp=>{
  if(!sp.need)return true;
  if(sp.need==='dom4')return P.dom4>0;
  if(sp.need==='dom5')return P.dom5>0;
  if(sp.need==='form12')return P.form===1||P.form===2;
  return false};
 const lsc=k=>{
  const t=performance.now();
  if(t-lsT>1000){
   lsT=t;lsC={};
   ['tm_pt_v1','tm_dungeon_v1'].forEach(n=>{try{lsC[n]=JSON.parse(localStorage.getItem(n)||'{}')||{}}catch(_){lsC[n]={}}})}
  return lsC[k]||{}};
 const isBoss=e=>!!e.boss||(!!e.dummy&&e.max>=1e9);
 function useBuffs(){
  if(P.sty>=6){
   if(lsc('tm_pt_v1').kh&&!P.kh)buff('R');
   else if(P.kh&&!P.ap)lawMenu();
   return}
  if(!rtyuOk())return;
  if(P.sty===0){if(!P.kh&&!P.td&&!P.xich)buff('R')}
  else if(!P.kh&&!P.td)buff('T')}
 function castBest(){
  const set=SK[P.sty];
  if(!set)return;
  const cm=costMul();
  let best=null,score=-1;
  for(const k in set){
   const sp=set[k];
   if(!sp||(sp.pt&&!sp.pt())||NOCAST[sp.sp]||(typeof sp.sp==='string'&&sp.sp.startsWith('form'))||!needOk(sp))continue;
   if(P.sty===3&&P.dom5>0&&k!=='j'&&k!=='m')continue;
   if(P.cd[P.sty+(sp.cdk||k)]>0)continue;
   const cost=(sp.sta||0)*cm.st;
   if(!(P.nost>0)&&P.st<cost+8)continue;
   const sv=(sp.tot||0)+(sp.sp==='rewrite'&&!(P.nost>0)?1e9:0);
   if(sv>score){score=sv;best=k}}
  if(best)cast(best)}
 function plan(){
  const pt=lsc('tm_pt_v1'),dg=lsc('tm_dungeon_v1');
  if(pt.sword&&pt.beat&&pt.beat.dinh)return{sw:4,sty:6};
  if(dg.fused)return{sw:3,sty:dg.style?5:0};
  return{sw:2,sty:0}}
 function loadout(){
  const t=performance.now();
  if(t-loadT<1500||busy())return;
  loadT=t;
  const p=plan(),cur=$('bSword').textContent.indexOf('DUNG HỢP')>=0?3:P.sw;
  if(cur!==p.sw){P.sw=p.sw;syncRT();buildBtns()}
  if(P.sty!==p.sty)setStyle(p.sty)}
 function answer(pick,round){
  if($('popup').style.display!=='block')return;
  const opts=Array.from($('popts').children),i=pick($('ptitle').textContent,opts.map(o=>o.textContent));
  if(i>=0&&opts[i]&&round<6){
   opts[i].click();
   setTimeout(()=>answer(pick,round+1),700)}
  else if(opts.length)opts[opts.length-1].click()}
 function talkVia(btn,pick){
  const t=performance.now();
  if(t-talkT<2000)return false;
  talkT=t;
  const tk=$(btn);
  if(tk)tk.click();
  setTimeout(()=>answer(pick,0),700);
  return true}
 function walkTo(pp,pos){
  const dx=pos[0]-pp.x,dz=pos[1]-pp.z;
  if(Math.hypot(dx,dz)>3){steer(dx,dz);return false}
  steer(0,0);
  return true}
 function shopWant(){
  const d=lsc('tm_dungeon_v1');
  return (!d.fused&&d.power>=70)||(!d.style&&d.power>=30)||(!d.khItem&&d.hon>=40)||(!d.vq&&d.bone>=100000)}
 function shopPick(title,texts){
  if(title.indexOf('Thương Nhân Chung Yên')!==0)return -1;
  const num=k=>{const m=new RegExp(k+' (\\d+)').exec(title);return m?+m[1]:0};
  const wallet={'lõi sức mạnh':num('SM'),'lõi kiếm hồn':num('KH'),'xương quái':num('Xương')};
  return texts.findIndex(x=>{
   const m=/— (\d+) (lõi sức mạnh|lõi kiếm hồn|xương quái)/.exec(x);
   return !!m&&x.indexOf('[ĐÃ CÓ]')<0&&wallet[m[2]]>=+m[1]})}
 function goQuest(pp){
  const t=performance.now();
  if(t>shopNext&&shopWant()){
   if(!walkTo(pp,SHOP))return;
   if(talkVia('dgTalk',shopPick))shopNext=t+60000;
   return}
  if(!walkTo(pp,[NPCX,NPCZ]))return;
  talkVia('dgTalk',title=>title===NPCNAME?0:-1)}
 function ptPick(title,texts){
  const pt=lsc('tm_pt_v1'),b=pt.beat||{};
  if(title==='Người Chuyển Đổi'){
   ptLock=0;
   if(!pt.sword){ptSel=1;return 0}
   if(PTORDER.some(k=>!b[k])){ptSel=3;return 2}
   ptSel=2;return 1}
  if(title==='Người Đổi Đồ')return 0;
  if(title==='Lấy Kiếm Phượng Tước'){ptLock=performance.now()+620000;return 0}
  if(title==='Khiêu Chiến Vua'){
   const i=texts.findIndex(x=>x.indexOf('[ĐÃ HẠ]')<0&&x.indexOf('[KHÓA]')<0);
   if(i<0)ptSel=0;
   return i}
  return -1}
 function ptQuest(pp){
  const pt=lsc('tm_pt_v1');
  if(ptSel===1&&pt.sword)ptSel=0;
  const t=performance.now();
  if(ptSel===2&&t>swapNext&&pt.sword&&!pt.up&&((pt.ngoc||{}).np||0)>=1){
   if(!walkTo(pp,PTSWAP))return;
   if(talkVia('ptTalk',ptPick))swapNext=t+60000;
   return}
  if(!walkTo(pp,ptSel?PTWORK:PTCONV))return;
  if(ptSel&&performance.now()<ptLock)return;
  talkVia('ptTalk',ptPick)}
 function mapPick(title,texts){
  if(title!=='Chọn map')return -1;
  const pt=lsc('tm_pt_v1'),b=pt.beat||{},want=(!pt.sword||PTORDER.some(k=>!b[k]))?'Phượng Tước':'Chung Yên';
  return texts.findIndex(x=>x.indexOf(want)>=0)}
 function switchMap(){
  const t=performance.now();
  if(t-mapT<4000||busy())return false;
  mapT=t;
  mapMenu();
  setTimeout(()=>answer(mapPick,0),700);
  return true}
 function wander(pp){
  const t=performance.now();
  if(!wp||t>wpT||Math.hypot(wp.x-pp.x,wp.z-pp.z)<3){
   const a=Math.random()*6.283,r=10+Math.random()*30;
   wp={x:Math.cos(a)*r,z:Math.sin(a)*r};
   wpT=t+6000}
  steer(wp.x-pp.x,wp.z-pp.z)}
 function tick(){
  if(!on)return;
  if(!started()||paused||P.hp<=0){steer(0,0);blockOn(0);return}
  loadout();
  if(MAP!=='pt')ptSel=0;
  if(MAP==='main'&&switchMap())return;
  const pp=player.position,foes=enemies.filter(e=>e.hp>0);
  if(!foes.length){
   if(MAP==='dungeon')goQuest(pp);
   else if(MAP==='pt')ptQuest(pp);
   else wander(pp);
   return}
  let near=null,nd=1e9;
  foes.forEach(e=>{const d=Math.hypot(e.m.position.x-pp.x,e.m.position.z-pp.z);if(d<nd){nd=d;near=e}});
  const boss=isBoss(near),keep=boss?BOSSKEEP:KEEP;
  strafeT-=TICK;
  if(strafeT<=0){strafe=-strafe;strafeT=1800+Math.random()*1200}
  let wx=0,wz=0;
  foes.forEach(e=>{
   const dx=pp.x-e.m.position.x,dz=pp.z-e.m.position.z,d=Math.hypot(dx,dz)||.01;
   if(d<keep){const w=(keep-d)/keep*2;wx+=dx/d*w;wz+=dz/d*w}});
  if(Math.hypot(wx,wz)>.05){
   const dx=pp.x-near.m.position.x,dz=pp.z-near.m.position.z,d=Math.hypot(dx,dz)||.01;
   wx+=-dz/d*strafe*.6;wz+=dx/d*strafe*.6}
  else if(nd>FAR){wx=near.m.position.x-pp.x;wz=near.m.position.z-pp.z}
  const rr=Math.hypot(pp.x,pp.z);
  if(rr>LIMIT){wx-=pp.x/rr*2;wz-=pp.z/rr*2}
  steer(wx,wz);
  const now=performance.now(),danger=boss?nd<30:nd<3.4&&(near.wind>0||nd<2.2);
  if(!busy()&&danger&&P.st>=14&&now-lastDash>700){lastDash=now;dash()}
  if(busy())return;
  useBuffs();
  if(nd<45)castBest();
  atk()}
 function setOn(v){
  on=v;
  clearInterval(timer);
  timer=0;
  talkT=0;
  ptSel=0;
  wp=null;
  if(on)timer=setInterval(tick,TICK);
  else{steer(0,0);blockOn(0)}
  toast(on?'AI đang chơi hộ bạn':'Đã tắt AI');
  paint()}
 const ab=document.createElement('button');
 ab.className='c4';
 function paint(){
  ab.style.cssText='height:38px;min-width:150px;border-radius:8px;padding:0 8px;font-size:12px;font-weight:bold;display:flex;align-items:center;justify-content:center;white-space:nowrap;border:2px solid '+(on?'#2ecc71':'#667')+';background:'+(on?'#0f4d2a':'#0a0a1a')+';opacity:'+(on?1:.8);
  ab.textContent=on?'🤖 AI + Nhiệm vụ: BẬT':'🤖 AI + Nhiệm vụ'}
 paint();
 ab.addEventListener('pointerdown',e=>{e.preventDefault();setOn(!on)});
 const row=document.createElement('div');
 row.style.cssText='display:flex;gap:6px;align-items:center;justify-content:flex-end;margin-top:6px;pointer-events:auto';
 row.appendChild(ab);
 $('hudR').appendChild(row);
 try{GUIDE['Mẹo']+='<br>• <b>🤖 AI + Nhiệm vụ</b> (góc trên phải): AI tự di chuyển, giữ khoảng cách và né, đánh thường, bật buff, thi triển chiêu. AI tự chọn Kiếm Phượng Tước (khi đã mở khóa chiêu), Dung Hợp Chung Yên hoặc Thiên Mệnh Kiếm cùng kiếm pháp hợp. Trong phó bản Chung Yên AI tự nói chuyện NPC, khiêu chiến và đánh boss lặp lại; trong phó bản Phượng Tước AI tự đi qua Map 1, 3 để lấy kiếm và hạ lần lượt các boss. AI tự chuyển map từ map chính vào phó bản (Phượng Tước nếu chưa xong, ngược lại Chung Yên). AI cũng tự đổi đồ: mua đồ ở Thương Nhân Chung Yên khi đủ lõi và xương, đổi Ngọc Nguyên Phượng lấy skin Vàng Trắng ở Người Đổi Đồ. Bấm lại để tắt.'}catch(_){}
})();
