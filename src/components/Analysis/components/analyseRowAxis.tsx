import {
  VictoryAxis,
  VictoryTheme,
} from "victory-native";

import _ from 'lodash';

export const AnalyseRowAxis = (props)=>{
    const {dailyBills} = props

    return (
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
    )
}