<template>
	<div class="game-over card">
		<timer
			v-if="roomState.timerActive"
			:value="roomState.timer"
			class="mb-7 delay-2"
		/>

		<button class="custom striped" @click="toggleReady">
			Play again?
		</button>
	</div>
</template>

<script>
import { toggleReady, roomState } from '@/services/Room'
import Timer from '@/components/Timer'
export default {
	name: 'game-over',
	components: {
		Timer,
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

.game-over {
	width: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
}
</style>
