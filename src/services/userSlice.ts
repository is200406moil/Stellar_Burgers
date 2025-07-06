import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
  registerUserApi
} from '../utils/burger-api';
import { TUser } from '../utils/types';

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      if (res.success && res.user) return res.user;
      return rejectWithValue('Not authorized');
    } catch {
      return rejectWithValue('Not authorized');
    }
  }
);

export const loginUserThunk = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(data);
    if (res.success && res.user && res.accessToken && res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
      document.cookie = `accessToken=${res.accessToken}`;
      return res.user;
    }
    return rejectWithValue('Login failed');
  } catch {
    return rejectWithValue('Login failed');
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    document.cookie = 'accessToken=; Max-Age=0';
    return;
  } catch {
    return rejectWithValue('Logout failed');
  }
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<{ name: string; email: string; password: string }>,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(data);
    if (res.success && res.user) return res.user;
    return rejectWithValue('Ошибка обновления профиля');
  } catch {
    return rejectWithValue('Ошибка обновления профиля');
  }
});

export const registerUserThunk = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    if (res.success && res.user && res.accessToken && res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
      document.cookie = `accessToken=${res.accessToken}`;
      return res.user;
    }
    return rejectWithValue('Registration failed');
  } catch {
    return rejectWithValue('Registration failed');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null as TUser | null,
    isAuth: false,
    isLoading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
        state.error = action.payload || 'Not authorized';
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.error = action.payload || 'Logout failed';
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка обновления профиля';
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
        state.error = action.payload || 'Registration failed';
      });
  }
});

export default userSlice.reducer;
