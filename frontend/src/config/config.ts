const config = {
  backendURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  plusProgress: 1,
  minusProgress: -2,
  blockFillSize: 5,
  colors: [
    'bg-[#00A2BC]', // 1–5
    'bg-[#188292]', // 6–10
    'bg-[#235E68]', // 11–15
    'bg-[#1F393D]', // 16–20
  ],
  colorProgressBg: 'bg-[#F7B740]',
  colorProgressText: 'text-[#F7B740]',
};

export default config;
