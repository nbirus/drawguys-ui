<script>
import { colorMap, colorLookupMap } from '@/assets/colors.js'
import { drawState, reset, undo, undoDisabled } from '@/services/Drawing'
import { computed } from 'vue'
export default {
	name: 'game-draw-form',
	setup() {
		return {
			colorMap,
			drawState,
			reset,
			undo,
			undoDisabled,
			activeColor: computed(() => colorLookupMap[drawState.color]),
		}
	},
}
</script>

<template>
	<div class="draw-form card" :class="activeColor">
		<button
			class="eraser"
			:class="{ active: drawState.tool === 'eraser' }"
			@click="drawState.tool = 'eraser'"
		>
			<i class="ri-eraser-line"></i>
		</button>

		<ul class="draw-form__colors mr-2">
			<li
				class="draw-form__colors-color"
				v-for="(hex, color, i) in colorMap"
				:key="i"
				:class="[color, { active: drawState.color === hex }]"
				@click=";(drawState.color = hex), (drawState.tool = 'marker')"
			></li>
		</ul>

		<div class="draw-form__size">
			<button
				:class="{ active: drawState.size === 3 && drawState.tool === 'marker' }"
				@click="drawState.size = 3"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{
					active: drawState.size === 10 && drawState.tool === 'marker',
				}"
				@click="drawState.size = 10"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{
					active: drawState.size === 25 && drawState.tool === 'marker',
				}"
				@click="drawState.size = 25"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{
					active: drawState.size === 50 && drawState.tool === 'marker',
				}"
				@click="drawState.size = 50"
			>
				<div class="c"></div>
			</button>
		</div>

		<button class="mr-1 ml-5" @click="undo" :disabled="undoDisabled">
			<i class="ri-arrow-go-back-line"></i>
		</button>
		<button @click="reset">
			<i class="ri-forbid-line"></i>
		</button>
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.draw-form {
	display: flex;
	align-items: center;
	width: auto;
	position: relative;
	padding: 0.5rem;
	top: 2rem;
	border: solid thin $border-color;

	&__colors {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: $border-radius;
		padding: 0 0.75rem;
		height: 40px;

		&.disabled {
			pointer-events: none;
		}

		&-color {
			height: 1rem;
			width: 1rem;
			border-radius: 50%;
			transition: 0.2s ease;
			transition-property: box-shadow, transform;
			display: flex;
			align-items: center;
			justify-content: center;

			&:not(:last-child) {
				margin-right: 0.5rem;
			}

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
						box-shadow: 0 0 0 4px fade-out($color, 0.75);
					}
				}
			}
		}
	}
	&__size {
		display: flex;

		button {
			height: 40px;
			width: 40px;
			padding: 0;
			background-color: $light;
			display: flex;
			align-items: center;
			justify-content: center;

			.c {
				background-color: transparent;
				border-radius: 50%;
			}

			&:not(:last-child) {
				margin-right: 0.25rem;
			}
			&:not(.active) {
				opacity: 0.5;
			}
			&:hover {
				opacity: 1;
			}
			&:nth-child(1) .c {
				height: 4px;
				width: 4px;
			}
			&:nth-child(2) .c {
				height: 10px;
				width: 10px;
			}
			&:nth-child(3) .c {
				height: 16px;
				width: 16px;
			}
			&:nth-child(4) .c {
				height: 25px;
				width: 25px;
			}
		}
	}

	.eraser {
		height: 40px;
		width: 40px;

		&.active {
			box-shadow: inset 0 0 0 2px $black;
		}
	}

	@each $color, $name in $colors {
		&.#{$name} {
			.draw-form {
				&__size {
					.c {
						border: solid thin $color;
					}

					button.active {
						box-shadow: inset 0 0 0 2px $color;
						opacity: 1;

						.c {
							background-color: fade-out($color, 0.25);
						}
					}
				}
			}
		}
	}
}
</style>
