import { useState } from 'react'

export const useModel = (props) => {
    const {filterBills,dayCount} = props;
    const totalIncome = filterBills.reduce((acc, bill) => {
        return bill.accountingType === 'income' ? acc + bill.totalPrice : acc;
    }, 0);
    const totalExpense = filterBills.reduce((acc, bill) => {
        return bill.accountingType === 'expense' ? acc + bill.totalPrice : acc;
    }, 0);
    return {
        totalIncome,
        totalExpense,
        averageIncome: totalIncome / dayCount,
        averageExpense: totalExpense / dayCount
    }
}