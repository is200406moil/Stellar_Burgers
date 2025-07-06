import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      ingredients: ingredientsReducer
    }
  });
};

describe('Ingredients Slice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('должен правильно инициализировать состояние', () => {
    const state = store.getState().ingredients;
    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  it('должен обрабатывать fetchIngredients.pending', () => {
    store.dispatch({ type: fetchIngredients.pending.type });
    
    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
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
      },
      {
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
      }
    ];

    store.dispatch({
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBe(null);
  });

  it('должен обрабатывать fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    
    store.dispatch({
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    });

    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.items).toEqual([]);
  });

  it('должен фильтровать ингредиенты по типу', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun' as const,
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'test.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png',
        __v: 0
      },
      {
        _id: '2',
        name: 'Начинка',
        type: 'main' as const,
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'test.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png',
        __v: 0
      },
      {
        _id: '3',
        name: 'Соус',
        type: 'sauce' as const,
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'test.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png',
        __v: 0
      }
    ];

    store.dispatch({
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    const state = store.getState().ingredients;
    const buns = state.items.filter(item => item.type === 'bun');
    const mains = state.items.filter(item => item.type === 'main');
    const sauces = state.items.filter(item => item.type === 'sauce');

    expect(buns).toHaveLength(1);
    expect(buns[0].name).toBe('Булка');
    expect(mains).toHaveLength(1);
    expect(mains[0].name).toBe('Начинка');
    expect(sauces).toHaveLength(1);
    expect(sauces[0].name).toBe('Соус');
  });

  it('должен обрабатывать последовательные запросы', () => {
    // Первый запрос - pending
    store.dispatch({ type: fetchIngredients.pending.type });
    let state = store.getState().ingredients;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);

    // Первый запрос - fulfilled
    const mockIngredients1 = [
      {
        _id: '1',
        name: 'Булка 1',
        type: 'bun' as const,
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'test.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png',
        __v: 0
      }
    ];

    store.dispatch({
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients1
    });

    state = store.getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients1);
    expect(state.error).toBe(null);

    // Второй запрос - pending
    store.dispatch({ type: fetchIngredients.pending.type });
    state = store.getState().ingredients;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);

    // Второй запрос - fulfilled с новыми данными
    const mockIngredients2 = [
      {
        _id: '2',
        name: 'Булка 2',
        type: 'bun' as const,
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'test.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png',
        __v: 0
      }
    ];

    store.dispatch({
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients2
    });

    state = store.getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients2);
    expect(state.error).toBe(null);
  });

  it('должен обрабатывать ошибку после успешного запроса', () => {
    // Сначала успешный запрос
    const mockIngredients = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun' as const,
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'test.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png',
        __v: 0
      }
    ];

    store.dispatch({
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    let state = store.getState().ingredients;
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBe(null);

    // Затем запрос с ошибкой
    const errorMessage = 'Ошибка сети';
    store.dispatch({
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    });

    state = store.getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    // Данные должны остаться от предыдущего успешного запроса
    expect(state.items).toEqual(mockIngredients);
  });
}); 
