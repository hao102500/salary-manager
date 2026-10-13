
import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "@/layouts/AdminLayout";
import PlaceholderPage from "@/pages/PlaceholderPage";
import { staticRoutes } from "@/router/staticRoutes";
import { flatMenus, getPageComponent } from "@/router";

function PageLoading() {
  return <div style={{ padding: 24 }}>页面加载中...</div>;
}

export default function App() {
  return (
    <Routes>
      {/* 静态路由：登录、403、404 等，不依赖业务菜单 */}
      {staticRoutes.map(({ path, component: Page }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<PageLoading />}>
              <Page />
            </Suspense>
          }
        />
      ))}

      {/* 后台业务布局 */}
      <Route path="/" element={<AdminLayout />}>
        {/* 访问根路径时进入工作台 */}
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        {/* 根据菜单配置自动注册业务路由 */}
        {flatMenus.map((menu) => {
          const Page = getPageComponent(menu.component);

          return (
            <Route
              key={menu.key}
              path={menu.key.slice(1)}
              element={
                Page ? (
                  <Suspense fallback={<PageLoading />}>
                    <Page />
                  </Suspense>
                ) : (
                  <PlaceholderPage title={menu.label} />
                )
              }
            />
          );
        })}
      </Route>

      {/* 未匹配路由 */}
      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />
    </Routes>
  );
}
