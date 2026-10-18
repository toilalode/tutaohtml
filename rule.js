// ===== QUY LUẬT (phím H / nút M2): tách khỏi game.js =====
// Nạp TRƯỚC game.js (xem index.html). Dùng các hàm/biến toàn cục của game.js khi chạy: P, enemies, say, wait, flash, hit, strike, target, popup, toast, castBusy, FXK, GOLD...
const RULES=['Giảm trọng lực','Làm chậm kẻ địch','Sát thương x2','Hồi máu & thể lực'];

function lawMenu(){
 if(castBusy())return;
 if(!P.kh)return toast('H cần bật R (Kiếm Hồn Cửu Ngũ Chí Tôn) trước');
 popup('Quy luật — Kiếm Hồn',['Vạn Kiếm','Thiên Trảm','Áp Chế (bật/tắt, mỗi 5ms 100.000.000 sát thương gốc)'],-1,i=>ruleSkill(['van','tru','ap'][i]))}
// Sát thương gốc Quy Luật (chưa nhân Kiếm Hồn; hit()/strike() tự chia 3 rồi nhân dmgMul(), nên truyền x3)
//  Vạn Kiếm 4.500.000/quái (4 nhát x 1.125.000) · Thiên Trảm 9.000.000/quái (tia trời 6.000.000 + nổ 3.000.000) · Áp Chế 100.000.000 mỗi 5ms
const RULE_VAN_HIT=1125000,RULE_VAN_N=4,RULE_TRU_SKY=6000000,RULE_TRU_BOOM=3000000,AP_BASE=100000000;
async function ruleSkill(k){
 if(!P.kh)return;
 if(k=='ap'){if(P.ap>0){P.ap=0;return say('Hủy Áp Chế',900)}P.ap=1;say('Áp Chế — Thiên Địa Quy Luật, chúng sinh quỵ xuống!',2200);return flash(GOLD)}
 FXK('soul',{col:GOLD});
 if(k=='van'){say('Quy Luật — Vạn Kiếm Giáng Thế!',1600);await wait(30);
  enemies.slice(0,12).forEach((e,i)=>{for(let j=0;j<RULE_VAN_N;j++)setTimeout(()=>{if(e.hp<=0)return;const p=e.m.position,x=p.x+Math.random()*2-1,z=p.z+Math.random()*2-1;FXK('blade',{x,z,col:GOLD});setTimeout(()=>hit(x,z,3,RULE_VAN_HIT*3),200)},(i*4+j)*80)})}
 if(k=='tru'){say('Quy Luật — Thiên Trảm!',1600);await wait(40);const[tx,tz]=target();strike('sky',0,0,RULE_TRU_SKY*3,0,GOLD);strike('boom',tx,tz,RULE_TRU_BOOM*3,14,GOLD)}}
