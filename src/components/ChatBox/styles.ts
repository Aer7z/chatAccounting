import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
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
        marginLeft: 5,
        marginRight: 5,
    },
    buttonText: {
        color: '#fff', // 字体颜色
        textAlign: 'center', // 文字居中
    },
});