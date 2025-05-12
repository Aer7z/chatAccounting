import {isNumber,isDate} from 'lodash'
import {convertChineseNumberToArabicNumberByWhole}from './convert'

export const getPStr = wordObj => wordObj?.p?.toString();
export const getWStr = wordObj => wordObj?.w?.toString();

export function getHours(timeString) {
  const hours = timeString.split(':')[0]; // 使用冒号分割并获取第一个部分
  return parseInt(hours, 10); // 转换为整数
}

export function replaceHours(timeString, newHour) {
  const parts = timeString.split(':'); // 使用冒号分割时间
  parts[0] = String(newHour).padStart(2, '0'); // 替换小时并确保为两位数
  return parts.join(':'); // 重新组合成时间字符串
}

// 从12:00:00这种格式的字符串中提取对应的小时、分钟、秒
export const getTimeParts = (timeString:string) => {
    const parts = timeString.split(":"); // 使用冒号分割时间字符串
    return {
        hours: parseInt(parts?.[0] || '0', 10),   // 提取小时并转换为整数
        minutes: parseInt(parts?.[1] || '0', 10), // 提取分钟并转换为整数
        seconds: parseInt(parts?.[2] || '0', 10)  // 提取秒并转换为整数
    };
}

// 获得规范格式的日期字符串，用于存储
export function getFormatDate(date:Date) {
    if(!isDate(date)) return `0000-00-00`
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

// 获得规范格式的时间字符串，用于存储
export function getFormatTime(date:Date) {
    if(!isDate(date)) return `00:00:00`
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${hh}:${min}:${ss}`;
}

// 获得日期对应的展示数据
export function getWeekdayForShow(date) {
    if(!isDate(date)) return `未知`
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[date.getDay()];
}


// 获得存储数据
export function getWeekday(date) {
    return date.getDay();
}


// 转数字，防止003这种形式，而后再手动补齐，保证两位数字
const convertToFormatStr = (part:string|number)=>{
    const timePartOfNumberState = isNumber(part) ? part: parseInt(part, 10)
    return String(timePartOfNumberState).padStart(2, '0')
}

// 获得规范格式的时间字符串，格式:hh:mm:ss
export const getTimeFormatStr = (hours:string|number,minutes:string,seconds:string)=>{
    const hourStr = convertToFormatStr(hours)
    const minuteStr = convertToFormatStr(minutes)
    const secondStr = convertToFormatStr(seconds)
    return  `${hourStr}:${minuteStr}:${secondStr}`
}


// 获得规范格式的日期字符串，格式:yyyy-mm-dd
export const getDateFormatStr = (years:string|number,months:string,days:string)=>{
    const yearStr = years
    const monthStr = convertToFormatStr(months)
    const dayStr = convertToFormatStr(days)
    return  `${yearStr}-${monthStr}-${dayStr}`
}

// 获得相对日期的日期偏移
export const getOffsetOfDayWord = (day:string) => {
    const daysMap = {
        '昨天': -1, '前天': -2,
        '大前天': -3,'明天': 1,
        '后天': 2, '大后天': 3,
        '当天':0, '那天':0,
        '那一天':0,
        '后一天':1,
        '前一天':-1
    };
    if(daysMap[day]!==undefined) return daysMap[day]

    const regex = `/(^[前|早|明|晚|后|昨])(\d*|[\u4E00-\u9FA5]*)(天)$/g`
    const match = day.match(regex);
    const beforeDayWords = ['前','早','明']
    if (match) {
        const direction = match[1]; // '上' 或 '下'
        const chineseNum = match[2] || '零'; // 默认是 '一'
        const multiplier = convertChineseNumberToArabicNumberByWhole(chineseNum); // 转换为阿拉伯数字
        const daysOffset = (beforeDayWords?.includes(direction) ? -1 : 1) * multiplier; // 计算天数偏移
        return daysOffset;
    }
    return 0;
}

// 获得星期(周)几代表的日期偏移
export const getOffsetOfWeekdayWord = (weekDay:string) => {
    const daysMap = {
        '周一': 1, '星期一': 1,
        '周二': 2, '星期二': 2,
        '周三': 3, '星期三': 3,
        '周四': 4, '星期四': 4,
        '周五': 5, '星期五': 5,
        '周六': 6, '星期六': 6,
        '周日': 0, '星期日': 0, '周天': 0, '星期天': 0,
        // 可以在这里添加其他任意词语
        'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 0,
    };
    return daysMap[weekDay] !== undefined ? daysMap[weekDay] : 0;
}

// 获得内容对应的分类项
export const getCategory = (content:string) => {
    let category = 'unknown'
    const cateringContainsContent = ['早饭','午饭','晚饭','地三鲜','早餐','午餐','晚餐','吃饭','麦当劳']
    const dayContainsContent = ['洗车','按摩']
    const clothesContainsContent = ['衣服','裤子','外套','袜子','鞋子','卫衣','裙子','短袖','长袖']
    const fruitsContainsContent = ['苹果','水果','橙子','橘子','梨','樱桃','草莓','西瓜','哈密瓜']
    const incomeContainsContent = ['工资','零花钱']
    if (cateringContainsContent?.includes(content)){
        category = 'catering'
    }
    if(dayContainsContent?.includes(content)){
       category = 'day'
    }
    if(clothesContainsContent?.includes(content)){
        category = 'clothes'
    }
    if(fruitsContainsContent?.includes(content)){
        category = 'fruit'
    }
    if(incomeContainsContent?.includes(content)){
        category = 'income'
    }
    return category;
}


export const getCategoryForShow = (category:string)=>{
    if(category === 'catering') return '餐饮'
    if(category === 'day') return '日常'
    if(category === 'clothes') return '衣物'
    if(category === 'fruit') return '水果'
    if(category === 'any') return '任意'
    if(category === 'income') return '收入'
    return '未知'
}


export const getAccountingTypeForShow = (accountingType:string)=>{
    if(accountingType==='expense')return '支出'
    if(accountingType==='income')return '收入'
    if(accountingType==='any')return '任意'
    return '未知'
}