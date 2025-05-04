import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const MultiSelectDropdown = ({ label, options, onValueChange }) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleValueChange = (values) => {
    setSelectedValues(values);
    onValueChange(values);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        placeholder={{ label: `Select ${label}...`, value: null }}
        items={options}
        value={selectedValues}
        onValueChange={handleValueChange}
        useNativeAndroidPickerStyle={false} // 禁用 Android 原生样式，使用自定义样式
        style={pickerSelectStyles}
        multiple={true} // 启用多选
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // 为了显示箭头图标
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // 为了显示箭头图标
  },
});

export default MultiSelectDropdown;