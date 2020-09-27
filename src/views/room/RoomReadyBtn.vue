<template>
	<button
		class="lg custom striped"
		:class="{ green: ready }"
		:disabled="disabled"
		@click="toggleReady"
	>
		<transition name="ready-btn" mode="out-in">
			<span v-if="disabled"> Waiting for more players...</span>
			<span v-else-if="ready">
				<i class="ri-checkbox-circle-line"></i>READY</span
			>
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
			disabled: computed(() => Object.keys(roomState.users).length === 1),
			toggleReady,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

button {
	width: 100%;
}
</style>
