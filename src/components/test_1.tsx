import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SelectScreen = () => {
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState([]);
  const [selectedType, setSelectedType] = useState([]);

  const [personOptions, setPersonOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [timeRangeOptions, setTimeRangeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    // 模拟从本地数据加载选项
    const loadOptions = () => {
      setPersonOptions([
        { label: 'John Doe', value: 'john' },
        { label: 'Jane Smith', value: 'jane' },
        { label: 'David Johnson', value: 'david' },
      ]);

      setCategoryOptions([
        { label: 'Food', value: 'food' },
        { label: 'Transportation', value: 'transportation' },
        { label: 'Entertainment', value: 'entertainment' },
      ]);

      setTimeRangeOptions([
        { label: 'Last Week', value: 'lastWeek' },
        { label: 'Last Month', value: 'lastMonth' },
        { label: 'Last Year', value: 'lastYear' },
      ]);

      setTypeOptions([
        { label: 'Income', value: 'income' },
        { label: 'Expense', value: 'expense' },
      ]);
    };

    loadOptions();
  }, []);

  const onSelectPerson = (values) => {
    setSelectedPerson(values);
  };

  const onSelectCategory = (values) => {
    setSelectedCategory(values);
  };

  const onSelectTimeRange = (values) => {
    setSelectedTimeRange(values);
  };

  const onSelectType = (values) => {
    setSelectedType(values);
  };

  const handleSubmit = () => {
    alert(
      `Selected Person: ${selectedPerson.join(', ')}\n` +
      `Selected Category: ${selectedCategory.join(', ')}\n` +
      `Selected Time Range: ${selectedTimeRange.join(', ')}\n` +
      `Selected Type: ${selectedType.join(', ')}`
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      marginTop: 50,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    dropdwon: {
      marginBottom: 10,
      // 添加自定义样式
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
    },
    multipleBtn: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    multipleBtnText: {
      color: 'white',
      textAlign: 'center',
    },
    searchIcon: {
      // 搜索图标样式
      height: 20, // 示例高度
      width: 20,  // 示例宽度
    },
    icon: {
      // icon 样式
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Options:</Text>

      <Text>Person:</Text>


      <Text>Category:</Text>


      <Text>Time Range:</Text>


      <Text>Type:</Text>

    </View>
  );
};

export default SelectScreen;