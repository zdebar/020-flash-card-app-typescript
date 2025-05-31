export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={`w-full py-4 text-center text-white ${className}`}>
      <p>&copy; 2025 zdebarth@gmail.com</p>
    </footer>
  );
}
