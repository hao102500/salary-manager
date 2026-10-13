/**
 * 根据用户权限过滤动态菜单
 *
 * permissions 示例：
 * ["dashboard:view", "organization:view"]
 */
export function filterMenusByPermission(menus = [], permissions = []) {
  const permissionSet = new Set(permissions);

  return menus.filter((menu) => {
    // 没有声明权限编码的菜单默认放行
    if (!menu.permission) return true;

    return permissionSet.has(menu.permission);
  });
}
