export interface BillDetail {
    id: string; // 账单uuid
    description: string; // 账单描述，比如午餐花了20块
    productSub: string; // 账单的生产主体
    content: string; // 内容,即购买项、收入项
    totalPrice: number;  // 价格
    recordDay：string; // 产生时间(天)
    recordHourMinSec: string;  // 产生时间(小时分钟秒)
    recordWeekDay: WeekdayType; // 产生时间(星期几)
    accountingType: 'income' | 'expense'; // 收/支
}

const weekDays = {
    Monday: '星期一',
    Tuesday: '星期二',
    Wednesday: '星期三',
    Thursday: '星期四',
    Friday: '星期五',
    Saturday: '星期六',
    Sunday: '星期日',
};

export type WeekdayType = keyof typeof weekDays

export interface BillDetailType {
    accountingType: 'income' | 'expense'; // 收/支
    category: string; // 账单分类
    id: string; // 账单uuid
    content: string; // 内容,即购买项、收入项
    description: string; // 账单描述，比如午餐花了20块
    productSub: string; // 账单的生产主体
    recordDate：Date; // 产生时间，包含日期、具体时间
    totalPrice: number;  // 价格
}

