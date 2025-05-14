import { useState,useEffect } from 'react'
import {isEqual} from 'lodash'
import {
  getFormatDate,
} from '../../../../../utils/get.ts';


export const useModel = (props) => {
    const {bills} = props;
    const [categoryList,updateCategoryList] = useState(['any'])
    const [personList,updatePersonList] = useState(['暂无'])
    const [weekdayList,updateWeekdayList] = useState(['任意','星期一','星期二','星期三','星期四','星期五','星期六','星期日'])
    const [accountingTypeList, updateAccountingTypeList] = useState(['any','expense','income'])
    const [dateList,updateDateList] = useState(['暂无'])

    useEffect(()=>{
      if(bills?.length!==0){
         const newPersonList = Array.from(new Set(bills.map((item)=>item.productSub)))
         newPersonList.unshift('任意')
         if(!isEqual(newPersonList,personList)) updatePersonList(newPersonList)

         const newCategoryList = Array.from(new Set(bills.map((item)=>item.category)))
         newCategoryList.unshift('any')
         if(!isEqual(newCategoryList,categoryList)) updateCategoryList(newCategoryList)

         const newDateList = Array.from(new Set(bills.map((item)=>getFormatDate(item.recordDate))))
         newDateList.unshift('任意')
         if(!isEqual(newDateList,dateList)) updateDateList(newDateList)
      }
    }, [bills])

    return {
        categoryList,
        personList,
        weekdayList,
        accountingTypeList,
        dateList
    }
}