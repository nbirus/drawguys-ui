<template>
	<form class="form-card card" @submit.prevent="onSubmit">
		<input
			type="text"
			class="lg b-none mr-2"
			v-bind="$attrs"
			v-model="value"
			required
			autocomplete="off"
		/>
		<button type="submit" class="lg" v-text="submitText"></button>
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
		function onSubmit() {
			emit('submit', value.value)
		}
		return {
			value,
			onSubmit,
		}
	},
}
</script>

<style lang="scss" scoped>
.form-card {
	display: flex;
	align-items: center;
	padding: 0.75rem;

	input {
		width: 250px;
	}
}
</style>