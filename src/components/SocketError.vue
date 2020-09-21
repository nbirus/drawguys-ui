<template>
	<div class="page page--center" v-if="socketState.error">
		<div class="avatar bg-light bg-darken mb-5">
			<i class="ri-cloud-off-line"></i>
		</div>
		<h3>
			Couldn't connect, try
			<a href="javascript:window.location.href=window.location.href">refreshing</a> the page
		</h3>
	</div>
</template>

<script>
import { socketState } from '@/services/Socket'

export default {
	name: 'socket-error',
	setup() {
		return {
			socketState,
		}
	},
}
</script>

<style lang="scss" scoped>
</style>