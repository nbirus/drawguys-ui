<template>
	<timer
		class="timer"
		:value="roomState.gameState.timer"
		:key="roomState.gameState.event"
		:color="roomState.gameState.turnUser.color"
	/>
</template>

<script>
import { roomState } from '@/services/Room'
import Timer from '@/components/Timer'
export default {
	name: 'game-timer',
	components: { Timer },
	setup() {
		return {
			roomState,
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
