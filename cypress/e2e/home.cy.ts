import { CV_LINK_NAME, CV_PATH, FEATURED_SLUGS, LOCALES, OWNER_NAME } from '../support/constants';

describe('Inicio', () => {
  const caseNumber = { en: 'CP-01', es: 'CP-02' } as const;

  LOCALES.forEach((locale) => {
    it(`${caseNumber[locale]} /${locale}: el hero muestra el nombre y el CV del idioma`, () => {
      cy.visit(`/${locale}`);
      cy.get('main').within(() => {
        cy.get('h1').should('have.length', 1).and('have.text', OWNER_NAME);
        cy.contains('a', CV_LINK_NAME).should('have.attr', 'href', CV_PATH[locale]);
      });
    });
  });

  it('CP-03 las 5 tarjetas de casos destacados navegan a su caso', () => {
    FEATURED_SLUGS.forEach((slug) => {
      cy.visit('/en');
      cy.get('#projects').find(`a[href="/en/projects/${slug}"]`).first().click();
      cy.location('pathname').should('eq', `/en/projects/${slug}`);
      cy.get('h1').should('have.length', 1).and('be.visible');
    });
  });
});
