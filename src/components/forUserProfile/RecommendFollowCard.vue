<template>
  <LoadingBox v-if="show_loading" />
  <n-card v-else class="card">
    <div style="display: flex; flex-direction: column">
      <n-text style="font-size: 17px; font-weight: bold">您可能想看</n-text>
      <n-text style="font-size: 18px; color: grey">来自您的相关行业</n-text>
      <div v-for="(user, index) in userInfoList.slice(0, 2)" :key="index" style="width: 100%">
        <RecommendCard
          :is-user="true"
          :avatar="user.userprofile.avatar"
          :name="user.username"
          :fan_count="user.fan_count"
          :id="user.id"
          :is-follow="user.is_subscribed"
          @handle-follow="updateRecommend"
        />
      </div>
      <n-button text class="text-button" @click="goRelationshipView">
        <n-text style="font-size: 18px; font-weight: bold">查看更多</n-text>
      </n-button>
    </div>
  </n-card>
</template>
<script setup>
import { userRecommend } from '@/api/apiList.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const userInfoList = ref([])
const emit = defineEmits(['handleInfoUpdate'])
let show_loading = ref(true)
onMounted(() => {
  show_loading.value = true
  userRecommend().then((res) => {
    if (res.errno === 0) {
      userInfoList.value = res.data
    }
    show_loading.value = false
  })
})
const updateRecommend = () => {
  show_loading.value = true
  userRecommend().then((res) => {
    if (res.errno === 0) {
      userInfoList.value = res.data
      emit('handleInfoUpdate')
      show_loading.value = false
    }
  })
}
const router = useRouter()
const goRelationshipView = () => {
  router.push('RelationshipView')
}
</script>
<style scoped>
.card {
  display: flex;
  flex-direction: column;

  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.text-button {
  margin-top: 2vh;
  :hover {
    color: #308be7;
  }
}
</style>
