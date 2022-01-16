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

  likers: (User & WithId & WithPhoto)[] | null;
  matches: (User & WithId & WithPhoto)[] | null;
  isLikersFetching: boolean;
  likersError: string | null;
}

const initialState: UsersState = {
  users: [],
  isUsersFetching: false,
  usersFetchingError: null,

  isLiking: false,
  likingError: null,

  likers: [
    {
      id: '1',
      first_name: 'polina',
      last_name: 'verzun',
      description: 'da',
      email: 'ddd',
      username: 'dcdcdc',
      photo: null,
    },
  ],
  matches: [],
  isLikersFetching: false,
  likersError: null,
};

export const getUsers = createAsyncThunk<
  (User & WithId & WithIsLiked & WithPhoto)[],
  void,
  { rejectValue: string }
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

export const changeLike = createAsyncThunk<
  LikeInfo[],
  Id,
  { rejectValue: string }
>('users/likeChange', async (id, { getState, rejectWithValue }) => {
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
});

export const getLikers = createAsyncThunk<
  {
    likes: (User & WithId & WithPhoto)[];
    match: (User & WithId & WithPhoto)[];
  },
  void,
  { rejectValue: string }
>('users/getLikers', async (_, { getState, rejectWithValue }) => {
  const state = getState() as { auth: AuthState };
  try {
    if (state.auth.account?.id) {
      const response = await usersAPI.getLikers(state.auth.account.id);
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

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    likingErrorChanged: (state, action: PayloadAction<string | null>) => {
      state.likingError = action.payload;
    },

    likersErrorChanged: (state, action: PayloadAction<string | null>) => {
      state.likersError = action.payload;
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
        if (action.payload) {
          state.usersFetchingError = action.payload;
        } else {
          state.usersFetchingError = action.error.message ?? null;
        }
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
        if (state.likers) {
          let user = null;

          state.likers = state.likers.filter((u) => {
            if (u.id === action.meta.arg) {
              user = u;
              return false;
            }
            return true;
          });

          if (user) {
            state.matches?.push(user);
          }
        }
      })
      .addCase(changeLike.rejected, (state, action) => {
        state.isLiking = false;
        if (action.payload) {
          state.likingError = action.payload;
        } else {
          state.likingError = action.error.message ?? null;
        }
      })

      .addCase(getLikers.pending, (state) => {
        state.isLikersFetching = true;
      })
      .addCase(getLikers.fulfilled, (state, action) => {
        state.isLikersFetching = false;
        state.likers = action.payload.likes;
        state.matches = action.payload.match;
      })
      .addCase(getLikers.rejected, (state, action) => {
        state.isLikersFetching = false;
        if (action.payload) {
          state.likersError = action.payload;
        } else {
          state.likersError = action.error.message ?? null;
        }
      }),
});

export const { likingErrorChanged, likersErrorChanged } = usersSlice.actions;

export default usersSlice.reducer;
