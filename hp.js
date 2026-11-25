'use strict';
(function(){
const SCALE=1000,baseHurt=hurt,el=$('hpT');
hurt=function(d){const h=P.hp;baseHurt(d);if(P.hp<h)P.hp=h-(h-P.hp)/SCALE};
(function tick(){requestAnimationFrame(tick);const t=String(Math.max(0,Math.round(P.hp*SCALE)));if(el.textContent!==t)el.textContent=t})();
})();
(function(){
const DIG=100,MAXHP=1e99;
tpOpen=function(){tpEdit=true;{const e=enemies.find(x=>x.dummy);tpBuf=!e?'':e.inf?'∞':BigInt(Math.floor(e.max)).toString().slice(0,DIG)}$('kp').style.display='grid';$('tpM').style.borderColor='#fc0'};
tpKey=function(k){if(tpBuf=='∞'&&k!='inf')tpBuf='';if(k=='inf')tpBuf='∞';else if(k=='del')tpBuf=tpBuf.slice(0,-1);else if(k=='clr')tpBuf='';else if(tpBuf.length<DIG)tpBuf=(tpBuf+k).replace(/^0+(?=\d)/,'');$('tpM').value=fmtHp(tpBuf)};
tpApply=function(full){const e=enemies.find(x=>x.dummy);if(!e)return;if($('tpM').value=='∞'){e.inf=1;e.max=1e15;e.hp=1e15;e.lh=1e15;$('tpM').value='∞';$('tpC').value='∞';dmgSum=0;dmgT=0;tpClose();return}e.inf=0;let mx=Math.floor(+(tpEdit?tpBuf:String(e.max)))||0;if(mx<100){mx=100;toast('Máu tối đa tối thiểu 100')}if(mx>MAXHP){mx=MAXHP;toast('Máu tối đa 1e+99')}tpClose();const c=mx;e.max=mx;e.hp=c;e.lh=c;$('tpM').value=fmtHp(mx);$('tpC').value=fmtHp(c);dmgSum=0;dmgT=0};
})();
