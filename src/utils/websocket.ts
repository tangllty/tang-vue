import { useUserStoreHook } from '@/store/modules/user'
import type { Message } from '@/types'
import { MessageType } from '@/enums'

const userStore = useUserStoreHook()

// WebSocket 服务
class WebSocketService {

  // WebSocket 实例
  private socket: WebSocket | null
  // 消息类型与回调函数的映射
  public messages: { [key: string]: Function[] }
  // 心跳时间间隔，单位：毫秒
  private heartbeatInterval: number = 30 * 1000
  // 重连延迟时间，单位：毫秒
  private reconnectDelay: number = 5 * 1000

  // 构造函数
  constructor() {
    this.socket = null
    this.messages = {}
    this.startHeartbeat()
  }

  // 连接 WebSocket 服务
  connect(url: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket connection already open')
      return
    }

    this.socket = new WebSocket(url)
    this.socket.onopen = this.handleOpen.bind(this)
    this.socket.onmessage = this.handleMessage.bind(this)
    this.socket.onclose = this.handleClose.bind(this)
    this.socket.onerror = this.handleError.bind(this)
  }

  // 关闭 WebSocket 服务
  disconnect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close()
    }
  }

  // 连接建立时触发
  handleOpen(): void {
    this.reconnect()
    console.log('WebSocket connection opened')
  }

  // 接收到消息时触发
  handleMessage(event: MessageEvent): void {
    const message = JSON.parse(event.data) as Message
    const messageType = message.messageType

    if (this.messages[messageType]) {
      this.messages[messageType].forEach(callback => {
        callback(message.data)
      })
    }
  }

  // 连接关闭时触发
  handleClose(): void {
    this.reconnect()
    console.log('WebSocket connection closed')
  }

  // 连接出错时触发
  handleError(): void {
    console.error('WebSocket connection error')
  }

  // 开始心跳检测
  startHeartbeat(): void {
    setInterval(() => {
      this.sendHeartbeat()
    }, this.heartbeatInterval)
  }

  // 发送心跳消息
  sendHeartbeat(): void {
    const heartbeatMessage: Message = { messageType: MessageType.HEARTBEAT, data: 'heartbeat' }
    this.sendMessage(heartbeatMessage)
  }

  // 重连
  reconnect(): void {
    if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
      setTimeout((): void => {
        this.connect(import.meta.env.VITE_APP_WS_URL + userStore.user.userId)
      }, this.reconnectDelay)
    }
  }

  // 发送消息
  sendMessage(message: Message): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection not open')
      return
    }

    this.socket.send(JSON.stringify(message))
  }

  // 订阅特定类型消息
  subscribe(messageType: MessageType, callback: Function): void {
    if (!this.messages[messageType]) {
      this.messages[messageType] = []
    }

    this.messages[messageType].push(callback)
  }

  // 取消订阅特定类型消息
  unsubscribe(messageType: MessageType, callback: Function): void {
    if (this.messages[messageType]) {
      const index: number = this.messages[messageType].indexOf(callback)
      if (index !== -1) {
        this.messages[messageType].splice(index, 1)
      }
    }
  }

}

export default new WebSocketService()
