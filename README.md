# 薪资管家

面向企业人力资源与薪酬管理场景的 Web 管理后台前端原型。当前项目提供后台布局、业务导航和演示页面，主要用于界面开发与交互验证；尚未接入后端 API、真实登录或持久化业务数据。

## 功能概览

- **工作台**：展示算薪周期、统计指标、待办审批和薪资变动等演示信息；部分按钮仅提供演示反馈。
- **组织管理、员工列表、岗位管理**：提供基础页面框架和模块说明。
- **其他人力资源与系统设置菜单**：账户、考勤、社保、薪资、个税、报销、企业信息、人力资源配置、审计日志和三方开放平台目前使用建设中占位页。
- **登录页**：提供账号密码、短信动态码和企业扫码等界面入口；身份验证尚未实现。
- **后台框架**：支持侧边菜单折叠、多级菜单导航、面包屑、管理员菜单和明暗主题切换。主题选择保存在浏览器 `localStorage` 中。
- **错误页面**：提供 403 和 404 页面。

## 技术栈

- React 19
- Vite 8
- React Router 6
- Ant Design 6 与 Ant Design Icons
- ESLint 10

## 开始使用

需要安装 Node.js 和 npm。

```bash
npm install
npm run dev
```

Vite 启动后会在终端输出本地访问地址。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产版本，输出到 `dist/` |
| `npm run preview` | 本地预览生产构建 |
| `npm run lint` | 运行 ESLint |

## 项目结构

```text
src/
├── main.jsx                  # 应用入口：React、路由和 Ant Design 全局配置
├── App.jsx                   # 路由注册：静态路由和后台业务路由
├── layouts/
│   ├── AdminLayout.jsx       # 后台整体布局、菜单、面包屑和主题切换
│   └── AdminLayout.css
├── router/
│   ├── index.jsx             # 菜单配置、菜单查找和页面组件发现
│   ├── staticRoutes.jsx      # 登录、403、404 等静态路由
│   ├── permission.js         # 菜单权限过滤辅助函数
│   └── routeMapper.js        # 后端菜单到路由的映射辅助函数
├── pages/
│   ├── Dashboard/            # 工作台
│   ├── Organization/         # 组织管理
│   ├── Employees/            # 员工列表
│   ├── Positions/            # 岗位管理
│   ├── Login/                # 登录页
│   ├── Forbidden/            # 403 页面
│   ├── NotFound/             # 404 页面
│   └── PlaceholderPage.jsx   # 未实现业务页面的占位页
├── styles/
│   └── global.css            # 全局基础样式与主题 CSS 变量
└── assets/                   # 静态资源
```

## 路由与菜单

后台业务菜单集中定义在 `src/router/index.jsx` 的 `menuGroups` 中。`src/App.jsx` 根据菜单末级项目注册路由，并通过 `import.meta.glob("../pages/*/*.jsx")` 自动发现 `src/pages/<模块>/<页面>.jsx` 下的页面组件。菜单项中的 `component` 字段对应页面文件路径（不含 `src/pages/` 前缀和 `.jsx` 后缀）；例如 `Dashboard/Dashboard` 对应 `src/pages/Dashboard/Dashboard.jsx`。

静态路由（登录、403、404）独立于后台菜单。业务菜单如果没有对应页面组件，会显示通用占位页。新增业务页面时，创建相应页面组件并在 `menuGroups` 中配置菜单项；菜单的 `key` 是业务路由路径。

项目中包含权限过滤和后端菜单映射的辅助函数，但当前登录、权限获取和菜单数据仍未连接后端，不能视为已启用的访问控制。