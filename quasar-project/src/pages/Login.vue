<template>
  <q-page class="flex flex-center">
    <div>
      <!--<q-btn to="/fblogin">Facebook</q-btn>-->
      <q-btn
        href="https://github.com/login/oauth/authorize?client_id=clientId"
        >GitHub</q-btn
      >
      <q-btn href="https://enterpriseGithubHost/path?client_id=clientId">Enterprise GitHub</q-btn>
    </div>
  </q-page>
</template>

<script>
const Parse = require("parse");

import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "LoginPage",
  setup(){
    onMounted(()=>{
      if(Parse.User.current()){
        Parse.User.logOut();
      }
      console.log(document.cookie)
    })
  }
});
</script>
