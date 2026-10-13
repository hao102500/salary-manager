
import { lazy } from "react";
import {
  DashboardOutlined,
  ApartmentOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  PayCircleOutlined,
  FileTextOutlined,
  WalletOutlined,
  BankOutlined,
  SettingOutlined,
  HistoryOutlined,
  ApiOutlined,
} from "@ant-design/icons";

/**
 * 左侧菜单配置
 *
 * key：页面访问路径
 * label：菜单名称
 * icon：菜单图标
 * component：对应本地页面组件标识
 * permission：权限标识（预留）
 * children：子菜单
 */
export const menuGroups = [
  {
    key: "hr",
    label: "人力资源",
    items: [
      {
        key: "/dashboard",
        label: "工作台",
        icon: <DashboardOutlined />,
        component: "Dashboard/Dashboard",
        permission: "dashboard:view",
      },
      {
        key: "/organization",
        label: "组织管理",
        icon: <ApartmentOutlined />,
        component: "Organization/Organization",
        permission: "organization:view",
      },
      {
        key: "/employees",
        label: "员工管理",
        icon: <TeamOutlined />,
        children: [
          {
            key: "/employees/list",
            label: "员工列表",
            component: "Employees/Employees",
            permission: "employees:view",
          },
          {
            key: "/employees/positions",
            label: "岗位管理",
            component: "Positions/Positions",
            permission: "positions:view",
          },
        ],
      },
      {
        key: "/accounts",
        label: "账户管理",
        icon: <UserSwitchOutlined />,
        component: "Accounts/Accounts",
        permission: "accounts:view",
      },
      {
        key: "/attendance",
        label: "考勤管理",
        icon: <CalendarOutlined />,
        component: "Attendance/Attendance",
        permission: "attendance:view",
      },
      {
        key: "/social-security",
        label: "社保管理",
        icon: <SafetyCertificateOutlined />,
        component: "SocialSecurity/SocialSecurity",
        permission: "social-security:view",
      },
      {
        key: "/payroll",
        label: "薪资管理",
        icon: <PayCircleOutlined />,
        component: "Payroll/Payroll",
        permission: "payroll:view",
      },
      {
        key: "/tax",
        label: "个税管理",
        icon: <FileTextOutlined />,
        component: "Tax/Tax",
        permission: "tax:view",
      },
      {
        key: "/reimbursement",
        label: "财务报销",
        icon: <WalletOutlined />,
        component: "Reimbursement/Reimbursement",
        permission: "reimbursement:view",
      },
    ],
  },
  {
    key: "settings",
    label: "系统设置",
    items: [
      {
        key: "/enterprise",
        label: "企业信息",
        icon: <BankOutlined />,
        component: "Enterprise/Enterprise",
        permission: "enterprise:view",
      },
      {
        key: "/hr-config",
        label: "人力资源配置",
        icon: <SettingOutlined />,
        component: "HrConfig/HrConfig",
        permission: "hr-config:view",
      },
      {
        key: "/audit-logs",
        label: "系统审计日志",
        icon: <HistoryOutlined />,
        component: "AuditLogs/AuditLogs",
        permission: "audit-logs:view",
      },
      {
        key: "/integrations",
        label: "三方开放平台",
        icon: <ApiOutlined />,
        component: "Integrations/Integrations",
        permission: "integrations:view",
      },
    ],
  },
];

/**
 * 递归获取所有末级菜单。
 * 末级菜单才对应具体业务页面。
 */
export function getAllRouteMenus(items = menuGroups) {
  const result = [];

  function walk(list) {
    list.forEach((item) => {
      if (Array.isArray(item.items)) {
        // 菜单分组
        walk(item.items);
      } else if (Array.isArray(item.children) && item.children.length > 0) {
        // 多级菜单
        walk(item.children);
      } else if (item.component) {
        // 末级业务菜单
        result.push(item);
      }
    });
  }

  walk(items);
  return result;
}

/**
 * 所有末级菜单。
 * 路由、菜单查询统一使用这份数据。
 */
export const flatMenus = getAllRouteMenus();

/**
 * 根据 URL 查找菜单及其层级关系。
 *
 * 示例：
 * /employees/list
 * -> 人力资源 / 员工管理 / 员工列表
 */
export function getMenuContextByPath(pathname) {
  for (const group of menuGroups) {
    function walk(items, ancestors = []) {
      for (const item of items) {
        if (item.key === pathname && item.component) {
          return {
            group,
            menu: item,
            ancestors,
          };
        }

        if (Array.isArray(item.children) && item.children.length > 0) {
          const result = walk(item.children, [...ancestors, item]);

          if (result) {
            return result;
          }
        }
      }

      return null;
    }

    const result = walk(group.items);

    if (result) {
      return result;
    }
  }

  return null;
}

/**
 * 根据 URL 获取末级菜单。
 */
export function getMenuByPath(pathname) {
  return getMenuContextByPath(pathname)?.menu || null;
}

/**
 * 自动发现业务页面。
 *
 * 支持：
 * src/pages/Dashboard/Dashboard.jsx
 * src/pages/Organization/Organization.jsx
 * src/pages/Employees/Employees.jsx
 *
 * 不扫描 pages 根目录中的 PlaceholderPage.jsx。
 */
const pageModules = import.meta.glob("../pages/*/*.jsx");

/**
 * 页面组件映射表。
 * 使用 lazy 加载，避免一次性加载全部业务页面。
 */
export const pageComponents = Object.fromEntries(
  Object.entries(pageModules).map(([filePath, loader]) => [
    filePath,
    lazy(loader),
  ]),
);

/**
 * 根据菜单中的 component 标识获取页面组件。
 *
 * Organization/Organization
 * -> ../pages/Organization/Organization.jsx
 */
export function getPageComponent(componentName) {
  if (!componentName) {
    return null;
  }

  const filePath = `../pages/${componentName}.jsx`;

  return pageComponents[filePath] || null;
}

/**
 * 自动生成已找到本地页面的路由。
 *
 * 注意：路由路径以菜单 key 为准，不再按文件夹名推导。
 * 因此员工列表仍然是 /employees/list。
 */
export const autoRoutes = flatMenus
  .map((menu) => {
    const Page = getPageComponent(menu.component);

    if (!Page) {
      return null;
    }

    return {
      path: menu.key,
      component: menu.component,
      element: Page,
      menu,
    };
  })
  .filter(Boolean);
