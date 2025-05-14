import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
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
    <View style={styles.AnalysisContainer}>
    <IncomeExpenseAnalyse filterBills={filterBills} dayCount={Object.keys(filterDailyBills)?.length||1}/>
    <BillsClassifier bills={bills} setFilterBills={setFilterBills}/>
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
          <VictoryChart
            theme={VictoryTheme.clean}
          >
            <VictoryLine />
          </VictoryChart>
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
