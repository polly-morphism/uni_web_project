import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { UsersCard } from '../components/UsersCard/UsersCard';
import { getUsers } from '../features/users/usersSlice';

export const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return <UsersCard />;
};
