import { socket } from '@/services/Socket'
import { userState } from '@/services/User'
import { reactive, ref } from 'vue'
import router from '@/router'
const LOG = true

export const rooms = ref([])
export const roomState = reactive({
	roomid: '',
	roomname: '',
	timer: 3,
	timerActive: false,
	messages: [],
	gameState: {
		timer: 0,
		turnIndex: 1,
		turnUser: {},
		round: 1,
		roundWord: '',
		numberOfRounds: 5,
		numberOfTurns: 4,
		roundTimer: 10,
		drawing: true,
	},
	usersState: {},
	userState: {},
})

// actions
export function getRooms() {
	socket.emit('get_rooms')
}
export function createRoom(roomname) {
	log('create-room')
	if (socket) {
		let roomid = uid()
		roomState.loading = true
		socket.emit('create_room', {
			roomid,
			roomname,
		})
		sessionStorage.setItem('roomid', roomid)
		userState.roomid = roomid
		router.push(`/${roomid}`)
	}
}
export function joinRoom(roomid) {
	log('join-room')
	if (socket && roomid) {
		socket.emit('join_room', roomid)
		sessionStorage.setItem('roomid', roomid)
		userState.roomid = roomid
	}
}
export function leaveRoom() {
	log('leave-room')
	if (socket && userState.roomid) {
		socket.emit('leave_room', userState.roomid)
		userState.roomid = ''
	}
}
export function toggleReady() {
	log('toggle-ready')
	if (socket && userState.roomid) {
		socket.emit('toggle_ready', userState.userid)
	}
}
export function sendMessage(message) {
	log('message')
	if (socket && userState.roomid) {
		socket.emit('message', message)
	}
}
export function setColor(color) {
	log('setColor')
	if (socket && userState.roomid) {
		socket.emit('color', color)
	}
}
export function setTyping(typing) {
	if (socket && userState.roomid && roomState.userState.typing !== typing) {
		socket.emit('typing', typing)
	}
}

// event handlers
function onUpdateRooms(newRooms) {
	rooms.value = newRooms
}
function onUpdateRoom(newRoom) {
	Object.keys(roomState).forEach(key => {
		roomState[key] = newRoom[key]
	})
	console.log(newRoom.gameState)
	// update current user
	roomState.userState = newRoom.usersState[userState.userid]
}
function onJoinRoom(roomid) {
	log('room-join')
	userState.roomid = roomid
}
function onJoinRoomError() {
	log('room-join-error')
	userState.roomid = ''
	router.push('/')
}

// events
socket.on('update_rooms', onUpdateRooms)
socket.on('update_room', onUpdateRoom)
socket.on('join_room_error', onJoinRoomError)
socket.on('join_room', onJoinRoom)

// helpers
function log(event) {
	if (LOG) {
		console.log(`room:${event}`)
	}
}
function uid() {
	return Math.random()
		.toString(16)
		.slice(11)
}

////////////////////////////////////////////////

const roomStateTest = {
	roomid: 'roomid',
	roomname: 'Room Name',
	active: true,
	countdownActive: false,
	countdown: 3,
	users: [
		{
			userid: 'user1',
			username: 'Username one',
			color: 'blue',
			drawing: true,
			score: 500,
		},
		{
			userid: 'user2',
			username: 'Username two',
			color: 'red',
			score: 650,
		},
	],
	messages: [],
	user: {
		userid: 'user1',
		username: 'Username one',
		color: 'blue',
		drawing: true,
	},
	userTurn: {
		userid: 'user1',
		username: 'Username one',
		color: 'blue',
	},
}

export function testRoomState() {
	Object.keys(roomState).forEach(key => {
		roomState[key] = roomStateTest[key]
	})
}
