<template>
  <q-page>
    <q-btn class="on-right" to="/login">Back</q-btn>
    <q-btn class="on-right" to="/allProjects">All projects</q-btn>
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
              <!-- The projects are displayed with their name and GitHub owner -->
              <q-item-label>{{ item.get("name") + " from "+ item.get("owner")}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <!-- When clicking this btn a request on the github api will be processed to retrieve the repo by owner name and name-->
    <!-- For now only public repos are available to import -->
    <div class="on-top flex flex-center">
      <q-btn v-if="isGHUser" class="on-top" @click="retrieveRepo()"
        >Import a Project from GitHub</q-btn
      >
      <input v-if="isGHUser"
        class="on-top"
        v-model="repoOwner"
        type="text"
        placeholder="Owner name"
      />
      <input v-if="isGHUser"
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

const { Octokit } = require("octokit");
import { defineComponent, onMounted, ref } from "vue";


export default defineComponent({
  name: "WorkshopPage",
  setup() {
    const username = ref("");
    const repoOwner = ref("");
    const repoName = ref("");
    const repoList = ref([]);
    const isGHUser = ref(false);

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
          const repo = new Parse.Object("Repository");
          //Give the correct r/w access
          const acl = new Parse.ACL();
          acl.setPublicReadAccess(true);
          const role = new Parse.Role
          const query = new Parse.Query(role)
          query.equalTo("name","admin")
          query.find().then((res)=>{
            console.log(res)
            acl.setWriteAccess(res[0],true)
            acl.setWriteAccess(currentUser,true)
          repo.setACL(acl);
          //Fill the object with the cloneURL
          repo.set("cloneURL", response.data.clone_url);
          repo.set("name",response.data.name);
          repo.set("owner",response.data.owner.login);
          repo.set("importedBy",currentUser.get("username"))
          //Push the retrieved repo to the repoList object of the current user
          currentUser.get("repoList").push(repo);
          console.log(currentUser.get("repoList"));
          //Save the changes
          currentUser.save();
          console.log(repo);
          })
        });
    }

    onMounted(() => {
      //Display the page in function of the current user
      const currentUser = Parse.User.current();
      if (currentUser != null) {
        username.value = currentUser.get("username");
        if (currentUser.get("authData")){
          //Enable GitHub API actions only if the user is logged via his github account
          isGHUser.value = true;
        }
      }
      //Get the last repo udates (for example if an admin has deleted a repo)
      currentUser.set("repoList",[]);
      const Repository = Parse.Object.extend("Repository");
      const query = new Parse.Query(Repository);
      const results = query.find().then((res)=>{
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          const object = res[i];
          console.log(object);
          if (object.get("importedBy") == currentUser.get("username")){
            currentUser.get("repoList").push(object)
          }
        }
      });
      //Update the repo list to be shown in the dropdown btn
      repoList.value = currentUser.get("repoList");
      console.log("repoList :")
      console.log(repoList.value)

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
      isGHUser
    };
  },
});
</script>
