# Stark Industries Website

This is a small website for "Stark Industries" Company, built on top of Hyperldger Indy's BLockchain using Hyperldger Aries and trinsic.
It is aimed to complete the the "College Certificate Project on top of the Blockchain" and acts as a the verifier entity, where the graduate comes here to apply for a job so the job asks for certain attributes from the credential issued from his College to be verified by executing proof against the ledger.


# Prerequisites:
- [npm](https://www.npmjs.com/get-npm)

## To use this project you need to do the following:

Edit the file called ".env-template" to ".env" and add the following in it:

ACCESSTOK='1EttW4CmYNfwUcv93z6Dbff54jp5i8OSg-Xt0ZCMns4'                                                                          SUBKEY='d9cce2ec9adb4741b0b85279031d614b'

#------------- Credential Definition ----------------- #                                                                CRED_DEF_ID='Mp2F7q7czjX3MjwMQMNLhB:3:CL:84162:Default'

#------------- Sovrin Staging Schema ------------------- #                                                             SCHEMA_ID='NGZRy3B7HgE4RpBJpzjM5y:2:business-card:1.0'

#------------- BCovrin Schema -------------------------- #                                                                        #SCHEMA_ID='5ZtmDq3BwF7vVLcWTejb3M:2:business card:1.0'

SKIP_PREFLIGHT_CHECK=true



## Then run the following commands:

    npm install .
    npm install i @streetcred.id/service-clients
    npm start
    
    
## Now you are ready to run the application:
After running the wallet project and receiveing your credential from the college. You just need to Scan the QR (conection invitation) with your mobile wallet a connection will be established.
On pressing the Apply button a verificatio offer will be sent to your mobile application, you then need to choose the right credential and present the requested values. Finally, a webhook would be received in Stark Industries to start verifying the correctness of this credential againt the ledger.
    
## Finally use the following 2 projects to continue the Isuuing credential and verifying it scenario.
1- College Website:                                                                                                                      https://github.com/msaidm/Blockchain-Certificates-Authentication                                                                                                2- Student Wallet (Mobile Application)                                                                                                                https://github.com/MarinaGamal/Mobile-React-Native-Course

