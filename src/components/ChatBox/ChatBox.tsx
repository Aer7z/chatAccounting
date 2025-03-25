import React, { useState,useEffect } from 'react';
import uuid from 'react-native-uuid';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TextInput, Button,
  FlatList , Image,
  TouchableOpacity,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
//   Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { BillDetail } from '../../interface';
import {  Section } from '../index.ts';
import { userInput } from '../../AccountingData/userInput.ts';
import { getDate, getWeekday, analysisBill, queryAndSetBills} from '../../utils/index.ts';
import { insertBillDetail, getBillDetails} from '../../utils/SQL/index.ts';

const safePadding = '5%';
const weekDays = {
    Sunday: '星期日',
    Monday: '星期一',
    Tuesday: '星期二',
    Wednesday: '星期三',
    Thursday: '星期四',
    Friday: '星期五',
    Saturday: '星期六',
};

const ChatBox = ({database}) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [bill,setBill] = useState({});
    const [bills,setBills] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        queryAndSetBills(database,setBills);
    }, [database]);

// 午饭花了20

  const recodeBill = (billNeedToRecord:BillDetail) => {
      setBills((preBills) => [...preBills,billNeedToRecord]);
  };

  const handleSend = () => {
    if (message.trim()) {
        const userMessage = { id: uuid.v4(), text: message, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        const bill = analysisBill(message);
        recodeBill(bill);
        // 记录账单
        const billMessage = { id: uuid.v4(), text: `您说的是: ${message}`,bill: bill, sender: 'system' };
        setMessages((prevMessages) => [...prevMessages, billMessage]);
        setMessage(''); // 清空输入框
    }
  };

  const renderBill = ({ item }) => {
        if(item.sender === 'user'){
            return (
                <View style={[styles.messageContainer, styles.userMessage ]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                  <><Text style={styles.messageText}> </Text><Image source={require('./images/img.png')} style={styles.avatar} /></>
                </View>
        );}else{
            return (
                <View style={[styles.messageContainer, styles.systemMessage]}>
                    <Image source={require('./images/img_1.png')} style={styles.avatar} />
                    <View style={[styles.textContainer]}>
                        <Text style={styles.messageText} numberOfLines={1}>
                            {item.bill.recordDay + '  ' + weekDays[item.bill.recordWeekDay]}
                        </Text>
                        <Text style={styles.messageText} numberOfLines={1}>
                            {`内容: ${ item.bill?.content }`}
                        </Text>
                        <Text style={styles.messageText} numberOfLines={1}>
                            {`类型: ${ item.bill?.accountingType == 'income' ? '收入' : '支出' }`}
                        </Text>
                        <Text style={styles.messageText} numberOfLines={1}>
                            {`价格: ${ item.bill?.totalPrice }`}
                        </Text>
                    </View>
                </View>
        );}
  };
  const renderMessage = ({ item }) => {
      return renderBill({ item });
  };
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };


  useEffect(()=>{
      userInput.forEach((singleMessage)=>{
          const userMessage = { id: uuid.v4(), text: singleMessage, sender: 'user' };
          setMessages((prevMessages) => [...prevMessages, userMessage]);
          const bill = analysisBill(singleMessage);
          recodeBill(bill);
          // 记录账单
          const billMessage = { id: uuid.v4(), text: `您说的是: ${singleMessage}`,bill: bill, sender: 'system' };
          setMessages((prevMessages) => [...prevMessages, billMessage]);
      });
  },[]);
//   console.log('bills',bills);
//   bills.forEach((item) => { insertBillDetail(database,item);} );
  return (
    <View style={styles.CheckBoxContainer}>
        <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messageList}
        />

        <Section title="">
              <View style={styles.inputContainer}>
                   <TextInput
                        style={styles.input}
                        placeholder="请输入内容"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.inputButton} onPress={handleSend}>
                        <Text style={styles.buttonText}>发送</Text>
                    </TouchableOpacity>
              </View>
        </Section>
    </View>
  );
};

const styles = StyleSheet.create({
    CheckBoxContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    messageList: {
        flex: 1,
        marginBottom: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
    },
    userMessage: {
        backgroundColor: '#e1ffc7', // 用户消息背景色
        alignSelf: 'flex-end', // 右对齐
    },
    systemMessage: {
        backgroundColor: '#f0f0f0', // 系统消息背景色
        alignSelf: 'flex-start', // 左对齐
    },
    messageText: {
        fontSize: 16,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        flexDirection: 'row',
    },
    inputButton: {
        width: '20%', // 设置按钮宽度为屏幕宽度的40%
        padding: 10, // 内边距
        backgroundColor: '#ADD8E6', // 按钮背景色
        alignItems: 'center', // 内容居中
        borderRadius: 5, // 圆角
        marginLeft:5,
        marginRight:5,
    },
    buttonText: {
        color: '#fff', // 字体颜色
        textAlign: 'center', // 文字居中
    },
});

export default ChatBox;
