<template>
	<ul class="room-list">
		<li class="room-list__item" v-for="room in rooms" :key="room.roomid">
			<home-page-room v-bind="room"></home-page-room>
		</li>
	</ul>
</template>

<script>
import HomePageRoom from './HomePageRoom'
import { rooms } from '@/services/Room'

export default {
	name: 'room-page-rooms',
	components: {
		HomePageRoom,
	},
	setup() {
		return {
			rooms,
		}
	},
}
</script>

<style lang="scss" scoped>
.room-list {
	width: 100%;

	&__item {
		width: 100%;

		&:not(:last-child) {
			margin-bottom: 2rem;
		}
	}
}
</style>