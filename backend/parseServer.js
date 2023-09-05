
const schemas = require ("./schemas")
const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const cors = require('cors');
const init = require('./init');

const app = express();
console.log(schemas);
const User = schemas.User;
const Repository = schemas.Repository

const api = new ParseServer({ 
    databaseURI: 'mongodb://127.0.0.1/test', //By default with mongoDB (command "mongodb-runner start") 
    appId: 'myAppId',
    restApiKey: 'RestKey',
    fileKey: 'myFileKey',
    masterKey: 'mySecretMasterKey',
    cloud: './cloud/main.js',
    allowClientClassCreation: false,
    auth:{
      facebook: {
        appIds: ["269065128918177"], // Facebook App ID
      },
      github:{
        enabled:true
      }
    },
    schema: {
      definitions: [User,Repository,schemas.Library,schemas.Group,schemas.Role,schemas.Template],
      // If set to `true`, the Parse Server API for schema changes is disabled and schema 
      // changes are only possible by redeployingParse Server with a new schema definition
      lockSchemas: true,
      // If set to `true`, Parse Server will automatically delete non-defined classes from
      // the database; internal classes like `User` or `Role` are never deleted.
      strict: true,
      // If set to `true`, a field type change will cause the field including its data to be
      // deleted from the database, and then a new field to be created with the new type
      recreateModifiedFields: false,
      // If set to `true`, Parse Server will automatically delete non-defined class fields;
      // internal fields in classes like User or Role are never deleted.
      deleteExtraFields: false,
    },

});
 api.start();

// Serve the Parse API at /parse URL prefix
app.use('/parse', api.app);

const port = 1337;
app.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
  init.upgrade();
});
