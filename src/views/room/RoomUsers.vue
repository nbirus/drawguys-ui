<template>
	<ul class="room-users">
		<li class="room-users__user" v-for="user of users" :key="user.userid">
			<user v-bind="user" />
		</li>
		<li class="room-users__user invite" v-for="n of (4 - users.length)" :key="n"></li>
		<li class="room-users__user invite" v-if="users.length === 4 && users.length < 8"></li>
	</ul>
</template>

<script>
import User from '@/components/User'
import { roomState } from '@/services/Room'
import { computed } from 'vue'

export default {
	name: 'room-users',
	components: { User },
	setup() {
		const users = computed(() => Object.values(roomState.users))
		return {
			users,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.room-users {
	&__user {
		margin-bottom: 1rem;

		&.invite {
			height: $block-height-lg;
			background-color: $light;
			border-radius: $border-radius;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}
</style>
