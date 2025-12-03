import { NavLink } from 'react-router-dom';
import { HamburgerMenu } from '../common/HamburgerMenu';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <HamburgerMenu />
        <NavLink to="/" className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </NavLink>
      </div>
    </div>
  );
}