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
    width: '98%',
    padding: 10,
    backgroundColor: '#ADD8E6',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
