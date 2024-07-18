<template>
  <div class="card-container">
    <n-modal :mask-closable="false" class="modal" v-model:show="upload">
      <n-card class="card-content" closable @close="handleClose">
        <div class="content-wrapper">
          <n-avatar round :size="60" class="avatar" :src="data.avatar_src" />
          <span class="text">{{ data.usename }}</span>
        </div>
        <div class="editor-container">
          <n-input
            size="large"
            round
            placeholder="请在这里输入"
            type="textarea"
            class="editor"
            v-model:value="content"
          />
        </div>
        <n-divider style="margin: 10px"></n-divider>
        <div class="card-button-groups">
          <n-upload
            :headers="{
              'naive-info': 'hello!'
            }"
            :data="{
              'naive-data': 'cool! naive!'
            }"
            @before-upload="beforeUpload"
            @change="changeFile"
          >
            <n-button class="card-button" quaternary size="large" strong="true">
              <template #icon>
                <n-icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56s56-25.072 56-56s-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"
                      fill="#378fe9"
                    ></path>
                  </svg>
                </n-icon>
              </template>
              上传文件
            </n-button>
          </n-upload>
          <n-button
            class="card-button"
            quaternary
            size="large"
            strong="true"
            :disabled="isPublishDisabled"
            @click="submitMoment"
          >
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.66 9.53l-7.07 7.07l-4.24-4.24l1.41-1.41l2.83 2.83l5.66-5.66l1.41 1.41zM4 12c0-2.33 1.02-4.42 2.62-5.88L9 8.5v-6H3l2.2 2.2C3.24 6.52 2 9.11 2 12c0 5.19 3.95 9.45 9 9.95v-2.02c-3.94-.49-7-3.86-7-7.93zm18 0c0-5.19-3.95-9.45-9-9.95v2.02c3.94.49 7 3.86 7 7.93c0 2.33-1.02 4.42-2.62 5.88L15 15.5v6h6l-2.2-2.2c1.96-1.82 3.2-4.41 3.2-7.3z"
                    fill="indianred"
                  ></path>
                </svg>
              </n-icon>
            </template>
            发布
          </n-button>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { momentCreate } from '@/api/apiList.js'
const emit = defineEmits(['submitMoment', 'handleClose'])
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  avatar_src: {
    type: String,
    required: true
  }
})

const data = reactive({
  usename: '',
  avatar_src: ''
})
function update() {
  data.usename = props.username
  data.avatar_src = props.avatar_src
}

let upload = ref(true)
// 定义编辑器内容的响应式数据
const content = ref('')

const fileList = ref([])
const message = useMessage()

// 初始化编辑器内容
onMounted(() => {
  update()
})

const handleClose = () => {
  upload.value = false
  emit('close', 1)
}

//判断上传文件类型
async function beforeUpload(data) {
  if (data.file.file?.type !== 'video/mp4' && !data.file.file?.type.includes('image')) {
    message.error('只能上传mp4格式的视频文件，请重新上传')
    return false
  }
  return true
}
const formData = new FormData()
function changeFile(files) {
  /*if (file && file.fileList && file.fileList.length > 0) {
    avatar_file.value = file.fileList[0].file
  }*/
  //console.log(file)
  files.fileList.forEach((file) => {
    if (file.file.type.includes('image')) {
      formData.append('images', file.file)
    } else if (file.file.type.includes('video')) {
      formData.append('video', file.file)
    }
  })
}
function submitMoment() {
  formData.append('content', content.value)
  console.log(123123)
  momentCreate(formData)
    .then((res) => {
      console.log(res)
      message.success('成功发布动态！')
      for (let key of formData.keys()) {
        formData.delete(key)
      }
      handleClose()
      emit('update', 1)
    })
    .catch((err) => {
      console.log(err)
    })
}
// 计算发布按钮是否禁用
const isPublishDisabled = computed(() => {
  return !fileList.value.length && content.value === ''
})
</script>

<style scoped>
.content-wrapper {
  display: flex;
  align-items: center;
  gap: 10px; /* 设置图像和文本之间的间隙 */
  margin-bottom: 20px; /* 与编辑器保持一些距离 */
}
.card-button-groups {
  display: flex;
}
.avatar {
  margin-top: 0%;
}
.text {
  font-family: 'Microsoft YaHei', sans-serif; /* 设置字体为微软雅黑 */
  font-size: 24px; /* 放大字体大小 */
  margin-top: 1%;
}

.editor-container {
  width: 95%;
  height: 300px;
  border: 1px solid #ffffff; /* 设置黑色边框 */
  overflow-y: auto; /* 启用垂直滚动条 */
  padding: 10px;
  position: relative;
}

.editor {
  width: 100%;
  min-height: 300px;
  white-space: pre-wrap; /* 保留换行 */
  outline: none; /* 去除默认聚焦样式 */
  font-size: 18px; /* 放大字体大小 */
  font-family: 'Microsoft YaHei', sans-serif; /* 设置字体为微软雅黑 */
}
.card-content {
  border-radius: 10px;
  border: 3px solid #ccc;
  margin-left: 150px;
  margin-right: 150px;
}
</style>
