import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryTheme,
  VictoryScatter
} from "victory-native";

import {View, Text} from 'react-native';
import {useModel} from './hooks/useModel.ts'
import {styles} from './styles.ts';
import _ from 'lodash';

const returnLineRangeData = (priceDataArray)=>{
    const min = Math.round(Math.min(...priceDataArray));
    const max = Math.round(Math.max(...priceDataArray));
    const billCount = priceDataArray?.length || 1
    const range = Math.round((max-min)/billCount);
    return [min,max,range]
}

export const AnalyseLineChart = (props)=>{
    const {dailyBills} = props

    return (
    <>
        <VictoryChart
          theme={VictoryTheme.clean}
        >
            <VictoryAxis
                dependentAxis
                tickValues={_.range(...returnLineRangeData(Object.values(dailyBills)))}
                tickFormat={(value) =>
                  `${value} 元`
            }
            style={{
              axis: {
                stroke: "transparent",
              },
              axisLabel: {
                fontSize: 8,
                padding: 50,
              },
              tickLabels: {
                fontSize: 14,
              },
              grid: {
                stroke: "#d9d9d9",
                size: 5,
              },
            }}
            />
            <VictoryAxis
              style={{
                tickLabels: {
                  fontSize: 14,
                },
                ticks: {
                  stroke: "#757575",
                  size: 5,
                },
              }}
            />
          <VictoryLine
            data={Object.entries(dailyBills).map(
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