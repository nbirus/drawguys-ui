<template>
	<div class="user card ready-outline-green nudge" :class="[color, { ready, small, outlined }]">
		<div class="ready-banner" v-if="ready">
			<i class="ri-check-line"></i>
		</div>
		<div class="user__username">{{ username }}</div>
	</div>
</template>

<script>
export default {
	name: 'user',
	props: {
		userid: String,
		username: String,
		guesses: Array,
		ready: Boolean,
		match: Boolean,
		typing: Boolean,
		outlined: Boolean,
		small: Boolean,
		color: String,
		score: Number,
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.user {
	position: relative;
	overflow: hidden;
	$dark-light: darken($light, 90);
	padding: 1.25rem 0;
	box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.1),
		0 5px 5px -5px rgba(0, 0, 0, 0.04);

	&__username {
		text-align: center;
		font-size: 1.1rem;
		color: white;
		font-weight: $bold;
	}

	@each $color, $name in $colors {
		&.#{$name}:not(.outlined) {
			background-color: $color;
			border-color: darken($color, 15);
		}
		&.#{$name}.outlined {
			background-color: fade-out($color, 0.9);
			border-color: lighten($color, 15);

			.user__username {
				color: $color;
			}
		}
	}

	&.small {
		padding: 1.1rem 0;
		box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.05),
			0 3px 3px -3px rgba(0, 0, 0, 0.03);

		.user__username {
			font-size: 1rem;
		}
	}
}
</style>
