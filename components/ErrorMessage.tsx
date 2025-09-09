import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-coral/10 border border-coral/40 text-coral px-4 py-3 rounded-lg relative" role="alert">
      <strong className="font-bold">An Error Occurred: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;