<template>
	<ul class="room-users">
		<li class="room-users__user" v-for="user of users" :key="user.userid">
			<user
				v-bind="user"
				:change-color="user.userid === userState.userid && !ready"
			/>
		</li>
		<li class="room-users__user invite" v-for="n of userEmpty" :key="n">
			<button @click="$emit('share')" :disabled="ready">
				<i class="ri-user-add-fill"></i>
			</button>
		</li>
		<li
			class="room-users__user invite"
			v-if="users.length > 3 && users.length < 8"
		>
			<button @click="$emit('share')" :disabled="ready">
				<i class="ri-user-add-fill"></i>
			</button>
		</li>
	</ul>
</template>

<script>
import User from '@/components/User'
import { roomState } from '@/services/Room'
import { userState } from '@/services/User'
import { computed } from 'vue'

export default {
	name: 'room-users',
	components: { User },
	setup() {
		const users = computed(() => Object.values(roomState.users))
		const ready = computed(() => roomState.user.ready)
		return {
			ready,
			userState,
			users,
			userEmpty: computed(() =>
				users.value.length > 4 ? 0 : 4 - users.value.length
			),
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.room-users {
	&__user {
		margin-bottom: 1rem;

		&.invite button {
			width: 100%;
			height: $block-height-lg;
			background-color: $light;
			border-radius: $border-radius;
			color: $text-extra-light;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 2rem;

			&:focus {
				background-color: darken($light, 2);
			}
			&:hover {
				border-color: $text-extra-light;
				box-shadow: inset 0 0 0 2px $text-extra-light;
			}
			&:active {
				border-color: $text-light;
				color: $text-light;
				box-shadow: inset 0 0 0 2px $text-light;
			}

			&:last-child {
				margin-bottom: 0;
			}
			&:disabled {
				pointer-events: none;
			}
		}
	}
}
</style>
