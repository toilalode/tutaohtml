'use strict';
(function(){
 const KEEP=8,FAR=12,LIMIT=140,TICK=110;
 const NOCAST={dom4:1,dom5:1,counter:1,guard2:1};
 let on=false,timer=0,strafe=1,strafeT=0,lastDash=0,task=null,actAt=0;
 const TALK=6;
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
 function useBuffs(){
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
 const TASKS=[
  [null,'Cày quái tại chỗ',''],
  [{go:'quest'},'Nhiệm vụ Kiếm Phượng Tước','Nhiệm vụ'],
  [{go:'np'},'Đánh boss Nguyên Phượng (Map 2)','Boss NP'],
  [{go:'king'},'Đánh boss Map 3 (lần lượt từng vua)','Boss Map 3'],
  [{go:'cy'},'Đánh boss Chung Yên Hoàng Đế','Boss CY'],
  [{go:'test'},'Chuyển tới Map Test','Đổi map'],
  [{go:'dungeon'},'Chuyển tới Phó bản Chung Yên','Đổi map'],
  [{go:'pt',n:1},'Chuyển tới Phượng Tước — Map 1','Đổi map'],
  [{go:'pt',n:2},'Chuyển tới Phượng Tước — Map 2','Đổi map'],
  [{go:'pt',n:3},'Chuyển tới Phượng Tước — Map 3','Đổi map']];
 const KINGS=['dinh','thi','tinh','viem','hon','xv'];
 const SPOT={cy:{x:-8,z:-7},np:{x:10,z:-8},king:{x:10,z:-8}};
 const WANT={quest:1,np:2,king:3};
 const bossUp=id=>{const e=$(id);return !!e&&e.style.display==='block'};
 const beaten=()=>{try{return JSON.parse(localStorage.getItem('tm_pt_v1')||'{}').beat||{}}catch(_){return{}}};
 const pickOpt=i=>{const o=$('popts');if(o&&o.children[i])o.children[i].click()};
 const act=(fn,msg)=>{actAt=performance.now()+1500;toast(msg);fn()};
 const endTask=msg=>{task=null;if(msg)toast(msg);paint()};
 function walkTo(n){
  const pp=player.position,dx=n.x-pp.x,dz=n.z-pp.z;
  if(Math.hypot(dx,dz)<TALK){steer(0,0);return true}
  steer(dx,dz);return false}
 function taskStep(){
  if(performance.now()<actAt){steer(0,0);return true}
  const g=task.go;
  if(g==='test'){
   if(MAP!==g)act(()=>setMap(g),'AI đang chuyển map');
   task=null;paint();return true}
  if(g==='dungeon'||g==='cy'){
   if(MAP!=='dungeon'){act(()=>setMap('dungeon'),'AI vào Phó bản Chung Yên');if(g==='dungeon'){task=null;paint()}return true}
   if(g==='dungeon'){endTask();return false}
   if(bossUp('dgBoss'))return false;
   if(!walkTo(SPOT.cy))return true;
   act(()=>{const t=$('dgTalk');if(t){t.click();pickOpt(0)}},'AI nói chuyện, khiêu chiến Chung Yên Hoàng Đế');return true}
  const A=window.PTAI;
  if(!A){endTask('Thiếu phuongtuoc.js, AI không làm được nhiệm vụ');return false}
  if(MAP!=='pt'){act(()=>setMap('pt'),'AI vào Phó bản Phượng Tước');return true}
  const want=g==='pt'?task.n:WANT[g];
  if(want>=2&&!A.sword()){endTask('Chưa có Kiếm Phượng Tước nên AI chưa vào được Map '+want);return false}
  if(A.map()!==want){
   const c=A.conv();
   if(!c)return false;
   if(!walkTo(c))return true;
   act(()=>A.go(want),'AI nói chuyện với Người Chuyển Đổi');return true}
  if(g==='pt'){endTask();return false}
  if(g==='quest'){
   if(A.running())return false;
   const q=A.quest();
   if(!q)return false;
   if(!walkTo(q))return true;
   act(A.start,'AI nói chuyện nhận nhiệm vụ');return true}
  if(bossUp('ptBoss'))return false;
  if(!walkTo(SPOT[g]))return true;
  if(g==='np'){act(()=>$('ptTalk').click(),'AI nói chuyện, khiêu chiến Nguyên Phượng');return true}
  const b=beaten(),k=KINGS.findIndex(x=>!b[x]),i=k<0?KINGS.length-1:k;
  act(()=>{$('ptTalk').click();pickOpt(i)},'AI khiêu chiến vua thứ '+(i+1));return true}
 function tick(){
  if(!on)return;
  if(!started()||paused||P.hp<=0){steer(0,0);blockOn(0);return}
  if(task&&taskStep())return;
  const pp=player.position,foes=enemies.filter(e=>e.hp>0);
  if(!foes.length){steer(0,0);return}
  let near=null,nd=1e9;
  foes.forEach(e=>{const d=Math.hypot(e.m.position.x-pp.x,e.m.position.z-pp.z);if(d<nd){nd=d;near=e}});
  strafeT-=TICK;
  if(strafeT<=0){strafe=-strafe;strafeT=1800+Math.random()*1200}
  let wx=0,wz=0;
  foes.forEach(e=>{
   const dx=pp.x-e.m.position.x,dz=pp.z-e.m.position.z,d=Math.hypot(dx,dz)||.01;
   if(d<KEEP){const w=(KEEP-d)/KEEP*2;wx+=dx/d*w;wz+=dz/d*w}});
  if(Math.hypot(wx,wz)>.05){
   const dx=pp.x-near.m.position.x,dz=pp.z-near.m.position.z,d=Math.hypot(dx,dz)||.01;
   wx+=-dz/d*strafe*.6;wz+=dx/d*strafe*.6}
  else if(nd>FAR){wx=near.m.position.x-pp.x;wz=near.m.position.z-pp.z}
  const rr=Math.hypot(pp.x,pp.z);
  if(rr>LIMIT){wx-=pp.x/rr*2;wz-=pp.z/rr*2}
  steer(wx,wz);
  const now=performance.now();
  if(!busy()&&nd<3.4&&(near.wind>0||nd<2.2)&&P.st>=14&&now-lastDash>700){lastDash=now;dash()}
  if(busy())return;
  useBuffs();
  if(nd<45)castBest();
  atk()}
 function setOn(v){
  on=v;
  clearInterval(timer);
  timer=0;
  if(on)timer=setInterval(tick,TICK);
  else{task=null;steer(0,0);blockOn(0)}
  toast(on?'AI đang chơi hộ bạn':'Đã tắt AI');
  paint()}
 const ab=document.createElement('button');
 ab.className='c4';
 function paint(){
  const t=task?TASKS.find(x=>x[0]&&x[0].go===task.go&&x[0].n===task.n):null;
  ab.style.cssText='height:38px;min-width:96px;border-radius:8px;padding:0 8px;font-size:12px;font-weight:bold;display:flex;align-items:center;justify-content:center;white-space:nowrap;border:2px solid '+(on?'#2ecc71':'#667')+';background:'+(on?'#0f4d2a':'#0a0a1a')+';opacity:'+(on?1:.8);
  ab.textContent=on?'🤖 AI: '+(t?t[2]:'BẬT'):'🤖 AI cày hộ'}
 paint();
 function taskMenu(){
  if(castBusy())return;
  const cur=!on?0:task?TASKS.findIndex(x=>x[0]&&x[0].go===task.go&&x[0].n===task.n)+1:1;
  popup('AI: chọn việc cho AI',['Tắt AI'].concat(TASKS.map(x=>x[1])),cur,i=>{
   if(i===0){setOn(false);return}
   task=TASKS[i-1][0]?Object.assign({},TASKS[i-1][0]):null;
   actAt=0;
   if(!on)setOn(true);
   else{toast(task?'AI bắt đầu: '+TASKS[i-1][1]:'AI cày quái tại chỗ');paint()}})}
 ab.addEventListener('click',e=>{e.preventDefault();taskMenu()});
 const row=document.createElement('div');
 row.style.cssText='display:flex;gap:6px;align-items:center;justify-content:flex-end;margin-top:6px;pointer-events:auto';
 row.appendChild(ab);
 $('hudR').appendChild(row);
 try{GUIDE['Mẹo']+='<br>• <b>🤖 AI cày hộ</b> (góc trên phải): AI tự di chuyển giữ khoảng cách với quái, né, đánh thường, bật buff và thi triển chiêu theo kiếm pháp đang chọn. Bấm nút để chọn việc: cày quái tại chỗ, làm nhiệm vụ Kiếm Phượng Tước, tự đánh boss (Nguyên Phượng, các vua Map 3, Chung Yên Hoàng Đế) hoặc tự chuyển map. AI tự đi tới NPC và nói chuyện. Chọn Tắt AI để dừng.'}catch(_){}
})();
