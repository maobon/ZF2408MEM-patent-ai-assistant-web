<template>
  <div class="wrap" :id=chartId>
    <p class="title">技术构成分析</p>
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

const initChart = (formattedData) => {
  const option = {
    series: [
      {
        type: 'treemap',     //图例样式，矩形树
        roam: false,
        breadcrumb: {
          show: false
        },
        levels: [
          // 第一个层级的配置
          {
            // 设置每个矩形的边框样式
            itemStyle: {
              borderColor: '#ffffff',  // 边框颜色
              borderWidth: 4,       // 边框宽度
              gapWidth: 1,          // 矩形之间的间隔宽度
            },
          },
        ],
        data: formattedData
      }
    ]
  };

  chartInstance = echarts.init(echartsRef.value);
  chartInstance.setOption(option);
};


function renderPage(res_content, jsonData) {
  content.value = res_content;

  if (jsonData) {
    const formattedData = jsonData?.data?.map(item => ({
      name: item.name + item.num,
      value: item.num
    }));
    showEchart.value = true;
    setTimeout(() => {
      initChart(formattedData);
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
    dataType: 'patent_technology',
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
  (newValue) => {
    if (newValue) {
      const res_content = newValue.content
      const jsonData = JSON.parse(newValue.data);
      renderPage(res_content, jsonData)
    }
  },
);

watch(
  () => props.message,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        sseRenderPage(newValue);
      }, 4000);
    }
  },
);

</script>
<style scoped>
@import "../../styles/reportModule.css";
</style>
