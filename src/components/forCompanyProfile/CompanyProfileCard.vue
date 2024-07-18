<template>
  <n-card class="card">
    <template #cover>
      <img src="../../assets/defaultImg.png" class="cover" />
    </template>
    <template #footer>
      <div class="avatar-wrapper">
        <n-upload
          style="height: 0"
          :show-file-list="false"
          @change="handleAvatarChange"
          v-if="props.isManager"
        >
          <n-avatar class="avatar" :src="props.avatar_src" title="点击修改图片" />
        </n-upload>
        <n-avatar class="avatar" :src="props.avatar_src" v-else> </n-avatar>
      </div>
      <div class="message">
        <div class="body">
          <div class="left-body">
            <n-text style="font-size: 30px; font-weight: bold">{{ props.company_name }}</n-text>
            <n-text style="font-size: 15px; font-weight: bold">{{ brief_info }}</n-text>
            <div style="display: flex; width: 100%">
              <div v-for="(feature, index) in featured_jobs" :key="index" style="margin-right: 2%">
                <n-text style="font-size: 14px; font-weight: bold; color: grey">{{
                  feature
                }}</n-text>
              </div>
            </div>
            <div>
              <n-text style="font-size: 14px; color: grey">{{ followers_num }}位关注者</n-text>
              <n-button text tag="a" :href="props.home" target="_blank" type="primary">
                <n-text style="font-weight: bold; font-size: 16px; color: #044f9b; margin-left: 10%"
                  >访问网站</n-text
                >
              </n-button>
            </div>
            <div class="buttons" v-if="!isManager">
              <n-button
                round
                type="info"
                class="button"
                style="margin-top: 2vh"
                v-if="!isFollowed"
                @click="follow"
              >
                <n-text
                  style="
                    color: white;
                    font-size: 26px;
                    font-weight: bold;
                    margin-bottom: 7%;
                    margin-left: -5%;
                  "
                  >+</n-text
                >
                <n-text style="color: white; font-size: 17px; font-weight: bold; margin-left: 5%"
                  >关注</n-text
                >
              </n-button>
              <n-button
                round
                type="info"
                class="button"
                style="margin-top: 2vh"
                v-if="isFollowed"
                @click="unFollow"
              >
                <n-text style="color: white; font-size: 17px; font-weight: bold">已关注</n-text>
              </n-button>
              <n-button
                round
                secondary
                type="info"
                class="button"
                style="margin-top: 2vh; margin-left: 2%"
                v-if="false"
                @click="joinCompany"
              >
                <n-text style="color: #0a66c2; font-size: 17px; font-weight: bold; margin-left: 5%"
                  >企业认证</n-text
                >
              </n-button>
              <n-button
                round
                secondary
                type="info"
                class="button"
                style="margin-top: 2vh; margin-left: 2%"
                v-if="isJoin"
                @click="leaveCompany"
              >
                <n-text style="color: #0a66c2; font-size: 17px; font-weight: bold; margin-left: 5%"
                  >退出企业</n-text
                >
              </n-button>
            </div>
            <div class="buttons" v-if="isManager">
              <n-button
                round
                secondary
                type="info"
                class="button"
                style="margin-top: 2vh"
                @click="handleShowCompanyInfoModal"
              >
                <n-text style="color: #0a66c2; font-size: 17px; font-weight: bold; margin-left: 5%"
                  >修改资料</n-text
                >
              </n-button>
              <n-modal v-model:show="showCompanyInfoModal">
                <n-card class="modal-card" title="修改企业资料">
                  <template #header-extra> </template>
                  <n-form
                    ref="companyInfoFormRef"
                    :model="companyInfoForm"
                    :rules="companyInfoRules"
                  >
                    <n-form-item label="企业名称" path="name">
                      <n-input v-model:value="companyInfoForm.name" placeholder="" />
                    </n-form-item>
                    <n-form-item label="企业简介" path="info">
                      <n-input
                        v-model:value="companyInfoForm.info"
                        type="textarea"
                        :autosize="{
                          minRows: 3
                        }"
                        placeholder=""
                      />
                    </n-form-item>
                    <n-form-item label="企业网站 (请输入规范网址格式)" path="home">
                      <n-input v-model:value="companyInfoForm.home" placeholder="" />
                    </n-form-item>
                    <n-form-item label="企业方向" path="feature">
                      <n-select
                        v-model:value="companyInfoForm.feature"
                        multiple
                        :options="options"
                        placeholder=""
                      />
                    </n-form-item>
                    <div style="display: flex; justify-content: flex-end">
                      <n-button type="primary" @click="handleUpdateCompanyInfo">保存修改</n-button>
                    </div>
                  </n-form>
                </n-card>
              </n-modal>
              <n-button
                round
                type="info"
                class="button"
                style="margin-top: 2vh; margin-left: 2%"
                v-if="isManager"
                @click="handleShowAddEmployeeModal"
              >
                <n-text style="color: white; font-size: 17px; font-weight: bold">添加员工</n-text>
              </n-button>
              <n-modal v-model:show="showAddEmployeeModal">
                <n-card class="modal-card" title="添加员工">
                  <template #header-extra> </template>
                  <n-form
                    ref="addEmployeeFormRef"
                    :model="addEmployeeForm"
                    :rules="addEmployeeRules"
                  >
                    <n-form-item label="请输入邮箱" path="email" :required="true">
                      <n-input v-model:value="addEmployeeForm.email" placeholder="" />
                    </n-form-item>
                    <div style="display: flex; justify-content: flex-end">
                      <n-button type="primary" @click="addEmployee">添加</n-button>
                    </div>
                  </n-form>
                </n-card>
              </n-modal>
            </div>
          </div>
        </div>
      </div>
      <n-divider style="margin-top: 4%; width: 100%; margin-bottom: 0"></n-divider>
      <n-tabs type="line" style="margin-bottom: 0" size="large" v-model:selectedTab="selectedTab">
        <n-tab name="动态" @click="handleTabChange('动态')">动态</n-tab>
        <n-tab name="招聘" @click="handleTabChange('招聘')">招聘</n-tab>
        <n-tab name="员工列表" @click="handleTabChange('员工列表')" v-if="props.isManager"
          >员工列表</n-tab
        >
      </n-tabs>
    </template>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import {
  companyEmployeeAdd,
  companyFeatureUpdate,
  companyInfoUpdate,
  companySubscribe,
  companyUnsubscribe,
  userJoinCompany,
  userResign
} from '@/api/apiList.js'
const emits = defineEmits(['tabChanged', 'handleUpdateCompanyInfo']) // 声明自定义事件
const props = defineProps({
  avatar_src: { type: String, required: true },
  company_name: { type: String, required: true },
  brief_info: { type: String, required: true },
  followers_num: { type: Number, required: true },
  home: { type: String, required: true },
  isManager: { type: Boolean, required: true },
  isJoin: { type: Boolean, required: true },
  isInvited: { type: Boolean, required: true },
  company_id: { type: Number, required: true },
  featured_jobs: { type: Array, required: true },
  isFollowed: { type: Boolean, required: true }
})
const selectedTab = ref('动态')
// 监听标签页切换事件
const handleTabChange = (tabName) => {
  selectedTab.value = tabName
  emits('tabChanged', tabName)
}
//修改资料
const showCompanyInfoModal = ref(false)
const companyInfoFormRef = ref(null)
const companyInfoForm = ref({
  name: '',
  info: '',
  home: '',
  feature: []
})
const companyInfoRules = {
  name: [{ required: true, message: '请输入企业名称', trigger: 'change' }],
  info: [{ required: true, message: '请输入企业介绍', trigger: 'change' }],
  home: [{ message: '请输入企业网站', trigger: 'change' }],
  feature: [{ type: 'array', message: '请输入企业方向', trigger: 'change' }]
}
const handleShowCompanyInfoModal = () => {
  companyInfoForm.value.name = props.company_name
  companyInfoForm.value.info = props.brief_info
  companyInfoForm.value.home = props.home
  companyInfoForm.value.feature = props.featured_jobs
  showCompanyInfoModal.value = true
}
async function handleUpdateCompanyInfo() {
  const formData = new FormData()
  formData.append('name', companyInfoForm.value.name)
  formData.append('info', companyInfoForm.value.info)
  formData.append('home', companyInfoForm.value.home)
  await companyInfoUpdate(formData).then((res) => {
    if (res.errno === 0) {
      emits('handleUpdateCompanyInfo', 1)
      showCompanyInfoModal.value = false
    }
  })
  await companyFeatureUpdate({
    featured_jobs: companyInfoForm.value.feature
  }).then((res) => {
    if (res.errno === 0) {
      console.log(companyInfoForm.value.feature)
      emits('handleUpdateCompanyInfo', 1)
      showCompanyInfoModal.value = false
    }
  })
}
const options = [
  { label: 'Java', value: 'Java' },
  { label: 'C#', value: 'C#' },
  { label: '全栈工程师', value: '全栈工程师' },
  { label: 'Hadoop', value: 'Hadoop' },
  { label: 'C/C++', value: 'C/C++' },
  { label: '.NET', value: '.NET' },
  { label: '机器学习', value: '机器学习' },
  { label: '运维', value: '运维' },
  { label: '前端开发', value: '前端开发' },
  { label: '后端开发', value: '后端开发' },
  { label: '产品经理', value: '产品经理' },
  { label: '游戏策划', value: '游戏策划' },
  { label: '运营', value: '运营' },
  { label: '美术', value: '美术' },
  { label: '写作', value: '写作' },
  { label: '演员', value: '演员' },
  { label: '新闻', value: '新闻' },
  { label: '行政', value: '行政' },
  { label: '法务', value: '法务' },
  { label: '会计', value: '会计' },
  { label: '教师', value: '教师' },
  { label: '销售', value: '销售' },
  { label: '外卖', value: '外卖' },
  { label: '建筑', value: '建筑' },
  { label: '医生', value: '医生' },
  { label: '机械制造', value: '机械制造' },
  { label: '厨师', value: '厨师' },
  { label: '银行', value: '银行' }
]
//企业图片
const avatar_file = ref(null)
const message = useMessage()
const handleAvatarChange = (file) => {
  if (file && file.fileList && file.fileList.length > 0) {
    avatar_file.value = file.fileList[0].file
  }
  const avatarFormData = new FormData()
  avatarFormData.append('img', avatar_file.value)
  companyInfoUpdate(avatarFormData).then((res) => {
    if (res.errno === 0) {
      message.success('更新成功')
      emits('handleUpdateCompanyInfo')
    }
  })
}
//加入或退出企业
const joinCompany = () => {
  userJoinCompany({
    company_id: props.company_id
  }).then((res) => {
    if (res.errno === 0) {
      message.success('加入成功')
      emits('handleUpdateCompanyInfo')
    }
  })
}
const leaveCompany = () => {
  userResign().then((res) => {
    if (res.errno === 0) {
      message.success('已发送退出请求')
      emits('handleUpdateCompanyInfo')
    }
  })
}
//关注
const follow = () => {
  companySubscribe({
    company_id: props.company_id
  }).then((res) => {
    if (res.errno === 0) {
      emits('handleUpdateCompanyInfo')
    }
  })
}
const unFollow = () => {
  companyUnsubscribe({
    company_id: props.company_id
  }).then((res) => {
    if (res.errno === 0) {
      emits('handleUpdateCompanyInfo')
    }
  })
}
//添加员工
const showAddEmployeeModal = ref(false)
const addEmployeeFormRef = ref(null)
const addEmployeeForm = ref({
  email: ''
})
const addEmployeeRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
}
const handleShowAddEmployeeModal = () => {
  showAddEmployeeModal.value = true
}
const addEmployee = () => {
  companyEmployeeAdd({
    email: addEmployeeForm.value.email
  }).then((res) => {
    if (res.errno === 0) {
      message.success('成功发送邀请')
      showAddEmployeeModal.value = false
    }
  })
}
</script>
<style scoped>
.card {
  display: flex;
  flex-direction: column;
  margin-top: 8vh;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  --n-padding-bottom: 0 !important;
  position: relative;
}
.modal-card {
  display: flex;
  flex-direction: column;
  width: 48vw;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.cover {
  height: 14vh;
  width: 100%;
}
.avatar-wrapper {
  width: 16%;
  margin-top: -8%;
  margin-left: 1%;
  padding-top: 16%;
  position: relative;
}
.avatar {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
.message {
  display: flex;
  flex-direction: column;
  margin-left: 1%;
  width: 100%;
}
.body {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.left-body {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.buttons {
  display: flex;
}
.button {
  width: 8vw;
  height: 3.5vh;
}
</style>
