export default {

  // Backend Server URL
  BASE_URL: 'http://172.27.112.3',
  BASE_PORT: '8080',

  getBackendServerURL() {
    return this.BASE_URL + ":" + this.BASE_PORT
  },

  // Backend Dify
  DIFY_REALTIME_TEXT_GENERATOR_PORT: '8888',

  getRealTimeTextGeneratorWorkflowURL() {
    return this.BASE_URL + ":" + this.DIFY_REALTIME_TEXT_GENERATOR_PORT + "/v1/chat-messages"
  },

  DIFY_REALTIME_GEN_TEXT_API_KEY: 'app-guq5xRECgZ1CRU07TGunLicn',
}
