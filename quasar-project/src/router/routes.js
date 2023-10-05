var routes = [
    {
      path: "/",
      component: () => import("layouts/MainLayout.vue"),
      children: [{ path: "", component: () => import("pages/Login.vue") }],
    },
    {
      path: "/githublogin",
      component: () => import("layouts/MainLayout.vue"),
      children: [
        { path: "", component: () => import("pages/GitHubLogin.vue") },
      ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: "/:catchAll(.*)*",
      component: () => import("pages/ErrorNotFound.vue"),
    },
  ];


export default routes;
