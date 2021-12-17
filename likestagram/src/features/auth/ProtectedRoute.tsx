import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface Props {
  children: React.ReactElement<any, any> | null;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  const account = useAppSelector((state) => state.auth.account);

  if (location.pathname === '/login' || location.pathname === '/register') {
    if (account) {
      return <Navigate to="/profile" />;
    }

    return children;
  }

  if (account) {
    return children;
  }

  return <Navigate to="/login" />;
};
