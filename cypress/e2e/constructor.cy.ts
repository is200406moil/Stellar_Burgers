/// <reference types="cypress" />

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем запросы к API с использованием мок-данных
    // @ts-ignore - Cypress types not properly recognized
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    // @ts-ignore - Cypress types not properly recognized
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');
    // @ts-ignore - Cypress types not properly recognized
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Устанавливаем токен авторизации
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'test-access-token');
    });
    
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

  it('Добавление ингредиента в конструктор', () => {
    // Ждем появления ингредиентов
    cy.get('ul li', { timeout: 20000 }).should('have.length.greaterThan', 0);
    
    // Ищем ингредиенты по тексту
    cy.contains('Краторная булка N-200i', { timeout: 15000 }).should('be.visible');
    
    // Добавляем булку через кнопку "Добавить"
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').click();
    
    // Добавляем начинку
    cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').contains('Добавить').click();
    
    // Проверяем, что ингредиенты добавлены в конструктор
    cy.get('section').should('contain', 'Краторная булка N-200i');
    cy.get('section').should('contain', 'Биокотлета из марсианской Магнолии');
  });
}); 
