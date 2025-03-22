export interface AccountingDetail {
    puchaseGoods: string; // 内容,即购买项、收入项
    totalPrice: number;  // 价格
    recordingTime：PuchaseTime; //产生时间
    accountingType: 'income' | 'expense'; // 收/支
}

type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
// 日历信息读取结构
interface PuchaseTime{
    calenderDay: Date;
    weekDay: Weekday;
}