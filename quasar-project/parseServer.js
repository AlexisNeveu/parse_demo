
const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const cors = require('cors');
const init = require('./init');

const app = express();


const api = new ParseServer({ 
    databaseURI: 'mongodb://127.0.0.1/test', //By default with mongoDB (command "mongodb-runner start") 
    appId: 'myAppId',
    fileKey: 'myFileKey',
    masterKey: 'mySecretMasterKey',
    cloud: '../backend/cloud/main.js',
    allowClientClassCreation: false,
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
  init.upgrade();
});
