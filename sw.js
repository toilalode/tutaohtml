const V='thienmenh-v5';
const CORE=['./','index.html','style.css','skills.js','beasts.js','game.js','manifest.json','lib/three.min.js',
  'icons/icon-192.png','icons/icon-512.png','icons/maskable-192.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon-48.png'];
// File nặng, ít đổi → ưu tiên cache (nhanh hơn, ít tốn mạng)
const STATIC=/\/(lib\/three\.min\.js|icons\/[^/]+)$/;

self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(V);
    // thêm từng file; thiếu file nào (vd icon chưa upload) cũng không làm hỏng cả bản cài
    await Promise.allSettled(CORE.map(u=>c.add(new Request(u,{cache:'reload'}))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const ks=await caches.keys();
    await Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(V);
    if(STATIC.test(u.pathname)){
      const hit=await c.match(r);
      if(hit)return hit;
      try{const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}catch(_){return Response.error()}
    }
    // code/giao diện: luôn hỏi mạng trước (có bản mới là lấy ngay), mất mạng thì dùng bản đã lưu
    try{
      const n=await fetch(r,{cache:'no-cache'});
      if(n.ok)c.put(r,n.clone());
      return n;
    }catch(_){
      const hit=await c.match(r,{ignoreSearch:true});
      if(hit)return hit;
      if(r.mode==='navigate'){const h=await c.match('index.html');if(h)return h}
      return Response.error();
    }
  })());
});
