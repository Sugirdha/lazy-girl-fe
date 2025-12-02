import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="p-6">
      <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
      <span className="text-lg font-medium text-gray-500">{subtitle}</span>
    </header>
  );
};

export default Header;
