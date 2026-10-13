import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Organization() {
  return (
    <Card>
      <Title level={4}>员工列表</Title>
      <Paragraph type="secondary">
        管理员工信息，包括姓名、岗位、工资等。
      </Paragraph>
    </Card>
  );
}