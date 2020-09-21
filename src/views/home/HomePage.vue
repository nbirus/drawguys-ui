<template>
	<div class="page page--limit page--center home">
		<!-- title -->
		<transition name="pop-up" mode="out-in" appear>
			<h1 class="home__title">Create or join a room</h1>
		</transition>

		<!-- form card -->
		<transition name="pop-up" mode="out-in" appear>
			<form-card
				class="home__form-card"
				color="black"
				submit-text="Create"
				placeholder="Room name..."
				@submit="createRoom"
			/>
		</transition>

		<!-- room list -->
		<home-page-list class="home__room-list" />

		<router-link class="home__username-link" to="/username">Choose another name</router-link>
	</div>
</template>

<script>
import HomePageList from './HomePageList'
import FormCard from '@/components/FormCard'
import { createRoom } from '@/services/Room'

export default {
	name: 'home-page',
	components: {
		HomePageList,
		FormCard,
	},
	setup() {
		return {
			createRoom,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.home {
	justify-content: flex-start;

	&__title {
		margin-top: $margin-top;
		margin-bottom: 2.5rem;
	}
	&__form-card {
		margin-bottom: 3rem;
	}
	&__room-list {
		padding-top: 3rem;
	}
	&__username-link {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		font-size: 1.1rem;
	}
}
</style>