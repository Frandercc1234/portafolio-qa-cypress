import { MOBILE_MAX_WIDTH } from '../support/constants';

const isMobile = Cypress.config('viewportWidth') <= MOBILE_MAX_WIDTH;
const menuButton = () => cy.get('button[aria-controls="mobile-menu"]');

describe('Navegación', () => {
  beforeEach(() => {
    cy.visit('/en');
  });

  if (isMobile) {
    it('CP-08 menú móvil: abre, lleva a las anclas y cierra con Escape', () => {
      menuButton().should('have.attr', 'aria-expanded', 'false').click();
      menuButton().should('have.attr', 'aria-expanded', 'true');

      cy.get('#mobile-menu').contains('a', 'Experience').click();
      cy.location('hash').should('eq', '#experience');
      cy.get('#experience').should('be.visible');

      menuButton().click().should('have.attr', 'aria-expanded', 'true');
      cy.get('body').type('{esc}');
      menuButton().should('have.attr', 'aria-expanded', 'false');
      cy.get('#mobile-menu').should('not.exist');
    });
  } else {
    it('CP-08 en escritorio no hay botón de menú y la navegación está en línea', () => {
      menuButton().should('not.be.visible');
      cy.get('nav[aria-label="Main navigation"]').should('be.visible').within(() => {
        cy.contains('a', 'Projects').should('be.visible');
        cy.contains('a', 'Contact').should('be.visible');
      });
    });
  }
});
