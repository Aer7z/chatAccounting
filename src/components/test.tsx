import React, {useEffect} from 'react';
import {View, TextInput, Button, Text} from 'react-native';
import {
  Segment,
  useDefault,
  pangu,
  panguExtend1,
  panguExtend2,
} from 'segmentit';
import RNFS from 'react-native-fs';
import {cloneDeep, isNumber, isDate, isNil} from 'lodash';

import { getTime,handleMoney,handlePerson,handlePersonMoneyAndContent,handleSurplusAuxiliary,handleSurplusPreposition,handleDateAndTime,analyseTime,analyseText} from '../utils/analyse.ts'
import { getCategory } from '../utils/get.ts'
const segmentit = useDefault(new Segment());

const loadDict = (segmentit) => {
  segmentit.loadDict(pangu);
  segmentit.loadDict([panguExtend1, panguExtend2]);
  const verbDict =
    '花了|0x1000|13840\n用了|0x1000|13840\n吃了|0x1000|13840\n洗车|0x1000|13840\n交了|0x1000|13840';
  const dateDict = '那周|0x4000|4123\n这周|0x4000|4123\n';
  const timeDict =
    '星期一|0x400000|4123\n星期1|0x400000|4123\n星期二|0x400000|4124\n星期2|0x400000|4124\n星期三|0x400000|4125\n星期3|0x400000|4125\n星期四|0x400000|4126\n星期4|0x400000|4126\n星期五|0x400000|4127\n星期5|0x400000|4127\n星期六|0x400000|4128\n星期6|0x400000|4128\n星期日|0x400000|4129\n星期天|0x400000|4129\n星期7|0x400000|4129';
  const dict4Time =
    '0点|0x4000|30000\n1点|0x4000|30000\n2点|0x4000|30000\n3点|0x4000|30000\n4点|0x4000|30000\n5点|0x4000|30000\n6点|0x4000|30000\n7点|0x4000|30000\n8点|0x4000|30000\n9点|0x4000|30000\n10点|0x4000|30000\n11点|0x4000|30000\n12点|0x4000|30000\n13点|0x4000|30000\n14点|0x4000|30000\n15点|0x4000|30000\n16点|0x4000|30000\n17点|0x4000|30000\n18点|0x4000|30000\n19点|0x4000|30000\n20点|0x4000|30000\n21点|0x4000|30000\n22点|0x4000|30000\n23点|0x4000|30000';
  segmentit.loadDict(verbDict);

  segmentit.loadDict(dateDict);

  segmentit.loadDict(timeDict);
  segmentit.loadDict(dict4Time);
};

const Test = () => {
  const [inputText, setInputText] = React.useState('');
  loadDict(segmentit)


  return (
    <View style={{padding: 20}}>
      <TextInput
        placeholder="输入中文句子"
        value={inputText}
        onChangeText={setInputText}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
        }}
      />
      <Button title="分词" onPress={()=>{
          console.log('analyseText(inputText)',analyseText(inputText))
      }} />
    </View>
  );
};

export default Test;
