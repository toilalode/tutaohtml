'use strict';
(function(){
const L=[['test','Test (quái bù nhìn)'],['dungeon','Phó bản Chung Yên Hoàng Đế'],['pt','Phó bản Phượng Tước Kiếm']];
mapMenu=function(){if(castBusy())return;popup('Chọn map',L.map(x=>x[1]),L.findIndex(x=>x[0]===MAP),i=>setMap(L[i][0]))};
const sm=setMap;
setMap=function(m){return sm(m==='main'?'test':m)};
setMap('test');
buildBtns();
const kt=document.getElementById('killT');
if(kt){
 const fix=()=>{const t=kt.textContent,n=t.replace(/\s*\|\s*ĐỢT.*$/,'');if(n!==t)kt.textContent=n};
 fix();
 new MutationObserver(fix).observe(kt,{childList:true,characterData:true,subtree:true});
}
})();
