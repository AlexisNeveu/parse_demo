<template>
  <q-page class="flex flex-center">
    <div>
      <!--<q-btn to="/fblogin">Facebook</q-btn>-->
      <q-btn
        href="https://github.com/login/oauth/authorize?client_id=4d893c6356341f56356b"
        >GitHub</q-btn
      >
      <q-btn href="https://sgithub.fr.world.socgen/login/oauth/authorize?client_id=3ff683064f7ec27996f9">SGitHub</q-btn>
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
