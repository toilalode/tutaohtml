function buildBeast(type){
 const g=new THREE.Group(),M=(geo,c,o=.95)=>{const m=new THREE.Mesh(geo,mat(c,o));g.add(m);return m};
 g.userData.type=type;
 if(type=='long'){g.userData.segs=[];for(let i=0;i<16;i++){const s=M(new THREE.SphereGeometry(.75-i*.035,8,6),i%3?0x28c868:0x6affb0);g.userData.segs.push(s)}
  const h=M(new THREE.ConeGeometry(.7,1.8,8),0x50ff90);h.rotation.x=Math.PI/2;g.userData.head=h;
  [-.4,.4].forEach(x=>{const c=M(new THREE.ConeGeometry(.12,1,5),GOLD);c.position.set(x,.8,-.3);c.rotation.x=-.5;g.userData.head.add(c)});g.userData.segs.forEach(s=>g.add(s))}
 else if(type=='ho'){M(new THREE.BoxGeometry(1.8,1.4,3.4),0xf5f5ff).position.y=1.6;const h=M(new THREE.BoxGeometry(1.3,1.1,1.2),0xffffff);h.position.set(0,2.1,2.1);
  [[-.5,2.7],[.5,2.7]].forEach(([x,y])=>M(new THREE.ConeGeometry(.2,.5,4),0xdddddd).position.set(x,y+.1,2.1));
  for(const x of[-.6,.6])for(const z of[-1.2,1.2])M(new THREE.BoxGeometry(.5,1.2,.5),0xeeeeee).position.set(x,.6,z);
  for(let i=0;i<4;i++)M(new THREE.BoxGeometry(1.9,.12,.3),0x222233).position.set(0,1.7,-1.2+i*.8);
  const t=M(new THREE.BoxGeometry(.25,.25,1.8),0xffffff);t.position.set(0,1.9,-2.5);t.rotation.x=.5;g.userData.legs=g.children.slice(5,9)}
 else if(type=='tuoc'){const b=M(new THREE.SphereGeometry(1,10,8),0xff6e28);b.scale.set(.9,.9,1.6);b.position.y=2;const h=M(new THREE.SphereGeometry(.55,8,6),0xff9040);h.position.set(0,2.6,1.7);
  const k=M(new THREE.ConeGeometry(.2,.7,5),GOLD);k.rotation.x=Math.PI/2;k.position.set(0,2.55,2.4);
  g.userData.wings=[-1,1].map(s=>{const w=M(new THREE.PlaneGeometry(4.5,2.2),0xff4010,.85);w.position.set(s*2.3,2.2,0);w.userData.s=s;return w});
  [0,1,2].forEach(i=>{const t=M(new THREE.BoxGeometry(.15,.15,3+i),i==1?GOLD:0xff2000);t.position.set((i-1)*.5,2,-2.5-i*.3);t.rotation.y=(i-1)*.2})}
 else if(type=='vu'){const d=M(new THREE.SphereGeometry(2,12,8,0,6.29,0,1.57),0x2a6a8a);d.scale.set(1,.8,1.2);
  M(new THREE.TorusGeometry(2,.1,4,16),0x9ad8ff).rotation.x=Math.PI/2;
  const h=M(new THREE.SphereGeometry(.5,8,6),0x3a8aaa);h.position.set(0,.8,2.7);
  g.userData.snake=[];for(let i=0;i<8;i++){const s=M(new THREE.SphereGeometry(.4-i*.03,6,5),0x2fe0b0);g.userData.snake.push(s)}}
 return g}
function animBeast(g,T){const u=g.userData;
 if(u.type=='long'){u.segs.forEach((s,i)=>{s.position.set(Math.sin(T*4-i*.5)*1.6,Math.cos(T*3-i*.4)*.6,-i*.95)});u.head.position.set(0,0,.9)}
 else if(u.type=='tuoc'){const f=Math.sin(T*10);u.wings.forEach(w=>{w.rotation.z=w.userData.s*f*.7;w.position.y=2.2+f*.6})}
 else if(u.type=='ho'){g.position.y=Math.abs(Math.sin(T*8))*.4}
 else if(u.type=='vu'){u.snake.forEach((s,i)=>s.position.set(Math.sin(T*3+i*.6)*1.2,2.3+i*.55,-1.5+Math.cos(T*3+i*.5)*.8))}}
function spawnBeast(type,tx,tz,o={}){
 const types=type=='all'?['long','ho','tuoc','vu']:[type];
 types.forEach((t,i)=>{const g=buildBeast(t),sc=(o.s||1)*(type=='all'?1.1:1.4);g.scale.setScalar(sc);
  const sx=player.position.x+(type=='all'?Math.cos(i*1.57)*6:0),sz=player.position.z+(type=='all'?Math.sin(i*1.57)*6:0),life=o.life||80;
  g.position.set(sx,t=='tuoc'||t=='long'?4:0,sz);scene.add(g);
  fx.push({m:g,life,max:life,upd:(f,k)=>{const e=t=='vu'?Math.min(1,k*3):Math.min(1,k*1.6),T=performance.now()/1000;
   const ex=t=='vu'?sx:sx+(tx-sx)*e,ez=t=='vu'?sz:sz+(tz-sz)*e;
   g.position.x=ex;g.position.z=ez;if(t=='tuoc'||t=='long')g.position.y=4+Math.sin(k*6)*1.5;
   g.rotation.y=t=='vu'?player.rotation.y:Math.atan2(tx-sx,tz-sz);animBeast(g,T);
   g.traverse(c=>{if(c.material)c.material.opacity=Math.min(c.material.opacity,1)*(k>.8?(1-k)*5:1)||0});}})});
 if(type=='all')FXK('ring',{r:16,life:40,col:0xffffff})}
