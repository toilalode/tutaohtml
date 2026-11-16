'use strict';
// Chung Yên Kiếm Pháp: thêm buff T / Y / U (hiệu ứng đỏ) và xếp R T Y U bên trái Z X C V.
// Style 5 chỉ dùng được khi cầm Thiên Mệnh Kiếm — Dung Hợp Chung Yên (dungeon.js tự ép), nên chỉ cần kiểm tra P.sty==5.
(function(){
const RED=0xff2a2a,cy=()=>P.sty==5;
const NM={R:'Hồn Chung Yên',T:'Thiên Địa',Y:'Xích Giáp',U:'Phản Hồi'};

// Bật/tắt T, Y, U (giữ đúng luật của Thiên Mệnh Kiếm Pháp)
const baseBuffCY=buff;
buff=function(k){
 k=String(k).toUpperCase();
 if(cy()&&(k=='T'||k=='Y'||k=='U')){
  if(paused)return;
  if(P.kh)return toast('Đang bật Kiếm Hồn (R): cấm dùng T, Y, U');
  if(k=='U'){
   if(P.absorb<=0)return toast('Chưa hấp thụ sát thương (bật Y rồi chịu đòn)');
   const d=P.absorb*2,p=player.position;P.absorb=0;P.pwr=600;
   FXK('boom',{x:p.x,z:p.z,r:14,col:RED});FXK('ring',{r:14,life:30,col:RED});hit(p.x,p.z,14,d*3,2);shake=12;flash(RED);return}
  const key=k=='T'?'td':'xich',n=k=='T'?'Thiên Địa Chi Cảnh':'Thiên Mệnh Xích Giáp';
  P[key]=P[key]?0:1;say(n+(P[key]?' — BẬT':' — TẮT'),1000);
  if(P[key]){flash(RED);FXK('ring',{r:8,life:24,col:RED});FXK('aura',{life:30,col:RED})}return}
 return baseBuffCY(k)};

// Không để syncRT xoá T / Y / U khi đang dùng Chung Yên Kiếm Pháp
const baseSyncCY=syncRT;
syncRT=function(){
 const keep=cy(),td=P.td,xi=P.xich,ab=P.absorb,pw=P.pwr;
 baseSyncCY();
 if(keep){P.td=td;P.xich=xi;P.absorb=ab;P.pwr=pw}};

// Thiên Địa Chi Cảnh: sát thương ×2.3 (game.js chỉ tính cho kiếm pháp 0/1)
const baseDmgCY=dmgMul;
dmgMul=function(){let m=baseDmgCY();if(cy()&&P.td>0)m*=2.3;return m};

// Nút: R T Y U nằm bên trái Z X C V
const baseBuildCY=buildBtns;
buildBtns=function(){
 baseBuildCY();
 if(!cy())return;
 const bot=$('btns'),ref=bot.firstChild;
 const mk=k=>{const b=document.createElement('button');b.innerHTML='<b>'+k+'</b><i>'+NM[k]+'</i>';b.className='rt r'+k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();buff(k)});return b};
 if(bt.R)bot.insertBefore(bt.R,ref);
 ['T','Y','U'].forEach(k=>{const b=mk(k);bot.insertBefore(b,ref);bt[k]=b});
 placeCols()};

// Hiệu ứng đang bật (vòng Thiên Địa, xích Xích Giáp, quầng Phản Hồi) đổi sang màu đỏ khi dùng Chung Yên Kiếm Pháp
let lastRed=null;
setInterval(()=>{
 const r=cy();if(r===lastRed)return;lastRed=r;
 S.td.material.color.setHex(r?RED:GOLD);
 S.xich.children.forEach(m=>m.material.color.setHex(r?RED:GOLD));
 S.pwr.material.color.setHex(r?RED:0xff5030)},150);

GUIDE['Buff']+='<h3>Chung Yên Kiếm Pháp</h3>Có đủ <b>R T Y U</b> nằm bên trái Z X C V. <b>T</b> Thiên Địa Chi Cảnh, <b>Y</b> Thiên Mệnh Xích Giáp, <b>U</b> Phản Hồi dùng như Thiên Mệnh Kiếm Pháp nhưng hiệu ứng màu đỏ; bật R thì cấm T, Y, U.';
buildBtns();
})();
