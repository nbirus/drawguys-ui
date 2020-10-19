<template>
	<div class="page page--center">
		<transition name="pop-up" mode="out-in" appear>
			<div class="avatar bg-light bg-darken-sm mb-5">
				<i class="ri-cloud-off-line"></i>
			</div>
		</transition>
		<transition name="pop-up" mode="out-in" appear>
			<h3 class="delay-1">
				Couldn't connect, try
				<a href="javascript:window.location.href=window.location.href"
					>refreshing</a
				>
				the page
			</h3>
		</transition>
	</div>
</template>

<script>
import { onBeforeUnmount, onMounted } from 'vue'
import { connect } from '@/services/Socket'
let interval
export default {
	name: 'socket-error',
	setup() {
		onMounted(() => {
			interval = setInterval(() => {
				connect()
			}, 5000)
		})
		onBeforeUnmount(() => {
			if (interval) {
				clearInterval(interval)
			}
		})
	},
}
</script>