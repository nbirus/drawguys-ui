<template>
	<div class="game-over card">
		<timer
			v-if="roomState.timerActive"
			:value="roomState.timer"
			class="mb-7 delay-2"
		/>

		<game-scoreboard />

		<button class="custom striped mr-2" @click="toggleReady">
			Play again?
		</button>
		<button class="custom striped" @click="$router.push('/')">
			Leave
		</button>
	</div>
</template>

<script>
import { toggleReady, roomState } from '@/services/Room'
import GameScoreboard from './GameScoreboard'
import Timer from '@/components/Timer'
export default {
	name: 'game-over',
	components: {
		Timer,
		GameScoreboard,
	},
	setup() {
		return {
			toggleReady,
			roomState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.game-over.card {
	min-width: 300px;
	width: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 2rem;
}
</style>
