
import { Empty } from 'antd';
import './Pages.css';

export default function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">
      <div className="page-heading">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">
            这里是{title}模块，后续将在此开发具体业务功能。
          </p>
        </div>
      </div>

      <div className="placeholder-content">
        <Empty
          description={`${title}页面正在建设中`}
        />
      </div>
    </div>
  );
}
