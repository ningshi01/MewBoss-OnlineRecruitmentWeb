<template>
  <div class="card-container">
    <n-modal class="modal" :mask-closable="false" v-model:show="upload">
      <n-card class="card-content" closable @close="handleClose">
        <div class="content-wrapper">
          <n-avatar round :size="60" class="avatar" :src="datas.now_user_avatar" />
          <span class="text">{{ datas.now_userName }}</span>
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

        <div style="width: 100%">
          <div style="width: 60%; margin-left: 20vw">
            <FakeShowCard
              :be_forward_moment="true"
              :id="props.id"
              :sender_id="props.sender_id"
              :avatar_src="props.avatar_src"
              :username="props.username"
              :follows_number="props.follows_number"
              :is_subscribed="props.is_subscribed"
              :likers_list="props.likers_list"
              :essay="props.essay"
              :images_src="props.images_src"
              :video_src="props.video_src"
              :publish_date="props.publish_date"
            ></FakeShowCard>
          </div>
        </div>
        <n-divider style="margin: 10px"></n-divider>
        <div class="card-button-groups">
          <n-button
            class="card-button"
            quaternary
            size="large"
            strong="true"
            :disabled="isPublishDisabled"
            @click="submitTrans"
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
import { momentCreate, userIdGet } from '@/api/apiList.js'
const emit = defineEmits(['submitTrans', 'handleClose'])
let upload = ref(true)
// 定义编辑器内容的响应式数据
const content = ref('')

const fileList = ref([])
const props = defineProps({
  now_userID: {
    type: Number,
    required: true
  },
  now_userName: {
    type: String,
    required: true
  },
  now_user_avatar: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  sender_id: {
    type: String,
    required: true
  },
  avatar_src: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  follows_number: {
    type: String,
    required: true
  },
  is_subscribed: {
    type: Boolean,
    required: true
  },
  essay: {
    type: String,
    required: true
  },
  images_src: {
    type: Array,
    required: true
  },
  video_src: {
    type: String,
    required: true
  },
  likes_number: {
    type: String,
    required: true
  },
  comments_number: {
    type: String,
    required: true
  },
  transmits_number: {
    type: String,
    required: true
  },
  card_index: {
    type: Number,
    required: true
  },
  //标记它自己的转发卡片
  forward_moment: {
    type: Object,
    required: true
  },
  publish_date: {
    type: String,
    required: true
  },
  likers_list: {
    type: Array,
    required: true
  },
  comments: {
    type: Array,
    required: true
  }
})
const datas = reactive({
  now_userID: 0,
  now_userName: '',
  now_user_avatar: ''
})

// 初始化编辑器内容
onMounted(() => {
  userIdGet().then((res) => {
    datas.now_userID = res.data.id
    datas.now_userName = res.data.username
    datas.now_user_avatar = res.data.userprofile.avatar
  })
})

const handleClose = () => {
  upload.value = false
  emit('flag_fix', 1)
}

// 计算发布按钮是否禁用
const isPublishDisabled = computed(() => {
  return !fileList.value.length && content.value === ''
})
const message = useMessage()
async function submitTrans() {
  await momentCreate({
    forward_moment: props.id,
    content: content.value
  })
    .then((res) => {
      console.log(res)
      message.success('转发成功！')
      handleClose()
      emit('flag', 1)
    })
    .catch((err) => {
      console.log(err)
    })
}
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
  justify-content: flex-end;
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
