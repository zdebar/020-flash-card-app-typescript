const config = {
  backendURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Ensure this is the base URL without '/api'
  plusProgress: 1,
  minusProgress: -2,
  blockFillSize: 5,
  colors: [
    'bg-blue-400', // 1–5
    'bg-blue-500', // 6–10
    'bg-blue-600', // 11–15
    'bg-blue-700', // 16–20
  ],
};

export default config;
