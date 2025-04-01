import { Link } from 'react-router-dom';

export function RegisterLink() {
  return (
    <div className="mt-4 text-center">
      <p className="text-sm">
        Nemáte zatím účet?{' '}
        <Link
          to="/register"
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Zaregistrujte se zde
        </Link>
      </p>
    </div>
  );
}
