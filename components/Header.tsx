import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center my-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-coral to-mid-blue">
        Reddit Weaver
      </h1>
      <p className="text-mid-blue mt-2 text-lg">
        Where headlines become literature.
      </p>
    </header>
  );
};

export default Header;