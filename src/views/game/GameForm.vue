<script>
import { roomState, setTyping, roomGuess } from '@/services/Room'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
export default {
	name: 'game-form',
	inheritAttrs: false,
	setup() {
		let form = ref(null)
		let input = ref(null)
		let value = ref('')
		let focus = ref(false)
		let submitKey = ref(0)
		let match = computed(() => roomState.userState.match)
		let timer = computed(() => roomState.gameState.timer)
		let color = computed(() =>
			match.value ? 'green' : roomState.gameState.turnUser.color
		)

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
		}
	},
}
</script>

<template>
	<form
		class="form-card card nudge"
		ref="form"
		:class="[
			`outline-${timerWarning ? color : color}`,
			{ focus, ready: focus },
		]"
		@submit.prevent="onSubmit"
	>
		<input
			ref="input"
			type="text"
			class="lg b-none mr-2"
			placeholder="Type to guess..."
			v-model="value"
			required
			@focus="focus = true"
			@blur="
				() => {
					setTyping(false)
					focus = false
				}
			"
			@keydown="setTyping(true)"
			@keypress.enter="setTyping(false)"
			@keypress.delete="setTyping(false)"
			autocomplete="off"
		/>
		<transition name="form-button" mode="out-in">
			<button
				:class="`btn-${color}`"
				tabindex="0"
				v-if="value"
				type="submit"
				class="lg"
			>
				Send
				<span v-if="timerWarning">({{ timer }})</span>
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
	animation: submit 0.2s;
	pointer-events: auto;

	input {
		flex: 0 1 auto;
		width: 225px;

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
				background-color: fade-out($color, 0.9);
			}
		}
		&.focus .btn-#{$name} {
			border-color: $color;
			box-shadow: inset 0 0 0 3px $color;
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
