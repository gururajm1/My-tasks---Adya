import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";

const menuItems = [
  'Dashboard',
  'Analytics',
  'Tools',
  'Settings',
  'Support',
  'Ticket',
  'Logout',
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = (item: string) => {
    if (item === 'Logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      navigate('/login');
    } else {
      navigate(`/${item.toLowerCase()}`);
    }
  };

  return (
    <div className={`h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'} bg-white border-r shadow-sm p-5 flex flex-col justify-between relative`}>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>Vanij</h2>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-6 bg-white border shadow-sm cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === `/${item.toLowerCase()}`;
            return (
              <li
                key={item}
                className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium ${isCollapsed ? 'text-center' : ''} ${
                  isActive ? 'bg-gray-100 text-blue-600 font-semibold' : 'text-gray-700'
                }`}
                onClick={() => handleNavigation(item)}
              >
                {isCollapsed ? item.charAt(0) : item}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
