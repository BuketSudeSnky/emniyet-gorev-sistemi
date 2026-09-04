import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full rounded-lg border bg-white px-3.5 py-2.5
          text-sm text-slate-900 outline-none
          placeholder:text-slate-400
          transition-all duration-200
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
          }
          disabled:cursor-not-allowed disabled:bg-slate-100
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;