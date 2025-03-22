import React,{useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput, Button,
  TouchableOpacity
} from 'react-native';


import {
  Colors,
  DebugInstructions,
//   Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Header } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Content } from './components/index.ts'


function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const [inputValue, setInputValue] = useState('');

      const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      };
  return (
   <SafeAreaProvider>
          <View style={styles.container}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            {/* 头部区域 */}
            <View style={styles.header}>
              <Text style={styles.headerText}>头部标题</Text>
            </View>

            {/* 内容区域 */}
            <View style={styles.content}>
                <Content/>
            </View>


            {/* 底部区域 */}
            <View style={styles.footer}>
                <View style={styles.footerInput}>
                    <TextInput
                      style={styles.input}
                      placeholder="请输入内容"
                      value={inputValue} // 绑定输入值
                      onChangeText={setInputValue} // 更新输入值
                    />
                  <TouchableOpacity style={styles.footerInputButton} onPress={() => alert(`提交的内容: ${inputValue}`)}>
                    <Text style={styles.buttonText}>提交</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.footerSelect}>
                  <TouchableOpacity style={styles.footerButton} onPress={() => alert('记账按钮被点击')}>
                    <Text style={styles.buttonText}>记账</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerButton} onPress={() => alert('分析按钮被点击')}>
                    <Text style={styles.buttonText}>分析</Text>
                  </TouchableOpacity>
                </View>

            </View>
          </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingTop: 25,
      backgroundColor: '#ADD8E6',
      alignItems: 'center',
    },
    headerText: {
      color: '#fff',
      fontSize: 20,
    },
    content: {
      flex: 1, // 占据剩余空间
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    footer: {
      alignItems: 'center',
      padding: 10,
      paddingBottom: 20,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    footerInput:{
        flex:0,
        flexDirection: 'row',
        margin:10
    },
    footerSelect:{
        flexDirection: 'row',
        margin:10
    },
      footerButton: {
        width: '40%', // 设置按钮宽度为屏幕宽度的40%
        padding: 10, // 内边距
        backgroundColor: '#ADD8E6', // 按钮背景色
        alignItems: 'center', // 内容居中
        borderRadius: 5, // 圆角
        marginLeft:5,
        marginRight:5
      },
        footerInputButton: {
          width: '20%', // 设置按钮宽度为屏幕宽度的40%
          padding: 10, // 内边距
          backgroundColor: '#ADD8E6', // 按钮背景色
          alignItems: 'center', // 内容居中
          borderRadius: 5, // 圆角
          marginLeft:5,
          marginRight:5
        },
    buttonText: {
      color: '#fff', // 字体颜色
      textAlign: 'center', // 文字居中
    },
    input: {
      flex: 1, // 输入框占据剩余空间
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
    },
});

export default App;
