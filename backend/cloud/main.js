//Example of usage of cloud code for parse server

Parse.Cloud.beforeDelete("Repository", async (request) => {
  //When a repo is deleted, the user who owned it has to be updated but this can only be done by the user himself, even an admin cannot
    console.log(request.object);
    /*const query = new Parse.Query(Parse.User);
    query.equalTo("username", request.object.get("importedBy"));
    const item = request.object;
    query.first().then((result)=>{
        var repoList = result.get("repoList");
          console.log(repoList)
          console.log(item)
          repoList.forEach(element => {
            if(element.id == item.id){
              let index = repoList.indexOf(element);
              console.log(index)
              repoList.slice(index);
              console.log(repoList);
              result.unset("repoList");
              result.set("repoList",repoList);
              result.save((null, { useMasterKey:true}))
            }
          });
    })*/
    
  });
