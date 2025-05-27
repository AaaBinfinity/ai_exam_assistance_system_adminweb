import { onBeforeUnmount } from 'vue'
import { getToken } from '@/utils/auth'

export function useWebSocket(onMessageCallback: (msg: string) => void) {
    const token = getToken() ?? ''
    console.log('🔑 Token:', token)

    const wsUrl = `ws://127.0.0.1:9001/ws/messages?token=Bearer ${encodeURIComponent(token)}`
    const socket = new WebSocket(wsUrl)
    console.log('🔑 Token:', wsUrl)
    socket.onopen = () => {
        console.log('✅ WebSocket 连接成功')
    }

    socket.onmessage = (event) => {
        const message = event.data
        console.log('📩 收到消息：', message)
        onMessageCallback(message)
    }

    socket.onerror = (err) => {
        console.error('❌ WebSocket 错误', err)
    }

    socket.onclose = () => {
        console.log('🔌 WebSocket 已关闭')
    }

    onBeforeUnmount(() => {
        socket.close()
    })

    return socket
}
