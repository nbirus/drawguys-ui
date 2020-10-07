<template>
	<ul class="game-users">
		<li class="game-users__user" v-for="user of users" :key="user.userid">
			<user v-bind="user" large />
		</li>
	</ul>
</template>

<script>
import User from '@/components/User'
import { roomState } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'game-users',
	components: {
		User,
	},
	setup() {
		let users = computed(() =>
			Object.values(roomState.usersState).sort((a, b) => b.score - a.score)
		)
		return {
			users,
			roomState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.game-users {
	&__user {
		margin-bottom: 1rem;
	}
}
</style>
