export default function ButtonLoader({ size = 'sm', className = '' }) {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2'
  }[size] || 'w-4 h-4 border-2';

  return (
    <div
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${sizeClasses} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
