(function(){
const Orig=THREE.WebGLRenderer;
const attempts=[
 {antialias:false,powerPreference:'low-power',stencil:false},
 {antialias:false,alpha:false,stencil:false,precision:'mediump',failIfMajorPerformanceCaveat:false},
 {antialias:false,alpha:true,depth:true,stencil:false,precision:'lowp',preserveDrawingBuffer:false}
];
function report(msg){
 const box=document.getElementById('errbox')||document.body.appendChild(Object.assign(document.createElement('pre'),{id:'errbox'}));
 box.style.cssText='position:fixed;left:0;right:0;top:0;max-height:45%;overflow:auto;margin:0;padding:6px;background:rgba(150,0,0,.92);color:#fff;font:11px monospace;white-space:pre-wrap;z-index:99999';
 box.textContent+=msg+'\n';
}
function SafeRenderer(params){
 let lastError=null;
 for(const extra of attempts){
  try{
   const renderer=new Orig(Object.assign({},params,extra));
   renderer.domElement.addEventListener('webglcontextlost',e=>e.preventDefault());
   return renderer;
  }catch(err){lastError=err}
 }
 report('Thiết bị không mở được WebGL: '+(lastError&&lastError.message||lastError)+'\nHãy bật tăng tốc phần cứng trong trình duyệt hoặc dùng Chrome mới nhất.');
 throw lastError;
}
SafeRenderer.prototype=Orig.prototype;
THREE.WebGLRenderer=SafeRenderer;
})();
(function(){
if(!/[?&]debug\b/.test(location.search))return;
const s=document.createElement('script');
s.src='https://cdn.jsdelivr.net/npm/eruda@3.4.3/eruda.js';
s.onload=()=>{try{eruda.init()}catch(err){console.error(err)}};
s.onerror=()=>console.error('Không tải được Eruda (cần Internet khi dùng ?debug)');
document.head.appendChild(s);
})();
