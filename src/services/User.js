import { socket } from '@/services/Socket'
import { reactive } from 'vue'
const LOG = true

// create state
export const userState = reactive({
	userid: sessionStorage.getItem('userid') || uid(),
	username: sessionStorage.getItem('username') || '',
	roomid: sessionStorage.getItem('roomid') || '',
	roomState: {},
})

// actions
export function initUser() {
	log('init-user', userState)
	sessionStorage.setItem('userid', userState.userid)
	sessionStorage.setItem('username', userState.username)

	if (socket) {
		socket.emit('set_user', {
			userid: userState.userid,
			username: userState.username,
		})
	}
}
export function setUsername(username) {
	log('set-username', username)

	// set info
	userState.username = username
	sessionStorage.setItem('username', username)

	if (socket) {
		socket.emit('set_user', {
			userid: userState.userid,
			username,
		})
	}
}

// helpers
function log(event, param) {
	if (LOG) {
		console.log(`user:${event}`, param)
	}
}
function uid() {
	return Math.random()
		.toString(16)
		.slice(10)
}
