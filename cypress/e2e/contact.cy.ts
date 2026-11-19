describe('Formulario de contacto', () => {
  it('CP-09 enviar vacío muestra el error de cada campo y no se acepta', () => {
    // Un envío vacío es rechazado por el servidor (VALIDATION): no puede llegar ningún correo.
    // Nunca se completa con datos válidos. Turnstile no se toca.
    cy.intercept('POST', '/en').as('envio');
    cy.visit('/en#contact');

    cy.get('#contact form').within(() => {
      cy.get('button[type="submit"]').scrollIntoView();
      cy.get('button[type="submit"]').click();
    });

    cy.wait('@envio').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(String(response?.body)).to.contain('"error":"VALIDATION"').and.not.contain('"ok":true');
    });

    ['contact-name', 'contact-email', 'contact-message'].forEach((id) => {
      cy.get(`#${id}`).should('have.attr', 'aria-invalid', 'true');
      cy.get(`#${id}`)
        .invoke('attr', 'aria-describedby')
        .then((errorId) => {
          cy.get(`#${errorId}`).should('be.visible').and('not.be.empty');
        });
    });
  });
});
