import React from 'react';

export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  let base = 'px-4 py-2 rounded-2xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  let color = '';
  if (variant === 'primary') color = 'bg-blue-600 text-white hover:bg-blue-700';
  else if (variant === 'outline') color = 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100';
  else color = '';
  return (
    <button className={`${base} ${color} ${className}`} {...props}>{children}</button>
  );
};
