import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Organization() {
  return (
    <Card>
      <Title level={4}>岗位管理</Title>
      <Paragraph type="secondary">
        管理岗位信息。
      </Paragraph>
    </Card>
  );
}