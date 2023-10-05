import { boot } from "quasar/wrappers";

import Parse from "parse";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  Parse.initialize("leto-modelizer-api-dev",null , "password");
  Parse.serverURL = "http://127.0.0.1:1337/api";
});
