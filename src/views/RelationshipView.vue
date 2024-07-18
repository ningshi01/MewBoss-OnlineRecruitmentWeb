<template>
  <div class="bigContainer">
    <n-card class="leftCard">
      <div class="LeftText" @click="GotoTitle(4)">
        <img class="buttonImg" src="../assets/SubscribeUser.svg" />可能感兴趣的用户
      </div>
      <div class="LeftText" @click="GotoTitle(5)">
        <img class="buttonImg" src="../assets/SubscribeCompany.svg" />可能感兴趣的企业
      </div>
      <div class="LeftText" @click="GotoTitle(1)">
        <img class="buttonImg" src="../assets/Subscribe.svg" />关注的用户
      </div>
      <div class="LeftText" @click="GotoTitle(2)">
        <img class="buttonImg" src="../assets/RecommandCompany.svg" />关注的企业
      </div>
      <div class="LeftText" @click="GotoTitle(3)">
        <img class="buttonImg" src="../assets/Fans.svg" />关注我的用户
      </div>
    </n-card>
    <div class="Container">
      <div class="TopStripe"></div>

      <n-card class="InternalContainer" :bordered="false" id="4">
        <div class="TextContainer">
          <span class="RecommendationText">
            猜您喜欢（根据您的职业意向推荐用户）
            <n-button class="Button2" ghost @click="ShowRecommendation">
              <span class="LookMore">查看更多</span>
            </n-button>
          </span>
        </div>
        <hr />
        <LoadingBox v-if="show_loading_recommend_user" />
        <div v-else class="RecommendationContainer">
          <PeopleFrame
            class="Item"
            v-for="(item, index) in FiltRecommends"
            :key="index"
            :UserName="item.username"
            :Avatar="item.userprofile.avatar"
            :BackImage="item.userprofile.resume"
            :Email="item.email"
            :Education="item.userprofile.education"
            :Fan_count="item.fan_count"
            :Id="item.id"
          />
        </div>
      </n-card>
      <n-card class="InternalContainer" :bordered="false" id="5">
        <div class="TextContainer">
          <span class="RecommendationText">
            猜您喜欢（根据您的职业意向推荐企业）
            <n-button class="Button2" ghost @click="ShowRecommendCompany">
              <span class="LookMore">查看更多</span>
            </n-button>
          </span>
        </div>
        <hr />
        <LoadingBox v-if="show_loading_recommend_company" />
        <div v-else class="RecommendationContainer">
          <CompanyItem
            class="Item"
            v-for="(item, index) in FiltRecommendCompany"
            :key="index"
            :Name="item.name"
            :Avatar="item.img"
            :BackImage="null"
            :Info="item.info"
            :Fan_number="item.fan_number"
            :Id="item.id"
          />
        </div>
      </n-card>
      <n-card class="InternalContainer1" :bordered="false" circle id="1">
        <div class="TextContainer">
          <span class="RecommendationText">
            已经关注的用户
            <n-button v-if="FilteFollows.length" class="Button1" ghost @click="ShowFollowUser">
              <span class="LookMore">查看全部</span>
            </n-button>
          </span>
        </div>
        <hr />
        <LoadingBox v-if="show_loading_my_followed_user" />
        <div v-else>
          <div v-if="!FilteFollows.length" style="width: 100%; text-align: center">
            您还没有关注任何用户
          </div>
          <div v-if="FilteFollows.length" class="FollowedUserContainer">
            <FollowedItem
              v-for="(item, index) in FilteFollows"
              :key="index"
              :UserName="item.username"
              :Avatar="item.userprofile.avatar"
              :BackImage="item.userprofile.resume"
              :Email="item.email"
              :Education="item.userprofile.education"
              :Id="item.id"
            ></FollowedItem>
          </div>
        </div>
      </n-card>
      <n-card class="InternalContainer" :bordered="false" id="2">
        <div class="TextContainer">
          <span class="RecommendationText">
            已经关注的企业
            <n-button v-if="FilteCompanys.length" class="Button1" ghost @click="ShowFollowCompany">
              <span class="LookMore">查看全部</span>
            </n-button>
          </span>
        </div>
        <hr />
        <LoadingBox v-if="show_loading_my_followed_company" />
        <div v-else>
          <div v-if="!FilteCompanys.length" style="width: 100%; text-align: center">
            您还没有关注
          </div>
          <div v-if="FilteCompanys.length" class="FollowedCompanyContainer">
            <FollowedCompany
              v-for="(item, index) in FilteCompanys"
              :key="index"
              :Avatar="item.img"
              :CompanyName="item.name"
              :Info="item.info"
              :Id="item.id"
            ></FollowedCompany>
          </div>
        </div>
      </n-card>
      <n-card class="InternalContainer" :bordered="false" id="3">
        <div class="TextContainer">
          <span style="margin-right: 10px" class="RecommendationText">
            关注我的人
            <n-button
              v-if="FiltFansList.length"
              style="margin-left: 480px"
              class="Button1"
              ghost
              @click="showFollowMe"
            >
              <span class="LookMore">查看全部</span>
            </n-button>
          </span>
        </div>
        <hr />
        <LoadingBox v-if="show_loading_followed_user" />
        <div v-else>
          <div v-if="!FiltFansList.length" style="width: 100%; text-align: center">
            暂时无人关注
          </div>
          <div v-if="FiltFansList.length" class="FollowedCompanyContainer">
            <FollowedItem
              v-for="(item, index) in FiltFansList"
              :key="index"
              :UserName="item.user.username"
              :Avatar="item.avatar"
              :BackImage="item.resume"
              :Email="item.user.email"
              :Education="item.education"
              :Id="item.user.id"
            ></FollowedItem>
          </div>
        </div>
      </n-card>
    </div>
  </div>

  <n-modal v-model:show="FollowedUserWindow">
    <n-card
      style="width: 830px; height: 700px; overflow: auto"
      title="全部关注的用户"
      closable
      @close="handleUserFollow"
    >
      <div class="FollowedUserContainer">
        <FollowedItem
          v-for="(item, index) in Follows"
          :key="index"
          :UserName="item.username"
          :Avatar="item.userprofile.avatar"
          :BackImage="item.userprofile.resume"
          :Email="item.email"
          :Education="item.userprofile.education"
          :Id="item.id"
        ></FollowedItem>
      </div>
      >
    </n-card>
  </n-modal>
  <n-modal v-model:show="FollowedCompanyWindow">
    <n-card
      style="width: 830px; height: 700px; overflow: auto"
      title="全部关注的企业"
      closable
      @close="handleCompanyFollow"
    >
      <div class="FollowedCompanyContainer">
        <FollowedCompany
          v-for="(item, index) in Companys"
          :key="index"
          :Avatar="item.img"
          :CompanyName="item.name"
          :Info="item.info"
          :Id="item.id"
        ></FollowedCompany>
      </div>
    </n-card>
  </n-modal>
  <n-modal v-model:show="ShowFollowMe">
    <n-card
      style="width: 830px; height: 700px; overflow: auto"
      title="关注我的人"
      closable
      @close="handleFollowMe"
    >
      <div class="FollowedUserContainer">
        <FollowedItem
          v-for="(item, index) in FansList"
          :key="index"
          :UserName="item.user.username"
          :Avatar="item.avatar"
          :BackImage="item.resume"
          :Email="item.user.email"
          :Education="item.education"
          :Id="item.user.id"
        ></FollowedItem>
      </div>
    </n-card>
  </n-modal>
  <n-modal v-model:show="RecommendationWindow">
    <n-card
      style="width: 840px; height: 700px; overflow: auto"
      title="更多推荐"
      closable
      @close="handleRecommendation"
    >
      <div class="RecommendationContainer">
        <PeopleFrame
          class="Item"
          v-for="(item, index) in Recommends"
          :key="index"
          :UserName="item.username"
          :Avatar="item.userprofile.avatar"
          :BackImage="item.userprofile.resume"
          :Email="item.email"
          :Education="item.userprofile.education"
          :Fan_count="item.fan_count"
          :Id="item.id"
          :IsSubscribed="item.is_subscribed"
        />
      </div>
    </n-card>
  </n-modal>
  <n-modal v-model:show="RecommendationCompany">
    <n-card
      style="width: 840px; height: 700px; overflow: auto"
      title="更多推荐"
      closable
      @close="handleRecommendation"
    >
      <div class="RecommendationContainer">
        <CompanyItem
          class="Item"
          v-for="(item, index) in FiltRecommendCompany"
          :key="index"
          :Name="item.name"
          :Avatar="item.img"
          :BackImage="null"
          :Info="item.info"
          :Fan_number="item.fan_number"
          :Id="item.id"
        />
      </div>
    </n-card>
  </n-modal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PeopleFrame from '@/components/forFollow/PeopleItem.vue'
