'use strict';
/* Nạp file gốc, thay các đoạn bên dưới rồi mới chạy. Sửa file gốc thì nhớ kiểm tra lại các chuỗi này. */
const PATCHES={
'dungeon.js':[
 ['HPX=1e14,','HPX=750,'],
 ['1.5e13','1e13'],
 ['1e28 máu','75 triệu tỷ máu'],
 ['1,5e28 máu','75 triệu tỷ máu'],
 ["setMap=function(m){const was=MAP;if(was=='dungeon')dgLeave();","setMap=function(m){const was=MAP;endArmy(false);endGiant(false);if(was=='dungeon')dgLeave();"]],
'phuongtuoc.js':[
 ['const fmtB=n=>(n/1e9)',"const fmtB=n=>n<1e9?Math.ceil(n).toLocaleString('vi-VN'):(n/1e9)"],
 ['hp:1e18*20,','hp:3.75e12*20,'],
 ['hp:1.5e18*20,','hp:1e14*20,'],
 ['hp:2.5e18*20,','hp:1.5e14*20,'],
 ['hp:5e18*20,','hp:2.5e14*20,'],
 ['hp:6e18*20,','hp:3.75e14*20,'],
 ['hp:1e19*10,','hp:5e14*10,'],
 ['hp:2e19*50,','hp:1e15*50,'],
 ['hp:1e17*5,','hp:2.5e15*5,'],
 ['500 triệu tỷ máu','12,5 triệu tỷ máu'],
 ['if(apOn){if(e.hp>0){if(e.inf){e.inf=0;e.apInf=1}e.hp=-1;e.hit=8}}','if(apOn){if(!e.infOn&&e.hp>0){e.hp=-1;e.hit=8}}'],
 ["const ptOnly=()=>MAP=='pt'&&ptMap>=2;","const ptOnly=()=>MAP=='pt'&&ptMap>=2;window.ptOnly=ptOnly;const baseStyleOnly=setStyle;setStyle=function(n){if(ptOnly()&&n<6)return toast('Map này chỉ dùng được kiếm pháp Phượng Tước');return baseStyleOnly(n)};"]],
'ptskill.js':[
 ['NPHP=1e14;','NPHP=2.5e15*5;'],
 ['M1P=5e7,','M1P=2e8,']],
'autoai.js':[
 ['function plan(){',"function plan(){if(window.ptOnly&&window.ptOnly())return{sw:4,sty:P.sty>=6?P.sty:6};"],
 ['const isBoss=e=>!!e.boss||','const isBoss=e=>!!e.boss||!!e.bigNP||']]
};
function loadPatched(file){
 const x=new XMLHttpRequest();x.open('GET',file,false);x.send();
 if(x.status>=400||!x.responseText)throw new Error('Không tải được '+file);
 let code=x.responseText;
 const missed=[];
 PATCHES[file].forEach(([a,b])=>{if(code.includes(a))code=code.split(a).join(b);else missed.push(a)});
 const s=document.createElement('script');s.textContent=code+'\n//# sourceURL='+file;document.body.appendChild(s);
 if(missed.length)throw new Error('patch.js không khớp '+file+': '+missed.join(' | '));
}
