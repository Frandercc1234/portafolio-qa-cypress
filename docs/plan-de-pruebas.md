# Plan de pruebas — Portafolio de Frander Centeno

**Sistema bajo prueba:** https://frandercenteno.vercel.app (producción)
**Herramienta:** Cypress + TypeScript
**Autor:** Frander Centeno · **Última revisión:** 2026-11-20

## 1. Alcance

Se prueba lo que un visitante (o un reclutador) usa del portafolio:

- Inicio en `/en` y `/es`: hero con nombre y botón de CV por idioma.
- Las 5 tarjetas de casos destacados y la página de cada uno de los 7 casos (los 5 destacados y `turismo-cr` y `qa-cypress`, listados en "Otros proyectos") en ambos idiomas.
- Selector de idioma (conserva la ruta) y manejo de rutas inexistentes (404).
- Menú móvil (375 px): apertura, anclas y cierre con Escape.
- Formulario de contacto: validación de campos vacíos (nunca un envío válido).
- Ausencia de scroll horizontal en distintos anchos.
- Contratos HTTP: `sitemap.xml`, `robots.txt`, imágenes Open Graph, PDF del CV, encabezados de seguridad y redirección por `Accept-Language`.

## 2. Fuera de alcance

- **Envío real del formulario:** llegaría al correo del autor. No se envía ningún formulario válido.
- **Turnstile (Cloudflare):** no se resuelve ni se intenta saltar. Solo se observa lo que el sitio hace sin token.
- Rendimiento (Lighthouse/Core Web Vitals), pruebas de carga y pruebas de penetración.
- Pruebas visuales (comparación de capturas) y navegadores distintos de los que provee Cypress en CI.
- Contenido editorial (ortografía, veracidad de los casos).
- Cambios al sitio: el repo de pruebas no modifica el código del portafolio. Los hallazgos se reportan como issues.

## 3. Entornos

| Entorno | Detalle |
|---|---|
| URL base | `https://frandercenteno.vercel.app` (producción) |
| Móvil | viewport 375×812 |
| Escritorio | viewport 1440×900 |
| Navegador | Electron/Chrome headless (Cypress) |
| CI | GitHub Actions, `ubuntu-latest`, Node LTS |

Las pruebas E2E corren en los dos viewports; las de API corren una sola vez porque no dependen del viewport. Total actual: 90 pruebas (8 API + 41 móvil + 41 escritorio).

### Decisiones de entorno

- **Analítica bloqueada:** un `beforeEach` de soporte aplica `cy.intercept('**/_vercel/insights/**', { statusCode: 204 })` en todas las pruebas, para que las corridas de CI no cuenten como visitas en Vercel Analytics.
- **Formulario:** solo se envía el formulario **vacío**, que el servidor rechaza con `VALIDATION` antes de llegar a Turnstile o al correo. La prueba espía el `POST` y falla si la respuesta no es un rechazo (`"ok":true` nunca debe aparecer). No se completa ningún campo con datos válidos y no se intenta resolver ni saltar Turnstile.
- **Scroll horizontal:** se compara `scrollWidth` con `window.innerWidth` (no `clientWidth`), porque el navegador headless de Cypress reserva un scrollbar clásico de 15 px.
- **Bugs conocidos:** mientras un defecto real del sitio esté abierto, su prueba puede quedar pendiente (`it.skip`) con el número del issue en el nombre. Hoy no hay ninguno.
- **Producción como entorno:** los datos son estables pero el contenido puede cambiar; las aserciones usan rol/estructura y solo el nombre del hero como texto exacto.

## 4. Criterios de entrada y salida

**Entrada**
- El sitio responde 200 en `/en` y `/es`.
- Dependencias instaladas (`npm ci`) y Cypress verificado.
- Sin cambios pendientes sin revisar en las especificaciones.

**Salida**
- 100 % de los casos CP-01…CP-17 ejecutados en los dos viewports (los de API, una vez).
- 0 pruebas fallidas, o cada fallo documentado con un issue (plantilla de bug) enlazado en el README.
- Lint sin errores y CI en verde.

## 5. Casos de prueba

