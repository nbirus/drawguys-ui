<script>
import { roomState } from '@/services/Room'
import { watch, ref, computed } from 'vue'

export default {
	name: 'game-timeline',
	setup(props) {
		// helpers
		let event = computed(() => roomState.gameState.event)
		let drawing = computed(() => roomState.userState.drawing)
		let selecting = computed(() => roomState.userState.selecting)
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
		watch(() => event.value, onEvent)

		function onShow() {
			setTimeout(() => {
				showOtherUsers.value = true
			}, 3000)
		}
		function onEvent() {
			// if (event.value === 'turn_start') {
			// }
		}
		function onMatch() {
			// matchTick
		}

		let activeSegments = computed(() => {
			if (!showOtherUsers.value && match.value) {
				return [getSegment(matchTime.value)]
			} else return []
		})

		let users = ref([])

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

		watch(
			() => roomState.usersState,
			() => {
				setUsers()
			},
			{
				deep: true,
			}
		)

		let secondCounts = []
		function setUsers() {
			secondCounts = []
			for (let i = 1; i <= 30; i++) {
				secondCounts[i] = 0
			}
			Object.values(roomState.usersState).forEach(user => {
				let newUser = JSON.parse(JSON.stringify(user))

				if (newUser.match) {
					// set match style
					newUser.matchStyle = {
						'grid-column': newUser.matchTime,
						'grid-row': getRow(newUser.matchTime),
					}
					newUser.tickStyle = {
						'grid-column': newUser.matchTime,
					}
					users.value.push(newUser)
				}
			})
		}
		function getRow(time) {
			return 30 - ++secondCounts[time]
		}

		return {
			show,
			matchTime,
			turnScore,
			showOtherUsers,
			activeSegments,

			users,

			scores: ['-50', '+50', '+100', '+200', '+400', '+450'],
		}
	},
}
</script>

<template>
	<div class="timeline card" :class="{ show }">
		<div class="timeline__bar"></div>
		<div class="timeline__bar-overlay" :class="{ show: showOtherUsers }"></div>

		<ul class="timeline__segments">
			<li
				v-for="i in 6"
				:key="i"
				class="timeline__segments-segment"
				:class="{
					active: activeSegments.includes(i) || (i === 1 && showOtherUsers),
				}"
			>
				<span class="scores" v-text="scores[i - 1]"></span>
			</li>

			<ul class="timeline__user-ticks absolute-bar">
				<li
					v-if="!showOtherUsers"
					class="timeline__user-ticks-tick match-tick bg-green"
					:style="`grid-column: ${matchTime}`"
				></li>
				<li
					v-else
					v-for="(user, i) in users"
					:key="i"
					class="timeline__user-ticks-tick"
					:style="user.tickStyle"
					:class="`bg-${user.color}`"
				></li>
			</ul>
		</ul>

		<ul class="timeline__users-tag absolute-bar">
			<li
				v-if="!showOtherUsers"
				class="timeline__users-tag-user match-tag"
				:style="`grid-column: ${matchTime}`"
				:class="`bg-${matchTime === 0 ? 'red fail-tag' : 'green'}`"
			>
				<div class="score">
					<i :class="`ri-${matchTime === 0 ? 'close' : 'check'}-line`"></i>
				</div>
				<div class="time"><b v-text="`${matchTime}`"></b>s</div>
			</li>
			<li
				v-else
				v-for="(user, i) in users"
				:key="i"
				class="timeline__users-tag-user"
				:style="user.matchStyle"
				:class="`bg-${user.color}`"
			>
				<div class="score">
					<i :class="`ri-${user.matchTime === 0 ? 'close' : 'check'}-line`"></i>
				</div>
				<div class="time"><b v-text="`${user.matchTime}`"></b>s</div>
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
		width: calc(100% - 90px - 1.5rem);
		left: calc(0.75rem + 90px);
		border-radius: 0 $border-radius $border-radius 0;
		z-index: 1;

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
		display: grid;
		grid-template-columns: repeat(40, 1fr);
		width: calc(100% - 0.75rem - 100px);
		left: 100px;
		bottom: 3.25rem;
		align-content: end;
		grid-gap: 0.15rem;

		&-user {
			grid-row: 1;
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
				padding: 0 0.35rem;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 0.45rem 0 0 0.45rem;
			}
			i {
				font-size: 0.8rem;
			}
			.time {
				padding: 0 0.45rem 0 0.25rem;
				font-size: 0.8rem;
			}

			&.match-tag {
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