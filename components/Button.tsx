import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-coral to-berry rounded-lg shadow-md hover:from-coral/90 hover:to-berry/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-coral disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;