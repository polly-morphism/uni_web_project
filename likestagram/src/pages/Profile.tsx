import { Button, Statistic, Tabs } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useErrorMessage } from '../app/hooks';
import { Settings } from '../components/Settings';
import { getLikes, totalLikesErrorChanged } from '../features/users/usersSlice';
const { TabPane } = Tabs;

export const Profile: React.FC = () => {
  const totalLikes = useAppSelector((state) => state.users.totalLikes);
  const loading = useAppSelector((state) => state.users.isLikesFetching);
  const error = useAppSelector((state) => state.users.totalLikesError);
  const dispatch = useAppDispatch();

  useErrorMessage(error, totalLikesErrorChanged);

  useEffect(() => {
    dispatch(getLikes());
  }, [dispatch]);

  const updateHandler = () => {
    dispatch(getLikes());
  };

  return (
    <Tabs defaultActiveKey="1" className="w-full h-full" type="card">
      <TabPane tab="Settings" key="1">
        <Settings />
      </TabPane>
      <TabPane tab="Statistic" key="2">
        <Statistic title="Total likes" value={totalLikes} />
        <Button
          className="bg-sky-500 mt-4"
          type="primary"
          loading={loading}
          onClick={updateHandler}
        >
          Update
        </Button>
      </TabPane>
    </Tabs>
  );
};
