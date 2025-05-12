import {useEffect} from 'react';
import uuid from 'react-native-uuid';
import {BillDetail, WeekdayType} from '../interface/index.ts';
import {getBillDetails} from './SQL/index.ts';
import {analyseText} from './analyse.ts'

// 存储数据
const storeData = async value => {
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

const getDate = (date = new Date(), dayOffset = 0) => {
  const adjustedDate = new Date(date);
  // 根据天数偏移量调整日期
  adjustedDate.setDate(adjustedDate.getDate() + dayOffset);

  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, '0'); // 确保月份是两位数
  const day = String(adjustedDate.getDate()).padStart(2, '0'); // 确保日期是两位数

  return `${year}-${month}-${day}`; // 返回格式化的日期
};

const getHourMinSec = (date = new Date(), hour = 0, minute = 0, second = 0) => {
  const adjustedDate = new Date(date);
  // 设置指定的小时、分钟和秒
  adjustedDate.setHours(hour, minute, second);

  const adjustedHour = adjustedDate.getHours();
  const adjustedMinute = adjustedDate.getMinutes();
  const adjustedSecond = adjustedDate.getSeconds();
  return `${adjustedHour}-${adjustedMinute}-${adjustedSecond}`; // 返回格式化的时间
};

const getWeekday = (date, dayOffset = 0) => {
  const adjustedDate = new Date(date);
  // 根据天数偏移量调整日期
  adjustedDate.setDate(adjustedDate.getDate() + dayOffset);

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayIndex = adjustedDate.getDay(); // 获取星期几的整数（0-6）
  return weekdays[dayIndex]; // 返回对应的星期名称
};

export const handleWeekDayToChinese = (weekday: WeekdayType) => {
  const weekDays = {
    Monday: '星期一',
    Tuesday: '星期二',
    Wednesday: '星期三',
    Thursday: '星期四',
    Friday: '星期五',
    Saturday: '星期六',
    Sunday: '星期日',
  };
  return weekDays[weekday];
};

const handleMessageAboutDate = (message: string, bill: BillDetail) => {
  let resultMessage = message;
  const dateOffsets = {
    那天:0,
    当天:0,
    今天: 0, // 今天
    昨天: -1, // 昨天
    前天: -2, // 前天
    大前天: -3, // 大前天
  };
  // 匹配日期关键词
  for (const keyword in dateOffsets) {
    if (resultMessage.includes(keyword)) {
      bill.recordDay = getDate(new Date(), dateOffsets[keyword]); // 设置日期
      bill.recordWeekDay = getWeekday(new Date(), dateOffsets[keyword]); // 设置日期
      break; // 找到第一个匹配的日期关键词后退出循环
    }
  }
  // 去掉日期和时间关键词
  for (const keyword in dateOffsets) {
    resultMessage = resultMessage.replace(new RegExp(keyword, 'g'), ''); // 移除日期关键词
  }
  return resultMessage;
};

const handleMessageAboutTime = (message: string, bill: BillDetail) => {
  let resultMessage = message;
  const fixHour = {
    早上: 8,
    中午: 12,
    下午: 15,
    晚上: 20,
  };
  for (const keyword in fixHour) {
    if (resultMessage.includes(keyword)) {
      bill.recordHourMinSec = getHourMinSec(new Date(), fixHour[keyword]); // 设置时间
      break; // 找到第一个匹配的时间关键词后退出循环
    }
  }
  for (const keyword in fixHour) {
    resultMessage = resultMessage.replace(new RegExp(keyword, 'g'), ''); // 移除时间关键词
  }
  return resultMessage;
};

const handleMessageAboutProductSub = (message: string, bill: BillDetail) => {
  let resultMessage = message;
  const pronoun = ['我', ''];
  const matchSub = [
    '',
    '爸爸',
    '妈妈',
    '爷爷',
    '奶奶',
    '外公',
    '外婆',
    '表哥',
    '表姐',
    '表弟',
    '表妹',
    '堂哥',
    '堂姐',
    '堂妹',
    '堂弟',
    '舅舅',
    '姑姑',
    '小舅',
    '大舅',
    '小姑',
    '大姑',
    '儿子',
    '女儿',
  ];
  return resultMessage;
};

const handleMessageAboutCategory = (message: string, bill: BillDetail) => {
  let resultMessage = message;

  return resultMessage;
};

export const analysisBill = (message: string) => {
  const resultBill: BillDetail = {
    id: uuid.v4(),
    description: message,
    productSub: '自己',
    content: '',
    totalPrice: 0,
    recordDay: getDate(new Date(), 0), // 默认设置为今天
    recordHourMinSec: getHourMinSec(new Date(), 0, 0, 0), // 默认设置为00:00:00
    recordWeekDay: getWeekday(new Date()),
    accountingType: '',
  };
  message = handleMessageAboutDate(message, resultBill);
  message = handleMessageAboutTime(message, resultBill);
  // 匹配支出账单
  const expenseBillMatch = message.match(/(.+)(花了|吃了|用了)(\d+)/);
  if (expenseBillMatch) {
    resultBill.content = expenseBillMatch[1].trim();
    resultBill.totalPrice = parseFloat(expenseBillMatch[3]);
    resultBill.accountingType = 'expense';
  }
  // 匹配收入账单
  const incomeBillMatch = message.match(/(.+)(发了|给了)(\d+)/);
  if (incomeBillMatch) {
    resultBill.content = incomeBillMatch[1].trim();
    resultBill.totalPrice = parseFloat(incomeBillMatch[3]);
    resultBill.accountingType = 'income';
  }
  return resultBill;
};

export const queryAndSetBills = (_database, setBills, setMessages) => {
  //     console.log('开始读取');
  getBillDetails(_database)
    .then(queryBills => {
      setBills(queryBills); // 更新状态
      if (setMessages) {
        queryBills.forEach(item => {
            if (item.description.trim()) {
              const userMessage = {id: uuid.v4(), text: item.description, sender: 'user'};
              setMessages(prevMessages => [...prevMessages, userMessage]);
              const billMessage = {
                id: uuid.v4(),
                text: `您说的是: ${item.description}`,
                bill: item,
                sender: 'system',
              };
              setMessages(prevMessages => [...prevMessages, billMessage]);
            }
          })
        }
      })
    .catch(error => {
          console.error('读取失败', error);
    });
};
