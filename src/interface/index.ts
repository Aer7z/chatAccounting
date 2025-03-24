export interface BillDetail {
    id: string; // 账单uuid
    description: string; // 账单描述，比如午餐花了20块
    content: string; // 内容,即购买项、收入项
    totalPrice: number;  // 价格
    recordDay：string; // 产生时间(天)
    recordHourMinSec: string;  // 产生时间(小时分钟秒)
    recordWeekDay: Weekday; // 产生时间(星期几)
    accountingType: 'income' | 'expense'; // 收/支
}

type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

