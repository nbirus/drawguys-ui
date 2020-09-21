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
	padding: 1.25rem 0;

	&__username {
		text-align: center;
		font-size: 1.1rem;
		color: white;
	}

	@each $color, $name in $colors {
		&.#{$name} {
			background-color: $color;
			border-color: darken($color, 10);
		}
	}
}
</style>