<script setup>
import { useRoute, useRouter } from 'vue-router'
import {
  EnterOutline,
  ExitOutline,
  DocumentTextOutline,
  Repeat,
  AlertSharp
} from '@vicons/ionicons5'
import { toRefs } from 'vue'
import {
  companyManagerChangeConfirm,
  managerHandleResign,
  noticeDeleteAll,
  userJoinCompany
} from '@/api/apiList.js'

const notice_type = {
  invite_idle: 'INVT_IDLE',
  invite_agreed: 'INVT_AGREED',
  invite_reject: 'INVT_REJECT',
  invite_accepted: 'INVT_ACCEPTED',
  invite_denied: 'INVT_DENIED',
  aply_notice: 'APLY_NOTICE',
  quit_idle: 'QUIT_IDLE',
  quit_agreed: 'QUIT_AGREED',
  quit_reject: 'QUIT_REJECT',
  quit_accepted: 'QUIT_ACCEPTED',
  quit_denied: 'QUIT_DENIED',
  change_idle: 'CHANGE_IDLE',
  change_agreed: 'CHANGE_AGREED',
  change_reject: 'CHANGE_REJECT',
  change_accepted: 'CHANGE_ACCEPTED',
  change_succeed: 'CHANGE_SUCCEED',
  change_denied: 'CHANGE_DENIED',
  kick_notice: 'KICK_NOTICE'
}
const props = defineProps({
  filter: {
    default: 'all',
    type: String
  },
  notices: {
    default: () => [],
    type: Array
  },
  loading: {
    default: true,
    type: Boolean
  }
})
const refProps = toRefs(props)
let router = useRouter()
let route = useRoute()
/*let options = [
  {
    label: '全部',
    key: 'my_posts_all'
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
  {
    label: '评论',
    key: 'my_posts_comments'
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
  {
    label: '回应',
    key: 'my_posts_reactions'
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
  {
    label: '转发',
    key: 'my_posts_reposts'
  }
]*/
let notificationsList = refProps.notices

let message = useMessage()

let model_invite_from_enterprise = ref(false)
let model_resign_from_user = ref(false)
let model_change_from_user = ref(false)
let model_clean_notifications_handled = ref(false)

let noti = ref()
let emit = defineEmits(['notificationCleanup'])

function selectButton(filter_method) {
  router.push({ path: '/notifications', query: { filter: filter_method, type: route.query.type } })
}
// function selectFilter(filter_method) {
//   router.push({ path: '/notifications', query: { filter: filter_method } })
// }

async function notificationCleanup() {
  await noticeDeleteAll()
    .then(() => {
      message.success('已清除全部待处理通知')
    })
    .catch((err) => {
      console.log(err)
    })
  model_clean_notifications_handled.value = false
  emit('update', route.query.type)
}

function clickNotification(notification) {
  /*
  跳转处理，已读处理
   */
  noti.value = notification

  switch (noti.value.type) {
    case notice_type.invite_idle:
      model_invite_from_enterprise.value = true
      break
    case notice_type.quit_idle:
      model_resign_from_user.value = true
      break
    case notice_type.change_idle:
      model_change_from_user.value = true
      break
    default:
      return
  }
}

function changeNoticeType(target_type) {
  if (refProps.filter.value === 'unprocessed') {
    for (let i = 0; i < notificationsList.value.length; i++) {
      if (notificationsList.value.at(i).id == noti.value.id) {
        notificationsList.value.splice(i, 1)
        break
      }
    }
  } else {
    notificationsList.value.forEach((no) => {
      if (no.id == noti.value.id) {
        no.type = target_type
      }
    })
  }
}
//处理消息
function acceptInviteFromEnterprise() {
  userJoinCompany({
    notice_id: noti.value.id,
    value: true
  })
    .then(() => {
      changeNoticeType(notice_type.invite_agreed)
    })
    .catch((err) => {
      console.log(err)
    })
}

function rejectInviteFromEnterprise() {
  userJoinCompany({
    notice_id: noti.value.id,
    value: false
  })
    .then(() => {
      changeNoticeType(notice_type.invite_reject)
    })
    .catch((err) => {
      console.log(err)
    })
}

function resignAccept() {
  managerHandleResign({
    notice_id: noti.value.id,
    value: true
  })
    .then(() => {
      changeNoticeType(notice_type.quit_agreed)
    })
    .catch((err) => {
      console.log(err)
    })
}

