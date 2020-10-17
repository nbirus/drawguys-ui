<script>
import { roomState } from '@/services/Room'
import { computed, watch, ref } from 'vue'

export default {
	name: 'game-timeline',
	data() {
		return {
			scores: ['Loser', '+50', '+100', '+200', '+300'],
			times: ['', '0s', '5s', '10s', '20s'],
		}
	},
	setup() {
		let users = ref([])
		let timer = computed(() => roomState.gameState.timer)
		let playersGuessed = computed(() => roomState.gameState.playersGuessed > 0)
		let user = computed(() => roomState.userState)
		// let users = computed(() =>
		// 	Object.values(roomState.usersState).filter(user => !user.drawing)
		// )
		let roundOver = computed(() => roomState.gameState.event === 'turn_end')
		let segmentMatched = computed(() => {
			if (!user.value.match) {
				return timer.value > 0 ? -1 : 1
			}
			return getSegment(user.value.matchTime)
		})
		let activeSegments = computed(() => {
			let segments = []
			if (roundOver.value) {
				users.value.forEach(u => {
					segments.push(u.match ? getSegment(u.matchTime) : 1)
				})
			}
			return segments
		})
		let match = computed(
			() =>
				!roundOver.value &&
				!roomState.userState.drawing &&
				roomState.userState.match
		)

		function getSegment(time) {
			if (time >= 20) {
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
			() => roomState.gameState.event,
			event => {
				console.log(event)
				if (event === 'turn_end') {
					segmentIndex = [0, 0, 0, 0, 0]
					users.value = Object.values(roomState.usersState)
						.filter(u => !u.drawing)
						.map(u => ({
							...u,
							segment: getSegment(u.matchTime),
							row: getRow(u.matchTime),
						}))
				}
			},
			{
				immediate: true,
			}
		)

		let segmentIndex = [0, 0, 0, 0, 0]
		function getRow(time) {
			return 6 - ++segmentIndex[getSegment(time) - 1]
		}
		function getPosition(time) {
			let barWidth = 650
			let percent = time / 30
			return barWidth * percent
		}

		return {
			user,
			users,
			roundOver,
			segmentMatched,
			activeSegments,
			getSegment,
			getPosition,
			playersGuessed,
			getRow,
			match,
		}
	},
}
</script>

<template>
	<div
		class="game-timeline card outline-red"
		:class="{ round: roundOver, match }"
	>
		<div class="game-timeline__bar">
			<ul class="game-timeline__segments">
				<li
					v-for="i in 5"
					:key="i"
					class="game-timeline__segments-segment"
					:class="{
						active: activeSegments.includes(i),
						match: segmentMatched === i,
					}"
				>
					<span class="scores" v-text="scores[i - 1]"></span>
					<span class="times" v-text="times[i - 1]"></span>
				</li>
			</ul>
			<!-- <ul class="game-timeline__user-lines" v-if="roundOver">
				<li
					v-for="(user, i) in users"
					:key="i"
					:style="`margin-left: ${getPosition(user.matchTime)}px`"
					:class="`bg-${user.color} grid-${getSegment(user.matchTime)} `"
				></li>
			</ul> -->

			<transition-group
				tag="ul"
				name="list"
				class="game-timeline__users"
				appear
				v-if="roundOver"
			>
				<li
					v-for="(user, i) in users"
					:key="i"
					class="game-timeline__users-user"
					:class="
						`bg-${user.color} grid-${user.segment} grid-row-${user.row} delay-${i}`
					"
				>
					<div class="icon" v-if="user.match">
						<b v-text="user.matchTime"></b>s
					</div>
					<!-- <div class="icon" v-else><i class="ri-forbid-line"></i></div> -->
					<div class="text">
						<span v-text="user.username"></span>
					</div>
				</li>
			</transition-group>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.game-timeline {
	padding: 1rem 1rem 1.25rem;
	width: 695px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: solid thin $border-color;
	position: relative;

	&:after {
		content: '';
		position: absolute;
		top: -1px;
		right: -1px;
		bottom: -1px;
		left: -1px;
		border-radius: $border-radius;
		transition: box-shadow 0.2s ease;
	}
	&:not(.round):after {
		box-shadow: inset 0 0 1px 3px $red;
	}
	&.match:after {
		box-shadow: inset 0 0 1px 3px $green;
	}

	&__bar {
		width: 100%;
		height: 30px;
		border-radius: $border-radius;
		position: relative;
		box-shadow: $box-shadow;
	}
	&__segments {
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		border-radius: $border-radius;
		display: flex;

		&-segment {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			border-right: solid thin fade-out(black, 0.9);

			&.active,
			&.match {
				z-index: 1;

				.scores {
					background-color: fade-out(black, 0.5);
					opacity: 1;
					color: white;
				}
			}

			.scores {
				color: white;
				background-color: fade-out(black, 1);
				font-size: 0.8rem;
				opacity: 0.75;
				padding: 0.25rem;
				border-radius: 4px;
				opacity: 0;
			}
			.times {
				position: absolute;
				bottom: -1rem;
				color: $text-light;
				left: 0.5rem;
				font-size: 0.75rem;
			}

			&:nth-child(1) {
				@include stripe-sm(fade-out($red, 0.9), fade-out($red, 0.95));

				&.match,
				&.active {
					@include stripe-sm($red, lighten($red, 5));
				}
			}
			&:nth-child(2) {
				@include stripe-sm(fade-out($green, 0.75), fade-out($green, 0.85));

				&.match,
				&.active {
					@include stripe-sm($green, lighten($green, 5));
				}
			}
			&:nth-child(3) {
				@include stripe-sm(fade-out($green, 0.75), fade-out($green, 0.85));

				&.match,
				&.active {
					@include stripe-sm($green, lighten($green, 5));
				}
			}
			&:nth-child(4) {
				@include stripe-sm(fade-out($green, 0.75), fade-out($green, 0.85));

				&.match,
				&.active {
					@include stripe-sm($green, lighten($green, 5));
				}
			}
			&:nth-child(5) {
				@include stripe-sm(fade-out($green, 0.75), fade-out($green, 0.85));

				&.match,
				&.active {
					@include stripe-sm($green, lighten($green, 5));
				}
			}

			&:first-child {
				border-radius: $border-radius 0 0 $border-radius;
			}
			&:last-child {
				border-radius: 0 $border-radius $border-radius 0;
				border-right: none;
			}
		}
	}
	&__user-lines {
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		z-index: 1;

		li {
			width: 3px;
			height: 100%;
		}
	}
	&__users {
		width: 100%;
		position: absolute;
		bottom: 35px;
		z-index: 2;
		display: grid;
		grid-auto-flow: dense;
		grid-template-columns: repeat(5, 1fr);
		grid-auto-rows: auto;
		// align-items: stretch;
		justify-content: center;
		align-content: end;
		grid-gap: 0.35rem 0.15rem;

		&-user {
			display: flex;
			align-items: center;
			border-radius: $border-radius;
			box-shadow: $box-shadow;
			grid-column-start: 1;
			grid-row-start: 1;
			border: solid 3px $green;

			.icon {
				padding: 0.4rem 0.25rem 0.4rem 0.3rem;
				background-color: fade-out(black, 0.75);
				border-radius: $border-radius 0 0 $border-radius;
				color: white;
				flex: 0 0 auto;
				font-size: 0.7rem;

				i {
					font-size: 0.8rem;
				}
			}
			.text {
				flex: 0 0 auto;
				padding: 0.35rem;
				padding-right: 0.45rem;
				font-size: 0.7rem;
				color: white;
				width: 100%;
			}

			&.grid-1 {
				grid-column: 1;
				border: solid 3px $red;

				.text {
					padding-right: 0rem;
					text-align: center;
				}
			}
			&.grid-2 {
				grid-column: 2;
			}
			&.grid-3 {
				grid-column: 3;
			}
			&.grid-4 {
				grid-column: 4;
			}
			&.grid-5 {
				grid-column: 5;
			}
			&.grid-row-1 {
				grid-row: 1;
			}
			&.grid-row-2 {
				grid-row: 2;
			}
			&.grid-row-3 {
				grid-row: 3;
			}
			&.grid-row-4 {
				grid-row: 4;
			}
			&.grid-row-5 {
				grid-row: 5;
			}
			&.grid-row-6 {
				grid-row: 6;
			}
		}
	}
}
</style>