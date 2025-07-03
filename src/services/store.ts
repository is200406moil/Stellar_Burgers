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

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorSlice.reducer
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
