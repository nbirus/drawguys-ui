<template>
	<div class="room-columns">
		<div class="empty" v-if="roomsEven.length === 0">
			<i class="ri-forbid-line mr-2"></i>
			No rooms found
		</div>

		<transition-group
			name="list"
			tag="ul"
			mode="out-in"
			class="room-list"
			appear
		>
			<li
				class="room-list__item"
				:class="`delay-${i + 1}`"
				v-for="(room, i) in roomsEven"
				:key="i"
			>
				<home-page-room v-bind="room" @open="$emit('open')"></home-page-room>
			</li>
		</transition-group>
		<transition-group
			name="list"
			tag="ul"
			mode="out-in"
			class="room-list"
			appear
		>
			<li
				class="room-list__item"
				:class="`delay-${i + 2}`"
				v-for="(room, i) in roomsOdd"
				:key="i"
			>
				<home-page-room v-bind="room" @open="$emit('open')"></home-page-room>
			</li>
		</transition-group>
	</div>
</template>

<script>
import HomePageRoom from './HomePageRoom'
import { rooms } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'room-page-rooms',
	components: {
		HomePageRoom,
	},
	setup() {
		let roomsOdd = computed(() =>
			Object.values(rooms.value).filter((room, i) => i % 2 === 1)
		)
		let roomsEven = computed(() =>
			Object.values(rooms.value).filter((room, i) => i % 2 === 0)
		)
		return {
			roomsOdd,
			roomsEven,
		}
	},
}
</script>

<style lang="scss" scoped>
.room-columns {
	display: grid;
	grid-gap: 1.5rem;
	grid-template-columns: 1fr 1fr;
	width: 100%;
}
.room-list {
	width: 100%;

	&__item {
		height: auto;
		width: 100%;
		position: relative;

		&:not(:last-child) {
			margin-bottom: 1.5rem;
		}
	}
}
.empty {
	grid-column: span 2;
	text-align: center;
	margin-top: 3rem;
	font-size: 1.2rem;
	opacity: 0.25;
	display: flex;
	align-items: center;
	justify-content: center;

	i {
		font-size: 1.35rem;
	}
}
</style>