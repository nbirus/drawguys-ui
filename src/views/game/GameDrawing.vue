<template>
	<div id="canvasDiv" class="drawing"></div>
</template>

<script>
import Drawing from '@/services/Drawing'
export default {
	name: 'drawing',
	mounted() {
		Drawing()
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.drawing {
	border-radius: $border-radius;
	height: 100%;
	width: 100%;
}
</style>
