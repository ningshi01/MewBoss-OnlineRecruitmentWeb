<template>
  <div class="PeopleContainer">
    <div class="Card">
      <div class="CardContainer">
        <div class="ImageContainer">
          <img class="Imge" src="../../assets/defaultImg.png" />
        </div>
        <n-avatar class="Imge1" :src="Avatar" :size="60" />
        <div class="Name">
          <n-ellipsis style="max-width: 240px" :line-clamp="1">
            {{ UserName }}
          </n-ellipsis>
        </div>
        <div class="Text">
          <n-ellipsis style="max-width: 150px" :line-clamp="2">
            <span>
              {{ Education }} <br />
              {{ Email }}
            </span>
          </n-ellipsis>
        </div>
        <n-button type="info" ghost class="Button" circle @click="GotoFollow"> 查看 </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  UserName: String,
  Avatar: String,
  BackImage: String,
  Education: String,
  Email: String,
  Id: String
})

let UserName = ref(props.UserName)
let Avatar = ref(props.Avatar)
let BackImage = ref(props.BackImage)
let Education = ref(props.Education)
let Email = ref(props.Email)
if (BackImage.value === null) {
  BackImage.value = 'src/assets/defaultImg.png'
}
const GotoFollow = () => {
  router.push({ name: 'UserProfile', query: { id: props.Id } })
}
</script>
<style scoped>
.Button {
  width: 80px;
  position: relative;
  top: -40px;
}
.Name {
  position: relative;
  top: -32px;
  max-width: 240px;
  font-weight: bold;
  font-size: 17px;
  text-align: center;
}

.Text {
  position: relative;
  top: -40px;
  font-size: 13px;
  text-align: left;
  max-width: 140px;
}
.ImageContainer {
  border-radius: 3px;
  height: 45px; /* 指定容器高度 */
  overflow: hidden; /* 防止内容溢出 */
  display: flex;
  justify-content: center; /* 居中对齐图片 */
}
.Imge1 {
  position: relative;
  z-index: 1; /* Foreground image */
  top: -40px; /* Adjust as needed to position Imge1 */
  border-radius: 50%;
}
.CardContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.Imge {
  position: relative;
  width: 100%;
}
.PeopleContainer {
  margin-bottom: 7px;
  display: flex;
  flex-wrap: wrap-reverse;
}
.Card {
  width: 170px;
  height: 190px;
  border-radius: 5%;
  margin-left: 15px;

  transition: box-shadow 0.3s ease; /* 添加过渡效果 */
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); /* 默认阴影效果 */
}

/* 鼠标覆盖时的阴影效果 */
.Card:hover {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
}
</style>
