<template>
	<div>
		<timer
			v-if="showTimer"
			class="timer"
			:value="roomState.gameState.timer"
			:key="roomState.gameState.event"
			:color="warning ? 'yellow' : roomState.gameState.turnUser.color"
		/>
		<!-- <div class="bar-conatainer">
			<div
				class="bar"
				:class="`bg-${roomState.gameState.turnUser.color} bg-striped`"
			></div>
		</div> -->
	</div>
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
		let warning = computed(
			() =>
				roomState.gameState.timer <= 3 &&
				roomState.gameState.event === 'turn_start'
		)

		return {
			roomState,
			showTimer,
			warning,
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
	z-index: 2;
	box-shadow: $box-shadow;
}
.bar-container {
	position: absolute;
	top: 0px;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
}
.bar {
	position: relative;
	height: 4px;
	width: 790px;
	z-index: 1;
	border-radius: 25px;
	margin: 0 auto;

	animation: bar 10s linear;
}

@keyframes bar {
	0% {
		width: 0px;
	}
	100% {
		width: 790px;
	}
}
</style>
