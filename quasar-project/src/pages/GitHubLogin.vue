<!--This page can be reached after being redirected by github with the temporary code necessary to get an access_token-->
<template>
  <q-page class="flex-center">
    <div class="flex-center flex on-top">
      <q-btn class="on-right" to="/login">Back</q-btn>
      <q-btn v-if="logged" class="on-right" to="/workshop">Continue</q-btn>
      <!--<q-btn class="on-right" @click="login()">LogIn</q-btn>-->
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
  name: "GitHubLogin",

  setup() {

    const logged = ref(false);
    // This function retrieves the temporary code provided by the github api and that is used to get the access_token
    function getCode() {
      var code = window.location.href.match(/\?code=(.*)/)[1];
      code = code.substring(0, 21);
      console.log("get code (): ");
      console.log(code);
      return code;
    }
    //This function displays in the dom all raw infos retrieved via the github api after logging in
    function displayLoggingInfos(userData) {
      document.getElementById("status").innerHTML =
        "Thank you for logging in with GitHub " + userData.name;
      var result = Object.keys(userData).map((k) => ({
        [k]: userData[k],
      }));
      var text = "";
      for (let i = 0; i < result.length; i++) {
        text += JSON.stringify(result[i]) + "<br>";
      }
      document.getElementById("userInfos").innerHTML = text;
    }
    //This function allows to link an authenticated github user to parse server
    async function linkUserToParse(userData, myAuthData) {
      const user = new Parse.User();
      //The username is set via the data retrieved via the github api any other field can be added and set here for the parse server database
      user.set("username", userData.login);
      user.set("repoList", []);
      user.set("level", "newbie");
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess("admin",true);
      user.setACL(acl);
      //Once created and set the user is linked and save in the parse database
      await user.linkWith("github", { authData: myAuthData, useMasterKey: true });
    }
    //This function is called when the login button is clicked
    //It allows the user after being authenticated via github to link his account to parse
    function login() {
      const code = getCode();
      // This request on localhost:9999 is a request to gatekeeper which is a tool to bypass github oauth web flow CORS issues
      axios
        .get("https://github.com/login/oauth/access_token/?client_id=4d893c6356341f56356b&client_secret=6e980dab9f3bea086487caf32ad5c23e981b178c&code=" + code)
        .then((response) => {
          console.log("GET access token: ");
          console.log(response);
          //The object myAuthData must follow this model to link a github account to parse
          const myAuthData = {
            id: "82414381", //This is the client id which is the id of the oauth app created via the github dashboard
            access_token: response.data.token,
          };
          console.log("myAuthData: ");
          console.log(myAuthData);
          //This request to fetch user data via the api and using the access token uses octokit as it is recommended in the github doc
          const octokit = new Octokit({
            auth: myAuthData.access_token,
          });
          octokit
            .request("GET /user", {
              headers: {
                "X-GitHub-Api-Version": "2022-11-28",
              },
            })
            .then((resp) => {
              console.log("GET /user: ");
              console.log(resp.data);
              displayLoggingInfos(resp.data);
              linkUserToParse(resp.data, myAuthData).then((r) => {
                console.log(Parse.User.current().get("username"));
                logged.value = true;
              });
            });
        });
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
