import { Route, Routes } from 'react-router-dom';
import { Authorization } from '../pages/Authorization';
import { Main } from '../pages/Main';
import { NotFound } from '../pages/NotFound';
import { Registration } from '../pages/Registration';
import { Profile } from '../pages/Profile';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';

export const Layout: React.FC = () => {
  return (
    <section
      className="flex-grow flex justify-center items-center p-6"
      style={{ perspective: 900 }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Authorization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Registration />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </section>
  );
};
