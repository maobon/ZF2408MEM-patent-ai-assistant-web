<template>
    <div class="wrap" :id=chartId>
      <p class="title">技术背景和目标</p>
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
const content = ref(null);
const echartsRef = ref(null);
let chartInstance = null;
let showEchart = ref(false);

const initChart = (xAxisData, seriesData) => {
    const option  = {
    xAxis: {
        type: 'category',
        data: xAxisData
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
        data: seriesData,
        type: 'bar'
        }
    ]
    };
    chartInstance = echarts.init(echartsRef.value);
    chartInstance.setOption(option);
};


function renderPage(res_content, jsonData) {
  content.value = res_content;
  if (jsonData) {
    let grouped = {};
    jsonData?.data?.forEach(item => {
      for (let key in item) {
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item[key]);
      }
    });
    showEchart.value = true;
    setTimeout(() => {
      initChart(grouped.year, grouped.num);
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
      dataType: 'patent_trend1',
      applicant,
      report_id,
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
        sseRenderPage(newValue);
      }
    },
);

</script>
<style scoped>
@import "../../styles/reportModule.css";
</style>
