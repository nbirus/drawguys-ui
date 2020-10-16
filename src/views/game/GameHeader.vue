<template>
	<div
		class="game-header card"
		:class="{
			match: active,
			round: roundOver,
			[`bg-${turnUser.color} pre`]: roundStart,
		}"
	>
		<div class="game-header__text">
			<div class="avatar">
				<i :class="`ri-${active ? 'check' : 'close'}-fill`"></i>
			</div>
			<div class="text">
				<div class="round-start" v-if="roundStart">
					<b v-text="turnUser.username"></b>
					is selecting a word to draw...
				</div>
				<div v-if="roundOver">
					<div>
						<b v-text="playersGuessed"></b>
						<span
							>&nbsp;{{ playersGuessed === 0 ? 'players' : 'player' }} guessed
							the word</span
						>
						<b v-text="word"></b>
					</div>
				</div>
				<div v-else-if="match">
					<span>You guessed the word</span>
					<b v-text="word"></b>
					<span>&nbsp;in</span>
					<b v-text="matchTime"></b>
					<span>&nbsp;seconds</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { roomState } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'game-header',
	setup() {
		let word = computed(() => roomState.gameState.word)
		let matchTime = computed(() => roomState.userState.matchTime)
		let match = computed(() => roomState.userState.match && roundOver)
		let roundOver = computed(() => roomState.gameState.event === 'turn_end')
		let roundStart = computed(() => roomState.gameState.event === 'pre_turn')
		let drawing = computed(() => roomState.userState.drawing)
		let selecting = computed(() => roomState.userState.selecting)
		let playersGuessed = computed(() => roomState.gameState.playersGuessed)
		let turnUser = computed(() => roomState.gameState.turnUser)

		let active = computed(
			() => match.value || (drawing.value && playersGuessed.value > 0)
		)

		return {
			active,
			word,
			match,
			matchTime,
			roundOver,
			roundStart,
			drawing,
			selecting,
			playersGuessed,
			turnUser,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.game-header {
	width: auto;
	display: flex;
	align-items: center;
	justify-content: center;

	padding: 1.25rem 1.5rem 1.25rem 1.25rem;
	z-index: 2;
	margin-top: 0.5rem;
	position: relative;

	&:after {
		content: '';
		position: absolute;
		top: -1px;
		right: -1px;
		bottom: -1px;
		left: -1px;
		border-radius: $border-radius;
		transition: box-shadow 0.2s ease;
	}
	&:not(.round):after {
		box-shadow: inset 0 0 1px 3px $red;
	}
	&.match:not(.round):after {
		box-shadow: inset 0 0 1px 3px $green;
	}
	&.match {
		.avatar {
			background-color: fade-out($green, 0.8);
			color: $green;
		}
	}
	&.pre {
		&:after {
			display: none;
		}
	}

	&__text {
		display: flex;
		align-items: center;
		font-size: 1.25rem;

		span {
			margin-right: 0.35rem;
			font-size: 1.2rem;
		}
		b {
			font-size: 1.3rem;
		}

		.avatar {
			width: 2rem;
			height: 2rem;
			margin-right: 0.75rem;
			background-color: fade-out($red, 0.8);
			color: $red;
			font-size: 1.45rem;
		}
	}
}
.round-start {
	font-size: 1rem;
	color: white;

	b {
		font-size: 1rem;
	}
	span {
		color: white;
	}
}
</style>