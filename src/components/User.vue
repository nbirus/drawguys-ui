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
		showPlace: Boolean,
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
		let roundOver = computed(
			() => roomEvent.value === 'turn_end' && props.turnScore !== 0
		)
		let showPopout = computed(() => roundOver.value || props.match)
		let showEvent = computed(() => event.value)
		let userClass = computed(() => [
			props.color,
			event.value,
			{
				ready: props.ready,
				match: props.match,
				typing: props.typing,
				drawing: props.drawing || props.selecting,
				roundOver: roundOver.value,
				pos: props.turnScore > 0,
				neg: props.turnScore < 0,
				clickable: props.changeColor,
				small: props.small,
				large: props.large,
			},
		])

		watch(
			[
				() => props.drawing,
				() => props.selecting,
				() => props.match,
				() => props.guess,
				() => props.score,
			],
			([drawing, selecting, guess], [, , prevGuess]) => {
				if (guess && prevGuess && guess !== prevGuess) {
					setEvent('guess')
				} else if (selecting) {
					setEvent('selecting')
				} else if (drawing) {
					setEvent('drawing')
				}
			},
			{
				immediate: true,
			}
		)

		let eventTimeout = null
		function setEvent(eventName) {
			event.value = ''
			nextTick(() => {
				event.value = eventName
			})

			if (eventTimeout) {
				clearTimeout(eventTimeout)
				eventTimeout = null
			}

			eventTimeout = setTimeout(() => {
				event.value = ''
			}, 3000)
		}

		return {
			userState,
			userClass,
			nextColor,
			event,
			roundOver,
			roomEvent,
			showPopout,
			showEvent,
		}
	},
}
</script>

<template>
	<div class="user card" :class="userClass" :key="event" @click="nextColor">
		<!-- icon -->
		<div class="user__icon icon-banner">
			<div class="icon-banner__inner">
				<i
					v-if="roundOver"
					:class="`ri-${turnScore > 0 ? 'check' : 'forbid'}-line`"
				></i>
				<i v-else-if="ready || match" class="ri-check-fill"></i>
				<i v-else-if="drawing || selecting" class="ri-pencil-fill"></i>
			</div>
		</div>

		<!-- username -->
		<div class="user__username">
			{{ username }} <span v-if="userid === userState.userid">(You)</span>
		</div>

		<!-- score -->
		<div class="user__score" v-if="!hideScore" v-text="score"></div>

		<!-- placement -->
		<div class="user__place" v-if="showPlace"></div>

		<!-- popout -->

		<transition-group
			v-if="showPopout"
			tag="div"
			name="list"
			mode="out-in"
			appear
		>
			<!-- turn over -->
			<div
				v-if="roomEvent === 'turn_end'"
				key="end"
				class="user__popout turn-end"
				:class="turnScore > 0 ? 'pos' : 'neg'"
			>
				<div class="user__popout-icon">
					<i :class="`ri-${turnScore > 0 ? 'add' : 'subtract'}-line`"></i>
				</div>
				<div class="user__popout-text">
					<b>{{ Math.abs(turnScore) }}</b>
				</div>
			</div>

			<!-- turn in progress -->
			<div class="user__popout match" v-else key="match">
				<div class="user__popout-icon">
					<i class="ri-timer-line"></i>
				</div>
				<div class="user__popout-text">{{ matchTime }}s</div>
			</div>
		</transition-group>

		<!-- event popout -->
		<transition-group
			tag="div"
			name="list"
			mode="out-in"
			appear
			v-else-if="showEvent"
		>
			<div
				class="user__popout guess"
				v-if="event === 'guess' && guess"
				key="guess"
			>
				<div class="user__popout-icon">
					<i class="ri-forbid-line"></i>
				</div>
				<div class="user__popout-text">
					<b v-text="guess"></b>
				</div>
			</div>

			<div
				class="user__popout selecting"
				v-else-if="event === 'selecting'"
				key="selecting"
			>
				<div class="user__popout-icon">
					<i class="ri-route-line"></i>
				</div>
				<div class="user__popout-text">
					Selecting word...
				</div>
			</div>

			<div
				class="user__popout selecting"
				v-else-if="event === 'drawing'"
				key="drawing"
			>
				<div class="user__popout-icon">
					<i class="ri-pencil-line"></i>
				</div>
				<div class="user__popout-text">
					Drawing
				</div>
			</div>
		</transition-group>
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
		font-size: 0.9rem;
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
		left: calc(100% + 0.35rem);
		background-color: white;
		box-shadow: $box-shadow;
		border-radius: 25px;
		white-space: nowrap;
		overflow: hidden;
		z-index: 99;

		display: flex;
		align-items: center;

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
			border-radius: 50% 0 0 50%;
			background-color: fade-out(black, 0.85);
			margin-right: 0.35rem;
			padding: 0.25rem 0.15rem 0.25rem 0.25rem;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 1rem;
		}
		&-text {
			margin-right: 0.75rem;
			color: white;
		}

		&.selecting {
			background-color: $black;

			.user__popout-icon {
				background-color: fade-out(white, 0.85);
			}
		}
		&.match {
			background-color: $green;
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
				background-color: darken($color, 15);
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
			&.ready,
			&.drawing {
				@include stripe($color, lighten($color, 5));

				.user__score {
					@include stripe-sm(darken($color, 12), darken($color, 13));
					animation: barberpole 15s linear infinite;
				}
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
				font-size: 0.85rem;
			}
		}
	}
	&.roundOver.pos,
	&.ready,
	&.match {
		&:after {
			box-shadow: inset 0 0 0 4px $green;
		}
		.user__icon {
			background-color: $green;

			.icon-banner__inner {
				border-top-left-radius: 3px;
				background-color: darken($green, 3);
			}
		}
	}
	&.roundOver.neg {
		&:after {
			box-shadow: inset 0 0 0 4px $red;
		}
		.user__icon {
			background-color: $red;

			.icon-banner__inner {
				border-top-left-radius: 3px;
				// background-color: darken($red, 8);
			}
		}
	}
	&.round_end,
	&.turn_end {
		&:after {
			box-shadow: inset 0 0 0 4px $green;
		}
	}
	&.drawing {
		.user__icon {
			background-color: fade-out($black, 0.75);
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