function resignReject() {
  managerHandleResign({
    notice_id: noti.value.id,
    value: false
  })
    .then(() => {
      changeNoticeType(notice_type.quit_reject)
    })
    .catch((err) => {
      console.log(err)
    })
}
function changeAccept() {
  companyManagerChangeConfirm({
    notice_id: noti.value.id,
    value: true
  })
    .then((res) => {
      if (res.errno === 3009) {
        changeNoticeType(notice_type.change_reject)
      } else {
        changeNoticeType(notice_type.change_agreed)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function changeReject() {
  companyManagerChangeConfirm({
    notice_id: noti.value.id,
    value: false
  })
    .then(() => {
      changeNoticeType(notice_type.change_reject)
    })
    .catch((err) => {
      console.log(err)
    })
}

function goToEnterpriseHomepage() {
  router.push({
    path: 'CompanyProfile',
    query: { id: noti.value.company_from }
  })
}
function goToUserChat() {
  router.push({
    path: 'chat',
    query: { userid: noti.value.user_from.id }
  })
}
</script>

<template>
  <div class="listContainer">
    <n-card class="listCard">
      <div class="list-head">
        <div class="list-head-left">
          <div class="listSelect">
            <button
              class="containerButton"
              @click="selectButton('all')"
              v-bind:class="{ selected: filter === 'all', notSelect: filter !== 'all' }"
            >
              全部
            </button>
            <button
              class="containerButton"
              @click="selectButton('unprocessed')"
              v-bind:class="{
                selected: filter === 'unprocessed',
                notSelect: filter !== 'unprocessed'
              }"
            >
              待处理
            </button>
            <button
              class="containerButton"
              @click="selectButton('processed')"
              v-bind:class="{ selected: filter === 'processed', notSelect: filter !== 'processed' }"
            >
              已处理
            </button>
            <!--
          <button
            class="containerButton"
            @click="selectButton('my_posts_all')"
            v-if="filter === 'all' || filter === 'mentions_all'"
            style="visibility: hidden"
          >
            我的动态
          </button>
          <n-dropdown
            trigger="click"
            :options="options"
            @select="selectFilter"
            size="large"
            v-if="filter.startsWith('my_posts_')"
          >
            <button
              class="containerButton"
              @click="selectButton('my_posts_all')"
              v-bind:class="{
                selected: filter.startsWith('my_posts_'),
                notSelect: !filter.startsWith('my_posts_')
              }"
            >
              <span v-if="filter === 'my_posts_all' || filter === 'all' || filter === 'mentions_all'"
                >我的动态</span
              >
              <span v-if="filter === 'my_posts_comments'">我的动态 | 评论</span>
              <span v-if="filter === 'my_posts_reactions'">我的动态 | 回应</span>
              <span v-if="filter === 'my_posts_reposts'">我的动态 | 转发</span>
              <n-icon size="20">
                <Options />
              </n-icon>
            </button>
          </n-dropdown>
          <button
            class="containerButton"
            @click="selectButton('mentions_all')"
            v-bind:class="{
              selected: filter === 'mentions_all',
              notSelect: filter !== 'mentions_all'
            }"
            style="visibility: hidden"
          >
            提及
          </button>
          --></div>
        </div>
        <div class="list-head-right">
          <span id="notification-clear" @click="model_clean_notifications_handled = true"
            >清理通知</span
          >
        </div>
      </div>
    </n-card>
    <div class="loading-container" v-if="refProps.loading.value">
      <LoadingJumpBall />
    </div>
    <div v-else>
      <div class="blank" v-if="notificationsList.length === 0">
        <n-card :bordered="false" class="card">
          <div class="blank_content">
            <img src="../../assets/cat.svg" />
            <div class="blank_content_text" v-if="filter === 'all'">
              <div style="font-weight: 800; font-size: 20px">无新通知</div>
              <div class="blank_content_description">查看首页其他动态</div>
              <button class="containerButton button2" @click="router.push('HomeView')">
                前往首页
              </button>
            </div>
            <!--
            <div class="blank_content_text" v-if="filter.startsWith('my_posts_')">
              <div style="font-weight: 800; font-size: 20px">无新动态</div>
              <div class="blank_content_description">在职业档案中查看以往动态</div>
              <button class="containerButton button2" @click="console.log(666)">
                查看以往动态
              </button>
            </div>
            <div class="blank_content_text" v-if="filter === 'mentions_all'">
              <div style="font-weight: 800; font-size: 20px">没有新的提及</div>
              <div class="blank_content_description">
                如有人在动态或评论标记您，通知将在此显示。
              </div>
            </div>
            -->
          </div>
        </n-card>
      </div>
      <div v-if="notificationsList.length !== 0">
        <div
          class="notification_list"
          v-for="notification in notificationsList"
          :key="notification.id"
        >
          <div
            class="notification_item"
            :class="{
              notice_idle: notification.type.endsWith('IDLE'),
              notice_agree:
                notification.type.endsWith('AGREED') ||
                notification.type.endsWith('ACCEPTED') ||
                notification.type.endsWith('SUCCEED'),
              notice_reject:
                notification.type.endsWith('REJECT') || notification.type.endsWith('DENIED'),
              notice_other:
                notification.type === notice_type.kick_notice ||
                notification.type === notice_type.aply_notice
            }"
            @click="clickNotification(notification)"
          >
            <div class="notification_left">
              <div class="notification_icon">
                <n-icon size="30">
                  <ExitOutline v-if="notification.type.startsWith('QUIT')" />
                  <EnterOutline v-else-if="notification.type.startsWith('INVT')" />
                  <DocumentTextOutline v-else-if="notification.type.startsWith('APLY')" />
                  <Repeat v-else-if="notification.type.startsWith('CHANGE')" />
                  <AlertSharp v-else-if="notification.type === notice_type.kick_notice" />
                </n-icon>
              </div>
              <div class="notification_text">
                {{ notification.texts }}
              </div>
            </div>
            <div class="notification_right">
              <div class="notification_time">{{ notification.date }} {{ notification.time }}</div>
              <div class="handle-notification-text">
                <span v-if="notification.type.endsWith('IDLE')" class="click-to-handle"
                  >点击处理</span
                >
                <span v-else-if="notification.type.endsWith('AGREED')" style="color: green"
                  >已同意</span
                >
                <span v-else-if="notification.type.endsWith('ACCEPTED')" style="color: green"
                  >已被同意</span
                >
                <span v-else-if="notification.type.endsWith('REJECT')" style="color: firebrick"
                  >已拒绝</span
                >
                <span v-else-if="notification.type.endsWith('DENIED')" style="color: firebrick"
                  >已被拒绝</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <n-modal
    v-model:show="model_clean_notifications_handled"
    preset="dialog"
    title="通知清理"
    content="是否清除所有已处理的通知?"
    positive-text="确认"
    negative-text="取消"
    @positive-click="notificationCleanup"
    @negative-click="model_clean_notifications_handled = false"
  />
  <n-modal
    v-model:show="model_invite_from_enterprise"
    preset="dialog"
    title="企业邀请处理"
    positive-text="接受"
    negative-text="拒绝"
    @positive-click="acceptInviteFromEnterprise"
    @negative-click="rejectInviteFromEnterprise"
  >
    <div class="notification-internal">
      <span>是否接受企业的邀请?</span>
      <n-button quaternary type="info" @click="goToEnterpriseHomepage"> 去该企业看看 </n-button>
    </div>
  </n-modal>
  <n-modal
    v-model:show="model_resign_from_user"
    preset="dialog"
    title="用户退出处理"
    positive-text="同意"
    negative-text="拒绝"
    @positive-click="resignAccept"
    @negative-click="resignReject"
  >
    <div class="notification-internal">
      <span>是否同意用户退出本企业?</span>
      <n-button quaternary type="info" @click="goToUserChat"> 和他聊聊 </n-button>
    </div>
  </n-modal>
  <n-modal
    v-model:show="model_change_from_user"
    preset="dialog"
    title="管理员转让处理"
    content="是否同意成为本公司管理员?"
    positive-text="同意"
    negative-text="拒绝"
    @positive-click="changeAccept"
    @negative-click="changeReject"
  />
