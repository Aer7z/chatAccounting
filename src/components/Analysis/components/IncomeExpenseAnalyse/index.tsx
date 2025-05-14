import {View, Text} from 'react-native';
import {useModel} from './hooks/useModel.ts'
import {styles} from './styles.ts';

export const IncomeExpenseAnalyse = (props)=>{
    const { totalIncome, totalExpense, averageIncome, averageExpense} = useModel(props)
    return (
        <>
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
        </>
    )
}