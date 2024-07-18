import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueDPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'

const app = createApp(App)

app.use(router)

app.use(VueDPlayer)

app.mount('#app')
