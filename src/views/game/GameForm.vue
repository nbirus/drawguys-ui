<script>
import { socket } from '@/services/Socket'
import { roomState, setTyping, roomGuess } from '@/services/Room'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
export default {
	name: 'game-form',
	inheritAttrs: false,
	setup() {
		let form = ref(null)
		let input = ref(null)
		let value = ref('')
		let focus = ref(false)
		let fail = ref(false)
		let correct = ref(false)
		let submitKey = ref(0)
		let match = computed(() => roomState.userState.match)
		let timer = computed(() => roomState.gameState.timer)
		let color = computed(() =>
			match.value ? 'green' : roomState.gameState.turnUser.color
		)
		let focusColor = computed(() => {
			if (correct.value) {
				return 'green'
			} else if (fail.value) {
				return 'red'
			} else if (focus.value) {
				return color.value
			} else return ''
		})

		socket.on('guess_result', result => {
			if (result) {
				onCorrect()
			} else {
				onFail()
			}
		})

		function onCorrect() {
			correct.value = true
		}
		function onFail() {
			fail.value = true
			setTimeout(() => {
				fail.value = false
			}, 200)
		}

		onMounted(() => {
			nextTick(() => {
				input.value.focus()
			})
		})

		let timerWarning = computed(
			() =>
				roomState.gameState.timer <= 3 &&
				roomState.gameState.event === 'turn_start'
		)

		function onSubmit() {
			submitKey.value++
			roomGuess(value.value)
			value.value = ''
			nextTick(() => {
				input.value.focus()
			})
		}

		watch(value, togglePopover)
		watch(focus, togglePopover)

		function togglePopover() {
			if (value.value && focus.value) {
				showPopover()
			} else {
				hidePopover()
			}
		}
		function showPopover() {
			let oldPopover = document.getElementById('popover')
			let popover = document.createElement('div')
			let parent = form.value.parentElement
			if (!oldPopover) {
				popover.classList.add('popover-form-card')
				popover.classList.add('board')
				popover.id = 'popover'
				popover.innerHTML = `<div>Press <code>Enter</code> to guess</div>`
				parent.appendChild(popover)
			}
		}
		function hidePopover() {
			let popover = document.getElementById('popover')
			if (popover) {
				popover.remove()
			}
		}
		function toggleFocus() {
			input.value.focus()
			input.value.select()
		}

		onBeforeUnmount(() => {
			hidePopover()
		})

		let word = computed(() => roomState.gameState.word)
		let placeholder = computed(() => {
			let placeholderLines = ''
			word.value.split('').forEach(letter => {
				placeholderLines += letter === ' ' ? ' ' : '_'
			})
			return placeholderLines
		})

		return {
			input,
			form,
			value,
			focus,
			onSubmit,
			toggleFocus,
			setTyping,
			roomState,
			submitKey,
			match,
			timer,
			timerWarning,
			color,
			fail,
			focusColor,
			placeholder,
		}
	},
}
</script>

<template>
	<form
		class="form-card card nudge outline"
		ref="form"
		:class="[`outline-${focusColor}`, { fail, focus, ready: focus }]"
		@submit.prevent="onSubmit"
	>
		<input
			ref="input"
			type="text"
			class="lg b-none mr-2"
			placeholder="Guess word..."
			v-model="value"
			required
			@focus="focus = true"
			@blur="focus = false"
			autocomplete="off"
		/>
		<transition name="form-button" mode="out-in">
			<button :class="`btn-${color}`" tabindex="0" type="submit" class="lg">
				<i class="ri-send-plane-fill"></i>
			</button>
		</transition>
	</form>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.form-card {
	display: flex;
	align-items: center;
	padding: 0.75rem 0.75rem 0.75rem 0.75rem;
	width: 360px;
	transition: transform 0.2s ease;
	position: relative;
	border: solid thin $border-color;
	pointer-events: auto;

	&__placeholder {
		position: absolute;
		top: 8px;
		right: 0px;
		bottom: 0px;
		left: 29px;
		display: flex;
		align-items: center;
		letter-spacing: 2px;
		pointer-events: none;
		font-size: 1.3rem;
		font-stretch: ultra-condensed;
	}

	input {
		flex: 0 1 100%;
		letter-spacing: 1px;
		font-stretch: ultra-condensed;

		&::selection {
			background: $black;
			color: white;
		}
	}
	button {
		position: relative;
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 1.1rem;
		font-weight: $regular;
		padding: 0 1rem;
		color: $text-extra-light;

		i {
			font-size: 1.2rem;
			transform: translateY(2px);
		}
		span {
			margin-left: 0.2rem;
		}
	}

	@each $color, $name in $colors {
		.btn-#{$name} {
			&:focus {
				color: $color !important;
			}
			&:hover {
				color: $color;
				background-color: fade-out($color, 0.9);
			}
		}
		&.focus .btn-#{$name} {
			color: $color;
			// box-shadow: inset 0 0 0 3px $color;
			&:hover {
				border-color: $color;
			}
		}
	}

	&.focus {
		transform: scale(1.025);
	}
	&.outline-yellow {
		box-shadow: inset 0 0 0 3px $yellow;
	}
	&.guess {
		animation: submit 0.2s;
	}
}

@keyframes submit {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(0.975);
	}
	100% {
		transform: scale(1);
	}
}
@keyframes popover {
	0% {
		transform: translateY(2rem);
		opacity: 0;
	}
	100% {
		transform: translateY(0);
		opacity: 1;
	}
}
@keyframes after {
	0% {
		width: 100%;
		opacity: 1;
	}
	100% {
		width: 0%;
		opacity: 1;
	}
}
</style>
