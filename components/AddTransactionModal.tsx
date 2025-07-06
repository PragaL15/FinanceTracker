import React, { useState, useEffect, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, Split } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { XIcon, PlusIcon, Trash2Icon } from './ui/Icons';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useFinance();
  
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [splits, setSplits] = useState<Split[]>([{ categoryId: EXPENSE_CATEGORIES[0].id, amount: 0 }]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const resetForm = useCallback(() => {
    setType(TransactionType.EXPENSE);
    setDescription('');
    setTotalAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setSplits([{ categoryId: EXPENSE_CATEGORIES[0].id, amount: 0 }]);
    setError('');
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  useEffect(() => {
    // When type changes, reset splits to the new default category
    const defaultCategory = type === TransactionType.INCOME ? INCOME_CATEGORIES[0].id : EXPENSE_CATEGORIES[0].id;
    setSplits([{ categoryId: defaultCategory, amount: parseFloat(totalAmount) || 0 }]);
  }, [type]);


  if (!isOpen) return null;
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = e.target.value;
    setTotalAmount(newTotal);
    if(splits.length === 1) {
        setSplits([{...splits[0], amount: parseFloat(newTotal) || 0}]);
    }
  };

  const handleSplitAmountChange = (index: number, amount: string) => {
    const newSplits = [...splits];
    newSplits[index].amount = parseFloat(amount) || 0;
    setSplits(newSplits);
  };

  const handleSplitCategoryChange = (index: number, categoryId: string) => {
    const newSplits = [...splits];
    newSplits[index].categoryId = categoryId;
    setSplits(newSplits);
  };

  const addSplit = () => {
    const categories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setSplits([...splits, { categoryId: categories[0].id, amount: 0 }]);
  };

  const removeSplit = (index: number) => {
    const newSplits = splits.filter((_, i) => i !== index);
    setSplits(newSplits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTotal = parseFloat(totalAmount);
    if (!description || !parsedTotal || parsedTotal <= 0) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    const sumOfSplits = splits.reduce((sum, s) => sum + s.amount, 0);
    if (Math.abs(sumOfSplits - parsedTotal) > 0.01) {
      setError(`Split amounts ($${sumOfSplits.toFixed(2)}) must sum up to the total amount ($${parsedTotal.toFixed(2)}).`);
      return;
    }
    
    setError('');
    setIsSubmitting(true);

    try {
      await addTransaction({ date, description, totalAmount: parsedTotal, type, splits });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const remainingAmount = (parseFloat(totalAmount) || 0) - splits.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">New Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><XIcon/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-1/2 py-2 rounded-md font-semibold transition ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Expense</button>
              <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-1/2 py-2 rounded-md font-semibold transition ${type === TransactionType.INCOME ? 'bg-green-500 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>Income</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="md:col-span-2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
          </div>
          <div className="mb-4">
             <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Total Amount</label>
             <input type="number" placeholder="0.00" value={totalAmount} onChange={handleAmountChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required min="0.01" step="0.01" />
          </div>

          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Categories</h3>
          <div className="space-y-3">
            {splits.map((split, index) => (
              <div key={index} className="flex items-center gap-2">
                <select value={split.categoryId} onChange={e => handleSplitCategoryChange(index, e.target.value)} className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <input type="number" placeholder="Amount" value={split.amount || ''} onChange={e => handleSplitAmountChange(index, e.target.value)} className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <button type="button" onClick={() => removeSplit(index)} disabled={splits.length <= 1} className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Trash2Icon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addSplit} className="mt-2 flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold">
            <PlusIcon className="h-5 w-5"/><span>Split Transaction</span>
          </button>
          
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className={`mt-2 text-sm font-medium ${Math.abs(remainingAmount) > 0.001 ? 'text-orange-500' : 'text-green-500'}`}>
            Unassigned amount: ${remainingAmount.toFixed(2)}
          </div>
        
          <div className="mt-6 text-right">
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
