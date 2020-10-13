import { socket } from '@/services/Socket'
import { userState } from '@/services/User'
import { reactive, ref } from 'vue'
import words from '@/assets/words'
import colors from '@/assets/colors'
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
		event: 'round_start',
		active: false,
		timer: 0,
		turnUser: {},
		roundWord: '',
		round: 1,
		numberOfRounds: 5,
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
export function roomGuess(guess) {
	log('guess')
	if (socket && userState.roomid) {
		socket.emit('guess', guess)
	}
}
export function nextColor() {
	log('nextColor')
	if (socket && userState.roomid) {
		let user = roomState.usersState[userState.userid]
		let activeColorIndex = colors.findIndex(c => c === user.color)
		let newColor = true
		let newColorIndex = activeColorIndex

		while (newColor) {
			newColorIndex++
			if (newColorIndex === colors.length) {
				newColorIndex = 0
			}
			if (!colorTaken(newColorIndex)) {
				newColor = false
			}
		}

		socket.emit('color', colors[newColorIndex])
	}
}
export function setTyping(typing) {
	if (socket && userState.roomid && roomState.userState.typing !== typing) {
		socket.emit('typing', typing)
	}
}
export function setWord(word) {
	if (socket && userState.roomid) {
		socket.emit('word', word)
	}
}
export function getWords() {

	const shuffled = words.sort(() => 0.5 - Math.random())
	return shuffled.slice(0, 3);
}

// event handlers
function onUpdateRooms(newRooms) {
	rooms.value = newRooms
}
function onUpdateRoom(newRoom, test = false) {
	Object.keys(roomState).forEach(key => {
		roomState[key] = newRoom[key]
	})
	// update current user
	roomState.userState = newRoom.usersState[test ? 'one' : userState.userid]
}
function onJoinRoom(roomid) {
	log('room-join')
	userState.roomid = roomid
}
function onJoinRoomError() {
	log('room-join-error')
	userState.roomid = ''
	setTimeout(() => {
		router.push('/')
	}, 100)
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
function colorTaken(colorIndex) {
	let users = roomState.usersState
	let takenIndexes = Object.values(users).map(user =>
		colors.findIndex(c => c === user.color)
	)
	return takenIndexes.includes(colorIndex)
}

////////////////////////////////////////////////

const roomStateTest = {
	roomid: 'roomid',
	roomname: 'Room Name',
  timer: 3,
  timerActive: false,
  messages: [],
  gameState: {
    active: true,
    event: 'turn_start',
    word: 'Test',
    timer: 10,
    gameTimer: null,
    turnUser: {
			userid: 'one',
			username: 'Username One',
			guess: '',
			ready: false,
			match: false,
			typing: false,
			drawing: true,
			selecting: false,
			color: 'blue',
			matchTime: 0,
			turnScore: 0,
			roundScore: 0,
			score: 0,
		},
    roundWord: '',
    round: 2,
    numberOfRounds: 5,
  },
  usersState: {
		one: {
			userid: 'one',
			username: 'Username One',
			guess: '',
			ready: false,
			match: false,
			typing: false,
			drawing: false,
			selecting: false,
			color: 'blue',
			matchTime: 0,
			turnScore: -20,
			roundScore: 0,
			score: 0,
		},
		two: {
			userid: 'two',
			username: 'Username Two',
			guess: '',
			ready: false,
			match: false,
			typing: false,
			drawing: true,
			selecting: false,
			color: 'orange',
			matchTime: 0,
			turnScore: 0,
			roundScore: 0,
			score: 0,
		},
	},
}

export function testRoomState() {
	onUpdateRoom(roomStateTest, true)

	// actions
	setTimeout(() => {
		roomState.gameState.event = 'turn_end'
	}, 1000)
}

export function setInactive() {
	roomState.gameState.active = false
}
