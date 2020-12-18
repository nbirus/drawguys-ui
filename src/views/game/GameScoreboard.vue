<template>
	<div class="scoreboard">
		<div class="scoreboard__users" v-if="!showHistory">
			<h2>Round {{ roomState.gameState.round }} Over</h2>

			<!-- <div class="rounds">/4</div> -->
			<transition-group tag="ul" name="list" appear>
				<li
					class="scoreboard__users-user"
					v-for="(user, i) of users"
					:class="`delay-${i}`"
					:key="user.userid"
				>
					<user
						v-bind="user"
						:showPlace="!showHistory && showPlaces"
						:elevated="i === 0"
						:place="i + 1"
						:first="showPlaces ? i === 0 : false"
						large
					/>
				</li>
			</transition-group>
		</div>

		<div class="scoreboard__rounds-left" v-else-if="showRoundsLeft">
			<transition name="list" appear>
				<h2 v-if="roomState.gameState.round === 1">Last Round!</h2>
				<h2 v-else>{{ 5 - roomState.gameState.round }} Rounds Left</h2>
			</transition>
		</div>

		<div v-else class="scoreboard__history" :class="`size-${history.length}`">
			<transition-group
				class="list"
				:class="`size-${history.length}`"
				tag="ul"
				name="list"
				appear
			>
				<game-history-drawing
					v-for="(historyItem, i) in history"
					:key="i"
					:size="history.length"
					:img="historyItem"
					v-bind="roomState.gameState.history[i]"
				/>
			</transition-group>
		</div>
	</div>
</template>

<script>
import GameHistoryDrawing from '@/views/game/GameHistoryDrawing'
import User from '@/components/User'
import { roomState } from '@/services/Room'
import { computed, onMounted, ref, watch } from 'vue'
import { history } from '@/services/Drawing'

export default {
	name: 'game-scoreboard',
	components: {
		GameHistoryDrawing,
		User,
	},
	setup() {
		let showPlaces = ref(false)
		let showHistory = ref(false)
		let showRoundsLeft = ref(false)
		let users = computed(() =>
			Object.values(roomState.usersState).sort((a, b) => b.score - a.score)
		)

		onMounted(() => {
			setTimeout(() => {
				showPlaces.value = true
			}, 350)
			setTimeout(() => {
				showHistory.value = true
			}, 1550)
			setTimeout(() => {
				showRoundsLeft.value = true
			}, 4550)
		})

		return {
			users,
			roomState,
			history,
			showHistory,
			showPlaces,
			showRoundsLeft,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.scoreboard {
	position: fixed;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;

	display: flex;

	&__users {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;

		h2 {
			margin-bottom: 3rem;
			font-weight: $bold;
		}
		.rounds {
			margin-bottom: 3rem;
			padding: 0.35rem;
			font-size: 0.9rem;
			border-radius: $border-radius;
			background-color: darken($light, 3);
		}

		&-user {
			margin-bottom: 1.25rem;
			width: 225px;

			&:first-child {
				margin-bottom: 1.75rem;
			}
		}
	}
	&__history {
		flex: 0 1 100%;
		width: 100%;
		padding: 5rem 2rem;
		overflow-y: auto;

		display: flex;
		align-items: center;
		flex-direction: column;

		&.size-2,
		&.size-3,
		&.size-4 {
			justify-content: center;
		}

		.list {
			width: auto;
			height: auto;
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-gap: 2rem;
			overflow: visible;

			&.size-3 {
				grid-auto-rows: calc(502px / 1.65);
				.card:nth-child(3) {
					transform: translateX(calc(792px / 3.15));
				}
			}
			&.size-5 {
				.card:nth-child(5) {
					transform: translateX(calc(792px / 4));
				}
			}
			&.size-7 {
				grid-auto-rows: calc(502px / 2);
				.card:nth-child(7) {
					transform: translateX(calc(792px / 4));
				}
			}
			&.size-9 {
				.card:nth-child(9) {
					transform: translateX(calc(792px / 4));
				}
			}
		}
	}
	&__rounds-left {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
}
</style>
