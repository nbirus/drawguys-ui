<template>
	<transition-group tag="ul" name="list" class="game-scoreboard" appear>
		<li
			class="game-scoreboard__user"
			v-for="(user, i) of users"
			:class="`delay-${i}`"
			:key="user.userid"
		>
			<user v-bind="user" showPlace :place="i + 1" large />
		</li>
	</transition-group>
</template>

<script>
import User from '@/components/User'
import { roomState } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'game-scoreboard',
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

.game-scoreboard {
	width: 235px;

	&__user {
		margin-bottom: 1rem;
	}
}
</style>
