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
// var server = http.createServer(app);
// const io = socketIo(server);

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

//interval = setInterval(() => io.emit("verStautes",true), 2000);

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
    //res.json().then(console.log(JSON.stringify(res)))
    
    }

// WEBHOOK ENDPOINT
app.post('/webhook', async function (req, res) {
    try {
        console.log("got webhook" + req + "   type: " + req.body.message_type);
        if (req.body.message_type === 'new_connection') {
            console.log("new connection notif");
            sendConnectionNotification();
           // interval = setInterval(() => io.emit("verStautes",true), 2000);
            
        }
        else if (req.body.message_type === 'verification_request') {
            console.log("verification acceptance notif ");

            //const attribs = cache.get(req.body.data.ConnectionId)
            //if (attribs) {
            //var param_obj = JSON.parse(attribs);
            // var params = {
            //     values: {
            //         "Name": "Marina Gamal Elias",
            //         "GPA": "4.0",
            //         "Year": "2020",
            //         "Type": "Bachelor Dergree"
            //     }
            // }

            var res = await client.verifyVerification(cache.get("verificationID"));
            console.log(res.valid + " Verification")
            interval = setInterval(() => io.emit("verStatues",true), 2000);
            console.log("ba3at")
            //}
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

// app.post('/api/definition', cors(), async function (req, res) {

//     const Definition = await createCertificateCredentialDefinition();
//     const attribs = JSON.stringify(req.body);
//     //console.log(Definition.definitionId+"Definition")
//     // //var newDefinitionId=Definition.definitionId;
//    // cache.add("definitionId", Definition.definitionId);
//     cache.list();
//    // const offer= await createCertificateOffer();

//     //cache.add("credentialId", offer.credentialId);
//     //res.status(200).send({ invite_url: invite.invitation });
// }); 

// app.post('/api/offer', cors(), async function (req, res) {

//     const offer = await createCertificateOffer();
//     cache.add("credentialId", offer.credentialId);
//     cache.add("offer", offer);
//     // res.status(200).send({ invite_url: invite.invitation });
// });

app.post('/api/sendVerification', cors(), async function (req, res) {

    const verification = await sendVerificationPolicy();
    cache.add("verificationID",verification.verificationId);
    console.log("henaaaaaaaaaa")
    // res.status(200).send({ invite_url: invite.invitation });
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

const createCertificateCredentialDefinition = async () => {
    try {
        var credentialDefinition = await client.createCredentialDefinition({
            credentialDefinitionFromSchemaParameters: {
                name: "Computer Bachelor Degree",
                version: "1.0",
                attributes: ["Name", "GPA", "Year", "Type"],
                supportRevocation: false,
                tag: "19971997test1aaaaa"
            }
        });
        //console.log("OPaAAA" +result)
        return result;
    } catch (e) {
        console.log("OPa" + cache.get("definitionId"))
        console.log(e.message || e.toString());
    }
}
const createCertificateOffer = async () => {
    try {
        console.log("hi" + cache.get("definitionId"))
        var credentialOffer = await client.createCredential({
            credentialOfferParameters: {
                definitionId: "WqHxTAtrKbPsEqkhHDEJK:3:CL:87374:19971997test1aaaaa",
                connectionId: cache.get("connectionId")
            }
        });
        return credentialOffer;
    } catch (e) {
        console.log("OPa 2" + cache.get("connectionId"))
        console.log(e.message || e.toString());
    }
}

const createCertificateSchema = async () => {
    try {
        var credentialOffer = await client.createSchema({
            schemaParameters: {
                name: "Employee Badge",
                version: "1.0",
                attrNames: [
                    "Name",
                    "GPA",
                    "Year",
                    "Type"
                ]
            }
        });
        return result;
    } catch (e) {
        console.log("OPa 2")
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
// const io = socketIo(server);

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
    const url_val = await ngrok.connect(PORT);
    console.log("============= \n\n" + url_val + "\n\n =========");
    var response = await client.createWebhook({
        webhookParameters: {
            url: "http://2af88e4b8abf.ngrok.io/webhook",  // process.env.NGROK_URL
            type: "Notification"
        }
    });

    cache.add("webhookId", response.id);
    console.log('Listening on port %d', server.address().port);
}); 

const io = socketIo(server);
