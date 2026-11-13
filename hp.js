'use strict';
(function(){
const SCALE=1000,baseHurt=hurt,el=$('hpT');
hurt=function(d){const h=P.hp;baseHurt(d);if(P.hp<h)P.hp=h-(h-P.hp)/SCALE};
(function tick(){requestAnimationFrame(tick);const t=String(Math.max(0,Math.round(P.hp*SCALE)));if(el.textContent!==t)el.textContent=t})();
})();
