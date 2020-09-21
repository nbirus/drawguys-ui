import { createRouter, createWebHistory } from "vue-router";
import { userState } from '@/services/User'

let routeAfterUsername = ''

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: 'Home'
    },
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/home/HomePage.vue"),
  },
  {
    path: "/:id",
    name: "room",
    meta: {
      title: 'In room'
    },
    component: () =>
      import(/* webpackChunkName: "room" */ "@/views/room/RoomPage.vue"),
  },
  {
    path: "/:id/g",
    name: "game",
    meta: {
      title: 'Game Started'
    },
    component: () =>
      import(/* webpackChunkName: "game" */ "@/views/game/GamePage.vue"),
  },
  {
    path: "/username",
    name: "username",
    meta: {
      title: 'Choose Username'
    },
    component: () =>
      import(/* webpackChunkName: "username" */ "@/views/username/UsernamePage.vue"),
  },
];  

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {

  // set doc title
  document.title = to.meta.title

  if (to.name === 'username') {
		next()
	} 
  else if (!userState.username) {
    routeAfterUsername = to.fullPath
    next('/username')
  }
  else if (routeAfterUsername) {
    next(routeAfterUsername)
    routeAfterUsername = ''
  }
  else {
    next()
  }

})

export default router;
