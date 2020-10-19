<template>
	<div
		id="canvasDiv"
		class="drawing"
		:class="[
			`size-${disabled ? '-1' : drawState.size}`,
			{ disabled, match, fail },
		]"
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
		let match = computed(() => {
			if (roomState.userState.drawing) {
				return (
					roomState.gameState.event === 'turn_end' &&
					roomState.gameState.playersGuessed > 0
				)
			} else {
				return roomState.userState.match
			}
		})

		let fail = computed(() => {
			if (roomState.userState.drawing) {
				return (
					roomState.gameState.event === 'turn_end' &&
					roomState.gameState.playersGuessed === 0
				)
			} else {
				return (
					roomState.gameState.event === 'turn_end' && !roomState.userState.match
				)
			}
		})

		watch(
			() => roomState.gameState.event,
			() => {
				setTimeout(() => {
					if (roomState.gameState.event !== 'turn_end') {
						reset()
						resetState()
					}
				}, 100)
			}
		)

		return {
			match,
			drawState,
			fail,
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
	pointer-events: none;

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
		pointer-events: auto;
	}
	&.match:after {
		box-shadow: inset 0 0 0 4px $green;
	}
	&.fail:after {
		box-shadow: inset 0 0 0 4px $red;
	}

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
