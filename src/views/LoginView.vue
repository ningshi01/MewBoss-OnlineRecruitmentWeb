<template>
  <div class="BigContainer">
    <div class="Left">
      <div class="carousel">
        <img class="carousel-img" src="../assets/Login.png" />
      </div>
      <n-text v-if="imgIndex == 1" class="Title">MewBoss职业发展加速器</n-text>
      <n-text v-if="imgIndex == 1" class="Text"
        >洞悉市场需求，掌握新兴技术岗位动态，轻松对接优质企业！</n-text
      >
    </div>
    <div class="card-container">
      <div v-if="showFirstCard" class="Card">
        <div class="text1">欢迎使用MewBoss</div>
        <div class="text-welcome">
          <n-text class="text3"> 没有账户？ </n-text>
          <n-text class="text5" @click="Click1">立即注册！</n-text>
        </div>
        <n-input v-model:value="email1" size="large" round placeholder="请输入邮箱" class="input">
        </n-input>
        <n-input
          v-model:value="password1"
          size="large"
          round
          placeholder="请输入密码"
          type="password"
          show-password-on="click"
          class="input"
        >
        </n-input>
        <n-button round type="info" class="loginButton" @click="login">
          <n-text class="loginText"> 登录 </n-text>
        </n-button>
        <div class="Back" @click="BackToHome">回到首页</div>
      </div>

      <div v-if="showSecondCard" class="Card">
        <div class="text1">欢迎加入MewBoss</div>
        <div class="text-welcome">
          <n-text class="text3"> 已有账号？使用 </n-text>
          <n-text class="text5" @click="Click1"> 账号密码登录 </n-text>
        </div>
        <n-input
          v-model:value="email2"
          size="large"
          round
          clearable
          placeholder="请输入邮箱"
          class="input5"
        >
        </n-input>
        <n-input
          v-model:value="username2"
          size="large"
          round
          maxlength="30"
          show-count
          clearable
          placeholder="设置您的用户名"
          class="input5"
        >
        </n-input>
        <n-input
          v-model:value="password2"
          size="large"
          round
          type="password"
          show-password-on="click"
          clearable
          placeholder="设置您的登录密码"
          class="input5"
        >
        </n-input>
        <n-button round type="info" class="registerButton2" @click="register">
          <n-text class="loginText"> 注册 </n-text>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useMessage } from 'naive-ui'
import { userLogin, userSignIn } from '@/api/apiList.js'
import router from '@/router/index.js'
import { setToken } from '@/utils/token.js'

const message = useMessage('')
const IsLoginErroe = ref(false)
const showFirstCard = ref(true)
const showSecondCard = ref(false)
const email1 = ref('')
const password1 = ref('')
const username2 = ref('')
const password2 = ref('')
const email2 = ref('')

const imgIndex = ref(1)

const BackToHome = () => {
  router.push('JobView')
}

const Click1 = () => {
  showFirstCard.value = !showFirstCard.value
  showSecondCard.value = !showFirstCard.value
}

const checkLogin = () => {
  if (email1.value.length === 0) {
    message.error('未输入邮箱，请重试')
    return false
  }
  if (password1.value.length === 0) {
    message.error('未输入密码，请重试')
    return false
  }
  if (!checkEmailFormat(email1.value)) {
    message.error('邮箱格式不正确')
    return false
  }
  return true
}
const login = () => {
  if (!checkLogin()) {
    IsLoginErroe.value = true
  } else {
    userLogin({
      email: email1.value,
      password: password1.value
    }).then((res) => {
      if (res.errno === 0) {
        setToken('id', res.data.id)
        router.go(-1)
      }
    })
  }
}

const checkEmailFormat = (email) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  return emailRegex.test(email)
}

const checkRegister = () => {
  if (email2.value.length === 0) {
    message.error('请输入邮箱')
    return false
  }
  if (username2.value.length === 0) {
    message.error('请输入用户名')
    return false
  }
  if (password2.value.length === 0) {
    message.error('请输入密码')
    return false
  }
  if (!checkEmailFormat(email2.value)) {
    message.error('邮箱格式不正确')
    return false
  }
  return true
}
const register = () => {
  if (checkRegister()) {
    userSignIn({
      username: username2.value,
      password: password2.value,
      email: email2.value
    }).then((res) => {
      if (res.errno === 0) {
        message.success('注册成功')
        email1.value = email2.value
        password1.value = password2.value
        showFirstCard.value = true
        showSecondCard.value = false
      }
    })
  }
}
</script>

<style scoped>
.Card {
  position: relative;
  width: 25vw;
  height: 60vh;
  margin-top: 20vh;
  background-color: #fbf9f9;
  padding: 3%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Text {
  font-size: 18px;
  color: black;
  margin-top: 2%;
}

.Back {
  cursor: pointer;
  font-size: 18px;
  margin-top: 15%;
  transition:
    color 0.3s linear,
    font-size 0.3s linear;
}
.Back:hover {
  font-size: 20px;
  color: #308be7;
}
.Title {
  margin-top: 5%;
  font-weight: bold;
  color: black;
  font-size: 23px;
}
.Select {
  margin-top: 4%;
  margin-bottom: 5%;
}
.Select1 {
  margin-top: 4%;
}
.registerButton2 {
  height: 40px;
  width: 90%;
  margin-top: 30px;
}

.Left {
  width: 40vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 100%;
}
.BigContainer {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.carousel {
  width: 80%;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-container {
  display: flex;
  justify-content: center;
  width: 40vw;
}

.input {
  width: 97%;
  height: 10%;
  margin-top: 9%;
  background-color: rgba(128, 128, 128, 0.1);
  display: flex;
  align-items: center;
}
.input5 {
  width: 97%;
  height: 10%;
  margin-top: 5%;
  background-color: rgba(128, 128, 128, 0.1);
  display: flex;
  align-items: center;
}

.text1 {
  margin-top: 7%;
  height: 10%;
  font-weight: bold;
  font-size: 25px;
}
.text-welcome {
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginText {
  font-size: 18px;
  color: #f2f2f2;
}
.loginButton {
  margin-top: 8%;
  margin-left: 2%;
  width: 97%;
  height: 10%;
}

.text3 {
  font-size: 14px;
}
.text4 {
  font-size: 14px;
}

.text5 {
  cursor: pointer;
  color: #338cde;
  font-size: 15px;
  &:hover {
    color: green;
  }
}

.returnButton {
  &:hover {
    background-color: transparent;
  }
}
</style>
