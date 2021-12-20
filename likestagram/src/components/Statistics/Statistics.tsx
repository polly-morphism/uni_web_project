import {
  Button,
  Card,
  ConfigProvider,
  Empty,
  Statistic,
  List,
  Avatar,
} from 'antd';
import { useEffect } from 'react';
import { Id } from '../../app/types';
import {
  useAppDispatch,
  useAppSelector,
  useErrorMessage,
} from '../../app/hooks';
import {
  getLikers,
  likersErrorChanged,
  changeLike,
  likingErrorChanged,
} from '../../features/users/usersSlice';

import { HeartIcon } from '@heroicons/react/outline';
import { baseURL } from '../../app/api';

export const Statistics: React.FC = () => {
  const likers = useAppSelector((state) => state.users.likers);
  const matches = useAppSelector((state) => state.users.matches);

  const likersFetching = useAppSelector(
    (state) => state.users.isLikersFetching
  );
  const likersError = useAppSelector((state) => state.users.likersError);

  const isLiking = useAppSelector((state) => state.users.isLiking);
  const likeError = useAppSelector((state) => state.users.likingError);

  const dispatch = useAppDispatch();

  useErrorMessage(likersError, likersErrorChanged);
  useErrorMessage(likeError, likingErrorChanged);

  useEffect(() => {
    dispatch(getLikers());
  }, [dispatch]);

  const updateHandler = () => {
    dispatch(getLikers());
  };

  const likeHandler = (id: Id) => {
    dispatch(changeLike(id));
  };

  const fullList = [...(matches ?? []), ...(likers ?? [])];

  return (
    <div className="w-full h-full flex flex-col">
      <Statistic title="Total likes" value={fullList.length} />
      <Button
        className="inline-block bg-sky-500 my-2 w-auto self-start"
        type="primary"
        loading={likersFetching}
        onClick={updateHandler}
      >
        Update
      </Button>

      <Card
        className="w-full h-3/4 flex-grow overflow-y-hidden"
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'hidden',
          height: '100%',
        }}
      >
        <ConfigProvider
          renderEmpty={() => (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>You don't have likes yet...</span>}
            />
          )}
        >
          <List
            className={`overflow-y-scroll h-full ${
              !fullList?.length && 'flex justify-center items-center'
            }`}
            size="small"
            dataSource={fullList}
            loading={likersFetching}
            renderItem={(item) => (
              <List.Item
                className={'rounded-md'}
                style={
                  matches?.includes(item) ? { backgroundColor: '#D8BFD8' } : {}
                }
                actions={[
                  matches?.includes(item) ? (
                    <span className="text-black">It's a match!</span>
                  ) : (
                    <button
                      className="block w-full h-full group"
                      onClick={() => likeHandler(item.id)}
                      disabled={isLiking}
                    >
                      <HeartIcon
                        className={`h-6 w-6 group-hover:text-red-500`}
                      />
                    </button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={item.photo ? baseURL + item.photo : null}
                      className="bg-orange-400"
                      size="large"
                    >
                      {item.first_name[0].toUpperCase()}
                    </Avatar>
                  }
                  title={`${item.first_name} ${item.last_name}`}
                  description={matches?.includes(item) ? item.email : ''}
                />
              </List.Item>
            )}
          ></List>
        </ConfigProvider>
      </Card>
    </div>
  );
};
