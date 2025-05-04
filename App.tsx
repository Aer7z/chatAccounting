import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  //   Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {Header} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Content, ChatBox, Analysis, Test} from './src/components/index.ts';

import {createBillTable, deleteAllRecords,deleteTable} from './src/utils/SQL/index.ts';



const ButtonTextAndPageTitle = [
  {text: '记账', title: '记账'},
  {text: '分析', title: '分析'},
];

function App(): React.JSX.Element {
  const [currentTitle, setCurrentTitle] = useState(
    ButtonTextAndPageTitle[0]?.title,
  );
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const database = SQLite.openDatabase({
    name: 'chatAccounting.db',
    location: 'default',
  });
  // 存储一批数据
   //昨天我花了50块吃饭
   //这周的周三我花了50块吃饭
  useEffect(() => {
//     deleteTable(database);
//     deleteAllRecords(database);
    // 创建表
    //         console.log('开始创建表格',database);
    if (database) {
      // 创建表
      createBillTable(database);
      console.log('>>>创建表成功！')
    } else {
      console.error('数据库初始化失败');
    }
  }, []);
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        {/* 头部区域 */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{currentTitle}</Text>
        </View>

        {/* 内容区域 */}
        <View style={styles.content}>
          <View style={backgroundStyle}>
            {currentTitle === '记账' ? (
              <ChatBox database={database} />
            ) : (
              <Analysis database={database} />
            )}
          </View>
        </View>

        {/* 底部区域 */}
        <View style={styles.footer}>
          <View style={styles.footerSelect}>
            {ButtonTextAndPageTitle.map(item => (
              <TouchableOpacity
                key={item.text}
                style={styles.footerButton}
                onPress={() => {
                  setCurrentTitle(item.title);
                }}>
                <Text style={styles.buttonText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
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
  footerSelect: {
    flexDirection: 'row',
    margin: 10,
  },
  footerButton: {
    width: '40%', // 设置按钮宽度为屏幕宽度的40%
    padding: 10, // 内边距
    backgroundColor: '#ADD8E6', // 按钮背景色
    alignItems: 'center', // 内容居中
    borderRadius: 5, // 圆角
    marginLeft: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff', // 字体颜色
    textAlign: 'center', // 文字居中
  },
});

export default App;
