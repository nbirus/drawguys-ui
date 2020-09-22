<template>
	<router-link class="room card" :to="`/${roomid}`">
		<div class="room__header">
			<h3 v-text="roomname"></h3>
			<div class="pill" v-text="`${userList.length}/8`"></div>
		</div>
		<ul class="room__users">
			<li class="room__users-user" v-for="user of userList" :key="user.userid">
				<user v-bind="user" />
			</li>
			<li class="room__users-user invite" v-for="n of userEmpty" :key="n">
				<i class="ri-user-line"></i>
			</li>
		</ul>
	</router-link>
</template>

<script>
import User from '@/components/User'
import { computed } from 'vue'

export default {
	name: 'home-page-room',
	props: ['roomid', 'roomname', 'users'],
	components: { User },
	setup(props) {
		let userList = computed(() => Object.values(props.users))
		return {
			userList,
			userEmpty: computed(() =>
				userList.value.length > 4 ? 0 : 4 - userList.value.length
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

	&__header {
		margin-bottom: 1rem;
		padding: 2rem 2rem 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	&__users {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 0 2rem 2rem;
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
}
</style>
