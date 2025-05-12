import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {LineChart} from 'react-native-chart-kit';
import {queryAndSetBills, handleWeekDayToChinese} from '../../utils/index.ts';
import {styles} from './style.ts';
import {BillDetail} from '../../interface/index.ts';
import {
  getFormatDate,
  getFormatTime,
  getWeekdayForShow,
  getCategoryForShow,
  getAccountingTypeForShow
} from '../../utils/get.ts';
import {isEqual} from 'lodash'

import SelectScreen from '../test_1.tsx'


const BillLineChart = ({database}) => {
  const [bills, setBills] = useState<BillDetail[]>([]);
  const [filterBills, setFilterBills] =useState<BillDetail[]>([]);
  const [chartData, setChartData] = useState({
    labels: ['暂无数据', '暂无数据'],
    data: [0, 0],
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [averageIncome, setAverageIncome] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc'); // 默认升序

  const flatListRef = useRef(null); // 用于引用 FlatList

  const [categoryList,updateCategoryList] = useState(['any'])
  const [personList,updatePersonList] = useState(['暂无'])
  const [weekdayList,updateWeekdayList] = useState(['任意','星期一','星期二','星期三','星期四','星期五','星期六','星期日'])
  const [accountingTypeList, updateAccountingTypeList] = useState(['any','expense','income'])
  const [dateList,updateDateList] = useState(['暂无'])

  const [selectedCategory,updateSelectedCategory] = useState('any')
  const [selectedPerson,updateSelectedPerson] = useState('任意')
  const [selectedWeekday,updateSelectedWeekday] = useState('任意')
  const [selectedAccountingType,updateSelectedAccountingType] = useState('any')
  const [selectedTimeEnd_1,updateSelectedTimeEnd_1] = useState('任意')
  const [selectedTimeEnd_2,updateSelectedTimeEnd_2] = useState('任意')

  useEffect(()=>{
      if(bills?.length!==0){
         const newPersonList = Array.from(new Set(bills.map((item)=>item.productSub)))
         newPersonList.unshift('任意')
         console.log('newPersonList',newPersonList)
         if(!isEqual(newPersonList,personList))updatePersonList(newPersonList)

         const newCategoryList = Array.from(new Set(bills.map((item)=>item.category)))
         newCategoryList.unshift('any')
         console.log('newCategoryList',newCategoryList)
         if(!isEqual(newCategoryList,categoryList)) updateCategoryList(newCategoryList)

         const newDateList = Array.from(new Set(bills.map((item)=>getFormatDate(item.recordDate))))
         newDateList.unshift('任意')
         console.log('newDateList',newDateList)
         if(!isEqual(newDateList,dateList))updateDateList(newDateList)
      }
  }, [bills])

  useEffect(()=>{
      const filterBillByFilter = bills?.filter((item)=>{
          const categoryPass = selectedCategory==='any' ||item?.category === selectedCategory;
          const personPass = selectedPerson==='任意'||item?.productSub === selectedPerson;
          const weekdayPass = selectedWeekday==='任意'|| getWeekdayForShow(item?.recordDate) === selectedWeekday;
          const accountingTypePass = selectedAccountingType==='any' || item?.accountingType === selectedAccountingType;
          const isDateLeftEndPass = selectedTimeEnd_1 === '任意'
          const isDateRightEndPass = selectedTimeEnd_2 === '任意'
          let isDateRangePass = isDateLeftEndPass && isDateRightEndPass

          if(!isDateRangePass){
            const leftDate = new Date(selectedTimeEnd_1)
            const rightDate = new Date(selectedTimeEnd_2)
            const nowDate = new Date(getFormatDate(item?.recordDate))
            isDateRangePass = (nowDate>=leftDate && (isDateRightEndPass || nowDate<=rightDate))||(nowDate<=rightDate && (isDateLeftEndPass|| nowDate>=leftDate))
          }
      console.log(categoryPass,personPass,weekdayPass,accountingTypePass,isDateRangePass)

          return categoryPass && personPass && weekdayPass && accountingTypePass && isDateRangePass
      })
      setFilterBills(filterBillByFilter)
  },[bills,selectedCategory,selectedPerson,selectedWeekday,selectedAccountingType,selectedTimeEnd_1,selectedTimeEnd_2])


  useEffect(() => {
    queryAndSetBills(database, setBills);
    setFilterBills(bills);
  }, [database]);

  useEffect(() => {
    if (filterBills.length > 0) {
      const groupedData = filterBills.reduce((acc, bill) => {
        const date = getFormatDate(bill.recordDate);
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += bill.totalPrice;
        return acc;
      }, {});
      const labels = Object.keys(groupedData);
      const data = Object.values(groupedData);
      setChartData({labels, data});

      const totalIncome = filterBills.reduce((acc, bill) => {
        return bill.accountingType === 'income' ? acc + bill.totalPrice : acc;
      }, 0);
      const totalExpense = filterBills.reduce((acc, bill) => {
        return bill.accountingType === 'expense' ? acc + bill.totalPrice : acc;
      }, 0);

      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
      setAverageIncome(totalIncome / labels.length);
      setAverageExpense(totalExpense / labels.length);
    }
  }, [filterBills]);

  useEffect(() => {
    // 当组件挂载时，滑动到 FlatList 的底部
    flatListRef.current?.scrollToEnd({animated: true});
  }, [bills]); // 每次 bills 更新时执行

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedBills = [...filterBills].sort((a, b) => {
    return sortOrder === 'asc'
      ? new Date(a.recordDate) - new Date(b.recordDate)
      : new Date(b.recordDate) - new Date(a.recordDate);
  });

  const renderItem = ({item}) => {
    const {recordDate, content, accountingType, totalPrice, productSub, category} =
      item || {};
    return (
      <View style={styles.billItem}>
        <Text style={styles.billText}>
          {getFormatDate(recordDate) + '  ' + getWeekdayForShow(recordDate) + '  ' + getFormatTime(recordDate)}
        </Text>
        <Text
          style={[
            styles.billText,
            accountingType === 'expense' ? styles.expense : styles.income,
          ]}>
          {accountingType === 'expense' ? '支出' : '收入'}:{' '}
          {totalPrice.toFixed(2)}
        </Text>
        <Text style={styles.billText}>{getCategoryForShow(category)+ ' '+content+' '+productSub}</Text>
      </View>
    );
  };

  return (
    <View style={styles.AnalysisContainer}>
      <View style={styles.summaryContainer}>
        <View style={styles.summary}>
          <Text style={styles.text}>
            总收入: <Text style={styles.income}>{totalIncome.toFixed(2)}</Text>
          </Text>
          <Text style={styles.text}>
            日均收入:{' '}
            <Text style={styles.income}>{averageIncome.toFixed(2)}</Text>
          </Text>
        </View>
        <View style={styles.summary}>
          <Text style={styles.text}>
            总支出:{' '}
            <Text style={styles.expense}>{totalExpense.toFixed(2)}</Text>
          </Text>
          <Text style={styles.text}>
            日均支出:{' '}
            <Text style={styles.expense}>{averageExpense.toFixed(2)}</Text>
          </Text>
        </View>
      </View>
  <View style={{ flexDirection: 'row', padding: 0 }}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={updateSelectedCategory}
          mode='dropdown'
          style={{ width:'25%', padding: 10 }}
          >
          {categoryList.map((item)=>(<Picker.Item key={item} label={getCategoryForShow(item)} value={item}/>))}
        </Picker>
          <Picker
            selectedValue={selectedPerson}
            onValueChange={updateSelectedPerson}
            mode='dropdown'
            style={{ width:'25%', padding: 10 }}
            >
            {personList.map((item)=>(<Picker.Item key={item} label={item} value={item}/>))}
          </Picker>
          <Picker
            selectedValue={selectedWeekday}
            onValueChange={updateSelectedWeekday}
            mode='dropdown'
            style={{ width:'29%', padding: 10 }}
            >
            {weekdayList.map((item)=>(<Picker.Item key={item} label={item} value={item}/>))}
          </Picker>
          <Picker
              selectedValue={selectedAccountingType}
              onValueChange={updateSelectedAccountingType}
              mode='dropdown'
              style={{ width:'25%', padding: 10 }}
              >
              {accountingTypeList.map((item)=>(<Picker.Item key={item} label={getAccountingTypeForShow(item)} value={item}/>))}
            </Picker>
     </View>
      <View style={{ flexDirection: 'row', padding: 10 }}>
          <Picker
            selectedValue={selectedTimeEnd_1}
            onValueChange={updateSelectedTimeEnd_1}
            mode='dropdown'
            style={styles.multipleSelect}
            >
            {dateList.map((item)=>(<Picker.Item key={item} label={item} value={item}/>))}
          </Picker>
          <Picker
            selectedValue={selectedTimeEnd_2}
            onValueChange={updateSelectedTimeEnd_2}
            mode='dropdown'
            style={styles.multipleSelect}
            >
            {dateList.map((item)=>(<Picker.Item key={item} label={item} value={item}/>))}
          </Picker>

     </View>
     {
         chartData?.data?.length > 1 ?
         <LineChart
            data={{
             labels: chartData.labels,
             datasets: [
               {
                 data: chartData.data,
               },
             ],
            }}
            width={380}
            height={180}
            yAxisLabel=""
            withDots={true}
            withInnerLines={true}
            chartConfig={{
             backgroundColor: '#ffffff',
             backgroundGradientFrom: '#ffffff',
             backgroundGradientTo: '#ffffff',
             decimalPlaces: 2,
             color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
             style: {
               borderRadius: 16,
             },
             propsForDots: {
               r: '0',
             },
            }}
            bezier
            style={{
             marginVertical: 8,
             borderRadius: 16,
            }}
            /> : <></>
         }

      <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
        <Text style={styles.buttonText}>{`点击切换排序到：${
          sortOrder === 'asc' ? '降序' : '升序'
        }`}</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef} // 设置 FlatList 的引用
        data={sortedBills}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()} // 假设每个账单都有唯一的 id
        style={styles.billList}
      />
    </View>
  );
};

export default BillLineChart;
