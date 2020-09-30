<template>
	<div class="board">
		<transition name="pop-up" appear>
			<div class="board__card card">
				<!-- timer -->
				<game-timer />

				<!-- overlay -->
				<!-- <game-overlay /> -->

				<!-- drawing -->
				<game-drawing />

				<!-- form -->
				<div class="board__footer">
					<transition name="pop-up" appear>
						<game-draw-form v-if="roomState.user.drawing" class="delay-2" />
						<game-form v-else class="delay-2" :color="roomState.user.color" />
					</transition>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import GameForm from '@/views/game/GameForm'
import GameTimer from '@/views/game/GameTimer'
import GameDrawing from '@/views/game/GameDrawing'
import GameDrawForm from '@/views/game/GameDrawForm'
import { roomState } from '@/services/Room'

export default {
	name: 'game-board',
	components: {
		GameForm,
		GameTimer,
		GameDrawing,
		GameDrawForm,
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
