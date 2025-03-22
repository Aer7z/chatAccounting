import { AccountingDetail } from '../interface/index.ts'

const inputList: AccountingDetail[]  = [ ]

const mockData: AccountingDetail[] = [
    {
        purchaseGoods: "Books",
        totalPrice: 29.99,
        recordingTime: {
            calendarDay: new Date("2025-03-01"),
            weekDay: "Saturday",
        },
        accountingType: 'expense',
    },
    {
        purchaseGoods: "Groceries",
        totalPrice: 75.50,
        recordingTime: {
            calendarDay: new Date("2025-03-05"),
            weekDay: "Wednesday",
        },
        accountingType: 'expense',
    },
    {
        purchaseGoods: "Salary",
        totalPrice: 1500.00,
        recordingTime: {
            calendarDay: new Date("2025-03-10"),
            weekDay: "Monday",
        },
        accountingType: 'income',
    },
    {
        purchaseGoods: "Freelance Work",
        totalPrice: 300.00,
        recordingTime: {
            calendarDay: new Date("2025-03-12"),
            weekDay: "Wednesday",
        },
        accountingType: 'income',
    },
    {
        purchaseGoods: "Dinner Out",
        totalPrice: 45.00,
        recordingTime: {
            calendarDay: new Date("2025-03-15"),
            weekDay: "Saturday",
        },
        accountingType: 'expense',
    },
    {
        purchaseGoods: "Online Course",
        totalPrice: 120.00,
        recordingTime: {
            calendarDay: new Date("2025-03-20"),
            weekDay: "Thursday",
        },
        accountingType: 'expense',
    },
    {
        purchaseGoods: "Investment Return",
        totalPrice: 500.00,
        recordingTime: {
            calendarDay: new Date("2025-03-22"),
            weekDay: "Saturday",
        },
        accountingType: 'income',
    },
    {
        purchaseGoods: "Rent Payment",
        totalPrice: 800.00,
        recordingTime: {
            calendarDay: new Date("2025-03-25"),
            weekDay: "Tuesday",
        },
        accountingType: 'expense',
    },
];

export inputList = mockData