import { CASE_SECTIONS, SLUGS, type Locale } from '../support/constants';

describe('Casos', () => {
  const ids: Record<Locale, string> = { en: 'CP-04', es: 'CP-05' };

  (['en', 'es'] as const).forEach((locale) => {
    SLUGS.forEach((slug) => {
      it(`${ids[locale]} /${locale}/projects/${slug} carga con un solo h1 y sus secciones`, () => {
        cy.visit(`/${locale}/projects/${slug}`);
        cy.get('h1').should('have.length', 1).and('be.visible');
        cy.get('main h2').then(($h2) => {
          expect($h2.toArray().map((h) => h.textContent?.trim())).to.deep.eq(CASE_SECTIONS[locale]);
        });
      });
    });
  });

  it('CP-06 el selector de idioma conserva la ruta (en → es)', () => {
    cy.visit('/en/projects/purareserva');
    cy.get('nav[aria-label="Language"]').contains('a', 'es').click();
    cy.location('pathname').should('eq', '/es/projects/purareserva');
    cy.contains('h2', 'Problema').should('exist');
  });

  it('CP-07 un slug inexistente devuelve 404', () => {
    cy.request({ url: '/en/projects/no-existe', failOnStatusCode: false })
      .its('status')
      .should('eq', 404);
    cy.visit('/en/projects/no-existe', { failOnStatusCode: false });
    cy.get('main').should('exist');
    cy.contains('h2', CASE_SECTIONS.en[0]).should('not.exist');
  });
});
