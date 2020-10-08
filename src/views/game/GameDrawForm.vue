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
	<div
		class="draw-form card"
		:class="drawState.tool === 'marker' ? activeColor : 'black eraser'"
	>
		<button
			class="eraser"
			:class="{ active: drawState.tool === 'eraser' }"
			@click="drawState.tool = 'eraser'"
		>
			<i class="ri-eraser-line"></i>
		</button>

		<ul
			class="draw-form__colors mr-2"
			:class="{ disabled: drawState.tool === 'eraser' }"
		>
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
				:class="{ active: drawState.size === 3 }"
				@click="drawState.size = 3"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{
					active: drawState.size === 10,
				}"
				@click="drawState.size = 10"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{
					active: drawState.size === 25,
				}"
				@click="drawState.size = 25"
			>
				<div class="c"></div>
			</button>
			<button
				:class="{
					active: drawState.size === 50,
				}"
				@click="drawState.size = 50"
			>
				<div class="c"></div>
			</button>
		</div>

		<div class="seperator"></div>

		<button class="main mr-1" @click="undo" :disabled="undoDisabled">
			<i class="ri-arrow-go-back-line"></i>
		</button>
		<button class="main" @click="reset">
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
			opacity: 0.5;

			&:hover {
				opacity: 1;
			}
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
			border-radius: 0;

			.c {
				background-color: transparent;
				border-radius: 50%;
			}

			&:first-child {
				border-radius: $border-radius 0 0 $border-radius;
			}
			&:last-child {
				border-radius: 0 $border-radius $border-radius 0;
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
		margin-right: 0.25rem;
		border-radius: 50%;

		&.active {
			box-shadow: inset 0 0 0 2px $black;
		}
	}
	.main {
		height: 40px;
		width: 40px;
		display: flex;
		align-items: center;
		justify-content: center;

		i {
			font-size: 1.3rem;
		}

		&:disabled {
			pointer-events: none;
		}
	}
	.seperator {
		border-left: solid thin $border-color;
		height: 100%;
		margin: 0 1rem;
	}

	@each $color, $name in $colors {
		&.#{$name} {
			.draw-form__size {
				.c {
					border: solid thin $color;
				}
				button.active {
					box-shadow: inset 0 0 0 1px $color;
					opacity: 1;
					background-color: fade-out($color, 0.85);

					.c {
						background-color: fade-out($color, 0.25);
					}
				}
			}
			&.eraser {
				.draw-form__size button.active .c {
					background-color: white;
				}
			}
		}
	}
}
</style>
