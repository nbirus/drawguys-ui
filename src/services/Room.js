import { socket } from '@/services/Socket'
import { userState } from '@/services/User'
import { reactive, ref, watch } from 'vue'
import words from '@/assets/words'
import colors from '@/assets/colors'
import router from '@/router'
const LOG = true

export const rooms = ref([])
export let roomState = reactive({
	roomid: '',
	roomname: '',
	timer: 3,
	timerActive: false,
	messages: [],
	gameState: {
		event: 'pre_turn',
		active: false,
		timer: 0,
		turnUser: {},
		round: 1,
		word: '',
		words: [],
		usedWords: [],
		numberOfRounds: 5,
		playersGuessed: 0,
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
export function setWordDefault(word) {
	if (socket && userState.roomid) {
		socket.emit('word_default', word)
	}
}
export function getWords() {
	roomState.gameState.words = []
	for(let i = 0; i < 3; i++) {
		roomState.gameState.words.push(getWord())
	}
}
function getWord() {
	let wordFound = false
	let word = ''
	while(!wordFound) {
		word = words[randomNumber()]
		wordFound = !roomState.gameState.usedWords.includes(word)
	}
	return word
}
function randomNumber() {  
    let min = Math.ceil(0); 
    let max = Math.floor(words.length); 
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

// event handlers
function onUpdateRooms(newRooms) {
	rooms.value = newRooms
}
function onUpdateRoom(newRoom, test = false) {
	Object.keys(roomState).forEach(key => {
		if (key) {
			if (key === 'gameState') {
				roomState.gameState = merge(roomState.gameState, newRoom.gameState)
			}
			else {
				roomState[key] = newRoom[key]
			}

		}
	})

	// update current user
	roomState.userState = roomState.usersState[test ? 'one' : userState.userid]
	roomState.gameState.playersGuessed = Object.values(newRoom.usersState).filter(u => u.match).length
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


// watchers
watch(() => roomState.gameState.event, event => {
	if (roomState.userState.selecting && event === 'pre_turn') {
		getWords()
	}
	if (roomState.userState.selecting && event === 'turn_pre_start' && roomState.gameState.word === '') {
		setWordDefault(roomState.gameState.words[0])
	}
})

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

function merge(obj1, obj2) {
	Object.keys(obj2).forEach(key => {
		if (key !== undefined) {
			obj1[key] = obj2[key]
		}
	})

	return obj1
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
    event: 'pre_turn',
    word: 'Test Word',
    timer: 15,
    gameTimer: null,
		usedWords: [],
    turnUser: {
			userid: 'two',
			username: 'Username Two',
			guess: '',
			ready: false,
			match: false,
			typing: false,
			drawing: false,
			selecting: true,
			color: 'orange',
			matchTime: 0,
			turnScore: 50,
			roundScore: 0,
			score: 100,
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
			turnScore: 50,
			roundScore: 0,
			score:  0,
		},
		two: {
			userid: 'two',
			username: 'Username Two',
			guess: '',
			ready: false,
			match: false,
			typing: false,
			drawing: false,
			selecting: true,
			color: 'orange',
			matchTime: 0,
			turnScore: 50,
			roundScore: 0,
			score: 100,
		},
		three: {
			userid: 'three',
			username: 'Username Three',
			guess: '',
			ready: false,
			match: true,
			typing: false,
			drawing: false,
			selecting: false,
			color: 'purple',
			matchTime: 12,
			turnScore: 0,
			roundScore: 0,
			score: 50,
		},
	},
}

export function testRoomState() {

	start()

	getWords()


	setInterval(() => {
		start()
	}, 30000);

	function start() {

		onUpdateRoom(JSON.parse(JSON.stringify(roomStateTest)), true)

		// setInterval(() => {
		// 	roomState.usersState.one.guess += '1'
		// }, 5000)
		// setTimeout(() => {
		// 	roomState.gameState.event = 'turn_pre_start'
		// }, 2000)
		setTimeout(() => {
			roomState.usersState.two.drawing = true
			roomState.usersState.two.selecting = false
			roomState.gameState.event = 'turn_start'
		}, 100)
		setTimeout(() => {
			roomState.usersState.one.match = true
			roomState.usersState.one.matchTime = 12
			roomState.gameState.playersGuessed = 1
		}, 2000)
		// setTimeout(() => {
		// 	roomState.gameState.event = 'turn_end'
		// }, 31000)

	}
}

export function setInactive() {
	roomState.gameState.active = false
}
