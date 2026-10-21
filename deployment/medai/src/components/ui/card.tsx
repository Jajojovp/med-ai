import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-3xl shadow-md border border-gray-200 p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-2 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h2 className={`text-xl font-bold ${className}`} {...props}>{children}</h2>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-gray-500 text-sm ${className}`} {...props}>{children}</p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);
