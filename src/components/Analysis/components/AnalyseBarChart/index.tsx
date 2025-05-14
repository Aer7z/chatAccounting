import {
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictoryAxis
} from "victory-native";

import {View, Text} from 'react-native';
import {useModel} from './hooks/useModel.ts'
import {styles} from './styles.ts';
import {AnalyseRowAxis} from '../analyseRowAxis.tsx'
import {AnalyseColAxis} from '../analyseColAxis.tsx'

export const AnalyseBarChart = (props)=>{
    const {dailyBills,chartHeight} = props

    return (
    <>
        <VictoryChart
           domainPadding={{ x: 30 }}
           theme={VictoryTheme.clean}
        >
        {AnalyseColAxis({dailyBills:dailyBills})}
        {AnalyseRowAxis({dailyBills:dailyBills})}
        <VictoryBar
        height={chartHeight}
        data={Object.entries(dailyBills)?.map(
          (d, i) => {
              const [date,price] = d
                return ({
                  x: date,
                  y: price,
                })
          },
        )}
        />
        </VictoryChart>
    </>
    )

}