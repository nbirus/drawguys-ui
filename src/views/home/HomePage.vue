<template>
	<div class="page page--limit-sm page--center home">
		<!-- title -->
		<transition name="pop-up" mode="out-in" appear>
			<h1 class="home__title mb-6">Create or join a room</h1>
		</transition>

		<!-- form card -->
		<transition name="pop-up" mode="out-in" appear>
			<div class="delay-1 ps">
				<form-card
					init-value="test"
					class="home__form-card"
					color="blue"
					enter-text="create room"
					icon="check"
					placeholder="Enter a room name..."
					maxlength="20"
					@submit="createRoom"
				>
					<span>Create</span>
					<i class="ri-arrow-right-fill ml-1"></i>
				</form-card>
			</div>
		</transition>

		<!-- room list -->
		<home-page-rooms class="home__room-list" />

		<div class="home__username-link">
			<!-- Welcome,
			<b>{{ userState.username }}</b> --->
			<router-link to="/username">Choose another username</router-link>
		</div>
	</div>
</template>

<script>
import HomePageRooms from './HomePageRooms'
import FormCard from '@/components/FormCard'
import { createRoom, getRooms, setInactive } from '@/services/Room'
import { userState } from '@/services/User'

export default {
	name: 'home-page',
	components: {
		HomePageRooms,
		FormCard,
	},
	setup() {
		getRooms()
		setInactive()
		return {
			createRoom,
			userState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.home {
	justify-content: flex-start;
	align-items: center;

	&__title {
		margin-top: $margin-top;
	}
	&__form-card {
		margin-bottom: 3rem;
	}
	&__room-list {
		padding-top: 3rem;
		padding-bottom: 3rem;
		width: $max-width-sm;
	}
	&__username-link {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		font-size: 1.1rem;
	}
}
.ps {
	position: relative;
}
</style>