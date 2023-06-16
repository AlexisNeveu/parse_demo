import conf from "./config.js";
var routes = [];

if (conf.authType == "internal") {
  routes = [
    {
      path: "/",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
    },
    {
      path: "/login",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/Login.vue") }],
    },
    {
      path: "/fblogin",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/FbLogin.vue") }],
    },
    {
      path: "/githublogin",
      component: () => import("layouts/MainLayout.vue"),
      children: [
        { path: "", component: () => import("pages/GitHubLogin.vue") },
      ],
    },
    {
      path: "/workshop",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/Workshop.vue") }],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: "/:catchAll(.*)*",
      component: () => import("pages/ErrorNotFound.vue"),
    },
  ];
} else if (conf.authType == "github") {
  routes = [
    {
      path: "/",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/Login.vue") }],
    },
    {
      path: "/login",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/Login.vue") }],
    },
    {
      path: "/fblogin",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/FbLogin.vue") }],
    },
    {
      path: "/githublogin",
      component: () => import("layouts/MainLayout.vue"),
      children: [
        { path: "", component: () => import("pages/GitHubLogin.vue") },
      ],
    },
    {
      path: "/workshop",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/Workshop.vue") }],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: "/:catchAll(.*)*",
      component: () => import("pages/ErrorNotFound.vue"),
    },
  ];
}

export default routes;
