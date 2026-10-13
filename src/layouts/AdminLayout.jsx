
import { useMemo, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Badge,
  Breadcrumb,
  Dropdown,
  Tooltip,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
  PayCircleOutlined,
} from "@ant-design/icons";

import { menuGroups, getMenuContextByPath } from "@/router";
import "./AdminLayout.css";

const { Sider, Header, Content } = Layout;

const THEME_STORAGE_KEY = "salary-admin-theme";

/**
 * 递归构建 Ant Design Menu 配置。
 * 支持任意层级的 children。
 */
function buildMenuItem(item) {
  const menuItem = {
    key: item.key,
    label: item.label,
  };

  if (item.icon) {
    menuItem.icon = item.icon;
  }

  if (Array.isArray(item.children) && item.children.length > 0) {
    menuItem.children = item.children.map(buildMenuItem);
  }

  return menuItem;
}

/**
 * 将菜单分组转换为 Ant Design Menu items。
 */
function buildMenuGroups(groups) {
  return groups.map((group) => ({
    type: "group",
    key: group.key,
    label: group.label,
    children: group.items.map(buildMenuItem),
  }));
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  // 从本地缓存读取上次选择的主题
  const [isDark, setIsDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(THEME_STORAGE_KEY) === "dark",
  );

  const location = useLocation();
  const navigate = useNavigate();

  // 同步主题到 html，方便 Portal 弹层使用暗黑样式
  useEffect(() => {
    const themeName = isDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", themeName);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [isDark]);

  // 根据当前路径获取菜单、所属分组和祖先菜单
  const menuContext = useMemo(
    () => getMenuContextByPath(location.pathname),
    [location.pathname],
  );

  const currentMenu = menuContext?.menu;
  const pageTitle = currentMenu?.label || "工作台";

  // 自动生成面包屑：分组 / 父级菜单 / 当前菜单
  const breadcrumbItems = useMemo(() => {
    if (!menuContext) {
      return [{ title: pageTitle }];
    }

    return [
      { title: menuContext.group.label },
      ...menuContext.ancestors.map((item) => ({
        title: item.label,
      })),
      { title: menuContext.menu.label },
    ];
  }, [menuContext, pageTitle]);

  // 路由变化后自动展开当前菜单的全部父级
  useEffect(() => {
    const keys = menuContext
      ? menuContext.ancestors.map((item) => item.key)
      : [];

    setOpenKeys(keys);
  }, [menuContext]);

  const menuItems = useMemo(
    () => buildMenuGroups(menuGroups),
    [],
  );

  const handleMenuClick = ({ key }) => {
    if (typeof key === "string" && key.startsWith("/")) {
      navigate(key);
    }
  };

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人资料",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    }

    if (key === "logout") {
      // 接入登录功能后，在这里执行退出登录逻辑
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#245bdb",
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
        },
      }}
    >
      <Layout className="admin-layout">
        <Sider
          className="admin-sider"
          width={248}
          collapsedWidth={80}
          collapsible
          trigger={null}
          collapsed={collapsed}
        >
          <div className="brand">
            <div className="brand-logo">
              <PayCircleOutlined />
            </div>

            {!collapsed && (
              <div className="brand-info">
                <div className="brand-name">薪资管家</div>
                <div className="brand-subtitle">
                  SaaS HR &amp; Payroll
                </div>
              </div>
            )}

            {!collapsed && (
              <span className="brand-pro">PRO</span>
            )}
          </div>

          <div className="sidebar-menu">
            <Menu
              mode="inline"
              theme={isDark ? "dark" : "light"}
              selectedKeys={
                currentMenu ? [currentMenu.key] : []
              }
              openKeys={collapsed ? [] : openKeys}
              items={menuItems}
              onClick={handleMenuClick}
              onOpenChange={handleOpenChange}
              inlineCollapsed={collapsed}
            />
          </div>

          <div className="sidebar-footer">
            <Button
              type="text"
              block
              icon={<QuestionCircleOutlined />}
              onClick={() => navigate("/help")}
            >
              {!collapsed && "帮助文档与指引"}
            </Button>

            {!collapsed && (
              <div className="sidebar-version">
                薪资管家 · 管理后台
              </div>
            )}
          </div>
        </Sider>

        <Layout
          className="admin-main"
          style={{
            marginLeft: collapsed ? 80 : 248,
          }}
        >
          <Header className="admin-header">
            <div className="header-left">
              <Tooltip title={collapsed ? "展开菜单" : "收起菜单"}>
                <Button
                  type="text"
                  className="collapse-button"
                  icon={
                    collapsed
                      ? <MenuUnfoldOutlined />
                      : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed((value) => !value)}
                />
              </Tooltip>

              <div className="header-divider" />

              <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="header-right">
              <Tooltip title="通知">
                <Badge dot offset={[-4, 4]}>
                  <Button
                    type="text"
                    className="header-icon-button"
                    icon={<BellOutlined />}
                    aria-label="通知"
                  />
                </Badge>
              </Tooltip>

              <div className="header-divider user-divider" />

              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick,
                }}
                placement="bottomRight"
              >
                <button
                  className="user-profile"
                  type="button"
                >
                  <Avatar
                    size={34}
                    style={{
                      backgroundColor: isDark
                        ? "#25365c"
                        : "#e6edff",
                      color: isDark
                        ? "#91b4ff"
                        : "#245bdb",
                    }}
                  >
                    郝
                  </Avatar>

                  <div className="user-info">
                    <span className="user-name">管理员</span>
                    <span className="user-role">超级管理员</span>
                  </div>

                  <DownOutlined className="user-arrow" />
                </button>
              </Dropdown>
            </div>
          </Header>

          <Content className="admin-content">
            <div className="page-container">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
