import React, { useState } from 'react';
import { View,ScrollView, TextInput, Button, FlatList, Text, StyleSheet, Image } from 'react-native';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim()) {
      const userMessage = { id: Date.now(), text: message, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // 模拟系统回复
      const systemReply = { id: Date.now() + 1, text: `您说的是: ${message}`, sender: 'system' };
      setMessages((prevMessages) => [...prevMessages, systemReply]);

      setMessage(''); // 清空输入框
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.systemMessage]}>
      {item.sender === 'user' && <Image source={require('./images/img.png')} style={styles.avatar} />}
      <Text style={styles.messageText}>{item.text}</Text>
      {item.sender === 'system' && <Image source={require('./images/img_1.png')} style={styles.avatar} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="输入消息..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="发送" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
});

export default ChatBox;