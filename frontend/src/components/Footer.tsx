import { ReactNode } from "react";

export default function Footer(): ReactNode {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto mb-3 text-small">
      <p>&copy; {year} Zdeněk Barth</p>
    </footer>
  );
}

