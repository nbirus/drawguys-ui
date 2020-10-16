<template>
	<div class="dialog" v-if="open" @click.self="$emit('close')">
		<transition name="pop-up" mode="out-in" appear>
			<div class="dialog-content" :style="`width: ${width}px`">
				<slot />
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'dialog',
	props: {
		open: Boolean,
		width: {
			type: String,
			default: '425',
		},
	},
}
</script>

<style lang="scss">
.dialog {
	position: fixed;
	z-index: 999;
	left: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	background-color: fade-out(black, 0.15);
	animation: fade 0.3s ease;

	display: flex;
	align-items: center;
	justify-content: center;
}
.dialog-content {
	margin-top: -5%;
	overflow: visible;
}

@keyframes fade {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
