import io from 'socket.io-client'

const url = process.env.VUE_APP_SOCKET_URL || 'http://localhost:4001'
const config = { transports: ['websocket', 'polling'] }

/**
 * Make socket connections here
 *
 */

export const root = io(`${url}/`, config)

export default {
  root
}
