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
		<li
			class="game-users__user invite"
			v-if="users.length > 3 && users.length < 6"
		>
			<button @click="$emit('share')" :disabled="ready">
				<i class="ri-user-add-fill"></i>
			</button>
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
		margin-bottom: 0.8rem;

		&.invite button {
			width: 100%;
			height: $block-height-lg;
			background-color: darken($light, 5);
			border-radius: $border-radius;
			color: fade-out($text-light, 0.5);
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
