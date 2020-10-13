<template>
	<div
		id="canvasDiv"
		class="drawing"
		:class="[`size-${drawState.size}`, { disabled }]"
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
	border-radius: $border-radius;
	height: 100%;
	width: 100%;

	&.disabled {
		pointer-events: none;
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
