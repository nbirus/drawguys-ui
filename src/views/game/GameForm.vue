<template>
	<form
		class="form-card card nudge"
		ref="form"
		:class="[`outline-${color}`, { focus, ready: focus }]"
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
			@blur="focus = false"
			autocomplete="off"
		/>
		<transition name="form-button" mode="out-in">
			<button tabindex="0" v-if="value" type="submit" class="lg">
				Send
			</button>
		</transition>
	</form>
</template>

<script>
import { roomGuess } from '@/services/Room'
import { ref, watch } from 'vue'
export default {
	name: 'game-form',
	inheritAttrs: false,
	props: ['color'],
	setup(props, { emit }) {
		let form = ref(null)
		let input = ref(null)
		let value = ref('')
		let focus = ref(false)

		function onSubmit() {
			roomGuess(value.value)
			value.value = ''
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

		return {
			input,
			form,
			value,
			focus,
			onSubmit,
			toggleFocus,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.form-card {
	display: flex;
	align-items: center;
	padding: 0.75rem 1rem 0.75rem 0.75rem;
	width: 350px;
	transition: transform 0.2s ease;
	overflow: hidden;
	position: relative;
	border: solid thin $border-color;
	top: 2.5rem;

	input {
		flex: 0 1 100%;

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
		padding-left: 1.25rem;
		padding-right: 1rem;
		height: 50px;
		font-size: 1.1rem;
		font-weight: $regular;

		i {
			font-size: 1.2rem;
			transform: translateY(2px);
		}
		&:focus {
			color: $black !important;
		}
		&:hover {
			background-color: darken($light, 5);
		}
	}

	&.focus {
		transform: scale(1.025);

		button {
			border-color: $black;
			box-shadow: 0 0 0 1px $black;

			&:hover {
				border-color: $black;
			}
		}
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
</style>
