import { AccountingDetail } from '../interface/index.ts'

const inputList: AccountingDetail[]  = [ ]

const mockData: AccountingDetail[] = [
    {
        description: "午餐花了20块",
        content: "午餐",
        totalPrice: 20,
        recordingTime: {
            calenderDay: new Date("2025-03-01"),
            weekDay: "Saturday",
        },
        accountingType: 'expense',
    },
    {
        description: "晚餐花了30块",
        content: "晚餐",
        totalPrice: 30,
        recordingTime: {
            calenderDay: new Date("2025-03-02"),
            weekDay: "Sunday",
        },
        accountingType: 'expense',
    },
    {
        description: "工资收入",
        content: "工资",
        totalPrice: 3000,
        recordingTime: {
            calenderDay: new Date("2025-03-05"),
            weekDay: "Wednesday",
        },
        accountingType: 'income',
    },
    {
        description: "书籍购买花费50块",
        content: "书籍",
        totalPrice: 50,
        recordingTime: {
            calenderDay: new Date("2025-03-10"),
            weekDay: "Monday",
        },
        accountingType: 'expense',
    },
    {
        description: "兼职收入100块",
        content: "兼职",
        totalPrice: 100,
        recordingTime: {
            calenderDay: new Date("2025-03-12"),
            weekDay: "Wednesday",
        },
        accountingType: 'income',
    },
    {
        description: "电影票花了80块",
        content: "娱乐",
        totalPrice: 80,
        recordingTime: {
            calenderDay: new Date("2025-03-15"),
            weekDay: "Saturday",
        },
        accountingType: 'expense',
    },
    {
        description: "投资回报500块",
        content: "投资",
        totalPrice: 500,
        recordingTime: {
            calenderDay: new Date("2025-03-20"),
            weekDay: "Thursday",
        },
        accountingType: 'income',
    },
    {
        description: "房租支出800块",
        content: "租金",
        totalPrice: 800,
        recordingTime: {
            calenderDay: new Date("2025-03-25"),
            weekDay: "Tuesday",
        },
        accountingType: 'expense',
    },
];

export inputList = mockData