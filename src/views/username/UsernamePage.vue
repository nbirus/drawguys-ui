<template>
	<div class="page page--center username">
		<h1 class="mb-5">Choose a username</h1>
		<form-card color="black" submit-text="Next" placeholder="Username..." @submit="setUsername" />
	</div>
</template>

<script>
import FormCard from '@/components/FormCard'
import router from '@/router'
export default {
	name: 'username-page',
	components: {
		FormCard,
	},
	setup() {
		function setUsername(username) {
			if (username) {
				router.push('/')
			}
		}

		return {
			setUsername,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
</style>