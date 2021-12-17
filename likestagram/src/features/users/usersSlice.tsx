import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Id,
  LikeInfo,
  User,
  WithId,
  WithIsLiked,
  WithPhoto,
} from '../../app/types';
import { usersAPI } from './usersApi';
import { AuthState } from '../auth/authSlice';
import { AxiosError } from 'axios';

export interface UsersState {
  users: (User & WithId & WithPhoto & WithIsLiked)[] | null;
  isUsersFetching: boolean;
  usersFetchingError: string | null;

  isLiking: boolean;
  likingError: string | null;

  totalLikes: number;
  isLikesFetching: boolean;
  totalLikesError: string | null;
}

const initialState: UsersState = {
  users: [],
  isUsersFetching: false,
  usersFetchingError: null,

  isLiking: false,
  likingError: null,

  totalLikes: 0,
  isLikesFetching: false,
  totalLikesError: null,
};

export const getUsers = createAsyncThunk<
  (User & WithId & WithIsLiked & WithPhoto)[],
  void
>('users/fetch', async (_, { getState, rejectWithValue }) => {
  const state = getState() as { auth: AuthState };
  try {
    if (state.auth.account?.id) {
      const response = await usersAPI.getUsers(state.auth.account.id);
      return response.data;
    }

    return rejectWithValue('No account id provided');
  } catch (e) {
    const error = e as AxiosError<any>;

    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error.response.data);
  }
});

export const changeLike = createAsyncThunk<LikeInfo[], Id>(
  'users/likeChange',
  async (id, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    try {
      if (state.auth.account?.id) {
        const response = await usersAPI.changeLike(state.auth.account.id, id);
        return response.data;
      }

      return rejectWithValue('No account id provided');
    } catch (e) {
      const error = e as AxiosError<any>;

      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response.data);
    }
  }
);

export const getLikes = createAsyncThunk<LikeInfo[], void>(
  'users/getLikes',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    try {
      if (state.auth.account?.id) {
        const response = await usersAPI.getLikes(state.auth.account.id);
        return response.data;
      }

      return rejectWithValue('No account id provided');
    } catch (e) {
      const error = e as AxiosError<any>;

      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response.data);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    likeErrorChanged: (state, action: PayloadAction<string | null>) => {
      state.likingError = action.payload;
    },

    totalLikesErrorChanged: (state, action: PayloadAction<string | null>) => {
      state.totalLikesError = action.payload;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(getUsers.pending, (state) => {
        state.isUsersFetching = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isUsersFetching = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isUsersFetching = false;
        state.usersFetchingError = action.error.message ?? null;
      })

      .addCase(changeLike.pending, (state) => {
        state.isLiking = true;
      })
      .addCase(changeLike.fulfilled, (state, action) => {
        state.isLiking = false;
        if (state.users) {
          state.users = state.users.map((u) =>
            u.id === action.meta.arg
              ? {
                  ...u,
                  is_liked: !u.is_liked,
                }
              : u
          );
        }
      })
      .addCase(changeLike.rejected, (state, action) => {
        state.isLiking = false;
        state.usersFetchingError = action.error.message ?? null;
      })

      .addCase(getLikes.pending, (state) => {
        state.isLikesFetching = true;
      })
      .addCase(getLikes.fulfilled, (state, action) => {
        state.isLikesFetching = false;
        state.totalLikes = action.payload.length;
      })
      .addCase(getLikes.rejected, (state, action) => {
        state.isLikesFetching = false;
        state.totalLikesError = action.error.message ?? null;
      }),
});

export const { likeErrorChanged, totalLikesErrorChanged } = usersSlice.actions;

export default usersSlice.reducer;
