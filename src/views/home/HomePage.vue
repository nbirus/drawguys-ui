<template>
	<div class="page page--limit-sm page--center home">
		<!-- title -->
		<transition name="pop-up" mode="out-in" appear>
			<h1 class="home__title mb-6">Create or join a room</h1>
		</transition>

		<!-- form card -->
		<transition name="pop-up" mode="out-in" appear>
			<div class="delay-1">
				<form-card
					init-value
					class="home__form-card"
					color="blue"
					submit-text="Create"
					placeholder="Enter a room name..."
					maxlength="20"
					@submit="createRoom"
				/>
			</div>
		</transition>

		<!-- room list -->
		<home-page-rooms class="home__room-list" />

		<router-link class="home__username-link" to="/username">Choose another name</router-link>
	</div>
</template>

<script>
import HomePageRooms from './HomePageRooms'
import FormCard from '@/components/FormCard'
import { createRoom, getRooms } from '@/services/Room'

export default {
	name: 'home-page',
	components: {
		HomePageRooms,
		FormCard,
	},
	setup() {
		getRooms()
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
		font-size: 1.2rem;
	}
}
</style>