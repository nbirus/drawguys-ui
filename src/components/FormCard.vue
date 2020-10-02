<template>
	<form
		class="form-card card outline-black nudge"
		ref="form"
		:class="{ focus, ready: focus }"
		@submit.prevent="onSubmit"
	>
		<div class="wave"></div>
		<input
			ref="input"
			type="text"
			class="lg b-none mr-2"
			v-bind="$attrs"
			v-model="value"
			required
			@focus="focus = true"
			@blur="focus = false"
			autocomplete="off"
		/>
		<transition name="form-button" mode="out-in">
			<button tabindex="0" v-if="value" type="submit" class="lg">
				<slot></slot>
			</button>
		</transition>
	</form>
</template>

<script>
import { ref, watch } from 'vue'
export default {
	name: 'form-card',
	inheritAttrs: false,
	props: ['submitText', 'size', 'color', 'initValue', 'icon', 'enterText'],
	setup(props, { emit }) {
		let form = ref(null)
		let input = ref(null)
		let value = ref(props.initValue)
		let focus = ref(false)

		function onSubmit() {
			emit('submit', value.value)
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
				popover.innerHTML = `<div>Press <code>Enter</code> to ${props.enterText}</div>`
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

<style lang="scss">
@import '@/styles/component.scss';
.form-card {
	display: flex;
	align-items: center;
	padding: 0.75rem 1rem 0.75rem 0.75rem;
	width: 450px;
	transition: transform 0.2s ease;
	overflow: hidden;
	position: relative;

	input {
		flex: 0 1 100%;

		&::selection {
			background: $black;
			color: white;
		}
	}
	button {
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
	}

	&.focus {
		transform: scale(1.025);

		button {
			box-shadow: 0 0 0 2px $black;
		}
	}
}
.wave {
	background: url(../assets/wave.svg) repeat-x;
	position: absolute;
	top: 0;
	width: 6400px;
	height: 100%;
	animation: wave 30s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
	transform: translate3d(0, 0, 0);
	transform: scale(4);
	opacity: 0.1;
	pointer-events: none;
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
@keyframes wave {
	0% {
		margin-left: 0;
	}
	100% {
		margin-left: -1600px;
	}
}

@keyframes swell {
	0%,
	100% {
		transform: translate3d(0, -25px, 0);
	}
	50% {
		transform: translate3d(0, 5px, 0);
	}
}
</style>