<template>
  <q-page >
    <div>
      <q-btn class="on-right" to="/workshop">Back</q-btn>
    </div>
    <div class="flex flex-center">
      <q-list>
        <q-item v-for="item in repoList" clickable v-close-popup :key="item">
            <q-item-section class="on-right">
              <!-- The projects are displayed with their name and GitHub owner -->
              <q-btn @click="deleteDialog(item)">{{ item.get("name") + " from "+ item.get("owner")}}</q-btn>

            </q-item-section>
          </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
const Parse = require("parse");

Parse.initialize("myAppId", "JAVASCRIPT_KEY", "mySecretMasterKey");
Parse.serverURL = "http://127.0.0.1:1337/parse";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "AllProjectsPage",
  setup() {

    const repoList = ref([]);

    function deleteDialog(item){
      if(confirm("Delete "+ item.get("name")+" ?")){
        console.log(item.id)
        const Repository = Parse.Object.extend("Repository")
        const query = new Parse.Query(Repository);
        query.equalTo("objectId",item.id);
        query.find().then((result)=>{
          console.log(result)
          result[0].destroy()
        })

      }
    };

    onMounted(() => {
      const currentUser = Parse.User.current();
      if (currentUser != null) {
        //username.value = currentUser.get("username");
        console.log(currentUser)
      }
      //const repo = new Parse.Object("Repository");
      const Repository = Parse.Object.extend("Repository")
      const query = new Parse.Query(Repository);
      const results = query.find().then((res)=>{
        console.log(res)
        for (let i = 0; i < res.length; i++) {
        const object = res[i];
        console.log(object);
        repoList.value.push(object)
        console.log(repoList.value)
}
      });



    });
    return {
      repoList,
      deleteDialog
    }
  }

});
</script>
