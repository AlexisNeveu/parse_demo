<template>
  <q-page>
    <q-btn class="on-right" to="/login">Back</q-btn>
    <div class="flex flex-center">
      <h3>Welcome in your workshop {{ username }}</h3>
    </div>
    <div class="flex flex-center">
      <!-- This button is not available to "newbie" users -->
      <q-btn id="tooltip-button" class="on-right" data-tooltip="Hello"
        >Create a project from scratch
        <q-tooltip
          class="bg-indigo"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          Usable only by advanced users
        </q-tooltip>
      </q-btn>
      <q-btn-dropdown class="on-right" label="Create a project from a template">
        <!-- Reel template files to be inserted here -->
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Template 1</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Template 2</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Template 3</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!-- This button allows the user to chose one of his project stored in the backend -->
      <q-btn-dropdown class="on-right" label="Open a recent project">
        <q-list>
          <q-item v-for="item in repoList" clickable v-close-popup :key="item">
            <q-item-section>
              <!-- The projects are displayed by their gitHub cloneURL -->
              <q-item-label>{{ item.get("cloneURL") }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <!-- When clicking this btn a request on the github api will be processed to retrieve the repo by owner name and name-->
    <!-- For now only public repos are available to import -->
    <div class="on-top flex flex-center">
      <q-btn class="on-top" @click="retrieveRepo()"
        >Import a Project from GitHub</q-btn
      >
      <input
        class="on-top"
        v-model="repoOwner"
        type="text"
        placeholder="Owner name"
      />
      <input
        class="on-top"
        v-model="repoName"
        type="text"
        placeholder="Repository Name"
      />
    </div>
  </q-page>
</template>

<script>
const Parse = require("parse");

Parse.initialize("myAppId", "JAVASCRIPT_KEY", "mySecretMasterKey");
Parse.serverURL = "http://127.0.0.1:1337/parse";
import axios from "axios";
const { Octokit } = require("octokit");
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "WorkshopPage",
  setup() {
    const username = ref("");
    const repoOwner = ref("");
    const repoName = ref("");
    const repoList = ref([]);

    async function retrieveRepo() {
      //Retrieve the current user's access token to request on the api
      const currentUser = Parse.User.current();
      const userAccessToken = currentUser.get("authData").github.access_token;

      // Octokit.js
      // https://github.com/octokit/core.js#readme
      const octokit = new Octokit({
        auth: userAccessToken,
      });
      //Request the repo on the api by owner and name
      await octokit
        .request("GET /repos/" + repoOwner.value + "/" + repoName.value, {
          owner: repoOwner.value,
          repo: repoName.value,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            accept: "application/vnd.github+json",
          },
        })
        .then((response) => {
          console.log(response);
          //Create a Repository object on Parse
          const Repository = Parse.Object.extend("Repository");
          const repo = new Repository();
          //Give the r/w access only to the current user
          repo.setACL(new Parse.ACL(currentUser));
          //Fill the object with the cloneURL
          repo.set("cloneURL", response.data.clone_url);
          //Push the retrieved repo to the repoList object of the current user
          currentUser.get("repoList").push(repo);
          console.log(currentUser.get("repoList"));
          //Save the changes
          currentUser.save();
          console.log(repo);
        });
    }

    onMounted(() => {
      //Display the page in function of the current user
      const currentUser = Parse.User.current();
      if (currentUser != null) {
        username.value = currentUser.get("username");
      }
      //Update the repo list to be shown in the dropdown btn
      repoList.value = currentUser.get("repoList");

      //Make the "create from scratch" option unavailable to "newbie" users
      if (currentUser.get("level") == "newbie") {
        var createFromScratchBtn = document.getElementById("tooltip-button");
        createFromScratchBtn.style.color = "grey";
        createFromScratchBtn.style.background = "#c0c0c0";
      }
    });
    return {
      username,
      retrieveRepo,
      repoOwner,
      repoName,
      repoList,
    };
  },
});
</script>
