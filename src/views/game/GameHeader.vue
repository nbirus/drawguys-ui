<script>
import { roomState } from '@/services/Room'
import { computed, ref, watch } from 'vue'
import { colorMap } from '@/assets/colors'
import ProgressBar from 'progressbar.js'

export default {
	name: 'game-header',
	setup() {
		let roundOver = computed(() => roomState.gameState.event === 'turn_end')
		let match = computed(() => roomState.userState.match && roundOver)
		let drawing = computed(() => roomState.userState.drawing)
		let selecting = computed(() => roomState.userState.selecting)
		let playersGuessed = computed(() => roomState.gameState.playersGuessed)
		let turnUser = computed(() => roomState.gameState.turnUser)
		let active = computed(
			() => match.value || (drawing.value && playersGuessed.value > 0)
		)
		let turnScore = computed(() => roomState.userState.turnScore)
		let matchTime = computed(() => roomState.userState.matchTime)
		let event = computed(() => roomState.gameState.event)
		let activeColor = computed(() => {
			if (
				!drawing.value &&
				['pre_turn', 'turn_pre_start'].includes(roomState.gameState.event)
			) {
				return roomState.gameState.turnUser.color
			} else if (match.value || (drawing.value && playersGuessed.value !== 0)) {
				return 'green'
			} else return 'red'
		})

		let bar = null
		let slider = ref(null)
		let turnCountDown = ref(3)
		watch(
			() => event.value,
			() => {
				if (event.value === 'turn_pre_start') {
					setTimeout(() => {
						bar = new ProgressBar.Circle(slider.value, {
							strokeWidth: 20,
							color: '#fff',
							trailWidth: 12,
							trailColor:
								colorMap[roomState.gameState.turnUser.color] || '#111111',
							svgStyle: null,
						})
						bar.set(0)
						bar.animate(1.0, {
							duration: 3000,
						})
					}, 50)
				}
			}
		)

		return {
			active,
			match,
			matchTime,
			turnScore,
			drawing,
			selecting,
			playersGuessed,
			turnUser,
			activeColor,
			event,
			turnCountDown,
			slider,
		}
	},
}
</script>

<template>
	<div class="game-header card bg-striped" :class="`bg-${activeColor}`">
		<div class="game-header__icon">
			<span v-if="drawing || selecting">
				<span v-if="playersGuessed !== 0"> +{{ turnScore }} </span>
				<span v-else> -{{ turnScore }} </span>
			</span>
			<span v-else>
				<span v-if="event === 'pre_turn'">
					<i class="ri-route-line"></i>
				</span>
				<span v-else-if="event === 'turn_pre_start'">
					<div class="slider" ref="slider"></div>
				</span>
				<span v-else-if="match">+{{ turnScore }}</span>
				<span v-else>
					-50
				</span>
			</span>
		</div>
		<div class="game-header__message">
			<span v-if="drawing">
				<span v-if="playersGuessed !== 0">
					<b>{{ playersGuessed }}</b>
					{{ playersGuessed === 1 ? 'player' : 'players' }} guessed the word
				</span>
				<span v-else>
					0 players guessed the word
				</span>
			</span>
			<span v-else>
				<span v-if="event === 'pre_turn'">
					<b v-text="turnUser.username"></b> is choosing a word to draw
				</span>
				<span v-else-if="event === 'turn_pre_start'">
					<b v-text="turnUser.username"></b> is about to draw
				</span>
				<span v-else-if="match">
					You guessed the word in <b v-text="matchTime"></b>s
				</span>
				<span v-else>
					You didn't guess the word
				</span>
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.game-header {
	width: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 40px;

	z-index: 3;
	margin-top: 2rem;
	position: relative;
	border: none;
	color: white;
	overflow: hidden;

	&__icon {
		padding: 0.5rem;
		background-color: fade-out(black, 0.75);
		height: 100%;
		font-weight: $bold;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
	}
	&__message {
		padding: 0 0.75rem;
		font-size: 1rem;
	}
}
.slider {
	width: 1rem;
	height: 1rem;
}
</style>