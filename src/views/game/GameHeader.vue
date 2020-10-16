<template>
	<div class="game-header card" :class="{ match: active }">
		<div class="game-header__text">
			<div class="avatar">
				<i :class="`ri-${active ? 'check' : 'close'}-fill`"></i>
			</div>
			<div class="text">
				<div v-if="roundOver">
					<div v-if="playersGuessed === 0 || drawing">
						<b v-text="playersGuessed" class="mr-1"></b>
						<span
							>{{ playersGuessed === 0 ? 'players' : 'player' }} guessed the
							word</span
						>
						<b v-text="word"></b>
					</div>
					<div v-else>
						<span>The word was</span>
						<b v-text="word"></b>
					</div>
				</div>
				<div v-else-if="match">
					<span>You guessed the word</span>
					<b class="mr-1" v-text="word"></b>
					<span>in</span>
					<b v-text="matchTime"></b>
					<span>&nbsp;seconds</span>
				</div>
			</div>
		</div>

		<!-- drawing -->
		<!-- <div class="game-header__text" v-if="drawing || roundOver">
			<div class="avatar">
				<i :class="`ri-${playersGuessed > 0 ? 'check' : 'close'}-fill`"></i>
			</div>
			<b v-text="playersGuessed" class="mr-1"></b>
			<span
				>{{ playersGuessed === 0 ? 'players' : 'player' }} guessed the
				word</span
			>
			<b v-text="word"></b>
		</div> -->

		<!-- <div class="game-header__text" v-else>
			<div class="avatar">
				<i :class="`ri-${match ? 'check' : 'close'}-fill`"></i>
			</div>
			<div v-if="match">
				<span>You guessed</span>
				<b class="mr-1" v-text="word"></b>
				<span>in</span>
				<b v-text="matchTime"></b>
				<span>&nbsp;seconds</span>
			</div>
			<div v-else>
				<span>The word was</span>
				<b v-text="word"></b>
			</div>
		</div> -->
	</div>
</template>

<script>
import { roomState } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'game-header',
	setup() {
		let word = computed(() => roomState.gameState.word)
		let match = computed(() => roomState.userState.match)
		let matchTime = computed(() => roomState.userState.matchTime)
		let roundOver = computed(() => roomState.gameState.event === 'turn_end')
		let drawing = computed(() => roomState.userState.drawing)
		let playersGuessed = computed(() => roomState.gameState.playersGuessed)
		let active = computed(
			() => match.value || (drawing.value && playersGuessed.value > 0)
		)

		return {
			active,
			word,
			match,
			matchTime,
			roundOver,
			drawing,
			playersGuessed,
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
		box-shadow: inset 0 0 1px 3px $red;
	}
	&.match:after {
		box-shadow: inset 0 0 1px 3px $green;
	}
	&.match {
		.avatar {
			background-color: fade-out($green, 0.8);
			color: $green;
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
			margin-right: 1rem;
			background-color: fade-out($red, 0.8);
			color: $red;
			font-size: 1.45rem;
		}
	}
}
</style>