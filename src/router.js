import { createRouter, createWebHistory } from 'vue-router'
import { userState } from '@/services/User'
import { joinRoom, leaveRoom } from '@/services/Room'

let routeAfterUsername = ''

const routes = [
	{
		path: '/',
		name: 'home',
		meta: {
			title: 'Home',
		},
		component: () =>
			import(/* webpackChunkName: "home" */ '@/views/home/HomePage.vue'),
	},
	{
		path: '/:id',
		name: 'room',
		meta: {
			title: 'Waiting for game to start...',
		},
		component: () =>
			import(/* webpackChunkName: "room" */ '@/views/room/RoomPage.vue'),
	},
	{
		path: '/test/g',
		name: 'game-test',
		meta: {
			title: 'Drawguys',
		},
		component: () =>
			import(/* webpackChunkName: "game" */ '@/views/game/GamePage.vue'),
	},
	{
		path: '/:id/g',
		name: 'game',
		meta: {
			title: 'Drawguys',
		},
		component: () =>
			import(/* webpackChunkName: "game" */ '@/views/game/GamePage.vue'),
	},
	{
		path: '/username',
		name: 'username',
		meta: {
			title: 'Choose Username',
		},
		component: () =>
			import(
				/* webpackChunkName: "username" */ '@/views/username/UsernamePage.vue'
			),
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

router.beforeEach((to, from, next) => {
	// set doc title
	document.title = to.meta.title

	// skip for testing
	if (to.name === 'game-test') {
		next()
		return
	}

	// if routing to username, do nothing
	if (to.name === 'username') {
		next()
	}
	// if the user doesn't have a username
	else if (!userState.username) {
		routeAfterUsername = to.fullPath
		next('/username')
	}
	// if the user just entered a username, go to next route
	else if (routeAfterUsername) {
		next(routeAfterUsername)
		routeAfterUsername = ''
	}

	// default
	else {
		// if coming from room, leave room
		if (
			['room', 'game'].includes(from.name) &&
			userState.roomid &&
			to.name !== 'game' &&
			to.name !== 'room'
		) {
			leaveRoom()
		}
		// if going to room, join it
		else if (['room', 'game'].includes(to.name) && !userState.roomid) {
			joinRoom(to.params.id)
		}

		next()
	}
})

export default router
