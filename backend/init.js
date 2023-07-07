const Parse = require("parse/node");


exports.upgrade = async () => {
  initParse();
  const adminUser = await initAdminUser();
  const adminRole = await initAdminRole();
  await giveRoleToUser(adminRole, adminUser);
  await createClasses();
  console.log("Initialization done !")

};

function initParse() {
  Parse.initialize("myAppId", "JAVASCRIPT_KEY", "mySecretMasterKey");
  Parse.serverURL = "http://127.0.0.1:1337/parse";
}

async function giveRoleToUser(role, user) {  
  role.getUsers({useMasterKey: true}).add(user);
  try {
   return await role.save(null, {useMasterKey: true});
  } catch (error) {
    console.error("Error : can not save the updated Role :" + error.code + " " + error.message)
  }
}

const initAdminUser = async () => {
  let admin = null;

  // get admin user if it already exists
  const query = new Parse.Query(Parse.User);
  query.equalTo("email", "admin.leto@ditrit.com");
  try {
    admin = await query.first({useMasterKey: true});
  } catch (error) {
    console.error("Cannot query users during initialization : "  + error.code + " " + error.message);
  }

  // define and signup admin user if not already exists
  if (!admin) {
    admin = new Parse.User();
    admin.set("email", "admin.leto@ditrit.com");
    admin.set("username", "leto.admin");
    admin.set("level","master")
    admin.set("password", "admin");

    try {
      admin = await admin.signUp();
      console.log("admin user created");
      return admin;
    } catch (error) {
      // Show the error message somewhere and let the user try again.
      console.error("Error during admin user initialization : " + error.code + " " + error.message);
      return null;
    }

  } else {
    console.log("admin user already exists")
    return admin;
  }

}

const initAdminRole = async () => {
  const Role = Parse.Object.extend("_Role");

  // Check if the admin role already exists
  let adminRole = null;
  try {
    adminRole = await new Parse.Query(Role)
      .equalTo("name", "admin")
      .first();
  console.log("already exists : " + JSON.stringify(adminRole)); 
  } catch (error) {
    console.error("Cannot query roles during backend initalization : "  + error.code + " " + error.message)
  }; 

  // If the admin role already exists we have nothing to do here
  if (adminRole) {
    console.log('Role "admin" already exists');
    return adminRole;
  } else {
    // If the admin role does not exist create it and set the ACLs
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    adminRole = new Role();
    adminRole.set("name", "admin");
    adminRole.setACL(acl);
    try {
    adminRole = await adminRole.save({}, { useMasterKey: true });
    console.log("admin role creation done")
    return adminRole;
    
    } catch (error) {
      console.error("Error during admin role initialization : " + error.code + " " + error.message);
    }
  }
};

function schemaExists(schemas, className) {
  return schemas.find(ele => ele.className == className)
};

async function createClassIfNotExists(schemas, classDef, clp) {
  let schema = schemaExists(schemas, classDef.name);
  if (!schema) {
    schema = new Parse.Schema(classDef.name);
    schema.setCLP(clp)
    console.log("setCLP done")
    classDef.attrDefs.map(attrDef => {
      console.log("fn = " + "schema.add" + attrDef.type + "(" + attrDef.name + ")");
      (schema["add" + attrDef.type])(attrDef.name)
    });
    try {
      await schema.save();
      console.log("schema created for class " + classDef.name);
      return schema;
    } catch (error) {
      console.error("Error : can not save schema for class " + classDef.name + " : " + error.code + " " + error.message);
    }
  }
};

const createClasses = async () => {

  const schemas = await Parse.Schema.all();
  const defautCLP = {
    get: { "*": true, "role:admin": true },
    find: { "*": true, "role:admin": true },
    count: { "*": true, "role:admin": true },
    create: { "*": true, "role:admin": true },
    update: { "role:admin": true },
    delete: { "role:admin": true },
    addField: {},
  };
  
  await createClassIfNotExists(schemas, {
    name: "Repository",
    attrDefs: [ 
      {name: "name", type: "String"},
      {name: "owner", type: "String"},
      {name: "cloneURL", type: "String"},
      {name: "importedBy",type: "String"},
      
    ]
  }, defautCLP);
  
  
  
  
  
};