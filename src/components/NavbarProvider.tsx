import { ReactNode, useState } from 'react';
import { NavbarContext } from './Navbar';

interface NavbarProviderProps {
  children: ReactNode;
}

export const NavbarProvider = ({ children }: NavbarProviderProps) => {
  const [dashboardNavbarActive, setDashboardNavbarActive] = useState(false);
  
  return (
    <NavbarContext.Provider value={{ dashboardNavbarActive, setDashboardNavbarActive }}>
      {children}
    </NavbarContext.Provider>
  );
};