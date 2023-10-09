<!--This page can be reached after being redirected by github with the temporary code necessary to get an access_token-->
<template>
  <q-page class="flex-center">
    <div class="flex-center flex on-top">
      <q-btn class="on-right" to="/">Back</q-btn>
    </div>
    <div class="flex flex-center" id="status">Please Log In</div>
    <div class="flex flex-center" id="userInfos">User Infos</div>
  </q-page>
</template>

<script>
const Parse = require("parse");
const axios = require("axios");
const { Octokit, App } = require("octokit");

import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "SGitHubLogin",

  setup() {

    const logged = ref(false);
    // This function retrieves the temporary code provided by the github api and that is used to get the access_token
    function getCode() {
      var code = window.location.href.match(/\?code=(.*)/)[1];
      code = code.substring(0, 20);
      console.log("get code (): ");
      console.log(code);
      return code;
    }
    //This function is called when the login button is clicked
    //It allows the user after being authenticated via github to link his account to parse
    async function login() {
      const code = getCode();
      await Parse.Cloud.run("GitHubAuth", {code: code}).then((result)=>{
        console.log("Successfully authenticated");
        console.log(result.get('authData'))
        const user = new Parse.User();
        user.set("username", result.get('username'));
        user.set('firstname', result.get('firstname'));
        user.linkWith("enterpriseGithub", {authData: result.get('authData').enterpriseGithub}).then(()=>{
          console.log(Parse.User.current());
        })
      })
    }
    onMounted(() => {
      login();
    });
    return {
      login,
      getCode,
      displayLoggingInfos,
      linkUserToParse,
      logged,
    };
  },
});
</script>
