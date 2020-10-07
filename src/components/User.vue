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
		typing: Boolean,
		drawing: Boolean,
		small: Boolean,
		large: Boolean,
		changeColor: Boolean,
		color: String,
		score: Number,
	},
	setup(props) {
		let userClass = computed(() => [
			props.color,
			{
				ready: props.ready,
				match: props.match,
				typing: props.typing,
				drawing: props.drawing,
				clickable: props.changeColor,
				small: props.small,
				large: props.large,
			},
		])
		return {
			userState,
			userClass,
			nextColor,
		}
	},
}
</script>

<template>
	<div class="user card" :class="userClass" @click="nextColor">
		<!-- icon -->
		<div class="user__icon icon-banner">
			<i v-if="ready" class="ri-check-fill"></i>
		</div>

		<!-- username -->
		<div class="user__username">
			{{ username }} <span v-if="userid === userState.userid">(You)</span>
		</div>

		<!-- popout -->
		<div class="user__popout typing" v-if="typing">
			<div></div>
			<div></div>
			<div></div>
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
	&__popout {
		position: absolute;
		top: 1.25rem;
		font-size: 0.8rem;
		left: calc(100% + 0.5rem);
		z-index: 9;
		background-color: #fff;
		box-shadow: $box-shadow;
		border-radius: 25px;
		white-space: nowrap;
		overflow: hidden;

		display: flex;
		align-items: center;
		padding: 0.5rem 0.65rem;

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
	&.ready {
		&:after {
			box-shadow: inset 0 0 0 4px darken($green, 5);
		}
		.user__icon {
			background-color: darken($green, 5);

			i {
				border-radius: 50%;
				background-color: darken($green, 15);
				color: white;
				padding: 0.1rem;
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
