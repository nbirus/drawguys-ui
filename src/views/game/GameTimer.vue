<template>
	<div class="timer">
		<div class="timer__circle">
			<span>23</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'game-timer',
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.timer {
	position: absolute;
	width: 100%;
	display: flex;
	justify-content: center;
	top: -3rem;

	&__circle {
		width: 5.25rem;
		height: 5.25rem;
		border-radius: 50%;
		background-color: white;
		box-shadow: $box-shadow;
		border: solid thin $border-color;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: $bold;
		font-size: 2.5rem;
		letter-spacing: -1px;

		span {
			transform: translateY(-2px);
		}
	}
}
</style>
