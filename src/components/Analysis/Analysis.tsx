import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { queryAndSetBills } from '../../utils/index.ts';

const BillLineChart = ({ database }) => {
    const [bills, setBills] = useState([]);
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

    const weekDays = {
        Sunday: '星期日',
        Monday: '星期一',
        Tuesday: '星期二',
        Wednesday: '星期三',
        Thursday: '星期四',
        Friday: '星期五',
        Saturday: '星期六',
    };

    useEffect(() => {
        queryAndSetBills(database, setBills);
    }, [database]);

    useEffect(() => {
        if (bills.length > 0) {
            const groupedData = bills.reduce((acc, bill) => {
                const date = bill.recordDay;
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += bill.totalPrice;
                return acc;
            }, {});
            const labels = Object.keys(groupedData);
            const data = Object.values(groupedData);
            setChartData({ labels, data });

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
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [bills]); // 每次 bills 更新时执行

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const sortedBills = [...bills].sort((a, b) => {
        return sortOrder === 'asc'
            ? new Date(a.recordDay) - new Date(b.recordDay)
            : new Date(b.recordDay) - new Date(a.recordDay);
    });

    const renderItem = ({ item }) => (
        <View style={styles.billItem}>
            <Text style={styles.billText}>
                {item.recordDay} {weekDays[item.recordWeekDay]}
            </Text>
            <Text style={[styles.billText, item.accountingType === 'expense' ? styles.expense : styles.income]}>
                {item.accountingType === 'expense' ? '支出' : '收入'}: {item.totalPrice.toFixed(2)}
            </Text>
            <Text style={styles.billText}>
                {item.content}
            </Text>
        </View>
    );

    return (
        <View style={styles.AnalysisContainer}>
            <View style={styles.summaryContainer}>
                <View style={styles.summary}>
                    <Text style={styles.text}>总收入: <Text style={styles.income}>{totalIncome.toFixed(2)}</Text></Text>
                    <Text style={styles.text}>日均收入: <Text style={styles.income}>{averageIncome.toFixed(2)}</Text></Text>
                </View>
                <View style={styles.summary}>
                    <Text style={styles.text}>总支出: <Text style={styles.expense}>{totalExpense.toFixed(2)}</Text></Text>
                    <Text style={styles.text}>日均支出: <Text style={styles.expense}>{averageExpense.toFixed(2)}</Text></Text>
                </View>
            </View>
            <LineChart
                data={{
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.data,
                    }],
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
                <Text style={styles.buttonText}>{`点击切换排序到：${sortOrder === 'asc' ? '降序' : '升序'}`}</Text>
            </TouchableOpacity>
            <FlatList
                ref={flatListRef} // 设置 FlatList 的引用
                data={sortedBills}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()} // 假设每个账单都有唯一的 id
                style={styles.billList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    AnalysisContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    summaryContainer: {
        marginTop: 5,
    },
    summary: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 1,
    },
    text: {
        fontSize: 16,
        marginVertical: 4,
    },
    income: {
        color: 'red',
    },
    expense: {
        color: 'green',
    },
    billItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    billText: {
        fontSize: 14,
    },
    billList: {
        marginTop: 20,
    },
    sortButton: {
        width: '98%',
        padding: 10,
        backgroundColor: '#ADD8E6',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default BillLineChart;