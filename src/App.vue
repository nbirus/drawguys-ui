<template>
	<div>
		<transition name="page" mode="out-in" appear>
			<router-view
				v-if="socketState.connected || $route.name === 'game-test'"
			/>
			<socket-loading v-else-if="socketState.loading" />
			<socket-error v-else-if="socketState.error" />
		</transition>
	</div>
</template>

<script>
import SocketLoading from '@/components/SocketLoading'
import SocketError from '@/components/SocketError'
import { connect, disconnect, socketState } from '@/services/Socket'
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
			disconnect()
		})
		return {
			socketState,
		}
	},
}
</script>
