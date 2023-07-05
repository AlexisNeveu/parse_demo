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

    async function login() {
      const user = await Parse.User.logIn(
        loginPseudo.value,
        loginPassword.value
      );
      console.log(user.get("username"));
      loginPseudo.value = "";
      loginPassword.value = "";
      isLogged.value = true;
    }
    function logout() {
      Parse.User.logOut();
    }


    onMounted(() => {
      //Logout every time the page is reloaded to avoid session token issues -> To be fixed
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
