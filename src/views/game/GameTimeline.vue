<script>
import { roomState } from '@/services/Room'
import { watch, ref, computed, nextTick, onBeforeUpdate } from 'vue'

export default {
	name: 'game-timeline',
	setup() {
		// helpers
		let event = computed(() => roomState.gameState.event)
		let drawing = computed(() => roomState.userState.drawing)
		let match = computed(() => roomState.userState.match)
		let matchTime = computed(() => roomState.userState.matchTime)
		let turnScore = computed(() => roomState.userState.turnScore)

		// show timeline
		let showOtherUsers = ref(false)
		let show = computed(() => {
			if (event.value === 'turn_start' && !drawing.value) {
				return match.value
			} else if (event.value === 'turn_end') {
				return true
			}
		})
		watch(() => show.value, onShow)

		function onShow() {
			showOtherUsers.value = false
			if (show.value) {
				nextTick(() => {
					let tickLeft = matchTick.value.offsetLeft
					matchTag.value.style.left = `${tickLeft - 15}px`
				})
				setTimeout(() => {
					showOtherUsers.value = true
					nextTick(setUsers)
				}, 3000)
			}
		}

		// active segements
		let activeSegments = computed(() => {
			if (!showOtherUsers.value) {
				return [getSegment(matchTime.value)]
			} else if (event.value === 'turn_end') {
				let segments = []
				Object.values(roomState.usersState).forEach(user => {
					if (!user.drawing) {
						if (!user.match) {
							segments.push(1)
						} else {
							segments.push(getSegment(user.matchTime))
						}
					}
				})
				return segments
			} else return []
		})

		function getSegment(time) {
			if (time >= 35) {
				return 6
			} else if (time >= 30) {
				return 5
			} else if (time >= 20) {
				return 4
			} else if (time >= 10) {
				return 3
			} else if (time > 0) {
				return 2
			} else {
				return 1
			}
		}

		// users
		let matchedUsers = computed(() => {
			if (event.value === 'turn_end') {
				return Object.values(roomState.usersState).filter(user => !user.drawing)
			} else
				return Object.values(roomState.usersState).filter(
					user => !user.drawing && user.match
				)
		})
		let matchTick = ref(null)
		let matchTag = ref(null)
		let tickRefs = []
		let tagRefs = []
		const setTickRef = el => {
			tickRefs.push(el)
		}
		const setTagRef = el => {
			tagRefs.push(el)
		}
		onBeforeUpdate(() => {
			tickRefs = []
			tagRefs = []
		})

		watch(
			() => matchedUsers.value,
			() => nextTick(setUsers)
		)

		let columns = []
		function setUsers() {
			columns = []
			for (let i = 0; i <= 40; i++) {
				columns.push(0)
			}

			tagRefs.forEach(async (tagEl, i) => {
				await nextTick(() => {
					let matchTime = matchedUsers.value[i].matchTime
					let left = matchTime === 0 ? -60 : tickRefs[i].offsetLeft - 10
					let top = 0

					if (matchTime % 2 !== 0) {
						top = columns[matchTime] * 28 + 74
					} else {
						top = columns[matchTime] * 28 * -1
					}

					if (columns[matchTime] > 0) {
						top += matchTime % 2 !== 0 ? 4 : -4
					}

					tagEl.style.left = `${left}px`
					tagEl.style.top = `${top}px`

					columns[matchTime]++
				})
			})
		}

		return {
			show,
			matchTime,
			turnScore,
			showOtherUsers,
			activeSegments,
			matchedUsers,
			event,
			scores: ['-50', '+50', '+100', '+200', '+300', '+400'],

			tickRefs,
			setTickRef,
			tagRefs,
			setTagRef,
			matchTick,
			matchTag,
		}
	},
}
</script>

<template>
	<div class="timeline card" :class="{ show }">
		<div class="timeline__bar"></div>
		<div
			class="timeline__bar-overlay"
			v-show="event === 'turn_start'"
			:class="{ show: showOtherUsers }"
		></div>

		<!-- segments -->
		<ul class="timeline__segments">
			<li
				v-for="i in 6"
				:key="i"
				class="timeline__segments-segment"
				:class="{
					active: activeSegments.includes(i),
				}"
			>
				<span class="scores" v-text="scores[i - 1]"></span>
			</li>

			<!-- ticks -->
			<ul class="timeline__user-ticks absolute-bar">
				<li
					v-if="!showOtherUsers"
					ref="matchTick"
					class="timeline__user-ticks-tick match-tick bg-green"
					:style="
						`grid-column: ${matchTime + 1}; opacity: ${matchTime === 0 ? 0 : 1}`
					"
				></li>
				<li
					v-else
					v-for="(user, i) in matchedUsers"
					:ref="setTickRef"
					:key="i"
					class="timeline__user-ticks-tick"
					:style="{
						'grid-column': user.matchTime + 1,
						opacity: user.matchTime === 0 ? 0 : 1,
					}"
					:class="`bg-${user.color}`"
				></li>
			</ul>
		</ul>

		<ul class="timeline__users-tag absolute-bar">
			<!-- tags -->
			<li
				v-if="!showOtherUsers"
				class="timeline__users-tag-user match-tag"
				ref="matchTag"
				:class="`bg-${matchTime === 0 ? 'red fail-tag' : 'green'}`"
			>
				<div class="score">
					<i :class="`ri-${matchTime === 0 ? 'forbid' : 'check'}-line`"></i>
				</div>
				<div class="time"><b v-text="`${matchTime}`"></b>s</div>
			</li>
			<li
				v-else
				v-for="(user, i) in matchedUsers"
				:key="i"
				:ref="setTagRef"
				class="timeline__users-tag-user"
				:class="`bg-${user.color}`"
			>
				<!-- <div class="score">
					<i :class="`ri-${user.matchTime === 0 ? 'close' : 'check'}-line`"></i>
				</div> -->
				<div class="time" v-if="user.matchTime > 0">
					<b v-text="`${user.matchTime}`"></b>s
				</div>
				<div class="time icon" v-else>
					<i class="ri-forbid-line"></i>
				</div>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';

