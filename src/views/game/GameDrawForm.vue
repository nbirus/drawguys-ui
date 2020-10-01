<template>
	<div class="draw-form" :class="activeColor">
		<ul
			class="draw-form__colors mr-3"
			:class="{ disabled: drawState.tool === 'eraser' }"
		>
			<li
				class="draw-form__colors-color"
				v-for="(hex, color, i) in colorMap"
				:key="i"
				:class="[color, { active: drawState.color === hex }]"
				@click="drawState.color = hex"
			></li>
		</ul>

		<div class="draw-form__size">
			<button
				:class="{ active: drawState.size === 3 }"
				@click="drawState.size = 3"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{ active: drawState.size === 10 }"
				@click="drawState.size = 10"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{ active: drawState.size === 25 }"
				@click="drawState.size = 25"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{ active: drawState.size === 50 }"
				@click="drawState.size = 50"
			>
				<div class="c"></div>
			</button>
		</div>

		<div class="draw-form__tools" v-if="false">
			<button
				class="mr-2"
				:class="{ active: drawState.tool === 'marker' }"
				@click="drawState.tool = 'marker'"
			>
				<i class="ri-mark-pen-fill"></i>
			</button>
			<button
				class="mr-2"
				:class="{ active: drawState.tool === 'eraser' }"
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

<style lang="scss" scoped>
@import '@/styles/component.scss';

.draw-form {
	display: flex;
	align-items: center;
	width: 100%;
	position: relative;
	padding: 0 1.25rem;
	bottom: -4rem;

	&__colors {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: $border-radius;
		padding: 0 0.75rem;
		height: 40px;
		background-color: darken($light, 5);

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
			background-color: darken($light, 5);
			display: flex;
			align-items: center;
			justify-content: center;

			.c {
				background-color: $black;
				border-radius: 50%;
			}

			&:not(:last-child) {
				margin-right: 0.25rem;
			}
			&:not(.active) {
				opacity: 0.75;
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

	@each $color, $name in $colors {
		&.#{$name} {
			.draw-form {
				&__size {
					.c {
						background-color: $color;
					}

					button.active {
						box-shadow: inset 0 0 0 2px $color;
					}
				}
			}
		}
	}
}
</style>
