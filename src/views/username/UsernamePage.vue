<template>
	<transition name="pop-up" mode="out-in" appear>
		<div class="page page--center username">
			<h1 class="mb-6">Choose a username</h1>
			<form-card
				:init-value="userState.username"
				color="black"
				submit-text="Next"
				placeholder="Enter a username..."
				maxlength="16"
				@submit="onSubmit"
			/>
		</div>
	</transition>
</template>

<script>
import FormCard from '@/components/FormCard'
import { setUsername, userState } from '@/services/User'
import router from '@/router.js'

export default {
	name: 'username-page',
	components: {
		FormCard,
	},
	setup() {
		function onSubmit(username) {
			if (username) {
				setUsername(username)
				router.push('/')
			}
		}

		return {
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

	h1 {
		margin-top: $margin-top;
	}
}
</style>