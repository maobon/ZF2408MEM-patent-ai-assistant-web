<template>
  <v-main class="bg-wrapper">
    <div class="container-box">
      <v-card class="card-box">
        <v-card-text class="top-box">
          <p class="p1"><a class="crumbs" href="/record">我的报告</a>&nbsp;&nbsp;/&nbsp;&nbsp;<a class="crumbs"
                                                                                                 href="/search">创建专利报告</a>&nbsp;&nbsp;/&nbsp;&nbsp;<span
            class="b">专利报告详情</span></p>
          <p class="p2">{{ title }}</p>
          <p class="p3">&nbsp;</p>
          <div class="btn-box">
            <v-btn class="text-none ms-4 text-white btn-search0" variant="outlined" @click="$router.push('/record')"
                   color="blue-darken-4" rounded="0">
              历史报告
            </v-btn>
            <v-btn class="text-none ms-4 text-white btn-search1" @click="generate_pdf_fn" color="blue-darken-4"
                   rounded="0"
                   variant="flat">
              下载报告
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <div class="article-box">

        <v-row>
          <v-col cols="3">
            <v-sheet rounded="lg">
              <div :class=leftTabsFixed id="leftTabs" style="width: 330px;">
                <v-list rounded="lg">
                  <v-list-item
                    v-for="(item, index) in leftTabs"
                    :class="{ activeTab: activeTabIndex === index }"
                    :key="index"
                    :title="`${item}`"
                    link
                    @click="scrollTabElement(index)"
                  />
                </v-list>
              </div>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="80vh" rounded="lg">
              <!-- main content -->
              <v-card flat>
                <v-patent-trend1 :message=message :detailData=dataPatentTrend1 chartId="chart0"/>
                <v-patent-trend2 :message=message :detailData=dataPatentTrend2 chartId="chart1"/>
                <v-patent-applicant :message=message :detailData=dataPatentApplicant chartId="chart2"/>
                <v-patent-area :message=message :detailData=dataPatentArea chartId="chart3"/>
                <v-patent-type :message=message :detailData=dataPatentType chartId="chart4"/>
                <v-patent-technology :message=message :detailData=dataPatentTechnology chartId="chart5"/>
                <v-patent-concentration :message=message :detailData=dataPatentConcentration chartId="chart6"/>
              </v-card>
            </v-sheet>
          </v-col>

        </v-row>

      </div>

    </div>
  </v-main>
</template>
<script>
import vPatentTrend1 from "./reportModule/PatentTrend1.vue"
import vPatentTrend2 from "./reportModule/PatentTrend2.vue"
import vPatentApplicant from "./reportModule/PatentApplicant.vue"
import vPatentArea from "./reportModule/PatentArea.vue"
import vPatentType from "./reportModule/PatentType.vue"
import vPatentTechnology from "./reportModule/PatentTechnology.vue"
import vPatentConcentration from "./reportModule/PatentConcentration.vue"


export default {
  components: {
    vPatentTrend1,
    vPatentTrend2,
    vPatentApplicant,
    vPatentArea,
    vPatentType,
    vPatentTechnology,
    vPatentConcentration,
  }
}
</script>

<script setup>
import {ref, onMounted, onUnmounted} from "vue";
import router from '@/router'
import {report_detail, report_save} from '../api/api'
import configs from "@/utils/configs";

const activeTabIndex = ref(0);
const leftTabsFixed = ref('');

const reportId = ref(null);
const message = ref(null);
const title = ref(null);

const dataPatentTrend1 = ref(null);
const dataPatentTrend2 = ref(null);
const dataPatentApplicant = ref(null);
const dataPatentArea = ref(null);
const dataPatentType = ref(null);
const dataPatentTechnology = ref(null);
const dataPatentConcentration = ref(null);

const leftTabs = [
  "技术背景和目标",
  "技术发展及演变趋势分析",
  "申请人排名分析",
  "地域分析",
  "专利类型",
  "技术构成分析",
  "专利集中度分析",
];

