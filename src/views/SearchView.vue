<script setup>
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { ChevronDown } from '@vicons/ionicons5'
import BlankDisplay from '@/components/forSearch/BlankDisplay.vue'
import {
  companySubscribe,
  companyUnsubscribe,
  comprehensiveSearch,
  userSubscribe,
  userUnsubscribe
} from '@/api/apiList.js'
import default_avatar from '@/assets/default_avatar.svg'
import { checkLogin } from '@/utils/token.js'
onMounted(() => {
  if (query.value.filter == null) {
    router.push({ path: 'search', query: { keywords: query.value.keywords, filter: 'user' } })
    return
  }
  search(query.value.filter, query.value.keywords)
})

onBeforeRouteUpdate((to) => {
  search(to.query.filter, to.query.keywords)
})
let route = useRoute()
let { query } = toRefs(route)
let router = useRouter()
let result_users = ref([])
let result_enterprises = ref([])
let result_jobs = ref([])

let loading_show = ref(true)

let options_not_followed = ref([
  {
    label: '私聊',
    key: 'chat'
  }
])
let options_followed = ref([
  {
    label: '私聊',
    key: 'chat'
  },
  {
    label: '取消关注',
    key: 'unfollow'
  }
])

let message = useMessage()

function clearSearchResults() {
  result_jobs.value.length = 0
  result_users.value.length = 0
  result_enterprises.value.length = 0
}

async function search(filter, keywords) {
  loading_show.value = true
  clearSearchResults()
  comprehensiveSearch({
    query: keywords,
    type: filter
  })
    .then((res) => {
      switch (query.value.filter) {
        case 'company':
          result_enterprises.value = res.data
          break
        case 'user':
          result_users.value = res.data
          break
        case 'job':
          result_jobs.value = res.data
          break
      }
      loading_show.value = false
    })
    .catch((err) => {
      console.log(err)
    })
}

function handleSelect(key, id) {
  switch (key) {
    case 'chat':
      if (!checkLogin()) {
        message.warning('请先登录再进行私聊！')
        return
      }
      router.push({ path: 'chat', query: { userid: id } })
      break
    case 'unfollow':
      unFollowUser(id)
      break
  }
}

