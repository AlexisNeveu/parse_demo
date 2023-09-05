<template>
  <q-page class="flex flex-center">
    <div>
      <!--<q-btn to="/fblogin">Facebook</q-btn>-->
      <q-btn
        href="https://sgithub.fr.world.socgen/login/oauth/authorize?client_id=3ff683064f7ec27996f9"
        >GitHub</q-btn
      >
      <q-btn to="/manualLogin">Manual Login</q-btn>
    </div>
  </q-page>
</template>

<script>
const Parse = require("parse");

import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginPage",
});
</script>
