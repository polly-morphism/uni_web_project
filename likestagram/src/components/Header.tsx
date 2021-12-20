import logo from '../assets/heart.png';
import { Avatar, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  useErrorMessage,
  useSuccessMessage,
} from '../app/hooks';
import { LogoutOutlined } from '@ant-design/icons';
import {
  loggingOutErrorChanged,
  loggingOutSucceedMessageChanged,
  logOut,
} from '../features/auth/authSlice';

export const Header: React.FC = () => {
  const account = useAppSelector((state) => state.auth.account);
  const loggingOutError = useAppSelector((state) => state.auth.loggingOutError);
  const isLoggingOut = useAppSelector((state) => state.auth.isLoggingOut);
  const loggingOutSucceedMessage = useAppSelector(
    (state) => state.auth.loggingOutSucceedMessage
  );

  const dispatch = useAppDispatch();

  useErrorMessage(loggingOutError, loggingOutErrorChanged);
  useSuccessMessage(loggingOutSucceedMessage, loggingOutSucceedMessageChanged);

  const logOutHandler = () => {
    dispatch(logOut());
  };

  return (
    <header className="w-full h-16 flex justify-between items-center py-2 pl-6 pr-8 shadow-md">
      <Link to="/" className="h-full flex items-center gap-4">
        <img src={logo} alt="logo" className="h-full" />
        <Typography.Title level={3} style={{ margin: 0 }}>
          Likestagram
        </Typography.Title>
      </Link>

      {account ? (
        <div className="h-full flex items-center gap-8">
          <Link
            to="/profile"
            className="h-full w-40 flex justify-end items-center gap-2 group"
          >
            <Avatar
              className="bg-orange-300 shrink-0"
              size={'large'}
              src={account.photo}
            >
              {account.first_name[0]?.toUpperCase()}
            </Avatar>
            <Typography.Title
              level={5}
              style={{ margin: 0 }}
              className="truncate group-hover:text-red-500 transition-colors duration-300"
            >
              {account.username}
            </Typography.Title>
          </Link>
          <Button
            icon={<LogoutOutlined />}
            shape="circle"
            size="large"
            disabled={isLoggingOut}
            onClick={logOutHandler}
          />
        </div>
      ) : (
        <Link to="/login">
          <Typography.Title
            level={5}
            style={{ margin: 0 }}
            className="text-gray-200"
          >
            Sign In
          </Typography.Title>
        </Link>
      )}
    </header>
  );
};