import FollowedItem from '@/components/forFollow/FollowedItem.vue'
import CompanyItem from '@/components/forFollow/CompanyItem.vue'
import {
  companyFollowGet,
  companyRecommend,
  userFansGet,
  userFollowGet,
  userRecommend
} from '@/api/apiList.js'
import { useMessage } from 'naive-ui'
const message = useMessage('')
let FollowedCompanyWindow = ref(false)
let FollowedUserWindow = ref(false)
let RecommendationWindow = ref(false)
let RecommendationCompany = ref(false)
let ShowFollowMe = ref(false)
const Follows = ref([])
const FilteFollows = ref([])
const Companys = ref([])
const FilteCompanys = ref([])
const Recommends = ref([])
const FiltRecommends = ref([])
const RecommendCompanys = ref([])
const FiltRecommendCompany = ref([])
const FansList = ref([])
const FiltFansList = ref([])
let show_loading_recommend_user = ref(true)
let show_loading_recommend_company = ref(true)
let show_loading_my_followed_user = ref(true)
let show_loading_my_followed_company = ref(true)
let show_loading_followed_user = ref(true)
const GotoTitle = (Id) => {
  const targetDiv = document.getElementById(Id)
  if (targetDiv) {
    // 使用 scrollIntoView 方法滚动到目标元素
    targetDiv.scrollIntoView({ behavior: 'smooth' })
  }
}
onMounted(() => {
  show_loading_recommend_user.value = true
  show_loading_recommend_company.value = true
  show_loading_my_followed_user.value = true
  show_loading_my_followed_company.value = true
  show_loading_followed_user.value = true
  userFansGet({}).then((res) => {
    FansList.value = res.data
    if (FansList.value.length > 8) {
      FiltFansList.value = FansList.value.slice(0, 8)
    } else FiltFansList.value = FansList.value
    show_loading_followed_user.value = false
  })
  companyFollowGet({}).then((res) => {
    Companys.value = res.data
    if (Companys.value.length > 8) {
      FilteCompanys.value = Companys.value.slice(0, 8)
    } else {
      FilteCompanys.value = Companys.value
    }
    show_loading_my_followed_company.value = false
  })
  userFollowGet({}).then((res) => {
    Follows.value = res.data
    if (Follows.value.length > 8) {
      FilteFollows.value = Follows.value.slice(0, 8)
    } else {
      FilteFollows.value = Follows.value
    }
    show_loading_my_followed_user.value = false
  })
  userRecommend({}).then((res) => {
    Recommends.value = res.data
    FiltRecommends.value = Recommends.value.slice(0, 6)
    show_loading_recommend_user.value = false
  })
  companyRecommend({}).then((res) => {
    RecommendCompanys.value = res.data
    FiltRecommendCompany.value = RecommendCompanys.value.slice(0, 6)
    show_loading_recommend_company.value = false
  })
})
const handleFollowMe = () => {
  ShowFollowMe.value = false
}
const showFollowMe = () => {
  if (FansList.value.length > 0) ShowFollowMe.value = true
  else message.warning('您还没有粉丝')
}
const handleUserFollow = () => {
  FollowedUserWindow.value = false
}
const handleCompanyFollow = () => {
  FollowedCompanyWindow.value = false
}
const handleRecommendation = () => {
  RecommendationWindow.value = false
  RecommendationCompany.value = false
}
const ShowRecommendCompany = () => {
  RecommendationCompany.value = true
}
const ShowFollowUser = () => {
  if (Follows.value.length > 0) FollowedUserWindow.value = true
  else {
    message.warning('您还没有关注其他用户')
  }
}
const ShowFollowCompany = () => {
  if (Companys.value.length > 0) FollowedCompanyWindow.value = true
  else message.warning('您还没有关注企业')
}
const ShowRecommendation = () => {
  RecommendationWindow.value = true
}
</script>

