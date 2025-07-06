
import React from 'react';
import { View } from '../types';
import { HomeIcon, ListIcon, TargetIcon, PlusIcon } from './ui/Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  openTransactionModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, openTransactionModal }) => {
  const navItems = [
    { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
    { id: 'transactions', icon: ListIcon, label: 'Transactions' },
    { id: 'goals', icon: TargetIcon, label: 'Goals' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-center space-x-3 mb-10">
           <svg className="h-8 w-auto text-indigo-600" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 3C10.269 3 4 9.269 4 17C4 24.312 9.475 30.153 16.5 30.919V20.25H12.5V17H16.5V14.25C16.5 10.398 18.831 8.25 22.286 8.25C23.921 8.25 25.5 8.55 25.5 8.55V11.25H23.9C22.019 11.25 21.5 12.193 21.5 13.5V17H25.5L25 20.25H21.5V30.919C28.525 30.153 34 24.312 34 17C34 9.269 27.731 3 18 3Z" />
           </svg>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Zenith</h1>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id as View)}
                  className={`w-full flex items-center space-x-3 p-3 my-1 rounded-lg text-lg transition-colors duration-200 ${
                    currentView === item.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div>
        <button 
            onClick={openTransactionModal}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
        >
            <PlusIcon className="h-6 w-6" />
            <span>New Transaction</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
