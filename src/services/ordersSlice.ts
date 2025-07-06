import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi,
  orderBurgerApi
} from '../utils/burger-api';

interface OrdersState {
  feed: TOrder[];
  userOrders: TOrder[];
  orderByNumber: TOrder | null;
  currentOrder: { number: number } | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  feed: [],
  userOrders: [],
  orderByNumber: null,
  currentOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk(
  'orders/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return {
        orders: data.orders,
        total: data.total,
        totalToday: data.totalToday
      };
    } catch (e: any) {
      return rejectWithValue(e.message || 'Ошибка загрузки ленты заказов');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (e: any) {
      return rejectWithValue(
        e.message || 'Ошибка загрузки заказов пользователя'
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      return data.orders[0] || null;
    } catch (e: any) {
      return rejectWithValue(e.message || 'Ошибка загрузки заказа');
    }
  }
);

export const orderBurgerThunk = createAsyncThunk<
  { order: { number: number }; name: string },
  string[],
  { rejectValue: string }
>('orders/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const res = await orderBurgerApi(ingredientIds);
    if (res.success && res.order) return res;
    return rejectWithValue('Ошибка оформления заказа');
  } catch {
    return rejectWithValue('Ошибка оформления заказа');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderByNumber(state) {
      state.orderByNumber = null;
    },
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(orderBurgerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.error = null;
      })
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentOrder = null;
      });
  }
});

export const { clearOrderByNumber, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
