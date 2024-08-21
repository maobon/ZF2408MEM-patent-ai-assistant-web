<template>
  <v-app>

    <AppHeader/>
    <v-main>
      <router-view/>
    </v-main>
    <AppFooter/>

  </v-app>
  <div v-if="!robotShow" class="rot-box">

    <!-- AI Chat Bot -->
    <!-- always display on the right conner of webpage -->
    <iframe src="http://172.27.112.3:8888/chatbot/p5zsDW6fQPKVPlul" frameborder="0" allow="microphone">
    </iframe>

    <a href="/record" class="link">我的报告 ></a>
    <span class="close" @click="toggle">关闭</span>
  </div>

  <div id="robot" v-if="robotShow" @click="toggle">
    <img src="@/assets/robot.png" class="robot-icon" alt=""/>
  </div>
</template>
<script setup>

import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

import {ref} from "vue";

const robotShow = ref(true);

function toggle() {
  robotShow.value = !robotShow.value;
}
</script>


<style scoped>
.rot-box {
  position: fixed;
  bottom: 45px;
  right: 10px;
  width: 500px;
  height: 540px;
  z-index: 1000;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.rot-box iframe {
  width: 500px;
  height: 500px;
  display: block;
}

.robot-icon {
  cursor: pointer;
  position: fixed;
  bottom: 35px;
  right: 30px;
  width: 100px;
  height: 100px;
  z-index: 1000;
}

.link {
  font-size: 14px;
  color: #0586fd;
  position: absolute;
  bottom: 10px;
  left: 20px;
  z-index: 1001;
}

.close {
  font-size: 14px;
  color: #999;
  position: absolute;
  bottom: 10px;
  right: 20px;
  z-index: 1001;
}
</style>

