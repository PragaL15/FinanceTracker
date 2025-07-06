import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { XIcon } from './ui/Icons';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useFinance();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(targetAmount);
    if (!name || !parsedAmount || parsedAmount <= 0 || !targetDate) {
      setError('Please fill out all fields with valid values.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await addGoal({ name, targetAmount: parsedAmount, targetDate });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Goal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><XIcon/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Goal Name</label>
            <input type="text" placeholder="e.g., New Car Fund" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Target Amount</label>
            <input type="number" placeholder="20000" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required min="0.01" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Target Date</label>
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required min={new Date().toISOString().split('T')[0]} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="text-right pt-4">
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
