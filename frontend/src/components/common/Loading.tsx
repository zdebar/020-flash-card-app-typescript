import { useState, useEffect } from 'react';

export default function Loading({ text = 'Loading...' }: { text?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <p role="status" aria-live="polite" className="text-center">
      {text}
    </p>
  );
}
