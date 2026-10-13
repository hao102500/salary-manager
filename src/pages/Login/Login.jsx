import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Button, Checkbox, Form, Input, Segmented, Tooltip } from "antd";
import {
  ApartmentOutlined,
  ArrowRightOutlined,
  BankOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GlobalOutlined,
  KeyOutlined,
  LockOutlined,
  LockOutlined as SecureOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
  WechatOutlined,
  ThunderboltOutlined,
  SwapOutlined,
  VerifiedOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import "./Login.css";

const authOptions = [
  {
    label: (
      <span className="login-mode-label">
        <LockOutlined />
        账号密码
      </span>
    ),
    value: "password",
  },
  {
    label: (
      <span className="login-mode-label">
        <MailOutlined />
        手机动态码
      </span>
    ),
    value: "sms",
  },
  {
    label: (
      <span className="login-mode-label">
        <QrcodeOutlined />
        企业扫码
      </span>
    ),
    value: "qr",
  },
];

const features = [
  {
    icon: <ThunderboltOutlined />,
    title: "自动化薪算引擎",
    description: "社保、公积金与个税规则智能校验，让薪酬核算更高效。",
  },
  {
    icon: <SwapOutlined />,
    title: "全周期人事联动",
    description: "入转调离与薪资变动自动关联，减少重复录入与遗漏。",
  },
  {
    icon: <VerifiedOutlined />,
    title: "企业级安全防护",
    description: "细粒度权限控制与安全审计，保护企业敏感数据。",
  },
];

export default function Login() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [authMode, setAuthMode] = useState("password");
  const [loading, setLoading] = useState(false);
  const [tenantMatched, setTenantMatched] = useState(false);

  const handleTenantChange = (event) => {
    setTenantMatched(Boolean(event.target.value.trim()));
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      // TODO: 接入真实登录 API。当前只提供前端页面演示，不执行真实鉴权。
      window.setTimeout(() => {
        setLoading(false);
        message.info("登录页面已就绪，接入后端登录接口后即可完成身份验证。");
      }, 500);
    } catch {
      // Ant Design Form 会显示字段校验信息。
    }
  };

  const renderAuthForm = () => {
    if (authMode === "qr") {
      return (
        <div className="login-qr-panel">
          <div className="login-qr-placeholder">
            <QrcodeOutlined />
          </div>
          <div className="login-qr-title">使用企业应用扫码登录</div>
          <p>请使用已绑定的企业微信或钉钉扫描二维码。</p>
          <Button
            type="link"
            onClick={() => message.info("扫码登录需要接入企业身份认证服务。")}
          >
            查看扫码登录说明
          </Button>
        </div>
      );
    }

    return (
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          tenant: "hangzhou-tech.hr",
          remember: true,
        }}
        onFinish={handleSubmit}
        className="login-form"
      >
        <Form.Item
          label="企业标识 / 专属域名"
          name="tenant"
          rules={[{ required: true, message: "请输入企业标识或专属域名" }]}
        >
          <Input
            style={{ height: 48 }}
            prefix={<ApartmentOutlined />}
            suffix={
              tenantMatched ? (
                <span className="tenant-match">
                  <CheckCircleFilled />
                  已填写
                </span>
              ) : null
            }
            placeholder="请输入企业代码或域名标识"
            onChange={handleTenantChange}
            autoComplete="organization"
          />
        </Form.Item>

        {authMode === "password" ? (
          <>
            <Form.Item
              label="账号 / 邮箱 / 员工工号"
              name="account"
              rules={[
                { required: true, message: "请输入账号、邮箱或员工工号" },
              ]}
            >
              <Input
                style={{ height: 48 }}
                prefix={<UserOutlined />}
                placeholder="请输入账号或员工工号"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="login-password-label">
                  <span>认证密码</span>
                  <a
                    href="#forgot-password"
                    onClick={(event) => {
                      event.preventDefault();
                      message.info("请联系系统管理员重置密码。");
                    }}
                  >
                    找回密码
                  </a>
                </div>
              }
              name="password"
              rules={[{ required: true, message: "请输入登录密码" }]}
            >
              <Input.Password
                style={{ height: 48 }}
                prefix={<KeyOutlined />}
                placeholder="请输入企业安全访问密码"
                autoComplete="current-password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              label="手机号码"
              name="phone"
              rules={[
                { required: true, message: "请输入手机号码" },
                {
                  pattern: /^1\d{10}$/,
                  message: "请输入正确的 11 位手机号码",
                },
              ]}
            >
              <Input
                style={{ height: 48 }}
                prefix={<UserOutlined />}
                placeholder="请输入绑定的手机号码"
                autoComplete="tel"
              />
            </Form.Item>
            <Form.Item
              label="短信验证码"
              name="smsCode"
              rules={[{ required: true, message: "请输入短信验证码" }]}
            >
              <Input
                style={{ height: 48 }}
                prefix={<SafetyCertificateOutlined />}
                placeholder="请输入验证码"
                suffix={
                  <Button
                    type="link"
                    className="login-code-button"
                    onClick={() => message.info("短信验证码服务尚未接入。")}
                  >
                    获取验证码
                  </Button>
                }
              />
            </Form.Item>
          </>
        )}

        <div className="login-form-options">
          {authMode === "password" ? (
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住此设备</Checkbox>
            </Form.Item>
          ) : (
            <span className="login-option-hint">验证码仅用于本次身份核验</span>
          )}
          <span className="login-security-hint">
            <SafetyCertificateOutlined />
            企业安全认证
          </span>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          icon={<LockOutlined />}
          className="login-submit"
        >
          {loading ? "正在验证..." : "安全登录至管理台"}
        </Button>
      </Form>
    );
  };

  return (
    <div className="login-page">
      <div className="login-background-orb login-orb-one" />
      <div className="login-background-orb login-orb-two" />
      <div className="login-background-orb login-orb-three" />

      <header className="login-header">
        <div className="login-brand">
          <div className="login-brand-icon">
            <WalletOutlined />
          </div>
          <div className="login-brand-copy">
            <span className="login-brand-name">薪资管家</span>
            <span className="login-brand-subtitle">SaaS HR</span>
          </div>
          <span className="login-version">v3.8 企业版</span>
        </div>

        <div className="login-header-actions">
          <div className="login-system-status">
            <span className="login-status-dot" />
            系统运行正常
          </div>
          <Button
            type="text"
            icon={<GlobalOutlined />}
            className="login-language-button"
            onClick={() => message.info("当前仅提供简体中文界面。")}
          >
            简体中文
          </Button>
        </div>
      </header>

      <main className="login-main">
        <section className="login-shell">
          <aside className="login-showcase">
            <div className="login-showcase-glow login-showcase-glow-top" />
            <div className="login-showcase-glow login-showcase-glow-bottom" />

            <div className="login-showcase-content">
              <div className="login-showcase-brand">
                <div className="login-showcase-logo">
                  <WalletOutlined />
                </div>
                <div>
                  <div className="login-showcase-name">薪资管家</div>
                  <div className="login-showcase-subtitle">
                    Enterprise Suite
                  </div>
                </div>
                <span className="login-pro-badge">PRO 旗舰版</span>
              </div>

              <div className="login-showcase-intro">
                <h1>敏捷 · 准时 · 零差错</h1>
                <p>面向高增长组织的智能薪酬结算与税务自动化云中枢</p>
              </div>

              <div className="login-feature-list">
                {features.map((feature) => (
                  <div className="login-feature-card" key={feature.title}>
                    <div className="login-feature-icon">{feature.icon}</div>
                    <div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="login-live-card">
              <div className="login-live-heading">
                <span>
                  <span className="login-live-dot" />
                  算薪运行实况
                </span>
                <span className="login-cycle">演示数据</span>
              </div>
              <div className="login-live-metric">
                <div>
                  <strong>1,420</strong>
                  <span>人核算完成</span>
                </div>
                <span className="login-live-rate">99.8% 校验无异</span>
              </div>
              <div className="login-progress">
                <span />
              </div>
            </div>
          </aside>

          <section className="login-workbench">
            <div className="login-workbench-heading">
              <div>
                <h2>欢迎登录工作台</h2>
                <p>选择身份核验方式以访问组织薪酬专区</p>
              </div>
              <span className="login-cloud-badge">
                <CheckCircleOutlined />
                云原生多租户
              </span>
            </div>

            <Segmented
              block
              options={authOptions}
              value={authMode}
              onChange={(value) => {
                setAuthMode(value);
                form.resetFields(["account", "password", "phone", "smsCode"]);
              }}
              className="login-auth-segmented"
            />

            {renderAuthForm()}

            <div className="login-sso">
              <div className="login-sso-divider">
                <span>或通过企业统一身份认证 (SSO)</span>
              </div>
              <div className="login-sso-grid">
                <button
                  type="button"
                  className="login-sso-item"
                  onClick={() =>
                    message.info("企业微信登录需要接入 SSO 服务。")
                  }
                >
                  <span className="login-sso-icon wechat">
                    <WechatOutlined />
                  </span>
                  <span>企业微信</span>
                </button>
                <button
                  type="button"
                  className="login-sso-item"
                  onClick={() => message.info("钉钉登录需要接入 SSO 服务。")}
                >
                  <span className="login-sso-icon dingtalk">
                    <SendOutlined />
                  </span>
                  <span>钉钉</span>
                </button>
                <button
                  type="button"
                  className="login-sso-item"
                  onClick={() => message.info("飞书登录需要接入 SSO 服务。")}
                >
                  <span className="login-sso-icon feishu">
                    <TeamOutlined />
                  </span>
                  <span>飞书</span>
                </button>
                <button
                  type="button"
                  className="login-sso-item"
                  onClick={() =>
                    message.info("SAML/LDAP 登录需要接入企业身份服务。")
                  }
                >
                  <span className="login-sso-icon saml">
                    <KeyOutlined />
                  </span>
                  <span>SAML/LDAP</span>
                </button>
              </div>
            </div>

            <div className="login-trial-tip">
              <span>尚未配置企业账号？请联系系统管理员</span>
              <a
                href="#trial"
                onClick={(event) => {
                  event.preventDefault();
                  message.info("企业试用申请入口尚未接入。");
                }}
              >
                申请开通企业试用
                <ArrowRightOutlined />
              </a>
            </div>
          </section>
        </section>
      </main>

      <footer className="login-footer">
        <div className="login-footer-security">
          <span>
            <LockOutlined />
            加密传输
          </span>
          <i />
          <span>
            <SafetyCertificateOutlined />
            企业信息安全防护
          </span>
          <i />
          <span>薪资管家 · 管理后台</span>
        </div>
        <div className="login-footer-links">
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              message.info("隐私政策页面尚未配置。");
            }}
          >
            隐私权政策
          </a>
          <i />
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              message.info("服务协议页面尚未配置。");
            }}
          >
            服务协议
          </a>
          <i />
          <a
            href="#help"
            onClick={(e) => {
              e.preventDefault();
              message.info("帮助与支持页面尚未配置。");
            }}
          >
            帮助与支持
          </a>
        </div>
      </footer>
    </div>
  );
}
