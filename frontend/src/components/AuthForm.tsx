import { ReactNode, FormHTMLAttributes } from 'react';

interface AuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  error?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthForm({
  title,
  error,
  children,
  onSubmit,
  className = '',
  ...props
}: AuthFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="color-gray w-[320px] rounded-md p-4">
      <h2 className="mb-4 text-center text-2xl font-bold">{title}</h2>

      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className={`${className}`} {...props}>
        {children}
      </form>
    </div>
  );
}
