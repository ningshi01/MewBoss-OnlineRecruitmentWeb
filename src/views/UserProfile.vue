<template>
  <div style="display: flex">
    <div style="margin-left: 16vw; width: 48vw">
      <UserProfileCard
        :username="username"
        :education="education"
        :email="email"
        :name="name"
        :company_name="company_name"
        :avatar="avatar"
        :isHaveCompany="isHaveCompany"
        :company_id="company_id"
        :isMe="isMe"
        :resume="resume"
        :is-follow="isFollow"
        :feature="feature"
        :subscribed_user_count="subscribed_user_count"
        :subscribed_company_count="subscribed_company_count"
        :fan_count="fan_count"
        @handleUpdateUserInfo="updateInfo"
      />
      <UserFeedCard :isMe="isMe" :username="username" :avatar="avatar" :fan_count="fan_count" />
    </div>
    <div style="margin-left: 1.5vw; width: 18vw; margin-top: 8vh">
      <RecommendFollowCard @handle-info-update="updateInfo" />
      <RecommendCompanyCard @handle-info-update="updateInfo" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { userInfoGet } from '@/api/apiList.js'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { getToken } from '@/utils/token.js'
const username = ref('')
const education = ref('')
const email = ref('')
const company_name = ref('')
const name = ref('真实姓名')
const avatar = ref('../../assets/default_avatar.svg')
const company_id = ref(0)
const isHaveCompany = ref(false)
const isMe = ref(false)
const fan_count = ref(0)
const route = useRoute()
const resume = ref('')
const isFollow = ref(false)
const feature = ref([])
const subscribed_user_count = ref(0)
const subscribed_company_count = ref(0)
const getUserInfo = (id) => {
  userInfoGet({
    user_id: id
  }).then((res) => {
    username.value = res.data.username
    email.value = res.data.email
    education.value = res.data.userprofile.education
    name.value = res.data.userprofile.name
    avatar.value = res.data.userprofile.avatar
    resume.value = res.data.userprofile.resume
    if (res.data.userprofile.company_joined != null) {
      isHaveCompany.value = true
      company_name.value = res.data.company.name
      company_id.value = res.data.company.id
    } else {
      isHaveCompany.value = false
    }
    fan_count.value = res.data.fan_count
    isFollow.value = res.data.is_subscribed
    feature.value = res.data.userprofile.interest_position
    subscribed_user_count.value = res.data.subscribed_user_count
    subscribed_company_count.value = res.data.subscribed_company_count
  })
}
const updateInfo = () => {
  isMe.value = route.query.id == getToken('id')
  getUserInfo(route.query.id)
}

onMounted(() => {
  updateInfo()
})

onBeforeRouteUpdate((to) => {
  isMe.value = to.query.id == getToken('id')
  getUserInfo(to.query.id)
})
</script>

<style scoped></style>
