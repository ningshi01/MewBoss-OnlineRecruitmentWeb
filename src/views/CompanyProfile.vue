<template>
  <div style="display: flex; flex-direction: row">
    <div style="margin-left: 16vw; width: 48vw">
      <CompanyProfileCard
        :company_name="company_name"
        :brief_info="brief_info"
        :followers_num="followers_num"
        :avatar_src="avatar_src"
        :home="home"
        :is-manager="isManager"
        :is-join="isJoin"
        :is-invited="isInvited"
        :company_id="company_id"
        :featured_jobs="featured_jobs"
        :is-followed="isFollowed"
        @tabChanged="handleTabChange"
        @handleUpdateCompanyInfo="updateInfo"
      />
      <CompanyFeedCard v-if="showUserFeed" :is-manager="isManager" :fan_count="fan_number" />
      <RecruitCard
        v-if="showJobCard"
        :company_id="company_id"
        :is-manager="isManager"
        :company_avatar="avatar_src"
      />
      <EmployeeListCard v-if="showEmployeeCard" />
    </div>
    <div style="margin-left: 1.5vw; width: 18vw; margin-top: 8vh">
      <RecommendFollowCard @handle-info-update="updateInfo" />
      <RecommendCompanyCard @handle-info-update="updateInfo" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { companyInfoGet, userIdGet } from '@/api/apiList.js'
const route = useRoute()
const company_name = ref('')
const brief_info = ref('')
const followers_num = ref(0)
const avatar_src = ref('')
const home = ref('')
const company_id = ref(0)
const isManager = ref(false)
const isJoin = ref(false)
const isInvited = ref(false)
const fan_number = ref(0)
const featured_jobs = ref([])
const isFollowed = ref(false)
const showUserFeed = ref(true) // 控制是否显示UserFeedCard，默认显示
const showJobCard = ref(false)
const showEmployeeCard = ref(false)
const handleTabChange = (tabName) => {
  if (tabName === '动态') {
    showUserFeed.value = true
    showJobCard.value = false
    showEmployeeCard.value = false
  } else if (tabName === '招聘') {
    showJobCard.value = true
    showUserFeed.value = false
    showEmployeeCard.value = false
  } else if (tabName === '员工列表') {
    showEmployeeCard.value = true
    showUserFeed.value = false
    showJobCard.value = false
  }
}
const JudgeManager = (id) => {
  let data = ref()
  userIdGet().then((res) => {
    if (res.errno === 0) {
      data.value = res.data
      if (data.value.userprofile.company_manage != null) {
        if (data.value.userprofile.company_manage == id) {
          isManager.value = true
        } else {
          isManager.value = false
        }
      } else {
        isManager.value = false
      }
    }
  })
}
const getCompanyInfo = (id) => {
  companyInfoGet({
    id: id
  }).then((res) => {
    company_name.value = res.data.name
    brief_info.value = res.data.info
    followers_num.value = res.data.fan_number
    home.value = res.data.home
    avatar_src.value = res.data.img
    company_id.value = route.query.id
    isJoin.value = res.data.is_joined
    isInvited.value = res.data.is_invited
    fan_number.value = res.data.fan_number
    featured_jobs.value = res.data.featured_jobs
    isFollowed.value = res.data.is_subscribed
  })
}
const updateInfo = () => {
  JudgeManager(route.query.id)
  getCompanyInfo(route.query.id)
}

onMounted(() => {
  updateInfo()
})
onBeforeRouteUpdate((to) => {
  JudgeManager(to.query.id)
  getCompanyInfo(to.query.id)
})
</script>

<style scoped></style>
