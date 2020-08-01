import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from "@material-ui/core/es/Typography/Typography";
import Button from '@material-ui/core/Button';
//import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import QRcode from 'qrcode.react';
import "./styles.css";
import home from "./home.jpeg"
import { Checkmark } from 'react-checkmark'


axios.defaults.baseURL = 'http://localhost:5004/';
export class App extends Component {
    state = {
        qr_open: false,
        qr_placeholder: "",
        invite_url: "",
        disabled: false,
    };

    componentDidMount() {
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
        // const bizCard = {
        //     Name: "Mohammed Said", 
        //     GPA: "2.9",
        //     Year: "2020",
        //     Type: "bachelor",
        // }  
        // console.log(bizCard)
        // axios.post('/api/definition').then((response) => {
        //     console.log(response);

        // });
        axios.post('/api/sendVerification').then((response) => {
            console.log(response);

        });
        this.setState({disabled:true})

    }


    render() {

        const card = this.state
        return (

            <div className='myBackgrounds' >
                {/* The AppBar */}
                <AppBar position="static">
                    <Toolbar style={{ paddingLeft: 300, backgroundColor: 'black', }}>
                        <img style={{}} />
                        <Typography variant="h4" color="primary">
                            Stark Industries
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                    </Toolbar>
                
                </AppBar>
                

                {/* The Paper
                 <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Paper style={{display: 'flex', maxWidth: '600px', width: '100%', margin: '40px', padding: 40}}>
                        <div style={{display: 'flex', padding: '24px 24px', flexDirection: 'column', width: '100%'}}>
                            <div style={{display: 'flex', marginBottom: '24px'}}>
                                <Typography variant="h5" style={{flexGrow: 1}}>
                                    Create your Business Card Credential
                                </Typography>
                                
                                
                            </div>
                            
                            <TextField  
                              id="name"
                              label="name"
                              placeholder={"what's your name?"}
                              value={card.name}
                              onChange={(e) => this.setState({name: e.target.value})}
                              style={{marginBottom: '12px'}}
                              />
                            <TextField  
                              id="title"
                              label="title"
                              placeholder={"what's your title?"} 
                              value={card.title}
                              onChange={(e) => this.setState({title: e.target.value})}
                              style={{marginBottom: '12px'}}
                              />
                            <TextField  
                              id="org"
                              label="org"
                              placeholder={"where do you work?"} 
                              value={card.org}
                              onChange={(e) => this.setState({org: e.target.value})}
                              style={{marginBottom: '12px'}}
                              />
                            <TextField  
                              id="phone"
                              label="phone"
                              placeholder={"what's your #?"} 
                              value={card.phone}
                              onChange={(e) => this.setState({phone: e.target.value})}
                              style={{marginBottom: '12px'}}
                              />
                            <TextField  
                              id="email"
                              label="email"
                              placeholder={"what's your email?"} 
                              value={card.email}
                              onChange={(e) => this.setState({email: e.target.value})}
                              style={{marginBottom: '36px'}}
                              />
                            <Button   style={{backgroundColor: '#9b84ff'}}
                                      onClick={() => this.onIssue()}>
                                Issue Credential
                            </Button>
                        </div>
                    </Paper>
                </div> */}

                <div >
                    <img
                        // style={{ flex: 1, height: undefined, width: 100 %}}
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

                    <div style={{ marginBottom: 20 }}>

                        <Typography variant="h6" color="textPrimary" style={{ flexGrow: 1 }}>
                            First you need to scan the QR code with your mobile agent from your phone to form a connection with Stark Industries.
                                </Typography>
                        <QRcode size="200" value={this.state.invite_url} style={{ margin: "0 auto", padding: "10px" }} />

                    </div>

                    <div style={{ marginBottom: 20 }}>

                        <Typography variant="h6" color="textPrimary" style={{ flexGrow: 1 }}>
                            Once you have accepted the connection from your mobile agent, click the button below to receive your verification offer!
                        </Typography>
                        <Button disabled = {this.state.disabled} size="large" variant="contained" color="primary" onClick={() => this.onApplyJob()}>
                            Apply for this job
                        </Button>
                        <Checkmark size='xxLarge' />
                    </div>



                </div>
            </div>
        )
    }
}