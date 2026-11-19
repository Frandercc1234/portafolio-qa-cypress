describe('API: encabezados y redirección', () => {
  it('CP-16 están los encabezados de seguridad', () => {
    cy.request('/en').then((res) => {
      expect(res.headers).to.have.property('content-security-policy');
      expect(res.headers['x-content-type-options']).to.eq('nosniff');
      expect(res.headers).to.have.property('referrer-policy');
    });
  });

  it('CP-17 "/" con Accept-Language: es redirige a /es', () => {
    cy.request({
      url: '/',
      headers: { 'Accept-Language': 'es' },
      followRedirect: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([301, 302, 307, 308]);
      expect(res.headers.location).to.match(/\/es\/?$/);
    });
  });
});
