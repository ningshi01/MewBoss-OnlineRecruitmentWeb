<script setup>
import { ref, watch, onMounted, reactive, defineEmits } from 'vue'
import { getRestTimes, userResumeUpdate, userTimesReduce } from '@/api/apiList.js'
import { marked } from 'marked'
import { checkLogin, getToken } from '@/utils/token.js'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun } from 'docx'

const files = ref([])
const loading = ref(false)
const showSuggestions = ref(false)
const suggestions = ref([])
const message = ref('')
let remainingEnhanceTimes = reactive({ n: 0 })
const emit = defineEmits(['show-recommend', 'show-mine'])
let url = reactive({ String: '' })
onMounted(() => {
  init()
})

function init() {
  getRestTimes({}).then((res) => {
    if (res.errno === 0) {
      remainingEnhanceTimes.n = res.data.resume_enhance_tokens
    }
  })
}

function My_position() {
  emit('show-mine')
}

function handleUploaderChange({ file }) {
  if (!checkLogin()) {
    window.$message.warning('您还未登录！')
    return
  }
  const fileSize = parseFloat(((file.file.size ?? 0) / 1024 / 1024).toFixed(1))
  if (fileSize > 5) {
    window.$message.warning('文件大小不符合要求，请重新上传')
    return false
  } else if (file.file.type != 'application/pdf') {
    window.$message.warning('文件格式不符合要求，请重新上传')
    return false
  }
  console.log('pass')
  return true
}

function resetDrawer() {
  suggestions.value = []
  message.value = ''
  markdownSuggestions.value = ''
}

async function Enhance_resume() {
  if (remainingEnhanceTimes.n > 0) {
    loading.value = true
    showSuggestions.value = true // 打开drawer
    resetDrawer() // Reset the drawer content

    const res = await getRestTimes({})
    if (res.errno === 0) {
      console.log(res.data.resume)
      url.String = res.data.resume
      console.log(url.String)
    }

    if (url.String) {
      const response = await fetch('/api/enhance_resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Csrftoken': getToken('csrftoken')
        },
        credentials: 'include',
        mode: 'cors',
        dataType: 'text/event-stream',
        body: JSON.stringify({
          file_url: url.String
        })
      })
      if (!response.body) {
        return
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        var { value, done } = await reader.read()
        if (done) break
        // 只获取content内容
        const decodedValue = decoder.decode(value)
        const content = decodedValue.match(/content='(.*?)'/)?.[1]
        if (content) {
          message.value += content
          message.value = message.value.replace(/(\\n|\\r|\\r\\n|↵)/g, '<br>')
          //message.value = message.value.replace(/###/g,'<h3>')
          console.log('receive success')
          console.log(message.value)
        }
      }
      loading.value = false
      userTimesReduce({}).then((res) => {
        console.log(res.errno)
      })
      if (remainingEnhanceTimes.n > 0) {
        remainingEnhanceTimes.n--
      }
    }
  } else {
    window.$message.warning('您今日美化简历的次数已达上限！')
  }
}

const handleUploadChange = ({ fileList }) => {
  files.value = fileList
  let formData = new FormData()
  formData.append('resume', files.value[0].file)
  userResumeUpdate(formData).then((res) => {
    console.log(res)
    if (res.errno === 0) {
      window.$message.success('上传成功')
    }
  })
}

function Recommend_position() {
  emit('show-recommend')
}

const markdownSuggestions = ref('')
watch(
  message,
  (newMessage) => {
    markdownSuggestions.value = marked(newMessage)
  },
  { immediate: true }
)

function saveWordFile() {
  const element = document.querySelector('.suggestions-content')

  if (element) {
    const textContent = element.innerText || element.textContent || ''
    const paragraphs = textContent.split('\n').map(
      (line) =>
        new Paragraph({
          children: [new TextRun(line)]
        })
    )

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs
        }
      ]
    })

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, '简历修改意见.docx')
    })
  } else {
    window.$message.error('无法找到简历修改意见内容')
  }
}
const contentMaxHeight = computed(() => (loading.value ? '480px' : '600px'))
</script>

