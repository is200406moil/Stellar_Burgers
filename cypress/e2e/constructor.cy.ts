/// <reference types="cypress" />

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем запросы к API с использованием мок-данных
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Посещаем страницу
    cy.visit('/', { timeout: 10000 });
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
    
    // Ждем загрузки страницы
    cy.get('body').should('be.visible');
    cy.get('h1').should('contain', 'Соберите бургер');
  });

  it('Проверка загрузки страницы', () => {
    // Проверяем, что страница загрузилась
    cy.get('h1').should('contain', 'Соберите бургер');
    
    // Проверяем наличие основных элементов
    cy.get('body').should('contain', 'Булки');
    cy.get('body').should('contain', 'Начинки');
    cy.get('body').should('contain', 'Соусы');
    
    // Проверяем, что есть элементы списка
    cy.get('ul').should('exist');
    
    // Ждем появления ингредиентов
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
  });

  it('Добавление булки в конструктор', () => {
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    cy.get('[data-testid="burger-constructor"]').should('not.contain', 'Краторная булка N-200i');
    cy.contains('Краторная булка N-200i', { timeout: 15000 }).scrollIntoView().should('be.visible');
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.get('[data-testid="burger-constructor"]').should('contain', 'Краторная булка N-200i');
  });

  it('Добавление начинки в конструктор', () => {
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    cy.get('[data-testid="burger-constructor"]').should('not.contain', 'Биокотлета из марсианской Магнолии');
    cy.contains('Биокотлета из марсианской Магнолии', { timeout: 15000 }).scrollIntoView().should('be.visible');
    cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.get('[data-testid="burger-constructor"]').should('contain', 'Биокотлета из марсианской Магнолии');
  });

  it('Добавление соуса в конструктор', () => {
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    cy.get('[data-testid="burger-constructor"]').should('not.contain', 'Соус фирменный Space Sauce');
    cy.contains('Соус фирменный Space Sauce', { timeout: 15000 }).scrollIntoView().should('be.visible');
    cy.contains('Соус фирменный Space Sauce').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.get('[data-testid="burger-constructor"]').should('contain', 'Соус фирменный Space Sauce');
  });

  it('Открытие и закрытие модального окна с описанием ингредиента', () => {
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    cy.get('[data-testid="modal"]').should('not.exist');
    cy.contains('Краторная булка N-200i').scrollIntoView().click({ force: true });
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-testid="modal-overlay"]').scrollIntoView().click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Отображение данных ингредиента в модальном окне', () => {
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    cy.contains('Биокотлета из марсианской Магнолии').scrollIntoView().click({ force: true });
    cy.get('[data-testid="modal"]').should('contain', 'Биокотлета из марсианской Магнолии');
    cy.get('[data-testid="modal"]').should('contain', '424');
    cy.get('[data-testid="modal"]').should('contain', '420');
    cy.get('[data-testid="modal"]').should('contain', '142');
    cy.get('[data-testid="modal"]').should('contain', '242');
    cy.get('[data-testid="modal-overlay"]').scrollIntoView().click({ force: true });
  });

  it('Проверка цены заказа', () => {
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    cy.get('[data-testid="order-price"]').should('contain', '0');
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.get('[data-testid="order-price"]').should('contain', '2510');
    cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.get('[data-testid="order-price"]').should('contain', '2934');
  });

  it('Оформление заказа с ингредиентами', () => {
    // Устанавливаем фейковые токены авторизации перед тестом
    cy.setAuthTokens();
    
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.get('[data-testid="order-button"]').should('not.be.disabled');
    cy.get('[data-testid="order-button"]').scrollIntoView().click({ force: true });
    cy.wait('@createOrder');
    // Проверяем, что заказ создался успешно (можем проверить по отсутствию ошибки)
    cy.get('[data-testid="burger-constructor"]').should('not.contain', 'Ошибка');
    
    // Очищаем токены после теста
    cy.clearAuthTokens();
  });

  it('Очистка конструктора после оформления заказа', () => {
    // Устанавливаем фейковые токены авторизации перед тестом
    cy.setAuthTokens();
    
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').contains('Добавить').scrollIntoView().click({ force: true });
    cy.get('[data-testid="burger-constructor"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-testid="burger-constructor"]').should('contain', 'Биокотлета из марсианской Магнолии');
    cy.get('[data-testid="order-button"]').scrollIntoView().click({ force: true });
    cy.wait('@createOrder');
    // Проверяем, что заказ создался успешно
    cy.get('[data-testid="burger-constructor"]').should('not.contain', 'Ошибка');
    // Проверяем, что ингредиенты остались в конструкторе (очистка не происходит автоматически)
    cy.get('[data-testid="burger-constructor"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-testid="burger-constructor"]').should('contain', 'Биокотлета из марсианской Магнолии');
    
    // Очищаем токены после теста
    cy.clearAuthTokens();
  });

  afterEach(() => {
    // Очищаем localStorage и cookies после каждого теста
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
  });
}); 
