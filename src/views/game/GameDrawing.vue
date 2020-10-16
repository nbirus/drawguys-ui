<template>
	<div
		id="canvasDiv"
		class="drawing"
		:class="[`size-${drawState.size}`, { disabled, match, warning }]"
	></div>
</template>

<script>
import Drawing, { drawState, reset, resetState } from '@/services/Drawing'
import { roomState } from '@/services/Room'
import { computed, watch } from 'vue'
export default {
	name: 'drawing',
	mounted() {
		Drawing()
	},
	setup() {
		let match = computed(
			() =>
				(roomState.userState.match &&
					roomState.gameState.event === 'turn_start') ||
				(roomState.userState.drawing &&
					roomState.gameState.event === 'turn_end' &&
					roomState.gameState.playersGuessed > 0)
		)
		let warning = computed(
			() =>
				roomState.gameState.timer <= 3 &&
				roomState.gameState.event === 'turn_start'
		)

		watch(
			() => roomState.gameState.event,
			() => {
				setTimeout(() => {
					reset()
					resetState()
				}, 100)
			}
		)
		return {
			match,
			warning,

			drawState,
			disabled: computed(
				() =>
					!roomState.userState.drawing ||
					roomState.gameState.event !== 'turn_start'
			),
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.drawing {
	height: 100%;
	width: 100%;

	&:after {
		content: '';
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		border-radius: $border-radius;
		transition: box-shadow 0.2s ease;
	}
	&.disabled {
		pointer-events: none;
	}
	&.match:after {
		box-shadow: inset 0 0 0 4px $green;
	}
	&.failed:after {
		box-shadow: inset 0 0 0 4px $red;
	}
	// &.warning:after {
	// 	box-shadow: inset 0 0 0 4px $yellow;
	// }

	&.size-0 {
		cursor: url('../../../public/cursors/0.png') 3 3, auto;
	}
	&.size-1 {
		cursor: url('../../../public/cursors/1.png') 5 5, auto;
	}
	&.size-2 {
		cursor: url('../../../public/cursors/2.png') 12 12, auto;
	}
	&.size-3 {
		cursor: url('../../../public/cursors/3.png') 25 25, auto;
	}
}
</style>
