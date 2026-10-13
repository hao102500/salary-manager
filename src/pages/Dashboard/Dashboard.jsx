import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Segmented,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  App,
} from "antd";
import {
  AlertOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudSyncOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  TeamOutlined,
  WalletOutlined,
  WarningOutlined,
  BulbOutlined,
  AuditOutlined,
  RightOutlined,
  ThunderboltOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./Dashboard.css";

const { Title, Text } = Typography;


const departments = [
  {
    name: "研发与工程技术中心",
    amount: "¥ 1,842,500.00",
    people: "在册 186 人",
    note: "人均 ¥9,905/月",
    change: "+1.8%",
    positive: true,
  },
  {
    name: "产品中心与体验设计",
    amount: "¥ 528,100.00",
    people: "在册 54 人",
    note: "人均 ¥9,779/月",
    change: "+0.6%",
    positive: true,
  },
  {
    name: "营销与商业化增长部",
    amount: "¥ 792,310.00",
    people: "在册 112 人",
    note: "含 Q1 提成激励",
    change: "+6.2%",
    positive: true,
  },
  {
    name: "行政财务与综合职能",
    amount: "¥ 320,000.00",
    people: "在册 76 人",
    note: "预算平稳核销",
    change: "-1.2%",
    positive: false,
  },
];

const adjustmentData = [
  {
    key: "1",
    name: "楚若云",
    id: "EMP-0842",
    avatar: "楚",
    dept: "研发中心 · 资深架构师",
    type: "年度晋升",
    before: "¥ 32,000",
    after: "¥ 38,000",
    diff: "+¥ 6,000.00",
    status: "已复核",
  },
  {
    key: "2",
    name: "何景然",
    id: "EMP-1094",
    avatar: "何",
    dept: "增长部 · 客户成功主管",
    type: "转正定薪",
    before: "¥ 12,000",
    after: "¥ 15,000",
    diff: "+¥ 3,000.00",
    status: "已复核",
  },
  {
    key: "3",
    name: "顾少谦",
    id: "EMP-0761",
    avatar: "顾",
    dept: "AI应用部 · 算法工程师",
    type: "跨月补贴冲抵",
    before: "¥ 28,000",
    after: "¥ 26,800",
    diff: "-¥ 1,200.00",
    status: "待人工确认",
  },
];

const pipeline = [
  {
    number: "✓",
    title: "1. 数据准备",
    desc: "入转调离与职级",
    status: "已封账",
    done: true,
  },
  {
    number: "✓",
    title: "2. 考勤核验",
    desc: "工时与休假结转",
    status: "已核验",
    done: true,
  },
  {
    number: "3",
    title: "3. 规则试算",
    desc: "薪酬规则与个税",
    status: "已完成",
    done: true,
  },
  {
    number: "4",
    title: "4. 差异复核",
    desc: "异常数据检查",
    status: "进行中",
    active: true,
  },
  {
    number: "5",
    title: "5. 审批确认",
    desc: "部门负责人审批",
    status: "待处理",
  },
  {
    number: "6",
    title: "6. 发薪归档",
    desc: "银行代发与凭证",
    status: "未开始",
  },
];

const approvals = [
  {
    title: "子女教育专项附加扣除申报",
    sub: "申请人：李思远 · 智能硬件部",
    time: "刚刚",
    amount: "扣除标准：¥ 2,000/月",
    kind: "approval",
  },
  {
    title: "部门绩效系数二次校准申报",
    sub: "华东运营部 · 调整总基数 ¥ 48,000",
    time: "1小时前",
    amount: "系数建议：1.15",
    kind: "approval",
  },
  {
    title: "2025 Q1 专项技术攻坚奖金包",
    sub: "云平台架构组 · 涉及 14 人",
    time: "昨天",
    amount: "总包：¥ 140,000",
    kind: "detail",
  },
];

const timeline = [
  {
    date: "3月10日",
    title: "考勤封账与休假结转",
    desc: "全体 428 人打卡与异常考勤核对归档完成",
    status: "已达成",
    tone: "success",
  },
  {
    date: "3月15日",
    title: "个税申报与预扣缴纳",
    desc: "自然人税收管理系统申报窗口开启",
    status: "紧迫节点",
    tone: "primary",
  },
  {
    date: "3月20日",
    title: "社保公积金托收代扣",
    desc: "8个分公司扣款账户资金头寸调度",
    status: "准备中",
    tone: "muted",
  },
];

const adjustmentColumns = [
  {
    title: "员工 / 工号",
    dataIndex: "name",
    width: 170,
    render: (_, row) => (
      <Space size={10}>
        <Avatar size={32} className={`staff-avatar staff-avatar-${row.key}`}>
          {row.avatar}
        </Avatar>
        <span>
          <Text strong>{row.name}</Text>
          <br />
          <Text type="secondary" className="mono small-text">
            {row.id}
          </Text>
        </span>
      </Space>
    ),
  },
  {
    title: "部门与岗位",
    dataIndex: "dept",
    width: 210,
    render: (value) => <Text>{value}</Text>,
  },
  {
    title: "变动类型",
    dataIndex: "type",
    width: 130,
    render: (value) => <Tag className="type-tag">{value}</Tag>,
  },
  {
    title: "调前基数",
    dataIndex: "before",
    align: "right",
    width: 125,
    render: (value) => (
      <Text type="secondary" delete className="mono">
        {value}
      </Text>
    ),
  },
  {
    title: "调后基数",
    dataIndex: "after",
    align: "right",
    width: 125,
    render: (value) => (
      <Text strong className="mono">
        {value}
      </Text>
    ),
  },
  {
    title: "差额影响",
    dataIndex: "diff",
    align: "right",
    width: 140,
    render: (value) => (
      <Text
        className={`mono ${value.startsWith("-") ? "negative-value" : "positive-value"}`}
        strong
      >
        {value}
      </Text>
    ),
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    width: 130,
    render: (value) =>
      value === "已复核" ? (
        <Tag color="success" icon={<CheckCircleFilled />}>
          已复核
        </Tag>
      ) : (
        <Tag color="error" icon={<WarningOutlined />}>
          待人工确认
        </Tag>
      ),
  },
];

function PanelTitle({ icon, title, subtitle, extra }) {
  return (
    <div className="panel-title-row">
      <div className="panel-title-main">
        <span className="panel-icon">{icon}</span>
        <div>
          <Title level={5}>{title}</Title>
          {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>
      </div>
      {extra}
    </div>
  );
}

function MetricCard({
  title,
  value,
  suffix,
  note,
  icon,
  color,
  trend,
  precision,
}) {
  return (
    <Card variant="borderless" className="metric-card glass-card">
      <div className="metric-top">
        <Text type="secondary">{title}</Text>
        <span className={`metric-icon ${color}`}>{icon}</span>
      </div>
      <Statistic
        value={value}
        precision={precision}
        suffix={suffix}
        groupSeparator=","
      />
      <div className="metric-foot">
        <span
          className={
            trend?.startsWith("-") ? "negative-value" : "positive-value"
          }
        >
          {trend &&
            (trend.startsWith("-") ? (
              <ArrowDownOutlined />
            ) : (
              <ArrowUpOutlined />
            ))}{" "}
          {trend}
        </span>
        <Text type="secondary">{note}</Text>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [costMode, setCostMode] = useState("按组成项");
  const [handled, setHandled] = useState([]);
  const { message } = App.useApp();
  const pendingCount = useMemo(
    () => approvals.filter((_, i) => !handled.includes(i) && i < 2).length + 1,
    [handled],
  );

  const handleApproval = (index, action) => {
    setHandled((prev) => (prev.includes(index) ? prev : [...prev, index]));
    message.success(
      action === "approve"
        ? "已记录核准操作（演示）"
        : "已记录驳回操作（演示）",
    );
  };

  return (
    <div className="payroll-dashboard">

      <Card variant="borderless" className="cycle-toolbar glass-card">
        <div className="cycle-left">
          <div className="cycle-pill">
            <Badge status="processing" />
            <span>2025年03月 · 算薪发薪周期进行中</span>
          </div>
          <div className="cycle-countdown">
            <ClockCircleOutlined />
            <span>封账申报倒计时：</span>
            <strong>48小时 12分 06秒</strong>
          </div>
          <Tag
            icon={<SafetyCertificateOutlined />}
            color="success"
            variant="outlined"
          >
            个税新规算法 v4.2 已同步
          </Tag>
        </div>
        <Space wrap>
          <Button
            icon={<AlertOutlined />}
            onClick={() => message.info("打开异常录入（请接入业务弹窗）")}
          >
            快速录入异常
          </Button>
          <Button
            icon={<FileSearchOutlined />}
            onClick={() => message.info("打开算薪预览（请接入业务页面）")}
          >
            查看算薪预览
          </Button>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => message.info("已触发演示算薪操作")}
          >
            开始算薪
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]} className="metrics-row">
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="本月应发薪酬总额"
            value={348.62}
            precision={2}
            suffix="万"
            note="较上月"
            trend="+4.8%"
            icon={<WalletOutlined />}
            color="blue"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="预计实发人数"
            value={428}
            suffix="人"
            note="在职员工 428 人"
            trend="+12 人"
            icon={<TeamOutlined />}
            color="green"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="个税代扣总额"
            value={28.46}
            precision={2}
            suffix="万"
            note="综合税负率"
            trend="8.16%"
            icon={<FileTextOutlined />}
            color="purple"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard
            title="待处理异常项"
            value={6}
            suffix="项"
            note="需要人工复核"
            trend="-3 项"
            icon={<WarningOutlined />}
            color="orange"
          />
        </Col>
      </Row>


      {/* 薪酬核算全生命周期进度 */}
      <Card variant="borderless" className="glass-card pipeline-card">
        <div className="pipeline-heading">
          <PanelTitle
            icon={<SyncOutlined />}
            title="薪酬核算全生命周期"
            subtitle="Payroll lifecycle · 当前周期处理进度"
          />
          <div className="pipeline-total">
            <div>
              <Text type="secondary">周期完成度</Text>
              <Title level={4}>68%</Title>
            </div>
            <div className="pipeline-ring">
              <Progress
                type="circle"
                percent={68}
                size={50}
                strokeWidth={8}
                format={(percent) => `${percent}%`}
              />
            </div>
            
          </div>
        </div>
        <Row gutter={[12, 12]} className="pipeline-steps">
          {pipeline.map((step, index) => (
            <Col xs={12} sm={8} lg={4} key={step.title}>
              <div
                className={`pipeline-step ${step.active ? "is-active" : ""} ${step.done ? "is-done" : ""}`}
              >
                <div className="step-top">
                  <span className="step-number">
                    {step.done ? <CheckCircleFilled /> : step.number}
                  </span>
                  <Tag
                    className={
                      step.active
                        ? "step-tag active"
                        : step.done
                          ? "step-tag done"
                          : "step-tag"
                    }
                  >
                    {step.status}
                  </Tag>
                </div>
                <div className="step-title">{step.title}</div>
                <Text type="secondary">{step.desc}</Text>
                {index < pipeline.length - 1 && (
                  <span className="step-connector" />
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[18, 18]} className="main-content-row">
        <Col xs={24} xl={15} className="dashboard-main-column">
          {/* 薪酬成本结构与部门预算占比 */}
          <Card variant="borderless" className="glass-card content-card">
            <PanelTitle
              icon={<DollarOutlined />}
              title="薪酬成本结构与部门预算占比"
              subtitle="各业务单元支出与环比浮动监测"
              extra={
                <Segmented
                  options={["按组成项", "按事业部"]}
                  value={costMode}
                  onChange={setCostMode}
                />
              }
            />
            {costMode === "按组成项" ? (
              <>
                <div className="cost-legend">
                  <span>
                    基本薪资 <b>58%</b>
                  </span>
                  <span>
                    绩效奖金 <b>24%</b>
                  </span>
                  <span>
                    企业社保/公积金 <b>12%</b>
                  </span>
                  <span>
                    津贴/报销补发 <b>6%</b>
                  </span>
                </div>
                <div className="cost-bar">
                  <span style={{ width: "58%" }} />
                  <span style={{ width: "24%" }} />
                  <span style={{ width: "12%" }} />
                  <span style={{ width: "6%" }} />
                </div>
              </>
            ) : (
              <div className="cost-mode-note">
                <TeamOutlined /> 部门薪酬分布详见下方各业务单元预算卡片
              </div>
            )}
            <Row gutter={[12, 12]} className="department-grid">
              {departments.map((dept) => (
                <Col xs={24} sm={12} key={dept.name}>
                  <div className="department-card">
                    <div className="department-head">
                      <Text strong>{dept.name}</Text>
                      <Tag
                        className={dept.positive ? "change-up" : "change-down"}
                      >
                        {dept.change}
                      </Tag>
                    </div>
                    <div className="department-amount">{dept.amount}</div>
                    <div className="department-foot">
                      <Text type="secondary">{dept.people}</Text>
                      <Text type="secondary">{dept.note}</Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
          

          {/* 本月异动调薪与差额复核明细 */}
          <Card
            variant="borderless"
            className="glass-card content-card adjustment-card"
          >
            <PanelTitle
              icon={<AuditOutlined />}
              title="本月异动调薪与差额复核明细"
              subtitle="共 5 笔重点异动，已核准 3 笔"
              extra={
                <Button type="link" icon={<RightOutlined />}>
                  查看全部
                </Button>
              }
            />
            <Table
              columns={adjustmentColumns}
              dataSource={adjustmentData}
              pagination={false}
              scroll={{ x: 980 }}
              size="middle"
              rowClassName={(record) =>
                record.status !== "已复核" ? "needs-review-row" : ""
              }
            />
          </Card>
        </Col>
        
        
        <Col xs={24} xl={9} className="dashboard-side-column">
          {/* 薪酬相关待办审批 */}
          <Card
            variant="borderless"
            className="glass-card content-card approval-card"
          >
            <PanelTitle
              icon={<CheckCircleOutlined />}
              title="薪酬相关待办审批"
              extra={<Badge count={pendingCount} overflowCount={99} />}
            />
            <div className="approval-list">
              {approvals.map((item, index) => (
                <div
                  className={`approval-item ${handled.includes(index) ? "approval-handled" : ""}`}
                  key={item.title}
                >
                  <div className="approval-item-head">
                    <div>
                      <Text strong>{item.title}</Text>
                      <div className="approval-subtitle">{item.sub}</div>
                    </div>
                    <Tag className="time-tag">
                      {handled.includes(index) ? "已处理" : item.time}
                    </Tag>
                  </div>
                  <Divider />
                  <div className="approval-item-foot">
                    <Text className={index === 1 ? "positive-value" : ""}>
                      {item.amount}
                    </Text>
                    <Space size={2}>
                      {item.kind === "detail" ? (
                        <Button
                          type="link"
                          size="small"
                          onClick={() =>
                            message.info("奖金包明细（请接入详情页）")
                          }
                        >
                          查看明细
                        </Button>
                      ) : (
                        <>
                          <Button
                            type="link"
                            size="small"
                            disabled={handled.includes(index)}
                            onClick={() => handleApproval(index, "approve")}
                          >
                            核准
                          </Button>
                          <Button
                            type="link"
                            danger
                            size="small"
                            disabled={handled.includes(index)}
                            onClick={() => handleApproval(index, "reject")}
                          >
                            驳回
                          </Button>
                        </>
                      )}
                    </Space>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 3月薪税合规关键日历 */} 
          <Card
            variant="borderless"
            className="glass-card content-card calendar-card"
          >
            <PanelTitle
              icon={<CalendarOutlined />}
              title="3月薪税合规关键日历"
              extra={<Tag>杭州标准</Tag>}
            />
            <div className="tax-timeline">
              {timeline.map((item) => (
                <div
                  className={`timeline-item timeline-${item.tone}`}
                  key={item.date}
                >
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-head">
                      <Text strong>
                        {item.date} · {item.title}
                      </Text>
                      <Tag>{item.status}</Tag>
                    </div>
                    <Text type="secondary">{item.desc}</Text>
                  </div>
                </div>
              ))}
            </div>
            <Alert
              className="compliance-alert"
              showIcon
              icon={<BulbOutlined />}
              type="info"
              title="合规提醒"
              description="软件开发类企业可关注第一季度研发费用加计扣除申报要求，相关算薪分摊表可同步至财务报税系统。"
            />
          </Card>
        </Col>
      </Row>

      <div className="audit-footer">
        <Space wrap>
          <span className="secure-label">
            <CloudSyncOutlined /> 所有薪资模型自动实时加密存储（256-bit AES）
          </span>
          <Divider orientation="vertical" />
          <Text type="secondary">上次自动校验时间：今天 16:42:19</Text>
        </Space>
        <Space wrap>
          <Button type="link" icon={<FileTextOutlined />}>
            查看完整算薪公式逻辑手册
          </Button>
          <Button type="link" icon={<FileSearchOutlined />}>
            薪酬合规审计报告下载
          </Button>
        </Space>
      </div>
    </div>
  );
}
