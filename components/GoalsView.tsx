
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusIcon } from './ui/Icons';
import AddGoalModal from './AddGoalModal';

const GoalsView: React.FC = () => {
  const { goals } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
       <div className="flex justify-end">
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                <PlusIcon className="h-5 w-5" />
                <span>New Goal</span>
            </button>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          return (
            <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{goal.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                <div 
                  className="bg-green-500 h-4 rounded-full text-xs text-white flex items-center justify-center" 
                  style={{ width: `${progress}%` }}
                >
                  {progress > 15 && `${progress.toFixed(0)}%`}
                </div>
              </div>

              <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                <span>${goal.currentAmount.toFixed(2)}</span>
                <span>${goal.targetAmount.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">You haven't set any goals yet.</p>
                <p className="text-gray-500 dark:text-gray-400">Click 'New Goal' to start planning for your future!</p>
            </div>
        )}
      </div>
      
      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default GoalsView;
