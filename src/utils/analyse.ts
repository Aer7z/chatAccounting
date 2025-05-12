import {
  Segment,
  useDefault,
  pangu,
  panguExtend1,
  panguExtend2,
} from 'segmentit';
import {cloneDeep} from 'lodash'
import {getWStr,getPStr} from './get.ts'
import {
  addUnitWithNumber,
  convertChineseTimeStrToFormatArabicTimeStr,
  convertChineseDateStrToFormatArabicDateStr,
  convertDateToDateStr,
} from './convert.ts';
import {
  getTimeParts,
  getTimeFormatStr,
  getOffsetOfDayWord,
  getDateFormatStr,
  getOffsetOfWeekdayWord,
  getHours,
  replaceHours,
  getCategory
} from './get.ts';

import {
  adjustDateByWeekDayWord,
  adjustDateByWeekWord,
  adjustDateByDayWordArray,
  adjustDateByWeekWordArray,
} from './adjust.ts';
const segmentit = useDefault(new Segment());

const loadDict = (segmentit) => {
  segmentit.loadDict(pangu);
  segmentit.loadDict([panguExtend1, panguExtend2]);
  const verbDict =
    '花了|0x1000|13840\n用了|0x1000|13840\n吃了|0x1000|13840\n洗车|0x1000|13840\n交了|0x1000|13840\n拿到了|0x1000|13840\n拿了|0x1000|13840';
  const dateDict = '那周|0x4000|4123\n这周|0x4000|4123\n后天|0x4000|800000\n这天|0x4000|800000\n';
  const contentDict ='地三鲜|0x100000|500000\n';
  const timeDict =
    '星期一|0x400000|4123\n星期1|0x400000|4123\n星期二|0x400000|4124\n星期2|0x400000|4124\n星期三|0x400000|4125\n星期3|0x400000|4125\n星期四|0x400000|4126\n星期4|0x400000|4126\n星期五|0x400000|4127\n星期5|0x400000|4127\n星期六|0x400000|4128\n星期6|0x400000|4128\n星期日|0x400000|4129\n星期天|0x400000|4129\n星期7|0x400000|4129';
  const dict4Time =
    '0点|0x4000|30000\n1点|0x4000|30000\n2点|0x4000|30000\n3点|0x4000|30000\n4点|0x4000|30000\n5点|0x4000|30000\n6点|0x4000|30000\n7点|0x4000|30000\n8点|0x4000|30000\n9点|0x4000|30000\n10点|0x4000|30000\n11点|0x4000|30000\n12点|0x4000|30000\n13点|0x4000|30000\n14点|0x4000|30000\n15点|0x4000|30000\n16点|0x4000|30000\n17点|0x4000|30000\n18点|0x4000|30000\n19点|0x4000|30000\n20点|0x4000|30000\n21点|0x4000|30000\n22点|0x4000|30000\n23点|0x4000|30000';
  segmentit.loadDict(verbDict);

  segmentit.loadDict(dateDict);
  segmentit.loadDict(contentDict);

  segmentit.loadDict(timeDict);
  segmentit.loadDict(dict4Time);
};