<style scoped>
.Button1 {
  width: 105px;
  margin-left: 440px;
  border-radius: 10%;
}

.Button2 {
  width: 105px;
  margin-left: 245px;
  border-radius: 10%;
}

.LookMore {
  font-size: 20px;
  font-weight: bolder;
  margin-right: 50px;
  border-radius: 10%;
}

.RecommendationText {
  font-size: 18px;
  height: 20px;
  margin-left: 15px;
}

.FollowedUserContainer {
  margin-left: 17px;
  display: flex;

  flex-wrap: wrap;
}

.FollowedCompanyContainer {
  margin-top: 5px;
  margin-left: 17px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.RecommendationContainer {
  margin-left: 17px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.bigContainer {
  display: flex;

  justify-content: center;
}

.Container {
  height: 100%;
  width: 820px;
  text-align: center;
  border-radius: 15px;
  margin-left: 15%;
}

.leftCard {
  position: fixed;
  margin-top: 90px;
  left: 9%;
  top: -1%;
  width: 250px;
  border-radius: 15px;
  margin-right: 30px;
  height: 270px;
  border: 1px solid #ccc;
}

.InternalContainer1 {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.InternalContainer {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.buttonImg {
  position: relative;
  top: 5px;
  margin-right: 6px;
  height: 25px;
}

.Item {
  margin-top: 10px;
  height: 213px;
  margin-left: 20px;
}

.LeftText {
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 17px;
  cursor: pointer;
}

.TopStripe {
  background-color: #f4f2ee;
  height: 85px;
}
</style>
