import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  fetchUser,
  loginUserThunk,
  logoutUserThunk,
  updateUserThunk,
  registerUserThunk
} from '../userSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

describe('User Slice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    // Очищаем localStorage и cookies перед каждым тестом
    localStorage.clear();
    document.cookie = '';
  });

  it('должен правильно инициализировать состояние', () => {
    const state = store.getState().user;
    expect(state).toEqual({
      user: null,
      isAuth: false,
      isLoading: false,
      error: null
    });
  });

  describe('fetchUser', () => {
    it('должен обрабатывать fetchUser.pending', () => {
      store.dispatch({ type: fetchUser.pending.type });

      const state = store.getState().user;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchUser.fulfilled', () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
      };

      store.dispatch({
        type: fetchUser.fulfilled.type,
        payload: mockUser
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать fetchUser.rejected', () => {
      store.dispatch({
        type: fetchUser.rejected.type,
        payload: 'Not authorized'
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.user).toBe(null);
      expect(state.isAuth).toBe(false);
      expect(state.error).toBe('Not authorized');
    });
  });

  describe('loginUserThunk', () => {
    it('должен обрабатывать loginUserThunk.pending', () => {
      store.dispatch({ type: loginUserThunk.pending.type });

      const state = store.getState().user;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать loginUserThunk.fulfilled', () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
      };

      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: mockUser
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать loginUserThunk.rejected', () => {
      store.dispatch({
        type: loginUserThunk.rejected.type,
        payload: 'Login failed'
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.user).toBe(null);
      expect(state.isAuth).toBe(false);
      expect(state.error).toBe('Login failed');
    });
  });

  describe('logoutUserThunk', () => {
    it('должен обрабатывать logoutUserThunk.fulfilled', () => {
      // Сначала устанавливаем пользователя
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
      };

      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: mockUser
      });

      let state = store.getState().user;
      expect(state.user).toBeTruthy();
      expect(state.isAuth).toBe(true);

      // Выполняем logout
      store.dispatch({
        type: logoutUserThunk.fulfilled.type
      });

      state = store.getState().user;
      expect(state.user).toBe(null);
      expect(state.isAuth).toBe(false);
    });

    it('должен обрабатывать logoutUserThunk.rejected', () => {
      store.dispatch({
        type: logoutUserThunk.rejected.type,
        payload: 'Logout failed'
      });

      const state = store.getState().user;
      expect(state.error).toBe('Logout failed');
    });
  });

  describe('updateUserThunk', () => {
    it('должен обрабатывать updateUserThunk.pending', () => {
      store.dispatch({ type: updateUserThunk.pending.type });

      const state = store.getState().user;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать updateUserThunk.fulfilled', () => {
      const mockUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };

      store.dispatch({
        type: updateUserThunk.fulfilled.type,
        payload: mockUser
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать updateUserThunk.rejected', () => {
      store.dispatch({
        type: updateUserThunk.rejected.type,
        payload: 'Ошибка обновления профиля'
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка обновления профиля');
    });
  });

  describe('registerUserThunk', () => {
    it('должен обрабатывать registerUserThunk.pending', () => {
      store.dispatch({ type: registerUserThunk.pending.type });

      const state = store.getState().user;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать registerUserThunk.fulfilled', () => {
      const mockUser = {
        email: 'new@example.com',
        name: 'New User'
      };

      store.dispatch({
        type: registerUserThunk.fulfilled.type,
        payload: mockUser
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать registerUserThunk.rejected', () => {
      store.dispatch({
        type: registerUserThunk.rejected.type,
        payload: 'Registration failed'
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.user).toBe(null);
      expect(state.isAuth).toBe(false);
      expect(state.error).toBe('Registration failed');
    });
  });

  describe('Комбинированные сценарии', () => {
    it('должен правильно обрабатывать последовательность login -> update -> logout', () => {
      // Login
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
      };

      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: mockUser
      });

      let state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);

      // Update
      const updatedUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };

      store.dispatch({
        type: updateUserThunk.fulfilled.type,
        payload: updatedUser
      });

      state = store.getState().user;
      expect(state.user).toEqual(updatedUser);
      expect(state.isAuth).toBe(true);

      // Logout
      store.dispatch({
        type: logoutUserThunk.fulfilled.type
      });

      state = store.getState().user;
      expect(state.user).toBe(null);
      expect(state.isAuth).toBe(false);
    });

    it('должен правильно обрабатывать ошибки в последовательных операциях', () => {
      // Успешный login
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
      };

      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: mockUser
      });

      let state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);

      // Ошибка при update
      store.dispatch({
        type: updateUserThunk.rejected.type,
        payload: 'Ошибка обновления профиля'
      });

      state = store.getState().user;
      expect(state.error).toBe('Ошибка обновления профиля');
      // Пользователь должен остаться неизменным
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
    });

    it('должен правильно обрабатывать состояние загрузки', () => {
      // Начинаем загрузку
      store.dispatch({ type: fetchUser.pending.type });

      let state = store.getState().user;
      expect(state.isLoading).toBe(true);

      // Завершаем загрузку успешно
      store.dispatch({
        type: fetchUser.fulfilled.type,
        payload: { email: 'test@example.com', name: 'Test User' }
      });

      state = store.getState().user;
      expect(state.isLoading).toBe(false);

      // Начинаем новую загрузку
      store.dispatch({ type: updateUserThunk.pending.type });

      state = store.getState().user;
      expect(state.isLoading).toBe(true);
    });
  });

  describe('Проверка состояния аутентификации', () => {
    it('должен правильно устанавливать isAuth при успешных операциях', () => {
      // fetchUser успешен
      store.dispatch({
        type: fetchUser.fulfilled.type,
        payload: { email: 'test@example.com', name: 'Test User' }
      });

      let state = store.getState().user;
      expect(state.isAuth).toBe(true);

      // Очищаем состояние
      store.dispatch({
        type: fetchUser.rejected.type,
        payload: 'Not authorized'
      });

      state = store.getState().user;
      expect(state.isAuth).toBe(false);

      // login успешен
      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: { email: 'test@example.com', name: 'Test User' }
      });

      state = store.getState().user;
      expect(state.isAuth).toBe(true);

      // register успешен
      store.dispatch({
        type: registerUserThunk.fulfilled.type,
        payload: { email: 'new@example.com', name: 'New User' }
      });

      state = store.getState().user;
      expect(state.isAuth).toBe(true);
    });

    it('должен правильно сбрасывать isAuth при неудачных операциях', () => {
      // Сначала устанавливаем пользователя
      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: { email: 'test@example.com', name: 'Test User' }
      });

      let state = store.getState().user;
      expect(state.isAuth).toBe(true);

      // login неудачен
      store.dispatch({
        type: loginUserThunk.rejected.type,
        payload: 'Login failed'
      });

      state = store.getState().user;
      expect(state.isAuth).toBe(false);

      // register неудачен
      store.dispatch({
        type: registerUserThunk.rejected.type,
        payload: 'Registration failed'
      });

      state = store.getState().user;
      expect(state.isAuth).toBe(false);
    });
  });
});