| ID | Descripción | Pasos | Resultado esperado | Tipo |
|---|---|---|---|---|
| CP-01 | Inicio en inglés | 1. Visitar `/en`. 2. Leer el hero. 3. Revisar el botón de CV. | El `h1` es "Frander Centeno" y el botón de CV apunta a `/cv/CV_Frander_Centeno_EN.pdf`. | E2E |
| CP-02 | Inicio en español | 1. Visitar `/es`. 2. Leer el hero. 3. Revisar el botón de CV. | El `h1` es "Frander Centeno" y el botón de CV apunta a `/cv/CV_Frander_Centeno_ES.pdf`. | E2E |
| CP-03 | Tarjetas de casos destacados | 1. Visitar `/en`. 2. Para cada una de las 5 tarjetas destacadas, hacer clic (`turismo-cr` y `qa-cypress` no son destacados y no se prueban aquí). | Cada tarjeta navega a `/en/projects/<slug>` y la página carga. | E2E |
| CP-04 | Casos en inglés | 1. Visitar `/en/projects/<slug>` (×7). | Hay un solo `h1` y las secciones del caso (`h2`). | E2E |
| CP-05 | Casos en español | 1. Visitar `/es/projects/<slug>` (×7). | Hay un solo `h1` y las secciones del caso (`h2`). | E2E |
| CP-06 | Selector de idioma conserva la ruta | 1. Visitar `/en/projects/purareserva`. 2. Cambiar idioma a español. | La URL es `/es/projects/purareserva` y el contenido está en español. | Regresión |
| CP-07 | Slug inexistente | 1. Pedir `/en/projects/no-existe`. | Respuesta 404 y se muestra la página de error. | E2E |
| CP-08 | Menú móvil | 1. En 375 px abrir el menú. 2. Seguir un enlace de ancla. 3. Reabrir y pulsar Escape. (En escritorio: el botón de menú no se ve y la navegación está en línea.) | El menú abre (`aria-expanded=true`), lleva a la sección y cierra con Escape. | Accesibilidad |
| CP-09 | Formulario vacío | 1. Ir a `#contact`. 2. Enviar sin completar. | El servidor rechaza el envío (`VALIDATION`) y cada campo muestra su error visible, con `aria-invalid="true"` y `aria-describedby` apuntando al mensaje. Turnstile no interviene. | Accesibilidad |
| CP-10 | Sin scroll horizontal | 1. Para 320, 375, 768, 1024 y 1440 px, visitar `/en`, `/es` y un caso por idioma. 2. Comparar `scrollWidth` con `innerWidth`. | `scrollWidth <= innerWidth` en todos los anchos. **Hallazgos corregidos:** falló a 320 y 768 px (header, issue #1) y a 1024 px en el inicio (contacto, issue #2); ya pasa. | Regresión |
| CP-11 | Sitemap | 1. `GET /sitemap.xml`. | 200 y 16 `<loc>` (2 inicios + 7 casos × 2 idiomas). | API |
| CP-12 | Robots | 1. `GET /robots.txt`. | 200 y contiene `Sitemap: https://frandercenteno.vercel.app/sitemap.xml`. | API |
| CP-13 | OG del inicio | 1. `GET /en/opengraph-image`. | 200 y `content-type: image/png`. | API |
| CP-14 | OG de un caso | 1. `GET /en/projects/purareserva/opengraph-image`. | 200 y `content-type: image/png`. | API |
| CP-15 | PDF del CV | 1. `GET` de los dos PDF. | 200 y `content-type: application/pdf` en ambos. | API |
| CP-16 | Encabezados de seguridad | 1. `GET /en`. | Presentes `content-security-policy`, `x-content-type-options: nosniff` y `referrer-policy`. | API |
| CP-17 | Redirección por idioma | 1. `GET /` con `Accept-Language: es` sin seguir redirecciones. | Redirección (307) con `Location: /es`. | API |

## 6. Riesgos

- Pruebas contra producción: un cambio de contenido puede romper aserciones.
- GitHub desactiva los workflows programados tras 60 días sin actividad en el repo.
- Turnstile puede cambiar el comportamiento del formulario sin aviso.