export const analyseText = (inputText)=>{
    const segmentit = useDefault(new Segment());
    loadDict(segmentit)
    console.log('inputText',inputText)
    const words = segmentit.doSegment(inputText, {
      stripPunctuation: true,
      //       convertSynonym: true
    });
    const containPersonPronoun = words?.filter((item)=>getPStr(item)==='65536')?.length>=1
    if(!containPersonPronoun) {
        words.unshift({p:65536,w:'我'})
    }
    console.log(words);
    const resultOfHandleDateAndTime = handleDateAndTime(words);
    let tempStr = resultOfHandleDateAndTime?.resultStr;
    let timeArray = resultOfHandleDateAndTime?.timeArray;
    console.log('handleDateAndTime', tempStr);
    const resultOfAnalyseTime = analyseTime(timeArray);
    console.log('resultOfAnalyseTime',resultOfAnalyseTime)
    tempStr = handleSurplusAuxiliary(
      segmentit.doSegment(tempStr, {
        stripPunctuation: true,
      }),
    );
    console.log('handleSurplusAuxiliary', tempStr);
    tempStr = handleSurplusPreposition(
      segmentit.doSegment(tempStr, {
        stripPunctuation: true,
      }),
    );
    console.log('handleSurplusPreposition', tempStr);

    const resultOfHandlePersonMoneyAndContent = handlePersonMoneyAndContent(
      segmentit.doSegment(tempStr, {
        stripPunctuation: true,
      }),
    );
    console.log(
      'resultOfHandlePersonMoneyAndContent',
      resultOfHandlePersonMoneyAndContent,
    );
    return {
        accountingType: resultOfHandlePersonMoneyAndContent?.type,
        category: getCategory(resultOfHandlePersonMoneyAndContent?.billContent),
        content:resultOfHandlePersonMoneyAndContent?.billContent,
        description: inputText,
        productSub:resultOfHandlePersonMoneyAndContent?.person,
        recordDate: new Date(resultOfAnalyseTime),
        totalPrice:Number(resultOfHandlePersonMoneyAndContent?.money),
    }
}

function replaceTime(dateString, hours, minutes, seconds) {
  // 创建日期对象
  const date = new Date(dateString);

  // 设置新的时间
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  return date; // 返回更新后的日期对象
}

export const getTime = (timeArray = []) => {
    console.log('timeArray',timeArray)
  const accurateTimeKeyWords = ['时', '点', '分', '秒'];
  const blurredTimeKeyWordsAfter12 = ['中午', '晚上', '下午'];
  const blurredTimeKeyWordsMap = {
      '凌晨':2,'早上':8,'早晨':8,'中午':12,'正午':12,'下午':15,'黄昏':17,'晚上':20,'午夜':23
  }
   const blurredTimeKeyWordsArray = ['凌晨','早上','早晨','中午','正午','下午','黄昏','晚上','午夜']
  const timeKeywordRegExp = /\d+[时分秒点]+/g;
  const timeWord = timeArray?.filter(item =>
    timeKeywordRegExp.test(getWStr(item)),
  );

  //     console.log('timeWord',timeWord,getWStr(timeWord))
  let time = '';
  if(timeWord?.length === 1){
    time = convertChineseTimeStrToFormatArabicTimeStr(getWStr(timeWord));
    const dayWord = timeArray?.find(item =>
      blurredTimeKeyWordsAfter12?.includes(getWStr(item)),
    );
    //     console.log('dayWord',dayWord)
    if (getWStr(dayWord) === '中午' && getHours(time)) {
      if (getHours(time) < 4) {
        time = replaceHours(time, getHours(getWStr(timeWord[0])) + 12);
      }
    }else if (getWStr(dayWord) === '下午' || getWStr(dayWord) === '晚上') {
      if (getHours(time) < 13) {

        console.log('>>time ',time,getHours(getWStr(timeWord[0])), getWStr(timeWord[0]).match(timeKeywordRegExp));
        time = replaceHours(time, getHours(getWStr(timeWord[0]))+ 12);
      }
    }else {
        time = replaceHours(time, getHours(getWStr(timeWord[0])));
    }
  }else{
      const blurredTimeKeyWord = timeArray?.find((item)=>blurredTimeKeyWordsArray?.includes(getWStr(item)))
        time = replaceHours('00:00:00', blurredTimeKeyWordsMap?.[getWStr(blurredTimeKeyWord)] || '0');
        console.log('>>>time',time)
  }

  return time;
};

export const handleMoney = array => {
  const moneyArray = ['块', '毛', '元', '美元', '欧元'];
  let resultArray = cloneDeep(array);
  resultArray = resultArray
    .map((item, index) => {
      if (
        (item?.p !== undefined && item?.w?.toString() === '去') ||
        item?.w?.toString() === '在'
      ) {
        if (index === resultArray?.length - 1) {
          return undefined;
        } else if (getPStr(resultArray[index + 1]) !== '1048576') {
          return undefined;
        }
      }
      return item;
    })
    .filter(item => item !== undefined);
  return resultArray?.map(item => item?.w)?.join('');
};

