<template>
	<div class="timer">
		<div class="timer__circle" ref="container"></div>
		<transition name="timer-circle" mode="out-in">
			<div class="expand" :key="value"></div>
		</transition>
		<transition name="timer" mode="out-in">
			<h1 v-text="value" :key="value"></h1>
		</transition>
	</div>
</template>

<script>
import ProgressBar from 'progressbar.js'
export default {
	name: 'timer',
	props: ['value'],
	mounted() {
		var bar = new ProgressBar.Circle(this.$refs.container, {
			strokeWidth: 6,
			duration: this.value * 1000 + 1000,
			color: '#111111',
			trailColor: '#eceff4',
			trailWidth: 6,
			svgStyle: null,
		})
		bar.animate(1.0) // Number from 0.0 to 1.0
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.timer__circle {
	width: 6rem;
	height: 6rem;
}
.timer {
	width: 6rem;
	height: 6rem;
	background-color: $light;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;

	h1 {
		font-weight: $bold;
		font-size: 3.25rem;
		position: absolute;
		transform: translateY(-1px);
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
}
</style>