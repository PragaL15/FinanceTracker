import React, { useState, useMemo } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import GoalsView from './components/GoalsView';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import InvestmentReminder from './components/InvestmentReminder';
import AddTransactionModal from './components/AddTransactionModal';

const MainContent: React.FC<{ currentView: View }> = ({ currentView }) => {
  const { loading, error } = useFinance();

  const PageTitle = useMemo(() => {
    switch (currentView) {
      case 'transactions': return 'Transactions History';
      case 'goals': return 'Financial Goals';
      case 'dashboard':
      default: return 'Dashboard Overview';
    }
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'transactions': return <TransactionsView />;
      case 'goals': return <GoalsView />;
      case 'dashboard':
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{PageTitle}</h1>
      </header>
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-xl font-semibold text-gray-500 animate-pulse">Loading Your Financial Universe...</p>
        </div>
      ) : error ? (
        <div className="flex-grow flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 rounded-lg">
            <div className="text-center">
                <p className="text-xl font-semibold text-red-600 dark:text-red-400">Oops! Something went wrong.</p>
                <p className="text-base text-red-500 dark:text-red-300 mt-2">{error}</p>
            </div>
        </div>
      ) : (
        <>
          <InvestmentReminder />
          {renderView()}
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <FinanceProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} openTransactionModal={() => setIsModalOpen(true)} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <MainContent currentView={currentView} />
        </main>
      </div>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </FinanceProvider>
  );
};

export default App;
