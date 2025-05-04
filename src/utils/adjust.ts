import {cloneDeep} from 'lodash'
import {getOffsetOfWeekdayWord,getOffsetOfDayWord} from './get.ts'
import {zhDigitToArabic} from './number.ts'
import {convertChineseNumberToArabicNumberByWhole} from './convert.ts'

// 将两替换为二，从而能够使用zhDigitToArabic将中文数字变为阿拉伯数字
function replaceTwoWithEr(string) {
    return string.replace(/两/g, '二'); // 使用正则表达式全局替换
}

// 使用相对日期的天数词调整日期，如：昨天、前天、前一天
export const adjustDateByDayWordArray = (date:Date, dayWordArray:string[])=>{
    const cloneDate = cloneDeep(date)
    const cloneWordArray = cloneDeep(dayWordArray)
    let dayTotalOffset = 0;
    cloneWordArray?.forEach((item)=>{
        dayTotalOffset += getOffsetOfDayWord(item)
    })
    if(dayTotalOffset!==0){
        cloneDate.setDate(cloneDate.getDate() + dayTotalOffset);
    }
    return cloneDate;
}

// 使用相对日期的星期天数词调整日期，如：星期五，星期六
export const adjustDateByWeekDayWord = (date:Date,weekdayWord:string)=>{
    const cloneDate = cloneDeep(date)

    const weekdayOfDate = cloneDate.getDay();
    const dayOffset = (getOffsetOfWeekdayWord(weekdayWord) - weekdayOfDate + 7) % 7;
    cloneDate.setDate(cloneDate.getDate() + dayOffset);
    return cloneDate;
}

// 使用相对日期的星期词调整日期，如：上一周，前一周，下一周
export const adjustDateByWeekWordArray = (date:Date,weekWordArray:string[])=>{
    const cloneDate = cloneDeep(date)
    const cloneWeekWordArray = cloneDeep(weekWordArray)

    let weekTotalOffset = 0;
    const regex = /^(上|下|那|本|前|后)(\d*|[零一二三四五六七八九十]*)(周)$/;
    cloneWeekWordArray?.forEach((item)=>{
        const match = replaceTwoWithEr(item).match(regex);
        if (match) {
            const direction = match[1]; // '上' 或 '下'
            const chineseNum = match[2] || '零'; // 默认是 '一'
            const multiplier = convertChineseNumberToArabicNumberByWhole(chineseNum); // 转换为阿拉伯数字

            if(direction === '上' ||direction === '前')  weekTotalOffset +=  -1
            if(direction === '下' ||direction === '后') weekTotalOffset +=  1
        }
    })
    if(weekTotalOffset!==0){
        cloneDate.setDate(cloneDate.getDate() + weekTotalOffset * 7);
    }
    return cloneDate;
}

// 使用相对日期的星期词调整日期，如：上一周，前一周，下一周
export const adjustDateByWeekWord = (date:Date,weekWord:string)=>{
    const cloneDate = cloneDeep(date)
    console.log(date,weekWord)
    const regex = /^(上|下|那|本|前|后)(\d*|[\u4E00-\u9FA5]*)(周)$/;
    const match = replaceTwoWithEr(weekWord).match(regex);
    if (match) {
        const direction = match[1]; // '上' 或 '下'
        const chineseNum = match[2] || '零'; // 默认是 '一'
        const multiplier = zhDigitToArabic(chineseNum); // 转换为阿拉伯数字
        const daysOffset = (direction === '上' ? -1 : 1) * (multiplier * 7); // 计算天数偏移
        cloneDate.setDate(cloneDate.getDate() + daysOffset); // 调整日期
    }
    return cloneDate;
}
