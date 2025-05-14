import {
  VictoryChart,
  VictoryPie,
  VictoryTheme,
} from "victory-native";

import {View, Text} from 'react-native';
import {useModel} from './hooks/useModel.ts'
import {styles} from './styles.ts';


export const AnalysePieChart = (props)=>{
    const {dailyBills,chartHeight} = props
    const totalPrice =  Object.values(dailyBills)?.reduce((accumulator, currentValue) => accumulator+=currentValue,0)
    return (
    <>
        <VictoryPie
          height={chartHeight}

          data={Object.entries(dailyBills)?.map(([date,price])=>{
                return {
                    x:date,
                    y:price/totalPrice
                    }
              })

          }
          theme={VictoryTheme.clean}
        />
    </>
    )

}