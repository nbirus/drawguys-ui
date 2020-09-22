<template>
	<button class="lg custom" :class="[color, { ready }]" @click="toggleReady">
		<!-- <i v-if="!ready" class="ri-indeterminate-circle-line"></i>
		<i v-else class="ri-checkbox-circle-line"></i>-->
		<span v-if="ready">Ready</span>
		<span v-else>Not ready</span>
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
	font-size: 1.1rem;
	position: relative;

	i {
		position: absolute;
		top: 0.8rem;
		left: 1rem;
		font-size: 1.5rem;
		color: $text-extra-light;
	}

	&.ready {
		background-color: $green;
		color: white;
	}
}
</style>