<template>
  <n-card class="card-container">
    <div class="card-content-1" @click="Recommend_position">
      <n-button size="large" quaternary>
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 1024 1024"
            >
              <path
                d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
        </template>
        <n-text style="font-size: 15px; font-weight: bold; align-self: center">推荐职位</n-text>
      </n-button>
    </div>
    <n-divider v-if="checkLogin()" style="margin: 10px"></n-divider>
    <div class="card-content-1" @click="My_position">
      <n-button v-if="checkLogin()" size="large" quaternary>
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
        <n-text style="font-size: 15px; font-weight: bold; align-self: center">我的职位</n-text>
      </n-button>
    </div>
    <n-divider v-if="checkLogin()" style="margin: 10px"></n-divider>
    <div class="card-content-1">
      <n-upload
        v-if="checkLogin()"
        v-model:fileList="files"
        :on-change="handleUploadChange"
        @before-upload="handleUploaderChange"
        :show-file-list="false"
      >
        <n-button size="large" quaternary>
          <template #icon>
            <n-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM8 13.01l1.41 1.41L11 12.84V17h2v-4.16l1.59 1.59L16 13.01L12.01 9L8 13.01z"
                  fill="currentColor"
                ></path>
              </svg>
            </n-icon>
          </template>
          <n-text style="font-size: 15px; font-weight: bold; align-self: center">上传简历</n-text>
        </n-button>
      </n-upload>
    </div>
    <n-divider v-if="checkLogin()" style="margin: 10px"></n-divider>
    <div class="card-content-1" @click="Enhance_resume">
      <n-button
        v-if="checkLogin()"
        size="large"
        quaternary
        :disabled="remainingEnhanceTimes.n === 0"
        class="enhance-button"
      >
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
                <rect x="3" y="16" width="3" height="5" rx="1"></rect>
                <path
                  d="M6 20a1 1 0 0 0 1 1h3.756a1 1 0 0 0 .958-.713l1.2-3c.09-.303.133-.63-.056-.884C12.67 16.149 12.316 16 12 16h-2v-2.467a1.1 1.1 0 0 0-2.015-.61L6 16v4z"
                ></path>
                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                <path d="M5 12.1V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2h-2.3"></path>
              </g>
            </svg>
          </n-icon>
        </template>
        <n-text style="font-size: 15px; font-weight: bold; text-align: center">
          简历美化（{{ remainingEnhanceTimes.n }}次）
        </n-text>
      </n-button>
    </div>
  </n-card>
  <n-drawer class="drawer" v-model:show="showSuggestions" placement="right" width="500">
    <div v-if="loading" style="text-align: center; margin-top: 20px">
      <n-spin size="large"></n-spin>
      <p>请耐心等待，不要退出该页面哦...</p>
    </div>
    <n-drawer-content>
      <n-page-header title="简历修改意见" />
      <n-text class="orange"> 只能显示一次，请及时保存！</n-text>
      <div :style="{ maxHeight: contentMaxHeight }" class="suggestions-content">
        <div v-html="markdownSuggestions" />
      </div>
      <n-divider style="margin: 10px"></n-divider>
      <div style="text-align: right">
        <n-button @click="saveWordFile">保存为Word文件</n-button>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
  top: 1vh;
  width: 100%;
}
.card-content-1 {
  width: 120%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.suggestions-content {
  padding: 10px;
  max-height: 600px; /* 设置最大高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
  white-space: pre-wrap;
}
.enhance-button {
  box-shadow: none;
  transition: box-shadow 0.3s ease-in-out;
}
.enhance-button:hover {
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1); /* 控制阴影大小 */
}
.orange {
  color: coral;
}
</style>