const report_save_fn = async (param) => {
  const {industry, area, key, applicant} = JSON.parse(decodeURIComponent(param));
  const data = {
    user_id: '21914df4-4745-43da-979a-c4adca6a58c0',
    key,
    industry,
    area,
    applicant
  }
  const res = await report_save(data)
  if (res.data) {
    reportId.value = res.data.id;
    title.value = res.data.title;
    const data = JSON.parse(decodeURIComponent(query.message));
    data.report_id = reportId.value;
    message.value = data;
    console.log(message.value)
  }
}

const report_detail_fn = async (id) => {
  const data = {
    'id': parseInt(id),
    'userId': '21914df4-4745-43da-979a-c4adca6a58c0'
  }
  const res = await report_detail(data)
  if (res.data) {
    if (res.data.length > 0) {
      title.value = res.data[0].title;
    }
    res.data.forEach(item => {
      if (item.type === "patent_trend1") {
        dataPatentTrend1.value = item
      }
      if (item.type === "patent_trend2") {
        dataPatentTrend2.value = item
      }
      if (item.type === "patent_applicant") {
        dataPatentApplicant.value = item
      }
      if (item.type === "patent_area") {
        dataPatentArea.value = item
      }
      if (item.type === "patent_type") {
        dataPatentType.value = item
      }
      if (item.type === "patent_technology") {
        dataPatentTechnology.value = item
      }
      if (item.type === "patent_concentration") {
        dataPatentConcentration.value = item
      }
    });

  } else {

    const item = {
      content: 'errordata',
      data: null
    }
    dataPatentTrend1.value = item;
    dataPatentTrend2.value = item;
    dataPatentApplicant.value = item;
    dataPatentArea.value = item;
    dataPatentType.value = item;
    dataPatentTechnology.value = item;
    dataPatentConcentration.value = item;
  }
}
const query = router.currentRoute.value.query;

if (query.id) {
  report_detail_fn(query.id)
  reportId.value = query.id;
}

if (query.message) {
  report_save_fn(query.message);
}

const generate_pdf_fn = async () => {

  fetch(configs.getBackendServerURL() + '/generate-pdf', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reportId: reportId.value + '',
      userId: '21914df4-4745-43da-979a-c4adca6a58c0'
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob(); // Assuming the response is a PDF file
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title.value + '.pdf'; // Specify the filename
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });


}


const scrollTabElement = (index) => {
  const chart = document.querySelector('#chart' + index);
  window.scrollTo({
    top: chart.offsetTop,
    behavior: 'smooth'
  });
  activeTabIndex.value = index;
}

function getCurrentIndex() {

  let index = 0;
  for (let i = 0; i < 7; i++) {
    const chart = document.querySelector('#chart' + i);
    const rect = chart.getBoundingClientRect();

    if (rect.top > 0) {
      index = i;
      break;
    }
  }

  return index;
}

function onScrollFn() {
  if (window.scrollY > 175) {
    leftTabsFixed.value = 'leftTabsFixed';
  } else {
    leftTabsFixed.value = '';
  }

  const index = getCurrentIndex();
  activeTabIndex.value = index;

}

onMounted(() => {
  window.addEventListener('scroll', onScrollFn);
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScrollFn);
})


</script>

<style lang="scss" scoped>
.bg-wrapper {
  background-color: #f1f2f6;
}

.container-box {
  width: 1392px !important;
  margin: 24px auto;
}

.card-box {
  box-shadow: none;
}

.top-box {
  padding: 16px 32px;
}

.top-box .p1 {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  height: 22px;
}

.top-box .p1 .b {
  color: rgb(24, 144, 255);
}

.top-box .p2 {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 60px;
  height: 60px;
}

.top-box .p3 {
  font-size: 14px;
  line-height: 22px;
  height: 22px;
  color: rgba(0, 0, 0, 0.65);
}

button.btn-search0 {
  border: 1px solid rgb(217, 217, 217) !important;
  color: rgba(0, 0, 0, 0.65) !important;
}

.btn-search1 {
  background-color: #0586fd !important;
}

.btn-box {
  width: 230px;
  height: 40px;
  position: absolute;
  top: 50px;
  right: 30px;
}

.article-box {
  margin-top: 24px;
}

.leftTabsFixed {
  position: fixed;
  top: 90px;
}

.activeTab {
  background-color: #0586fd !important;
  color: #ffffff !important;
}

.crumbs {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.45);
}
</style>
