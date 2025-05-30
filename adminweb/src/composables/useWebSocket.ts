import { onBeforeUnmount } from 'vue'
import { getToken } from '@/utils/auth'

export function useWebSocket(onMessageCallback: (msg: string) => void) {
    const token = getToken() ?? '';
    const baseUrl = import.meta.env.VITE_WS_BASE_URL;

    const wsUrl = `${baseUrl}/ws/messages?token=Bearer%20${encodeURIComponent(token)}`;
    const socket = new WebSocket(wsUrl)
    socket.onopen = () => {
    }

    socket.onmessage = (event) => {
        const message = event.data
        onMessageCallback(message)
    }

    socket.onerror = (err) => {
    }

    socket.onclose = () => {
    }

    onBeforeUnmount(() => {
        socket.close()
    })

    return socket
}
