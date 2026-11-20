describe('API: sitemap y robots', () => {
  it('CP-11 /sitemap.xml responde 200 y tiene 14 URLs', () => {
    cy.request('/sitemap.xml').then((res) => {
      expect(res.status).to.eq(200);
      const locs = (res.body as string).match(/<loc>[^<]+<\/loc>/g) ?? [];
      expect(locs).to.have.length(14);
    });
  });

  it('CP-12 /robots.txt apunta al sitemap', () => {
    cy.request('/robots.txt').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.match(/^Sitemap:\s*https:\/\/frandercenteno\.vercel\.app\/sitemap\.xml/im);
    });
  });
});
