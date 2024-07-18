<template>
  <n-card class="card">
    <template #cover>
      <img src="../../assets/defaultImg.png" class="cover" />
    </template>
    <div class="avatar-wrapper">
      <n-upload style="height: 0" @change="handleAvatarChange" :show-file-list="false" v-if="isMe">
        <n-avatar round class="avatar" :src="props.avatar" title="点击修改头像"> </n-avatar>
      </n-upload>
      <n-avatar round class="avatar" :src="props.avatar" v-else> </n-avatar>
    </div>
    <div class="message">
      <div class="body">
        <div class="left-body">
          <n-text style="font-size: 24px; font-weight: bold">{{ props.username }}</n-text>
          <n-text style="font-size: 17px" v-if="education !== '未填写'">{{ education }}</n-text>
          <n-text style="font-size: 17px; color: grey; cursor: pointer" @click="goRelationshipView"
            >{{ fan_count }} 位关注者</n-text
          >
          <n-text style="font-size: 15px; color: grey">{{ email }}</n-text>
          <div class="buttons" v-if="!isMe">
            <n-button round type="info" class="button" @click="follow" v-if="!isFollow">
              <n-text style="color: white; font-size: 26px; font-weight: bold; margin-bottom: 6%"
                >+</n-text
              >
              <n-text style="color: white; font-size: 17px; font-weight: bold; margin-left: 5%"
                >关注</n-text
              >
            </n-button>
            <n-button round type="info" class="button" @click="unFollow" v-if="isFollow">
              <n-text style="color: white; font-size: 17px; font-weight: bold; margin-left: 5%"
                >已关注</n-text
              >
            </n-button>
            <n-button round secondary type="info" class="button" @click="sendMessage">
              <n-text style="color: #0a66c2; font-size: 17px; font-weight: bold; margin-left: 5%"
                >发消息</n-text
              >
            </n-button>
          </div>
          <div class="buttons" v-if="isMe">
            <n-button round type="info" class="button" @click="handleShowUserInfoModal">
              <n-text style="color: white; font-size: 17px; font-weight: bold">修改资料</n-text>
            </n-button>
            <n-modal v-model:show="showUserInfoModal">
              <n-card class="modal-card" title="修改个人资料">
                <template #header-extra> </template>
                <n-form ref="userInfoFormRef" :model="userInfoForm" :rules="userInfoRules">
                  <n-form-item label="真实姓名" path="name">
                    <n-input v-model:value="userInfoForm.name" placeholder="" />
                  </n-form-item>
                  <n-form-item label="用户名" path="username">
                    <n-input v-model:value="userInfoForm.username" placeholder="" />
                  </n-form-item>
                  <n-form-item label="学历" path="education">
                    <n-select v-model:value="userInfoForm.education" :options="educationOptions" />
                  </n-form-item>
                  <n-form-item label="兴趣岗位" path="feature">
                    <n-select
                      v-model:value="userInfoForm.feature"
                      multiple
                      :options="options"
                      placeholder=""
                    />
                  </n-form-item>
                  <n-form-item label="博客 (请输入规范网址格式)" path="blog">
                    <n-input v-model:value="userInfoForm.blog" placeholder="" />
                  </n-form-item>
                  <n-form-item label="github (请输入规范网址格式)" path="github">
                    <n-input v-model:value="userInfoForm.github" placeholder="" />
                  </n-form-item>
                  <n-text style="font-weight: bold; font-size: 20px">添加企业后可填写</n-text>
                  <n-form-item label="工龄" path="work_year" style="margin-top: 2vh">
                    <n-input
                      v-model:value="userInfoForm.work_year"
                      placeholder=""
                      :disabled="!isHaveCompany"
                    />
                  </n-form-item>
                  <n-form-item label="岗位" path="job_name">
                    <n-input
                      v-model:value="userInfoForm.job_name"
                      placeholder=""
                      :disabled="!isHaveCompany"
                    />
                  </n-form-item>
                  <div class="avatar-change">
                    <n-button type="primary" @click="handleUpdateUserInfo">保存修改</n-button>
                  </div>
                </n-form>
              </n-card>
            </n-modal>
            <n-button
              round
              secondary
              type="info"
              class="button"
              @click="showResumeUpload = !showResumeUpload"
            >
              <n-text style="color: #0a66c2; font-size: 17px; font-weight: bold">简历</n-text>
            </n-button>
          </div>
        </div>
        <div class="right-body">
          <div
            style="
              display: flex;
              gap: 2vw;
              margin-bottom: 4vh;
              height: 6vh;
              margin-top: 2vh;
              justify-content: center;
            "
          >
            <n-button text class="text-button" v-if="isMe" @click="goRelationshipView">
              <div class="text-button-content">
                <n-text style="font-size: 19px; font-weight: bold">{{
                  subscribed_user_count
                }}</n-text>
                <n-text style="font-size: 19px; font-weight: bold">关注用户</n-text>
              </div>
            </n-button>
            <n-button text class="text-button" v-if="isMe" @click="goRelationshipView">
              <div class="text-button-content">
                <n-text style="font-size: 19px; font-weight: bold">{{
                  subscribed_company_count
                }}</n-text>
                <n-text style="font-size: 19px; font-weight: bold">关注企业</n-text>
              </div>
            </n-button>
          </div>
          <n-button
            round
            secondary
            class="create-button"
            v-if="!props.isHaveCompany && isMe"
            @click="showModal = true"
          >
            <n-text style="font-size: 19px; font-weight: bold; margin-left: 5%">创建企业</n-text>
          </n-button>
          <n-modal v-model:show="showModal">
            <n-card class="modal-card" title="创建企业">
              <n-form ref="formRef" :model="modelRef" :rules="rules">
                <n-form-item path="name" label="企业名称">
                  <n-input v-model:value="modelRef.name" placeholder="" @keydown.enter.prevent />
                </n-form-item>
                <n-form-item path="brief" label="企业简介">
                  <n-input
                    v-model:value="modelRef.brief"
                    placeholder=""
                    type="textarea"
                    :autosize="{
                      minRows: 3
                    }"
                    @keydown.enter.prevent
                  />
                </n-form-item>
                <n-form-item path="picture" label="图片">
                  <n-upload :on-change="handleFileChange">
                    <n-button>上传文件</n-button>
                  </n-upload>
                </n-form-item>
                <n-form-item path="home" label="企业网站">
                  <n-input v-model:value="modelRef.home" placeholder="" @keydown.enter.prevent />
                </n-form-item>
                <n-row :gutter="[0, 24]">
                  <n-col :span="24">
                    <div style="display: flex; justify-content: flex-end">
                      <n-button round type="primary" @click="handleValidateButtonClick">
                        确认
                      </n-button>
                    </div>
                  </n-col>
                </n-row>
              </n-form>
            </n-card>
          </n-modal>
          <n-button text @click="goCompany" class="text-button">
            <n-text style="font-size: 20px; font-weight: bold" v-if="props.isHaveCompany">
              企业 : {{ company_name }}
            </n-text>
          </n-button>
        </div>
      </div>
    </div>
  </n-card>
  <Transition>
    <div class="resumeUpload" v-if="showResumeUpload">
      <n-upload
        ref="uploader"
        multiple
        directory-dnd
        v-model:fileList="files"
        :max="1"
        @before-upload="handleUploaderChange"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>
          <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0"> 文件不大于5M (pdf) </n-p>
        </n-upload-dragger>
      </n-upload>
      <div class="uploadBlock">
        <n-button style="margin-right: 5%" @click="downloadResume()"> 查看简历 </n-button>
        <n-button @click="submitResume()"> 提交简历 </n-button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import {
  companyCreate,
  userAvatarUpload,
  userInfoUpdate,
  userResumeUpdate,
  userResumePreview,
  userSubscribe,
  userUnsubscribe
} from '@/api/apiList.js'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { downloadUrl } from '@/utils/files'
onMounted(() => {
  if (typeof route.query.new !== 'undefined') {
    showUserInfoModal.value = true
  }
})
onBeforeRouteLeave(() => {
  showUserInfoModal.value = false
})
const emit = defineEmits(['handleUpdateUserInfo'])
const props = defineProps({
  isMe: { type: Boolean, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  education: { type: String, required: true },
  email: { type: String, required: true },
  company_name: { type: String, required: true },
  avatar: { type: String, required: true },
  isHaveCompany: { type: Boolean, required: true },
  company_id: { type: Number },
  blog: { type: String },
  github: { type: String },
  work_year: { type: String },
  job_name: { type: String },
  resume: { type: String },
  isFollow: { type: Boolean, required: true },
  feature: { type: Array, required: true },
  subscribed_user_count: { type: Number, required: true },
  subscribed_company_count: { type: Number, required: true },
  fan_count: { type: Number, required: true }
})
const router = useRouter()
const formRef = ref(null)
const userInfoFormRef = ref(null)

const modelRef = ref({
  name: null,
  brief: null,
  picture: null,
  home: null
})
const userInfoForm = ref({
  name: null,
  username: null,
  education: null,
  blog: null,
  github: null,
  work_year: null,
  job_name: null,
  feature: null
})
const handleFileChange = ({ fileList }) => {
  if (fileList.length > 0) {
    modelRef.value.picture = fileList[0].file
  } else {
    modelRef.value.picture = null
  }
}
const validatePicture = (rule, value) => {
  if (!value) {
    return Promise.reject(rule.message)
  } else {
    return Promise.resolve()
  }
}
const rules = {
  name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  brief: [{ required: true, message: '请输入企业简介', trigger: 'blur' }],
  picture: [
    { required: true, message: '请上传图片', validator: validatePicture, trigger: 'change' }
  ],
  home: [{ required: true, message: '请输入企业网站', trigger: 'blur' }]
}
const userInfoRules = {
  name: [{ required: true, message: '请输入真实姓名', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
  education: [{ message: '请选择学历', trigger: 'change' }],
  feature: [{ type: 'array', message: '请选择兴趣岗位', trigger: 'change' }],
  blog: [{ message: '输入合法地址', trigger: 'change' }],
  github: [{ message: '输入合法地址', trigger: 'change' }],
  work_year: [{ message: '输入工龄', trigger: 'change' }],
  job_name: [{ message: '输入岗位', trigger: 'change' }]
}

const message = useMessage()
const showModal = ref(false)
//个人信息变更
const avatar_file = ref(null)
const handleAvatarChange = (file) => {
  if (file && file.fileList && file.fileList.length > 0) {
    avatar_file.value = file.fileList[0].file
  }
  const avatarFormData = new FormData()
  avatarFormData.append('avatar', avatar_file.value)
  userAvatarUpload(avatarFormData).then((res) => {
    if (res.errno === 0) {
      message.success('更新成功')
      emit('handleUpdateUserInfo')
      router.go(0)
      file.fileList = []
    }
  })
}
const showResumeUpload = ref(false)
const files = ref([])
const submitResume = () => {
  if (files.value.length == 0) {
    window.$message.warning('您还没有上传简历')
    return
  }
  let formData = new FormData()
  formData.append('resume', files.value[0].file)
  userResumeUpdate(formData).then((res) => {
    if (res.errno === 0) {
      window.$message.success('上传成功')
    }
  })
}

const uploader = ref(null)
function handleUploaderChange({ file }) {
  const fileSize = parseFloat(((file.file.size ?? 0) / 1024 / 1024).toFixed(1))
  if (fileSize > 5) {
    window.$message.warning('文件大小不符合要求，请重新上传')
    return false
  } else if (file.file.type != 'application/pdf') {
    window.$message.warning('文件格式不符合要求，请重新上传')
    return false
  }
  return true
}

const downloadResume = () => {
  if (files.value[0]) {
    let file = files.value[0]
    const formData = new FormData()
    formData.append('file', file.file)
    userResumePreview(formData).then((res) => {
      downloadUrl(res.data.file, file.name)
    })
  } else if (props.resume) {
    downloadUrl(props.resume)
  } else {
    window.$message.warning('你还有没有上传简历')
  }
}

const showUserInfoModal = ref(false)
const handleShowUserInfoModal = () => {
  userInfoForm.value.name = props.name
  userInfoForm.value.username = props.username
  userInfoForm.value.education = props.education
  userInfoForm.value.email = props.email
  userInfoForm.value.feature = props.feature
  showUserInfoModal.value = true
}
const handleValidateButtonClick = () => {
  formRef.value.validate((errors) => {
    if (errors) {
      message.error('error')
    } else {
      const formData = new FormData()
      formData.append('name', modelRef.value.name)
      formData.append('info', modelRef.value.brief)
      formData.append('image', modelRef.value.picture)
      formData.append('home', modelRef.value.home)
      companyCreate(formData).then((res) => {
        router.push({ name: 'CompanyProfile', query: { id: res.data.id } })
      })
    }
  })
}
const educationOptions = [
  { label: '初中及以下', value: '初中及以下' },
  { label: '中专/中技', value: '中专/中技' },
  { label: '高中', value: '高中' },
  { label: '大专', value: '大专' },
  { label: '本科', value: '本科' },
  { label: '硕士', value: '硕士' },
  { label: '博士', value: '博士' }
]
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
const handleUpdateUserInfo = () => {
  userInfoUpdate({
    name: userInfoForm.value.name,
    username: userInfoForm.value.username,
    education: userInfoForm.value.education,
    interest_position: userInfoForm.value.feature,
    blog: userInfoForm.value.blog,
    github: userInfoForm.value.github,
    work_year: userInfoForm.value.work_year,
    job_name: userInfoForm.value.job_name
  }).then((res) => {
    if (res.errno === 0) {
      emit('handleUpdateUserInfo')
      showUserInfoModal.value = false
    }
  })
}
//关注
const route = useRoute()
const follow = () => {
  userSubscribe({
    id: route.query.id
  }).then((res) => {
    if (res.errno === 0) {
      emit('handleUpdateUserInfo')
    }
  })
}
const unFollow = () => {
  userUnsubscribe({
    id: route.query.id
  }).then((res) => {
    if (res.errno === 0) {
      emit('handleUpdateUserInfo')
    }
  })
}
const sendMessage = () => {
  router.push({ name: 'chat', query: { userid: route.query.id } })
}

//跳转企业
const goCompany = () => {
  router.push({ name: 'CompanyProfile', query: { id: props.company_id } })
}
//跳转人脉
const goRelationshipView = () => {
  router.push('RelationshipView')
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: 0.2s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.uploadBlock {
  display: flex;
  flex-flow: row;
  justify-content: end;
}

.resumeUpload {
  display: flex;
  flex-flow: column;
  width: 99%;
  background-color: rgb(255, 255, 255);
  min-height: 200px;
  margin: auto;
  margin-top: 5px;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  padding: 3%;
}

.card {
  display: flex;
  flex-direction: column;
  margin-top: 8vh;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.modal-card {
  display: flex;
  flex-direction: column;
  width: 48vw;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.cover {
  height: 21vh;
}

.avatar-wrapper {
  width: 21%;
  margin-top: -15%;
  margin-left: 1%;
  padding-top: 21%;
  position: relative;
}

.avatar {
  cursor: pointer;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.avatar-change {
  display: flex;
  justify-content: flex-end;
}

.message {
  display: flex;
  flex-direction: column;
  margin-left: 1%;
  margin-top: -4%;
}
.body {
  display: flex;
  justify-content: space-between;
}

.left-body {
  display: flex;
  flex-direction: column;
  margin-top: 5vh;
}

.right-body {
  display: flex;
  flex-direction: column;
  margin-right: 3vw;
}

.buttons {
  display: flex;
  gap: 5%;
  margin-top: 2vh;
}

.button {
  width: 8vw;
  height: 3.5vh;
}

.create-button {
  width: 8vw;
  margin-top: 1%;
  border: 2px solid black;
  transition: all 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-button {
  :hover {
    color: #308be7;
  }
}
.text-button-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1vh;
}
</style>
