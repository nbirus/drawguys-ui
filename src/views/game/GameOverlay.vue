<script>
import {
	roomState,
	getWords,
	setWord,
	setTyping,
	roomGuess,
} from '@/services/Room'
import { computed, ref, watch } from 'vue'
import GameScoreboard from './GameScoreboard'

export default {
	name: 'game-overlay',
	components: {
		GameScoreboard,
	},
	setup() {
		let gameState = computed(() => roomState.gameState)
		let event = computed(() => roomState.gameState.event)
		let turnUser = computed(() => roomState.gameState.turnUser)
		let user = computed(() => roomState.userState)
		let words = ref([])

		watch(
			() => event.value,
			() => {
				// set typing to false and reset guess
				setTyping(false)

				// get new words
				if (event.value === 'pre_turn') {
					words.value = getWords()
				}

				// set default if no selection made
				if (event.value === 'turn_start' && !gameState.value.word) {
					console.log('NO SELECTOIN')
					setWord(words.value[0])
				}
			},
			{
				immediate: true,
			}
		)

		let fixed = computed(() =>
			['round_start', 'round_end', 'game_end'].includes(event.value)
		)

		return {
			event,
			turnUser,
			roomState,
			gameState,
			user,
			words,
			setWord,
			fixed,
		}
	},
}
</script>

<template>
	<div class="game-overlay" :class="{ fixed }">
		<div class="game-overlay__event" :class="event">
			<!-- when turn starts -->
			<div v-if="event === 'pre_turn'">
				<!-- if it's your turn -->
				<div v-if="user.selecting" class="selecting">
					<h3>Select a word to draw...</h3>
					<ul class="selecting__words">
						<li class="selecting__words-word" v-for="word in words" :key="word">
							<button @click="setWord(word)" v-text="word"></button>
						</li>
					</ul>
				</div>
				<div class="waiting" v-else>
					<b :class="`text-${turnUser.color}`">{{ turnUser.username }}</b> is
					selecting a word to draw...
				</div>

				<!-- <div v-if="user.selecting"></div>
				<div v-else>{{ turnUser.username }} is selecting a word</div> -->
			</div>

			<!-- when turn ends -->
			<div v-else-if="event === 'turn_end'">
				<h3>
					The word was <b>{{ gameState.word }}</b>
				</h3>
			</div>

			<!-- round ends -->
			<div v-else-if="event === 'round_end'">
				<transition name="pop-up" mode="out-in" appear>
					<h1 class="mb-7" v-if="gameState.round !== gameState.numberOfRounds">
						Round {{ gameState.round }} Results
					</h1>
					<h1 class="mb-7" v-else>Game Over</h1>
				</transition>
			</div>

			<!-- scoreboard -->
			<game-scoreboard v-if="fixed" />
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
	pointer-events: none;

	&.fixed {
		position: fixed;
		background-color: white;
		z-index: 999;
	}

	&__event {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}

.selecting {
	display: flex;
	align-items: center;
	flex-direction: column;

	&__words {
		display: flex;
		align-items: center;
		margin-top: 2rem;
		pointer-events: auto;

		&-word {
			&:not(:last-child) {
				margin-right: 1rem;
			}
		}
	}
}
.waiting {
	padding: 1.25rem 1.75rem;
	background-color: $light;
	border-radius: $border-radius;
	font-size: 1.2rem;
	// @include stripe(lighten($light, 1), darken($light, 1));
}
</style>
