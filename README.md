

Create a file named .env and paste in it the following:

ACCESSTOK='gaDRZiA3Ux2fkmhM_xBP3PCd2uF3TcG6lMFhO7GyVrU' SUBKEY='0c1596b315f84ac9a4de6810ef464411'

#------------- Credential Definition ----------------- # CRED_DEF_ID='Mp2F7q7czjX3MjwMQMNLhB:3:CL:84162:Default'

#------------- Sovrin Staging Schema ------------------- # SCHEMA_ID='NGZRy3B7HgE4RpBJpzjM5y:2:business-card:1.0'

#------------- BCovrin Schema -------------------------- # #SCHEMA_ID='5ZtmDq3BwF7vVLcWTejb3M:2:business card:1.0'

SKIP_PREFLIGHT_CHECK=true

Then run:

    npm install .
    npm install i @streetcred.id/service-clients
    npm start

