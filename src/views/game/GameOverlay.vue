<script>
import { roomState, setWord } from '@/services/Room'
import { computed, ref, watch } from 'vue'
import { colorMap } from '@/assets/colors'
import ProgressBar from 'progressbar.js'

export default {
	name: 'game-overlay',

	setup() {
		let gameState = computed(() => roomState.gameState)
		let turnUser = computed(() => roomState.gameState.turnUser)
		let user = computed(() => roomState.userState)

		function selectWord(word) {
			setWord(word)
		}

		let event = computed(() => roomState.gameState.event)
		let selecting = computed(() => roomState.userState.selecting)
		let show = computed(() =>
			['pre_turn', 'turn_pre_start'].includes(event.value)
		)

		let slider = ref()
		let bar

		watch(
			() => event.value,
			() => {
				if (event.value === 'turn_pre_start') {
					animateBar(2650)
				}
				if (event.value === 'pre_turn' && user.value.selecting) {
					animateBar(5000)
				}
			}
		)

		let interval = null
		let turnCountDown = ref(3)
		function animateBar(duration) {
			if (interval) {
				clearInterval(interval)
			}
			turnCountDown.value = 3

			interval = setInterval(() => {
				turnCountDown.value--

				if (turnCountDown.value === 0) {
					clearInterval(interval)
				}
			}, 1000)

			setTimeout(() => {
				bar = new ProgressBar.Circle(slider.value, {
					strokeWidth: 20,
					color: '#fff',
					trailWidth: 12,
					trailColor: colorMap[roomState.gameState.turnUser.color] || '#111111',
					svgStyle: null,
				})
				bar.set(0)
				bar.animate(1.0, {
					duration,
				})
			}, 350)
		}

		return {
			show,
			event,
			selecting,
			turnUser,
			roomState,
			gameState,
			user,
			setWord,
			selectWord,
			slider,
			turnCountDown,
		}
	},
}
</script>

<template>
	<div class="game-overlay" v-if="show">
		<transition name="game-widget" mode="out-in" appear>
			<div class="game-overlay__event" :key="event" v-if="selecting">
				<div class="slider" ref="slider"></div>
				<!-- pre turn -->
				<div class="game-overlay__selecting" v-if="event === 'pre_turn'">
					<h3>Choose a word to draw...</h3>
					<ul>
						<li v-for="word in roomState.gameState.words" :key="word">
							<button
								class="outline"
								@click="selectWord(word)"
								v-text="word"
							></button>
						</li>
					</ul>
				</div>

				<!-- turn pre start -->
				<div
					class="game-overlay__countdown"
					v-else-if="event === 'turn_pre_start'"
				>
					<h3>
						You are drawing <b v-text="gameState.word"></b> in
						<span v-text="turnCountDown"></span>...
					</h3>
				</div>
			</div>
		</transition>
	</div>
</template>

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
	pointer-events: none;
	border-radius: $border-radius;
	overflow: hidden;
	@include stripe(white, darken(white, 2));
	position: absolute;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;

	&:after {
		content: '';
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		background: radial-gradient(transparent, fade-out($black, 0.9)), transparent;
		background: radial-gradient(
			transparent,
			fade-out(white, 0.5),
			fade-out(white, 0)
		);
		pointer-events: none;
	}

	&__event {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		width: 100%;
		height: 100%;
	}
	&__countdown {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		h1 {
			font-size: 5rem;
			font-weight: $bold;
		}
	}
	&__selecting {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		ul {
			display: flex;
			flex-direction: row;
			margin-top: 2.5rem;
		}
		li:not(:last-child) {
			margin-right: 1rem;
		}
		button {
			height: 50px;
			padding: 0 1.5rem;
			font-size: 1.2rem;
			pointer-events: auto;
			// background-color: $black;

			&:hover {
				box-shadow: 0 0 0 3px $black;
			}
		}
	}
}

.slider {
	width: 24px;
	height: 24px;
	top: 1.5rem;
	right: 1.5rem;
	position: absolute;
	z-index: 1;
}
</style>
