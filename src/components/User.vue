<script>
import colors from '@/assets/colors'
import { nextColor, roomState } from '@/services/Room'
import { userState } from '@/services/User'
import { computed, nextTick, ref, watch } from 'vue'

export default {
	name: 'user',
	props: {
		userid: String,
		username: String,
		guess: String,
		ready: Boolean,
		match: Boolean,
		selecting: Boolean,
		typing: Boolean,
		drawing: Boolean,
		small: Boolean,
		large: Boolean,
		changeColor: Boolean,
		hideScore: Boolean,
		color: String,
		score: Number,
		matchTime: Number,
		turnScore: Number,
		roundScore: Number,
	},
	setup(props) {
		let event = ref('')
		let roomEvent = computed(() => roomState.gameState.event)

		watch(
			[
				() => props.drawing,
				() => props.selecting,
				() => props.match,
				() => props.guess,
				() => props.score,
			],
			([drawing, selecting, match, guess]) => {
				if (selecting) {
					event.value = 'selecting'
				} else if (drawing) {
					event.value = 'drawing'
				} else if (match) {
					event.value = 'match'
				} else if (guess) {
					event.value = ''
					nextTick(() => {
						event.value = 'guess'
					})
				} else {
					event.value = ''
				}
			},
			{
				immediate: true,
			}
		)
		watch(
			() => roomEvent.value,
			() => {
				setTimeout(() => {
					if (roomEvent.value === 'turn_end' && event.value !== 'match') {
						event.value = 'turn-end'
					}
				}, 100)
			}
		)

		let userClass = computed(() => [
			props.color,
			event.value,
			{
				ready: props.ready,
				match: props.match,
				typing: props.typing,
				drawing: props.drawing || props.selecting,
				clickable: props.changeColor,
				small: props.small,
				large: props.large,
			},
		])

		return {
			userState,
			userClass,
			nextColor,
			event,
			roomEvent,
		}
	},
}
</script>

<template>
	<div class="user card" :class="userClass" :key="event" @click="nextColor">
		<!-- icon -->
		<div class="user__icon icon-banner">
			<div class="icon-banner__inner">
				<i v-if="ready || match" class="ri-check-fill"></i>
				<i v-else-if="drawing || selecting" class="ri-pencil-fill"></i>
			</div>
		</div>

		<!-- username -->
		<div class="user__username">
			{{ username }} <span v-if="userid === userState.userid">(You)</span>
		</div>

		<!-- score -->
		<div class="user__score" v-if="!hideScore" v-text="score"></div>

		<!-- match -->
		<transition name="user-typing" mode="out-in">
			<div v-if="match" class="user__popout match">
				<div class="user__popout-content">
					<div class="user__popout-icon">
						<i class="ri-timer-line"></i>
					</div>
					{{ matchTime }}s
				</div>
			</div>

			<!-- popout -->
			<div class="user__popout typing" v-else-if="typing">
				<div></div>
				<div></div>
				<div></div>
			</div>
		</transition>

		<!-- event -->
		<div
			v-if="event"
			class="user__popout event"
			:class="[event, turnScore >= 0 ? 'pos' : 'neg']"
			:key="event"
		>
			<!-- round end -->
			<div class="user__popout-content" v-if="event === 'turn-end'">
				<div class="user__popout-icon">
					<i :class="`ri-${turnScore >= 0 ? 'add' : 'subtract'}-line`"></i>
				</div>
				{{ Math.abs(turnScore) }}
			</div>

			<!-- drawing -->
			<div class="user__popout-content" v-if="event === 'drawing'">
				<div class="user__popout-icon">
					<i class="ri-pencil-fill"></i>
				</div>
				Drawing
			</div>

			<!-- with points -->
			<div class="user__popout-content" v-if="event === 'drawing-points'">
				<div class="user__popout-icon">
					<i :class="`ri-${turnScore > 0 ? 'pencil' : 'subtract'}-fill`"></i>
				</div>
				{{ Math.abs(turnScore) }}
			</div>

			<!-- selecting -->
			<div class="user__popout-content" v-if="event === 'selecting'">
				<div class="user__popout-icon">
					<i class="ri-route-fill"></i>
				</div>
				Selecting word...
			</div>

			<!-- guessed -->
			<div class="user__popout-content" v-if="event === 'guess'">
				<div class="user__popout-icon">
					<i class="ri-close-line"></i>
				</div>
				{{ guess }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.user {
	display: flex;
	position: relative;
	border: none;
	height: 60px;
	box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.15),
		0 5px 5px -5px rgba(0, 0, 0, 0.075);
	pointer-events: none;
	transition: 0.2s ease;
	transition-property: transform, box-shadow;
	z-index: 2;

	&:after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		box-shadow: inset 0 0 0 0 $black;
		border-radius: $border-radius;
		pointer-events: none;
		transition: 0.2s ease;
		transition-property: box-shadow;
	}

	&__icon {
		i {
			border-radius: 50%;
			color: white;
			padding: 0.1rem;
		}
	}
	&__username {
		flex: 0 1 100%;
		text-align: center;
		font-size: 1rem;
		color: white;
		font-weight: $bold;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;

		span {
			font-weight: $regular;
			font-size: 0.85rem;
			margin-left: 0.25rem;
		}
	}
	&__score {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 1rem;
		font-weight: $bold;
		font-size: 1rem;
		color: white;
		border-radius: 0 $border-radius $border-radius 0;
	}
	&__popout {
		position: absolute;
		top: 1rem;
		font-size: 0.8rem;
		left: calc(100% + 0.5rem);
		background-color: white;
		box-shadow: $box-shadow;
		border-radius: 25px;
		white-space: nowrap;
		overflow: hidden;

		display: flex;
		align-items: center;
		padding: 0.3rem 0.75rem 0.35rem 0.35rem;

		&-content {
			display: flex;
			align-items: center;
			color: white;
			font-weight: $bold;
			font-size: 0.8rem;
		}
		&-icon {
			height: 1.25rem;
			width: 1.25rem;
			border-radius: 50%;
			background-color: fade-out(white, 0.85);
			margin-right: 0.35rem;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 0.8rem;
		}

		&.event {
			opacity: 0;
			animation: event 3s ease;
		}
		&.match {
			@include stripe-sm($green, darken($green, 2));
		}
		&.selecting {
			background-color: $black;
		}
		&.drawing {
			background-color: $black;
		}
		&.turn-end {
			&.pos {
				background-color: $green;
			}
			&.neg {
				background-color: $red;
			}
		}
		&.round-end {
			background-color: $red;

			&.positive {
				background-color: $green;
			}
		}
		&.guess {
			background-color: $red;
		}
		&.typing {
			padding: 0.5rem 0.5rem;
			top: 0.9rem;

			> div {
				width: 8px;
				height: 8px;
				background-color: $grey;
				border-radius: 50%;
				animation: dot 1.5s ease-in-out infinite;

				&:nth-child(2) {
					animation-delay: 0.5s;
				}
				&:nth-child(3) {
					animation-delay: 1s;
				}
				&:not(:last-child) {
					margin-right: 0.15rem;
				}
			}
		}
	}

	// color
	@each $color, $name in $colors {
		&.#{$name} {
			background-color: $color;

			.user__score {
				background-color: darken($color, 10);
			}

			// mods
			&.clickable:not(.ready) {
				&:hover {
					@include stripe($color, darken($color, 4));
					&:after {
						box-shadow: inset 0 0 0 3px darken($color, 20);
					}
				}
				&:active {
					@include stripe($color, darken($color, 2));
					&:after {
						box-shadow: inset 0 0 0 4px darken($color, 30);
					}
				}
			}
			&.ready {
				@include stripe(darken($color, 0), darken($color, 4));
			}
		}
	}

	// mods
	&.small {
		height: 50px;
		box-shadow: 0 5px 10px -2px rgba(0, 0, 0, 0.05),
			0 2px 4px -5px rgba(0, 0, 0, 0.025);
		.user {
			&__username {
				font-size: 0.9rem;
			}
		}
	}
	&.ready,
	&.match {
		&:after {
			box-shadow: inset 0 0 0 4px darken($green, 5);
		}
		.user__icon {
			background-color: darken($green, 5);

			.icon-banner__inner {
				background-color: darken($green, 10);
			}
		}
	}
	&.match {
		transform: scale(1.05);
	}
	&.round_end {
		// &:after {
		// 	box-shadow: inset 0 0 0 4px $red;
		// }
		// &.positive:after {
		// 	box-shadow: inset 0 0 0 4px $green;
		// }
	}
	&.drawing {
		transform: scale(1.05);

		&:after {
			box-shadow: inset 0 0 0 4px $black;
		}
		.user__icon {
			background-color: $black;

			.icon-banner__inner {
				background-color: lighten($black, 15);
			}
		}
	}
	&.clickable:not(.ready) {
		cursor: pointer;
		pointer-events: auto;

		&:hover {
			transform: scale(1.05);
			box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.25),
				0 5px 5px -5px rgba(0, 0, 0, 0.1);
		}
		&:active {
			transform: scale(1.025);
		}
	}
	&.guess,
	&.match {
		animation: shake 0.75s ease;
	}
	&.guess:after {
		animation: guess 0.75s ease;
	}
	&.match:after {
		animation: match 0.75s ease;
	}
}

