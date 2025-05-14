import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity,ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryTheme,
  VictoryScatter
} from "victory-native";
import {queryAndSetBills, handleWeekDayToChinese} from '../../utils/index.ts';

import {styles} from './style.ts';
import {BillDetail} from '../../interface/index.ts';

import {
  getFormatDate,
  getFormatTime,
  getWeekdayForShow,
  getCategoryForShow
} from '../../utils/get.ts';
import {IncomeExpenseAnalyse} from './components/IncomeExpenseAnalyse/index.tsx'
import {BillsClassifier} from './components/BillsClassifier/index.tsx'
import {AnalyseLineChart} from './components/AnalyseLineChart/index.tsx'


const returnLineRangeData = (priceDataArray)=>{
    const min = Math.round(Math.min(...priceDataArray));
    const max = Math.round(Math.max(...priceDataArray));
    const billCount = priceDataArray?.length || 1
    const range = Math.round((max-min)/billCount);
    return [min,max,range]
}


const BillLineChart = ({database}) => {
  const [bills, setBills] = useState<BillDetail[]>([]);
  const [filterBills, setFilterBills] =useState<BillDetail[]>([]);
  const [filterDailyBills,setFilterDailyBills] =useState<BillDetail[]>([]);
  const [chartData, setChartData] = useState({
    labels: ['暂无数据', '暂无数据'],
    data: [0, 0],
  });

  const [sortOrder, setSortOrder] = useState('asc'); // 默认升序
  const flatListRef = useRef(null); // 用于引用 FlatList


  useEffect(() => {
    queryAndSetBills(database, setBills);
  }, [database]);

  useEffect(() => {
      const labels = Object.keys(filterDailyBills);
      const data = Object.values(filterDailyBills);
      setChartData({labels, data});
  }, [filterDailyBills]);

  useEffect(()=>{
    const DailyBills = filterBills.reduce((acc, bill) => {
        const date = getFormatDate(bill.recordDate);
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += bill.totalPrice;
        return acc;
    }, {});
    setFilterDailyBills(DailyBills)
  },[filterBills])

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
    <ScrollView style={styles.AnalysisContainer}>
    <IncomeExpenseAnalyse filterBills={filterBills} dayCount={Object.keys(filterDailyBills)?.length||1}/>
    <BillsClassifier bills={bills} setFilterBills={setFilterBills}/>
        {Object.keys(filterDailyBills)?.length>1?<AnalyseLineChart dailyBills={filterDailyBills}/>:<></>}
    <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
    <Text style={styles.buttonText}>
        {`点击切换排序到：${sortOrder === 'asc' ? '降序' : '升序'}`}
    </Text>
    </TouchableOpacity>
    <FlatList
        ref={flatListRef} // 设置 FlatList 的引用
        data={sortedBills}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()} // 假设每个账单都有唯一的 id
        style={styles.billList}
    />
    </ScrollView>
  );
};

export default BillLineChart;
