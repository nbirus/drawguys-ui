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
		<transition name="form-button" mode="out-in">
			<button v-if="value" type="submit" class="lg">
				<i class="ri-check-fill"></i>
				<span v-text="submitText"></span>
			</button>
		</transition>
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
	overflow: hidden;

	input {
		flex: 0 1 100%;
	}
	button {
		position: relative;
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		padding-left: 1.15rem;

		i {
			font-size: 1.25rem;
			margin-right: 0.5rem;
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
			color: $blue !important;
		}
	}
}

.popover {
	position: absolute;
}
</style>