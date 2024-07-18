<script setup>
import { register } from 'vue-advanced-chat'
import { chatCreate, chatDelete, chatHistoryGet, chatRoomGet } from '@/api/apiList.js'
import chat_avatar from '@/assets/chat.svg'
import WebsocketService from '@/utils/WebsocketService'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { checkLogin, getToken } from '@/utils/token.js'
import Link from '@/components/forNotifications/LinkDisplay.vue'

register()
onMounted(async () => {
  temp_user_id.value = parseInt(getToken('id'))
  if (!checkLogin()) {
    message.warning('请先登录！')
    await router.push({ name: 'login' })
    return
  }
  if (typeof route.query.userid !== 'undefined') {
    is_selected_room.value = true
    await chatCreate({ id: route.query.userid })
      .then((res) => {
        current_roomId.value = res.data.id
      })
      .catch((err) => {
        console.log(err)
      })
  }
  fetchRooms()
})

onBeforeRouteLeave(() => {
  if (websocket_service.value) {
    websocket_service.value.close()
  }
})
let route = useRoute()
let router = useRouter()
let temp_user_id = ref(0)
let websocket_service = ref(null)
let rooms = ref([])
let message = useMessage()
function fetchRooms() {
  chatRoomGet()
    .then((res) => {
      if (is_selected_room.value) {
        let room = res.data.find((room) => room.id === current_roomId.value)
        // 移除这个对象
        let index = res.data.indexOf(room)
        if (index > -1) {
          res.data.splice(index, 1)
        }
        res.data.unshift(room)
        is_selected_room.value = false
      }
      let temp_rooms = []
      if (res.data.length !== 0) {
        res.data.forEach((room) => {
          temp_rooms.push({
            roomId: room.id.toString(),
            roomName: `${room.users[0].username}与${room.users[1].username}的对话`,
            avatar: chat_avatar,
            users: []
          })
        })
      }
      rooms.value = temp_rooms.reverse()
      temp_rooms = []
    })
    .catch((err) => {
      console.log(err)
    })
}
let messages = ref([])
let messagesLoaded = ref(false)
let current_roomId = ref()
let is_selected_room = ref(false)

let menuActions = ref([
  { name: 'changeTheme', title: '切换主题' },
  { name: 'deleteChat', title: '删除聊天' }
])
let chatBoxTheme = ref('light')

function connectWebSocket() {
  websocket_service.value = new WebsocketService(
    (message) => {
      const jsonData = JSON.parse(message)
      messages.value = [...messages.value, messageSerializer(jsonData.data)]
    },
    current_roomId.value,
    temp_user_id.value
  )
}
function fetchMessages({ room }) {
  current_roomId.value = room.roomId
  if (websocket_service.value) {
    websocket_service.value.close()
  }
  connectWebSocket()
  messages.value = []
  messagesLoaded.value = false
  let temp_messages = []
  chatHistoryGet({ id: room.roomId })
    .then((res) => {
      if (res.data.length !== 0) {
        res.data.forEach((mes) => {
          let { date, timestamp } = formatTimestamp(mes.timestamp)
          temp_messages.push({
            _id: mes.id,
            content: mes.content,
            senderId: mes.sender.id.toString(),
            username: mes.sender.username,
            date: date,
            timestamp: timestamp
          })
        })
      }
      messages.value = temp_messages
      messagesLoaded.value = true
      temp_messages = []
    })
    .catch((err) => {
      console.log(err)
    })
}

async function sendMessage(temp_message) {
  if (websocket_service.value.statusOK()) {
    websocket_service.value.sendMessage(JSON.stringify({ content: temp_message.content }))
  } else {
    message.warning('消息发送失败，请刷新页面并重试！')
  }
}

async function menuActionHandler({ roomId, action }) {
  console.log(roomId)
  switch (action.name) {
    case 'changeTheme':
      chatBoxTheme.value = chatBoxTheme.value === 'light' ? 'dark' : 'light'
      break
    case 'deleteChat':
      is_selected_room.value = false
      await router.push('chat')
      deleteRoom(roomId)
      messages.value = []
      break
  }
}

function deleteRoom(roomId) {
  chatDelete({ id: roomId })
    .then((res) => {
      console.log(res)
      if (websocket_service.value.statusOK()) {
        websocket_service.value.close()
      }
      fetchRooms()
    })
    .catch((err) => {
      console.log(err)
    })
}
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
    timestamp: `${hours}:${minutes}`
  }
}

function messageSerializer(msg) {
  let { date, timestamp } = formatTimestamp(msg.timestamp)
  return {
    _id: msg.id,
    content: msg.content,
    senderId: String(msg.sender.id),
    username: msg.sender.username,
    date: date,
    timestamp: timestamp
  }
}
</script>

<template>
  <div class="viewContainer">
    <div class="chatContainer">
      <vue-advanced-chat
        height="85vh"
        :current-user-id="temp_user_id"
        :rooms="JSON.stringify(rooms)"
        :rooms-loaded="true"
        :messages="JSON.stringify(messages)"
        :messages-loaded="messagesLoaded"
        :show-add-room="false"
        :theme="chatBoxTheme"
        :menu-actions="JSON.stringify(menuActions)"
        :show-audio="false"
        :load-first-room="is_selected_room"
        @send-message="sendMessage($event.detail[0])"
        @fetch-messages="fetchMessages($event.detail[0])"
        @menu-action-handler="menuActionHandler($event.detail[0])"
        style="border-radius: 30px"
      >
        <div slot="rooms-header">
          <div>
            <div class="room-header">消息</div>
          </div>
        </div>
        <div slot="rooms-empty">
          <div class="room-empty">暂无消息</div>
        </div>
        <div slot="messages-empty">
          <div class="room-empty">暂无消息</div>
        </div>
        <div slot="no-room-selected">
          <div class="room-empty">选择一个房间开始聊天</div>
        </div>
        <div slot="paperclip-icon"></div>
      </vue-advanced-chat>
    </div>
    <Link />
  </div>
</template>

<style scoped>
.viewContainer {
  position: relative;
  width: 100%;
}

.chatContainer {
  position: absolute;
  top: 8vh;
  margin-left: 15vw;
  width: 55vw;
}

.room-header {
  font-size: 18px;
  font-weight: 800;
  margin-left: 2vh;
  margin-top: 1vh;
}

.room-empty {
  display: flex;
  justify-content: center;
  padding-top: 30%;
  font-weight: 800;
}
</style>
