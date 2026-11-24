'use strict';
const http=require('http');
const fs=require('fs');
const path=require('path');

const ROOT=__dirname;
const TYPES={
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.png':'image/png',
  '.md':'text/plain; charset=utf-8'
};

const argPort=process.argv.slice(2).map(a=>/^PORT=(\d+)$/.exec(a)).find(Boolean);
const port=Number(process.env.PORT||(argPort&&argPort[1])||8000);

http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}
  catch(e){res.writeHead(400);res.end('Bad request');return}
  if(pathname.endsWith('/'))pathname+='index.html';
  const file=path.join(ROOT,path.normalize(pathname));
  if(file!==ROOT&&!file.startsWith(ROOT+path.sep)){res.writeHead(403);res.end('Forbidden');return}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404);res.end('Not found');return}
    res.writeHead(200,{
      'Content-Type':TYPES[path.extname(file).toLowerCase()]||'application/octet-stream',
      'Cache-Control':'no-cache'
    });
    res.end(data);
  });
}).listen(port,()=>console.log('http://localhost:'+port));
