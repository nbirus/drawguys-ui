<template>
	<transition-group tag="ul" name="list" class="game-users" appear>
		<li
			class="game-users__user"
			v-for="(user, i) of users"
			:class="`delay-${i}`"
			:key="user.userid"
		>
			<user v-bind="user" large />
		</li>
	</transition-group>
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
		let users = computed(() => Object.values(roomState.usersState))
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
