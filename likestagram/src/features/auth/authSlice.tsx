import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  Credentials,
  DetailMessage,
  EditingProfileValidationErrors,
  LoginValidationErrors,
  RegistationValidationErrors,
  Token,
  User,
  WithId,
  WithPassword,
  WithPhoto,
} from '../../app/types';
import { authAPI } from './authAPI';

export interface AuthState {
  account: (User & WithId & WithPhoto) | null;
  token: Token | null;

  isAccountFetching: boolean;
  accountFethingError: string | null;

  isAccountEditing: boolean;
  accountEditingError: string | null;
  accountEditingSucceedMessage: string | null;
  accountEditingFieldsErrors: EditingProfileValidationErrors | null;

  isRegistering: boolean;
  registrationFieldsErrors: RegistationValidationErrors | null;
  registrationError: string | null;

  isLoggingIn: boolean;
  loggingInFieldsErrors: LoginValidationErrors | null;
  loggingInError: string | null;

  isLoggingOut: boolean;
  loggingOutSucceedMessage: string | null;
  loggingOutError: string | null;
}

const initialState: AuthState = {
  account: null,
  token: localStorage.getItem('token'),

  isAccountFetching: true,
  accountFethingError: null,

  isAccountEditing: true,
  accountEditingError: null,
  accountEditingSucceedMessage: null,
  accountEditingFieldsErrors: null,

  isRegistering: false,
  registrationFieldsErrors: null,
  registrationError: null,

  isLoggingIn: false,
  loggingInFieldsErrors: null,
  loggingInError: null,

  isLoggingOut: false,
  loggingOutSucceedMessage: null,
  loggingOutError: null,
};

export const register = createAsyncThunk<
  User & WithId & WithPhoto,
  User & WithPassword,
  {
    rejectValue: RegistationValidationErrors;
  }
>('auth/registration', async (user, { rejectWithValue, dispatch }) => {
  try {
    const response = await authAPI.register(user);
    dispatch(
      logIn({
        email: user.email,
        password: user.password,
        username: user.username,
      })
    );

    return response.data;
  } catch (e) {
    const error = e as AxiosError<RegistationValidationErrors>;
    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error.response.data);
  }
});

export const logIn = createAsyncThunk<
  { key: Token },
  Credentials,
  {
    rejectValue: LoginValidationErrors;
  }
>('auth/loggingIn', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.logIn(credentials);
    localStorage.setItem('token', response.data.key);

    return response.data;
  } catch (e) {
    const error = e as AxiosError<LoginValidationErrors>;

    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error.response.data);
  }
});

export const logOut = createAsyncThunk<DetailMessage, void>(
  'auth/loggingOut',
  async () => {
    const response = await authAPI.logOut();
    localStorage.removeItem('token');
    return response.data;
  }
);

export const getAccount = createAsyncThunk<
  (User & WithId & WithPhoto) | null,
  void,
  {
    rejectValue: string;
  }
>('auth/accountFetch', async (_, { rejectWithValue }) => {
  try {
    const response = await authAPI.getAccount();
    return response.data;
  } catch (e) {
    const error = e as AxiosError<DetailMessage>;

    if (!error.response) {
      throw error;
    }

    if (error.response.status === 401) {
      return rejectWithValue('');
    }

    return rejectWithValue(error.response.data.detail);
  }
});

export const editAccount = createAsyncThunk<
  User & WithId & WithPhoto,
  FormData,
  {
    rejectValue: EditingProfileValidationErrors;
  }
>('auth/accountEdit', async (user, { rejectWithValue }) => {
  try {
    const response = await authAPI.editAccount(user);
    return response.data;
  } catch (e) {
    const error = e as AxiosError<EditingProfileValidationErrors>;

    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registrationErrorChanged: (state, action: PayloadAction<string | null>) => {
      state.registrationError = action.payload;
    },

    loggingInErrorChanged: (state, action: PayloadAction<string | null>) => {
      state.loggingInError = action.payload;
    },

    loggingOutErrorChanged: (state, action: PayloadAction<string | null>) => {
      state.loggingOutError = action.payload;
    },

    loggingOutSucceedMessageChanged: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loggingOutSucceedMessage = action.payload;
    },

    accountFetchingErrorChanged: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.accountFethingError = action.payload;
    },

    accountEditingErrorChanged: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.accountEditingError = action.payload;
    },

    accountEditingSucceedMessageChanged: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.accountEditingSucceedMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isRegistering = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registrationError = null;
        state.registrationFieldsErrors = null;
        state.isRegistering = false;
        state.account = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isRegistering = false;
        if (action.payload) {
          state.registrationFieldsErrors = action.payload;
        } else {
          state.registrationError = action.error.message ?? null;
        }
      })

      .addCase(logIn.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loggingInError = null;
        state.loggingInFieldsErrors = null;
        state.isLoggingIn = false;
        state.token = action.payload.key;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoggingIn = false;
        if (action.payload) {
          if (action.payload.non_field_errors?.length) {
            state.loggingInError = action.payload.non_field_errors[0];
          }

          state.loggingInFieldsErrors = action.payload;
        } else {
          state.loggingInError = action.error.message ?? null;
        }
      })

      .addCase(logOut.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.isLoggingOut = false;
        state.loggingOutError = null;
        state.loggingOutSucceedMessage = action.payload.detail;
        state.account = null;
        state.token = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.isLoggingOut = false;
        state.loggingOutError = action.error.message ?? null;
      })

      .addCase(getAccount.pending, (state) => {
        state.isAccountFetching = true;
      })
      .addCase(getAccount.fulfilled, (state, action) => {
        state.isAccountFetching = false;
        state.account = action.payload;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.accountFethingError = null;
        state.isAccountFetching = false;
        if (action.payload !== undefined) {
          state.accountFethingError = action.payload;
        } else {
          state.accountFethingError = action.error.message ?? null;
        }
      })

      .addCase(editAccount.pending, (state) => {
        state.isAccountEditing = true;
      })
      .addCase(editAccount.fulfilled, (state, action) => {
        state.accountEditingFieldsErrors = null;
        state.accountEditingError = null;
        state.isAccountEditing = false;
        state.accountEditingSucceedMessage = 'Changes applied successfully!';
        state.account = action.payload;
      })
      .addCase(editAccount.rejected, (state, action) => {
        state.isAccountEditing = false;
        if (action.payload) {
          if (action.payload.non_field_errors?.length) {
            state.accountEditingError = action.payload.non_field_errors[0];
          }

          state.accountEditingFieldsErrors = action.payload;
        } else {
          state.accountEditingError = action.error.message ?? null;
        }
      });
  },
});

export const {
  registrationErrorChanged,
  loggingInErrorChanged,
  loggingOutSucceedMessageChanged,
  accountFetchingErrorChanged,
  loggingOutErrorChanged,
  accountEditingErrorChanged,
  accountEditingSucceedMessageChanged,
} = authSlice.actions;

export default authSlice.reducer;
