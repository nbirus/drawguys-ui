<template>
	<transition-group name="list" tag="ul" mode="out-in" class="room-list" appear>
		<li class="room-list__item" :class="`delay-${i + 1}`" v-for="(room, i) in rooms" :key="i">
			<home-page-room v-bind="room"></home-page-room>
		</li>
	</transition-group>
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