<template>
	<div class="page game">
		<div class="game__container">
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
import { testRoomState } from '@/services/Room'
import router from '@/router'

export default {
	name: 'game-page',
	components: {
		GameUsers,
		GameBoard,
	},
	setup() {
		if (router.currentRoute.value.name === 'game-test') {
			testRoomState()
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
