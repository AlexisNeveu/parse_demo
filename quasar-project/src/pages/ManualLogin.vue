<template>
  <q-page class="flex-center flex on-top">

    <q-list class="on-right">
      <label>Pseudo : </label><br />
      <input v-model="loginPseudo" placeholder="Login Pseudo" /><br />
      <label>Password :</label><br />
      <input
        type="password"
        v-model="loginPassword"
        placeholder="Login Password"
      /><br />
      <button @click="login()">Login</button>

    </q-list>
    <q-btn v-if="isLogged" class="on-right" to="/workshop">Continue</q-btn>
  </q-page>
</template>

<script>
const Parse = require("parse");

Parse.initialize("myAppId", "JAVASCRIPT_KEY", "mySecretMasterKey");
Parse.serverURL = "http://127.0.0.1:1337/parse";

import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "IndexPage",
  setup() {

    const loginPseudo = ref("");
    const loginPassword = ref("");
    const isLogged = ref(false);

    //Log the user using the given credentials
    async function login() {
      Parse.User.logIn(
        loginPseudo.value,
        loginPassword.value
      ).then((result)=>{
        console.log(result.get("username"));
        //Reset the inputs
        loginPseudo.value = "";
        loginPassword.value = "";
        //Make the "Continue" button available
        isLogged.value = true;
      })

    }
    function logout() {
      Parse.User.logOut();
    }


    onMounted(() => {
      //Logout every time the page is reloaded to avoid session token issues
      logout();
    })


    return {

      loginPseudo,
      loginPassword,
      isLogged,
      login,
      logout,

    };
  },
});
</script>
