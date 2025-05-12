import {zhDigitToArabic} from './number.ts'
import {getTimeFormatStr,getDateFormatStr} from './get.ts'
import {isNil,isNumber,isDate, omit} from 'lodash'

// 如果十二、十这种单位十开头的词语，补充为一十二
export const addUnitWithNumber = (chineseNumStr:string) => {
    if (chineseNumStr.startsWith("十")) {
        return "一" + chineseNumStr; // 在“十”前加上“一”
    }
    return chineseNumStr; // 否则返回原字符串
}

export const convertDataBaseBillDataToFrontUse = (data) =>{
    const cloneBill = cloneDeep(data)
    return omit(cloneBill,['id'])
}

const isNumberOrNumberStr = (data) => !isNaN(Number(data))

// 将中文数字转为阿拉伯数字
export const convertChineseNumberToArabicNumberByWhole = (initChineseNumber:string|number)=>{
    if(isNumberOrNumberStr(initChineseNumber)) return Number(initChineseNumber)
    const chineseNumberStr = addUnitWithNumber(initChineseNumber)
    const arabicNumber = zhDigitToArabic(chineseNumberStr)
    return  arabicNumber;
}

// 将Date形式的数据转为规范的时间字符串
export const convertDateToDateStr = (date: Date) => {
    if(!isDate(date)) throw error('无法转换非Date类型的数据')
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}


//转换中文的描述一天时间的字符串，如十二点十分十秒，为规范的时间字符串，如12:09:06
export const convertChineseTimeStrToFormatArabicTimeStr = (timeStr)=> {
    // 正则匹配，获取对应的小时、分钟、秒
    const hoursMatch = timeStr?.match(/(\d+|[零一二三四五六七八九十]+)(点|时)/);
    const minutesMatch = timeStr?.match(/(点|时)(\d+|[零一二三四五六七八九十]+)/);
    const secondsMatch = timeStr?.match(/(分)(\d+|[零一二三四五六七八九十]+)/);
    // 转换中文数字为阿拉伯数字格式
    const hours = !isNil(hoursMatch) ? convertChineseNumberToArabicNumberByWhole(hoursMatch[1]) || 0 : 0;
    const minutes = !isNil(minutesMatch) ? convertChineseNumberToArabicNumberByWhole(minutesMatch[2]) || 0 : 0;
    const seconds = !isNil(secondsMatch) ? convertChineseNumberToArabicNumberByWhole(secondsMatch[2]) || 0 : 0;
    // 返回规范的时间字符串，格式: hh-mm-ss
    return getTimeFormatStr(hours,minutes,seconds);
}

// 将中文数字挨个转换为对应的阿拉伯数字，主要用于年份的中文数字处理
function convertChineseNumbersToArabicByAlpha(chineseStr) {
     if(isNumberOrNumberStr(chineseStr)) return Number(chineseStr)
    return chineseStr
      .split('')
      .map(char => zhDigitToArabic(char))
      .join('');
}

// 转换中文的年月日字符串，如二零一五年十月六日，为规范的日期字符串，如2015-10-06
export const convertChineseDateStrToFormatArabicDateStr = (dateStr)=>{
      // 使用正则表达式提取年份、月份和日期
      const regex = /(\d+|[零一二三四五六七八九十]+)年(\d+|[零一二三四五六七八九十]+)月(\d+|[零一二三四五六七八九十]+)日/;
      const match = dateStr?.match(regex);
      if (match) {
        const year = convertChineseNumbersToArabicByAlpha(match[1]); // 转换年份
        const month = convertChineseNumberToArabicNumberByWhole(match[2]); // 转换月份
        const day = convertChineseNumberToArabicNumberByWhole(match[3]); // 转换日期
        return getDateFormatStr(year,month,day);
      }
      return null; // 如果格式不匹配，返回null
}