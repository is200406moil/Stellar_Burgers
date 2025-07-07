import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './ingredientsSlice';
import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  swapIngredients
} from './burgerConstructorSlice';
import userReducer from './userSlice';
import ordersReducer, {
  fetchFeed,
  fetchUserOrders,
  fetchOrderByNumber,
  clearOrderByNumber,
  orderBurgerThunk,
  clearCurrentOrder
} from './ordersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer,
  orders: ordersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export { addIngredient, removeIngredient, clearConstructor, swapIngredients };
export { fetchFeed, fetchUserOrders, fetchOrderByNumber, clearOrderByNumber };
export { orderBurgerThunk, clearCurrentOrder };

export default store;
