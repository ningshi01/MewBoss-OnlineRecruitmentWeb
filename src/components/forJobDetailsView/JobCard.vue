<script setup>
import { ref, reactive, onMounted, watch, defineEmits } from 'vue'
import router from '@/router/index.js'
import {
  userResumeDownload,
  userResumePost,
  adminGetApplyList,
  adminApplyDeal
} from '@/api/apiList.js'
import { useRoute } from 'vue-router'
import { checkLogin } from '@/utils/token.js'
const emit = defineEmits(['Accept', 'Refuse', 'postResume'])
const message = useMessage()
const route = useRoute()
const showSubmitResumeModal = ref(false)
const submitResumeFormRef = ref(null)
const submitResumeForm = ref({
  info: ''
})

const submitResumeRules = {
  info: [{ required: true, message: '请输入申请说明', trigger: 'blur' }]
}
const handleShowSubmitResumeModal = () => {
  if (!checkLogin()) router.push({ path: '/Login' })
  showSubmitResumeModal.value = true
}
const postResume = () => {
  userResumePost({
    requirement_id: route.query.id,
    message: submitResumeForm.value.info
  }).then((res) => {
    if (res.errno === 0) {
      message.success('成功投递')
      showSubmitResumeModal.value = false
      emit('haveDelivered')
    }
  })
}

const props = defineProps({
  need_datas: {
    type: Object,
    required: true
  },
  is_admin: {
    type: Object,
    required: true
  }
})
let flag_Administration = ref()
let datas = reactive({
  id: '',
  users: [],
  is_delivered: false,
  title: '',
  description: '',
  job_position: '',
  salary: '',
  count: 0,
  feature: [],
  company: {},
  avatar_src: '',
  company_name: '',
  choose_applicant: '',
  apply_list: [],
  apply_content: '',
  now_apply: {},
  apply_need_deal: false,
  flag_post: false,
  filteredApplyList: [],
  select_1: true,
  select_2: true,
  select_3: true
})
function update_admin_data() {
  datas.id = props.need_datas.id
  datas.users = props.need_datas.users
  datas.is_delivered = props.need_datas.is_delivered
  datas.company = props.need_datas.company
  datas.title = props.need_datas.title
  datas.description = props.need_datas.description
  datas.job_position = props.need_datas.job_position
  datas.salary = props.need_datas.salary
  datas.count = props.need_datas.count
  datas.feature = props.need_datas.feature
  flag_Administration.value = props.is_admin
  console.log(flag_Administration.value)
  console.log(datas.id)
  if (datas.company) {
    datas.avatar_src = datas.company.img
    datas.company_name = datas.company.name
  }
  if (props.is_admin) {
    //管理员进入
    if (datas.id) {
      adminGetApplyList({
        id: datas.id
      }).then((res) => {
        datas.apply_list = res.data
        Filter_ApplyList()
      })
    }
  }
}

