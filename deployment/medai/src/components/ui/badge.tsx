import React from 'react';

export const Badge = ({ children, className = '', variant = 'secondary', ...props }) => {
  let base = 'inline-flex items-center px-3 py-1 text-xs font-medium rounded-full';
  let color = '';
  if (variant === 'secondary') color = 'bg-blue-100 text-blue-800';
  else if (variant === 'success') color = 'bg-green-100 text-green-800';
  else if (variant === 'danger') color = 'bg-red-100 text-red-800';
  else if (variant === 'warning') color = 'bg-yellow-100 text-yellow-800';
  else color = '';
  return (
    <span className={`${base} ${color} ${className}`} {...props}>{children}</span>
  );
};
