import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <header>
        {/* Add your header content here */}
      </header>
      
      <main>
        <Outlet />
      </main>

      <footer>
        {/* Add your footer content here */}
      </footer>
    </div>
  );
};

export default MainLayout; 