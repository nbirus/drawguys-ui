<template>
	<div class="page page--center">
		<transition name="pop-up" mode="out-in" appear>
			<div class="avatar bg-light bg-darken mb-5">
				<i class="ri-cloud-off-line"></i>
			</div>
		</transition>
		<transition name="pop-up" mode="out-in" appear>
			<h3 class="delay-1">
				Couldn't connect, try
				<a href="javascript:window.location.href=window.location.href">refreshing</a> the page
			</h3>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'socket-error',
}
</script>