<script setup>
import { ref, reactive, onMounted } from 'vue'
import { momentListGet, userInfoGet } from '../api/apiList.js'
import { checkLogin, getToken } from '@/utils/token.js'

const Moments_datas = reactive([])
const User_datas = reactive({})
let loading_show = ref(true)

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

function update_Moments() {
  location.reload()
}
function update_comment() {
  update_Moments_data()
}
async function update_Moments_data() {
  // userMomentGet({
  //   id: 2
  // }).then((res) => {
  //   // console.log('获取用户动态成功！')
  //   Moments_datas.splice(0, Moments_datas.length, ...res.data)
  // })
  await momentListGet().then((res) => {
    // console.log('获取用户动态成功！')
    Moments_datas.splice(0, Moments_datas.length, ...res.data)
  })
}
function update_User_data() {
  datas.now_userID = getToken('id')
  // console.log('now_user_id:' + datas.now_userID)
  userInfoGet({
    user_id: datas.now_userID
  }).then((res) => {
    User_datas.value = res.data
    // console.log(User_datas)
  })
}
function handleUpload() {
  flag_create_moment.value = false
}
onMounted(async () => {
  if (checkLogin()) {
    update_User_data()
  }
  await update_Moments_data()
  loading_show.value = false
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
    <ExtraCard @create="create_moment"></ExtraCard>
  </div>
  <div class="home-item-right">
    <RecommendFollowCard></RecommendFollowCard>
  </div>
  <div class="home-main-container">
    <div class="home-item-main">
      <AddCard
        v-for="u in User_datas"
        :key="u.id"
        :avatar_src="User_datas.value.userprofile.avatar"
        @create="create_moment"
      ></AddCard>
      <UploadCard
        v-if="flag_create_moment"
        :username="User_datas.value.username"
        :avatar_src="User_datas.value.userprofile.avatar"
        :flag_upload="flag_create_moment"
        @close="handleUpload"
        @update="update_Moments"
      ></UploadCard>
      <LoadingBox v-if="loading_show" />
      <div v-else>
        <div v-for="m in Moments_datas" :key="m.id" class="medium-content-item">
          <ShowCard
            :now_user-i-d="datas.now_userID"
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
            :from="m.from"
            @like="update_like"
            @comment="update_comment"
            @subscribe="update_Moments_data"
            @update="update_Moments"
          ></ShowCard>
        </div>
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
  width: 16%;
  top: 10vh;
  left: 12vw;
  z-index: 1;
}
.home-item-right {
  position: fixed;
  width: 20%;
  top: 10vh;
  right: 8vw;
  z-index: 1;
}
.home-item-main {
  width: 40%;
  border: 10px;
  margin-left: 30vw;
  margin-right: 30vw;
}
.medium-content-item {
  width: 100%;
  padding-bottom: 10px;
}
</style>
