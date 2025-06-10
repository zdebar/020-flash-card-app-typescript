export default function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`w-full py-4 text-center text-sm text-white ${className}`}
    >
      <p>&copy; {currentYear} zdebarth@gmail.com</p>
    </footer>
  );
}
