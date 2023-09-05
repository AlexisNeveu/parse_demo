<template>
  <q-page>
    <q-btn class="on-right" to="/login">Back</q-btn>
    <q-btn class="on-right" to="/allProjects">All projects</q-btn>
    <div class="flex flex-center">
      <h3>Welcome in your workshop {{ username }}</h3>
    </div>
    <!--
    <div class="flex flex-center"> -->
      <!-- This button is not available to "newbie" users
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
      <q-btn-dropdown class="on-right" label="Create a project from a template"> -->
        <!-- Reel template files to be inserted here
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Template 1</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div> -->
    <div class="on-top flex flex-center">
      <q-btn class="on-top" @click="declareLibrary()">Declare library</q-btn>
      <input
        class="on-top"
        v-model="libName"
        type="text"
        placeholder="Library Name"
      />
      <input
        class="on-top"
        v-model="libUrl"
        type="text"
        placeholder="Library URL"
      />
    </div>
    <div class="on-top flex flex-center">
      <q-btn @click="addRoleToUser()">Add Role To User</q-btn>
      <input
        class="on-top"
        v-model="userName"
        type="text"
        placeholder="Username"
      />
      <input
        class="on-top"
        v-model="role"
        type="text"
        placeholder="Role"
      />
    </div>
    <div class="on-top flex flex-center">
      <q-btn @click="createGroup()">Create group</q-btn>
      <input
        class="on-top"
        v-model="newGroupName"
        type="text"
        placeholder="Groupname"
      />
    </div>
      <div class="on-top flex flex-center">
      <q-btn @click="deleteGroup()">Delete group</q-btn>
      <input
        class="on-top"
        v-model="deletegroup_groupname"
        type="text"
        placeholder="Groupname"
      />
    </div>
    <div class="on-top flex flex-center">
      <q-btn @click="addUserToGroup()">Add User to Group</q-btn>
      <input
        class="on-top"
        v-model="addusertogroup_newusername"
        type="text"
        placeholder="Username"
      />
      <input
        class="on-top"
        v-model="addusertogroup_groupname"
        type="text"
        placeholder="Group"
      />
    </div>
    <div class="on-top flex flex-center">
      <q-btn @click="addGroupToGroup()">Add Group to Group</q-btn>
      <input
        class="on-top"
        v-model="addgrouptogroup_groupname"
        type="text"
        placeholder="Group"
      />
      <input
        class="on-top"
        v-model="addgrouptogroup_groupnametoadd"
        type="text"
        placeholder="Group to add"
      />
    </div>
  </q-page>
</template>

<script>
const Parse = require("parse");

import { defineComponent, onMounted, ref } from "vue";


export default defineComponent({
  name: "WorkshopPage",
  setup() {
    const username = ref("");
    const libName = ref("");
    const libUrl = ref("");
    const repoList = ref([]);
    const isGHUser = ref(false);
    const role = ref ("");
    const userName = ref ("");
    const newGroupName = ref("");
    const addusertogroup_groupname = ref("");
    const addusertogroup_newusername = ref("");
    const deletegroup_groupname = ref("");
    const addgrouptogroup_groupname = ref("");
    const addgrouptogroup_groupnametoadd = ref("");

    async function declareLibrary() {
      if (libName.value&&libUrl.value){
        const lib = await Parse.Cloud.run("createLib", {lib_name: libName.value, git_url: libUrl.value});
      }
      else {
        alert("Please provide name and url of your library")
      }
      }

      async function addRoleToUser(){
        if (role.value&&userName.value){
            await Parse.Cloud.run("addUserLibAccess", { username:userName.value, roleName:role.value });
        }
        else {
        alert("Please provide username and role to affect the permission")
      }
      }

      async function createGroup(){
        if (newGroupName.value){
            await Parse.Cloud.run("createGroup", { groupName:newGroupName.value });
        }
        else {
        alert("Please provide valid group name to create your group")
      }
      }

      async function addUserToGroup(){
        if (addusertogroup_groupname.value&&addusertogroup_newusername.value){
            await Parse.Cloud.run("addUserToGroup", { username: addusertogroup_newusername.value, groupname: addusertogroup_groupname.value });
            addusertogroup_groupname.value = "";
            addusertogroup_newusername.value = "";
        }
        else {
        alert("Please provide valid username and group to perform this")
      }
      }

      async function deleteGroup(){
        if (deletegroup_groupname.value){
            await Parse.Cloud.run("deleteGroup", { groupname: deletegroup_groupname.value });
        }
        else {
        alert("Please provide username and role to affect the permission")
      }
      }

      async function addGroupToGroup(){
        if (addgrouptogroup_groupname.value&&addgrouptogroup_groupnametoadd.value){
            await Parse.Cloud.run("addUserToGroup", { groupname: addgrouptogroup_groupname.value, groupnameToAdd: addgrouptogroup_groupnametoadd.value });
            addgrouptogroup_groupname.value = "";
            addgrouptogroup_groupnametoadd.value = "";
        }
        else {
        alert("Please provide valid username and group to perform this")
      }
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

    });
    return {
      username,
      declareLibrary,
      addRoleToUser,
      createGroup,
      libName,
      libUrl,
      repoList,
      isGHUser,
      role,
      userName,
      newGroupName,
      addUserToGroup,
      addusertogroup_groupname,
      addusertogroup_newusername,
      deleteGroup,
      deletegroup_groupname,
      addGroupToGroup,
      addgrouptogroup_groupname,
      addgrouptogroup_groupnametoadd
    };
  },
});
</script>