</template>

<style scoped>
.listContainer {
  position: absolute;
  left: 30vw;
  width: 40vw;
  height: 50%;
}

.listCard {
  border-radius: 15px;
  border: 1px solid #d9d8d8;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}
.list-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.list-head-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

#notification-clear {
  cursor: pointer;
  transition: color 0.2s ease;
}
#notification-clear:hover {
  color: blue;
}

.containerButton {
  cursor: pointer;
  margin-right: 15px;
  border-radius: 30px;
  border: 0;
  min-width: 90px;
  height: 40px;
  font-size: medium;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected {
  background-color: cornflowerblue;
  color: white;
  transition: background-color 0.5s ease;
}
.selected:hover {
  background-color: #3074ef;
}
.notSelect {
  transition: background-color 0.5s ease;
}
.notSelect:hover {
  background-color: rgb(203, 201, 201);
}
.listSelect {
  display: flex;
}
.list {
}
.blank {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 15px;
  border: 1px solid #d9d8d8;
  background-color: white;
  padding: 0;
}
.card {
  width: 50%;
}
.blank_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.blank_content_text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.blank_content_description {
  color: grey;
  font-size: 17px;
  text-align: center;
}
.button2 {
  transition: background-color 0.5s ease;
  margin: 20px 0 0 0;
}
.button2:hover {
  background-color: rgb(203, 201, 201);
}

.notification_list {
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  border: 1px solid #d9d8d8;
}
.notification_item {
  padding: 0;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 115px;
  background-color: white;
  border-radius: 13px;
  transition: background-color 0.5s ease;
}

.notification_item:hover {
  background-color: #f5f4f4;
}

.notice_idle {
  background-color: rgb(223, 238, 253);
}
.notice_idle:hover {
  background-color: rgb(185, 213, 241);
}
.notice_reject {
  background-color: #ffe5e5;
}
.notice_reject:hover {
  background-color: #fcb9b9;
}
.notice_agree {
  background-color: #dffddf;
}
.notice_agree:hover {
  background-color: #aafcaa;
}
.notice_other {
  background-color: #fff0d3;
}
.notice_other:hover {
  background-color: #fbdfab;
}

.notification_left {
  margin-left: 1%;
  display: flex;
  justify-content: left;
  align-items: center;
  max-width: 79%;
}

.notification_icon {
  margin: 8px;
}

.notification_text {
  max-width: 100%;
}

.notification_right {
  margin-right: 3%;
  max-width: 17%;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.notification_time {
  color: #606060;
}

.handle-notification-text {
  font-weight: 800;
}

.click-to-handle {
  color: transparent;
  transition: color 0.3s linear;
}
.notification_item:hover .click-to-handle {
  color: black;
}

.notification-internal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
