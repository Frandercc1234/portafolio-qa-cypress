export const SLUGS = [
  'purareserva',
  'nicoya-zmt',
  'pipeline-bccr',
  'asada-gamalotal',
  'turismo-cr',
] as const;

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

export const CV_PATH: Record<Locale, string> = {
  en: '/cv/CV_Frander_Centeno_EN.pdf',
  es: '/cv/CV_Frander_Centeno_ES.pdf',
};

export const OWNER_NAME = 'Frander Centeno';

export const CASE_SECTIONS: Record<Locale, string[]> = {
  en: ['Problem', 'My role', 'What I built', 'Key decisions', 'Results', "What I'd do next"],
  es: ['Problema', 'Mi rol', 'Qué construí', 'Decisiones clave', 'Resultados', 'Qué haría después'],
};

export const CV_LINK_NAME = /download cv|descargar cv/i;
export const MOBILE_MAX_WIDTH = 767;
