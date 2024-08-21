<template>
  <div class="wrap" :id=chartId>
    <p class="title">技术发展及演变趋势分析</p>
    <Loading v-show="!content"/>
      <Empty v-show="content === 'errordata'"/>
      <p class="content" v-show="content && content !=='errordata' ">{{ content }}</p>
      <div v-show="showEchart" ref="echartsRef" :style="{ width: '100%', height: '400px' }"></div>
    </div>
</template>

<script setup>
import {defineProps, ref, watch} from 'vue';
import * as echarts from "echarts";
import sseFetch from '/src/api/sseFetch';
import Loading from './Loading.vue';
import Empty from './Empty.vue';


const props = defineProps({
  message: Object,
  detailData: Object,
  chartId: String
})
const content = ref('');
const echartsRef = ref(null);
let chartInstance = null;
let showEchart = ref(false);

const initChart = (result, max, interval) => {

  const option = {
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //     type: 'cross',
    //     crossStyle: {
    //       color: '#999'
    //     }
    //   }
    // },
    // toolbox: {
    //   feature: {
    //     dataView: { show: true, readOnly: false },
    //     magicType: { show: true, type: ['line', 'bar'] },
    //     restore: { show: true },
    //     saveAsImage: { show: true }
    //   }
    // },
    legend: {
      data: ['授权', '申请', '授权占比']
    },
    xAxis: [
      {
        type: 'category',
        data: result.years,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '专利数量',
        min: 0,
        max,
        interval,
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '授权占比',
        // min: 0,
        // max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} %'
        }
      }
    ],
    series: [
      {
        name: '授权',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          }
        },
        data: result.authorization_nums
      },
      {
        name: '申请',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value;
          }
        },
        data: result.apply_nums
      },
      {
        name: '授权占比',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' %';
          }
        },
        data: result.percent,
      }
    ]
  };

        chartInstance = echarts.init(echartsRef.value);
        chartInstance.setOption(option);
    };

function renderPage(res_content, jsonData) {
  content.value = res_content;

  if (jsonData) {
    const data = jsonData.data;
    const years = data?.map(item => item.year);
    const authorization_nums = data?.map(item => item.authorization_num);
    const apply_nums = data?.map(item => item.apply_num);
    let percent = [];
    authorization_nums?.forEach((num, index) => {
      let per = 0;
      if(num >= apply_nums[index]) {
        per = 0
      } else {
        per = ((num / apply_nums[index]) * 100).toFixed(2);
      }

      percent.push(per)
    });
    const result = {
        years: years,
        authorization_nums: authorization_nums,
        apply_nums: apply_nums,
        percent
    };
    const arr = apply_nums?.sort((a, b) => b - a);
    const max = arr[0];
    let interval = max ? max / 10 : 50;
    interval =getClosestMultipleOfTen(interval);

    showEchart.value = true;
    setTimeout(() => {
      initChart(result, max, interval);
    }, 500);

  }
}

function sseRenderPage(messageData) {
    if(!messageData) return false;
    const { industry, area, key, applicant, report_id } = messageData;
    const conditions = {
      industry,
      area,
      key,
      theme: '',
      dataType: 'patent_trend2',
      applicant,
      report_id,
    };
    const fetchData = {
      inputs: {
          conditions: JSON.stringify(conditions)
      },
      query: '生成分析报告', // 用户对话框中输入的内容
      response_mode: 'streaming', // 'blocking',// 固定传
      conversation_id: '', // currentConversationId.value, // 会话id, 第一次请求后获取
      user: 'beihang' // userName.value, // 用户名，区分请求用户
    }

    sseFetch(fetchData, (res_content, jsonData) => {
      renderPage(res_content, jsonData)
    });
}


watch(
    () => props.detailData,
    (newValue)=> {
      if(newValue) {
        const res_content = newValue.content
        const jsonData = JSON.parse(newValue.data);
        renderPage(res_content, jsonData)
      }
    },
);

watch(
    () => props.message,
    (newValue)=> {
      if(newValue) {
        setTimeout(() => {
          sseRenderPage(newValue);
        }, 1000);
      }
    },
);

function getClosestMultipleOfTen(num) {
  if ( num < 5 ) {
    return num
  }
  const remainder = num % 10;
  if (remainder < 5) {
    return num - remainder;
  } else {
    return num + (10 - remainder);
  }
}

</script>
<style scoped>
@import "../../styles/reportModule.css";
</style>
