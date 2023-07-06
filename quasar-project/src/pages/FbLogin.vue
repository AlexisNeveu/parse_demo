<template>
  <q-page class="flex flex-center">
    <div id="status"></div>
    <div>
      <q-btn to="/login">Back</q-btn>
      <q-btn @click="logOut()">LogOut</q-btn>
      <q-btn @click="logIn()">LogIn</q-btn>
      <q-btn @click="logCurrentUser()">Current User</q-btn>
    </div>
  </q-page>
</template>

<script>
const Parse = require("parse");
const axios = require("axios");

import { defineComponent } from "vue";

async function statusChangeCallback(response) {
  console.log("statusChangeCallback");

  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === "connected") {
    console.log(response);
    let dt = new Date();
    dt.setSeconds(dt.getSeconds() + response.authResponse.expiresIn);
    const expirationDate = dt.toISOString();
    const myAuthData = {
      id: response.authResponse.userID,
      access_token: response.authResponse.accessToken,
      expiration_date: expirationDate,
    };
    console.log(myAuthData);
    axios
      .get(
        "https://graph.facebook.com/me?access_token=" +
          response.authResponse.accessToken +
          "&fields=id,name,email"
      )
      .then((res) => {
        console.log(res);
        const user = new Parse.User();
        user.set("username", res.data.name);
        user.linkWith("facebook", {
          authData: myAuthData,
        });
      });

    // Logged into your app and Facebook.
    console.log("Welcome!  Fetching your information.... ");
    FB.api("/me", function (response) {
      console.log("Successful login for: " + response.name);

      document.getElementById("status").innerHTML =
        "Thanks for logging in, " + response.name + "! " + "ID: " + response.id;
    });
  } else {
    // The person is not logged into your app or we are unable to tell.
    document.getElementById("status").innerHTML =
      "Please log " + "into this app.";
  }
}

window.fbAsyncInit = function () {
  Parse.FacebookUtils.init({
    appId: "269065128918177", // Facebook App ID
    //status: true, // check Facebook Login status
    cookie: true, // enable cookies to allow Parse to access the session
    xfbml: true, // initialize Facebook social plugins on the page
    version: "v2.3", // point to the latest Facebook Graph API version
  });
  // Run code after the Facebook SDK is loaded.
  // ...
  console.log("Facebook SDK Loaded");
  FB.AppEvents.logPageView();
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
};

// Load Facebook SDK
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

export default defineComponent({
  name: "FbLogin",

  data() {
    return {};
  },
  methods: {
    logOut() {
      FB.logout();
      Parse.User.logOut().then(() => {
        const currentUser = Parse.User.current(); // this will now be null
      });

      console.log("Successfully Logged Out");
    },
    logIn() {
      FB.login(function (response) {
        if (response.authResponse) {
          console.log(response);
          let dt = new Date();
          dt.setSeconds(dt.getSeconds() + response.authResponse.expiresIn);
          const expirationDate = dt.toISOString();
          const myAuthData = {
            id: response.authResponse.userID,
            access_token: response.authResponse.accessToken,
            expiration_date: expirationDate,
          };
          console.log(myAuthData);
          const user = new Parse.User();
          user.linkWith("facebook", { authData: myAuthData });
          console.log("Welcome!  Fetching your information.... ");
          FB.api("/me", function (response) {
            console.log("Good to see you, " + response.name + ".");
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      });
    },
    logCurrentUser() {
      const currentUser = Parse.User.current();
      if (currentUser) {
        console.log(currentUser);
      } else {
        console.log("No current User");
      }
    },
  },
  mounted() {},
});
</script>
