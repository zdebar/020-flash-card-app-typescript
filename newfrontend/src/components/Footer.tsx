import { ReactNode } from "react";

export default function Footer(): ReactNode {
  const year = new Date().getFullYear();

  return (
    <footer className="footer sm:footer-horizontal footer-center text-base-content p-4">
    <aside>
      <p>&copy; {year} Zdeněk Barth</p>
    </aside>
  </footer>
  );
}