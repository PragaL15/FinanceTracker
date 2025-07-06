import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionType } from '../types';
import { ALL_CATEGORIES } from '../constants';

const TransactionsView: React.FC = () => {
  const { transactions, getCategoryName } = useFinance();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (filterType !== 'all' && t.type !== filterType) return false;
        if (filterCategory !== 'all' && !t.splits.some(s => s.categoryId === filterCategory)) return false;
        if (filterStartDate && new Date(t.date) < new Date(filterStartDate)) return false;
        // Add one day to end date to include the selected day
        if (filterEndDate) {
            const endDate = new Date(filterEndDate);
            endDate.setDate(endDate.getDate() + 1);
            if (new Date(t.date) > endDate) return false;
        }
        return true;
      });
      // No need to sort here, backend provides sorted data by date
  }, [transactions, filterType, filterCategory, filterStartDate, filterEndDate]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <option value="all">All Types</option>
          <option value={TransactionType.INCOME}>Income</option>
          <option value={TransactionType.EXPENSE}>Expense</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
        <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id} className="border-b dark:border-gray-700">
                <td className="p-4">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-4 font-medium">{t.description}</td>
                <td className={`p-4 font-bold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}${t.totalAmount.toFixed(2)}
                </td>
                <td className="p-4">
                    {t.splits.length > 1 ? (
                        <ul className="list-disc list-inside text-sm">
                            {t.splits.map((s, i) => (
                                <li key={i}>{getCategoryName(s.categoryId)}: ${s.amount.toFixed(2)}</li>
                            ))}
                        </ul>
                    ) : (
                        getCategoryName(t.splits[0].categoryId)
                    )}
                </td>
              </tr>
            ))}
             {filteredTransactions.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-500">No transactions found for the selected filters.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsView;
