'use strict';
(function(){
const SRC=new Set([0xff2a2a,0xffd646,0xfff4d0,0xff8a1a,0xff9a20,0xff7a1a,0xffffff,0x111111,0xff2020,0xffb000,0xff3010]);
const RED=0xff2a2a,GOLD=0xffd646,WHITE=0xffffff,BLACK=0x111111;
const ACCENT_EVERY=5;
let active=0,pal={m:RED,a:GOLD,dark:false},count=0;

const goldSkin=()=>{try{const d=JSON.parse(localStorage.getItem('tm_pt_v1')||'{}');return !!(d.up&&d.skin)}catch(e){return false}};
const paletteFor=id=>{
 if(id==='pt7'||id==='pt8')return{m:BLACK,a:RED,dark:true};
 return goldSkin()?{m:GOLD,a:WHITE,dark:false}:{m:RED,a:GOLD,dark:false}};
const pick=()=>count++%ACCENT_EVERY===ACCENT_EVERY-1?pal.a:pal.m;

const recolor=obj=>{
 obj.traverse(c=>{
  if(!c.isMesh||!c.material||Array.isArray(c.material))return;
  const mt=c.material,g=c.geometry;
  if(!mt.isMeshBasicMaterial||!mt.transparent||mt.map)return;
  if(g&&g.type==='CircleGeometry')return;
  if(!SRC.has(mt.color.getHex()))return;
  const p=g&&g.parameters;
  if(g&&g.type==='BoxGeometry'&&p.depth===7)mt.color.setHex(pal.m);
  else if(g&&g.type==='BoxGeometry'&&p.width===2&&p.depth===.3)mt.color.setHex(pal.a);
  else mt.color.setHex(pick())})};

const baseAdd=scene.add;
scene.add=function(){
 if(active>0)for(let i=0;i<arguments.length;i++)recolor(arguments[i]);
 return baseAdd.apply(this,arguments)};

const baseFlash=flash;
flash=function(c){
 if(active>0&&SRC.has(c))return baseFlash(pal.dark?pal.a:pal.m);
 return baseFlash(c)};

const baseRun=run;
run=function(sp,k0){
 const id=sp&&sp.sp;
 if(!/^pt[1-8]$/.test(id||''))return baseRun(sp,k0);
 pal=paletteFor(id);count=0;active++;
 let r;
 try{r=baseRun(sp,k0)}catch(e){active--;throw e}
 return Promise.resolve(r).finally(()=>{active--})};
})();
