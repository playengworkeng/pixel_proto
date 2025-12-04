const WebSocket = require('ws');

const wss = new WebSocket.Server({port:8443});//new WebSocket.Server({port :8888})
//const ws = new WebSocket("http://localhost:8080")
// wss.on('connection', ws=>{
//     console.log('client connected')
// });
console.log("I started up 8443");
wss.onopen=()=>{
    console.log("received data sniffer");
    const sw = new WebSocket("ws://localhost:3000");
    sw.on('message', sws=>{
        console.log("connection made");
        console.log(sws.toString('utf8'));

        wss.send("Hello from sniffer");
     
    
      }   ) 
    }


wss.on('message',data=>{console.log(data.toString('utf8'))})

wss.on('error',error=>{
    console.error(error)
})
// wss.on('connection',(event)=>{
//         console.log("websocket established")
//     });


