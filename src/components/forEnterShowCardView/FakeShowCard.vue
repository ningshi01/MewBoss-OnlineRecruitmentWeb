<!--这是选中动态的展示卡片-->
<!--
用法示例：
<ToShowCard
          :be_forward_moment="true"//是否标记为作为嵌套展示卡
          :id="m.id"//动态id
          :sender_id="m.sender.id"//发送用户ID
          :avatar_src="m.sender.userprofile.avatar"//发送用户头像
          :username="m.sender.username"//发送用户名
          :follows_number="m.sender.fan_count"//关注数
          :is_subscribed="m.sender.is_subscribed"//是否关注
          :essay="m.content"//动态内容
          :images_src="m.images"//Image路径
          :video_src="m.video"//Video路径
          :likes_number="m.liked_users.length"//点赞数
          :comments_number="m.comments.length"//评论数
          :transmits_number="m.forwarded_count"//转发数
          :forward_moment="m.forward_moment"//转发评论
          :publish_date="m.publish_date"//发送时间戳
          :likers_list="m.liked_users"//点赞列表
          :comments="m.comments"//评论
          @like="update_like"//emit(点赞更新标记)
          @comment="update_comment"//emit(评论更新标记)
        ></ToShowCard>
-->
<script setup>
import { momentComment, momentLike } from '../../api/apiList.js'

const emit = defineEmits(['feature_like', 'post_comment'])

