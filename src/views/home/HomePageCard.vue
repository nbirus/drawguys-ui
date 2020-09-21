<template>
	<router-link class="card" :to="`/${roomid}`">
		<div class="card__header">
			<h3 v-text="roomname"></h3>
		</div>
		<div class="card__body"></div>
	</router-link>
</template>

<script>
export default {
	name: 'home-page-card',
	props: ['roomid', 'roomname'],
}
</script>

<style lang="scss" scoped>
.card {
	display: block;
	width: 100%;
	padding: 1.5rem;
	text-decoration: none;
}
</style>
