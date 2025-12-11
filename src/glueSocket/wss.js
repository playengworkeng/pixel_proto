const WebSocket = require("ws");
const https = require("https");
const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();

const portLocal = 8080;
const matchmaker = process.env.MATCH_MAKER;

const options = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem"),
};

const server = http.createServer(app);

// let server = https.createServer( options, (req, res)=>{

//  res.writeHead(200)
// res.send('hello');

// })

app.get("/", (req, res) => {
  res.send("Hello");
});

const playerMap = new Map();

function routeToMatchMaker(ws, req, inMessage = null) {
  try {
    const player = playerMap.get(req.socket.remoteAddress);

    if (player == null) {
      console.log(`connecting to ${matchmaker}`);
      console.log(`creating player for address ${req.socket.remoteAddress}`);
      wc = new WebSocket(matchmaker);

      playerMap.set(req.socket.remoteAddress, { wsc: wc, url: req.socket.remoteAddress});

      wc.on("open", () => {
        console.log(`player connection to ${matchmaker}`);
            if (inMessage != null)
      {
      wc.send(inMessage);
      }
      });

      wc.on("message", (message) => {
        let msg = JSON.parse(message);
        let ms = JSON.stringify(message);
        console.log(`got a message ${ms} from streamer`);
        console.log(`msg type: ${msg.type}`);

        if (msg.type == "answer" || msg.type == "config") {
          console.log(`sending ${message} to player`);
          
        }

       isBuffer = false;

        if ( ms.includes("Buffer"))
        {
            console.log(`we got a buffer ${ms}`)

        }

        if (Buffer.isBuffer(message)) {
          ws.send(message.toString("utf8"));
        } else {

            if ( !isBuffer)
            {
          ws.send(message);
            }
        }
      });

    } else {
      if (inMessage != null) {

        player.wsc.send(inMessage);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const wss = new WebSocket.Server({ noServer: true, path: "/" }); //new WebSocket.Server({port :8888})

wss.on("connection", (ws, req) => {
  console.log(`websocket established from ${req.url}`);
  console.log(`websocket established from ${req.socket.remoteAddress}`);
  ws.on("error", console.error);
  ws.on("message", (data) => {
    console.log(data.toString("utf8"));
    console.log(`server received a message ${data}`);
    routeToMatchMaker(ws, req, data);
  });

  routeToMatchMaker(ws, req);
});

// add the upgrade logic when coming from http
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    //  ws.send('hello..upgrading')
    console.log(socket.address())
    console.log(socket.remoteAddress)
    wss.emit("connection", ws, request);
  });
});

server.listen(portLocal, () => console.log("running https on port 8080"));
