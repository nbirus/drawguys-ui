<template>
	<router-link
		ref="card"
		class="room card ready-outline-black"
		:class="{ ready: hover }"
		:to="`/${roomid}`"
		@mouseover="hover = true"
		@mouseout="hover = false"
	>
		<div class="room__header">
			<h3 v-text="roomname"></h3>
			<!-- <div class="pill" v-text="`${userList.length}/8`"></div> -->
		</div>
		<ul class="room__users">
			<li class="room__users-user" v-for="user of userList" :key="user.userid">
				<user small v-bind="user" />
			</li>
			<!-- <li class="room__users-user invite" v-for="n of userEmpty" :key="n">
				<i class="ri-user-line"></i>
			</li>-->
		</ul>
	</router-link>
</template>

<script>
import User from '@/components/User'
import { computed, ref, watch } from 'vue'

export default {
	name: 'home-page-room',
	props: ['roomid', 'roomname', 'users'],
	components: { User },
	setup(props) {
		let card = ref(null)
		let hover = ref(false)
		let userList = computed(() => Object.values(props.users))

		watch(hover, togglePopover)

		function togglePopover() {
			if (hover.value) {
				showPopover()
			} else {
				hidePopover()
			}
		}

		function showPopover() {
			let oldPopover = document.getElementById('popover')
			let popover = document.createElement('div')
			let parent = card.value.$el.parentElement
			if (!oldPopover) {
				popover.classList.add('popover-room-card')
				popover.id = 'popover'
				popover.innerHTML = `<div>Click to join room</div>`
				parent.appendChild(popover)
			}
		}
		function hidePopover() {
			let popover = document.getElementById('popover')
			if (popover) {
				popover.remove()
			}
		}

		return {
			card,
			hover,
			userList,
			userEmpty: computed(() =>
				userList.value.length > 3 ? 0 : 3 - userList.value.length
			),
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.room {
	display: block;
	width: 100%;
	text-decoration: none;
	transition: transform 0.2s ease;
	position: relative;

	&__header {
		margin: 0 1.5rem 1.25rem;
		padding: 1.25rem 0;
		border-bottom: solid thin $border-color;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	&__users {
		display: grid;
		grid-template-columns: 1fr;
		padding: 0 1.5rem 1.25rem;
		grid-gap: 1rem;

		&-user {
			&.invite {
				height: $block-height-lg;
				background-color: $light;
				border-radius: $border-radius;
				color: $text-extra-light;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 2.15rem;
			}
		}
	}

	&:hover {
		transform: scale(1.025);
		cursor: pointer;
	}
}
</style>
