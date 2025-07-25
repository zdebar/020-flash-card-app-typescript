const config = {
  backendURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  plusProgress: 1,
  minusProgress: -2,
  skipProgress: 100,
  blockFillSize: 5,
  colors: [
    'bg-[#6FBBCF]', // 1–5
    'bg-[#2E9AB0]', // 6–10
    'bg-[#257F92]', // 11–15
    'bg-[#1C6676]', // 16–20
  ],
  colorProgressBg: 'bg-[#f7b740]',
  colorProgressText: 'text-[#f7b740]',
  levelSort: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  languages: [
    { id: 1, name: 'Angličtina', code: 'en' },
    { id: 2, name: 'Němčina', code: 'de' },
    { id: 3, name: 'Španělština', code: 'es' },
  ],
};

export default config;
