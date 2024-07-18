<script setup>
import { reactive, onMounted, ref } from 'vue'
import { momentGetById, userInfoGet } from '@/api/apiList.js'
import { checkLogin, getToken } from '@/utils/token.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const Moments_datas = reactive([])
const User_datas = reactive({})

const datas = reactive({
  now_userID: {
    type: Number
  }
})

const flag_create_moment = ref(false)
function create_moment() {
  flag_create_moment.value = true
}
function update_like() {
  update_Moments_data()
}
function update_comment() {
  update_Moments_data()
}
function update_Moments_data() {
  momentGetById({
    id: route.query.id
  }).then((res) => {
    Moments_datas.pop()
    Moments_datas.push(res.data)
    console.log('不是哥们')
    console.log(res)
  })
}
function update_User_data() {
  datas.now_userID = getToken('id')
  userInfoGet({
    user_id: datas.now_userID
  })
    .then((res) => {
      User_datas.value = res.data
    })
    .then((err) => {
      console.log(err)
    })
}
onMounted(() => {
  if (checkLogin()) {
    update_User_data()
  }
  update_Moments_data()
})
</script>

<template>
  <!--  <div class="nav">-->
  <!--    <img src="../assets/nav.png" class="nav_fake" />-->
  <!--  </div>-->
  <div class="home-item-left">
    <UserCard
      v-for="user in User_datas"
      :key="user.id"
      :avatar_src="User_datas.value.userprofile.avatar"
      :username="User_datas.value.username"
      :company_joined="User_datas.value.userprofile.company_joined"
      :job_name="User_datas.value.userprofile.job_name"
    ></UserCard>
    <n-divider style="margin: 10px"></n-divider>
    <ExtraCard @create="create_moment"></ExtraCard>
  </div>
  <div class="home-main-container">
    <div class="home-item-main">
      <div v-for="m in Moments_datas" :key="m.id" class="medium-content-item">
        <ToShowCard
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
          :card_index="m.id"
          :forward_moment="m.forward_moment"
          :publish_date="m.publish_date"
          :likers_list="m.liked_users"
          :comments="m.comments"
          @like="update_like"
          @comment="update_comment"
          @subscribe="update_Moments_data"
        ></ToShowCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  height: 8vh;
  width: 100vw;
  background-color: #f8f8f8;
  z-index: 1;
}
.nav_fake {
  width: 100%;
  height: 100%;
}
.home-main-container {
  position: absolute;
  top: 10vh;
  width: 100%;
}
.home-item-left {
  position: fixed;
  width: 20%;
  top: 10vh;
  left: 12vw;
  z-index: 1;
}
.home-item-main {
  width: 50%;
  border: 10px;
  padding: 2px;
  margin-left: 35vw;
  margin-right: 30vw;
}
.medium-content-item {
  width: 100%;
  padding-bottom: 10px;
}
</style>
