<template>
	<transition name="pop-up" mode="out-in" appear>
		<div class="page page--center username">
			<h1 class="mb-6">Choose a username</h1>
			<div class="ps">
				<form-card
					ref="form"
					:init-value="userState.username"
					color="black"
					icon="arrow-right"
					placeholder="Enter a username..."
					enter-text="continue"
					maxlength="16"
					@submit="onSubmit"
				>
					<span>Next</span>
					<i class="ri-arrow-right-fill ml-1"></i>
				</form-card>
			</div>
		</div>
	</transition>
</template>

<script>
import FormCard from '@/components/FormCard'
import { setUsername, userState } from '@/services/User'
import router from '@/router.js'
import { onMounted, ref } from 'vue'

export default {
	name: 'username-page',
	components: {
		FormCard,
	},
	setup() {
		let form = ref(null)

		function onSubmit(username) {
			if (username) {
				setUsername(username)
				router.push('/')
			}
		}

		onMounted(() => {
			form.value.toggleFocus()
		})

		return {
			form,
			onSubmit,
			userState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.page {
	justify-content: flex-start;
	position: relative;

	h1 {
		margin-top: 15rem;
	}
}
.ps {
	position: relative;
}
</style>
