<template>
	<div class="board">
		<div class="board__card card">
			<!-- timer -->
			<!-- <game-timer /> -->

			<!-- overlay -->
			<!-- <game-overlay /> -->

			<!-- drawing -->
			<!-- <game-drawing /> -->

			<!-- form -->
			<div class="board__footer">
				<game-form :color="roomState.user.color" />
			</div>
		</div>
	</div>
</template>

<script>
import GameForm from '@/views/game/GameForm'
import { roomState } from '@/services/Room'

export default {
	name: 'game-board',
	components: {
		GameForm,
	},
	setup() {
		return {
			roomState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.board {
	width: 100%;
	height: 100%;

	&__card {
		width: 100%;
		height: 500px;
		position: relative;
	}
	&__footer {
		position: absolute;
		bottom: -3rem;
		width: 100%;
		display: flex;
		justify-content: center;
	}
}
</style>
