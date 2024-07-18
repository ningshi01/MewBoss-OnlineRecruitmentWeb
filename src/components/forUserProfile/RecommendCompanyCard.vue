<template>
  <LoadingBox v-if="show_loading" />
  <n-card v-else class="card">
    <div style="display: flex; flex-direction: column">
      <n-text style="font-size: 16px; font-weight: bold">猜您喜欢</n-text>
      <n-text style="font-size: 18px; color: grey">公司主页推荐</n-text>
      <div v-for="(company, index) in companyInfoList.slice(0, 2)" :key="index" style="width: 100%">
        <RecommendCard
          :is-user="false"
          :avatar="company.img"
          :name="company.name"
          :fan_count="company.fan_number"
          :id="company.id"
          :is-follow="company.is_subscribed"
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
import { companyRecommend } from '@/api/apiList.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const companyInfoList = ref([])
const emit = defineEmits(['handleInfoUpdate'])
let show_loading = ref(true)
onMounted(() => {
  show_loading.value = true
  companyRecommend().then((res) => {
    if (res.errno === 0) {
      companyInfoList.value = res.data
    }
    show_loading.value = false
  })
})
const updateRecommend = () => {
  show_loading.value = true
  companyRecommend().then((res) => {
    if (res.errno === 0) {
      companyInfoList.value = res.data
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
  margin-top: 1vh;
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
