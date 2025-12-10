const WebSocket = require('ws')
const connectionURL = process.env.CIRRUS_SERVER;//"";
// const RTCPeerConnection = require('@roamhq/wrtc').RTCPeerConnection;

let server = null;
// let iPeerConnection = RTCPeerConnection({
//     sdpSemantics: 'unified-plan'
// });

async function createAnswer(ws){

    // const firstAnswer = iPeerConnection.createAnswer();
    const updatedAnswer ={
        type: 'answer',
        sdp: "None"
    };


    console.log("sending sdp");

    ws.send(JSON.stringify( updatedAnswer));

}

function connect(){

    try{
     console.log(`connection url is ${connectionURL}`)
    if ( connectionURL  )
    {
        console.log('opening a new connection')
        server = new WebSocket(connectionURL)
        server.on('open', ()=>{
            console.log("we have connection");

            
        })


        server.on('message', (data)=>{

                msg = JSON.parse(data);
                message = JSON.stringify(data);

                console.log(`received ${message} from cirrus`)

                if (msg.type =='offer')
                {
                    console.log(message);
                    console.log("Create an answer for offer");
                    createAnswer(server)
                }
            })
    }
    }catch (error)
    {
        console.log(error);
        exit();
    }
}

function main()
{
    try{
        connect();
        console.log(`getting ready to connect to ${connectionURL}`);
    }
    catch(error){

        console.log(error.message);
        exit();
    }
    
}

process.on('uncaughtException', function(err) {
      // handle the error safely
      console.log(err)
  })

main();