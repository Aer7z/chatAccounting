import uuid from 'react-native-uuid';
import { BillDetail } from  '../interface/index.ts';

// 存储数据
const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@storage_Key', value);
  } catch (e) {
    // 保存错误
  }
};

// 读取数据
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@storage_Key');
    if (value !== null) {
      console.log(value); // 读取的数据
    }
  } catch (e) {
    // 读取错误
  }
};

export const getDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 确保月份是两位数
    const day = String(date.getDate()).padStart(2, '0'); // 确保日期是两位数

    return `${year}-${month}-${day}`; // 返回格式化的日期
};

export const getHourMinSec = (date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${hour}-${minute}-${second}`; // 返回格式化的时间
};

export const  getWeekday = (date) => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay(); // 获取星期几的整数（0-6）
    return weekdays[dayIndex]; // 返回对应的星期名称
};



export const analysisBill = (message:string) => {
    const resultBill:BillDetail = {
         id: uuid.v4(),
         description: message,
         content: '',
         totalPrice: 0,
         recordDay: getDate(new Date()),
         recordHourMinSec: getHourMinSec(new Date()),
         recordWeekDay: getWeekday(new Date()),
         accountingType: '',
     };
    const expenseBillMatch = message.match(/(.+)(花了|吃了|用了)(\d+)/);
    if (expenseBillMatch) {
        resultBill.content = expenseBillMatch[1].trim();
        resultBill.totalPrice = parseFloat(expenseBillMatch[3]);
        resultBill.accountingType = 'expense';
    }
    const incomeBillMatch = message.match(/(.+)(发了|给了)(\d+)/);
    if (incomeBillMatch) {
        resultBill.content = incomeBillMatch[1].trim();
        resultBill.totalPrice = parseFloat(incomeBillMatch[3]);
        resultBill.accountingType = 'income';
    }
   return resultBill;
};
