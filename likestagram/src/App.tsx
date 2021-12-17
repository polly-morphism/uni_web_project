import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useErrorMessage } from './app/hooks';
import { AppError } from './components/AppError';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { getAccount } from './features/auth/authSlice';

const App: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const accountFethingError = useAppSelector(
    (state) => state.auth.accountFethingError
  );
  const isAccountFetching = useAppSelector(
    (state) => state.auth.isAccountFetching
  );
  const dispatch = useAppDispatch();

  useErrorMessage(accountFethingError);

  useEffect(() => {
    dispatch(getAccount());
  }, [dispatch, token]);

  if (accountFethingError) {
    return <AppError error={accountFethingError} loading={isAccountFetching} />;
  }

  if (isAccountFetching) {
    return (
      <div className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Spin tip="App is loading..." size="large" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <Header />
      <Layout />
    </div>
  );
};

export default App;
