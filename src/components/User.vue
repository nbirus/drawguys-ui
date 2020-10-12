<script>
import colors from '@/assets/colors'
import { nextColor, roomState } from '@/services/Room'
import { userState } from '@/services/User'
import { computed, ref, watch } from 'vue'

export default {
	name: 'user',
	props: {
		userid: String,
		username: String,
		guesses: Array,
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
	},
	setup(props) {
		let event = computed(() => {
			if (props.drawing) {
				return 'drawing'
			} else if (props.selecting) {
				return 'selecting'
			} else return ''
		})

		let userClass = computed(() => [
			props.color,
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
		}
	},
}
</script>

<template>
	<div class="user card" :class="userClass" @click="nextColor">
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

		<!-- popout -->
		<transition name="user-typing" mode="out-in">
			<div class="user__popout typing" v-if="typing">
				<div></div>
				<div></div>
				<div></div>
			</div>
		</transition>

		<!-- event -->
		<div v-if="event" class="user__popout event" :class="event" :key="event">
			<div class="user__popout-content" v-if="event === 'drawing'">
				<div class="user__popout-icon">
					<i class="ri-pencil-fill"></i>
				</div>
				Drawing
			</div>
			<div class="user__popout-content" v-if="event === 'selecting'">
				<div class="user__popout-icon">
					<i class="ri-route-fill"></i>
				</div>
				Selecting word...
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
		z-index: 9;
		background-color: white;
		box-shadow: $box-shadow;
		border-radius: 25px;
		white-space: nowrap;
		overflow: hidden;
		animation: event 3s;

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
			margin-right: 0.5rem;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 0.8rem;
		}

		&.event {
			opacity: 0;
		}
		&.selecting {
			background-color: $black;
		}
		&.drawing {
			background-color: $black;
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
					@include stripe(darken($color, 0), darken($color, 4));
					&:after {
						box-shadow: inset 0 0 0 3px darken($color, 20);
					}
				}
				&:active {
					@include stripe(darken($color, 0), darken($color, 2));
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
	&.drawing {
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
}

@keyframes event {
	0% {
		opacity: 0;
		transform: scale(0.85) translateX(-18px);
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
		transform: scale(0.85) translateX(-18px);
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
