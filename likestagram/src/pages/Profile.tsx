import { Tabs } from 'antd';
import { Settings } from '../components/Settings';
import { Statistics } from '../components/Statistics/Statistics';

const { TabPane } = Tabs;

export const Profile: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1" className="w-full h-full" type="card">
      <TabPane tab="Settings" key="1" className="flex-grow h-80">
        <Settings />
      </TabPane>
      <TabPane tab="Statistic" key="2" className="flex-grow h-80">
        <Statistics />
      </TabPane>
    </Tabs>
  );
};