function chatWith(id) {
  router.push({ path: 'chat', query: { userid: id } })
}
function downloadResume(id) {
  userResumeDownload({ id: id })
    .then((res) => {
      console.log('不是哥们')
      console.log(res)

      // Extract the resume URL from the response data
      const resumeUrl = res.data.userprofile.resume

      // Fetch the resume file as a blob
      fetch(resumeUrl)
        .then((response) => response.blob())
        .then((blob) => {
          // Create a hidden download link
          const a = document.createElement('a')
          const url = URL.createObjectURL(blob)
          a.style.display = 'none'
          a.href = url
          a.download = '简历.pdf'

          // Append the link to the DOM and trigger the click event
          document.body.appendChild(a)
          a.click()

          // Remove the link and revoke the object URL
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        })
        .catch((error) => {
          console.error('Error fetching the resume:', error)
        })
    })
    .catch((error) => {
      console.error('Error downloading the resume:', error)
    })
}
function Analyse_state(state) {
  switch (state) {
    case 'Unprocessed':
      return '待处理'
    case 'Agreed':
      return '已录用'
    case 'Rejected':
      return '已拒绝'
  }
}
function Accept() {
  adminApplyDeal({
    id: datas.now_apply.id,
    is_accepted: true
  }).then((res) => {
    console.log(res)
    message.success('录用成功！')
  })
  emit('update', 1)
}
function Refuse() {
  adminApplyDeal({
    id: datas.now_apply.id,
    is_accepted: false
  }).then((res) => {
    console.log(res)
    message.info('拒绝录用！')
  })
  emit('update', 1)
}
const isShifted = ref(false)
function viewDetails_1(apply) {
  isShifted.value = true
  datas.choose_applicant = apply.sender
  datas.apply_content = apply.message
  datas.now_apply = apply
  if (datas.now_apply.state == 'Unprocessed') datas.apply_need_deal = true
  else datas.apply_need_deal = false
  nextTick(() => {
    const detailsContainer = document.querySelector('.card-details')
    detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
function viewDetails_2(apply) {
  isShifted.value = false
  datas.choose_applicant = apply.sender
  datas.apply_content = apply.message
  datas.now_apply = apply
  if (datas.now_apply.state == 'Unprocessed') datas.apply_need_deal = true
  else datas.apply_need_deal = false
}
function ToUserProfile(id) {
  router.push({ path: '/UserProfile', query: { id: id } })
}
function Filter_ApplyList() {
  datas.filteredApplyList = []
  if (datas.select_1) {
    datas.filteredApplyList.push(
      ...datas.apply_list.filter((apply) => apply.state === 'Unprocessed')
    )
  }
  if (datas.select_2) {
    datas.filteredApplyList.push(...datas.apply_list.filter((apply) => apply.state === 'Rejected'))
  }
  if (datas.select_3) {
    datas.filteredApplyList.push(...datas.apply_list.filter((apply) => apply.state === 'Agreed'))
  }
  return datas.filteredApplyList
}
onMounted(() => {})
watch(
  props,
  () => {
    update_admin_data()
  },
  { immediate: true }
)
</script>

<template>
  <div class="main-container">
    <div class="card-container" :class="{ expanded: isShifted }">
      <n-page-header class="card-item">
        <template #avatar>
          <a>
            <n-avatar :src="datas.avatar_src" />
          </a>
        </template>
        <template #title>
          <a>{{ datas.company_name }}</a>
        </template>
        <n-hr></n-hr>
        <div class="card-information">
          <div class="card-information-header">
            <n-text style="font-weight: bold; font-size: 25px">{{ datas.title }}</n-text>
            <n-button
              style="margin-right: 2vw"
              type="info"
              round
              size="large"
              v-if="!flag_Administration && !datas.is_delivered"
              @click="handleShowSubmitResumeModal"
            >
              <template #icon>
                <n-icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 32 32"
                  >
                    <g fill="none">
                      <path
                        d="M29.976 5.534a3.25 3.25 0 0 0-3.51-3.509L9.952 3.401c-2.757.23-3.985 3.58-2.028 5.537l1.913 1.914l-6.951 6.955a3.25 3.25 0 0 0 0 4.595l6.712 6.717a3.25 3.25 0 0 0 4.597 0l6.955-6.954l1.913 1.913c1.957 1.956 5.307.729 5.537-2.029l1.377-16.515z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                </n-icon>
              </template>
              申请
            </n-button>
          </div>
          <n-modal v-model:show="showSubmitResumeModal">
            <n-card class="modal-card" title="投递简历">
              <template #header-extra> </template>
              <n-form
                ref="submitResumeFormRef"
                :model="submitResumeForm"
                :rules="submitResumeRules"
              >
                <n-form-item label="申请说明" path="info" :required="true">
                  <n-input
                    v-model:value="submitResumeForm.info"
                    placeholder=""
                    type="textarea"
                    :autosize="{
                      minRows: 3
                    }"
                  />
                </n-form-item>
                <div style="display: flex; justify-content: flex-end">
                  <n-button type="primary" @click="postResume">确认</n-button>
                </div>
              </n-form>
            </n-card>
          </n-modal>
          <n-button class="card-information-item" text size="large" strong>
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M460 160h-88v-12A116.13 116.13 0 0 0 258.89 32h-5.78A116.13 116.13 0 0 0 140 148v12H52a4 4 0 0 0-4 4v300a16 16 0 0 0 16 16h384a16 16 0 0 0 16-16V164a4 4 0 0 0-4-4zm-280-11c0-41.84 33.41-76.56 75.25-77A76.08 76.08 0 0 1 332 148v12H180zm156 187H176v-32h160z"
                    fill="#2456C0FF"
                  ></path>
                </svg>
              </n-icon>
            </template>
            {{ datas.job_position }}
          </n-button>
          <n-button class="card-information-item" text size="large" strong>
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="#984141FF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 21h18"></path>
                    <path d="M5 21V7l8-4v18"></path>
                    <path d="M19 21V11l-6-4"></path>
                    <path d="M9 9v.01"></path>
                    <path d="M9 12v.01"></path>
                    <path d="M9 15v.01"></path>
                    <path d="M9 18v.01"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
            {{ datas.count }}人
          </n-button>
          <n-button class="card-information-item" text size="large" strong>
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="#5283B0FF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3.5 5.5L5 7l2.5-2.5"></path>
                    <path d="M3.5 11.5L5 13l2.5-2.5"></path>
                    <path d="M3.5 17.5L5 19l2.5-2.5"></path>
                    <path d="M11 6h9"></path>
                    <path d="M11 12h9"></path>
                    <path d="M11 18h9"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
            需求技能：
            <div v-for="f in datas.feature" :key="f.id">{{ f }}</div>
          </n-button>
          <n-button class="card-information-item" text size="large" strong>
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15c0-1.09 1.01-1.85 2.7-1.85c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61c0 2.31 1.91 3.46 4.7 4.13c2.5.6 3 1.48 3 2.41c0 .69-.49 1.79-2.7 1.79c-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55c0-2.84-2.43-3.81-4.7-4.4z"
                    fill="gold"
                  ></path>
                </svg>
              </n-icon>
            </template>
            预计薪资：{{ datas.salary }}
          </n-button>
        </div>
        <n-hr></n-hr>
        <div v-if="!flag_Administration">
          <n-text style="font-size: 20px; font-weight: bold">职位简介</n-text>
          <n-divider style="margin: 10px"></n-divider>
          <n-text style="white-space: pre-wrap; overflow-wrap: break-word">
            {{ datas.description }}
          </n-text>
          <n-hr></n-hr>
        </div>
        <div v-else>
          <n-text style="font-size: 20px; font-weight: bold">工单处理列表</n-text>
          <n-divider style="margin: 10px"></n-divider>
          <div style="display: flex">
            <n-space style="width: 10vw; color: #181818"
              ><n-switch v-model:value="datas.select_1" @click="update_admin_data" />待处理</n-space
            >
            <n-space style="width: 10vw; color: #181818"
              ><n-switch v-model:value="datas.select_2" @click="update_admin_data" />已拒绝</n-space
            >
            <n-space style="width: 10vw; color: #181818"
              ><n-switch v-model:value="datas.select_3" @click="update_admin_data" />已录用</n-space
            >
          </div>
          <n-divider style="margin: 10px"></n-divider>
          <n-table striped v-for="apply in datas.filteredApplyList" :key="apply.id">
            <tbody>
              <tr>
                <td style="display: flex; align-items: center">
                  <n-avatar
                    :src="apply.sender.userprofile.avatar"
                    @click="ToUserProfile(apply.sender.id)"
                  />
                  <div style="width: 1vw"></div>
                  <n-button
                    quaternary
                    style="font-size: 15px; font-weight: bold; width: 2vw"
                    @click="ToUserProfile(apply.sender.id)"
                    >{{ apply.sender.username }}</n-button
                  >
                </td>
                <td style="font-weight: bold">{{ Analyse_state(apply.state) }}</td>
                <td
                  style="font-weight: bold; text-align: right"
                  v-if="!isShifted || datas.now_apply.id != apply.id"
                >
                  <n-button quaternary style="font-weight: bold" @click="viewDetails_1(apply)"
                    >查看详情</n-button
                  >
                </td>
                <td
                  style="font-weight: bold; text-align: right"
                  v-if="isShifted && datas.now_apply.id == apply.id"
                >
                  <n-button quaternary style="font-weight: bold" @click="viewDetails_2(apply)"
                    >收起展示</n-button
                  >
                </td>
              </tr>
            </tbody>
          </n-table>
        </div>
      </n-page-header>
    </div>
    <div class="card-details" v-if="isShifted">
      <n-page-header class="card-item">
        <template #avatar>
          <a>
            <n-avatar :src="datas.choose_applicant.userprofile.avatar" />
          </a>
        </template>
        <template #title>
          <a>{{ datas.choose_applicant.username }}</a>
        </template>
        <n-hr></n-hr>
        <n-text style="font-size: 20px; font-weight: bold">基本信息</n-text>
        <n-divider style="margin: 10px"></n-divider>
        <div class="card-information">
          <n-button class="card-information-item" text size="large" strong>
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M460 160h-88v-12A116.13 116.13 0 0 0 258.89 32h-5.78A116.13 116.13 0 0 0 140 148v12H52a4 4 0 0 0-4 4v300a16 16 0 0 0 16 16h384a16 16 0 0 0 16-16V164a4 4 0 0 0-4-4zm-280-11c0-41.84 33.41-76.56 75.25-77A76.08 76.08 0 0 1 332 148v12H180zm156 187H176v-32h160z"
                    fill="#2456C0FF"
                  ></path>
                </svg>
              </n-icon>
            </template>
            真实姓名：{{ datas.choose_applicant.userprofile.name }}
          </n-button>
          <n-button class="card-information-item" text size="large" strong>
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M460 160h-88v-12A116.13 116.13 0 0 0 258.89 32h-5.78A116.13 116.13 0 0 0 140 148v12H52a4 4 0 0 0-4 4v300a16 16 0 0 0 16 16h384a16 16 0 0 0 16-16V164a4 4 0 0 0-4-4zm-280-11c0-41.84 33.41-76.56 75.25-77A76.08 76.08 0 0 1 332 148v12H180zm156 187H176v-32h160z"
                    fill="#2456C0FF"
                  ></path>
                </svg>
              </n-icon>
            </template>
            教育水平：{{ datas.choose_applicant.userprofile.education }}
          </n-button>
          <n-button class="card-information-item" text size="large" strong>
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M460 160h-88v-12A116.13 116.13 0 0 0 258.89 32h-5.78A116.13 116.13 0 0 0 140 148v12H52a4 4 0 0 0-4 4v300a16 16 0 0 0 16 16h384a16 16 0 0 0 16-16V164a4 4 0 0 0-4-4zm-280-11c0-41.84 33.41-76.56 75.25-77A76.08 76.08 0 0 1 332 148v12H180zm156 187H176v-32h160z"
                    fill="#2456C0FF"
                  ></path>
                </svg>
              </n-icon>
            </template>
            曾入职企业数：
            <div v-if="datas.choose_applicant.userprofile.company_joined">
              {{ datas.choose_applicant.userprofile.company_joined }}
            </div>
            <div v-else>无工作经验</div>
          </n-button>
        </div>
        <n-hr></n-hr>
        <n-text style="font-size: 20px; font-weight: bold">申请说明</n-text>
        <n-divider style="margin: 10px"></n-divider>
        <n-text class="apply-content" style="white-space: pre-wrap; overflow-wrap: break-word">
          {{ datas.apply_content }}
        </n-text>
        <n-hr></n-hr>
        <n-text style="font-size: 20px; font-weight: bold" v-if="datas.apply_need_deal"
          >操作列表</n-text
        >
        <n-divider style="margin: 10px" v-if="datas.apply_need_deal"></n-divider>
        <n-button-group style="display: flex; flex-direction: column" v-if="datas.apply_need_deal">
          <n-button
            quaternary
            class="details_button"
            style="font-weight: bold"
            @click="chatWith(datas.choose_applicant.id)"
            >和他聊聊</n-button
          >
          <n-divider style="margin: 10px" v-if="datas.apply_need_deal"></n-divider>
          <n-button
            quaternary
            class="details_button"
            style="font-weight: bold"
            @click="downloadResume(datas.choose_applicant.id)"
            >下载简历</n-button
          >
          <n-divider style="margin: 10px" v-if="datas.apply_need_deal"></n-divider>
          <n-button quaternary style="font-weight: bold" class="details_button" @click="Accept()"
            >予以录用</n-button
          >
          <n-divider style="margin: 10px" v-if="datas.apply_need_deal"></n-divider>
          <n-button quaternary style="font-weight: bold" class="details_button" @click="Refuse()"
            >拒绝录用</n-button
          >
        </n-button-group>
      </n-page-header>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin-top: 10px;
}

.card-container {
  padding: 0px;
  border: 1px solid #ccc;
  border-radius: 15px;
  width: 55%;
  padding: 2px;
  background-color: rgb(255, 255, 255);
  gap: 10px;
  color: #2456c0;
  transition: width 0.5s ease;
}

.card-container.expanded {
  width: 40%;
}

.card-details {
  padding: 0px;
  border: 1px solid #ccc;
  border-radius: 15px;
  width: 47%;
  height: auto;
  background-color: rgb(255, 255, 255);
  margin-left: 2%;
  transition: width 0.5s ease;
}

.details_button {
  height: 6vh;
  width: 100%;
}

.card-item {
  margin-left: 15px;
  margin-right: 18px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  font-family: Arial;
}

.card-information {
  display: flex;
  flex-direction: column;
}

.card-information-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-information-item {
  align-self: flex-start;
}

.apply-content {
  max-height: 200px;
  overflow-y: auto;
}

.modal-card {
  display: flex;
  flex-direction: column;
  width: 48vw;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
