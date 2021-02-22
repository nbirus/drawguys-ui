<script>
import GameForm from '@/views/game/GameForm'
import GameTimer from '@/views/game/GameTimer'
import GameDrawing from '@/views/game/GameDrawing'
import GameDrawForm from '@/views/game/GameDrawForm'
import GameOverlay from '@/views/game/GameOverlay'
import GameTimeline from '@/views/game/GameTimeline'
import GameHint from '@/views/game/GameHint'
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
		GameHint,
	},
	setup() {
		let event = computed(() => roomState.gameState.event)
		let drawing = computed(() => roomState.userState.drawing)
		let selecting = computed(() => roomState.userState.selecting)
		let match = computed(() => roomState.userState.match)
		let showInfo = computed(() => drawing.value && event.value === 'turn_start')
		let showFooter = computed(() =>
			['turn_start', 'turn_end'].includes(event.value)
		)
		let showHint = computed(() => ['turn_start'].includes(event.value))
		let showTimeline = computed(() => event.value === 'turn_end' || match.value)
		let showWord = computed(() => event.value === 'turn_end' || match.value)
		let showTimer = computed(
			() =>
				(!match.value && event.value === 'turn_start' && !drawing.value) ||
				(event.value === 'turn_start' && drawing.value)
		)
		let showGameForm = computed(
			() => !match.value && event.value === 'turn_start'
		)
		let showHeader = computed(
			() =>
				match.value ||
				(['pre_turn', 'turn_pre_start'].includes(event.value) &&
					!selecting.value) ||
				event.value === 'turn_end'
		)

		return {
			roomState,
			showInfo,
			showFooter,
			showTimeline,
			showTimer,
			showHeader,
			showWord,
			showGameForm,
			showHint,
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

		<transition name="pop-up" appear>
			<div class="board__word" v-if="showWord">
				<h2>The word was <b v-text="roomState.gameState.word"></b></h2>
			</div>
		</transition>

		<transition name="pop-up" mode="out-in" appear>
			<div class="board__card delay-3">
				<div class="board__card-header">
					<div class="absolute-container" key="header">
						<game-header v-if="showHeader" />
						<game-timer v-else-if="showTimer" />
					</div>
				</div>
				<div class="board__card-body card">
					<!-- hint -->

					<!-- drawing -->
					<game-drawing />

					<!-- overlay -->
					<game-overlay />
				</div>
				<div class="board__card-footer" v-show="showFooter">
					<div class="absolute-container">
						<!-- game-timline -->
						<game-timeline />

						<!-- draw form -->
						<game-draw-form
							v-if="!showTimeline && roomState.userState.drawing"
						/>

						<!-- game form -->
						<game-form v-else-if="showGameForm" />

						<!-- game hint -->
						<game-hint v-if="!roomState.userState.drawing && showHint" />
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
	&__word {
		width: 100%;
		text-align: center;
		position: absolute;
		top: -5rem;
		pointer-events: none;
	}
	&__info {
		position: absolute;
		right: 1.5rem;
		top: -2.25rem;
		font-size: 1.25rem;
		pointer-events: none;
		user-select: none;
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
	z-index: 2;
}
</style>
