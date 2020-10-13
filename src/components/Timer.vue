<template>
	<div class="timer">
		<div class="timer__circle" ref="container"></div>
		<transition name="timer-circle" mode="out-in">
			<div class="expand" :key="value" :class="color"></div>
		</transition>
		<transition name="timer" mode="out-in">
			<h1 v-text="value" :key="value"></h1>
		</transition>
	</div>
</template>

<script>
import ProgressBar from 'progressbar.js'
import { colorMap } from '@/assets/colors'
import { onMounted, ref, watch } from 'vue'

export default {
	name: 'timer',
	props: ['value', 'color', 'update'],
	setup(props) {
		let container = ref()
		let bar

		// init bar
		onMounted(() => {
			animateBar()
		})

		// update on event change
		watch(props.update, () => {
			animateBar()
		})

		function animateBar() {
			setTimeout(() => {
				bar = new ProgressBar.Circle(container.value, {
					strokeWidth: 8,
					trailColor: '#eceff4',
					trailWidth: 5,
					color: colorMap[props.color] || '#111111',
					svgStyle: null,
				})
				bar.set(0)
				bar.animate(1.0, {
					duration: props.value * 1000,
				})
			}, 100)
		}

		return {
			container,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.timer__circle {
	width: 5.5rem;
	height: 5.5rem;
}
.timer {
	width: 5.5rem;
	height: 5.5rem;
	background-color: $light;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;

	h1 {
		font-weight: $bold;
		font-size: 2.85rem !important;
		letter-spacing: -2px;
		position: absolute;
		transform: translateY(-2px);
	}
}

.expand {
	position: absolute;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	border-radius: 50%;
	background-color: fade-out($black, 0.75);
	transform: scale(0);

	@each $color, $name in $colors {
		&.#{$name} {
			background-color: fade-out($color, 0.75);
		}
	}
}
</style>