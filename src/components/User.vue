<script>
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
		elevated: Boolean,
		changeColor: Boolean,
		hideScore: Boolean,
		first: Boolean,
		color: String,
		score: Number,
		matchTime: Number,
		turnScore: Number,
		roundScore: Number,
		place: Number,
	},
	setup(props) {
		let event = ref('')
		let eventTimeout = null

		watch(
			[
				() => props.match,
				() => props.drawing,
				() => props.selecting,
				() => props.guess,
				() => roomState.gameState.event,
			],
			([match, drawing, selecting, guess, roomEvent], [, , prevGuess]) => {
				// pre_turn
				if (roomEvent === 'pre_turn') {
					if (selecting) {
						setEvent('selecting', true)
					} else {
						setEvent('')
					}
				}

				// turn_pre_start
				else if (roomEvent === 'turn_pre_start') {
					if (selecting) {
						setEvent('')
					}
				}

				// turn_start
				else if (roomEvent === 'turn_start') {
					if (drawing) {
						setEvent('drawing', true)
					} else if (match) {
						setEvent('match', true)
					} else if (guess && guess !== prevGuess) {
						setEvent('')
						nextTick(() => {
							setEvent('guess', true)
						})
					}
				}

				// turn_end
				else if (roomEvent === 'turn_end') {
					if (drawing) {
						setEvent('')
					} else if (match) {
						setEvent('match')
					} else if (!match) {
						setEvent('fail')
					}
				}
			},
			{
				immediate: true,
			}
		)

		function setEvent(eventName, expire = false) {
			if (eventTimeout !== null) {
				clearTimeout(eventTimeout)
				eventTimeout = null
			}
			if (!expire) {
				event.value = eventName
				return
			}
			event.value = eventName
			eventTimeout = setTimeout(() => {
				event.value = ''
			}, 2500)
		}

		// class
		let outlineColor = computed(() => {
			if (props.ready || props.match) {
				return 'green'
			} else if (props.selecting || props.drawing) {
				return 'black'
			} else if (roomState.gameState.event === 'turn_end') {
				return 'red'
			} else return ''
		})
		let userClass = computed(() => [
			`bg-${props.color}`,
			`outline-${outlineColor.value}`,
			`event-${event.value}`,
			{
				'bg-striped': props.drawing || props.first || props.selecting,
				clickable: props.changeColor,
				first: props.first,
				large: props.large,
				elevated: props.elevated,
			},
		])

		return {
			outlineColor,
			userState,
			userClass,
			nextColor,
			event,
		}
	},
}
</script>

<template>
	<div class="user outline card" :class="userClass" @click="nextColor">
		<!-- icon -->
		<div class="user__icon icon-banner" :class="`bg-${outlineColor}`">
			<div class="icon-banner__inner">
				<i v-if="event === 'fail'" class="ri-forbid-line"></i>
				<i v-else-if="ready || match" class="ri-check-line big"></i>
				<i v-else-if="drawing || selecting" class="ri-pencil-fill"></i>
			</div>
		</div>

		<!-- username -->
		<div class="user__username">
			{{ username }} <span v-if="userid === userState.userid">(You)</span>
		</div>

		<!-- score -->
		<div class="user__score bg-darken" v-if="!hideScore" v-text="score"></div>

		<!-- placement -->
		<transition name="pop-in" mode="out-in">
			<div class="user__place" v-if="showPlace">
				<i v-if="first" class="ri-vip-crown-fill"></i>
				<span
					v-text="
						[
							,
							'1st',
							'2nd',
							'3rd',
							'4th',
							'5th',
							'6th',
							'7th',
							'8th',
							'9th',
							'10th',
						][place]
					"
				></span>
			</div>
		</transition>

		<!-- events -->
		<transition-group name="user-popup" mode="out-in" appear>
			<!-- match -->
			<div v-if="event === 'match'" class="user__popout bg-green" key="match">
				<div class="user__popout-icon">
					<i class="ri-check-line"></i>
				</div>
				<div class="user__popout-text"><b v-text="matchTime"></b>s</div>
			</div>
			<div
				v-else-if="event === 'selecting'"
				class="user__popout bg-black"
				key="selecting"
			>
				<div class="user__popout-icon">
					<i class="ri-route-line"></i>
				</div>
				<div class="user__popout-text">
					<b>Choosing word...</b>
				</div>
			</div>
			<div
				v-else-if="event === 'drawing'"
				class="user__popout bg-black"
				key="drawing"
			>
				<div class="user__popout-icon">
					<i class="ri-pencil-fill"></i>
				</div>
				<div class="user__popout-text">
					<b>Drawing</b>
				</div>
			</div>
			<div
				v-else-if="event === 'guess'"
				class="user__popout bg-red"
				key="guess"
			>
				<div class="user__popout-icon">
					<i class="ri-forbid-line"></i>
				</div>
				<div class="user__popout-text">
					{{ guess }}
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
	z-index: 1;

	&__icon {
		overflow: visible;

		i {
			border-radius: 50%;
			color: white;
			font-size: 1rem;
		}
		.big {
			font-size: 1.15 grem;
		}
	}
	&__username {
		flex: 0 1 100%;
		text-align: center;
		font-size: 0.95rem;
		color: white;
		font-weight: $bold;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;

		span {
			font-weight: $regular;
			font-size: 0.85rem;
			user-select: none;
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
		min-width: 30px;
		background-color: fade-out(black, 0.75);
		color: white;
		border-radius: 0 $border-radius $border-radius 0;
	}
	&__popout {
		position: absolute;
		top: 1rem;
		font-size: 0.8rem;
		left: calc(100% + 0.35rem);
		box-shadow: $box-shadow;
		border-radius: $border-radius;
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
			width: 1.15rem;
			border-radius: $border-radius 0 0 $border-radius;
			margin-right: 0.25rem;
			padding: 0.25rem;
			padding-right: 0.15rem;
			background-color: fade-out(black, 0.9);
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 1rem;
		}
		&-text {
			margin-right: 0.4rem;
			color: white;
		}
	}
	&__place {
		position: absolute;
		top: -0.75rem;
		right: -0.75rem;
		padding: 0 0.25rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: $border-radius;
		font-size: 0.9rem;

		background-color: fade-out(black, 0.1);
		border: solid 3px fade-out(black, 0.05);
		color: white;
		font-weight: $bold;
		z-index: 2;
		transform: scale(0.9);

		i {
			font-weight: $regular;
			margin-right: 0.25rem;
		}
	}

	@each $color, $name in $colors {
		&.bg-#{$name}.clickable {
			pointer-events: auto;
			cursor: pointer;

			&:hover {
				transform: scale(1.075);
			}
			&:active {
				transform: scale(1.025);
			}

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
	}

	&.elevated {
		transform: scale(1.075);

		&:after {
			box-shadow: 0 0 0 4px $black;
		}
	}
	&.large {
		.user__username {
			font-size: 1rem;
		}
	}
	&.event-drawing,
	&.event-selecting,
	&.event-guess {
		animation: pop 0.25s ease;
	}
	&.event-guess:after {
		content: '';
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		border-radius: $border-radius;
		pointer-events: none;
		animation: outline 0.35s ease;
		z-index: 2;
	}
}

@keyframes pop {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
	100% {
		transform: scale(1);
	}
}
@keyframes outline {
	0% {
		box-shadow: inset 0 0 0 0;
	}
	50% {
		box-shadow: inset 0 0 0 3px $red;
	}
	100% {
		box-shadow: inset 0 0 0 0;
	}
}
</style>
