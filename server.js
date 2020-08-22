var http = require('http');
var parser = require('body-parser');
var cors = require('cors');
var path = require('path');
var { createTerminus } = require('@godaddy/terminus');
var express = require('express');
var ngrok = require('ngrok');
var cache = require('./model');
const fetch = require('node-fetch');
const socketIo = require("socket.io");

var policyID = "ea7c40c1-d36e-4dbe-cceb-08d83bd20448"

require('dotenv').config();

const { AgencyServiceClient, Credentials } = require("@streetcred.id/service-clients");
const client = new AgencyServiceClient(new Credentials(process.env.ACCESSTOK, process.env.SUBKEY));
console.log(process.env.ACCESSTOK)


var app = express();
app.use(cors());
app.use(parser.json());
app.use(express.static(path.join(__dirname, 'build')))

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});


const  sendConnectionNotification = async  ()  =>  {
    console.log("sending notfi")
    const res = await fetch(process.env.ngrok+'/webhook', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json',
        },
        body: JSON.stringify({
        "message_type": "NewConnection"
        }),
    });
    
    }

// WEBHOOK ENDPOINT
app.post('/webhook', async function (req, res) {
    try {
        console.log("got webhook" + req + "   type: " + req.body.message_type);
        if (req.body.message_type === 'new_connection') {
            console.log("new connection notif");
            sendConnectionNotification();           

            
        }
        else if (req.body.message_type === 'verification_request') {
            console.log("verification acceptance notif ");

            var res = await client.verifyVerification(cache.get("verificationID"));
            console.log(res.valid + " Verification")
            io.local.emit("hi",true)

          
        }
        
    }
    catch (e) {
        console.log(e.message || e.toString());
    }
});

//FRONTEND ENDPOINT
app.post('/api/issue', cors(), async function (req, res) {
    const invite = await getInvite();
    const attribs = JSON.stringify(req.body);
    cache.add("connectionId", invite.connectionId);
    res.status(200).send({ invite_url: invite.invitation });
});


app.post('/api/sendVerification', cors(), async function (req, res) {

    const verification = await sendVerificationPolicy();
    cache.add("verificationID",verification.verificationId);
});

const getInvite = async () => {
    try {
        var result = await client.createConnection({
            connectionInvitationParameters: { "name": "Stark Industries" }
        });
        return result;
    } catch (e) {
        console.log(e.message || e.toString());
    }
}


const sendVerificationPolicy = async () => {
    try {
        var result = await client.sendVerificationFromPolicy(cache.get("connectionId"), policyID);
        console.log(result)
        return result;
    } catch (e) {
        console.log(e.message || e.toString());
    }
}

// for graceful closing
 var server = http.createServer(app);
 let interval
const io = socketIo(server);
io.on("connection", (socket) => {
    console.log("Client connected");
   
});

async function onSignal() {
    var webhookId = cache.get("webhookId");
    const p1 = await client.removeWebhook(webhookId);
    return Promise.all([p1]);
}
createTerminus(server, {
    signals: ['SIGINT', 'SIGTERM'],
    healthChecks: {},
    onSignal
});

const PORT = process.env.PORT || 5004;
var server = server.listen(PORT, async function () {


    cache.add("webhookId", response.id);
    console.log('Listening on port %d', server.address().port);
}); 

