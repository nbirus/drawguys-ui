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
			<div class="avatar pre" v-if="roundStart">
				<i class="ri-pencil-fill"></i>
			</div>
			<div class="avatar" v-else>
				<i :class="`ri-${active ? 'check' : 'forbid'}-line`"></i>
			</div>
			<div class="text">
				<div class="round-start" v-if="roundStart">
					<b v-text="turnUser.username"></b>
					is selecting a word...
				</div>
				<div v-if="roundOver">
					<div v-if="match || drawing">
						<span v-text="playersGuessed"></span>
						<span
							>{{ playersGuessed === 0 ? 'players' : 'player' }} guessed the
							word</span
						>
						<b v-text="word"></b>
					</div>
					<div v-else>
						You ran out of time. The word was
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

<style lang="scss" scoped>
@import '@/styles/component.scss';
.game-header {
	width: auto;
	display: flex;
	align-items: center;
	justify-content: center;

	padding: 1.25rem 1.65rem 1.25rem 1.25rem;
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
	&.pre {
		border: none;
		padding: 0.75rem 1.65rem 0.75rem 1.25rem !important;
		margin-top: 0.75rem;

		.avatar {
			background-color: fade-out(white, 0.8);
			color: white;
			font-size: 1rem;
		}
	}
	&:not(.round):after {
		box-shadow: inset 0 0 1px 3px $red;
	}
	&.match:not(.round):after {
		box-shadow: inset 0 0 1px 3px $green;
	}
	&.round:not(.match) {
		background-color: lighten($red, 38);
		border: none;

		&:after {
			box-shadow: inset 0 0 0 3px $red;
		}
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
			font-size: 1.1rem;
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