const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

const portLocal = 8080;
let hws = null;

const options={
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
}

let server = https.createServer( options, (req, res)=>{

res.writeHead(200);

})




const wss = new WebSocket.Server({server});//new WebSocket.Server({port :8888})

// wss.onopen=()=>{
//     console.log("received data sniffer");
//     const sw = new WebSocket("ws://localhost:3000");
//     sw.on('message', sws=>{
//         console.log("connection made");
//         console.log(sws.toString('utf8'));

//         wss.send("Hello from sniffer");
     
//       }   ) 
//     }


// wss.on('message',data=>{console.log(data.toString('utf8'))})

wss.on('error',error=>{
    console.error(error)
})

wss.on('connection',(ws)=>{
        console.log("websocket established");
        ws.on('error', console.error);
        ws.send('hello')
    });


//add the upgrade logic when coming from http
server.on('upgrade', (request, socket, head)=>{
    wss.handleUpgrade(request, socket, head, (ws)=>
    {    ws.send('hello')
        wss.emit('connection', ws, request);
    })

});

server.listen( portLocal, ()=> console.log('running https on port 8080'));