<script setup>
import { useRoute, useRouter } from 'vue-router'

let route = useRoute()
let router = useRouter()

import { toRefs } from 'vue'
const props = defineProps({
  type: {
    default: 'personal',
    type: String
  }
})
const refProps = toRefs(props)
function changeNotificationType(type) {
  router.push({ path: '/notifications', query: { filter: route.query.filter, type: type } })
}
</script>

<template>
  <n-card class="manager">
    <div class="head">通知管理</div>
    <div
      class="personal-notices"
      @click="changeNotificationType('personal')"
      :class="{ 'type-selected': refProps.type.value === 'personal' }"
    >
      个人通知
    </div>
    <div
      class="corporate-notices"
      @click="changeNotificationType('enterprise')"
      :class="{ 'type-selected': refProps.type.value === 'enterprise' }"
    >
      企业通知
    </div>
  </n-card>
</template>

<style scoped>
.manager {
  position: fixed;
  width: 15vw;
  min-height: 10vh;
  left: 10vw;
  border-radius: 15px;
  border: 1px solid #d9d8d8;
}
.head {
  font-size: 20px;
  font-weight: 800;
}
.personal-notices {
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 800;
  color: grey;
  transition: color 0.2s ease;
}
.personal-notices:hover {
  color: darkgreen;
}
.corporate-notices {
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 800;
  color: grey;
  transition: color 0.2s ease;
}
.corporate-notices:hover {
  color: darkgreen;
}
.type-selected {
  background-color: lightgray;
}
</style>
