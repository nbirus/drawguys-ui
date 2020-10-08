<script>
import { roomState, getWords, setWord } from '@/services/Room'
import { computed, ref, watch } from 'vue'

export default {
	name: 'game-overlay',
	setup() {
		let event = computed(() => roomState.gameState.event)
		let turnUser = computed(() => roomState.gameState.turnUser)
		let user = computed(() => roomState.userState)
		let words = ref([])

		watch(
			event.value,
			() => {
				if (event.value === 'pre_turn' && user.value.selecting) {
					words.value = getWords()
				}
			},
			{
				immediate: true,
			}
		)

		return {
			event,
			turnUser,
			roomState,
			user,
			words,
			setWord,
		}
	},
}
</script>

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
				<div v-if="user.selecting" class="selecting">
					<h3>Select a word to draw...</h3>
					<ul class="selecting__words">
						<li class="selecting__words-word" v-for="word in words" :key="word">
							<button @click="setWord(word)" v-text="word"></button>
						</li>
					</ul>
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

.selecting {
	display: flex;
	align-items: center;
	flex-direction: column;

	&__words {
		display: flex;
		align-items: center;
		margin-top: 2rem;

		&-word {
			&:not(:last-child) {
				margin-right: 1rem;
			}
		}
	}
}
</style>
