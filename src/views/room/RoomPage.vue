<template>
	<div
		class="page page--limit page--center room"
		v-if="roomState.roomid && !hidePage"
	>
		<!-- countdown -->
		<!-- <room-countdown v-if="roomState.timerActive" /> -->

		<!-- inner -->
		<div class="room__inner">
			<!-- title -->
			<transition name="pop-up" mode="out-in" appear>
				<h1 class="room__header" v-text="roomState.roomname"></h1>
			</transition>
			<!-- card -->
			<transition name="pop-up" mode="out-in" appear>
				<div
					class="room__card card delay-1 "
					:class="{ ready, active: roomState.timerActive }"
				>
					<room-users class="room__users" @share="showModalOpen = true" />
					<div class="room__ready">
						<room-ready-btn v-if="!hidePage" />
					</div>
					<room-chat class="room__chat" />
				</div>
			</transition>
		</div>

		<!-- share modal -->
		<room-share-modal v-model:open="showModalOpen" />

		<div class="room__username-link">
			<router-link to="/">Leave Game</router-link>
		</div>
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
import router from '@/router'

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
		let currentRoute = router.currentRoute.value
		let roomid = currentRoute.params.id
		let hidePage = ref(false)

		watch(
			roomState,
			() => {
				if (roomState.gameState.active) {
					router.push(`/${roomid}/g`)
				}
				if (roomState.timerActive) {
					hidePage = roomState.timer === 0
				}
			},
			{
				immediate: true,
			}
		)

		return {
			hidePage,
			roomState,
			showModalOpen,
			ready: computed(() => roomState.userState.ready),
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.room {
	justify-content: flex-start;
	position: relative;

	&__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
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
		width: 625px;

		&.active {
			animation: bounce 1s infinite linear;
		}

		&::after {
			content: '';
			transition: box-shadow 0.4s ease;
		}

		&.active:after,
		&.ready:after {
			content: '';
			position: absolute;
			pointer-events: none;
			top: 0px;
			right: 0px;
			bottom: 0px;
			left: 0px;
			box-shadow: inset 0 0 0 4px $green;
			border-radius: $border-radius;
		}
	}
	&__users {
		grid-row: 1;
		grid-column: 1;
		padding: 2.25rem 1.75rem 0;
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
	&__username-link {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		font-size: 1.1rem;

		&.right {
			left: 8rem;
		}
	}
}
</style>
