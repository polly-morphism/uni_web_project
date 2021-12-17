import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import UsersReducer from '../features/users/usersSlice';
import AuthReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    users: UsersReducer,
    auth: AuthReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
