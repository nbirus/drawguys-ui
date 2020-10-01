import { socket } from '@/services/Socket'
import { userState } from '@/services/User'
import { reactive } from 'vue'

export const gameState = reactive({
	timer: 0,
	turnIndex: 1,
	turnUser: {},
	round: 1,
	roundWord: '',
	numberOfRounds: 5,
	numberOfTurns: 4,
	roundTimer: 10,
	drawing: true,
})

function onUpdateGame(newGameState) {
	Object.keys(gameState).forEach(key => {
		gameState[key] = newGameState[key]
	})

	gameState.drawing = gameState.turnUser.userid = userState.userid
}

// events
socket.on('update_game_state', onUpdateGame)
