import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// --- ingredientsSlice ---
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '../utils/types';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [] as TIngredient[],
    isLoading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

const ingredientsReducer = ingredientsSlice.reducer;
// --- END ingredientsSlice ---

// --- burgerConstructorSlice ---
import { TConstructorIngredient } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

const initialConstructorState = {
  bun: null as TConstructorIngredient | null,
  ingredients: [] as TConstructorIngredient[]
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialConstructorState,
  reducers: {
    addIngredient: (state, action) => {
      const ingredient: TIngredient = action.payload;
      const item: TConstructorIngredient = { ...ingredient, id: uuidv4() };
      if (ingredient.type === 'bun') {
        state.bun = item;
      } else {
        state.ingredients.push(item);
      }
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    swapIngredients: (state, action) => {
      const { from, to } = action.payload;
      const arr = state.ingredients;
      const [removed] = arr.splice(from, 1);
      arr.splice(to, 0, removed);
    }
  }
});

export const { addIngredient, removeIngredient, clearConstructor, swapIngredients } = burgerConstructorSlice.actions;
// --- END burgerConstructorSlice ---

// --- userSlice ---
import { getUserApi, loginUserApi, logoutApi, updateUserApi, registerUserApi } from '../utils/burger-api';
import { TUser } from '../utils/types';
import { orderBurgerApi } from '../utils/burger-api';

export const fetchUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const res = await getUserApi();
    if (res.success && res.user) return res.user;
    return rejectWithValue('Not authorized');
  } catch {
    return rejectWithValue('Not authorized');
  }
});

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

export const orderBurgerThunk = createAsyncThunk<
  { order: { number: number }; name: string },
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const res = await orderBurgerApi(ingredientIds);
    if (res.success && res.order) return res;
    return rejectWithValue('Ошибка оформления заказа');
  } catch {
    return rejectWithValue('Ошибка оформления заказа');
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
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
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
// --- END userSlice ---

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  user: userSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
