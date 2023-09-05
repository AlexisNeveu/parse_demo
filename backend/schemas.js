module.exports = {
    User: {
        className: "_User",
        fields: {
            firstname: { type: "String", required: false },
            lastname: { type: "String", required: false },
            level: { type: "String", required: false },
            repoList: {type: "Array", required: false}
        },
        classLevelPermissions: {
            find: { '*': true },
            count: { "role:admin": true },
            get: { '*': true },
            update: { requiresAuthentication: true },
            create: {"*":true} ,
            delete: { "role:admin": true },
            protectedFields: {
            // These fields will be protected from all other users. AuthData and password are already protected by default
            "*": ["authData", "emailVerified", "password"],
            "role:admin":["authData", "emailVerified", "password"],
            },
        },
    },
    Role: {
        className: "_Role",
        fields: {
            name: { type: "String", required: true },
            users: { type: "Relation", targetClass: "_User" },
            roles: { type: "Relation", targetClass: "_Role" },
        },
        classLevelPermissions: {
            find: { "*":true },
            count: { "role:admin": true },
            get: { '*': true },
            update: { requiresAuthentication: true },
            create: {"role:admin":true},
            delete: { "role:admin": true },
        }
    },
    
    Library: {
        className: "Library",
        fields: {
            lib_name: { type: "String", required: true },
            git_url: { type: "String", required: true },
            templates: { type: "Relation", targetClass: "Template" },
        },
        classLevelPermissions: {
            find: { requiresAuthentication: true },
            count: { requiresAuthentication: true },
            get: { requiresAuthentication: true },
            update: { requiresAuthentication: true },
            create: { requiresAuthentication: true },
            delete: { "role:admin": true },
        },
    },
    Template: {
      className: "Template",
      fields:{
        key: { type: "String", required: true },
        name: { type: "String", required: true },
        plugin: { type: "String", required: false },
        plugins: { type: "Array", required: false },
        type: { type: "String", required: true },
        description: { type: "String", required: false },
        url: { type: "String", required: false },
        schemas: { type: "Array", required: false },
        files: { type: "Array", required: false },
      },
      classLevelPermissions: {
        find: { requiresAuthentication: true },
        count: { requiresAuthentication: true },
        get: { requiresAuthentication: true },
        update: { "role:admin": true },
        create: { "role:admin": true },
        delete: { "role:admin": true },
    },
    },
    Group: {
        className: "Group",
        fields: {
            name: { type: "String", required: true },
            users: { type: "Relation", targetClass: "_User" },
            subgroups: { type: "Relation", targetClass: "Group" },
          },
          classLevelPermissions: {
            find: { "*":true },
            count: { "role:admin": true },
            get: { '*': true },
            update: { requiresAuthentication: true },
            create: {"role:admin":true},
            delete: { "role:admin": true },
        }
    }
};


