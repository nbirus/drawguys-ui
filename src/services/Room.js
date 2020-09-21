import { socket } from '@/services/Socket'
import { userState } from '@/services/User'
import { reactive, ref } from 'vue'
import router from '@/router'
const LOG = false

export const rooms = ref([])
export const roomState = reactive({
	roomid: '',
	active: false,
	loading: false,
	users: [],
})

// actions
export function createRoom(roomname) {
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


// event handlers
function onUpdateRooms(newRooms) {
	log('rooms-update')
	rooms.value = newRooms
}

// events
socket.on('update_rooms', onUpdateRooms)

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
