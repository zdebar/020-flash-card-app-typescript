const config = {
  backendURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  plusProgress: 1,
  minusProgress: -2,
  skipProgress: 100,
  dailyBlocks: 40,
  defaultLanguageID: 1,
  languages: [
    { id: 1, name: 'Angličtina', adverb: 'anglicky', code: 'en' },
    { id: 2, name: 'Němčina', adverb: 'německy', code: 'de' },
    { id: 3, name: 'Španělština', adverb: 'španělsky', code: 'es' },
  ],
};

export default config;
