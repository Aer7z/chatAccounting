import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
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
    width: '45%', // 设置按钮宽度为屏幕宽度的40%
    padding: 10, // 内边距
    backgroundColor: '#ADD8E6', // 按钮背景色
    alignItems: 'center', // 内容居中
    borderRadius: 5, // 圆角
    marginLeft: 5,
    marginRight: 5,
  },
  switchBillsSortButton: {
    color: '#fff',
    textAlign: 'center',
  },

  switchChartButton:{
    color: '#fff',
    textAlign: 'center',
  },
  buttonList:{
    flex: 1,
    flexDirection: 'row', // 设置为横向布局
    justifyContent: 'space-around', // 水平间距
    alignItems: 'center', // 垂直居中
  }
});
