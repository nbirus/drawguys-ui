<template>
	<div
		class="card outline"
		ref="canvasRef"
		:class="`size-${size} outline-${userState.turnScore > 0 ? 'green' : 'red'}`"
	>
		<div class="card__header-container" v-if="img">
			<div class="card__header" :class="`bg-${userState.color}`">
				<span
					>{{ userState.username }} drew the word <b v-text="word"></b
				></span>
			</div>
		</div>
		<div class="card__footer-container" v-if="img">
			<div
				class="card__footer bg-striped"
				:class="`bg-${userState.turnScore > 0 ? 'green' : 'red'}`"
			>
				<div class="card__footer-score score">{{ userState.turnScore }}</div>
				<div class="card__footer-text">
					<span v-if="userState.drawing">You were drawing</span>
					<span v-else-if="userState.turnScore > 0"
						>You guessed the word in <b v-text="userState.matchTime"></b>s</span
					>
					<span v-else>You didn't guess the word in time</span>
				</div>
			</div>
		</div>
		<div class="empty" v-else>No drawing found</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
	name: 'game-history-drawing',
	props: {
		img: {
			default: null,
		},
		word: {},
		size: {},
		userState: {
			default: () => ({}),
		},
	},
	setup(props) {
		let canvasRef = ref()
		let canvas
		let context

		onMounted(() => {
			if (props.img) {
				canvasRef.value.appendChild(props.img)
			}
		})

		return {
			canvasRef,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.card {
	overflow: visible;
	position: relative;
	border: none;

	&.size-2 {
		width: calc(792px / 1.65);
		height: calc(502px / 1.65);
	}
	&.size-3 {
		width: calc(792px / 1.65);
		height: calc(502px / 1.65);
	}
	&.size-4 {
		width: calc(792px / 1.75);
		height: calc(502px / 1.75);
	}
	&.size-5 {
		width: calc(792px / 2);
		height: calc(502px / 2);
	}
	&.size-6 {
		width: calc(792px / 2);
		height: calc(502px / 2);
	}
	&.size-7 {
		width: calc(792px / 2);
		height: calc(502px / 2);
	}
	&.size-8 {
		width: calc(792px / 2);
		height: calc(502px / 2);
	}
	&.size-9 {
		width: calc(792px / 2);
		height: calc(502px / 2);
	}
	&.size-10 {
		width: calc(792px / 2);
		height: calc(502px / 2);
	}

	&__header {
		color: white;
		padding: 0.75rem 1rem;
		border-radius: $border-radius;
		z-index: 2;
		// background-color: #fff;
		box-shadow: $box-shadow;

		&-container {
			position: absolute;
			top: -1.25rem;
			right: 0px;
			left: 0px;
			display: flex;
			justify-content: center;
		}
	}
	&__footer {
		color: white;
		overflow: hidden;
		border-radius: $border-radius;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;

		&.bg-green .score:before {
			content: '+';
		}
		&.bg-green .score:before {
			content: '+';
		}

		&-score {
			padding: 0.45rem;
			background-color: fade-out(black, 0.75);
		}
		&-text {
			font-size: 0.8rem;
			padding: 0 0.65rem 0 0.5rem;
			font-weight: $bold;
		}

		&-container {
			position: absolute;
			bottom: -0.85rem;
			right: 0px;
			left: 0px;
			display: flex;
			justify-content: center;
		}
	}
}
.empty {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	color: lighten($black, 65);
	font-size: 1.25rem;

	@include stripe(white, darken(white, 2));

	&:after {
		content: '';
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		background: radial-gradient(transparent, fade-out($black, 0.9)), transparent;
		background: radial-gradient(
			transparent,
			fade-out(white, 0.5),
			fade-out(white, 0)
		);
		pointer-events: none;
	}
}
</style>