const WIDTHS = [320, 375, 768, 1024, 1440];
const PAGES = ['/en', '/es', '/en/projects/purareserva', '/es/projects/nicoya-zmt'];

describe('Maquetación', () => {
  WIDTHS.forEach((width) => {
    PAGES.forEach((page) => {
      it(`CP-10 sin scroll horizontal en ${page} a ${width} px`, () => {
        cy.viewport(width, 900);
        cy.visit(page);
        // Se compara con innerWidth (sin el scrollbar clásico del navegador de pruebas).
        cy.window().should((win) => {
          expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth);
        });
      });
    });
  });
});
