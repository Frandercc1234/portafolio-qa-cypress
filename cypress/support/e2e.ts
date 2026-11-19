// Decisión de entorno: las corridas de QA no deben contar como visitas en Vercel Analytics.
beforeEach(() => {
  cy.intercept('**/_vercel/insights/**', { statusCode: 204, body: '' });
});
