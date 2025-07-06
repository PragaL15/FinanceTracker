
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AlertTriangleIcon } from './ui/Icons';

const useWeeklyCheck = () => {
    const [shouldShow, setShouldShow] = useState(false);
    const { transactions } = useFinance();

    useEffect(() => {
        const lastCheck = localStorage.getItem('investmentLastCheck');
        const now = new Date();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        // Only check once a week
        if (lastCheck && now.getTime() - new Date(lastCheck).getTime() < oneWeek) {
            return;
        }

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const investmentCategoryId = 'cat_exp_7';

        const hasInvestedThisMonth = transactions.some(t => 
            new Date(t.date) >= startOfMonth &&
            t.splits.some(s => s.categoryId === investmentCategoryId)
        );
        
        if (!hasInvestedThisMonth) {
            setShouldShow(true);
        }

        localStorage.setItem('investmentLastCheck', now.toISOString());

    }, [transactions]);
    
    return shouldShow;
};

const InvestmentReminder: React.FC = () => {
    const shouldShowReminder = useWeeklyCheck();

    if (!shouldShowReminder) {
        return null;
    }

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md mb-6" role="alert">
            <div className="flex">
                <div className="py-1"><AlertTriangleIcon className="h-6 w-6 text-yellow-500 mr-4"/></div>
                <div>
                    <p className="font-bold">Friendly Reminder</p>
                    <p className="text-sm">You haven't logged an investment this month. Staying consistent is key to reaching your financial goals!</p>
                </div>
            </div>
        </div>
    );
};

export default InvestmentReminder;
