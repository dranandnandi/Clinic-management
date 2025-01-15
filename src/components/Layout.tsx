import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LayoutDashboard, Calendar, MessageSquare, Settings, LogOut } from 'lucide-react';

export function Layout() {
  const { user, clinic, setUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return <Outlet />;
  }

  const headerStyle = {
    backgroundColor: clinic.primaryColor || '#ffffff',
    color: clinic.primaryColor ? '#ffffff' : '#1f2937'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="shadow-md" style={headerStyle}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center space-x-3">
                {clinic.logo && (
                  <img 
                    src={clinic.logo} 
                    alt={clinic.name} 
                    className="h-8 w-auto"
                  />
                )}
                <h1 className="text-xl font-bold">{clinic.name}</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/appointments"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium opacity-80 hover:opacity-100"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Appointments
                </Link>
                <Link
                  to="/reviews"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium opacity-80 hover:opacity-100"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reviews
                </Link>
                <Link
                  to="/settings"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium opacity-80 hover:opacity-100"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-4">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30"
                style={{ 
                  backgroundColor: clinic.secondaryColor || '#f3f4f6',
                  color: clinic.primaryColor ? '#ffffff' : '#374151'
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}