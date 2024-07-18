<script setup>
import { reactive, onMounted } from 'vue'
// import { userSubscribe, userUnsubscribe} from '../../api/apiList.js'

const Recommend_lists = reactive([])
const rec = {
  name: 'mew boss',
  direction: 'C++ Developer at Beihang University'
}
// function follow_it() {
//   userSubscribe({
//     id:props.sender_id
//   }).then((res)=>{
//     console.log(res)
//     emit('subscribe',1)
//   })
// }
// function Unfollow_it() {
//   userUnsubscribe({
//     id:props.sender_id
//   }).then((res)=>{
//     console.log(res)
//     emit('subscribe',1)
//   })
// }
onMounted(() => {
  Recommend_lists.push(rec)
  Recommend_lists.push(rec)
})
</script>
<template>
  <n-card class="card">
    <div style="display: flex; flex-direction: column">
      <n-text style="font-size: 16px; font-weight: bold">添加到信息流</n-text>
      <n-text style="font-size: 18px; color: grey">相关推荐</n-text>
      <div
        v-for="r in Recommend_lists"
        :key="r.id"
        style="display: flex; flex-direction: row; margin-left: 10%"
      >
        <div class="right-body">
          <n-avatar round :size="50" class="avatar" />
        </div>
        <div
          class="left-body"
          style="width: 100%; margin-left: -15%; align-items: flex-start; margin-right: -100%"
        >
          <n-text style="font-size: 20px; font-weight: bold"> {{ r.name }} </n-text>
          <n-text style="font-size: 15px"> {{ r.direction }} </n-text>
          <n-button round secondary class="button" style="margin-top: 2%">
            <n-text style="font-size: 30px; font-weight: bold; margin-bottom: 7%; margin-left: -5%"
              >+</n-text
            >
            <n-text style="font-size: 19px; font-weight: bold; margin-left: 5%">关注</n-text>
          </n-button>
        </div>
        <n-divider style="margin: 0"></n-divider>
      </div>
    </div>

    <template #footer>
      <n-button class="card-button" quaternary size="large" strong>
        查看更多推荐
        <template #icon>
          <n-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="48"
                d="M268 112l144 144l-144 144"
              ></path>
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="48"
                d="M392 256H100"
              ></path>
            </svg>
          </n-icon>
        </template>
      </n-button>
    </template>
  </n-card>
</template>
<style scoped>
.card {
  //margin-top: 1.5vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50vh;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.avatar {
  margin-left: -40%;
  margin-top: 10%;
}
.left-body {
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直方向排列 */
}
.right-body {
  margin-top: 1%;
  margin-right: 10%;
}
.button {
  margin-top: 1%;
  border: 1.5px solid black;
  transition: all 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-button {
  width: 100%;
}
</style>
