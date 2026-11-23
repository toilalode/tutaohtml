'use strict';
(function(){
const WHT=0xfff4d0,GLD=0xffd646,BLK=0x111111,rnd=Math.random;
const drop=g=>{scene.remove(g);freeObj(g)};
const mkSword=(col,sc)=>{const g=new THREE.Group(),b=new THREE.Mesh(G('PTSB',()=>new THREE.BoxGeometry(.5,.15,7)),mat(col,.95)),gd=new THREE.Mesh(G('PTSG',()=>new THREE.BoxGeometry(2,.22,.3)),mat(GLD,.95));b.position.z=3.6;gd.position.z=.2;g.add(b,gd);g.scale.setScalar(sc);scene.add(g);return g};
function boom(x,z,r,col,d,kb){FXK('boom',{x,z,r,col});FXK('ring',{r:r*1.4,life:40,col:WHT});flash(col);shake=Math.max(shake,Math.min(60,r/2));if(d)hit(x,z,r,d*3,kb||3)}
async function dive(tx,tz,n,slashCol){
 const p=player.position,x0=p.x,z0=p.z;P.flyH=1;
 for(let f=0;f<n;f++){const k=(f+1)/n;p.x=x0+(tx-x0)*k*.85;p.z=z0+(tz-z0)*k*.85;if(slashCol!==undefined&&f%2==0)FXK('slash',{x:p.x,z:p.z,r:6,col:f&2?slashCol:WHT});await wait(1)}}
async function s7(){
 const[tx,tz]=target();say('Nhất Vương Tài Quyết Lục — Hoành Quán Vạn Cổ',2000);FXK('ring',{r:16,life:40,col:0xffffff});FXK('ring',{r:10,life:40,col:BLK});await wait(50);
 say('Khúc Chung Trảm!',1600);FXK('sky',{col:0xffffff});FXK('sky',{col:BLK});
 await dive(tx,tz,14,BLK);
 for(let i=0;i<6;i++){FXK('slash',{x:tx+rnd()*8-4,z:tz+rnd()*8-4,r:9,col:i&1?BLK:WHT});await wait(2)}
 boom(tx,tz,110,WHT,5.5e14);FXK('boom',{x:tx,z:tz,r:70,col:BLK});await wait(12)}
async function s8(){
 const[tx,tz]=target();say('Nhất Vương Tài Quyết Lục — Tung Hoành Thiên Hạ',2000);await wait(30);
 await dive(tx,tz,12,BLK);
 boom(tx,tz,45,WHT,2e14);await wait(10);
 say('Chúng Sinh Bình Giới Điệu!',1600);
 const p=player.position,s=mkSword(0xffffff,6);
 try{
  P.flyH=34;
  for(let f=0;f<26;f++){s.position.set(p.x,p.y+4,p.z);s.lookAt(tx,0,tz);await wait(1)}
  const x0=p.x,z0=p.z;P.flyH=1;
  for(let f=0;f<16;f++){const k=(f+1)/16;p.x=x0+(tx-x0)*k*.85;p.z=z0+(tz-z0)*k*.85;s.position.set(p.x,p.y+4,p.z);s.lookAt(tx,0,tz);await wait(1)}
 }finally{drop(s)}
 boom(tx,tz,130,WHT,5e14);FXK('boom',{x:tx,z:tz,r:80,col:BLK});await wait(12)}
async function exec(f,fly){P.busy++;P.lk++;P.flyN++;P.flyH=fly;try{await f()}catch(e){console.error(e)}finally{P.busy--;P.lk--;P.flyN--;P.fly=Math.max(P.fly,25)}}
const baseRun=run;
run=function(sp,k0){
 if(sp&&sp.sp=='pt7')return exec(s7,28);
 if(sp&&sp.sp=='pt8')return exec(s8,22);
 return baseRun(sp,k0)};
})();
