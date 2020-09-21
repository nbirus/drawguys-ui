<template>
	<div class="page page--limit page--center room" v-if="roomState.roomid">
		<!-- title -->
		<transition name="pop-up" mode="out-in" appear>
			<h1 class="room__header" v-text="roomState.roomname"></h1>
		</transition>

		<!-- card -->
		<div class="room__card card">
			<room-users class="room__users" />
			<room-ready-btn class="room__ready" />
			<room-chat class="room__chat" />
		</div>
	</div>
</template>

<script>
import RoomChat from './RoomChat'
import RoomUsers from './RoomUsers'
import RoomReadyBtn from './RoomReadyBtn'
import { roomState } from '@/services/Room'

export default {
	name: 'room-page',
	components: { RoomChat, RoomUsers, RoomReadyBtn },
	setup() {
		return {
			roomState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.room {
	justify-content: flex-start;

	&__header {
		margin-top: $margin-top;
		margin-bottom: 2.5rem;
	}
	&__card {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 5rem 1fr;
		width: 100%;
		border: none;
		overflow: hidden;
	}
	&__users {
		grid-row: 1;
		grid-column: 1;
		padding: 1rem;
	}
	&__ready {
		grid-row: 2;
		grid-column: 1;
		padding: 1rem;
		border-top: solid thin $border-color;
	}
	&__chat {
		grid-row: span 2;
		grid-column: 2;
		border-left: solid thin $border-color;
		background-color: lighten($light, 2);
	}
}
</style>
