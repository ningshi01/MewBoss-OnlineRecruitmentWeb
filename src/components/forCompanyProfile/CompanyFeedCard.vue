<template>
  <LoadingJumpBall v-if="show_loading" style="margin-top: 1vh" />
  <n-card v-else class="card">
    <div class="left-column">
      <n-text style="font-size: 22px; font-weight: bold">动态</n-text>
      <n-text style="font-size: 20px; color: grey">{{ props.fan_count }} 位关注者</n-text>
      <div v-for="(m, index) in companyMomentList" :key="index" style="width: 100%">
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
          @like="update_like"
          @comment="update_like"
          class="show-card-class"
        />
        <n-divider></n-divider>
      </div>
    </div>
  </n-card>
</template>
<script setup>
import { ref } from 'vue'
import { companyMomentGet } from '@/api/apiList.js'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
const route = useRoute()
const companyMomentList = ref([])
const props = defineProps({
  fan_count: { type: Number, required: true },
  isManager: { type: Boolean, required: true }
})
let show_loading = ref(true)
async function update_moment(id) {
  show_loading.value = true
  await companyMomentGet({
    id: id
  }).then((res) => {
    if (res.errno === 0) {
      companyMomentList.value = res.data
    }
    show_loading.value = false
  })
}
onMounted(() => {
  update_like()
})
onBeforeRouteUpdate((to) => {
  update_moment(to.query.id)
})
const update_like = () => {
  update_moment(route.query.id)
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
.left-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2%;
  flex-grow: 1;
}
</style>
