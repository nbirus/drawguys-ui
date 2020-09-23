<template>
	<button class="lg custom" :class="[color, { ready }]" @click="toggleReady">
		<transition name="ready-btn" mode="out-in">
			<span v-if="ready">
				<i class="ri-checkbox-circle-line"></i>READY
			</span>
			<span v-else>
				<i class="ri-indeterminate-circle-line"></i>NOT READY
			</span>
		</transition>
	</button>
</template>

<script>
import { roomState, toggleReady } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'room-ready-btn',
	setup() {
		return {
			color: computed(() => roomState.user.color),
			ready: computed(() => roomState.user.ready),
			toggleReady,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

button {
	width: 100%;
	font-size: 0.9rem;
	position: relative;
	font-weight: $bold;
	color: $text-light;
	overflow: hidden;
	transition: all 0.2s ease;

	background: repeating-linear-gradient(
		45deg,
		lighten($light, 0),
		lighten($light, 0) 2rem,
		darken($light, 3) 2rem,
		darken($light, 3) 4rem
	);
	background-size: 200% 200%;
	animation: barberpole 15s linear infinite;

	span {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	i {
		font-size: 1.2rem;
		color: $text-light;
		margin-right: 0.5rem;
		transform: translateY(1px);
	}

	&:active,
	&:focus {
		border-color: darken($light, 5);
		box-shadow: inset 0 0 0 2px darken($light, 10);
	}
	&:active {
		box-shadow: inset 0 0 0 2px darken($light, 25);
	}

	&.ready {
		color: white;
		background: repeating-linear-gradient(
			45deg,
			lighten($green, 0),
			lighten($green, 0) 2rem,
			darken($green, 3) 2rem,
			darken($green, 3) 4rem
		);
		background-size: 200% 200%;
		animation: barberpole 15s linear infinite;

		i {
			color: white;
		}

		&:hover {
			border-color: darken($green, 15);
		}
		&:active,
		&:focus {
			border-color: darken($green, 10);
			box-shadow: inset 0 0 0 2px darken($green, 10);
		}
		&:active {
			box-shadow: inset 0 0 0 2px darken($green, 25);
		}
	}
}

@keyframes barberpole {
	100% {
		background-position: 100% 100%;
	}
}
</style>
