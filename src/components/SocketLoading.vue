<template>
	<div class="page page--center" v-if="socketState.loading">
		<i class="spinner mr-3"></i>
		<h4>Loading...</h4>
	</div>
</template>

<script>
import { socketState } from '@/services/Socket'

export default {
	name: 'socket-loading',
	setup() {
		return {
			socketState,
		}
	},
}
</script>

<style lang="scss" scoped>
.page {
	flex-direction: row;
}
.spinner {
	transform: translateY(-2px);
}
</style>