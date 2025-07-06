import { configureStore } from '@reduxjs/toolkit';
import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  swapIngredients
} from '../burgerConstructorSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      burgerConstructor: burgerConstructorReducer
    }
  });

describe('Burger Constructor Slice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('должен правильно инициализировать состояние', () => {
    const state = store.getState().burgerConstructor;
    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен обрабатывать добавление булки', () => {
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

    store.dispatch(addIngredient(mockBun));

    const state = store.getState().burgerConstructor;
    expect(state.bun).toBeTruthy();
    expect(state.bun?.name).toBe('Краторная булка N-200i');
    expect(state.bun?.type).toBe('bun');
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать добавление начинки', () => {
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

    store.dispatch(addIngredient(mockMainIngredient));

    const state = store.getState().burgerConstructor;
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe(
      'Биокотлета из марсианской Магнолии'
    );
    expect(state.ingredients[0].type).toBe('main');
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('должен обрабатывать добавление соуса', () => {
    const mockSauce = {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Соус фирменный Space Sauce',
      type: 'sauce' as const,
      proteins: 50,
      fat: 22,
      carbohydrates: 11,
      calories: 14,
      price: 80,
      image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
      __v: 0
    };

    store.dispatch(addIngredient(mockSauce));

    const state = store.getState().burgerConstructor;
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Соус фирменный Space Sauce');
    expect(state.ingredients[0].type).toBe('sauce');
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('должен обрабатывать добавление нескольких ингредиентов', () => {
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

    const mockSauce = {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Соус фирменный Space Sauce',
      type: 'sauce' as const,
      proteins: 50,
      fat: 22,
      carbohydrates: 11,
      calories: 14,
      price: 80,
      image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
      __v: 0
    };

    // Добавляем булку
    store.dispatch(addIngredient(mockBun));
    let state = store.getState().burgerConstructor;
    expect(state.bun).toBeTruthy();
    expect(state.ingredients).toHaveLength(0);

    // Добавляем начинку
    store.dispatch(addIngredient(mockMainIngredient));
    state = store.getState().burgerConstructor;
    expect(state.bun).toBeTruthy();
    expect(state.ingredients).toHaveLength(1);

    // Добавляем соус
    store.dispatch(addIngredient(mockSauce));
    state = store.getState().burgerConstructor;
    expect(state.bun).toBeTruthy();
    expect(state.ingredients).toHaveLength(2);
  });

  it('должен обрабатывать удаление ингредиента', () => {
    const mockIngredient = {
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

    // Добавляем ингредиент
    store.dispatch(addIngredient(mockIngredient));
    const stateAfterAdd = store.getState().burgerConstructor;
    const ingredientId = stateAfterAdd.ingredients[0].id;

    // Удаляем ингредиент
    store.dispatch(removeIngredient(ingredientId));

    const stateAfterRemove = store.getState().burgerConstructor;
    expect(stateAfterRemove.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать изменение порядка ингредиентов', () => {
    const mockIngredient1 = {
      _id: '1',
      name: 'Ингредиент 1',
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
    };

    const mockIngredient2 = {
      _id: '2',
      name: 'Ингредиент 2',
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
    };

    // Добавляем два ингредиента
    store.dispatch(addIngredient(mockIngredient1));
    store.dispatch(addIngredient(mockIngredient2));

    const stateAfterAdd = store.getState().burgerConstructor;
    expect(stateAfterAdd.ingredients).toHaveLength(2);

    // Меняем порядок (перемещаем первый элемент на позицию 1)
    store.dispatch(swapIngredients({ from: 0, to: 1 }));

    const stateAfterSwap = store.getState().burgerConstructor;
    expect(stateAfterSwap.ingredients).toHaveLength(2);
    // Проверяем, что порядок изменился
    expect(stateAfterSwap.ingredients[0].name).toBe('Ингредиент 2');
    expect(stateAfterSwap.ingredients[1].name).toBe('Ингредиент 1');
  });

  it('должен очищать конструктор', () => {
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

    const mockIngredient = {
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

    // Добавляем ингредиенты
    store.dispatch(addIngredient(mockBun));
    store.dispatch(addIngredient(mockIngredient));

    const stateAfterAdd = store.getState().burgerConstructor;
    expect(stateAfterAdd.bun).toBeTruthy();
    expect(stateAfterAdd.ingredients).toHaveLength(1);

    // Очищаем конструктор
    store.dispatch(clearConstructor());

    const stateAfterClear = store.getState().burgerConstructor;
    expect(stateAfterClear.bun).toBeNull();
    expect(stateAfterClear.ingredients).toHaveLength(0);
  });

  it('должен заменять булку при добавлении новой', () => {
    const mockBun1 = {
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
    };

    const mockBun2 = {
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
    };

    // Добавляем первую булку
    store.dispatch(addIngredient(mockBun1));
    let state = store.getState().burgerConstructor;
    expect(state.bun?.name).toBe('Булка 1');

    // Добавляем вторую булку (должна заменить первую)
    store.dispatch(addIngredient(mockBun2));
    state = store.getState().burgerConstructor;
    expect(state.bun?.name).toBe('Булка 2');
    expect(state.bun?.id).not.toBe(state.bun?._id); // id должен быть уникальным
  });

  it('должен генерировать уникальные id для ингредиентов', () => {
    const mockIngredient = {
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

    // Добавляем один и тот же ингредиент дважды
    store.dispatch(addIngredient(mockIngredient));
    store.dispatch(addIngredient(mockIngredient));

    const state = store.getState().burgerConstructor;
    expect(state.ingredients).toHaveLength(2);

    // Проверяем, что id разные
    const id1 = state.ingredients[0].id;
    const id2 = state.ingredients[1].id;
    expect(id1).not.toBe(id2);
    expect(id1).not.toBe(mockIngredient._id);
    expect(id2).not.toBe(mockIngredient._id);
  });
});
