<template>
	<form class="form-card card" :class="{ focus }" @submit.prevent="onSubmit">
		<input
			type="text"
			class="lg b-none mr-2"
			v-bind="$attrs"
			v-model="value"
			required
			@focus="focus=true"
			@blur="focus=false"
			autocomplete="off"
		/>
		<button type="submit" class="lg light">
			<!-- <i class="ri-check-line mr-1"></i> -->
			<span v-text="submitText"></span>
		</button>
	</form>
</template>

<script>
import { ref } from 'vue'
export default {
	name: 'form-card',
	inheritAttrs: false,
	props: ['submitText', 'size', 'color', 'initValue'],
	setup(props, { emit }) {
		let value = ref(props.initValue)
		let focus = ref(false)
		function onSubmit() {
			emit('submit', value.value)
		}
		return {
			value,
			focus,
			onSubmit,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.form-card {
	display: flex;
	align-items: center;
	padding: 0.75rem;
	width: 450px;
	transition: transform 0.2s ease;

	input {
		flex: 0 1 100%;
	}
	button {
		position: relative;
		flex: 0 0 auto;
		// padding-left: 2.75rem;

		i {
			position: absolute;
			left: 1.25rem;
			font-size: 1.35rem;
		}
	}

	&.focus {
		transform: scale(1.025);
		border: solid thin $blue;

		button {
			opacity: 1;
		}
	}
}
</style>