'use strict';
// Bỏ "Map chính (đợt quái)": menu chỉ còn Test + 2 phó bản; khởi động vào Test; mọi chỗ gọi setMap('main') (chết, rời phó bản) đều về Test. Nạp sau ptfix.js.
(function(){
const L=[['test','Test (quái bù nhìn)'],['dungeon','Phó bản Chung Yên Hoàng Đế'],['pt','Phó bản Phượng Tước Kiếm']];
mapMenu=function(){if(castBusy())return;popup('Chọn map',L.map(x=>x[1]),L.findIndex(x=>x[0]===MAP),i=>setMap(L[i][0]))};
const sm=setMap;
setMap=function(m){return sm(m==='main'?'test':m)};
setMap('test');
})();
