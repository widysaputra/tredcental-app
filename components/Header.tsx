import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/tred-logo.jpg" alt="Tredcental Logo" className="h-8 w-auto" />
          <h1 className="text-2xl font-bold text-white tracking-wider">
            Tredcental
          </h1>
        </div>
        <div className="text-sm font-medium text-slate-300">
            Rental Billing
        </div>
      </div>
    </header>
  );
};

export default Header;