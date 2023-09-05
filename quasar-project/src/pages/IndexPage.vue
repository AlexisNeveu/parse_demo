<template>
  <q-page class="flex-center flex on-top">
    <q-list class="on-right">
      <label>Pseudo : </label><br />
      <input v-model="pseudo" placeholder="Pseudo" /><br />
      <label>Email :</label><br />
      <input v-model="email" placeholder="Email" /><br />
      <label>Password :</label><br />
      <input type="password" v-model="password" placeholder="Password" /><br />
      <button @click="register()">Register</button>
    </q-list>
    <q-list class="on-right">
      <label>Pseudo : </label><br />
      <input v-model="adminPseudo" placeholder="Pseudo" /><br />
      <label>Email :</label><br />
      <input v-model="adminEmail" placeholder="Email" /><br />
      <label>Password :</label><br />
      <input
        type="password"
        v-model="adminPassword"
        placeholder="Password"
      /><br />
      <button @click="registerAsAdmin()">Register as Admin</button>
    </q-list>
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
    <q-list class="on-right">
      <input v-model="checkLoginPseudo" placeholder="Pseudo" /><br />
      <button @click="checkLogin()">Check Login</button>
    </q-list>
    <button class="on-right" @click="logout()">LogOut</button>
    <button class="on-right" @click="logSecret()">Show Secret</button>
  </q-page>
</template>

<script>
const Parse = require("parse");


import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const pseudo = ref("");
    const email = ref("");
    const password = ref("");
    const adminPseudo = ref("");
    const adminEmail = ref("");
    const adminPassword = ref("");
    const loginPseudo = ref("");
    const loginPassword = ref("");
    const checkLoginPseudo = ref("");

    function register() {
      const user = new Parse.User();
      user.set("username", pseudo.value);
      user.set("password", password.value);
      user.set("email", email.value);
      console.log(user.get("username"));
      user.save(null, { });
      //Reset the input text fields
      pseudo.value = "";
      password.value = "";
      email.value = "";
    }
    function registerAsAdmin() {
      const user = new Parse.User();
      user.set("username", adminPseudo.value);
      user.set("password", adminPassword.value);
      user.set("email", adminEmail.value);

      console.log(user.get("username"));
      user.save(null, { cascadeSave: false }).then(function (response) {
        console.log(response);
        const role = new Parse.Role();
        const query = new Parse.Query(role);
        query.equalTo("name", "Administrator");
        const adminRole = query.first().then(function (resp) {
          alert("successfully registered as admin " + response.get("username"));
          console.log(resp);
          console.log(resp.getUsers());
          resp.getUsers().add(user);
          resp.save();
        });
      });
      adminEmail.value = "";
      adminPseudo.value = "";
      adminPassword.value = "";
    }
    //This function checks if the user with the username that has been written in the text input is currently logged
    function checkLogin() {
      const currentUser = Parse.User.current();
      if (currentUser != null) {
        console.log(currentUser.get("username"));
        if (currentUser.get("username") == checkLoginPseudo.value) {
          console.log("Currently Logged");
        } else {
          console.log("not logged");
        }
      } else {
        console.log("not logged");
      }
      checkLoginPseudo.value = "";
    }
    async function login() {
      const user = await Parse.User.logIn(
        loginPseudo.value,
        loginPassword.value
      );
      console.log(user.get("username"));
      loginPseudo.value = "";
      loginPassword.value = "";
    }
    function logout() {
      Parse.User.logOut();
    }
    async function retrieveRole(roleName) {
      var role = new Parse.Role();
      const query = new Parse.Query(role);
      query.equalTo("name", roleName);
      const retrievedRole = await query.first().then(function (result) {
        if (result) {
          console.log(JSON.stringify(result));
          console.log(result.getUsers());
        }
        role = result;
      });
      return role;
    }
    //This function allows to prove the ACL functionalities -> only admins can retrieve the secret
    async function logSecret() {
      const Secret = Parse.Object.extend("Secret");
      const query = new Parse.Query(Secret);
      query.equalTo("key", "supersecretkey");
      const results = query.first().then(function (response) {
        console.log(response);
        if (response) {
          alert("retrieved secret " + response.get("key"));
          console.log(response.getACL());
        } else {
          alert("Abilitation Requiered");
        }
      });
    }
    onMounted(() => {
      //Logout every time the page is reloaded to avoid session token issues -> To be fixed
      logout();
      //Create an admin role (could be done in the backend later)
      const adminRole = retrieveRole("Administrator").then(function (result) {
        if (!result) {
          const roleACL = new Parse.ACL();
          roleACL.setPublicReadAccess(true);
          roleACL.setPublicWriteAccess(true);
          const role = new Parse.Role("Administrator", roleACL);
          role.save();
        }
      });

      //Create an object with admin exclusive access to prove the ACL functionalities
      /*const Secret = Parse.Object.extend("Secret");
      const secret = new Secret();
      secret.set("key", "supersecretkey");
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(false);
      acl.setRoleReadAccess("Administrator", true);
      acl.setRoleWriteAccess("Administrator", true);
      secret.setACL(acl);
      secret.save();*/
    });

    return {
      pseudo,
      email,
      password,
      adminPseudo,
      adminEmail,
      adminPassword,
      loginPseudo,
      loginPassword,
      checkLoginPseudo,
      register,
      registerAsAdmin,
      checkLogin,
      login,
      logout,
      retrieveRole,
      logSecret,
    };
  },
});
</script>
