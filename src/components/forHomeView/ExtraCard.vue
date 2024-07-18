<script setup>
import { defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { checkLogin } from '@/utils/token.js'

const emit = defineEmits(['create_moment'])

const router = useRouter()
const message = useMessage()

function Enter_people_frame() {
  router.push({ path: '/RelationshipView' })
}
function create_moment() {
  if (!checkLogin()) {
    message.warning('请先登录！')
    return
  }
  emit('create', 1)
}
</script>
<template>
  <n-card class="card-container">
    <div class="card-content">
      <n-button size="large" quaternary>
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 12V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path>
                <path d="M4 18h17"></path>
                <path d="M18 15l3 3l-3 3"></path>
              </g>
            </svg>
          </n-icon>
        </template>
        <n-text
          style="font-size: 15px; color: rgb(0, 0, 0, 0.6); align-self: center"
          @click="create_moment"
          >发布个人动态</n-text
        >
      </n-button>
    </div>
    <n-divider style="margin: 10px"></n-divider>
    <div class="card-content" @click="Enter_people_frame">
      <n-button size="large" quaternary>
        <n-text
          style="font-size: 15px; font-family: 微软雅黑; font-weight: bold; align-self: center"
          >探索更多内容！</n-text
        >
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
            >
              <path
                d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm11.84 12.14L22 17.52V5.62a12 12 0 0 1 5.84 8.52zM12 18.68v-5.36L16 11l4 2.31v5.36L16 21zm8-14V11l-9.66-5.58A11.9 11.9 0 0 1 20 4.7zm-11.52 2L14 9.85L4 15.62a12 12 0 0 1 4.48-8.96zM4.16 17.85L10 14.47v11.91a12 12 0 0 1-5.84-8.53zM12 27.3V21l9.67 5.58A11.92 11.92 0 0 1 16 28a12.05 12.05 0 0 1-4-.7zm11.52-2L18 22.14l10-5.77a12 12 0 0 1-4.48 8.97z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
        </template>
      </n-button>
    </div>
  </n-card>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
  //top: 1vh;
}
.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
