// Quy Luật Kiếm Hồn (M2/H) — sát thương gốc (chưa nhân Kiếm Hồn; hit() tự chia 3 rồi nhân dmgMul()):
//  Vạn Kiếm: 4.500.000 / quái (4 nhát x 1.125.000)
//  Thiên Trảm: 9.000.000 / quái (tia trời 6.000.000 + nổ 3.000.000)
// Nạp SAU game.js để thay thế ruleSkill cũ.
const RULE_VAN_HIT=1125000,RULE_VAN_N=4,RULE_TRU_SKY=6000000,RULE_TRU_BOOM=3000000;
ruleSkill=async function(k){
 if(!P.kh)return;
 if(k=='ap'){if(P.ap>0){P.ap=0;return say('Hủy Áp Chế',900)}P.ap=1;say('Áp Chế — Thiên Địa Quy Luật, chúng sinh quỵ xuống!',2200);return flash(GOLD)}
 FXK('soul',{col:GOLD});
 if(k=='van'){say('Quy Luật — Vạn Kiếm Giáng Thế!',1600);await wait(30);
  enemies.slice(0,12).forEach((e,i)=>{for(let j=0;j<RULE_VAN_N;j++)setTimeout(()=>{if(e.hp<=0)return;const p=e.m.position,x=p.x+Math.random()*2-1,z=p.z+Math.random()*2-1;FXK('blade',{x,z,col:GOLD});setTimeout(()=>hit(x,z,3,RULE_VAN_HIT*3),200)},(i*4+j)*80)})}
 if(k=='tru'){say('Quy Luật — Thiên Trảm!',1600);await wait(40);const[tx,tz]=target();strike('sky',0,0,RULE_TRU_SKY*3,0,GOLD);strike('boom',tx,tz,RULE_TRU_BOOM*3,14,GOLD)}};
