import React from 'react';

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-bold">User Management</div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;