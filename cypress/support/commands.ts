/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Кастомные команды для работы с токенами авторизации
Cypress.Commands.add('setAuthTokens', () => {
  // Устанавливаем фейковые токены авторизации
  cy.window().then((win) => {
    win.localStorage.setItem('accessToken', 'fake-access-token-12345');
    win.localStorage.setItem('refreshToken', 'fake-refresh-token-67890');
  });
  
  // Устанавливаем cookies для авторизации
  cy.setCookie('accessToken', 'fake-access-token-12345');
  cy.setCookie('refreshToken', 'fake-refresh-token-67890');
});

Cypress.Commands.add('clearAuthTokens', () => {
  // Очищаем токены из localStorage
  cy.window().then((win) => {
    win.localStorage.removeItem('accessToken');
    win.localStorage.removeItem('refreshToken');
  });
  
  // Очищаем cookies
  cy.clearCookie('accessToken');
  cy.clearCookie('refreshToken');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
      setAuthTokens(): Chainable<void>
      clearAuthTokens(): Chainable<void>
    }
  }
}
