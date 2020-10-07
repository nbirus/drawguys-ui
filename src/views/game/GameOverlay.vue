<template>
	<div class="game-overlay" v-if="event === 'pre_turn'">
		<div class="game-overlay__event" :class="event">
			<!-- before round -->
			<div v-if="event === 'pre_round'"></div>

			<!-- on round start -->
			<div v-else-if="event === 'round_start'"></div>

			<!-- when turn starts -->
			<div v-else-if="event === 'pre_turn'">
				<!-- if it's your turn -->
				<div v-if="user.selecting">
					<h3>Select a word to draw...</h3>
				</div>
				<div v-else>{{ turnUser.username }} is selecting a word</div>

				<!-- <div v-if="user.selecting"></div>
				<div v-else>{{ turnUser.username }} is selecting a word</div> -->
			</div>

			<!-- when turn ends -->
			<div v-else-if="event === 'turn_end'"></div>

			<div v-else-if="event === 'round_end'"></div>
			<div v-else-if="event === 'game_end'"></div>
		</div>
	</div>
</template>

<script>
import { roomState } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'game-overlay',
	setup() {
		let event = computed(() => roomState.gameState.event)
		let turnUser = computed(() => roomState.gameState.turnUser)
		let user = computed(() => roomState.userState)
		return {
			event,
			turnUser,
			roomState,
			user,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.game-overlay {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
