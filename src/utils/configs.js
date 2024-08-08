export default {
  // Cloud
  // BASE_CLOUD_URL: 'http://110.42.103.198',
  // BASE_CLOUD_PORT: '22440',

  // BeiHang
  BASE_BUAA_URL: 'http://172.27.250.68',
  BASE_BUAA_PORT: '8080',

  // getCloudBackendServerURL() {
  //   return this.BASE_CLOUD_URL + ":" + this.BASE_CLOUD_PORT
  // },

  getBuaaBackendServerURL() {
    return this.BASE_BUAA_URL + ":" + this.BASE_BUAA_PORT
  },

  // real time generate text of report
  // DIFY_REAL_TIME_GEN_TEXT_CLOUD_URL: 'http://110.42.103.198:23837/v1/chat-messages',
  // DIFY_REAL_TIME_GEN_TEXT_CLOUD_API_KEY: 'app-XOm1EyPKw2EfeWS1vM5xC7bf',

  DIFY_REAL_TIME_GEN_TEXT_BUAA_URL: "http://172.27.250.68:8888/v1/chat-messages",
  DIFY_REAL_TIME_GEN_TEXT_BUAA_API_KEY: 'app-FX3v1wWhCC2OtgFEUQXCb7fi',

}
