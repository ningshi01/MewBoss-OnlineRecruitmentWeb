<template>
  <div class="Card">
    <div class="ImageContainer" @click="GotoCompany">
      <img class="Imge" src="../../assets/defaultImg.png" />
    </div>
    <n-avatar class="Imge1" :src="Avatar" :size="77" @click="GotoCompany" />

    <div class="Name" @click="GotoCompany">
      <n-ellipsis style="max-width: 240px" :line-clamp="1">
        {{ Name }}
      </n-ellipsis>
    </div>
    <div class="Text" @click="GotoCompany">
      <n-ellipsis style="max-width: 240px" :line-clamp="2">
        <span>
          {{ Info }}
        </span>
      </n-ellipsis>
    </div>
    <div class="Text1">关注人数{{ FollowersCount }}</div>
    <n-button :type="Type" ghost class="Button" circle @click="Subscribe"> 关注 </n-button>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { companySubscribe } from '@/api/apiList.js'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { checkLogin } from '@/utils/token.js'
const message = useMessage()
const Type = ref('info')
const router = useRouter()
const props = defineProps({
  Name: String,
  Avatar: String,
  BackImage: String,
  Info: String,
  Fan_number: String,
  Id: String
})
const GotoCompany = () => {
  router.push({ name: 'CompanyProfile', query: { id: props.Id } })
}
const Subscribe = () => {
  companySubscribe({
    company_id: props.Id
  }).then(() => {
    if (checkLogin()) message.success('关注成功')
  })
}
let FollowersCount = ref(props.Fan_number)
let Avatar = ref(props.Avatar)
</script>

<style scoped>
.Button {
  width: 220px;
  position: relative;
  margin-top: auto;
  left: 3px;
}
.Name {
  position: relative;
  top: 7%;
  left: 5px;
  max-width: 240px;
  font-weight: bold;
  font-size: 17px;
  text-align: left;
}
.Text {
  margin-top: 6px;
  opacity: 0.8;
  position: relative;
  left: 10px;
  right: 5px;
  text-align: left;
  max-width: 220px;
}
.Text1 {
  margin-top: -4px;
  text-align: left;
  opacity: 0.8;
  left: 3px;
  position: relative;

  max-width: 220px;
}
.ImageContainer {
  position: relative;
}
.Imge {
  width: 100%;
  height: auto;
  border-radius: 5px;
}
.Imge1 {
  position: relative;
  margin-top: -80px;
  margin-left: 10px;
  width: 37%;
  top: 10%;
  border-radius: 50%;
  border: 3px solid white;
}
.Card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 228px;
  height: 228px;
  border-radius: 5%;
  margin-left: 8px;
  transition: box-shadow 0.3s ease;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
}
.Card:hover {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
}
</style>
