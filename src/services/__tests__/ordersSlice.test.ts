import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  fetchFeed,
  fetchUserOrders,
  fetchOrderByNumber,
  orderBurgerThunk,
  clearOrderByNumber,
  clearCurrentOrder
} from '../ordersSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      orders: ordersReducer
    }
  });

describe('Orders Slice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('должен правильно инициализировать состояние', () => {
    const state = store.getState().orders;
    expect(state).toEqual({
      feed: [],
      userOrders: [],
      orderByNumber: null,
      currentOrder: null,
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  describe('fetchFeed', () => {
    it('должен обрабатывать fetchFeed.pending', () => {
      store.dispatch({ type: fetchFeed.pending.type });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchFeed.fulfilled', () => {
      const mockOrders = [
        {
          _id: '1',
          ingredients: ['643d69a5c3f7b9001cfa093c'],
          status: 'done',
          name: 'Тестовый заказ',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          number: 1
        }
      ];

      const mockPayload = {
        orders: mockOrders,
        total: 100,
        totalToday: 25
      };

      store.dispatch({
        type: fetchFeed.fulfilled.type,
        payload: mockPayload
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.feed).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(25);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchFeed.rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';

      store.dispatch({
        type: fetchFeed.rejected.type,
        payload: errorMessage
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.feed).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });

  describe('fetchUserOrders', () => {
    it('должен обрабатывать fetchUserOrders.pending', () => {
      store.dispatch({ type: fetchUserOrders.pending.type });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchUserOrders.fulfilled', () => {
      const mockUserOrders = [
        {
          _id: '1',
          ingredients: ['643d69a5c3f7b9001cfa093c'],
          status: 'done',
          name: 'Заказ пользователя',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          number: 1
        }
      ];

      store.dispatch({
        type: fetchUserOrders.fulfilled.type,
        payload: mockUserOrders
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.userOrders).toEqual(mockUserOrders);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchUserOrders.rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов пользователя';

      store.dispatch({
        type: fetchUserOrders.rejected.type,
        payload: errorMessage
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.userOrders).toEqual([]);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('должен обрабатывать fetchOrderByNumber.pending', () => {
      store.dispatch({ type: fetchOrderByNumber.pending.type });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchOrderByNumber.fulfilled', () => {
      const mockOrder = {
        _id: '1',
        ingredients: ['643d69a5c3f7b9001cfa093c'],
        status: 'done',
        name: 'Заказ по номеру',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        number: 12345
      };

      store.dispatch({
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.orderByNumber).toEqual(mockOrder);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchOrderByNumber.rejected', () => {
      const errorMessage = 'Ошибка загрузки заказа';

      store.dispatch({
        type: fetchOrderByNumber.rejected.type,
        payload: errorMessage
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orderByNumber).toBe(null);
    });
  });

  describe('orderBurgerThunk', () => {
    it('должен обрабатывать orderBurgerThunk.pending', () => {
      store.dispatch({ type: orderBurgerThunk.pending.type });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать orderBurgerThunk.fulfilled', () => {
      const mockOrderResponse = {
        order: { number: 12345 },
        name: 'Тестовый заказ'
      };

      store.dispatch({
        type: orderBurgerThunk.fulfilled.type,
        payload: mockOrderResponse
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual({ number: 12345 });
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать orderBurgerThunk.rejected', () => {
      const errorMessage = 'Ошибка оформления заказа';

      store.dispatch({
        type: orderBurgerThunk.rejected.type,
        payload: errorMessage
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentOrder).toBe(null);
    });
  });

  describe('clearOrderByNumber', () => {
    it('должен очищать orderByNumber', () => {
      // Сначала устанавливаем orderByNumber
      const mockOrder = {
        _id: '1',
        ingredients: ['643d69a5c3f7b9001cfa093c'],
        status: 'done',
        name: 'Заказ',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        number: 1
      };

      store.dispatch({
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      });

      let state = store.getState().orders;
      expect(state.orderByNumber).toBeTruthy();

      // Очищаем orderByNumber
      store.dispatch(clearOrderByNumber());

      state = store.getState().orders;
      expect(state.orderByNumber).toBeNull();
    });
  });

  describe('clearCurrentOrder', () => {
    it('должен очищать currentOrder', () => {
      // Сначала устанавливаем currentOrder
      store.dispatch({
        type: orderBurgerThunk.fulfilled.type,
        payload: { order: { number: 12345 }, name: 'Тест' }
      });

      let state = store.getState().orders;
      expect(state.currentOrder).toBeTruthy();

      // Очищаем currentOrder
      store.dispatch(clearCurrentOrder());

      state = store.getState().orders;
      expect(state.currentOrder).toBeNull();
    });
  });

  describe('Комбинированные сценарии', () => {
    it('должен правильно обрабатывать последовательные запросы', () => {
      // Первый запрос - pending
      store.dispatch({ type: fetchFeed.pending.type });
      let state = store.getState().orders;
      expect(state.isLoading).toBe(true);

      // Первый запрос - fulfilled
      store.dispatch({
        type: fetchFeed.fulfilled.type,
        payload: { orders: [], total: 0, totalToday: 0 }
      });
      state = store.getState().orders;
      expect(state.isLoading).toBe(false);

      // Второй запрос - pending
      store.dispatch({ type: orderBurgerThunk.pending.type });
      state = store.getState().orders;
      expect(state.isLoading).toBe(true);

      // Второй запрос - fulfilled
      store.dispatch({
        type: orderBurgerThunk.fulfilled.type,
        payload: { order: { number: 12345 }, name: 'Тест' }
      });
      state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual({ number: 12345 });
    });

    it('должен правильно обрабатывать ошибки в последовательных запросах', () => {
      // Первый запрос успешен
      store.dispatch({
        type: fetchFeed.fulfilled.type,
        payload: { orders: [], total: 0, totalToday: 0 }
      });

      // Второй запрос с ошибкой
      store.dispatch({
        type: orderBurgerThunk.rejected.type,
        payload: 'Ошибка оформления заказа'
      });

      const state = store.getState().orders;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка оформления заказа');
      expect(state.currentOrder).toBe(null);
      // feed должен остаться неизменным
      expect(state.feed).toEqual([]);
    });
  });
});
