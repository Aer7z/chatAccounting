import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput, Button
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
import { Content } from './components/content.tsx'


function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

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
              <Button title="记账" />
              <Button title="分析" />
              <TextInput
                style={styles.input}
                placeholder="请输入内容"
              />
              <Button title="提交" onPress={() => alert('提交按钮被点击')} />
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
      backgroundColor: '#6200ee',
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
      flexDirection: 'row', // 水平排列
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
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
