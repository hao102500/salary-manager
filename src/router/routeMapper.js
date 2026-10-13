import { getPageComponent } from "./index";

/**
 * 将后端菜单数据映射为前端动态路由
 *
 * 后端返回示例：
 * {
 *   path: "/organization",
 *   name: "Organization",
 *   title: "组织管理",
 *   component: "Organization/Organization",
 *   permission: "organization:view"
 * }
 *
 * @param {Array} menus 后端返回的菜单
 * @param {Array} permissions 当前用户权限编码
 */
export function mapDynamicRoutes(menus = [], permissions = null) {
  const permissionSet = Array.isArray(permissions)
    ? new Set(permissions)
    : null;

  return menus
    .filter((menu) => {
      // 尚未接入权限系统时，不过滤权限
      if (!permissionSet) return true;

      // 配置了权限标识时，必须拥有对应权限
      if (menu.permission) {
        return permissionSet.has(menu.permission);
      }

      return true;
    })
    .map((menu) => {
      const Page = getPageComponent(menu.component);

      if (!Page) {
        console.warn(`[路由映射] 未找到页面组件：${menu.component}`);
        return null;
      }

      return {
        path: menu.path,
        name: menu.name,
        title: menu.title,
        permission: menu.permission,
        element: Page,
      };
    })
    .filter(Boolean);
}
