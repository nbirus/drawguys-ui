<template>
	<div class="message" :class="color">
		<div class="message__username" v-text="username"></div>
		<div class="message__message" v-text="message"></div>
	</div>
</template>

<script>
export default {
	name: 'room-chat-message',
	props: ['message', 'username', 'userid', 'color'],
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
		&:after {
			content: ':';
		}
	}
	&__message {
		color: $text;
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