var http = require('http');
var parser = require('body-parser');
var cors = require('cors');
var path = require('path');
var { createTerminus } = require('@godaddy/terminus');
var express = require('express');
var ngrok = require('ngrok');
var cache = require('./model');

var policyID = "c1f2b922-8aa5-4b9f-7bc7-08d82e24cbd8"

require('dotenv').config();

const { AgencyServiceClient, Credentials } = require("@streetcred.id/service-clients");
const client = new AgencyServiceClient(new Credentials(process.env.ACCESSTOK, process.env.SUBKEY));

var app = express();
app.use(cors());
app.use(parser.json());
app.use(express.static(path.join(__dirname, 'build')))

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});


// WEBHOOK ENDPOINT
app.post('/webhook', async function (req, res) {
    try {
        console.log("got webhook" + req + "   type: " + req.body.message_type);
        if (req.body.message_type === 'new_connection') {
            console.log("new connection notif");

            // var params =
            // {
            //     credentialOfferParameters: {
            //         definitionId: process.env.CRED_DEF_ID,
            //         connectionId: req.body.object_id
            //     }
            // }
            // await client.createCredential(params);
        }
        else if (req.body.message_type === 'verification_request') {
            console.log("verification acceptance notif ");

            //const attribs = cache.get(req.body.data.ConnectionId)
            //if (attribs) {
            //var param_obj = JSON.parse(attribs);
            var params = {
                values: {
                    "Name": "Marina Gamal Elias",
                    "GPA": "4.0",
                    "Year": "2020",
                    "Type": "Bachelor Dergree"
                }
            }

            await client.verifyVerification(offer.credentialId, {
                body: {
                    "Name": "Marina Gamal Elias",
                    "GPA": "4.0",
                    "Year": "2020",
                    "Type": "Bachelor Dergree"
                }
            });
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

app.post('/api/offer', cors(), async function (req, res) {

    const offer = await createCertificateOffer();
    cache.add("credentialId", offer.credentialId);
    cache.add("offer", offer);
    // res.status(200).send({ invite_url: invite.invitation });
});

app.post('/api/sendVerification', cors(), async function (req, res) {

    const offer = await sendVerificationPolicy();
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

const PORT = process.env.PORT || 3002;
var server = server.listen(PORT, async function () {
    const url_val = await ngrok.connect(PORT);
    console.log("============= \n\n" + url_val + "\n\n =========");
    var response = await client.createWebhook({
        webhookParameters: {
            url: "http://45660c45.ngrok.io/webhook",  // process.env.NGROK_URL
            type: "Notification"
        }
    });

    cache.add("webhookId", response.id);
    console.log('Listening on port %d', server.address().port);
});