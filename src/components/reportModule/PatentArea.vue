<template>
  <div class="wrap" :id=chartId>
    <p class="title">地域分析</p>
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


const initChart = (series, year) => {
  const option = {
    animation: false,
    // title: {
    //   text: 'Stacked Line'
    // },
    tooltip: {
      trigger: 'axis'
    },
    // legend: {
    //   data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    // },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: year
    },
    yAxis: {
      type: 'value'
    },
    series: series
  };


  chartInstance = echarts.init(echartsRef.value);
  chartInstance.setOption(option);
};


function renderPage(res_content, jsonData) {
  content.value = res_content;

  if (jsonData) {
    const series = [];
    jsonData?.areas?.forEach(item => {
      series.push({
        name: item.area,
        type: 'line',
        stack: 'Total',
        data: item.data
      })
    });
    showEchart.value = true;
    setTimeout(() => {
      initChart(series, jsonData.year);
    }, 500);
  }
}

function sseRenderPage(messageData) {
  if (!messageData) return false;
  const { industry, area, key, applicant, report_id } = messageData;

  const conditions = {
    industry,
    area,
    key,
    theme: '',
    dataType: 'patent_area',
    applicant,
    report_id
  };

  const fetchData = {
    inputs: {
      conditions: JSON.stringify(conditions)
    },
    query: '生成报告', // 用户对话框中输入的内容
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

        try {
          const res_content = newValue.content
          const jsonData = JSON.parse(newValue.data);
          renderPage(res_content, jsonData)

        }catch (err){
          console.log(err)
        }



      }
    },
);


watch(
  () => props.message,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        sseRenderPage(newValue);
      }, 2000);
    }
  },
);
// onMounted(() => {
//   const { industry, area, key, applicant } = JSON.parse(message.value);

//   const conditions = {
//     time: + new Date(),
//     industry,
//     area,
//     key,
//     theme: '',
//     dataType: 'patent_area',
//     applicant,
//   };

//   const fetchData = {
//     inputs: {
//       conditions: JSON.stringify(conditions)
//     },
//     query: '生成报告', // 用户对话框中输入的内容
//     response_mode: 'streaming', // 'blocking',// 固定传
//     conversation_id: '', // currentConversationId.value, // 会话id, 第一次请求后获取
//     user: 'beihang' // userName.value, // 用户名，区分请求用户
//   }
//   sseFetch(fetchData, (res_content, jsonData) => {
//     content.value = res_content;
//     // {"areas": [{"area": "广东", "data": [0, 0, 3, 2177, 2]}, {"area": "上海", "data": [0, 0, 3, 0, 0]}, {"area": "福建", "data": [0, 3, 0, 0, 0]}, {"area": "江苏", "data": [1, 3, 3, 1820, 0]}, {"area": "安徽", "data": [0, 0, 0, 586, 0]}, {"area": "美国", "data": [4, 4, 0, 0, 0]}, {"area": "日本", "data": [21, 15, 0, 0, 0]}, {"area": "英国", "data": [1, 0, 0, 0, 0]}, {"area": "德国", "data": [1, 0, 0, 0, 0]}, {"area": "山东", "data": [0, 0, 0, 699, 0]}, {"area": "浙江", "data": [0, 5, 2, 1418, 0]}, {"area": "湖南", "data": [0, 0, 2, 0, 0]}], "year": [2017, 2018, 2019, 2020, 2021]}
//     if (jsonData) {
//       const series = [];
//       jsonData?.areas?.forEach(item => {
//         series.push({
//           name: item.area,
//           type: 'line',
//           stack: 'Total',
//           data: item.data
//         })
//       });

//       initChart(series, jsonData.year);
//     }
//   });

// });
</script>

<style scoped>
@import "../../styles/reportModule.css";
</style>
