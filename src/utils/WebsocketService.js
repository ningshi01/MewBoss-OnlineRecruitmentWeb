import { ref } from 'vue'
import { DomainName } from './enums.js'

class WebSocketService {
  constructor(onMessage, chat_room_id, user_id) {
    this.socket = null
    this.message = ref('')
    this.connect(onMessage, chat_room_id, user_id)
  }

  connect(onMessage, chat_room_id, user_id) {
    this.socket = new WebSocket(
      `ws://${DomainName.SERVER_NAME}/ws/chat?chat_room_id=${chat_room_id}&user_id=${user_id}`
    )

    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket connected')
      console.log(event)
    })

    this.socket.addEventListener('message', (event) => {
      onMessage(event.data) // 调用提供的 onMessage 回调函数
    })

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket closed')
      console.log(event)
      // 你可以在这里实现重新连接逻辑
    })
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message)
    }
  }

  statusOK() {
    return this.socket && this.socket.readyState === WebSocket.OPEN
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
  }
}

export default WebSocketService