export const handlePerson = (initArrayBeforeVerb = [], hasBillContent = false) => {
 const cloneArray = cloneDeep(initArrayBeforeVerb);
 const nounCount = cloneArray?.filter(
   item => getPStr(item) === '1048576',
 )?.length;
 let resultPersonStr = '';
 // 如果包含消费内容，且只有“消费内容”一个名词
 console.log('>>>initArrayBeforeVerb',initArrayBeforeVerb)
 if (hasBillContent && nounCount === 1) {
   if (getPStr(cloneArray?.[0]) !== '1048576') {
     resultPersonStr = cloneArray?.[0]?.w?.toString();
   }
 }
 // 如果消费内容不在首个动词前，或者动词前不止消费内容一个名词，也就是包含人称名词
 if ((hasBillContent && nounCount > 1) || !hasBillContent) {
   const peoplePArray = ['65536', '8192', '1048576'];
   const arrayWithPronounAndAuxiliary = ['8192', '65536'];
   for (let i = 0; i < cloneArray?.length; i++) {
     if (
       cloneArray?.[i]?.p === undefined ||
       peoplePArray?.includes(getPStr(cloneArray?.[i]))
     ) {
       resultPersonStr += cloneArray?.[i]?.w?.toString();
       if (
         i+1 < cloneArray?.length &&
         getPStr(cloneArray?.[i]) === '1048576' &&
         (getPStr(cloneArray?.[i+1]) === '1048576')
       ) {
         break;
       }
     }
   }
 }
 //如果不包含消费主体，则默认是自己
 if (resultPersonStr === '') resultPersonStr = '我';
 return resultPersonStr;
};

// 处理消费主体、消费内容和钱的数量
// 按照局内的动词数量划分
// 一个动词，那么钱的数量肯定在动词后，主体和内容不确定
// 两个动词，一个动词后包含钱的数量，另一个动词和消费内容挂钩，如果该动词后不包含名词，那么则说明该动词就是消费内容本身
export const handlePersonMoneyAndContent = array => {
  const verbArray = [];
  const cloneArray = cloneDeep(array)
  console.log('>>>array',array)
  const outputVerbArray = ['花了','用了','消费','交了']
  array?.forEach((item, index) => {
    if (getPStr(item) === '4096') {
      verbArray.push({index: index, w: item?.w});
    }
  });
  const billObj = {
    person: '',
    billContent: '',
    money: '0',
    type: 'income'
  };
  const arrayBeforeVerb = array?.slice(0, verbArray?.[0]?.index);
  verbArray.forEach((item)=>{
      if(outputVerbArray?.includes(getWStr(item))){
        billObj.type = 'expense'
      }
  })
  //动词数量决定了账单的消费内容的位置
  if (verbArray?.length === 2) {
    billObj.person = handlePerson(arrayBeforeVerb, false);
    const sliceWithVerb = [];
    sliceWithVerb.push(
      array?.slice(verbArray?.[0]?.index, verbArray?.[1]?.index),
    );
    sliceWithVerb.push(array?.slice(verbArray?.[1]?.index));
    //     console.log('sliceWithVerb',sliceWithVerb)
    let moneyIndex = 0;
    for (let i = 0; i < 2; i++) {
      let tempMoney = detectMoney(sliceWithVerb[i]);
      if (tempMoney !== '') {
        billObj.money = tempMoney;
      } else {
        billObj.billContent = String(
          sliceWithVerb[i]?.find(item_ => {
            return (
              getPStr(item_) === '1048576' ||
              getPStr(item_) === '8' ||
              getPStr(item_) === undefined ||
              getPStr(item_) === '0'
            );
          })?.w,
        );
        if(billObj.billContent==='undefined') {
            billObj.billContent = String(
              sliceWithVerb[i]?.find(item_ => {
                return (
                  getPStr(item_) === '4096'
                );
              })?.w,
            )
        }
      }
    }
  }
  if (verbArray?.length === 1) {
    const nounCount = arrayBeforeVerb?.filter(
      item => getPStr(item) === '1048576',
    )?.length;
    billObj.person = handlePerson(arrayBeforeVerb, true);
    billObj.billContent = cloneArray
      ?.find(
        item =>
          getPStr(item) === '1048576' ||
          getPStr(item) === '8' ||
          getPStr(item) === undefined ||
          getPStr(item) === '0'
      )
      ?.w?.toString();
    billObj.money = detectMoney(array?.slice(verbArray?.[0]?.index));
  }
  const regex = /\d+/; // 匹配一个或多个数字
  const match = billObj.money.match(regex);
  billObj.money = match ? match[0] : billObj.money;
  return billObj;
};

