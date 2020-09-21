import { socket } from '@/services/Socket'
import { reactive } from 'vue'
const LOG = true

// create state
export const userState = reactive({
	userid: sessionStorage.getItem('userid') || uid(),
	username: sessionStorage.getItem('username') || '',
	roomid: '',
	roomState: {},
})

// actions
export function initUser() {
	log('init-user', userState.userid)
	if (socket) {
		sessionStorage.setItem('userid', userState.userid)
		sessionStorage.setItem('username', userState.username)
		socket.emit('set_user', {
			userid: userState.userid,
			username: userState.username,
		})
	}
}
export function setUsername(username) {
	log('set-username', username)
	if (socket) {
		userState.username = username
		sessionStorage.setItem('username', username)
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
		.slice(11)
}
