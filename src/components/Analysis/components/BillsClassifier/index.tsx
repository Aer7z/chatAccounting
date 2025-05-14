import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useModel} from './hooks/useModel.ts'
import {styles} from './styles.ts';
import {
  getFormatDate,
  getCategoryForShow,
  getWeekdayForShow,
  getAccountingTypeForShow
} from '../../../../utils/get.ts';

export const BillsClassifier = (props)=>{
    const { bills, setFilterBills } = props
    const { categoryList, personList, weekdayList, accountingTypeList, dateList} = useModel(props)

    const [selectedCategory,updateSelectedCategory] = useState('any')
    const [selectedPerson,updateSelectedPerson] = useState('任意')
    const [selectedWeekday,updateSelectedWeekday] = useState('任意')
    const [selectedAccountingType,updateSelectedAccountingType] = useState('any')
    const [selectedTimeEnd_1,updateSelectedTimeEnd_1] = useState('任意')
    const [selectedTimeEnd_2,updateSelectedTimeEnd_2] = useState('任意')

    const isBillPass = (bill)=>{
          const categoryPass = selectedCategory==='any' ||bill?.category === selectedCategory;
          const personPass = selectedPerson==='任意'||bill?.productSub === selectedPerson;
          const weekdayPass = selectedWeekday==='任意'|| getWeekdayForShow(bill?.recordDate) === selectedWeekday;
          const accountingTypePass = selectedAccountingType==='any' || bill?.accountingType === selectedAccountingType;
          const isDateLeftEndPass = selectedTimeEnd_1 === '任意'
          const isDateRightEndPass = selectedTimeEnd_2 === '任意'
          let isDateRangePass = isDateLeftEndPass && isDateRightEndPass

          if(!isDateRangePass){
            const leftDate = new Date(selectedTimeEnd_1)
            const rightDate = new Date(selectedTimeEnd_2)
            const nowDate = new Date(getFormatDate(bill?.recordDate))
            isDateRangePass = (nowDate>=leftDate && (isDateRightEndPass || nowDate<=rightDate))||(nowDate<=rightDate && (isDateLeftEndPass|| nowDate>=leftDate))
          }
          return categoryPass && personPass && weekdayPass && accountingTypePass && isDateRangePass
    }

    useEffect(()=>{
        const filterBillByFilter = bills?.filter(isBillPass)
        setFilterBills(filterBillByFilter)
    },[bills,selectedCategory,selectedPerson,selectedWeekday,selectedAccountingType,selectedTimeEnd_1,selectedTimeEnd_2])

    return (
        <>
            <View style={styles.firstRow}>
                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={updateSelectedCategory}
                    mode='dropdown'
                    style={{ width:'25%'}}
                >
                    {categoryList.map((item)=>(<Picker.Item key={item} label={getCategoryForShow(item)} value={item}/>))}
                </Picker>
                <Picker
                    selectedValue={selectedPerson}
                    onValueChange={updateSelectedPerson}
                    mode='dropdown'
                    style={{ width:'25%'}}
                >
                    {personList.map((item)=>(<Picker.Item key={item} label={item} value={item}/>))}
                </Picker>
                <Picker
                    selectedValue={selectedWeekday}
                    onValueChange={updateSelectedWeekday}
                    mode='dropdown'
                    style={{ width:'29%'}}
                >
                    {weekdayList.map((item)=>(<Picker.Item key={item} label={item} value={item}/>))}
                </Picker>
                <Picker
                    selectedValue={selectedAccountingType}
                    onValueChange={updateSelectedAccountingType}
                    mode='dropdown'
                    style={{ width:'25%'}}
                >
                     {accountingTypeList.map((item)=>(<Picker.Item key={item} label={getAccountingTypeForShow(item)} value={item}/>))}
                </Picker>
            </View>
            <View style={styles.secondRow}>
                <Picker
                    selectedValue={selectedTimeEnd_1}
                    onValueChange={updateSelectedTimeEnd_1}
                    mode='dropdown'
                    style={styles.secondRowMultipleSelect}
                >
                    {dateList.map((item)=>(<Picker.Item key={item} label={item} value={item}/>))}
                </Picker>
                <Picker
                    selectedValue={selectedTimeEnd_2}
                    onValueChange={updateSelectedTimeEnd_2}
                    mode='dropdown'
                    style={styles.secondRowMultipleSelect}
                >
                    {dateList.map((item)=>(<Picker.Item key={item} label={item} value={item}/>))}
                </Picker>
            </View>
        </>
    )
}