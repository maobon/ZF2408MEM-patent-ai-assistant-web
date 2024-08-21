import {fetchEventSource} from '@microsoft/fetch-event-source';
import configs from "@/utils/configs";

const sseFetch = (fetchData, callback) => {

  // configs
  const url = configs.getRealTimeTextGeneratorWorkflowURL()
  const apiKey = configs.DIFY_REALTIME_GEN_TEXT_API_KEY

  const ctrl = new AbortController();

  let content = ''; // 文案内容
  let temp = ''; // 存储json数据过桥
  let jsonData = null; // 图表json

  const mockErrorData = {
    content: 'errordata', jsonData: null
  }

  const timeout = 90000;
  let isLock = true;

  fetchEventSource(url, {
    method: 'POST', headers: {
      'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`,
    }, body: JSON.stringify(fetchData), signal: ctrl.signal, openWhenHidden: true, async onopen(response) {
      console.log('onopen', response);
    }, onmessage(msg) {
      try {
        const data = JSON.parse(msg.data);
        console.log(data, 'msg =========')


        if (data.event === "message") {

          if (data.answer.indexOf('@') > -1 && temp.indexOf('@@@DataType') < 0) {

            let str = data.answer;
            let splitIndex = str.indexOf("@");
            let firstPart = str.slice(0, splitIndex);
            let secondPart = str.slice(splitIndex);

            temp += secondPart;
            content += firstPart;
          }

          if (temp.indexOf('@') > -1) {
            temp += data.answer;
          } else {
            content += data.answer;
          }

          if (temp.indexOf('@@@DataType') > -1 && temp.indexOf('@@@End') > -1) {
            console.log(temp, 'temp -------')

            let jsonString = temp.match(/{[\s\S]*}/)[0]; // 使用正则表达式提取 JSON 部分
            // let jsonString = extractJSON(temp);
            jsonData = JSON.parse(jsonString); // 将 JSON 字符串转换为对象
          }
          isLock = false;
          callback && callback(content, jsonData);
        }
        if (data.event === "message_end") {
          ctrl.abort();
        }
      } catch (error) {
        console.log(error);
      }

    }, onclose() {
      console.log('onclose');
    }, onerror(err) {
      console.log('onerror', err);
      // ctrl.abort();
      throw err;
    }
  });

  setTimeout(() => {
    if (isLock) {
      callback && callback(mockErrorData.content);
      ctrl.abort();
    }
  }, timeout);

  // fetchEventSource(url, {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${apiKey}`,
  //     },
  //     openWhenHidden: true,
  //     body: JSON.stringify(fetchData),
  //     onmessage(msg) {

  //         const data = JSON.parse(msg.data);
  //         console.log(data, 'msg =========')

  //         if (data.event === 'message') {
  //             callback && callback(data);
  //         }
  //     }
  // });
}

export default sseFetch;
