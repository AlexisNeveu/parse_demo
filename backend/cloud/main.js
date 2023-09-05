const axios = require("axios");

async function isUserPermissionGranted(user,rolename){
  const role = new Parse.Role;
  const roleQuery = new Parse.Query(role);
  roleQuery.equalTo("name",rolename);
  const foundRole = await roleQuery.find();
  const usersQuery = foundRole[0].relation("users").query();
  var usersResult = await usersQuery.find();
  console.log(usersResult);
  var isAccessValid = false;
  usersResult.forEach((element)=>{
    console.log(element.id);
    console.log(user.id)
    if(element.id==user.id){
      isAccessValid = true;
    }
  })

  return isAccessValid;
  }

  Parse.Cloud.define("createLib", async(request)=>{

    const rawIndex = await axios.get(request.params.git_url);

    const role = new Parse.Role;
    const roleQuery = new Parse.Query(role);
    roleQuery.equalTo("name","admin");
    const foundRole = await roleQuery.find({sessionToken: request.user.getSessionToken()});
    
    //Create an ACL for the new library user role
    const roleAcl = new Parse.ACL();
    roleAcl.setWriteAccess(foundRole[0],true); //Only admins have write access on the roles
    roleAcl.setPublicReadAccess(true);
    
    //Create the role "user" for this new library
    const libUserRole = new Parse.Role(request.params.lib_name + "_user", roleAcl);
    //Create the role "maintainer" for this new library
    const libMaintainerRole = new Parse.Role(request.params.lib_name + "_maintainer", roleAcl);
    await libUserRole.save(null, {sessionToken: request.user.getSessionToken()});
    await libMaintainerRole.save(null, {sessionToken: request.user.getSessionToken()});
    //Create the ACL for the library
    const libACL = new Parse.ACL();
    //Set read acces for the users of the library
    libACL.setReadAccess(libUserRole,true);
    libACL.setReadAccess(libMaintainerRole,true);
    //Set write access only for the maintainers of the library
    libACL.setWriteAccess(libMaintainerRole,true)
    
    //Create an object Library
    const Library = Parse.Object.extend("Library");
    const library = new Library();
    library.setACL(libACL);
    library.set("lib_name", request.params.lib_name)
    library.set("git_url", request.params.git_url);
    await library.save(null, {sessionToken: request.user.getSessionToken()});

    //Create the related templates
    rawIndex.data.templates.forEach((element)=>{
      const Template = Parse.Object.extend("Template");
      const template = new Template();
      template.set("key", element.key);
      template.set("name", element.name);
      template.set("plugin",element.plugin);
      template.set("type", element.type);
      template.set("description", element.description);
      template.set("url", element.url);
      template.set("files", element.files);
      template.set("schemas", element.schemas);
      template.set("plugins", element.plugins);

      template.save(null, {sessionToken: request.user.getSessionToken()}).then((result)=>{
        library.relation("templates").add(template);
        console.log(library.relation("templates"))
        
      });
      //await library.relation("templates").add(template);
      
    })
    //await library.save(null, {sessionToken: request.user.getSessionToken()});
    return true;
  });

  Parse.Cloud.define("addUserLibAccess", async(request)=>{
    const user = new Parse.User();
    const userQuery = new Parse.Query(user);
    userQuery.equalTo("username", request.params.username);
    const foundUser = await userQuery.find({sessionToken: request.user.getSessionToken()});
    console.log(foundUser)
    
    const role = new Parse.Role;
    const roleQuery = new Parse.Query(role);
    roleQuery.equalTo("name",request.params.roleName);
    const foundRole = await roleQuery.find({sessionToken: request.user.getSessionToken()});
    console.log(foundRole[0].relation("users"))
    foundRole[0].relation("users").add(foundUser[0]);
    await foundRole[0].save(null, {sessionToken: request.user.getSessionToken()});
    return foundRole[0];
  });

  Parse.Cloud.define("createGroup", async (request)=>{
    const isAccessValid = await isUserPermissionGranted(request.user,"admin")
    console.log(isAccessValid);
    if (isAccessValid){
      console.log("admin access granted");
      const role = new Parse.Role;
      const roleQuery = new Parse.Query(role);
      roleQuery.equalTo("name","admin");
      const foundRole = await roleQuery.find({sessionToken: request.user.getSessionToken()});
      console.log(foundRole[0].id)
    
      //Create an ACL for the new library user role
      const roleAcl = new Parse.ACL();
      roleAcl.setWriteAccess(foundRole[0],true); //Only admins have write access on the roles
      roleAcl.setPublicReadAccess(true);
    
      //Create the role "user" for this new library
      const groupUserRole = new Parse.Role(request.params.groupName + "_user", roleAcl);
      await groupUserRole.save(null, {sessionToken: request.user.getSessionToken()});
      //Create the ACL for the library
      const groupACL = new Parse.ACL();
      //Set read acces for the users of the library
      groupACL.setReadAccess(groupUserRole,true);
      groupACL.setReadAccess(foundRole[0],true);
      //Set write access only for the maintainers of the library
      groupACL.setWriteAccess(foundRole[0],true)
    
      //Create an object Library
      const Group = Parse.Object.extend("Group");
      const group = new Group();
      group.setACL(groupACL);
      group.set("name", request.params.groupName)
      await group.save(null, {sessionToken: request.user.getSessionToken()});
      return group;
    }else {
      console.log("need to be admin to perform this");
      return false;
    }
  });

  Parse.Cloud.define("addUserToGroup", async(request)=>{
    const isAccessValid = await isUserPermissionGranted(request.user,"admin")
    console.log(isAccessValid);
    if (isAccessValid){
      // Query the user to add in the group
      const user = new Parse.User();
      const userQuery = new Parse.Query(user);
      userQuery.equalTo("username", request.params.username);
      const foundUser = await userQuery.find({sessionToken: request.user.getSessionToken()});
      
      // Query the role related to the group
      const role = new Parse.Role;
      const roleQuery = new Parse.Query(role);
      roleQuery.equalTo("name",request.params.groupname+"_user");
      const foundRole = await roleQuery.find({sessionToken: request.user.getSessionToken()});
      console.log(foundRole[0].relation("users"))
      foundRole[0].relation("users").add(foundUser[0]);
      await foundRole[0].save(null, {sessionToken: request.user.getSessionToken()});
      
      // Query the group and add the user in it
      const Group = Parse.Object.extend("Group");
      const group = new Group();
      const groupQuery = new Parse.Query(group);
      groupQuery.equalTo("name",request.params.groupname);
      const foundGroup = await groupQuery.find({sessionToken: request.user.getSessionToken()});
      console.log(foundGroup[0].relation("users"))
      foundGroup[0].relation("users").add(foundUser[0]);
      await foundGroup[0].save(null, {sessionToken: request.user.getSessionToken()});
      return foundGroup[0];
    }
    else{
      console.log("Need to be admin to perform this")
      return false;
    }
    
  });

  Parse.Cloud.define("deleteGroup", async (request)=>{
    const isAccessValid = await isUserPermissionGranted(request.user,"admin")
    console.log(isAccessValid);
    if (isAccessValid){
      const role = new Parse.Role;
      const roleQuery = new Parse.Query(role);
      roleQuery.equalTo("name",request.params.groupname + "_user");
      const foundRole = await roleQuery.find({sessionToken: request.user.getSessionToken()});
      await foundRole[0].destroy({sessionToken: request.user.getSessionToken()});

      const Group = Parse.Object.extend("Group");
      const group = new Group();
      const groupQuery = new Parse.Query(group);
      groupQuery.equalTo("name",request.params.groupname);
      const foundGroup = await groupQuery.find({sessionToken: request.user.getSessionToken()});
      return foundGroup[0].destroy({sessionToken: request.user.getSessionToken()});
    }
    else{
      return false
    }
  });

  Parse.Cloud.define("addGroupToGroup", async(request)=>{
    const isAccessValid = await isUserPermissionGranted(request.user,"admin")
    console.log(isAccessValid);
    if (isAccessValid){
      // Query the group to add in the group
      const Group = Parse.Object.extend("Group");
      const groupToAdd = new Group();
      const groupToAddQuery = new Parse.Query(groupToAdd);
      groupToAddQuery.equalTo("name", request.params.groupnameToAdd);
      const foundGroupToAdd = await groupToAddQuery.find({sessionToken: request.user.getSessionToken()});
      
      // Query the role related to the group
      const role = new Parse.Role;
      const roleQuery = new Parse.Query(role);
      roleQuery.equalTo("name",request.params.groupname+"_user");
      const foundRole = await roleQuery.find({sessionToken: request.user.getSessionToken()});
      console.log(foundRole[0].relation("roles"))
      foundRole[0].relation("roles").add(foundGroupToAdd[0]);
      await foundRole[0].save(null, {sessionToken: request.user.getSessionToken()});
      
      // Query the group and add the user in it
      const group = new Group();
      const groupQuery = new Parse.Query(group);
      groupQuery.equalTo("name",request.params.groupname);
      const foundGroup = await groupQuery.find({sessionToken: request.user.getSessionToken()});
      console.log(foundGroup[0].relation("subgroups"))
      foundGroup[0].relation("subgroups").add(foundGroupToAdd[0]);
      await foundGroup[0].save(null, {sessionToken: request.user.getSessionToken()});
      return foundGroup[0];
    }
    else{
      return false;
    }
    
  });