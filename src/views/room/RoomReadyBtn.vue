<template>
	<button
		class="lg custom striped"
		:class="{ green: ready, active, yellow: active }"
		:disabled="disabled"
		@click="toggleReady"
	>
		<!-- <transition name="ready-btn" mode="out-in"> -->
		<span v-if="active"> Game starts in {{ timer }}...</span>
		<span v-else-if="disabled"> Waiting for more players...</span>
		<span v-else-if="ready"> <i class="ri-checkbox-circle-line"></i>READY</span>
		<span v-else><i class="ri-checkbox-circle-line"></i> READY UP</span>
		<!-- </transition> -->
	</button>
</template>

<script>
import { roomState, toggleReady } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'room-ready-btn',
	setup() {
		return {
			timer: computed(() => roomState.timer),
			active: computed(() => roomState.timerActive),
			color: computed(() => roomState.userState.color),
			ready: computed(() => roomState.userState.ready),
			disabled: computed(() => Object.keys(roomState.usersState).length === 1),
			toggleReady,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

button {
	width: 100%;
	pointer-events: auto;

	&.active {
		@include stripe(fade-out($yellow, 0.95), fade-out($yellow, 0.85));
		pointer-events: auto;

		span {
			animation: bounce 1s infinite linear;
			color: darken($yellow, 45);
			z-index: 2;
			position: absolute;
			top: 0px;
			right: 0px;
			bottom: 0px;
			left: 0px;
			pointer-events: none;
		}
		&:after {
			pointer-events: none;
			content: '';
			position: absolute;
			top: 0px;
			right: 0px;
			bottom: 0px;
			left: 0px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			@include stripe($yellow, darken($yellow, 5));
			z-index: 1;
			animation: after 3s linear;
		}
	}
}

@keyframes bounce {
	0% {
		transform: scale(1);
	}
	10% {
		transform: scale(1.2);
	}
	15% {
		transform: scale(1);
	}
	100% {
		transform: scale(1);
	}
}
@keyframes after {
	0% {
		width: 100%;
	}
	100% {
		width: 0%;
	}
}
</style>