const props = defineProps({
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
  //标记是否是被作为ShowCard的转发卡片
  be_forward_moment: {
    type: Boolean,
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
let datas = reactive({
  avatar_src: '',
  username: '',
  follows_number: 0,
  essay: '',
  is_subscribed: false,
  images_src: [],
  video_src: '',
  likes_number: 0,
  comments_number: 0,
  transmits_number: 0,
  //是否是被作为ShowCard的转发卡片
  be_forward_moment: true,
  //它自己的转发卡片
  forward_moment: {},
  publish_date: '',
  flag_like: false,
  flag_comment: false,
  comments: []
})
function feature_like() {
  momentLike({
    id: props.id
  }).then((res) => {
    console.log(res.data.message)
    emit('like', 1)
  })
}
let myComment = ref('')
function post_comment() {
  momentComment({
    id: props.id,
    content: myComment.value
  }).then((res) => {
    console.log(res)
    emit('comment', 1)
  })
  myComment.value = ''
}
const flag_image = ref(true)
const flag_video = ref(true)
function feature_comment() {
  datas.flag_comment = !datas.flag_comment
}

onMounted(() => {
  updateDatas()
})

watch(
  props,
  () => {
    updateDatas()
  },
  { immediate: true }
)
function time_transmint(str) {
  const time_options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }
  const date = new Date(str)
  return date.toLocaleDateString('en-US', time_options)
}
function updateDatas() {
  datas.avatar_src = props.avatar_src
  datas.username = props.username
  datas.is_subscribed = props.is_subscribed
  datas.follows_number = props.follows_number
  datas.essay = props.essay
  if (props.images_src != null) datas.images_src = props.images_src
  else flag_image.value = false
  if (props.video_src != null) datas.video_src = props.video_src
  else flag_video.value = false
  datas.comments_number = props.comments_number
  datas.transmits_number = props.transmits_number
  datas.likes_number = props.likes_number
  datas.be_forward_moment = props.be_forward_moment
  if (props.be_forward_moment) {
    //如果作为转发嵌套卡
    datas.forward_moment = false
  } else {
    //如果是普通卡
    if (props.forward_moment != null) datas.forward_moment = true
    else datas.forward_moment = false
  }
  datas.publish_date = time_transmint(props.publish_date)
  datas.flag_like = props.likers_list.find((liker) => liker.id === 2) //标记2应被换为当前用户id！！！！！！！！！！！！！！！！
  datas.comments = props.comments
}
</script>
<template>
  <div class="card-container">
    <n-page-header class="card-item">
      <template #avatar
        ><!--头像-用来跳转到个人主页-->
        <a style="margin-left: 10px">
          <n-avatar :src="datas.avatar_src" size="large" />
        </a>
      </template>

      <template #title
        ><!--用户名-用来跳转到个人主页-->
        <h
          ><a>{{ datas.username }}</a></h
        ><br />
        <n-gradient-text
          font-size="15"
          :gradient="{
            from: 'rgb(85, 85, 85)',
            to: 'rgb(170, 170, 170)'
          }"
        >
          {{ datas.follows_number }}位关注<br />{{ datas.publish_date }}
        </n-gradient-text>
      </template>

      <template #extra>
        <n-space>
          <n-button :bordered="false" size="large">
            <n-gradient-text type="info" v-if="!is_subscribed"> +关注 </n-gradient-text>
            <n-gradient-text type="info" v-if="is_subscribed"> 已关注 </n-gradient-text>
          </n-button>
        </n-space>
      </template>
    </n-page-header>

    <div class="card-container-words">
      <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
        {{ datas.essay }}
      </n-ellipsis>
    </div>

    <div v-if="!datas.forward_moment && flag_image">
      <div v-for="i in images_src" :key="i.id" class="card-image">
        <div class="card-image-in">
          <n-image :src="i.image" width="100%" height="100%"></n-image>
        </div>
      </div>
    </div>

    <VideoPlayer
      :video_url="datas.video_src"
      v-if="!datas.forward_moment && flag_video"
    ></VideoPlayer>

    <div
      style="display: flex; justify-content: center"
      v-if="datas.forward_moment && !datas.be_forward_moment"
    >
      <div style="width: 90%; display: flex; align-self: center; justify-self: center"></div>
    </div>

    <div class="card-item" style="margin-left: 10px" v-if="!datas.be_forward_moment">
      <n-hr></n-hr>
      <n-grid :cols="15">
        <n-gi :offset="0" span="4">
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path
                  d="M15.056 9.004c.46-1.427.693-2.677.693-3.754c0-2.398-.939-4.247-2.5-4.247c-.847 0-1.109.504-1.437 1.747c.018-.065-.163.634-.215.821c-.101.359-.277.97-.527 1.831a.247.247 0 0 1-.03.065L8.174 9.953a5.885 5.885 0 0 1-2.855 2.326l-1.257.482a1.75 1.75 0 0 0-1.092 1.967l.686 3.539a2.25 2.25 0 0 0 1.673 1.757l8.25 2.022a4.75 4.75 0 0 0 5.733-3.44l1.574-6.173a2.75 2.75 0 0 0-2.665-3.43h-3.165z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
          点赞数：{{ datas.likes_number }}
        </n-gi>
        <n-gi :offset="7" span="2">评论：{{ datas.comments_number }}</n-gi>
        <n-gi :offset="0" span="2">转发：{{ datas.transmits_number }}</n-gi>
      </n-grid>
      <n-hr></n-hr>
    </div>

    <div class="card-button-groups" v-if="!datas.be_forward_moment">
      <n-button
        class="card-button"
        quaternary
        size="large"
        strong="true"
        @click="feature_like"
        v-if="!datas.flag_like"
      >
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 20 20"
            >
              <g fill="none">
                <path
                  d="M12.483 1.704c-.799-.837-2.092-.387-2.431.59c-.28.806-.644 1.772-.998 2.483c-1.06 2.126-1.678 3.335-3.384 4.849a2.84 2.84 0 0 1-.841.49c-1.13.446-2.19 1.616-1.913 3.005l.353 1.765a2.5 2.5 0 0 0 1.794 1.922l5.6 1.527a4.5 4.5 0 0 0 5.61-3.537l.685-3.761A3 3 0 0 0 14.006 7.5h-.883l.01-.052c.08-.409.176-.97.24-1.583c.065-.61.1-1.285.049-1.913c-.05-.616-.184-1.249-.504-1.73a4.158 4.158 0 0 0-.435-.518z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
        </template>
        赞
      </n-button>
      <n-button
        class="card-button-liked"
        quaternary
        size="large"
        strong="true"
        @click="feature_like"
        v-if="datas.flag_like"
      >
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 20 20"
            >
              <g fill="none">
                <path
                  d="M12.483 1.704c-.799-.837-2.092-.387-2.431.59c-.28.806-.644 1.772-.998 2.483c-1.06 2.126-1.678 3.335-3.384 4.849a2.84 2.84 0 0 1-.841.49c-1.13.446-2.19 1.616-1.913 3.005l.353 1.765a2.5 2.5 0 0 0 1.794 1.922l5.6 1.527a4.5 4.5 0 0 0 5.61-3.537l.685-3.761A3 3 0 0 0 14.006 7.5h-.883l.01-.052c.08-.409.176-.97.24-1.583c.065-.61.1-1.285.049-1.913c-.05-.616-.184-1.249-.504-1.73a4.158 4.158 0 0 0-.435-.518z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
        </template>
        取消点赞
      </n-button>
      <n-button class="card-button" quaternary size="large" strong @click="feature_comment">
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
            >
              <g fill="none">
                <path
                  d="M10.5 3a4.001 4.001 0 0 0-3.727 2.544A6.06 6.06 0 0 1 7.5 5.5h13a6 6 0 0 1 6 6v9.21A4.001 4.001 0 0 0 29 17V9.5A6.5 6.5 0 0 0 22.5 3h-12zM3 11.5A4.5 4.5 0 0 1 7.5 7h13a4.5 4.5 0 0 1 4.5 4.5v10a4.5 4.5 0 0 1-4.5 4.5h-5.64l-4.403 3.65C9.48 30.462 8 29.767 8 28.497V26H7a4 4 0 0 1-4-4V11.5z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
        </template>
        评论
      </n-button>
      <n-button class="card-button" quaternary size="large" strong>
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path
                  d="M10.5 18H16a1 1 0 1 1 0 2h-5.5a6.5 6.5 0 1 1 0-13h5.14l-1.933-1.933a1 1 0 0 1 1.414-1.414l3.53 3.529a.997.997 0 0 1 .21.308a.997.997 0 0 1-.18 1.243a.94.94 0 0 1-.028.029l-3.531 3.53a1 1 0 0 1-1.415-1.413L15.586 9H10.5a4.5 4.5 0 1 0 0 9z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
        </template>
        转发
      </n-button>
    </div>
    <n-hr v-if="!datas.be_forward_moment"></n-hr>
    <div class="card-comment-content" v-if="datas.flag_comment && !be_forward_moment">
      <div style="display: flex; gap: 15px; padding: 10px">
        <!--    <n-avatar round :size="40" class="avatar" />-->
        <n-input
          size="large"
          round
          placeholder="我说两句..."
          :maxlength="100"
          class="content-input"
          v-model:value="myComment"
        />
        <n-button tertiary @click="post_comment">发送</n-button>
      </div>

      <div>
        <div v-for="c in comments" :key="c.id" style="display: flex; gap: 10px; padding: 10px">
          <n-avatar round :size="45" class="avatar" :src="c.sender.userprofile.avatar" />
          <div class="comment-show">
            <n-text strong style="font-weight: bold; padding: 10px">{{ c.sender.username }}</n-text>
            <n-text strong style="padding: 10px">{{ c.content }}</n-text>
            <n-text strong style="padding: 10px; font-size: 2vh">{{
              time_transmint(c.publish_date)
            }}</n-text>
          </div>
          <n-hr></n-hr>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  padding: 0px;
  border: 1px solid #ccc;
  border-radius: 15px;
  margin-top: 10px;
  width: 100%;
  background-color: rgb(255, 255, 255);
  gap: 10px;
}
.card-item {
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  font-family: Arial;
}
.card-container-words {
  margin-left: 10px;
  margin-bottom: 5px;
  font-size: medium;
  font-family: Arial;
}
.card-button-groups {
  display: flex;
}
.card-button {
  flex: 1;
}
.card-button-liked {
  flex: 1;
  color: #6688c9;
}
.card-comment-content {
}
.comment-show {
  color: rgb(24, 24, 24);
  border-radius: 15px;
  background-color: rgb(24, 24, 24, 0.1);
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.card-image {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.card-image-in {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>
