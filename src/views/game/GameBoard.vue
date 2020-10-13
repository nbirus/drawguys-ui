<template>
	<div class="board">
		<div
			class="board__word"
			v-if="
				roomState.userState.drawing &&
					roomState.gameState.event === 'turn_start'
			"
		>
			You are drawing <b v-text="roomState.gameState.word"></b>
		</div>

		<transition name="pop-up" appear>
			<div class="board__card card">
				<!-- timer -->
				<game-timer />

				<!-- overlay -->
				<game-overlay />

				<!-- drawing -->
				<game-drawing />

				<!-- form -->
				<div
					class="board__footer"
					v-if="roomState.gameState.event === 'turn_start'"
				>
					<transition name="pop-up" appear>
						<game-draw-form
							v-if="roomState.userState.drawing"
							class="delay-2"
						/>
						<game-form
							v-else
							class="delay-2"
							:color="roomState.userState.color"
						/>
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
import GameOverlay from '@/views/game/GameOverlay'
import { roomState } from '@/services/Room'

export default {
	name: 'game-board',
	components: {
		GameForm,
		GameTimer,
		GameDrawing,
		GameDrawForm,
		GameOverlay,
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
	position: relative;

	&__card {
		width: 100%;
		position: relative;
	}
	&__footer {
		position: absolute;
		width: 100%;
		bottom: 0;
		display: flex;
		justify-content: center;
	}
	&__word {
		position: absolute;
		right: 1rem;
		top: -2rem;
		font-size: 1.1rem;
	}
}
</style>
