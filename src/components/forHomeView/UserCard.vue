<script setup>
import { useRouter } from 'vue-router'
import { companyInfoGet } from '@/api/apiList.js'
import { checkLogin, getToken } from '@/utils/token.js'
const props = defineProps({
  avatar_src: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  company_joined: {
    type: Number,
    required: true
  },
  job_name: {
    type: String,
    required: true
  }
})

const router = useRouter()
function Enter_message_list() {
  router.push({ path: '/chat' })
}
function Enter_follow_list() {
  router.push({ path: '/RelationshipView' })
}
function Enter_people_frame() {
  router.push({ path: '/RelationshipView' })
}
let datas = reactive({
  avatar_src: '',
  username: '',
  job_name: '',
  company_name: '',
  company_id: 0
})
function update_datas() {
  if (props.job_name != null) datas.job_name = props.job_name
  datas.avatar_src = props.avatar_src
  datas.username = props.username
}
function get_company_name() {
  if (props.company_joined != null) {
    companyInfoGet({
      id: props.company_joined
    }).then((res) => {
      datas.company_name = res.data.name
      datas.company_id = res.data.id
      console.log(res.data.name)
    })
  }
}
function ToUserProfile() {
  router.push({ path: '/UserProfile', query: { id: getToken('id') } })
}
function ToCompanyProfile() {
  router.push({ path: '/CompanyProfile', query: { id: datas.company_id } })
}
onMounted(() => {
  if (checkLogin()) {
    get_company_name()
  }
  update_datas()
})
</script>

<template>
  <n-card class="card-container">
    <template #cover>
      <img src="../../assets/defaultImg.png" class="cover" />
    </template>
    <n-avatar round :size="70" class="avatar" :src="datas.avatar_src" @click="ToUserProfile" />
    <div class="card-content-1">
      <n-text style="font-size: 20px; font-weight: bold" @click="ToUserProfile">{{
        datas.username
      }}</n-text>
      <n-text
        style="font-size: 12px; font-family: 微软雅黑; color: rgb(0, 0, 0, 0.6)"
        @click="ToCompanyProfile"
        >{{ datas.company_name }}</n-text
      >
      <n-text style="font-size: 12px; font-family: 微软雅黑; color: rgb(0, 0, 0, 0.6)">{{
        datas.job_name
      }}</n-text>
    </div>
    <n-divider style="margin: 10px"></n-divider>
    <div class="card-content-2" @click="Enter_message_list">
      <n-button size="large" quaternary>
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
            >
              <g fill="none">
                <path
                  d="M7 13a9 9 0 0 1 18 0v3.807l1.928 4.822A1 1 0 0 1 26 23H6a1 1 0 0 1-.928-1.371L7 16.807V13zm5.125 12A3.99 3.99 0 0 0 16 28a3.99 3.99 0 0 0 3.875-3h-7.75z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
        </template>
        <n-text style="font-size: 15px; font-weight: bold; align-self: center">消息列表</n-text>
      </n-button>
    </div>
    <n-divider style="margin: 10px"></n-divider>
    <div class="card-content-2" @click="Enter_follow_list">
      <n-button size="large" quaternary>
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 20 20"
            >
              <g fill="none">
                <path
                  d="M4 4.5A2.5 2.5 0 0 1 6.5 2h7A2.5 2.5 0 0 1 16 4.5v13a.5.5 0 0 1-.794.404L10 14.118l-5.206 3.786A.5.5 0 0 1 4 17.5v-13z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
        </template>
        <n-text style="font-size: 15px; font-weight: bold; align-self: center">关注列表</n-text>
      </n-button>
    </div>
    <n-divider style="margin: 10px"></n-divider>
    <div class="card-content-3" @click="Enter_people_frame">
      <n-button size="large" quaternary>
        <n-text
          style="
            font-size: 15px;
            font-family: 微软雅黑;
            color: rgb(0, 0, 0, 0.6);
            align-self: center;
          "
          >拓展职场人脉</n-text
        >
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
            >
              <path
                d="M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16S9.4 4 16 4m0-2C8.3 2 2 8.3 2 16s6.3 14 14 14s14-6.3 14-14S23.7 2 16 2z"
                fill="currentColor"
              ></path>
              <path d="M24 15h-7V8h-2v7H8v2h7v7h2v-7h7z" fill="currentColor"></path>
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
  margin-bottom: 10px;
  //top: 1vh;
}
.cover {
  height: 7vh;
}
.avatar {
  position: absolute;
  left: 36%;
  top: 5%;
  border: 2px solid white;
}
.card-content-1 {
  margin-top: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}
.card-content-2 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-content-3 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
