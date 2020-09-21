<template>
	<router-link class="card" :to="`/${roomid}`">
		<div class="card__header"></div>
		<div class="card__body"></div>
	</router-link>
</template>

<script>
export default {
	name: 'home-page-card',
	props: ['roomid'],
}
</script>

<style lang="scss" scoped>
.card {
	width: 100%;
	padding: 1.5rem;
}
</style>