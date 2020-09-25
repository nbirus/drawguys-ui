<template>
	<div class="message" :class="[color, event, event && 'event']">
		<div class="message__avatar avatar" v-if="event">
			<i class="ri-check-line" v-if="event === 'ready'"></i>
			<i class="ri-close-line" v-else-if="event === 'not-ready'"></i>
			<i class="ri-arrow-right-fill" v-else-if="event === 'join-room'"></i>
			<i class="ri-arrow-left-fill" v-else-if="event === 'leave-room'"></i>
		</div>
		<div class="message__username" v-text="username"></div>
		<div class="message__message">
			<span v-if="event === 'ready'">is ready</span>
			<span v-if="event === 'not-ready'">isn't ready</span>
			<span v-if="event === 'join-room'">joined the room</span>
			<span v-else-if="event === 'leave-room'">left the room</span>
			<span v-else v-text="message"></span>
		</div>
	</div>
</template>

<script>
import { roomState } from '@/services/Room'
import { computed } from 'vue'
export default {
	name: 'room-chat-message',
	props: ['message', 'username', 'userid', 'event'],
	setup(props) {
		let color = computed(() => {
			let user = roomState.users[props.userid]
			if (user) {
				return user.color
			}
			return 'black'
		})
		return {
			color,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.message {
	display: flex;
	align-items: flex-start;
	padding: 0 0.75rem;
	margin-bottom: 0.75rem;
	font-size: 0.8rem;

	&__avatar {
		width: 1rem;
		height: 1rem;
		font-size: 0.9rem;
		// color: $text-extra-light;
		margin-right: 0.5rem;
	}
	&__username {
		font-weight: $bold;
		margin-right: 0.25rem;
	}
	&__message {
		color: $text;
	}

	&.event {
		font-style: italic;
	}
	&.event.ready {
		position: relative;

		.message__username {
			color: $green;
		}

		&:after {
			content: '';
			position: absolute;
			top: -0.3rem;
			right: 0px;
			bottom: -0.3rem;
			left: 0px;
			background-color: fade-out($green, 0.9);
		}
	}

	&:not(.event) {
		.message__username:after {
			content: ':';
		}
	}

	@each $color, $name in $colors {
		&.#{$name} {
			.message__username,
			.message__avatar {
				color: $color;
			}
		}
	}
	&.black {
		.message__username {
			color: $text-light;
		}
	}
}
</style>