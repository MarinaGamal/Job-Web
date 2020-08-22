# Stark Industries Website

This is a small website for "Stark Industries" Company, built on top of Hyperldger Indy's BLockchain using Hyperldger Aries and Trinsic.
It is aimed to complete the "College Certificate Project on top of the Blockchain" and acts as a the verifier entity, where the graduate comes here to apply for a job so the job asks for certain attributes from the credential issued from his College to be verified by executing proof against the ledger.


# Prerequisites:
- [npm](https://www.npmjs.com/get-npm)

## To use this project you need to do the following:

Edit the file called ".env-template" to ".env" and add the following in it:

ACCESSTOK= (to be requested from the developers) <br />                                                                     SUBKEY=(to be requested from the developers) <br />  

#------------- Credential Definition ----------------- #       <br />                                                            CRED_DEF_ID='Mp2F7q7czjX3MjwMQMNLhB:3:CL:84162:Default'      <br />  

#------------- Sovrin Staging Schema ------------------- #    <br />                                                            SCHEMA_ID='NGZRy3B7HgE4RpBJpzjM5y:2:business-card:1.0'    <br />  

#------------- BCovrin Schema -------------------------- #       <br />                                                                    #SCHEMA_ID='5ZtmDq3BwF7vVLcWTejb3M:2:business card:1.0'    <br />  

SKIP_PREFLIGHT_CHECK=true



## Then run the following commands:

    npm install .
    npm install i @streetcred.id/service-clients
    npm start
    
    
## Now you are ready to run the application:
After running the wallet project and receiveing your credential from the college. You just need to scan the QR (conection invitation) with your mobile wallet and a connection will be established.
On pressing the Apply button a verification offer will be sent to your mobile application, you then need to choose the right credential and present the requested values. Finally, a webhook would be received on Stark Industries to start verifying the correctness of this credential againt the ledger.
    
## Finally use the following 2 projects to continue the Isuuing credential and verifying it scenario.
1- College Website:   <br />                                                                                                                      https://github.com/msaidm/Blockchain-Certificates-Authentication  <br />                                                                                         2- Student Wallet (Mobile Application)               <br />                                                                                                    https://github.com/MarinaGamal/Mobile-React-Native-Course

