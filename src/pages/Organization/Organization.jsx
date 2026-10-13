import { Card, Typography } from "antd";

// css
import "./Organization.css";

const { Title, Paragraph } = Typography;

export default function Organization() {
  return (
    <Card>
      <Title level={4}>组织管理</Title>
      <Paragraph type="secondary">
        管理企业部门、组织架构及部门负责人。
      </Paragraph>
    </Card>
  );
}