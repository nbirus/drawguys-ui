<template>
	<div class="room-countdown">
		<transition name="pop-up" mode="out-in" appear>
			<h3 class="mb-4">The game will start in...</h3>
		</transition>
		<transition name="pop-up" mode="out-in" appear>
			<div class="avatar mb-5 delay-2">
				<h1 v-text="roomState.countdown"></h1>
			</div>
		</transition>
		<transition name="pop-up" mode="out-in" appear>
			<button class="custom striped" @click="toggleReady">
				<span><i class="ri-forbid-line"></i>Cancel</span>
			</button>
		</transition>
	</div>
</template>

<script>
import { roomState, toggleReady } from '@/services/Room'

export default {
	name: 'room-countdown',
	setup() {
		return {
			roomState,
			toggleReady,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.room-countdown {
	display: block;
	position: fixed;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background-color: fade-out(white, 0.05);
	z-index: 999;

	.avatar {
		background-color: $light;
		width: 7rem;
		height: 7rem;
	}
	h1 {
		font-size: 4rem;
		font-weight: $bold;
		text-shadow: 2px 2px darken($light, 5);
	}

	button {
		width: 110px;
		font-size: 0.9rem;
		position: relative;
		font-weight: $bold;
		color: $text-light;
		overflow: hidden;
		transition: all 0.2s ease;

		i {
			font-size: 1.2rem;
			color: $text-light;
			margin-right: 0.5rem;
			transform: translateY(1px);
		}

		span {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		background: repeating-linear-gradient(
			45deg,
			lighten($light, 0),
			lighten($light, 0) 2rem,
			darken($light, 3) 2rem,
			darken($light, 3) 4rem
		);
		background-size: 200% 200%;
		animation: barberpole 15s linear infinite;
	}
}
</style>
