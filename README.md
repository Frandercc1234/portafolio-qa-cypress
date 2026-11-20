# portafolio-qa-cypress

[![CI](https://github.com/Frandercc1234/portafolio-qa-cypress/actions/workflows/ci.yml/badge.svg)](https://github.com/Frandercc1234/portafolio-qa-cypress/actions/workflows/ci.yml)

Proyecto de QA con **Cypress + TypeScript** que prueba mi portafolio en producción: <https://frandercenteno.vercel.app>.

> **English summary:** Automated QA suite (Cypress, TypeScript, ESLint) that tests my live portfolio at the URL above: E2E tests on mobile (375×812) and desktop (1440×900), API tests with `cy.request` (sitemap, robots, OG images, CV PDFs, security headers, language redirect). It runs on every push and daily on a schedule (production smoke test) via GitHub Actions, uploading screenshots and videos on failure. Test plan: [`docs/plan-de-pruebas.md`](docs/plan-de-pruebas.md). The suite found two real site bugs (horizontal overflow, issues [#1](https://github.com/Frandercc1234/portafolio-qa-cypress/issues/1) and [#2](https://github.com/Frandercc1234/portafolio-qa-cypress/issues/2)); both were fixed in the site and the tests now pass.

## Qué se prueba

- **E2E** (`cypress/e2e/`), en móvil 375×812 y escritorio 1440×900: inicio en `/en` y `/es`, tarjetas de casos, los 6 casos en ambos idiomas (5 destacados y `qa-cypress`), selector de idioma, 404, menú móvil, validación del formulario de contacto y ausencia de scroll horizontal.
- **API** (`cypress/e2e/api/`, con `cy.request`): `sitemap.xml`, `robots.txt`, imágenes OG, PDF del CV, encabezados de seguridad y redirección por `Accept-Language`.

Detalles, alcance, criterios de entrada/salida y pasos de cada caso: [`docs/plan-de-pruebas.md`](docs/plan-de-pruebas.md).

### Decisiones importantes

- **El formulario nunca se envía con datos válidos** (llegaría a mi correo). Solo se envía vacío, que el servidor rechaza antes de Turnstile. No se intenta saltar Turnstile.
- Las peticiones a `/_vercel/insights/*` se bloquean para que las corridas no cuenten como visitas en Vercel Analytics.
- Selectores por rol o texto visible; `href`/`id` solo cuando no hay alternativa. Sin `cy.wait` con tiempos fijos. Cada prueba lleva su ID `CP-xx` en el nombre.

## Cómo correrlo

Requiere Node 20+ (probado con Node 24).

```bash
npm ci
npm run test:api       # pruebas de API (una vez)
npm run test:mobile    # E2E en 375×812
npm run test:desktop   # E2E en 1440×900
npm test               # todo lo anterior
npm run cy:open        # modo interactivo
npm run lint && npm run typecheck
```

## CI

`.github/workflows/ci.yml` corre lint, API y E2E (matriz móvil/escritorio) en cada push, y una vez al día (06:00 UTC) como smoke test contra producción. Si algo falla, sube capturas y videos como artefactos. *Nota:* GitHub desactiva los workflows programados tras 60 días sin actividad en el repositorio.

## Casos de prueba y estado

| ID | Caso | Tipo | Estado |
|---|---|---|---|
| CP-01 | Inicio `/en`: nombre y CV en inglés | E2E | ✅ Pasa |
| CP-02 | Inicio `/es`: nombre y CV en español | E2E | ✅ Pasa |
| CP-03 | 5 tarjetas destacadas navegan a su caso | E2E | ✅ Pasa |
| CP-04 | Casos en inglés: un `h1` y sus secciones | E2E | ✅ Pasa |
| CP-05 | Casos en español: un `h1` y sus secciones | E2E | ✅ Pasa |
| CP-06 | Selector de idioma conserva la ruta | Regresión | ✅ Pasa |
| CP-07 | Slug inexistente devuelve 404 | E2E | ✅ Pasa |
| CP-08 | Menú móvil (abre, anclas, Escape) | Accesibilidad | ✅ Pasa |
| CP-09 | Formulario vacío muestra errores por campo | Accesibilidad | ✅ Pasa |
| CP-10 | Sin scroll horizontal (320–1440 px) | Regresión | ✅ Pasa (tras corregir [#1](https://github.com/Frandercc1234/portafolio-qa-cypress/issues/1) y [#2](https://github.com/Frandercc1234/portafolio-qa-cypress/issues/2)) |
| CP-11 | `sitemap.xml`: 200 y 14 URLs | API | ✅ Pasa |
| CP-12 | `robots.txt` apunta al sitemap | API | ✅ Pasa |
| CP-13 | OG del inicio es `image/png` | API | ✅ Pasa |
| CP-14 | OG de un caso es `image/png` | API | ✅ Pasa |
| CP-15 | PDF del CV: 200 y `application/pdf` | API | ✅ Pasa |
| CP-16 | Encabezados de seguridad presentes | API | ✅ Pasa |
| CP-17 | `Accept-Language: es` redirige a `/es` | API | ✅ Pasa |

**Total: 86 pruebas** (8 de API + 39 E2E en móvil + 39 E2E en escritorio), todas pasando.

### Bugs encontrados y corregidos

Esta suite encontró dos defectos reales del portafolio (desbordamiento horizontal). Ambos se corrigieron en [Frandercc1234/portafolio#5](https://github.com/Frandercc1234/portafolio/pull/5) y las pruebas CP-10 que antes estaban pendientes ahora pasan:

- [#1](https://github.com/Frandercc1234/portafolio-qa-cypress/issues/1): el header se desbordaba del viewport a 320 px y a 768 px.
- [#2](https://github.com/Frandercc1234/portafolio-qa-cypress/issues/2): scroll horizontal en la sección de contacto del inicio a 1024 px.

## Reportar un bug

Usá la plantilla [`.github/ISSUE_TEMPLATE/bug.md`](.github/ISSUE_TEMPLATE/bug.md). Este repo no modifica el sitio: los hallazgos se reportan como issues.
