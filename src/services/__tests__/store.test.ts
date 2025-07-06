import store, { RootState } from '../store';
import { addIngredient, removeIngredient, clearConstructor, swapIngredients } from '../store';

describe('Redux Store Integration Tests', () => {
  beforeEach(() => {
    // Очищаем store перед каждым тестом
    store.dispatch(clearConstructor());
  });

  describe('RootReducer Initialization', () => {
    it('должен правильно инициализировать rootReducer', () => {
      const state = store.getState();
      
      expect(state).toHaveProperty('ingredients');
      expect(state).toHaveProperty('burgerConstructor');
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('orders');
      
      expect(state.ingredients).toEqual({
        items: [],
        isLoading: false,
        error: null
      });
      
      expect(state.burgerConstructor).toEqual({
        bun: null,
        ingredients: []
      });
      
      expect(state.user).toEqual({
        user: null,
        isAuth: false,
        isLoading: false,
        error: null
      });

      expect(state.orders).toEqual({
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
  });

  describe('Интеграционные тесты конструктора', () => {
    const mockBun = {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun' as const,
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    };

    const mockMainIngredient = {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main' as const,
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0
    };

    it('должен правильно обрабатывать полный цикл создания заказа', () => {
      // 1. Добавляем ингредиенты
      store.dispatch(addIngredient(mockBun));
      store.dispatch(addIngredient(mockMainIngredient));
      
      let state = store.getState();
      expect(state.burgerConstructor.bun).toBeTruthy();
      expect(state.burgerConstructor.ingredients).toHaveLength(1);
      
      // 2. Создаем заказ
      store.dispatch({
        type: 'orders/createOrder/fulfilled',
        payload: { order: { number: 12345 }, name: 'Тестовый заказ' }
      });
      
      state = store.getState();
      expect(state.orders.currentOrder).toEqual({ number: 12345 });
      
      // 3. Очищаем конструктор после заказа
      store.dispatch(clearConstructor());
      
      state = store.getState();
      expect(state.burgerConstructor.bun).toBeNull();
      expect(state.burgerConstructor.ingredients).toHaveLength(0);
    });

    it('должен правильно обрабатывать ошибки при создании заказа', () => {
      // Добавляем ингредиенты
      store.dispatch(addIngredient(mockBun));
      
      // Симулируем ошибку при создании заказа
      store.dispatch({
        type: 'orders/createOrder/rejected',
        payload: 'Ошибка оформления заказа'
      });
      
      const state = store.getState();
      expect(state.orders.error).toBe('Ошибка оформления заказа');
      expect(state.orders.currentOrder).toBe(null);
      // Конструктор должен остаться неизменным
      expect(state.burgerConstructor.bun).toBeTruthy();
    });
  });

  describe('Интеграционные тесты пользователя', () => {
    it('должен правильно обрабатывать аутентификацию пользователя', () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
      };
      
      // Логин пользователя
      store.dispatch({
        type: 'user/login/fulfilled',
        payload: mockUser
      });
      
      let state = store.getState();
      expect(state.user.user).toEqual(mockUser);
      expect(state.user.isAuth).toBe(true);
      
      // Обновление пользователя
      const updatedUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };
      
      store.dispatch({
        type: 'user/updateUser/fulfilled',
        payload: updatedUser
      });
      
      state = store.getState();
      expect(state.user.user).toEqual(updatedUser);
      expect(state.user.isAuth).toBe(true);
      
      // Логаут пользователя
      store.dispatch({
        type: 'user/logout/fulfilled'
      });
      
      state = store.getState();
      expect(state.user.user).toBe(null);
      expect(state.user.isAuth).toBe(false);
    });
  });

  describe('Интеграционные тесты загрузки данных', () => {
    it('должен правильно обрабатывать загрузку ингредиентов и создание заказа', () => {
      const mockIngredients = [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun' as const,
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          __v: 0
        }
      ];
      
      // Загружаем ингредиенты
      store.dispatch({
        type: 'ingredients/fetchIngredients/fulfilled',
        payload: mockIngredients
      });
      
      let state = store.getState();
      expect(state.ingredients.items).toEqual(mockIngredients);
      expect(state.ingredients.isLoading).toBe(false);
      
      // Добавляем ингредиент в конструктор
      store.dispatch(addIngredient(mockIngredients[0]));
      
      state = store.getState();
      expect(state.burgerConstructor.bun).toBeTruthy();
      
      // Создаем заказ
      store.dispatch({
        type: 'orders/createOrder/fulfilled',
        payload: { order: { number: 12345 }, name: 'Тестовый заказ' }
      });
      
      state = store.getState();
      expect(state.orders.currentOrder).toEqual({ number: 12345 });
    });
  });
}); 
 