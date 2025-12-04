const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

const portLocal = 8080;

const options={
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
}

let server = https.createServer( options, (req, res)=>{

 res.writeHead(200)
res.send('hello');

})




const wss = new WebSocket.Server({server, path:'/'});//new WebSocket.Server({port :8888})

wss.on('connection',(ws)=>{
        console.log("websocket established");
        ws.on('error', console.error);
        ws.on('message',data=>{console.log(data.toString('utf8'));
        console.log(`server received a message ${data}`)
});
        ws.send('hello')
    });


// add the upgrade logic when coming from http
server.on('upgrade', (request, socket, head)=>{
    wss.handleUpgrade(request, socket, head, (ws)=>
    {    ws.send('hello')
        wss.emit('connection', ws, request);
    })

});

server.listen( portLocal, ()=> console.log('running https on port 8080'));