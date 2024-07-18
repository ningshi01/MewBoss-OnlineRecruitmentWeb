<script setup>
import List from '@/components/forNotifications/NotificationList.vue'
import Manager from '@/components/forNotifications/NotificationManager.vue'
import Link from '@/components/forNotifications/LinkDisplay.vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { toRefs } from 'vue'
import { companyNoticeGet, noticeGet } from '@/api/apiList.js'
import { checkLogin } from '@/utils/token.js'

let route = useRoute()
let router = useRouter()
let { query } = toRefs(route)
let notices = ref([])

let show_loading = ref(true)
onMounted(() => {
  if (!checkLogin()) {
    useMessage().warning('请先登录！')
    router.push({ name: 'login' })
    return
  }
  if (typeof query.value.filter == 'undefined') {
    router.push({ name: 'notifications', query: { filter: 'all', type: 'personal' } })
  }
  updateNotices(query.value.type)
})
function updateNotices(type) {
  notices.value.length = 0
  show_loading.value = true
  switch (type) {
    case 'personal':
      getPersonalNotices()
      break
    case 'enterprise':
      getEnterpriseNotices()
      break
  }
}
function getPersonalNotices() {
  noticeGet()
    .then((res) => {
      let temp_notices = []
      if (res.data.length !== 0) {
        if (query.value.filter === 'unprocessed') {
          res.data.forEach((notice) => {
            notice = { ...notice, ...formatTimestamp(notice.time_sent) }
            if (notice.type.endsWith('IDLE')) {
              temp_notices.push(notice)
            }
          })
        } else if (query.value.filter === 'processed') {
          res.data.forEach((notice) => {
            notice = { ...notice, ...formatTimestamp(notice.time_sent) }
            if (!notice.type.endsWith('IDLE')) {
              temp_notices.push(notice)
            }
          })
        } else {
          res.data.forEach((notice) => {
            notice = { ...notice, ...formatTimestamp(notice.time_sent) }
            temp_notices.push(notice)
          })
        }
      } else {
        temp_notices = res.data
      }
      notices.value = temp_notices
      show_loading.value = false
    })
    .catch((err) => {
      console.log(err)
    })
}
function getEnterpriseNotices() {
  companyNoticeGet()
    .then((res) => {
      let temp_notices = []
      if (res.data.length !== 0) {
        if (query.value.filter === 'unprocessed') {
          res.data.forEach((notice) => {
            notice = { ...notice, ...formatTimestamp(notice.time_sent) }
            if (notice.type.endsWith('IDLE')) {
              temp_notices.push(notice)
            }
          })
        } else if (query.value.filter === 'processed') {
          res.data.forEach((notice) => {
            notice = { ...notice, ...formatTimestamp(notice.time_sent) }
            if (!notice.type.endsWith('IDLE')) {
              temp_notices.push(notice)
            }
          })
        } else {
          res.data.forEach((notice) => {
            notice = { ...notice, ...formatTimestamp(notice.time_sent) }
            temp_notices.push(notice)
          })
        }
      } else {
        temp_notices = res.data
      }
      notices.value = temp_notices
      show_loading.value = false
    })
    .catch((err) => {
      console.log(err)
      notices.value = []
    })
}
onBeforeRouteUpdate((to) => {
  if (typeof to.query.filter == 'undefined') {
    router.push({ name: 'notifications', query: { filter: 'all', type: 'personal' } })
  }
  updateNotices(to.query.type)
})

//处理时间戳
function formatTimestamp(timestamp) {
  // 解析时间戳
  const dateObj = new Date(timestamp)
  // 提取月和日
  const month = String(dateObj.getMonth() + 1).padStart(2, '0') // getMonth() 返回值为 0-11，所以需要加 1
  const day = String(dateObj.getDate()).padStart(2, '0')
  // 提取小时和分钟
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  // 格式化为所需的对象
  return {
    date: `${month}-${day}`,
    time: `${hours}:${minutes}`
  }
}
</script>

<template>
  <div class="messageContainer">
    <Manager :type="query.type" @change="updateNotices" />
    <List
      :filter="query.filter"
      :notices="notices"
      :loading="show_loading"
      @update="updateNotices"
    />
    <Link />
  </div>
</template>

<style scoped>
.messageContainer {
  margin-top: 4vh;
  width: 100%;
  position: relative;
}
</style>
