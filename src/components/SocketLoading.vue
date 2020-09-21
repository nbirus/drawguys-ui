<template>
	<div class="page page--center">
		<transition name="pop-up" mode="out-in" appear>
			<div class="flex">
				<i class="spinner mr-3"></i>
				<h4>Loading...</h4>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'socket-loading',
}
</script>

<style lang="scss" scoped>
.page {
	flex-direction: row;
}
.flex {
	display: flex;
	align-items: center;
}
.spinner {
	transform: translateY(-2px);
}
</style>