<template>
  <q-page class="flex flex-center">
    <div>
      <!--<q-btn to="/fblogin">Facebook</q-btn>-->
      <q-btn
        href="https://github.com/login/oauth/authorize?client_id=4d893c6356341f56356b"
        >GitHub</q-btn
      >
      <q-btn to="/manualLogin">Manual Login</q-btn>
    </div>
  </q-page>
</template>

<script>
const Parse = require("parse");

Parse.initialize("myAppId", "JAVASCRIPT_KEY", "mySecretMasterKey");
Parse.serverURL = "http://127.0.0.1:1337/parse";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginPage",
});
</script>
