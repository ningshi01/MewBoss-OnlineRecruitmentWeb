<template>
  <div class="navBar">
    <div class="navLeft">
      <img class="logo" src="../../assets/logo.jpeg" @click="moveTo('job')" title="回到主页" />
      <n-input-group class="inputGroup">
        <n-select
          v-model:value="selectValue"
          size="small"
          style="width: 20%; margin-right: 2px"
          :options="selectOptions"
          placeholder="类型"
        />
        <input
          placeholder="搜索"
          class="navInput"
          v-model="value"
          @keydown.enter="moveTo('searchView')"
        />
      </n-input-group>
    </div>
    <div class="navMid">
      <div class="navButton" @click="moveTo('job')">
        <img class="buttonImg" src="../../assets/navJob.svg" />
        职业
      </div>
      <div class="navButton" @click="moveTo('people')">
        <img class="buttonImg" src="../../assets/navPeople.svg" />
        人脉
      </div>
      <div class="navButton" @click="moveTo('moment')">
        <img class="buttonImg" src="../../assets/moment.svg" />
        动态
      </div>
      <div class="navButton" @click="moveTo('message')">
        <n-badge>
          <img class="buttonImg" src="../../assets/navMessage.svg" />
        </n-badge>
        消息
      </div>
      <div class="navButton" @click="moveTo('notice')">
        <n-badge>
          <img class="buttonImg" src="../../assets/navNotice.svg" />
        </n-badge>
        通知
      </div>
    </div>
    <div class="navRight">
      <n-dropdown trigger="hover" :options="options" @select="handleSelect" v-if="IsLogin">
        <n-avatar
          round
          class="personImage"
          :src="datas.images_src"
          @click="moveTo('user')"
          style="height: fit-content"
        >
        </n-avatar>
      </n-dropdown>
      <div
        v-if="!IsLogin"
        @click="ToLogin"
        style="
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: end;
          font-size: xx-small;
          height: 100%;
          width: 30px;
        "
      >
        <img class="personImage" src="../../assets/Visitor.svg" />
        登录
      </div>
      <div class="personInfo" v-if="IsLogin">
        <n-space vertical>
          <div style="width: 100%">
            你好, <span style="font-weight: 600; font-size: 14px">{{ username }}</span>
          </div>
          <div class="time">{{ currentTime }}</div>
        </n-space>
      </div>
      <div class="personInfo" v-if="!IsLogin">
        <n-space vertical>
          <div style="width: 100%; margin-left: 10px">游客身份游览</div>
          <div class="time">{{ currentTime }}</div>
        </n-space>
      </div>
    </div>
  </div>

  <n-modal v-model:show="showConfirmModal" title="确认注销" preset="dialog">
    <template #header>
      <span>确认注销</span>
    </template>
    <template #default>
      <p>您确定要注销账户吗？此操作无法撤销。</p>
      <div class="yes">
        <n-button @click="showConfirmModal = false">取消</n-button>
        <n-button type="success" @click="confirmDeleteAccount">确认</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import { userCurrentInfoGet, userDelete, userLogout } from '@/api/apiList'
import { useRouter } from 'vue-router'
import { ref, onMounted, reactive } from 'vue'
import { checkLogin, getToken } from '@/utils/token.js'
import { useMessage } from 'naive-ui'

const message = useMessage()
const value = ref('')
const router = useRouter()
const IsLogin = ref(false)
const username = ref()
const selectValue = ref('user')
const selectOptions = ref([
  {
    label: '用户',
    value: 'user'
  },
  {
    label: '企业',
    value: 'company'
  },
  {
    label: '职位',
    value: 'job'
  }
])
const datas = reactive({
  image_src: {
    type: String
  }
})
const showConfirmModal = ref(false)
const currentTime = ref(new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }))

onMounted(() => {
  if (checkLogin()) {
    IsLogin.value = true
    userCurrentInfoGet({}).then((res) => {
      username.value = res.data.username
      datas.images_src = res.data.userprofile.avatar
    })
  } else {
    IsLogin.value = false
  }

  setInterval(() => {
    currentTime.value = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }, 1000)
})

