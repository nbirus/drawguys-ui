import { socket } from '@/services/Socket'
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
})

function onUpdateGame(newGameState) {
	console.log('HERE')
	Object.keys(gameState).forEach(key => {
		gameState[key] = newGameState[key]
	})
}

// events
socket.on('update_game_state', onUpdateGame)
