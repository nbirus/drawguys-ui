<template>
	<div class="draw-form card">
		<ul class="draw-form__colors">
			<li
				class="draw-form__colors-color"
				v-for="(hex, color, i) in colorMap"
				:key="i"
				:class="[color, { active: drawState.color === hex }]"
				@click="drawState.color = hex"
			></li>
		</ul>

		<div class="draw-form__tools">
			<button
				class="mr-2"
				:disabled="drawState.tool === 'marker'"
				@click="drawState.tool = 'marker'"
			>
				<i class="ri-mark-pen-fill"></i>
			</button>
			<button
				class="mr-2"
				:disabled="drawState.tool === 'eraser'"
				@click="drawState.tool = 'eraser'"
			>
				<i class="ri-eraser-line"></i>
			</button>
			<input
				class="mr-2"
				v-model="drawState.size"
				type="range"
				min="1"
				max="50"
			/>
			<button class="mr-2" @click="undo" :disabled="undoDisabled">
				<i class="ri-arrow-go-back-line"></i>
			</button>
			<button @click="reset">
				<i class="ri-forbid-line"></i>
			</button>
		</div>
	</div>
</template>

<script>
import { colorMap } from '@/assets/colors.js'
import { drawState, reset, undo, undoDisabled } from '@/services/Drawing'
export default {
	name: 'game-draw-form',
	setup() {
		return {
			colorMap,
			drawState,
			reset,
			undo,
			undoDisabled,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.draw-form {
	display: flex;
	flex-direction: column;
	padding: 0.75rem 1rem 0.75rem 0.75rem;
	position: relative;
	border: solid thin $border-color;

	button i {
		font-size: 1.3rem;
	}

	&__tools {
		display: flex;
		align-items: center;
	}
	&__colors {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 0.75rem;
		margin-bottom: 0.75rem;
		border-bottom: solid thin $border-color;

		&-color {
			height: 1rem;
			width: 1rem;
			margin-right: 0.5rem;
			border-radius: 50%;
			opacity: 0.5;
			transition: 0.2s ease;
			transition-property: box-shadow, transform;
			display: flex;
			align-items: center;
			justify-content: center;

			&.active {
				opacity: 1;

				&:after {
					content: '';
					height: 0.25rem;
					width: 0.25rem;
					border-radius: 50%;
					background-color: #fff;
				}
			}

			&:hover {
				opacity: 1;
				transform: scale(1.2);
				cursor: pointer;
			}

			@each $color, $name in $colors {
				&.#{$name} {
					background-color: $color;

					&.active {
						box-shadow: 0 0 0 2px fade-out($color, 0.5);
					}
				}
			}
		}
	}
}
</style>
