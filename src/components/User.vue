<template>
	<div
		class="user card"
		:class="[
			color,
			{ ready, small, outlined, ready: drawing },
			`ready-outline-${drawing ? 'black' : 'green'}`,
		]"
	>
		<div class="ready-banner" v-if="ready">
			<i class="ri-check-line"></i>
		</div>
		<div class="user__username">
			{{ username }} <span v-if="userid === userState.userid">(You)</span>
		</div>
		<button
			class="btn btn-color left"
			@click="nextColor('left')"
			v-if="changeColor"
		>
			<i class="ri-arrow-left-s-line"></i>
		</button>
		<button
			class="btn btn-color right"
			@click="nextColor('right')"
			v-if="changeColor"
		>
			<i class="ri-arrow-right-s-line"></i>
		</button>

		<transition name="typing" mode="out-in" appear>
			<div class="typing" v-if="typing">
				<div></div>
				<div></div>
				<div></div>
			</div>
		</transition>

		<transition name="drawing" mode="out-in" appear>
			<div class="typing drawing" v-if="drawing">
				<i class="ri-pencil-line"></i>
				<span>DRAWING</span>
			</div>
		</transition>
	</div>
</template>

<script>
import colors from '@/assets/colors'
import { setColor, roomState } from '@/services/Room'
import { userState } from '@/services/User'

export default {
	name: 'user',
	props: {
		userid: String,
		username: String,
		guesses: Array,
		ready: Boolean,
		match: Boolean,
		typing: Boolean,
		outlined: Boolean,
		drawing: Boolean,
		small: Boolean,
		changeColor: Boolean,
		color: String,
		score: Number,
	},
	setup() {
		function nextColor(direction) {
			let user = roomState.users[userState.userid]
			let activeColorIndex = colors.findIndex(c => c === user.color)
			let newColor = true
			let newColorIndex = activeColorIndex

			if (direction === 'right') {
				while (newColor) {
					newColorIndex++
					if (newColorIndex === colors.length) {
						newColorIndex = 0
					}
					if (!colorTaken(newColorIndex)) {
						newColor = false
					}
				}
			} else {
				while (newColor) {
					newColorIndex--
					if (newColorIndex === -1) {
						newColorIndex = colors.length - 1
					}
					if (!colorTaken(newColorIndex)) {
						newColor = false
					}
				}
			}

			setColor(colors[newColorIndex])
		}
		function colorTaken(colorIndex) {
			let users = roomState.users
			let takenIndexes = Object.values(users).map(user =>
				colors.findIndex(c => c === user.color)
			)
			return takenIndexes.includes(colorIndex)
		}

		return {
			nextColor,
			userState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.user {
	position: relative;
	$dark-light: darken($light, 90);
	padding: 1.25rem 0;
	border: none;
	box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.15),
		0 5px 5px -5px rgba(0, 0, 0, 0.075);

	&__username {
		text-align: center;
		font-size: 1rem;
		color: white;
		font-weight: $bold;

		span {
			font-weight: $regular;
			font-size: 0.85rem;
		}
	}

	@each $color, $name in $colors {
		&.#{$name}:not(.outlined) {
			background-color: $color;
		}
		&.#{$name}.outlined {
			background-color: fade-out($color, 0.9);
			border-color: lighten($color, 15);

			.user__username {
				color: $color;
			}
		}
	}

	&.small {
		padding: 1.1rem 0;
		box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.05),
			0 3px 3px -3px rgba(0, 0, 0, 0.03);

		.user__username {
			font-size: 1rem;
		}
	}
}
.btn-color {
	position: absolute;
	top: 0.75rem;
	border-radius: 50%;
	background-color: transparent;
	color: white;
	height: unset;
	width: unset;
	padding: 0;
	height: 35px;
	width: 35px;
	font-size: 1.5rem;

	display: flex;
	align-items: center;
	justify-content: center;
	border: unset;

	&:hover,
	&:active,
	&:focus {
		transform: unset;
	}

	&:active {
		background-color: fade-out($black, 0.9);
	}
	&.left {
		left: 0.25rem;
	}
	&.right {
		right: 0.25rem;
	}
}
.typing {
	position: absolute;
	top: 0.9rem;
	left: calc(100% + 0.5rem);
	z-index: 9;
	box-shadow: $box-shadow;
	border-radius: 25px;
	white-space: nowrap;
	overflow: hidden;

	display: flex;
	align-items: center;
	padding: 0.5rem 0.5rem;
	background-color: #fff;

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
			margin-right: 0.25rem;
		}
	}

	&.drawing {
		background-color: fade-out($black, 0.1);
		font-size: 0.8rem;
		color: white;
		font-weight: $bold;
	}
}

@keyframes dot {
	0% {
		opacity: 0.5;
		transform: scale(0.75);
	}
	50% {
		opacity: 1;
		transform: scale(1);
	}
	100% {
		opacity: 0.5;
		transform: scale(0.75);
	}
}
</style>
