import store, { RootState } from '../store';
import { addIngredient, removeIngredient, clearConstructor, swapIngredients } from '../store';

describe('Redux Store Tests', () => {
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
    });
  });

  describe('Constructor Slice', () => {
    const mockIngredient = {
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
      ...mockIngredient,
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main' as const
    };

    it('должен обрабатывать добавление ингредиента', () => {
      store.dispatch(addIngredient(mockIngredient));
      
      const newState = store.getState().burgerConstructor;
      expect(newState.bun).toBeTruthy();
      expect(newState.bun?.name).toBe('Краторная булка N-200i');
      expect(newState.bun?.type).toBe('bun');
    });

    it('должен обрабатывать добавление начинки', () => {
      store.dispatch(addIngredient(mockMainIngredient));
      
      const newState = store.getState().burgerConstructor;
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
      expect(newState.ingredients[0].type).toBe('main');
    });

    it('должен обрабатывать удаление ингредиента', () => {
      // Сначала добавляем ингредиент
      store.dispatch(addIngredient(mockMainIngredient));
      const stateAfterAdd = store.getState().burgerConstructor;
      const ingredientId = stateAfterAdd.ingredients[0].id;
      
      // Затем удаляем
      store.dispatch(removeIngredient(ingredientId));
      
      const newState = store.getState().burgerConstructor;
      expect(newState.ingredients).toHaveLength(0);
    });

    it('должен обрабатывать изменение порядка ингредиентов', () => {
      // Добавляем два ингредиента
      store.dispatch(addIngredient(mockMainIngredient));
      store.dispatch(addIngredient({
        ...mockMainIngredient,
        _id: '643d69a5c3f7b9001cfa093e',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce' as const
      }));
      
      const stateAfterAdd = store.getState().burgerConstructor;
      expect(stateAfterAdd.ingredients).toHaveLength(2);
      
      // Меняем порядок (перемещаем первый элемент на позицию 1)
      store.dispatch(swapIngredients({ from: 0, to: 1 }));
      
      const newState = store.getState().burgerConstructor;
      expect(newState.ingredients).toHaveLength(2);
      // Проверяем, что порядок изменился
      expect(newState.ingredients[0].name).toBe('Соус фирменный Space Sauce');
      expect(newState.ingredients[1].name).toBe('Биокотлета из марсианской Магнолии');
    });

    it('должен очищать конструктор', () => {
      // Добавляем ингредиенты
      store.dispatch(addIngredient(mockIngredient));
      store.dispatch(addIngredient(mockMainIngredient));
      
      const stateAfterAdd = store.getState().burgerConstructor;
      expect(stateAfterAdd.bun).toBeTruthy();
      expect(stateAfterAdd.ingredients).toHaveLength(1);
      
      // Очищаем
      store.dispatch(clearConstructor());
      
      const newState = store.getState().burgerConstructor;
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(0);
    });
  });

  describe('Ingredients Slice', () => {
    beforeEach(() => {
      // Очищаем состояние ingredients перед каждым тестом
      store.dispatch({ type: 'ingredients/fetchIngredients/fulfilled', payload: [] });
    });

    it('должен обрабатывать экшен Request (pending)', () => {
      const initialState = store.getState().ingredients;
      expect(initialState.isLoading).toBe(false);
      
      // Диспатчим pending экшен
      store.dispatch({ type: 'ingredients/fetchIngredients/pending' });
      
      const newState = store.getState().ingredients;
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBe(null);
    });

    it('должен обрабатывать экшен Success (fulfilled)', () => {
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
      
      // Диспатчим fulfilled экшен
      store.dispatch({
        type: 'ingredients/fetchIngredients/fulfilled',
        payload: mockIngredients
      });
      
      const newState = store.getState().ingredients;
      expect(newState.isLoading).toBe(false);
      expect(newState.items).toEqual(mockIngredients);
      expect(newState.error).toBe(null);
    });

    it('должен обрабатывать экшен Failed (rejected)', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      
      // Диспатчим rejected экшен
      store.dispatch({
        type: 'ingredients/fetchIngredients/rejected',
        error: { message: errorMessage }
      });
      
      const newState = store.getState().ingredients;
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.items).toEqual([]);
    });
  });
}); 
 