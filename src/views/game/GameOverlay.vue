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
		let playersGuessed = computed(
			() =>
				Object.values(roomState.usersState).filter(user => user.match).length
		)
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
			playersGuessed,
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
				<!-- if it's another's turn -->
				<!-- <div class="waiting" v-else>
					<div>
						<b :class="`text-${turnUser.color} bg-${turnUser.color} bg-fade`">{{
							turnUser.username
						}}</b>
						is selecting a word to draw...
					</div>
				</div> -->
			</div>

			<!-- when turn ends -->
			<!-- <div class="turn-end" v-else-if="event === 'turn_end'">
				<transition name="pop-up" mode="out-in" appear>
					<h3>
						The word was <b>{{ gameState.word }}</b>
					</h3>
				</transition>
				<transition name="pop-up" mode="out-in" appear>
					<div
						class="turn-end-banner"
						:class="user.turnScore >= 0 ? 'positive' : 'negative'"
					>
						<div class="turn-end-banner__score">
							<b v-text="Math.abs(user.turnScore)"></b>
						</div>
						<div class="turn-end-banner__text">
							<span v-if="!user.drawing">
								<span v-if="user.match"
									>You guessed the word in <b>{{ user.matchTime }}s</b></span
								>
								<span v-else>You didn't guess the word</span>
							</span>
							<span v-else
								><b>{{ playersGuessed }}</b>
								{{ playersGuessed > 1 ? 'players' : 'player' }} guessed the
								word</span
							>
						</div>
					</div>
				</transition>
			</div> -->

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
	border-radius: $border-radius;
	overflow: hidden;

	&.fixed {
		position: fixed;
		background-color: white;
		z-index: 999;
	}

	&__event {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		width: 100%;
		height: 100%;
	}
}

.turn-end-banner {
	display: flex;
	align-items: center;
	margin-top: 3rem;
	height: 40px;

	border-radius: $border-radius;
	overflow: hidden;

	&__score {
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0 0.5rem;
		font-size: 0.9rem;
		background-color: darken($green, 10);
		color: white;

		&:before {
			content: '+';
		}
	}
	&__text {
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0 0.75rem;
		font-size: 0.8rem;
		background-color: $green;
		color: white;

		b {
			margin-left: 0.15rem;
		}
	}

	&.negative {
		.turn-end-banner {
			&__score {
				background-color: darken($red, 10);
				&:before {
					content: '-';
				}
			}
			&__text {
				background-color: darken($red, 1);
			}
		}
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
			button {
				font-size: 1.1rem;
				padding: 0.75rem 1rem;
			}
			&:not(:last-child) {
				margin-right: 1rem;
			}
		}
	}
}
.waiting {
	display: flex;
	align-items: center;
	flex-direction: column;
	font-size: 1.1rem;

	b {
		padding: 0.5rem;
		border-radius: $border-radius;
		margin-right: 0.25rem;
	}
}
.turn-end {
	display: flex;
	align-items: center;
	flex-direction: column;
}

.pre_turn {
	@include stripe(white, darken(white, 2));
	position: absolute;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;

	&:after {
		content: '';
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		background: radial-gradient(transparent, fade-out($black, 0.9)), transparent;
		background: radial-gradient(
			transparent,
			fade-out(white, 0.5),
			fade-out(white, 0)
		);
		pointer-events: none;
	}
}
</style>
