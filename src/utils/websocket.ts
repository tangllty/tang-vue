// WebSocket 服务
class WebSocketService {

  // WebSocket 实例
  private socket: WebSocket | null
  // 消息类型与回调函数的映射
  public messages: { [key: string]: Function[] }

  // 构造函数
  constructor() {
    this.socket = null
    this.messages = {}
    this.connect(import.meta.env.VITE_APP_WS_URL)
  }

  // 连接 WebSocket 服务
  connect(url: string): void {
    this.socket = new WebSocket(url)
    this.socket.onopen = this.handleOpen.bind(this)
    this.socket.onmessage = this.handleMessage.bind(this)
    this.socket.onclose = this.handleClose.bind(this)
    this.socket.onerror = this.handleError.bind(this)
  }

  // 连接建立时触发
  handleOpen(): void {
    console.log('WebSocket connection opened')
  }

  // 接收到消息时触发
  handleMessage(event: MessageEvent): void {
    const message = JSON.parse(event.data)
    const messageType = message.type

    if (this.messages[messageType]) {
      this.messages[messageType].forEach(callback => {
        callback(message)
      })
    }
  }

  // 连接关闭时触发
  handleClose(): void {
    console.log('WebSocket connection closed')
  }

  // 连接出错时触发
  handleError(): void {
    console.error('WebSocket connection error')
  }

  // 发送消息
  sendMessage(message: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection not open')
      return
    }

    this.socket.send(JSON.stringify(message))
  }

  // 订阅特定类型消息
  subscribe(messageType: string, callback: Function): void {
    if (!this.messages[messageType]) {
      this.messages[messageType] = []
    }

    this.messages[messageType].push(callback)
  }

  // 取消订阅特定类型消息
  unsubscribe(messageType: string, callback: Function): void {
    if (this.messages[messageType]) {
      const index: number = this.messages[messageType].indexOf(callback)
      if (index !== -1) {
        this.messages[messageType].splice(index, 1)
      }
    }
  }

}

export default new WebSocketService()
