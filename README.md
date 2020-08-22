This is a small website for "Stark Industries" Company, built on top of Hyperldger Indy's BLockchain using Hyperldger Aries and trinsic.
It is aimed to complete the the "College Certificate Project on top of the Blockchain" and acts as a the verifier entity, where the graduate comes here to apply for a job so the job asks for certain attributes from the credential issued from his College to be verified by executing proof against the ledger.

TO use this project you need to do the following:

Edit the file called ".env-template" to ".env" and add the following in it:

ACCESSTOK='gaDRZiA3Ux2fkmhM_xBP3PCd2uF3TcG6lMFhO7GyVrU' 
SUBKEY='0c1596b315f84ac9a4de6810ef464411'

#------------- Credential Definition ----------------- # 
CRED_DEF_ID='Mp2F7q7czjX3MjwMQMNLhB:3:CL:84162:Default'

#------------- Sovrin Staging Schema ------------------- # 
SCHEMA_ID='NGZRy3B7HgE4RpBJpzjM5y:2:business-card:1.0'

#------------- BCovrin Schema -------------------------- # 
#SCHEMA_ID='5ZtmDq3BwF7vVLcWTejb3M:2:business card:1.0'

SKIP_PREFLIGHT_CHECK=true



Then run the following commands:

    npm install .
    npm install i @streetcred.id/service-clients
    npm start

