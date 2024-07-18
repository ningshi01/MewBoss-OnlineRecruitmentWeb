<script setup>
import { reactive, onMounted } from 'vue'

import { useRoute } from 'vue-router'
import { userGetOneRequirement } from '@/api/apiList.js'
const datas = reactive({
  now_company_id: 0,
  needs: {},
  is_admin: false
})
const route = useRoute()
onMounted(() => {
  getTheRequireMent()
})
function getTheRequireMent() {
  if (route.query.id) {
    userGetOneRequirement({
      id: route.query.id
    }).then((r) => {
      datas.now_company_id = r.data.company.id
      datas.needs = r.data
      datas.is_admin = r.data.company.is_manager
    })
  }
}
</script>

<template>
  <div class="home-main-container">
    <!--    <div class="home-item-main">-->
    <JobCard
      :need_datas="datas.needs"
      :is_admin="datas.is_admin"
      @update="getTheRequireMent"
      @haveDelivered="getTheRequireMent"
    ></JobCard>
    <!--    </div>-->
  </div>
</template>

<style scoped>
.home-main-container {
  position: absolute;
  top: 10vh;
  width: 100%;
}
</style>
