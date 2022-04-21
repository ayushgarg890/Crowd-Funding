const http = require('http');
const _=require('lodash');
const fs= require('fs');
const { fromPairs } = require('lodash');

const server=http.createServer((req,res)=>{
    
    const num=_.random(0,20);
    console.log(num);

    res.setHeader("Content-Type",'text/html');
    //console.log(req.url,req.method);
 
    fs.readFile("./views/index.html",(err,data)=>{
        if(err){
            console.log(err);
            res.end();
        }
        else{
            res.end(data);
        }
    });

});

server.listen(3000,'localhost',()=>{
    console.log('listening at 3000');
});