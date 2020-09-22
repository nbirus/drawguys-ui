<template>
	<form class="form-card card" ref="form" :class="{ focus }" @submit.prevent="onSubmit">
		<div class="wave"></div>
		<input
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
			<button v-if="value" type="submit" class="lg">
				<slot></slot>
			</button>
		</transition>
	</form>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
export default {
	name: 'form-card',
	inheritAttrs: false,
	props: ['submitText', 'size', 'color', 'initValue', 'icon', 'enterText'],
	setup(props, { emit }) {
		let form = ref(null)
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
				popover.classList.add('popover')
				popover.id = 'popover'
				popover.innerHTML = `Press <code>Enter</code> to ${props.enterText}`
				parent.appendChild(popover)
			}
		}
		function hidePopover() {
			let popover = document.getElementById('popover')
			if (popover) {
				popover.remove()
			}
		}

		return {
			form,
			value,
			focus,
			onSubmit,
		}
	},
}
</script>

<style lang="scss">
@import '@/styles/component.scss';
.form-card {
	display: flex;
	align-items: center;
	padding: 0.75rem;
	width: 450px;
	transition: transform 0.2s ease;
	overflow: hidden;
	position: relative;

	input {
		flex: 0 1 100%;
	}
	button {
		position: relative;
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		padding-left: 1.25rem;
		padding-right: 1rem;

		i {
			font-size: 1.25rem;
			transform: translateY(2px);
		}

		&:focus {
			color: $blue !important;
		}
	}

	&.focus {
		transform: scale(1.025);
		border: solid thin $blue;

		button {
			border-color: $blue;

			&:hover {
				color: $blue !important;
			}
		}
	}
}
.popover {
	position: absolute;
	right: -1.5rem;
	top: 6rem;
	background-color: fade-out($black, 0.1);
	color: white;
	border-radius: 25px;
	padding: 0.6rem 0.8rem;
	font-size: 0.8rem;
	animation: popover 0.4s ease;
	box-shadow: $box-shadow;

	code {
		background-color: $black;
		border-radius: 4px;
		font-size: 0.7rem;
		padding: 0.2rem 0.3rem;
		margin: 0 2px;
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