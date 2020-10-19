<template>
	<div class="timeline card" :class="{ show }">
		<div class="timeline__bar"></div>
		<div class="timeline__bar-overlay"></div>
		<ul class="timeline__segments">
			<li v-for="i in 6" :key="i" class="timeline__segments-segment">
				<span class="scores" v-text="scores[i - 1]"></span>
			</li>
		</ul>
	</div>
</template>

<script>
import { roomState } from '@/services/Room'
import { watch, ref } from 'vue'

export default {
	name: 'game-timeline',
	props: ['show'],
	setup(props) {
		let animation = ref('')
		let barKey = ref(0)

		watch(
			() => props.show,
			() => {
				animation.value = `animation-duration: ${roomState.gameState.timer}s`
				barKey.value++
			}
		)

		return {
			animation,
			barKey,
			scores: ['-50', '+50', '+100', '+200', '+300', '+400'],
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.timeline {
	padding: 0.75rem 1rem;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: solid thin $border-color;
	position: relative;
	top: 1.75rem;

	&:not(.show) {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	&__bar {
		width: 100%;
		height: 30px;
		border-radius: $border-radius;
		overflow: hidden;
		@include stripe-sm(fade-out($green, 0.7), fade-out($green, 0.8));
		position: relative;

		&-overlay {
			@include stripe-sm($green, darken($green, 5));
			position: absolute;
			top: 0.75rem;
			bottom: 0px;
			height: 30px;
			left: 116px;
			z-index: 2;
			animation: bar 30s linear;
		}
	}
	&__segments {
		width: calc(100% - 2rem);
		height: 30px;
		left: 1rem;
		position: absolute;
		border-radius: $border-radius;
		overflow: hidden;
		border-radius: $border-radius;
		display: flex;

		&-segment {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			&:not(:last-child) {
				border-right: solid 3px white;
			}
			&:nth-child(1) {
				flex: 0 0 100px;
				@include stripe-sm($red, darken($red, 5));
			}
			&:nth-child(6) {
				flex: 0.75;
			}
			.scores {
				color: white;
				background-color: fade-out(black, 0.75);
				font-size: 0.7rem;
				padding: 0.25rem;
				border-radius: 4px;
				z-index: 3;
			}
		}
	}
}

@keyframes bar {
	0% {
		width: calc(100% - 100px);
		background-size: 200% 200%;
	}
	100% {
		width: 0%;
		background-position: 100% 100%;
	}
}
</style>