<template>
	<timer
		v-if="showTimer"
		class="timer"
		:value="roomState.gameState.timer"
		:key="roomState.gameState.event"
		:color="roomState.gameState.turnUser.color"
	/>
</template>

<script>
import { roomState } from '@/services/Room'
import Timer from '@/components/Timer'
import { computed } from 'vue'
export default {
	name: 'game-timer',
	components: { Timer },
	setup() {
		let showTimer = computed(
			() =>
				roomState.gameState.event === 'turn_start' ||
				(roomState.gameState.event === 'pre_turn' &&
					roomState.userState.selecting)
		)
		return {
			roomState,
			showTimer,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.timer {
	width: auto;
	display: flex;
	justify-content: center;
	top: -3rem;
	position: absolute;
	left: calc(50% - 48px);
}
</style>
