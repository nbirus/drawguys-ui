<template>
	<div class="page home">
		<h1 class="home__title">Create or join a room</h1>
		<input type="text" />
		<form-card class="home__form-card" @submit="createRoom" />
		<home-page-list class="home__room-list" />
		<router-link class="home__username-link" to="/username">Choose another name</router-link>
	</div>
</template>

<script>
import HomePageList from './HomePageList'
import FormCard from '@/components/FormCard'
export default {
	name: 'home-page',
	components: {
		HomePageList,
		FormCard,
	},
	setup() {
		function createRoom(username) {}

		return {
			createRoom,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.home {
	&__title {
		margin-bottom: 2.5rem;
	}
	&__form-card {
		margin-bottom: 2.5rem;
	}
	&__room-list {
	}
	&__username-link {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		font-size: 1.1rem;
	}
}
</style>