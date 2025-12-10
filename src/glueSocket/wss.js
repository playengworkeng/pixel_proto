const WebSocket = require('ws');
const https = require('https');
const http = require('http')
const fs = require('fs');
const express = require('express');
const app = express();


const portLocal = 8080;
const cirrus = process.env.CIRRUS_SERVER;



const options={
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
}

const server = http.createServer(app);

// let server = https.createServer( options, (req, res)=>{

//  res.writeHead(200)
// res.send('hello');

// })

app.get('/', (req,res)=>{
    res.send('Hello');
    
})

function routeToCirrus(ws,inMessage)
{
    try{
         wc = new WebSocket(cirrus);

         wc.on('open', ()=>{
            console.log(`player connection to ${cirrus}`)
        })

        wc.on('message', (message)=>{

            let msg = JSON.parse(message);
            let ms = JSON.stringify(message);
            console.log(`got a message ${ms} from streamer`)
            console.log(`msg type: ${msg.type}`)

            if ( msg.type == 'answer' || msg.type =='config')
            {

                console.log(`sending ${mmessages} to player`)
            ws.send(message);
            }

           ws.send(message);
        })

        wc.send(inMessage);


    }catch (error){
        console.log(error);
    }

}


const wss = new WebSocket.Server({noServer:true, path:'/'});//new WebSocket.Server({port :8888})

wss.on('connection',(ws)=>{
        console.log("websocket established");
        ws.on('error', console.error);
        ws.on('message',(data)=>{console.log(data.toString('utf8'));
        console.log(`server received a message ${data}`)
        routeToCirrus(ws, data);
});
       // ws.send('connected-hello')
       
    });


// add the upgrade logic when coming from http
server.on('upgrade', (request, socket, head)=>{
    wss.handleUpgrade(request, socket, head, (ws)=>
    {  //  ws.send('hello..upgrading')
        wss.emit('connection', ws, request);
    })

});

server.listen( portLocal, ()=> console.log('running https on port 8080'));