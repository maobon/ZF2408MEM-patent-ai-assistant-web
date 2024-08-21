<template>
    <v-main class="bg-wrapper">
        <div class="container-box">
            <v-card class="card-box">
                <v-card-text class="top-box">
                    <p class="p1"><a class="crumbs" href="/record">我的报告</a>&nbsp;&nbsp;/&nbsp;&nbsp;<span
                            class="b">创建专利报告</span></p>
                    <p class="p2">专利报告范围检索</p>
                    <p class="p3">填写你的筛选条件，我们将根据专利、文献，通过专利智能助手为你快速生成个性化专利报告。</p>
                </v-card-text>
            </v-card>

            <v-card class="card-box input-card bottom-box">
                <div class="contain-box">
                    <div class="input-box">
                        <p class="lable-p"></p>
                        <p class="tip"></p>
                    </div>
                    <div class="input-box">
                        <p class="lable-p"><i style="color: red;">*&nbsp;</i>专利行业：</p>
                        <div class="text-box">
                            <v-text-field :model-value="industry" v-model="industry" variant="outlined" placeholder="请输入 如：汽车"
                                :rules="[() => !!industry || '请填写专利行业']"
                                ref="keyref"
                                required
                                density="compact"></v-text-field>
                        </div>
                    </div>
                    <div class="input-box">
                        <p class="lable-p">申请人：</p>
                        <div class="text-box">
                            <v-text-field :model-value="applicant" v-model="applicant" variant="outlined"
                                placeholder="请输入 如：宁德时代" density="compact"></v-text-field>
                        </div>
                    </div>
                    <div class="input-box">
                        <p class="lable-p">地域：</p>
                        <div class="text-box">
                            <v-text-field :model-value="area" v-model="area" variant="outlined" placeholder="请输入 如：中国"
                                density="compact"></v-text-field>
                        </div>
                    </div>

                    <div class="input-box">
                        <p class="lable-p">技术关键字：</p>
                        <div class="text-box">
                            <v-text-field :model-value="key" v-model="key" variant="outlined"
                                placeholder="请输入 如：锂电池" density="compact"></v-text-field>
                        </div>
                    </div>
                    <div class="input-box">
                        <p class="lable-p"></p>
                        <v-btn class="text-none ms-4 text-white btn-search" @click="gotoGenerate" color="blue-darken-4"
                            rounded="0" variant="flat">
                            生成报告
                        </v-btn>
                    </div>
                </div>
            </v-card>
        </div>
    </v-main>

</template>

<script setup>
import {onMounted, ref} from "vue";
import router from '@/router'

// const select = ref({ state: '技术背景和目标', abbr: 'patent_trend1' });
// const patent_trend1 = ref();
// const items =  [
//     { state: '技术背景和目标', abbr: 'patent_trend1' },
//     { state: '技术发展及衍变趋势分析', abbr: 'patent_trend2' },
//     { state: '申请人排名分析', abbr: 'patent_applicant' },
//     { state: '地域分布', abbr: 'patent_area' },
//     { state: '专利类型', abbr: 'patent_type' },
//     { state: '技术构成分析', abbr: 'patent_technology' },
//     { state: '集中度分析', abbr: 'patent_concentration' },
// ];
const industry = ref('');
const area = ref('');
const key = ref('');
const applicant = ref('');


const gotoGenerate = () => {

    if(!industry.value) {
        return false;
    }

    const query = {
        message: encodeURIComponent(JSON.stringify({
            industry: industry.value,
            area: area.value,
            key: key.value,
            applicant: applicant.value,
        }))
    }
    router.push({ path: '/generate', query })
}

onMounted(() => {
});
</script>

<style lang="scss" scoped>
.bg-wrapper {
    background-color: #f1f2f6;
}

.container-box {
    width: 1392px !important;
    margin: 24px auto;
}

.input-card {
    margin-top: 30px;
}

.top-box {
    padding: 16px 32px;
}

.top-box .p1 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
}

.top-box .p1 .b {
    color: rgb(24, 144, 255);
}

.top-box .p2 {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 60px;
}

.top-box .p3 {
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.65);
}

.contain-box {
    width: 600px;
    margin: 0 auto;
}

.btn-search {
    background-color: #0586fd !important;
    margin-inline-start: 0px !important;
}

.bottom-box {
    padding: 30px 0 100px;
}

.card-box {
    box-shadow: none;
}

.input-box {
    width: 510px;
    display: flex;
    justify-content: flex-start;
    margin: 0 auto 18px;
}

.lable-p {
    text-align: right;
    height: 40px;
    line-height: 40px;
    width: 100px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    ;
}

.text-box {
    flex: 1;
}

.tip {
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    padding-top: 10px;
}

.crumbs {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.45);
}
</style>
