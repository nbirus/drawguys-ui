<template>
	<div class="page game">
		<game-over
			class="game__container"
			v-if="roomState.gameState.event === 'game_end'"
		/>

		<div class="game__container" v-else>
			<div class="game__rounds">
				<span>{{
					`Round ${roomState.gameState.round}/${roomState.gameState.numberOfRounds}`
				}}</span>
			</div>

			<!-- users -->
			<game-users class="game__users" />

			<!-- board -->
			<game-board class="game__board" />
		</div>
	</div>
</template>

<script>
import GameUsers from '@/views/game/GameUsers'
import GameBoard from '@/views/game/GameBoard'
import GameOver from '@/views/game/GameOver'
import { testRoomState, roomState } from '@/services/Room'
import router from '@/router'
import { onMounted } from 'vue'

export default {
	name: 'game-page',
	components: {
		GameUsers,
		GameBoard,
		GameOver,
	},
	setup() {
		if (router.currentRoute.value.name === 'game-test') {
			testRoomState()
		}

		onMounted(() => {
			if (!roomState.gameState.active) {
				router.push('/')
			}
		})

		return {
			roomState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.game {
	display: flex;
	align-items: center;
	justify-content: center;

	&__rounds {
		position: fixed;
		top: 2rem;
		right: 2rem;
	}
	&__container {
		width: 1000px;
		display: flex;
	}
	&__users {
		flex: 0 0 235px;
		padding-top: 2rem;
	}
	&__board {
		flex: 0 1 100%;
		margin-left: 2rem;
	}
}
</style>
