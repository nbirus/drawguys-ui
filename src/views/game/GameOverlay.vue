<template>
	<div class="game-overlay">
		<h1>
			{{ roomState.gameState.event }}
		</h1>
	</div>
</template>

<script>
import { roomState } from '@/services/Room'
export default {
	name: 'game-overlay',
	setup() {
		return {
			roomState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.game-overlay {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
