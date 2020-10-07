<template>
	<div id="canvasDiv" class="drawing" :class="`size-${drawState.size}`"></div>
</template>

<script>
import Drawing, { drawState } from '@/services/Drawing'
export default {
	name: 'drawing',
	mounted() {
		Drawing()
	},
	setup() {
		return {
			drawState,
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

	&.size-3 {
		cursor: url('../../../public/cursors/3.png') 3 3, auto;
	}
	&.size-10 {
		cursor: url('../../../public/cursors/10.png') 5 5, auto;
	}
	&.size-25 {
		cursor: url('../../../public/cursors/25.png') 12 12, auto;
	}
	&.size-50 {
		cursor: url('../../../public/cursors/50.png') 25 25, auto;
	}
}
</style>
