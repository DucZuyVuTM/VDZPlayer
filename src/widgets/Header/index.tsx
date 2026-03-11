import React from 'react';
import logo from '@/assets/logo.png'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Web Name */}
          <div
            className="flex items-center hover:opacity-80 transition-opacity gap-1 cursor-pointer"
          >
            <img src={logo} alt="Logo" width={40} height={40}></img>
            <span className="text-2xl font-bold text-gray-900">VDZ Player</span>
          </div>          
        </div>
      </div>
    </header>
  );
}

export default Header;
