<template>
	<div class="page game">
		<!-- game over -->
		<game-over v-if="roomState.gameState.event === 'game_end'" />
		<game-scoreboard v-if="roomState.gameState.event === 'round_end'" />

		<div v-else class="game__container">
			<div class="game__rounds"></div>

			<!-- users -->
			<game-users class="game__users" @share="showModalOpen = true" />

			<!-- board -->
			<game-board class="game__board" />
		</div>

		<!-- share modal -->
		<room-share-modal v-model:open="showModalOpen" />

		<div class="game__username-link">
			<router-link to="/">Leave Game</router-link>
			<span
				class="ml-3"
				v-text="
					`Round ${roomState.gameState.round}/${roomState.gameState.numberOfRounds}`
				"
			></span>
		</div>
	</div>
</template>

<script>
import GameUsers from '@/views/game/GameUsers'
import GameBoard from '@/views/game/GameBoard'
import GameScoreboard from '@/views/game/GameScoreboard'
import GameOver from '@/views/game/GameOver'
import RoomShareModal from '@/views/room/RoomShareModal'
import { testRoomState, roomState } from '@/services/Room'
import { onMounted, watch, ref } from 'vue'
import router from '@/router'

export default {
	name: 'game-page',
	components: {
		GameUsers,
		GameBoard,
		GameScoreboard,
		GameOver,
		RoomShareModal,
	},
	setup() {
		let showModalOpen = ref(false)
		let currentRoute = router.currentRoute.value
		let roomid = currentRoute.params.id

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
			showModalOpen,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.game {
	display: flex;
	align-items: center;
	padding: 0;

	&__rounds {
		position: fixed;
		top: 2rem;
		right: 2rem;
		font-size: 1.1rem;
	}
	&__container {
		display: flex;
		min-width: 1064px;
		margin: auto;
		padding: 0 2rem;
	}
	&__users {
		flex: 0 0 230px;
		padding-top: 2rem;
		margin-right: 2rem;
		z-index: 1;
	}
	&__board {
		flex: 0 1 100%;
		width: 750px;
	}
	&__username-link {
		position: fixed;
		bottom: 1.25rem;
		left: 1.25rem;
		font-size: 1.1rem;
	}
}
</style>
