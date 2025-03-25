import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { queryAndSetBills } from '../../utils/index.ts';

const BillLineChart = ({ database }) => {
    const [bills, setBills] = useState([]);
    const [chartData, setChartData] = useState({
        labels: ['Default Label 1', 'Default Label 2'], // 默认标签
        data: [0, 0], // 默认数据
    });
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [averageIncome, setAverageIncome] = useState(0);
    const [averageExpense, setAverageExpense] = useState(0);

    useEffect(() => {
        console.log('>>>analysis')
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
            setChartData({ labels, data }); // 更新图表数据

            // 计算总收入和支出
            const totalIncome = bills.reduce((acc, bill) => {
                return bill.accountingType === 'income' ? acc + bill.totalPrice : acc;
            }, 0);
            const totalExpense = bills.reduce((acc, bill) => {
                return bill.accountingType === 'expense' ? acc + bill.totalPrice : acc;
            }, 0);

            // 计算日均收入和支出
            setTotalIncome(totalIncome);
            setTotalExpense(totalExpense);
            setAverageIncome(totalIncome / labels.length);
            setAverageExpense(totalExpense / labels.length);
            console.log('重新渲染',{ labels, data })
        }
    }, [bills]);

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
                    datasets: [
                        {
                            data: chartData.data,
                        },
                    ],
                }}
                width={380} // 从父组件获取宽度
                height={180}
                yAxisLabel=""
                withDots={true}
                withInnerLines={true}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 191, 255,  ${opacity})`, // 浅绿色
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
        </View>
    );
};

const styles = StyleSheet.create({
    AnalysisContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    container: {
        padding: 16,
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
        color: 'red', // 收入为红色
    },
    expense: {
        color: 'green', // 支出为绿色
    },
});


export default BillLineChart;