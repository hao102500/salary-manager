import { lazy } from "react";

export const staticRoutes = [
  {
    path: "/login",
    name: "Login",
    title: "登录",
    component: lazy(() => import("@/pages/Login/Login")),
    meta: {
      public: true,
      hidden: true,
    },
  },
  {
    path: "/403",
    name: "Forbidden",
    title: "无权限",
    component: lazy(() => import("@/pages/Forbidden/Forbidden")),
    meta: {
      public: true,
      hidden: true,
    },
  },
  {
    path: "/404",
    name: "NotFound",
    title: "页面不存在",
    component: lazy(() => import("@/pages/NotFound/NotFound")),
    meta: {
      public: true,
      hidden: true,
    },
  },
];