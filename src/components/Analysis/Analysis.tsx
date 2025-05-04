import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {queryAndSetBills, handleWeekDayToChinese} from '../../utils/index.ts';
import {styles} from './style.ts';
import {BillDetail} from '../../interface/index.ts';
import {
  getFormatDate,
  getFormatTime,
  getWeekdayForShow
} from '../../utils/get.ts';

import SelectScreen from '../test_1.tsx'


const BillLineChart = ({database}) => {
  const [bills, setBills] = useState<BillDetail[]>([]);
  const [chartData, setChartData] = useState({
    labels: ['Default Label 1', 'Default Label 2'],
    data: [0, 0],
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [averageIncome, setAverageIncome] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc'); // 默认升序
  const flatListRef = useRef(null); // 用于引用 FlatList

  useEffect(() => {
    queryAndSetBills(database, setBills);
  }, [database]);

  useEffect(() => {
    if (bills.length > 0) {
      const groupedData = bills.reduce((acc, bill) => {
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

      const totalIncome = bills.reduce((acc, bill) => {
        return bill.accountingType === 'income' ? acc + bill.totalPrice : acc;
      }, 0);
      const totalExpense = bills.reduce((acc, bill) => {
        return bill.accountingType === 'expense' ? acc + bill.totalPrice : acc;
      }, 0);

      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
      setAverageIncome(totalIncome / labels.length);
      setAverageExpense(totalExpense / labels.length);
    }
  }, [bills]);

  useEffect(() => {
    // 当组件挂载时，滑动到 FlatList 的底部
    flatListRef.current?.scrollToEnd({animated: true});
  }, [bills]); // 每次 bills 更新时执行

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedBills = [...bills].sort((a, b) => {
    return sortOrder === 'asc'
      ? new Date(a.recordDate) - new Date(b.recordDate)
      : new Date(b.recordDate) - new Date(a.recordDate);
  });

  const renderItem = ({item}) => {
    const {recordDate, content, accountingType, totalPrice} =
      item || {};
    return (
      <View style={styles.billItem}>
        <Text style={styles.billText}>
          {getFormatDate(recordDate) + '  ' + getWeekdayForShow(recordDate) + getFormatTime(recordDate)}
        </Text>
        <Text
          style={[
            styles.billText,
            accountingType === 'expense' ? styles.expense : styles.income,
          ]}>
          {accountingType === 'expense' ? '支出' : '收入'}:{' '}
          {totalPrice.toFixed(2)}
        </Text>
        <Text style={styles.billText}>{content}</Text>
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
      />
      <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
        <Text style={styles.buttonText}>{`点击切换排序到：${
          sortOrder === 'asc' ? '降序' : '升序'
        }`}</Text>
      </TouchableOpacity>
      <SelectScreen/>
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
