<template>
  <div class="job-item-left">
    <!--    <UserCard-->
    <!--      v-for="user in User_datas"-->
    <!--      :key="user.id"-->
    <!--      :avatar_src="User_datas.value.userprofile.avatar"-->
    <!--      :username="User_datas.value.username"-->
    <!--      :company_joined="User_datas.value.userprofile.company_joined"-->
    <!--      :job_name="User_datas.value.userprofile.job_name"-->
    <!--    ></UserCard>-->
    <JobChooseCard
      :currentView="currentView"
      @show-recommend="showRecommend"
      @show-mine="showMine"
    ></JobChooseCard>
  </div>
  <div class="job-item-main">
    <LoadingJumpBall v-if="loading_show" style="width: 62vw" />
    <div v-else>
      <div v-if="currentView === 'recommend'">
        <div class="refresh-container" v-if="datas.jobData.length">
          <div class="refresh-content" @click="getRecommendJob">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="refresh-icon"
              :class="{ spinning: datas.isSpinning, active: datas.isSpinning }"
            >
              <path
                d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"
                fill="dimgray"
              ></path>
            </svg>
            <p class="clickable-text">请换一批推荐职位列表</p>
          </div>
        </div>
        <div v-for="(job, index) in datas.jobData" :key="job.id" class="medium-content-item">
          <JobRecommend :jobData="job" :isFirstCard="index === 0"></JobRecommend>
        </div>
      </div>
      <div v-else>
        <JobMine></JobMine>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { jobRequirementRecommend, userCurrentInfoGet, userInfoGet } from '@/api/apiList.js'
import { checkLogin, getToken } from '@/utils/token.js'
import { useRouter } from 'vue-router'
import LoadingJumpBall from '@/components/forLoading/LoadingJumpBall.vue'
//const route = useRoute()
const router = useRouter()
const User_datas = reactive({})

const dialog = useDialog()
let IsComplicated = ref(false)
let UserId = ref(null)
let loading_show = ref(true)
const Shoudialog = () => {
  dialog.warning({
    title: '个人信息未填充完毕',
    content: '是否前往个人主页完成个人信息填充',
    positiveText: '是',
    negativeText: '否',
    onPositiveClick: () => {
      console.log(UserId.value)
      router.push({ name: 'UserProfile', query: { id: UserId.value, new: 'true' } })
    }
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

onMounted(() => {
  if (checkLogin()) {
    update_User_data()
    userCurrentInfoGet({}).then((res) => {
      UserId.value = res.data.id
      console.log(res)
      if (
        res.data.userprofile.education === '未填写' ||
        res.data.userprofile.interest_position.length === 0
      ) {
        IsComplicated.value = false
      } else {
        IsComplicated.value = true
      }

      if (!IsComplicated.value) {
        Shoudialog()
      }
    })
  }
})
const datas = reactive({
  jobData: [],
  isSpinning: false, // 添加一个状态来控制点击时的旋转动画
  now_userID: {
    type: Number
  }
})

const currentView = ref('recommend')

function getRecommendJob() {
  datas.isSpinning = true // 点击时开始旋转动画
  jobRequirementRecommend({}).then((res) => {
    if (res.errno === 0) {
      console.log(res.data)
      datas.jobData = res.data
    } else {
      console.error('Error fetching job data', res)
    }
    datas.isSpinning = false // 请求完成后停止旋转动画
    loading_show.value = false
  })
}

function showRecommend() {
  currentView.value = 'recommend'
}

function showMine() {
  currentView.value = 'mine'
}

onMounted(() => {
  getRecommendJob()
})
</script>

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
.job-item-left {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 16%;
  top: 10vh;
  left: 12vw;
  z-index: 1;
}
.job-item-main {
  position: absolute;
  top: 10vh;
  border: 10px;
  margin-left: 33vw;
  margin-right: 5vw;
}

.loading-container {
  width: 100%;
}

.medium-content-item {
  padding-bottom: 10px;
}
.refresh-container {
  text-align: center;
  margin-top: 0px;
  font-size: 18px;
  font-weight: bold;
}
.refresh-content {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.refresh-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  transition: fill 0.3s ease; /* 添加颜色过渡效果 */
}
.clickable-text {
  color: dimgray;
  transition: color 0.3s ease; /* 添加颜色过渡效果 */
}
.clickable-text:hover {
  color: black; /* 悬停时的颜色 */
  text-decoration: underline; /* 悬停时添加下划线 */
}
.spinning {
  animation: spin 2s linear;
}
.active {
  fill: #074e96; /* 点击时的图标颜色 */
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(360deg);
  }
}
</style>
