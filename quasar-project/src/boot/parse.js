import { boot } from "quasar/wrappers";

import Parse from "parse";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  Parse.initialize("myAppId", "JAVASCRIPT_KEY", "mySecretMasterKey");
  Parse.serverURL = "http://127.0.0.1:1337/parse";
});
