<template>
  <LoadingJumpBall v-if="show_loading" style="margin-top: 1vh" />
  <n-card v-else class="card">
    <div class="header">
      <upload-card
        v-if="showWriteMomentModal"
        :username="props.username"
        :avatar_src="props.avatar"
        @close="handleUpload"
        @update="update_Moments"
      />
    </div>
    <div class="left-column">
      <div class="moment-head">
        <div class="moment-head-left">
          <n-text style="font-size: 22px; font-weight: bold">动态</n-text>
          <n-text style="font-size: 20px; color: grey">{{ fan_count }} 位关注者</n-text>
        </div>
        <div class="moment-head-right">
          <n-button round secondary class="button" v-if="isMe" @click="writeMoment">
            <n-text style="font-size: 19px; font-weight: bold; margin-left: 5%">写动态</n-text>
          </n-button>
        </div>
      </div>
      <div
        v-for="(m, index) in userMomentList"
        :key="index"
        style="width: 100%"
        @click="goDetail(m.id)"
      >
        <to-show-card
          :be_forward_moment="false"
          :id="m.id"
          :sender_id="m.sender.id"
          :avatar_src="m.sender.userprofile.avatar"
          :username="m.sender.username"
          :follows_number="m.sender.fan_count"
          :is_subscribed="m.sender.is_subscribed"
          :essay="m.content"
          :images_src="m.images"
          :video_src="m.video"
          :likes_number="m.liked_users.length"
          :comments_number="m.comments.length"
          :transmits_number="m.forwarded_count"
          :forward_moment="m.forward_moment"
          :publish_date="m.publish_date"
          :likers_list="m.liked_users"
          :comments="m.comments"
          :isMe="isMe"
          @like="update_Moments"
          @comment="update_Moments"
          class="show-card-class"
        />
        <n-divider></n-divider>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import { userMomentGet } from '@/api/apiList.js'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
const route = useRoute()
const userMomentList = ref([])
const showWriteMomentModal = ref(false)
const props = defineProps({
  isMe: { type: Boolean, required: true },
  username: { type: String, required: true },
  avatar: { type: String, required: true },
  fan_count: { type: Number, required: true }
})
let show_loading = ref(true)
async function getUserMoment(id) {
  show_loading.value = true
  await userMomentGet({
    id: id
  }).then((res) => {
    if (res.errno === 0) {
      userMomentList.value = res.data
    }
    show_loading.value = false
  })
}
onMounted(() => {
  getUserMoment(route.query.id)
})
onBeforeRouteUpdate((to) => {
  getUserMoment(to.query.id)
})
//写动态
const writeMoment = () => {
  showWriteMomentModal.value = true
}
const handleUpload = () => {
  showWriteMomentModal.value = false
}
const update_Moments = () => {
  userMomentGet({
    id: route.query.id
  }).then((res) => {
    if (res.errno === 0) {
      userMomentList.value = res.data
    }
  })
}
const router = useRouter()
const goDetail = (id) => {
  router.push({ name: 'ToShowView', query: { id: id } })
}
</script>
<style scoped>
.card {
  display: flex;
  flex-direction: column;
  margin-top: 1vh;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.show-card-class {
  width: 100%;
}
.header {
  position: absolute;
  top: 3vh;
  right: 2%;
}
.button {
  width: 8vw;
  margin-top: 1%;
  border: 2px solid black;
  transition: all 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.moment-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.moment-head-left {
  display: flex;
  flex-direction: column;
}

.left-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2%;
  flex-grow: 1;
}
</style>
