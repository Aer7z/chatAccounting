import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const BillLineChart = ({database}) => {
    const billDetails = [
        { id: '1', description: 'Lunch', totalPrice: 20, recordDay: '2023-03-20', accountingType: 'expense' },
        { id: '2', description: 'Dinner', totalPrice: 30, recordDay: '2023-03-21', accountingType: 'expense' },
        { id: '3', description: 'Groceries', totalPrice: 50, recordDay: '2023-03-22', accountingType: 'expense' },
        // 其他账单...
    ];

    const groupedData = billDetails.reduce((acc, bill) => {
        const date = bill.recordDay;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += bill.totalPrice;
        return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);

    return (
        <View>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                        },
                    ],
                }}
                width={320} // 从父组件获取宽度
                height={220}
                yAxisLabel="$"
                withDots={false} // 不显示点
                withInnerLines={false}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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

export default BillLineChart;