// 关于钱的数量的数词和数量词的处理：
// 如果按照动词划分的数组里包含的是数词，则说明这就是“钱的数量”
// 如果是数量词，则有两种可能性：1、识别错误；2、本身就不是。
// 数量词的识别：查询数量词后方是否包含”助词“或者”名词“，也就是检测是否出现符合数量词使用场景的词语
const detectMoney = (initArray = []) => {
  const cloneArray = cloneDeep(initArray);
  let resultMoneyStr = '';

  // 是否含有数词
  const numeralWordArray = cloneArray?.filter(
    item => getPStr(item) === '4194304',
  );
  const hasNumeralWord = numeralWordArray?.length !== 0;
  // 是否含有数量词
  const quantifierArray = cloneArray?.filter(
    item => getPStr(item) === '2097152',
  );
  const hasQuantifier = quantifierArray?.length !== 0;
  if (hasNumeralWord) {
    resultMoneyStr = numeralWordArray?.[0]?.w?.toString();
  } else if (hasQuantifier) {
    const detectArray = ['1048576', '8192'];
    for (let i = 0; i < cloneArray?.length; i++) {
      if (getPStr(cloneArray[i]) === '2097152') {
        // 如果数量词就是末尾，说明就是“钱”
        if (i === cloneArray?.length) {
          resultMoneyStr = cloneArray?.[i]?.w?.toString();
        }
        // 如果数量词后不是“助词”或者“名词”或者这个数量词本身包含钱的单位
        if (!detectArray?.includes(getPStr(cloneArray[i + 1]))||getWStr(cloneArray[i])?.includes('块')) {
          resultMoneyStr = cloneArray?.[i]?.w?.toString();
        }
      }
    }
  }
  return resultMoneyStr;
};


//处理多余的“的”
export const handleSurplusAuxiliary = array => {
  let resultArray = cloneDeep(array);
  resultArray = resultArray
    .map((item, index) => {
      if (item?.p !== undefined && item?.w?.toString() === '的') {
        if (index === 0) {
          return undefined;
        } else if (
          getPStr(resultArray[index - 1]) !== '65536' &&
          getPStr(resultArray[index - 1]) !== '1048576'
        ) {
          return undefined;
        }
      }
      return item;
    })
    .filter(item => item !== undefined);
  return resultArray?.map(item => item?.w)?.join('');
};

export const handleDateAndTime = array => {
  let timeKeyWord = ['年', '月', '日', '点', '时', '星期', '周'];
  let pKeyWord = ['16384', '4194304'];
  // 4194304 0x400000 数词 数语素
  // 16384 0x4000 时间词
  // 2097152 0x200000 数量词
  // 4210688

  let resultArray = cloneDeep(array);
  const timeArray = [];
  for (let i = 0; i < resultArray?.length; i++) {
    if (
      getWStr(resultArray[i])?.includes('点') &&
      getPStr(resultArray[i]) === '2097152'
    ) {
      if (i + 1 != array?.length && getPStr(array[i]) !== '8192') {
        resultArray[i].p = '4194304';
      }
    }
  }
//
  resultArray = resultArray
    .map((item, index) => {
      if (
        item?.p !== undefined &&
        !Array.isArray(item?.p) &&
        pKeyWord.includes(getPStr(item))
      ) {
        if (getPStr(item) === '4194304') {
          let isIncludeTimeKeyword = false;
          timeKeyWord?.forEach(timeWord => {
            if (!isIncludeTimeKeyword) {
              isIncludeTimeKeyword = item?.w?.toString()?.includes(timeWord);
            }
          });
          if (isIncludeTimeKeyword) {
            timeArray.push(item);
          }
          return isIncludeTimeKeyword ? undefined : item;
        }
        timeArray.push(item);
        return undefined;
      }
      return item;
    })
    .filter(item => item !== undefined);
  // 星期|0x100000|4122
  // 星期一|0x400000|4123\n星期1|0x400000|4123

  console.log('timeArray', timeArray);

  return {
    timeArray: timeArray,
    resultStr: resultArray?.map(item => item?.w)?.join(''),
  };
};

