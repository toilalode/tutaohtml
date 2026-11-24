'use strict';
// Bỏ "Map chính (đợt quái)" khỏi menu chọn map (nạp sau ptfix.js, ghi đè mapMenu cuối cùng)
(function(){
const L=[['test','Test (quái bù nhìn)'],['dungeon','Phó bản Chung Yên Hoàng Đế'],['pt','Phó bản Phượng Tước Kiếm']];
mapMenu=function(){if(castBusy())return;popup('Chọn map',L.map(x=>x[1]),L.findIndex(x=>x[0]===MAP),i=>setMap(L[i][0]))};
})();
