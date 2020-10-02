<template>
	<div class="timer">
		<transition name="timer-circle" mode="out-in">
			<div class="expand delay-1" :key="value"></div>
		</transition>
		<transition name="timer" mode="out-in">
			<h1 v-text="value" :key="value"></h1>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'timer',
	props: ['value'],
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.timer {
	width: 6rem;
	height: 6rem;
	background-color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	h1 {
		font-weight: $bold;
		font-size: 3rem;
		position: absolute;
	}
}

.expand {
	position: absolute;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	border-radius: 50%;
	background-color: fade-out(darken($light, 35), 0.2);
	// background-color: red;
	transform: scale(0);
}
</style>