export   const analyseTime = initTimeArray => {
    if(initTimeArray?.length===0)
    return new Date();
   console.log('initTimeArray', initTimeArray);
   const timeKeyWords = ['年', '月', '日', '号'];
   const cloneTimeArray = cloneDeep(initTimeArray);

   let resultOfAnalyseDate = new Date()
   const timeStr = cloneTimeArray
     ?.filter(item => {
       let state = false;
       timeKeyWords?.forEach(timeKeyWord => {
         if (getWStr(item)?.includes(timeKeyWord)) {
           state = true;
         }
       });
       return state;
     })
     ?.map(item => getWStr(item))
     ?.join('');

   console.log(
     'timeStr',
     timeStr,
     convertChineseDateStrToFormatArabicDateStr(timeStr),
   );
   if(timeStr!==''){
      resultOfAnalyseDate = new Date(
        convertChineseDateStrToFormatArabicDateStr(timeStr),
      );
   }


   const weekWordArray = cloneTimeArray
     .filter(
       item => getWStr(item)?.endsWith('周') || getWStr(item)?.endsWith('星期'),
     )
     ?.map(item => getWStr(item));
   if (weekWordArray?.length !== 0) {
     resultOfAnalyseDate = adjustDateByWeekWordArray(
       resultOfAnalyseDate,
       weekWordArray,
     );
   }
   console.log('处理周数', resultOfAnalyseDate);
   const weekDay = cloneTimeArray.find(
     item =>
       getWStr(item)?.startsWith('周') || getWStr(item)?.startsWith('星期'),
   );
   if (weekDay)
     resultOfAnalyseDate = adjustDateByWeekDayWord(
       resultOfAnalyseDate,
       getWStr(weekDay),
     );
   console.log('处理周几', resultOfAnalyseDate, getWStr(weekDay));

   const dayWordArray = cloneTimeArray
     .filter(item => getWStr(item)?.endsWith('天'))
     ?.map(item => getWStr(item));
   if (dayWordArray?.length !== 0) {
     resultOfAnalyseDate = adjustDateByDayWordArray(
       resultOfAnalyseDate,
       dayWordArray,
     );
   }
   console.log('处理天数偏移', resultOfAnalyseDate);
    console.log('0')
   const timeOfOffset = getTime(cloneTimeArray);
   console.log('1',timeOfOffset)
   const resultTimeObj = getTimeParts(timeOfOffset);
      console.log('2',resultTimeObj)
   resultOfAnalyseDate = replaceTime(
     resultOfAnalyseDate,
     resultTimeObj?.hours,
     resultTimeObj?.minutes,
     resultTimeObj?.seconds,
   );
   console.log('3')

   console.log('处理时间偏移', resultOfAnalyseDate, timeOfOffset);
   return resultOfAnalyseDate;
 };




//处理多余的“在”和“去”
// 262144 POSTAG.D_P  = 0x00040000; // 介词
export const handleSurplusPreposition = array => {
  let resultArray = cloneDeep(array);
  resultArray = resultArray
    .map((item, index) => {
      if (
        (item?.p !== undefined && item?.w?.toString() === '去') ||
        item?.w?.toString() === '在'
      ) {
        if (index === resultArray?.length - 1) {
          return undefined;
        } else if (getPStr(resultArray[index + 1]) !== '1048576') {
          return undefined;
        }
      }
      return item;
    })
    .filter(item => item !== undefined);
  return resultArray?.map(item => item?.w)?.join('');
};