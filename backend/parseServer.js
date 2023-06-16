
const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const cors = require('cors');

const app = express();


const api = new ParseServer({ 
    databaseURI: 'mongodb://127.0.0.1/test',
    appId: 'myAppId',
    fileKey: 'myFileKey',
    masterKey: 'mySecretMasterKey',
    auth:{
      facebook: {
        appIds: ["269065128918177"], // Facebook App ID
      },
      github:{
        enabled:true
      }
     }
});
 api.start();

// Serve the Parse API at /parse URL prefix
app.use('/parse', api.app);

const port = 1337;
app.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});
