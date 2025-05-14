import React, {useState, useEffect, useRef} from 'react';
import uuid from 'react-native-uuid';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {styles} from './styles.ts';
import {BillDetail} from '../../interface';
import {Section} from '../index.ts';
import {userInput} from '../../AccountingData/userInput.ts';
import {
  getWeekday,
  queryAndSetBills,
} from '../../utils/index.ts';
import {
  getFormatDate,
  getFormatTime,
  getWeekdayForShow,
  getCategoryForShow
} from '../../utils/get.ts';
import {
  analyseText
} from '../../utils/analyse.ts';
import {insertBillDetail} from '../../utils/SQL/index.ts';


const ChatBox = ({database, currentTitle}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [bills, setBills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const flatListRef = useRef(null); // 用于引用 FlatList

  useEffect(() => {
    queryAndSetBills(database, setBills, setMessages);
  }, []);

  useEffect(() => {
    // 当组件挂载时，滑动到 FlatList 的底部
    flatListRef.current?.scrollToEnd({animated: true});
  }, [messages]); // 每次 messages 更新时执行

  // 午饭花了20

  const recodeBill = (billNeedToRecord: BillDetailType) => {
    setBills(preBills => [billNeedToRecord, ...preBills]);
  };


  const handleSend = () => {
    if (message.trim()) {
      const userMessage = {id: uuid.v4(), text: message, sender: 'user'};
      setMessages(prevMessages => [...prevMessages, userMessage]);
      const bill = analyseText(message);
      insertBillDetail(database, bill);
      recodeBill(bill);
      // 记录账单
      const billMessage = {
        id: uuid.v4(),
        text: `您说的是: ${message}`,
        bill: bill,
        sender: 'system',
      };
      setMessages(prevMessages => [...prevMessages, billMessage]);
      setMessage(''); // 清空输入框
    }
  };

  const renderBill = ({item}) => {
    const {sender, bill} = item;
    const {
      totalPrice,
      accountingType,
      category,
      content,
      description,
      productSub,
      recordDate,
    } = bill || {};
    if (item.sender === 'user') {
      return (
        <View style={[styles.messageContainer, styles.userMessage]}>
            <Text style={styles.messageText} numberOfLines={3}>
                {item.text}
            </Text>
            <Image source={require('./images/img.png')} style={styles.avatar} />
        </View>
      );
    } else {
      return (
        <View style={[styles.messageContainer, styles.systemMessage]}>
          <Image source={require('./images/img_1.png')} style={styles.avatar} />
          <View style={[styles.textContainer]}>
            <Text style={styles.messageText} numberOfLines={1}>
              {getFormatDate(recordDate) + '  ' + getWeekdayForShow(recordDate)+'  ' + getFormatTime(recordDate)}
            </Text>
            <Text style={styles.messageText} numberOfLines={1}>
              {`内容: ${content}`}
            </Text>
            <Text style={styles.messageText} numberOfLines={1}>
              {`类型: ${accountingType == 'income' ? '收入' : '支出'}`}
            </Text>
            <Text style={styles.messageText} numberOfLines={1}>
              {`价格: ${totalPrice}`}
            </Text>
            <Text style={styles.messageText} numberOfLines={1}>
              {`产生于: ${productSub}`}
            </Text>
            <Text style={styles.messageText} numberOfLines={1}>
              {`账单分类: ${getCategoryForShow(category)}`}
            </Text>
          </View>
        </View>
      );
    }
  };
  const renderMessage = ({item}) => {
    return renderBill({item});
  };


// useEffect(() => {
//   userInput.forEach((singleMessage)=>{
//       const userMessage = { id: uuid.v4(), text: singleMessage, sender: 'user' };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       const bill = analyseText(singleMessage);
//         console.log('bill',bill)
//       recodeBill(bill);
//       insertBillDetail(database,bill)
//       // 记录账单
//       const billMessage = { id: uuid.v4(), text: `您说的是: ${singleMessage}`,bill: bill, sender: 'system' };
//       setMessages((prevMessages) => [...prevMessages, billMessage]);
//   });
// }, []);

  return (
    <View style={styles.CheckBoxContainer}>
      <FlatList
        ref={flatListRef} // 设置 FlatList 的引用
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
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

export default ChatBox;
