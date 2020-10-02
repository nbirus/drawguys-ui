<template>
	<div class="room-countdown">
		<transition name="pop-up" mode="out-in" appear>
			<h3 class="mb-5">The game will start in...</h3>
		</transition>
		<transition name="pop-up" mode="out-in" appear>
			<timer :value="roomState.timer" class="mb-7 delay-2" />
		</transition>
		<transition name="pop-up" mode="out-in" appear>
			<button class="custom striped" @click="toggleReady">
				Cancel
			</button>
		</transition>
	</div>
</template>

<script>
import { roomState, toggleReady } from '@/services/Room'
import Timer from '@/components/Timer'

export default {
	name: 'room-countdown',
	components: {
		Timer,
	},
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
	}
}
</style>