@keyframes match {
	0% {
		box-shadow: inset 0 0 0 0 $green;
		transform: scale(1);
	}
	25% {
		box-shadow: inset 0 0 0 4px $green;
		transform: scale(1.025);
	}
	50% {
		box-shadow: inset 0 0 0 0 $green;
		transform: scale(1);
	}
	75% {
		box-shadow: inset 0 0 0 4px $green;
		transform: scale(1.025);
	}
	100% {
		box-shadow: inset 0 0 0 0 $green;
		transform: scale(1);
	}
}
@keyframes guess {
	0% {
		box-shadow: inset 0 0 0 0 $red;
		transform: scale(1);
	}
	25% {
		box-shadow: inset 0 0 0 4px $red;
		transform: scale(1.025);
	}
	50% {
		box-shadow: inset 0 0 0 0 $red;
		transform: scale(1);
	}
	75% {
		box-shadow: inset 0 0 0 4px $red;
		transform: scale(1.025);
	}
	100% {
		box-shadow: inset 0 0 0 0 $red;
		transform: scale(1);
	}
}
@keyframes shake {
	0% {
		transform: scale(1);
	}
	25% {
		transform: scale(1.025);
	}
	50% {
		transform: scale(1);
	}
	75% {
		transform: scale(1.025);
	}
	100% {
		transform: scale(1);
	}
}
@keyframes event {
	0% {
		opacity: 0;
		transform: scale(0.5) translateX(-2rem);
	}
	10% {
		opacity: 1;
		transform: scale(1) translateX(0px);
	}
	90% {
		opacity: 1;
		transform: scale(1) translateX(0px);
	}
	100% {
		opacity: 0;
		transform: scale(0.75) translateX(-2rem);
	}
}
@keyframes dot {
	0% {
		opacity: 0.25;
		transform: scale(0.85);
	}
	50% {
		opacity: 0.75;
		transform: scale(1);
	}
	100% {
		opacity: 0.25;
		transform: scale(0.75);
	}
}
</style>
