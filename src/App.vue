<template>
	<div id="app">
		<router-view v-if="socketState.connected" />
		<socket-loading v-else-if="socketState.loading" />
		<socket-error v-else-if="socketState.error" />
	</div>
</template>

<script>
import SocketLoading from '@/components/SocketLoading'
import SocketError from '@/components/SocketError'
import { connect, disconecct, socketState } from '@/services/Socket'
import { onBeforeUnmount, onMounted } from 'vue'

export default {
	name: 'app',
	components: {
		SocketLoading,
		SocketError,
	},
	setup() {
		// when page loads attempt to connect to the server
		onMounted(() => {
			connect()
		})
		onBeforeUnmount(() => {
			disconecct()
		})

		return {
			socketState,
		}
	},
}
</script>