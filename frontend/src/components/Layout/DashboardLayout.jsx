import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Page Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
