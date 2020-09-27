<template>
	<div class="page page--limit page--center room" v-if="roomState.roomid">
		<!-- title -->
		<transition name="pop-up" mode="out-in" appear>
			<h1 class="room__header" v-text="roomState.roomname"></h1>
		</transition>

		<!-- card -->
		<transition name="pop-up" mode="out-in" appear>
			<div class="room__card card delay-1 " :class="{ ready }">
				<room-users class="room__users" @share="showModalOpen = true" />
				<div class="room__ready">
					<room-ready-btn />
				</div>
				<room-chat class="room__chat" />
				<transition name="pop-up" mode="out-in" appear>
					<room-countdown v-if="roomState.countdownActive" />
				</transition>
			</div>
		</transition>

		<!-- overlays -->
		<room-share-modal v-model:open="showModalOpen" />
	</div>
</template>

<script>
import RoomChat from './RoomChat'
import RoomUsers from './RoomUsers'
import RoomReadyBtn from './RoomReadyBtn'
import RoomShareModal from './RoomShareModal'
import RoomCountdown from './RoomCountdown'
import { roomState } from '@/services/Room'
import { computed, ref, watch } from 'vue'

export default {
	name: 'room-page',
	components: {
		RoomChat,
		RoomUsers,
		RoomReadyBtn,
		RoomShareModal,
		RoomCountdown,
	},
	setup() {
		let showModalOpen = ref(false)

		return {
			roomState,
			showModalOpen,
			ready: computed(() => roomState.user.ready),
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.room {
	justify-content: flex-start;
	position: relative;

	&__header {
		margin-top: $margin-top;
		margin-bottom: 2.5rem;
	}
	&__card {
		display: grid;
		grid-template-columns: 0.9fr 1fr;
		grid-template-rows: auto auto;
		width: 100%;
		border: none;
		overflow: hidden;
		position: relative;
	}
	&__users {
		grid-row: 1;
		grid-column: 1;
		padding: 2.25rem 2rem 0;
		margin-bottom: 0.75rem;
	}
	&__ready {
		grid-row: 2;
		grid-column: 1;
		padding: 0 1rem 1rem;
	}
	&__chat {
		grid-row: span 2;
		grid-column: 2;
		border-left: solid thin $border-color;
		background-color: lighten($light, 1);
	}
}
</style>