function changeFilter(filter) {
  router.push({ path: 'search', query: { keywords: query.value.keywords, filter: filter } })
}
function followUser(id) {
  if (!checkLogin()) {
    message.warning('请先登录!')
    return
  }
  userSubscribe({ id: id })
    .then(() => {
      result_users.value.forEach((user) => {
        if (user.id === id) {
          user.is_subscribed = true
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
function unFollowUser(id) {
  userUnsubscribe({ id: id })
    .then(() => {
      result_users.value.forEach((user) => {
        if (user.id === id) {
          user.is_subscribed = false
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
function followEnterprise(id) {
  if (!checkLogin()) {
    message.warning('请先登录!')
    return
  }
  companySubscribe({ company_id: id })
    .then(() => {
      result_enterprises.value.forEach((enterprises) => {
        if (enterprises.id === id) {
          enterprises.is_subscribed = true
          enterprises.fan_number++
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
function unfollowEnterprise(id) {
  companyUnsubscribe({ company_id: id })
    .then(() => {
      result_enterprises.value.forEach((enterprises) => {
        if (enterprises.id === id) {
          enterprises.is_subscribed = false
          enterprises.fan_number--
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
function toUserHomepage(id) {
  router.push({ name: 'UserProfile', query: { id: id } })
}
function toEnterpriseHomepage(id) {
  router.push({ name: 'CompanyProfile', query: { id: id } })
}
function toJobHomepage(id) {
  router.push({ name: 'JobDetailsView', query: { id: id } })
}
</script>

<template>
  <div class="container">
    <div class="filter-container">
      <div class="filter-title">搜索结果</div>
      <div
        class="filter-item"
        @click="changeFilter('user')"
        :class="{ 'filter-item-selected': query.filter === 'user' }"
      >
        用户
      </div>
      <div
        class="filter-item"
        @click="changeFilter('company')"
        :class="{ 'filter-item-selected': query.filter === 'company' }"
      >
        企业
      </div>
      <div
        class="filter-item"
        @click="changeFilter('job')"
        :class="{ 'filter-item-selected': query.filter === 'job' }"
        style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px"
      >
        职位
      </div>
    </div>
    <div class="filter-main">
      <div class="loading-container" v-if="loading_show">
        <loading-jump-ball />
      </div>
      <div v-else class="result-container">
        <div class="result-num">
          {{ query.filter === 'user' ? result_users.length : result_jobs.length }}条结果
        </div>
        <div class="result-container-inner">
          <div class="result-user" v-if="query.filter === 'user'">
            <div class="result-title">用户</div>
            <div v-if="result_users.length !== 0">
              <div
                v-for="(user, index) in result_users"
                :key="index"
                @click="toUserHomepage(user.id)"
              >
                <div class="user-item">
                  <div class="user-item-left">
                    <div class="user-avatar-info">
                      <div class="user-avatar">
                        <n-avatar
                          :size="50"
                          :src="
                            user.userprofile?.avatar == null
                              ? default_avatar
                              : user.userprofile.avatar
                          "
                          round
                        />
                      </div>
                      <div class="user-info">
                        <div class="user-name-education">
                          <div class="user-name">{{ user.username }}</div>
                          <div class="user-education">{{ user.userprofile?.education }}</div>
                        </div>
                        <div class="user-enterprise">
                          {{ user.userprofile.company == null ? '' : user.userprofile.company }}
                        </div>
                      </div>
                    </div>
                    <div class="user-interest">
                      <span
                        v-for="(interest, index) in user.userprofile.interest_position"
                        :key="index"
                      >
                        {{ interest }}
                        <span v-if="index !== user.userprofile.interest_position.length - 1"
                          >,
                        </span>
                      </span>
                    </div>
                  </div>
                  <div class="user-item-right">
                    <n-dropdown
                      v-if="user.is_subscribed"
                      trigger="click"
                      :options="options_followed"
                      @select="(key) => handleSelect(key, user.id)"
                    >
                      <button class="user-item-button button-concerned" @click.stop>
                        已关注<n-icon size="20" :component="ChevronDown" />
                      </button>
                    </n-dropdown>
                    <n-dropdown
                      v-else
                      trigger="hover"
                      :options="options_not_followed"
                      @select="(key) => handleSelect(key, user.id)"
                    >
                      <button
                        class="user-item-button button-not-concerned"
                        @click.stop="followUser(user.id)"
                      >
                        关注用户<n-icon size="20" :component="ChevronDown" />
                      </button>
                    </n-dropdown>
                  </div>
                </div>
                <div class="item-separator" v-if="index < result_users.length - 1"></div>
              </div>
            </div>
            <div v-else>
              <BlankDisplay />
            </div>
          </div>
          <div class="result-enterprise" v-if="query.filter === 'company'">
            <div class="result-title">企业</div>
            <div v-if="result_enterprises.length !== 0">
              <div
                v-for="(enterprise, index) in result_enterprises"
                :key="index"
                @click="toEnterpriseHomepage(enterprise.id)"
              >
                <div class="user-item">
                  <div class="user-item-left">
                    <div class="user-avatar">
                      <n-avatar :size="50" :src="enterprise.img" round />
                    </div>
                    <div class="enterprise-info">
                      <div class="enterprise-name-fans">
                        <div class="user-name">{{ enterprise.name }}</div>
                        <div class="enterprise-fans">粉丝数: {{ enterprise.fan_number }}</div>
                      </div>
                      <n-ellipsis style="max-width: 20vw">
                        <span class="user-enterprise">{{ enterprise.info }}</span>
                        <template #tooltip>
                          <div style="text-align: center; max-width: 70vw">
                            {{ enterprise.info }}
                          </div>
                        </template>
                      </n-ellipsis>
                    </div>
                  </div>
                  <div class="user-item-right">
                    <button
                      v-if="enterprise.is_subscribed"
                      class="user-item-button button-concerned"
                      @click.stop="unfollowEnterprise(enterprise.id)"
                    >
                      已关注
                    </button>
                    <button
                      v-else
                      class="user-item-button button-not-concerned"
                      @click.stop="followEnterprise(enterprise.id)"
                    >
                      关注企业
                    </button>
                  </div>
                </div>
                <div class="item-separator" v-if="index < result_enterprises.length - 1"></div>
              </div>
            </div>
            <div v-else>
              <BlankDisplay />
            </div>
          </div>
          <div class="result-job" v-if="query.filter === 'job'">
            <div class="result-title">职位</div>
            <div v-if="result_jobs.length !== 0">
              <div v-for="(job, index) in result_jobs" :key="index" @click="toJobHomepage(job.id)">
                <div class="user-item">
                  <div class="job-item-left-center">
                    <div class="job-item-left">
                      <div class="user-avatar">
                        <n-avatar :size="60" :src="job.company.img" round />
                      </div>
                      <div class="job-details">
                        <div class="job-company">{{ job.company.name }}</div>
                        <div>
                          <span class="job-name">{{ job.title }} </span>
                          <span class="job-location">{{ job.job_position }}</span>
                        </div>
                        <div class="job-salary">薪资: {{ job.salary }}</div>
                      </div>
                    </div>
                    <div class="job-item-center">
                      <div v-if="job.feature.length !== 0">
                        相关技术:
                        <span v-for="(feature, index) in job.feature" :key="index">
                          {{ feature }}
                          <span v-if="index < job.feature.length - 1">、</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="job-item-right">
                    <div class="remaining-quantity">剩余: {{ job.count }}</div>
                    <div class="enter-job-details">
                      <span v-if="job.is_delivered">已投递</span>
                      <span v-else>进入职位详情页</span>
                    </div>
                  </div>
                </div>
                <div class="item-separator" v-if="index < result_jobs.length - 1"></div>
              </div>
            </div>
            <div v-else>
              <BlankDisplay />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  position: absolute;
  margin-top: 4vh;
}

.filter-container {
  position: fixed;
  background-color: white;
  width: 15vw;
  min-height: 10%;
  left: 10vw;
  border-radius: 10px;
  border: 1px solid #d9d8d8;
}
.filter-title {
  width: 100%;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  padding-left: 8%;
  padding-top: 10px;
  padding-bottom: 10px;
}
.filter-item {
  height: 5vh;
  width: 92%;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 8%;
  transition: background-color 0.2s ease;
  border-left: 2px solid transparent;
}
.filter-item:hover {
  background-color: #cccccc;
}
.filter-item-selected {
  border-left: 2px solid green;
  background-color: #cccccc;
}
.filter-main {
  position: absolute;
  width: 50vw;
  left: 30vw;
}
.loading-container {
  width: 100%;
  min-height: 30vh;
  margin-right: 20px;
  justify-content: left;
}
.result-container {
  width: 100%;
  min-height: 30%;
  margin-right: 20px;
}
.result-num {
  font-size: 16px;
  color: #606060;
  margin-bottom: 10px;
}
.result-container-inner {
  border-radius: 10px;
  border: 1px solid #d9d8d8;
  background-color: white;
}

.result-user {
  width: 100%;
  height: 100%;
}
.result-title {
  margin-top: 10px;
  width: 100%;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-bottom: 10px;
}

.user-item {
  min-height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
  cursor: pointer;
}
.user-item:hover {
  background-color: #cccccc;
}
.user-item-left {
  width: 77%;
  margin-left: 3%;
  display: flex;
  align-items: center;
}
.user-avatar-info {
  display: flex;
  align-items: center;
  width: 25%;
}
.user-info {
  margin-left: 10%;
}
.user-name-education {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.enterprise-info {
  margin-left: 2%;
}

.enterprise-name-fans {
  display: flex;
  align-items: end;
}
.enterprise-fans {
  font-size: 12px;
  font-weight: 600;
  color: #606060;
  margin-left: 5px;
}
.user-name {
  font-weight: 800;
  font-size: 16px;
}
.user-education {
  font-size: 12px;
  font-weight: 600;
  color: #606060;
}
.user-enterprise {
  font-size: 14px;
  font-weight: 500;
  color: grey;
}
.user-interest {
  font-size: 14px;
  color: darkolivegreen;
  font-weight: 600;
  margin-left: 5%;
  width: 30%;
}
.user-item-right {
  margin-right: 3%;
  max-width: 17%;
  display: flex;
  align-items: center;
}
.user-item-button {
  width: 100px;
  height: 40px;
  border-radius: 30px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border 0.2s linear;
  font-weight: 700;
  border: 2px solid;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.job-item-left-center {
  width: 80%;
  display: flex;
}
.job-item-left {
  width: 45%;
  margin-left: 5%;
  display: flex;
  align-items: center;
}

.job-company {
  font-weight: 800;
  font-size: 16px;
}

.job-name {
  font-weight: 600;
  font-size: 14px;
  color: #0571c9;
}
.job-location {
  font-weight: 600;
  font-size: 13px;
  color: darkolivegreen;
  margin-left: 5px;
}

.job-details {
  margin-left: 5%;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.job-item-center {
  max-width: 45%;
  margin-left: 5%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}

.job-item-right {
  width: 20%;
  margin-right: 3%;
  display: flex;
  flex-direction: column;
  align-items: end;
}
.remaining-quantity {
  font-size: 14px;
  font-weight: 600;
  color: gray;
}

.enter-job-details {
  font-size: 15px;
  font-weight: 600;
}

.job-salary {
  font-size: 12px;
  font-weight: 600;
  color: #606060;
}

.button-concerned {
  border-color: black;
  color: black;
}
.button-concerned:hover {
  background-color: #e5e3e3;
  border: 3px solid;
}
.button-not-concerned {
  border-color: #308be7;
  color: #308be7;
}
.button-not-concerned:hover {
  background-color: #d1e7ff;
  border: #074e96 3px solid;
}
.item-separator {
  display: block;
  width: 100%;
  border: 1px solid lightgrey;
}
</style>
