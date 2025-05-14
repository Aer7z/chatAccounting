import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import {AnalyseLineChart} from '../AnalyseLineChart/index.tsx'
import {AnalysePieChart} from '../AnalysePieChart/index.tsx'

export const AnalyseChart = (props) => {
  const {dailyBills,selectChart} = props
  const chartList = [
      {
          type:'lineChart',node:<AnalyseLineChart chartHeight={300} dailyBills={dailyBills}/>
      },
      {
          type:'pieChart',node: <AnalysePieChart chartHeight={300} dailyBills={dailyBills}/>
      }
  ]

  return (
    <View style={styles.container}>
    {chartList.map((item)=>item.type===selectChart?item.node:<></>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

});

