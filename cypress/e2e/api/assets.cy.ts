import { CV_PATH, LOCALES } from '../../support/constants';

describe('API: imágenes OG y PDF del CV', () => {
  it('CP-13 la imagen OG del inicio devuelve image/png', () => {
    cy.request('/en/opengraph-image').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.match(/^image\/png/);
    });
  });

  it('CP-14 la imagen OG de un caso devuelve image/png', () => {
    cy.request('/en/projects/purareserva/opengraph-image').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.match(/^image\/png/);
    });
  });

  LOCALES.forEach((locale) => {
    it(`CP-15 el PDF del CV (${locale}) devuelve 200 con application/pdf`, () => {
      cy.request(CV_PATH[locale]).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.headers['content-type']).to.match(/^application\/pdf/);
      });
    });
  });
});
