
import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CATEGORY_MAP } from '../constants';

const Dashboard: React.FC = () => {
  const { transactions, goals, getCategoryName } = useFinance();

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const summary = transactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.INCOME) acc.totalIncome += t.totalAmount;
        else acc.totalExpenses += t.totalAmount;
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );
    return { ...summary, balance: summary.totalIncome - summary.totalExpenses };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .flatMap(t => t.splits)
      .forEach(split => {
        categoryMap[split.categoryId] = (categoryMap[split.categoryId] || 0) + split.amount;
      });
    
    return Object.entries(categoryMap).map(([id, amount]) => ({
      name: getCategoryName(id),
      value: amount,
    }));
  }, [transactions, getCategoryName]);

  const monthlyData = useMemo(() => {
    const dataByMonth: { [key: string]: { name: string; income: number; expenses: number } } = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { name: month, income: 0, expenses: 0 };
      }
      if (t.type === TransactionType.INCOME) {
        dataByMonth[month].income += t.totalAmount;
      } else {
        dataByMonth[month].expenses += t.totalAmount;
      }
    });
    return Object.values(dataByMonth).reverse();
  }, [transactions]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Income</h3>
          <p className="text-3xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Current Balance</h3>
          <p className="text-3xl font-bold text-indigo-500">${balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Monthly Flow</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#4ade80" name="Income" />
              <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {expenseByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
         <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Active Goals</h3>
         <div className="space-y-4">
           {goals.length > 0 ? goals.map(goal => (
             <div key={goal.id}>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{goal.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                   <div 
                     className="bg-indigo-600 h-4 rounded-full"
                     style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                   ></div>
                </div>
             </div>
           )) : <p className="text-gray-500 dark:text-gray-400">No goals set yet. Go to the Goals tab to create one!</p>}
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
