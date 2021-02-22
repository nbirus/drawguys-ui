<template>
	<div class="control">
		<input type="range" min="0" max="1" step=".1" v-model="soundState.volumn" />
	</div>
</template>

<script>
import { soundState } from '@/services/Sound'

export default {
	name: 'volumn-control',
	setup() {
		return {
			soundState,
		}
	},
}
</script>

<style lang="scss" scoped>
.control {
	position: absolute;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	z-index: 999;
	pointer-events: none;
	padding: 1rem;

	input {
		pointer-events: all;
	}
}
</style>