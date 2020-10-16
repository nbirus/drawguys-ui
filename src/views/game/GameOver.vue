<template>
	<div class="game-over">
		<h1 class="mb-7">{{ winner }} wins!</h1>

		<game-scoreboard />

		<div class="game-over__actions">
			<button
				class="custom striped mr-2"
				@click="$router.push(`/${$route.params.id}`)"
			>
				Back to lobby
			</button>
			<button class="custom striped" @click="$router.push('/')">
				Leave
			</button>
		</div>
	</div>
</template>

<script>
import { toggleReady, roomState } from '@/services/Room'
import GameScoreboard from './GameScoreboard'
import Timer from '@/components/Timer'
import { computed } from 'vue'
export default {
	name: 'game-over',
	components: {
		Timer,
		GameScoreboard,
	},
	setup() {
		let winner = computed(() => {
			let users = Object.values(roomState.usersState).sort(
				(a, b) => b.score - a.score
			)
			return users[0].username
		})
		return {
			winner,
			toggleReady,
			roomState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.game-over {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: fixed;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	background-color: #fff;

	&__actions {
		margin-top: 1rem;
	}
}
</style>
