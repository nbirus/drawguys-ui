<template>
	<transition-group tag="ul" name="list" class="room-users" appear>
		<li class="room-users__user" v-for="user of users" :key="user.userid">
			<user
				v-bind="user"
				:change-color="user.userid === userState.userid && !ready"
				hide-score
				large
			/>
		</li>
		<li class="room-users__user invite" v-for="n of userEmpty" :key="n">
			<button @click="$emit('share')">
				<i class="ri-user-add-fill"></i>
			</button>
		</li>
	</transition-group>
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
		const users = computed(() => Object.values(roomState.usersState))
		const ready = computed(() => roomState.userState.ready)
		return {
			ready,
			userState,
			users,
			userEmpty: computed(() => {
				if (users.value.length === 1) {
					return 3
				} else if (users.value.length === 2) {
					return 2
				} else if (users.value.length < 8) {
					return 1
				}
			}),
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.room-users {
	&__user {
		margin-bottom: 0.75rem;

		&.invite button {
			width: 100%;
			height: 60px;
			background-color: $light;
			border-radius: $border-radius;
			color: $text-extra-light;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 2rem;

			&:focus,
			&:hover {
				box-shadow: 0 0 0 3px darken($light, 10);
				color: $text-light;
				background: repeating-linear-gradient(
					45deg,
					darken($light, 1),
					darken($light, 1) 2rem,
					darken($light, 3) 2rem,
					darken($light, 3) 4rem
				);
				background-size: 200% 200%;
				animation: barberpole 15s linear infinite;
			}
			&:active {
				background: repeating-linear-gradient(
					45deg,
					darken($light, 2),
					darken($light, 2) 2rem,
					darken($light, 6) 2rem,
					darken($light, 6) 4rem
				);
				background-size: 200% 200%;
				animation: barberpole 15s linear infinite;
				box-shadow: 0 0 0 3px $text-light;
				color: $text-light;
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
