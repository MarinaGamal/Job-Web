import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from "@material-ui/core/es/Typography/Typography";
import Button from '@material-ui/core/Button';
import axios from 'axios';
import QRcode from 'qrcode.react';
import "./styles.css";
import home from "./home.jpeg"
import { Checkmark } from 'react-checkmark';
import socketIOClient from "socket.io-client";


var ngrok = "http://b42e2d162c0c.ngrok.io"
axios.defaults.baseURL = 'http://localhost:5004/';
let interval;

const sendVerOfferNotification = async () => {
    const res = await fetch(ngrok + '/webhook', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
        },
        body: JSON.stringify({
            "message_type": "NewVer"
        }),
    });
    res.json().then(console.log(JSON.stringify(res)))

}

export class App extends Component {
    state = {
        qr_open: false,
        qr_placeholder: "",
        invite_url: "",
        disabled: false,
        checkMarkDisabled: false
    };

    componentDidMount() {
        //this.setState({ chechMarkDisabled: true })
        console.log(this.state.chechMarkDisabled + 'hi')
        const socket = socketIOClient('http://192.168.1.39:5004/');
        let timeRun = 0
        interval = setInterval(() => {

            timeRun += 1;
            console.log(timeRun)
            if (timeRun > 5) {
                clearInterval(interval)
            }
            socket.on("hi", (data) => {
                console.log("Home Client disconnected");
                this.changeCheckMark();
                console.log(this.state.checkMarkDisabled)

            });
        });
        socket.on("verStatues", data => {
            console.log("Home Client disconnected");
            this.setState({ checkMarkDisabled: true });
            console.log(this.checkMarkDisabled)

        });
        axios.post('/api/issue').then((response) => {
            console.log(response);
            this.setState({ invite_url: "https://web.cloud.streetcred.id/link/?c_i=" + response.data.invite_url });
        });
        this.setState({
            qr_open: false,
            qr_placeholder: this.state,
        })
    }


    onApplyJob = () => {
        axios.post('/api/sendVerification').then((response) => {
            console.log(response);

        });
        sendVerOfferNotification();
        this.setState({ disabled: true })
    }

    changeCheckMark = () => {
        this.setState({ chechMarkDisabled: true })
    }



    render() {

        const card = this.state
        return (

            <div className='myBackgrounds' >
                <AppBar position="static">
                    <Toolbar style={{ paddingLeft: 300, backgroundColor: 'black', }}>
                        <img style={{}} />
                        <Typography variant="h4" color="primary">
                            Stark Industries
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                    </Toolbar>

                </AppBar>
                <div >
                    <img
                        className="home"
                        src={home}
                    />
                </div>
                <div style={{ paddingLeft: 300, paddingTop: 30 }}>
                    <div style={{ marginBottom: 20 }}>
                        <Typography variant="h4" color="black" style={{ flexGrow: 1 }}>
                            <b>Connect to Stark Industries</b>
                        </Typography>
                    </div>

                    <div style={{ marginBottom: 5 }}>

                        <Typography variant="h6" color="textPrimary" style={{ flexGrow: 1 }}>
                            First you need to scan the QR code with your mobile agent from your phone to form a connection with Stark Industries.
                                </Typography>
                        <div style={{flexDirection:'row', paddingTop:"20px"}}>
                        <QRcode size="200" value={this.state.invite_url} style={{margin: "0 auto", padding: "0px" }} />
                            <div style={{marginBottom:20}}>
                                {this.state.chechMarkDisabled ? <Checkmark style={{margin: 2 }} size='xLarge' /> : null}
                            </div>
                            
                        </div>


                    </div>



                    <div style={{ marginBottom: 20 }}>

                        <Typography variant="h6" color="textPrimary" style={{ flexGrow: 1 }}>
                            Once you have accepted the connection from your mobile agent, click the button below to receive your verification offer!
                        </Typography>
                        <Button disabled={this.state.disabled} size="large" variant="contained" color="primary" onClick={() => this.onApplyJob()}>
                            Apply for this job
                        </Button>
                    </div>



                </div>
            </div>
        )
    }
}