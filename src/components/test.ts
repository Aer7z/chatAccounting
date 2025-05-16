  // 需要放在 speech sdk 之前引用，否则 sdk 会报错
  import "react-native-get-random-values";

  import { Buffer } from "buffer";
  import { PermissionsAndroid, Platform } from "react-native";
  import {
    AudioConfig,
    AudioInputStream,
    PushAudioInputStream,
    SpeechTranslationConfig,
    TranslationRecognizer,
  } from "microsoft-cognitiveservices-speech-sdk";
  import AudioRecord from "react-native-live-audio-stream";

  // AudioRecord 参数，按自己需求来
  const channels = 1;
  const bitsPerSample = 16;
  const sampleRate = 16000;
  const audioSource = 6;

  // Azure 语音服务 key、regoin、语种等，按自己需求来
  const your_key = '';
  const your_region = '';
  const your_language = 'zh-CN';
  const your_target_language = 'zh';

  // 语音转换类
  class Converter {
    // 微软语音转换核心
    private recognizer: TranslationRecognizer | null = null;
    // 通过流来实现语音转换
    private pushStream: PushAudioInputStream = AudioInputStream.createPushStream();

    constructor() {}

    /**
     * 初始化语音识别
     */
    public async init() {
      // 这里初始化 AudioRecord，wavFile不填就从麦克风识别语音
      AudioRecord.init({
        sampleRate,
        channels,
        bitsPerSample,
        audioSource,
        wavFile: "",
      });

      // 当麦克风识别到语音后，将 base64 转成流，写入到 pushStream 中
      AudioRecord.on("data", (data: any) => {
        this.pushStream?.write(Buffer.from(data, "base64"));
      });

      // 语音转换配置
      const speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
        your_key,
        your_region
      );
      speechTranslationConfig.speechRecognitionLanguage = your_language;
      speechTranslationConfig.addTargetLanguage(your_target_language);

      // 这里指定音频来源为 pushStream 流
      const audioConfig = AudioConfig.fromStreamInput(this.pushStream);

      // 通过配置生成 TranslationRecognizer 实例
      this.recognizer = new TranslationRecognizer(speechTranslationConfig, audioConfig);
    }

    /**
     * 开始语音识别
     */
    public async start() {
      // 先检查是否有麦克风等权限
      await Converter.checkPermission();

      if (!this.recognizer) this.init();

      this.recognizer!.sessionStarted = (s, e) => {
        console.log("session started: " + e.sessionId);
      };
      this.recognizer!.sessionStopped = (s, e) => {
        console.log("session stopped: " + e.sessionId);
      };
      // 这里是边说边识别，每次说话都会执行
      this.recognizer!.recognizing = (s, e) => {
        console.log("recognizing", e.result.text);
      }
      // 这是是识别一整句话说完之后执行
      this.recognizer!.recognized = (s, e) => {
        console.log("recognized", e.result.text);
      }
      // 开始识别
      this.recognizer!.startContinuousRecognitionAsync(
        () => {
          console.log("startContinuousRecognitionAsync");
        },
        (err) => {
          console.log(err);
        }
      );

      // 开始监听麦克风
      AudioRecord.start();
    }

    /**
     * 停止语音识别
     */
    public async stop() {
      // 停止麦克风监听
      AudioRecord.stop();
      if (!!this.recognizer) {
        // 停止识别
        this.recognizer.stopContinuousRecognitionAsync(
          () => {
            console.log("stopContinuousRecognitionAsync");
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }

    /**
     * 检查权限
     */
    public static async checkPermission() {
      console.log(Platform.Version)
      if (Platform.OS === "android") {
        try {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);

          console.log("grants", grants)
          if (
            grants["android.permission.WRITE_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED &&
            grants["android.permission.READ_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED &&
            grants["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log("Permissions granted");
            return true;
          } else {
            console.log("All required permissions not granted");
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }
      return true;
    }
  }

  export default Converter;
