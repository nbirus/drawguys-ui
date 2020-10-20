<script>
import { roomState } from '@/services/Room'
import { watch, ref, computed } from 'vue'

export default {
	name: 'game-timeline',
	props: ['show'],
	setup(props) {
		let animation = ref('')
		let barKey = ref(0)
		let users = ref([])
		let roundOver = computed(() => roomState.gameState.event === 'turn_end')
		let userState = computed(() => roomState.userState)
		let activeSegments = computed(() => {
			let segments = []
			if (roundOver.value) {
				users.value.forEach(u => {
					segments.push(u.match ? getSegment(u.matchTime) : 1)
				})
			}
			return segments
		})
		let matchTick = computed(() => {
			return {
				tickStyle: {
					'grid-column': userState.value.matchTime,
				},
				matchStyle: {
					'grid-column': userState.value.matchTime,
				},
			}
		})

		function getSegment(time) {
			if (time >= 30) {
				return 6
			} else if (time >= 20) {
				return 5
			} else if (time >= 10) {
				return 4
			} else if (time >= 5) {
				return 3
			} else if (time > 0) {
				return 2
			} else {
				return 1
			}
		}

		watch(
			() => props.show,
			() => {
				console.log('HERE')
				animation.value = `animation-duration: ${roomState.gameState.timer}s`
				barKey.value++
			}
		)
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
			animation,
			users,
			barKey,
			activeSegments,
			roundOver,
			matchTick,
			userState,
			scores: ['-50', '+50', '+100', '+200', '+300', '+400'],
		}
	},
}
</script>

<template>
	<div class="timeline card" :class="{ show }">
		<div class="timeline__bar"></div>
		<!-- <div class="timeline__bar-overlay" v-if="!roundOver"></div> -->
		<ul class="timeline__segments absolute-bar">
			<li
				v-for="i in 6"
				:key="i"
				class="timeline__segments-segment"
				:class="{ active: activeSegments.includes(i) }"
			>
				<span class="scores" v-text="scores[i - 1]"></span>
			</li>
		</ul>
		<ul class="timeline__user-ticks absolute-bar">
			<li
				class="timeline__user-ticks-tick"
				:style="matchTick.tickStyle"
				v-if="userState.matchTime > 0"
			></li>
			<!-- <li
				v-for="(user, i) in users"
				:key="i"
				class="timeline__user-ticks-tick"
				:style="user.tickStyle"
				:class="`bg-${user.color}`"
			></li> -->
		</ul>
		<ul class="timeline__users-tag absolute-bar">
			<li
				class="timeline__users-tag-user"
				:style="matchTick.matchStyle"
				:class="`bg-${userState.matchTime === 0 ? 'red' : 'green'}`"
			>
				<div class="score">
					<i class="ri-check-line"></i>
				</div>
				<div class="time"><b v-text="userState.matchTime"></b>s</div>
			</li>
			<!-- <li
				v-for="(user, i) in users"
				:key="i"
				class="timeline__users-tag-user"
				:style="user.matchStyle"
				:class="`bg-${user.color}`"
			>
				<b v-text="user.matchTime"></b>s
			</li> -->
		</ul>
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';

$fail-width: 90px;

.absolute-bar {
	width: calc(100% - 2rem);
	height: 30px;
	left: 1rem;
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
		@include stripe-sm(fade-out($green, 0.7), fade-out($green, 0.8));
		position: relative;

		&-overlay {
			@include stripe-sm($green, darken($green, 5));
			position: absolute;
			top: 0.75rem;
			bottom: 0px;
			height: 30px;
			left: $fail-width;
			z-index: 2;
			animation: bar 40s linear;
		}
	}
	&__segments {
		display: flex;

		&-segment {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			&:nth-child(1) {
				flex: 0 0 $fail-width;
				@include stripe-sm($red, darken($red, 5));
			}
			&.active:not(:first-child) {
				@include stripe-sm($green, darken($green, 5));
			}
			&:not(:last-child) {
				border-right: solid 3px white;
			}

			&:nth-child(6) {
				flex: 0.75;
			}
			.scores {
				color: white;
				background-color: fade-out(black, 0.75);
				font-size: 0.7rem;
				padding: 0.25rem;
				border-radius: 4px;
				z-index: 3;
			}
		}
	}
	&__user-ticks {
		overflow: visible;
		display: grid;
		grid-template-columns: repeat(40, 1fr);
		width: calc(100% - 0.75rem - 100px);
		left: 100px;
		border-radius: 0 $border-radius $border-radius 0;

		&-tick {
			grid-row: 1;
			height: 30px;
			width: 4px;
			z-index: 999;
			border-radius: 3px;
			transform: scale(1.1);

			&.bg-red {
				display: none;
			}
		}
	}
	&__users-tag {
		overflow: visible;
		display: grid;
		grid-template-columns: repeat(40, 1fr);
		width: calc(100% - 0.75rem - 100px);
		left: 100px;
		bottom: 2.85rem;
		align-content: end;
		grid-gap: 0.15rem;

		&-user {
			grid-row: 1;
			height: 28px;
			z-index: 999;
			border-radius: 0.45rem;
			letter-spacing: -1px;
			color: white;
			font-size: 1rem;
			display: flex;
			align-items: center;
			justify-content: center;

			.score {
				background-color: fade-out(black, 0.85);
				height: 28px;
				padding: 0 0.35rem;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.time {
				padding: 0 0.45rem 0 0.25rem;
			}

			&.match {
				transform: scale(1.15) translateY(-0.25rem);
			}
		}
	}
}

@keyframes bar {
	0% {
		width: calc(100% - 2rem - 100px);
		background-size: 200% 200%;
	}
	100% {
		width: 0%;
		background-position: 100% 100%;
	}
}
</style>