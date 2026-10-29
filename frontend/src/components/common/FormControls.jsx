export function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${
            error
              ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
}

export function FormSelect({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const selectId = id || name;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 ${
          error
            ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
            : 'border-slate-200 dark:border-slate-800'
        }`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={idx} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
}

export function FormTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const textareaId = id || name;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3.5 transition focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 ${
          error
            ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
            : 'border-slate-200 dark:border-slate-800'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default { FormInput, FormSelect, FormTextarea };
