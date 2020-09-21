<template>
	<button class="lg" :class="[color, { ready }]" @click="toggleReady">
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
}
</style>
