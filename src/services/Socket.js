import io from 'socket.io-client'
import { reactive } from 'vue'
import { initUser } from '@/services/User'
const LOG = true

export const socket = io.connect(process.env.VUE_APP_URL, {
	autoConnect: false,
})

export const socketState = reactive({
	loading: false,
	connected: false,
	error: false,
})

// actions
export function connect() {
	socketState.loading = true
	socket.connect()
}
export function disconnect() {
	socketState.connected = false
	if (socket) {
		socket.disconnect()
	}
}

// event handlers
function onConnect() {
	log('connceted')
	socketState.loading = false
	socketState.connected = true
	socketState.error = false

	// init current user info to server
	initUser()
}

function onConnectError() {
	log('conncetion_error')
	socketState.loading = false
	socketState.connected = false
	socketState.error = true
	disconnect()
}

function onDisconnect() {
	log('disconnect')
	socketState.loading = false
	socketState.connected = false
	socketState.error = false
}

// events
socket.on('connect', onConnect)
socket.on('connect_error', onConnectError)
socket.on('disconnect', onDisconnect)

// helpers
function log(event) {
	if (LOG) {
		console.log(`socket:${event}`)
	}
}