const ToLogin = () => {
  router.push({
    path: '/Login'
  })
}

const moveTo = (dest) => {
  switch (dest) {
    case 'job':
      router.push({
        path: '/JobView'
      })
      break
    case 'people':
      router.push({
        path: '/RelationshipView'
      })
      break
    case 'message':
      router.push({
        path: '/chat'
      })
      break
    case 'notice':
      router.push({
        path: '/notifications'
      })
      break
    case 'user':
      router.push({
        path: '/UserProfile',
        query: {
          id: getToken('id')
        }
      })
      break
    case 'home':
      router.push({
        path: '/HomeView'
      })
      break
    case 'searchView':
      router.push({
        path: '/search',
        query: {
          keywords: value.value,
          filter: selectValue.value
        }
      })
      break
    case 'moment':
      router.push({
        path: '/homeView'
      })
      break
    default:
      router.push({
        path: '/'
      })
  }
}

const options = [
  {
    label: '用户登出',
    key: '1'
  },
  {
    label: '注销账户',
    key: '2'
  }
]

function handleSelect(key) {
  if (key == 1) {
    userLogout().then(() => {
      window.$message.success('退出成功,即将跳转至主页')
      router.push('/HomeView')
      setInterval(() => {
        router.go(0)
      }, 1000)
    })
  } else if (key == 2) {
    showConfirmModal.value = true
  }
}

function confirmDeleteAccount() {
  userDelete({
    user_id: getToken('id')
  }).then(() => {
    message.success('注销成功！')
    showConfirmModal.value = false
    router.push({
      path: '/Login'
    })
  })
}
</script>

<style scoped>
.inputGroup {
  width: 80%;
  display: flex;
  flex-flow: row;
  justify-content: end;
}

.navPerson {
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: 5px;
  justify-content: end;
  min-width: 60px;
  height: 100%;
}

.navInput {
  background-color: rgb(234, 234, 234);
  outline-style: none;
  border: 0.2px solid #d9d8d8;
  border-radius: 3px;
  padding: 2px 14px;
  width: 60%;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Microsoft soft';
  box-sizing: border-box;
}

.navInput:focus {
  transition: 0.2s;
  border-color: #313131;
  border-width: 1px;
  width: 80%;
  outline: 0;
}

.navInput:focus .mask {
  display: block;
}

.navBar {
  display: flex;
  min-height: 50px;
  background-color: rgb(253, 254, 254);
  margin-left: 1px;
  border-radius: 0 0 4px 4px;
}

.navButton {
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: xx-small;
  justify-content: end;
  width: 30px;
  box-sizing: border-box;
  height: 100%;
  min-width: 60px;
}

.navButton:hover {
  border-bottom: 3px solid blue;
  transition: 0.2s;
  cursor: pointer;
}

.yes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.navLeft {
  display: flex;
  flex: 2;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}

.navMid {
  flex: 3;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: end;
}

.buttonImg {
  width: 25px;
  transition: 0.2s;
}

.buttonImg:active {
  transition: 0.1s;
  width: 20px;
}

.navRight {
  flex: 1;
  display: flex;
  background-color: #f6f6f6;
  flex-flow: row;
  align-items: center;
  border-left-color: rgb(214, 214, 214);
  border-left-width: 1px;
  border-left-style: solid;
  box-sizing: border-box;
  justify-content: space-around;
}

.personImage {
  width: 30px;
  border-radius: 50%;
}

.personImage:hover {
  width: 35px;
  transition: 0.2s;
  transform-origin: center;
  cursor: pointer;
}

.personImage:active {
  width: 35px;
  transition: 0.2s;
  cursor: pointer;
}

.personInfo {
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: 12px;
  margin-right: 40px;
}

.logo {
  cursor: pointer;
  margin-right: 15px;
  width: 60px;
  transition: 0.2s;
  transform-origin: center;
}

.logo:hover {
  width: 80px;
}

.time {
  font-weight: 600;
  font-size: 13px;
}
</style>
