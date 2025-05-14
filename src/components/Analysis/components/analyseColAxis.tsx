import {
  VictoryAxis,
  VictoryTheme,
} from "victory-native";

import _ from 'lodash';

const returnLineRangeData = (priceDataArray)=>{
    const min = Math.round(Math.min(...priceDataArray));
    const max = Math.round(Math.max(...priceDataArray));
    const billCount = priceDataArray?.length || 1
    const range = Math.round((max-min)/billCount);
    return [min,max,range]
}

export const AnalyseColAxis = (props)=>{
    const {dailyBills} = props

    return (
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
    )
}