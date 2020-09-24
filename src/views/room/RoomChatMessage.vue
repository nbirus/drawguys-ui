<template>
	<div class="message" :class="[color, event, event && 'event']">
		<div class="message__username" v-text="username"></div>
		<div class="message__message">
			<span v-if="event === 'join-room'">joined the room</span>
			<span v-else-if="event === 'leave-room'">left</span>
			<span v-else v-text="message"></span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'room-chat-message',
	props: ['message', 'username', 'userid', 'color', 'event'],
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

	&__username {
		font-weight: $bold;
		margin-right: 0.25rem;
	}
	&__message {
		color: $text;
	}

	&.event {
		// font-style: italic;
	}

	&:not(.event) {
		.message__username:after {
			content: ':';
		}
	}

	@each $color, $name in $colors {
		&.#{$name} {
			.message__username {
				color: $color;
			}
		}
	}
}
</style>