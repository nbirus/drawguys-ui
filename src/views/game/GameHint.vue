<template>
	<div class="game-hint" v-if="timer < 35">
		<ul class="input-list">
			<li
				class="input-list__item"
				v-for="(letter, i) in word"
				:key="letter"
				:class="{ visible: visibleIndexes.includes(i) }"
			>
				<span class="input-list__item-space" v-if="letter === ' '"></span>
				<span class="input-list__item-letter">
					<span v-text="letter"></span>
				</span>
			</li>
		</ul>
	</div>
</template>

<script>
import { roomState } from '@/services/Room'
import { computed, reactive, watch } from 'vue'

export default {
	name: 'game-hint',
	setup() {
		let word = computed(() => roomState.gameState.word ?? '')
		let timer = computed(() => roomState.gameState.timer)
		let visibleIndexes = reactive([])
		let wordLength = word.value.length - 1
		let amountToAdd = wordLength > 10 ? 2 : 1

		watch(
			() => timer.value,
			(time) => {
				if (time === 35) {
					visibleIndexes.value = []
				} else if (time === 30) {
					push(amountToAdd)
				} else if (time === 20) {
					push(amountToAdd)
				} else if (time === 10) {
					push(2)
				} else if (time === 5) {
					push(2)
				}
			}
		)

		function push(times) {
			if (visibleIndexes.length >= wordLength - 2) {
				return
			}
			for (let index = 0; index < times; index++) {
				visibleIndexes.push(getRandomExcept(0, wordLength, visibleIndexes))
			}
		}

		return {
			visibleIndexes,
			word,
			timer,
		}
	},
}

function getRandomExcept(min, max, except = []) {
	except.sort(function (a, b) {
		return a - b
	})
	var random = Math.floor(Math.random() * (max - min + 1 - except.length)) + min
	var i
	for (i = 0; i < except.length; i++) {
		if (except[i] > random) {
			break
		}
		random++
	}
	return random
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.input-list {
	display: flex;
	align-items: center;
	margin: 0 1rem 0 0.5rem;
	background-color: white;
	padding: 0.65rem 1.5rem 0.75rem;
	border-radius: 25px;
	border: solid thin $border-color;
	box-shadow: $box-shadow;
	width: auto;

	&__item {
		&-space {
			display: block;
			margin-right: 0.5rem;
		}
		&-letter {
			border-bottom: solid thin darken($border-color, 0);
			margin-right: 0;
			font-size: 1.15rem;
			font-weight: $bold;
			color: $text;

			span {
				opacity: 0;
			}
		}
		&:nth-child(odd) {
			.input-list__item-letter {
				border-bottom: solid thin darken($border-color, 15);
			}
		}
		&.visible span {
			opacity: 1;
		}
		&.visible .input-list__item-letter {
			border-bottom: solid thin darken($border-color, 25);
		}
	}
}
.game-hint {
	position: absolute;
	top: -4rem;
	right: 0;
	left: 0;
	display: flex;
	justify-content: center;
}
</style>