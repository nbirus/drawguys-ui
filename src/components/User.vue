<template>
	<div class="user card" :class="color">
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
		color: String,
		score: Number,
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.user {
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
		&.#{$name} {
			background-color: $color;
			border-color: darken($color, 15);
		}
	}
}
</style>