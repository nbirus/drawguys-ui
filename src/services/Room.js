import { socket } from '@/services/Socket'
import { userState } from '@/services/User'
import { reactive, ref } from 'vue'
import router from '@/router'
const LOG = true

export const rooms = ref([])
export const roomState = reactive({
	roomid: '',
	roomname: '',
	active: false,
	users: [],
	messages: [],
	user: {},
	userTurn: {},
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
	console.log(message);
}

// event handlers
function onUpdateRooms(newRooms) {
	// log('rooms-update')
	rooms.value = newRooms
}
function onUpdateRoom(newRoom) {
	Object.keys(roomState).forEach(key => {
		roomState[key] = newRoom[key]
	})

	// update current user
	roomState.user = newRoom.users[userState.userid]

	// if game has started, set player's turn
	if (roomState.active) {
		roomState.userTurn = newRoom.users[newRoom.turnUserid]
	}
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
