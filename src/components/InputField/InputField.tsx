export type InputVariant = 'filled' | 'outlined' | 'ghost';
export type InputSize = 'sm' | 'md' | 'lg';
import React from "react";
export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  /** Added for feature completeness */
  loading?: boolean;
  /** Optional input type (default text) */
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  /** Optional name/id to connect label & a11y descriptions */
  name?: string;
  id?: string;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-9 text-sm px-3',
  md: 'h-10 text-base px-3.5',
  lg: 'h-11 text-base px-4',
};

const variantClasses: Record<InputVariant, string> = {
  filled:
    'bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-indigo-500',
  outlined:
    'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500',
  ghost:
    'bg-transparent border-b border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-500',
};

const disabledClasses = 'opacity-60 cursor-not-allowed';

const baseInputClasses =
  'block w-full rounded-xl outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow';

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled = false,
      invalid = false,
      variant = 'outlined',
      size = 'md',
      loading = false,
      type = 'text',
      name,
      id,
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState('');
    const isControlled = value !== undefined;
    const inputValue = isControlled ? value! : internal;

    const inputId = id || name || React.useId();
    const helperId = helperText ? `${inputId}-help` : undefined;
    const errorId = errorMessage ? `${inputId}-error` : undefined;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (!isControlled) setInternal(e.target.value);
      onChange?.(e);
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-500">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            aria-invalid={invalid || undefined}
            aria-describedby={(invalid && errorId) || helperId}
            className={[
              baseInputClasses,
              sizeClasses[size],
              variantClasses[variant],
              invalid ? 'border-red-500 focus:ring-red-500' : '',
              disabled || loading ? disabledClasses : '',
            ].join(' ')}
          />

          {loading && (
            <span
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4"/></svg>
            </span>
          )}
        </div>

        <div className="mt-1 min-h-[1.25rem] text-xs">
          {invalid && errorMessage ? (
            <p id={errorId} className="text-red-600 dark:text-red-400">{errorMessage}</p>
          ) : helperText ? (
            <p id={helperId} className="text-gray-500 dark:text-gray-400">{helperText}</p>
          ) : null}
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
export default InputField;