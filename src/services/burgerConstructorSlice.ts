import { createSlice } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../utils/types';
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
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
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

export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  swapIngredients
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
