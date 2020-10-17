<script>
import GameForm from '@/views/game/GameForm'
import GameTimer from '@/views/game/GameTimer'
import GameDrawing from '@/views/game/GameDrawing'
import GameDrawForm from '@/views/game/GameDrawForm'
import GameOverlay from '@/views/game/GameOverlay'
import GameTimeline from '@/views/game/GameTimeline'
import GameHeader from '@/views/game/GameHeader'
import { roomState } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'game-board',
	components: {
		GameForm,
		GameTimer,
		GameDrawing,
		GameDrawForm,
		GameOverlay,
		GameTimeline,
		GameHeader,
	},
	setup() {
		let showInfo = computed(
			() =>
				roomState.userState.drawing &&
				roomState.gameState.event === 'turn_start'
		)
		let showFooter = computed(() =>
			['turn_start', 'turn_end'].includes(roomState.gameState.event)
		)
		let showTimeline = computed(
			() =>
				roomState.gameState.event === 'turn_end' || roomState.userState.match
		)
		let showTimer = computed(
			() =>
				roomState.gameState.event === 'turn_start' ||
				(roomState.gameState.event === 'pre_turn' &&
					roomState.userState.selecting)
		)
		let showHeader = computed(
			() =>
				roomState.gameState.event === 'turn_end' ||
				roomState.userState.match ||
				(roomState.gameState.event === 'pre_turn' &&
					!roomState.userState.selecting)
		)

		return {
			roomState,
			showInfo,
			showFooter,
			showTimeline,
			showTimer,
			showHeader,
		}
	},
}
</script>

<template>
	<div class="board">
		<!-- info -->
		<transition name="pop-up" appear>
			<div class="board__info" v-if="showInfo">
				<span>You are drawing <b v-text="roomState.gameState.word"></b></span>
			</div>
		</transition>

		<transition name="pop-up" mode="out-in" appear>
			<div class="board__card delay-3">
				<div class="board__card-header">
					<div class="absolute-container">
						<transition name="user-popup" mode="out-in" appear>
							<!-- timer -->
							<game-header key="header" v-if="showHeader" />
							<game-timer key="timer" v-else-if="showTimer" />
						</transition>
					</div>
				</div>
				<div class="board__card-body card">
					<!-- drawing -->
					<game-drawing />

					<!-- overlay -->
					<game-overlay />
				</div>
				<div class="board__card-footer" v-show="showFooter">
					<!-- <transition name="user-popup" mode="out-in" appear> -->
					<div class="absolute-container">
						<!-- game-timline -->
						<game-timeline key="timeline" v-if="showTimeline" />

						<!-- draw form -->
						<game-draw-form
							key="draw"
							v-else-if="roomState.userState.drawing"
						/>

						<!-- game form -->
						<game-form key="form" v-else />
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>


<style lang="scss" scoped>
@import '@/styles/component.scss';

.board {
	width: 100%;
	height: 100%;
	position: relative;

	&__card {
		width: 100%;
		position: relative;

		&-header {
			position: absolute;
			top: -3rem;
			width: 100%;
			pointer-events: none;
		}
		&-footer {
			position: absolute;
			bottom: -2.5rem;
			width: 100%;
			pointer-events: none;
		}
	}
	&__info {
		position: absolute;
		right: 2rem;
		top: -2.5rem;
		font-size: 1.2rem;
	}
}
.absolute-container {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	pointer-events: none;
	margin: auto;
}
</style>