$fail-width: 90px;

.absolute-bar {
	width: calc(100% - 1.5rem);
	height: 30px;
	left: 0.75rem;
	position: absolute;
	border-radius: $border-radius;
	overflow: hidden;
}

.timeline {
	padding: 0.75rem;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: solid thin $border-color;
	position: relative;
	top: 1.75rem;

	&:not(.show) {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	&__bar {
		width: 100%;
		height: 30px;
		border-radius: $border-radius;
		overflow: hidden;
		position: relative;

		&-overlay {
			@include stripe-sm($green, darken($green, 5));
			position: absolute;
			top: 0.75rem;
			bottom: 0px;
			height: 30px;
			left: calc(90px + 0.75rem);
			z-index: 2;
			animation: bar 40s linear;
			transition: opacity 0.25s ease;

			&:not(.show) {
				opacity: 0;
			}
		}
	}
	&__segments {
		display: grid;
		grid-template-columns: 90px repeat(40, 1fr);
		width: calc(100% - 1.5rem);
		height: 30px;
		left: 0.75rem;
		position: absolute;
		border-radius: $border-radius;
		z-index: 2;

		&-segment {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			@include stripe-sm(fade-out($green, 0.7), fade-out($green, 0.8));

			&:nth-child(1) {
				grid-column: 1;
				border-radius: $border-radius 0 0 $border-radius;
				@include stripe-sm(fade-out($red, 0.7), fade-out($red, 0.8));
			}
			&:nth-child(2) {
				grid-column: 2 / 12;
			}
			&:nth-child(3) {
				grid-column: 12 / 22;
			}
			&:nth-child(4) {
				grid-column: 22 / 32;
			}
			&:nth-child(5) {
				grid-column: 32 / 37;
			}
			&:nth-child(6) {
				grid-column: 37 / 42;
				border-radius: 0 $border-radius $border-radius 0;
			}
			&.active:not(:first-child) {
				@include stripe-sm($green, darken($green, 5));
			}
			&.active:first-child {
				@include stripe-sm($red, darken($red, 5));
			}
			&.active {
				.scores {
					z-index: 99;
					background-color: fade-out(black, 0.5);
					font-weight: $bold;
					transform: scale(1.05);
				}
			}
			&:not(:last-child) {
				border-right: solid 3px white;
			}

			.scores {
				color: white;
				background-color: fade-out(black, 0.75);
				font-size: 0.7rem;
				padding: 0.25rem;
				border-radius: 4px;
				z-index: 3;
				opacity: 0.75;

				position: absolute;
			}
		}
	}
	&__user-ticks {
		overflow: visible;
		display: grid;
		grid-template-columns: repeat(40, 1fr);
		width: calc(100% - 90px);
		left: calc(90px);
		border-radius: 0 $border-radius $border-radius 0;
		z-index: 1;
		align-items: end;
		justify-content: space-evenly;
		pointer-events: auto;

		&-tick {
			grid-row: 1;
			height: 36px;
			width: 5px;
			z-index: 999;
			padding: 0;
			margin: 0;
			margin-top: -3px;
			border-radius: 4px;

			&.match-tick {
				box-shadow: $box-shadow;
			}
		}
	}
	&__users-tag {
		overflow: visible;
		width: calc(100% - 0.75rem - 100px);
		left: 100px;
		bottom: 3rem;
		border-radius: 0;

		&-user {
			grid-row: 1;
			position: absolute;
			width: auto;
			height: 28px;
			z-index: 999;
			border-radius: 0.45rem;
			letter-spacing: 0px;
			color: white;
			font-size: 1rem;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: $box-shadow;

			.score {
				background-color: fade-out(black, 0.75);
				height: 28px;
				padding: 0 0.5rem;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 0.45rem 0 0 0.45rem;
			}
			.time {
				padding: 0 0.35rem;
				font-size: 0.8rem;

				&.icon {
					font-size: 1rem;
				}
			}
			&.fail-tag {
				transform: translateX(-4rem);
			}
		}
	}
}

@keyframes bar {
	0% {
		width: calc(100% - 1.5rem - 90px);
		background-size: 200% 200%;
	}
	100% {
		width: 0%;
		background-position: 100% 100%;
	}
}
</style>