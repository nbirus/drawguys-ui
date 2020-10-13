<script>
import { colorMap, colorLookupMap } from '@/assets/colors.js'
import {
	drawState,
	reset,
	undo,
	undoDisabled,
	updateDrawState,
} from '@/services/Drawing'
import { computed, watch } from 'vue'
export default {
	name: 'game-draw-form',
	setup() {
		watch(drawState, () => {
			updateDrawState()
		})

		return {
			colorMap,
			drawState,
			reset,
			undo,
			undoDisabled,
			sizes: [3, 10, 25, 50],
			activeColor: computed(() =>
				drawState.tool === 'eraser' ? 'black' : colorLookupMap[drawState.color]
			),
			eraserActive: computed(() => drawState.tool === 'eraser'),
		}
	},
}
</script>

<template>
	<div class="draw-form card">
		<!-- eraser -->
		<button
			class="draw-form__eraser draw-form-button"
			:class="{ active: eraserActive }"
			@click="drawState.tool = 'eraser'"
		>
			<i class="ri-eraser-line"></i>
		</button>

		<!-- colors -->
		<ul class="draw-form__colors" :class="{ disabled: eraserActive }">
			<li
				class="draw-form__colors-color"
				v-for="(hex, color, i) in colorMap"
				:key="i"
				tabindex="0"
				:class="[color, { active: drawState.color === hex && !eraserActive }]"
				@click=";(drawState.color = hex), (drawState.tool = 'marker')"
			></li>
		</ul>

		<!-- sizes -->
		<!-- <ul class="draw-form__sizes">
			<li class="draw-form__sizes-size" v-for="size in sizes" :key="size">
				<button
					class="draw-form__sizes-button draw-form-button"
					:class="[activeColor, { active: drawState.size === size }]"
					@click="drawState.size = size"
				>
					<div class="c"></div>
				</button>
			</li>
		</ul> -->
		<input
			class="draw-form__slider"
			type="range"
			min="0"
			max="3"
			v-model="drawState.size"
		/>

		<div class="draw-form__preview">
			<div :class="`size-${drawState.size} ${activeColor}`"></div>
		</div>

		<!-- actions -->
		<div class="draw-form__actions">
			<button
				class="draw-form-button mr-1"
				@click="undo"
				:disabled="undoDisabled"
			>
				<i class="ri-arrow-go-back-line"></i>
			</button>
			<button class="draw-form-button" @click="reset">
				<i class="ri-forbid-line"></i>
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.draw-form {
	display: flex;
	align-items: center;
	padding: 0.35rem;
	top: 2rem;
	position: relative;
	border: solid thin $border-color;

	&__eraser {
		border-radius: 50%;
		padding: 0;
		width: 45px;
		&.active {
			box-shadow: inset 0 0 0 3px $black;
		}
	}
	&__colors {
		margin-right: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: $border-radius;
		padding: 0 0.75rem;
		height: 40px;

		&.disabled {
			opacity: 0.5;
			&:hover {
				opacity: 1;
			}
		}

		&-color {
			height: 1.15rem;
			width: 1.15rem;
			border-radius: 50%;
			transition: 0.2s ease;
			transition-property: box-shadow, transform;
			display: flex;
			align-items: center;
			justify-content: center;

			&:not(:last-child) {
				margin-right: 0.4rem;
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
	&__preview {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 45px;
		height: 45px;
		border-radius: $border-radius;
		border: solid thin $border-color;
		margin-left: 0.75rem;

		div {
			width: 10px;
			height: 10px;
			border-radius: 50%;
			transition: all 0.2s ease;

			&.size-0 {
				width: 5px;
				height: 5px;
			}
			&.size-1 {
				width: 10px;
				height: 10px;
			}
			&.size-2 {
				width: 25px;
				height: 25px;
			}
			&.size-3 {
				width: 35px;
				height: 35px;
			}

			@each $color, $name in $colors {
				&.#{$name} {
					border: solid thin $color;
					background-color: fade-out($color, 0.75);
				}
			}
		}
	}
	&__sizes {
		display: flex;
		align-items: center;

		&-size {
			margin-right: 0.25rem;

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
		&-button {
			padding: 0;
			height: 40px;
			width: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: $light !important;

			.c {
				background-color: transparent;
				border-radius: 50%;
				border: solid thin;
			}
			@each $color, $name in $colors {
				&.#{$name} {
					.c {
						border-color: $color;
					}
					&.active {
						box-shadow: 0 0 0 2px $color;

						.c {
							background-color: fade-out($color, 0.15);
						}
					}
					&:active,
					&:focus {
						box-shadow: inset 0 0 0 3px $color;
					}
				}
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
		}
	}
	&__actions {
		margin-left: 0.75rem;
		padding-left: 1rem;
		border-left: solid thin $border-color;
	}

	&-button {
		&.disabled,
		&:disabled {
			pointer-events: none;
		}
	}
}

input[type='range'] {
	-webkit-appearance: none;
}
input[type='range']:focus {
	outline: none;
}
input[type='range']::-webkit-slider-runnable-track {
	width: 100%;
	height: 8.4px;
	cursor: pointer;
	background: darken($light, 10);
	border-radius: 25px;
}
input[type='range']::-webkit-slider-thumb {
	box-shadow: $box-shadow;
	height: 1rem;
	width: 1rem;
	border-radius: 50%;
	background: lighten($text, 20);
	cursor: pointer;
	-webkit-appearance: none;
	margin-top: -0.25rem;
}
input[type='range']:focus::-webkit-slider-runnable-track {
	cursor: pointer;
	background: darken($light, 10);
	border-radius: 25px;
}
input[type='range']::-moz-range-track {
	height: 8.4px;
	cursor: pointer;
	background: darken($light, 10);
	border-radius: 25px;
}
input[type='range']::-moz-range-thumb {
	height: 36px;
	width: 16px;
	border-radius: 3px;
	// background: #ffffff;
	cursor: pointer;
}
input[type='range']::-ms-track {
	height: 8.4px;
	cursor: pointer;
	background: transparent;
	border-color: transparent;
	border-width: 16px 0;
	color: transparent;
}
input[type='range']::-ms-fill-lower {
	background: #2a6495;

	border-radius: 2.6px;
}
input[type='range']::-ms-fill-upper {
	background: #3071a9;
}
input[type='range']::-ms-thumb {
	height: 36px;
	width: 16px;
	border-radius: 3px;
	background: #ffffff;
	cursor: pointer;
}
input[type='range']:focus::-ms-fill-lower {
	background: #3071a9;
}
input[type='range']:focus::-ms-fill-upper {
	background: #367ebd;
}
</style>
