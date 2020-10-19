<template>
	<div class="timeline card" :class="{ show }">
		<div class="timeline__bar"></div>
		<div class="timeline__bar-overlay"></div>
		<ul class="timeline__segments absolute-bar">
			<li v-for="i in 6" :key="i" class="timeline__segments-segment">
				<span class="scores" v-text="scores[i - 1]"></span>
			</li>
		</ul>
		<ul class="timeline__users absolute-bar">
			<li
				v-for="(user, i) in users"
				:key="i"
				class="timeline__users-user"
				:style="user.matchStyle"
				:class="`bg-${user.color}`"
			></li>
		</ul>
		<!-- <ul class="timeline__users-tag absolute-bar">
			<li
				v-for="(user, i) in users"
				:key="i"
				class="timeline__users-tag-user"
				:style="user.matchStyle"
				:class="`bg-${user.color}`"
			>
				<b v-text="user.matchTime"></b>s
			</li>
		</ul> -->
	</div>
</template>

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
		// let users = computed(() =>
		// 	Object.values(roomState.usersState)
		// 		.filter(user => user.match)
		// 		.map(user => ({
		// 			...user,
		// 			matchStyle: getStyle(user),
		// 		}))
		// )

		watch(
			() => props.show,
			() => {
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
					users.value.push(newUser)
				}
			})
		}

		function getStyle(user) {
			return
		}

		function getRow(time) {
			return 30 - ++secondCounts[time]
		}

		return {
			animation,
			users,
			barKey,
			scores: ['-50', '+50', '+100', '+200', '+300', '+400'],
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.absolute-bar {
	width: calc(100% - 2rem);
	height: 30px;
	left: 1rem;
	position: absolute;
	border-radius: $border-radius;
	overflow: hidden;
}

.timeline {
	padding: 0.75rem 1rem;
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
			left: 116px;
			z-index: 2;
			animation: bar 30s linear;
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

			&:not(:last-child) {
				border-right: solid 3px white;
			}
			&:nth-child(1) {
				flex: 0 0 100px;
				@include stripe-sm($red, darken($red, 5));
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
	&__users {
		overflow: visible;
		display: grid;
		grid-template-columns: repeat(30, 1fr);
		width: calc(100% - 2rem - 100px);
		left: calc(100px + 1rem);
		border-radius: 0 $border-radius $border-radius 0;

		&-user {
			grid-row: 1;
			height: 30px;
			width: 4px;
			z-index: 999;
			border-radius: 3px;
			transform: scale(1.1);
		}
	}
	&__users-tag {
		overflow: visible;
		display: grid;
		grid-template-columns: repeat(30, 1fr);
		width: calc(100% - 2rem - 100px);
		left: calc(100px + 1rem);
		top: -1.25rem;
		border-radius: 0 $border-radius $border-radius 0;

		&-user {
			grid-row: 1;
			height: 25px;
			width: 36px;
			z-index: 999;
			border-radius: 3px;
			color: white;
			font-size: 0.9rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}

@keyframes bar {
	0% {
		width: calc(100% - 100px);
		background-size: 200% 200%;
	}
	100% {
		width: 0%;
		background-position: 100% 100%;
	}
}
</style>