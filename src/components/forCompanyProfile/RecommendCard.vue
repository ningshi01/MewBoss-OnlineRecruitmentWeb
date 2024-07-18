<template>
  <n-card :bordered="false" class="recommendCard" @click="handleClickRecommendCard">
    <div style="display: flex; flex-direction: row">
      <div class="left-body">
        <n-avatar round :size="60" :src="avatar" />
      </div>
      <div class="right-body">
        <n-text style="font-size: 20px; font-weight: bold"> {{ name }} </n-text>
        <n-text style="font-size: 15px; color: grey">{{ fan_count }} 位关注者</n-text>
      </div>
      <n-button round type="info" class="button" @click.stop="follow" v-if="!isFollow">
        <n-text style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 4%"
          >+</n-text
        >
        <n-text style="color: white; font-size: 17px; font-weight: bold; margin-left: 5%"
          >关注</n-text
        >
      </n-button>
      <n-button round type="info" class="button" @click.stop="unFollow" v-if="isFollow">
        <n-text style="color: white; font-size: 17px; font-weight: bold; margin-left: 5%"
          >已关注</n-text
        >
      </n-button>
    </div>
  </n-card>
  <n-divider style="margin: 0"></n-divider>
</template>
<script setup>
import { useRouter } from 'vue-router'
import {
  companySubscribe,
  companyUnsubscribe,
  userSubscribe,
  userUnsubscribe
} from '@/api/apiList.js'

const props = defineProps({
  isUser: { type: Boolean, required: true },
  avatar: { type: String, required: true },
  name: { type: String, required: true },
  fan_count: { type: Number, required: true },
  id: { type: Number, required: true },
  isFollow: { type: Boolean, required: true }
})
const router = useRouter()
const handleClickRecommendCard = () => {
  if (props.isUser) {
    router.push({ name: 'UserProfile', query: { id: props.id } })
  } else {
    router.push({ name: 'CompanyProfile', query: { id: props.id } })
  }
}
const emit = defineEmits(['handleFollow'])
const follow = () => {
  if (props.isUser) {
    userSubscribe({
      id: props.id
    }).then((res) => {
      if (res.errno === 0) {
        emit('handleFollow')
      }
    })
  } else {
    companySubscribe({
      company_id: props.id
    }).then((res) => {
      if (res.errno === 0) {
        emit('handleFollow')
      }
    })
  }
}
const unFollow = () => {
  if (props.isUser) {
    userUnsubscribe({
      id: props.id
    }).then((res) => {
      if (res.errno === 0) {
        emit('handleFollow')
      }
    })
  } else {
    companyUnsubscribe({
      company_id: props.id
    }).then((res) => {
      if (res.errno === 0) {
        emit('handleFollow')
      }
    })
  }
}
</script>
<style scoped>
.recommendCard {
  --n-padding-left: 0 !important;
  width: 100%;
  cursor: pointer;
  height: auto;
}
.right-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  margin-left: 4%;
  margin-bottom: 4vh;
}
.left-body {
  margin-top: 2%;
}
.button {
  width: 6vw;
  height: 3vh;
  position: absolute;
  bottom: 1vh;
  left: 50%;
  transform: translateX(-50%);
}
</style>
