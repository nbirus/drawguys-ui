import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/home/HomePage.vue"),
  },
  {
    path: "/:id",
    name: "room",
    component: () =>
      import(/* webpackChunkName: "room" */ "@/views/room/RoomPage.vue"),
  },
  {
    path: "/:id/g",
    name: "game",
    component: () =>
      import(/* webpackChunkName: "game" */ "@/views/game/GamePage.vue"),
  },
  {
    path: "/username",
    name: "username",
    component: () =>
      import(/* webpackChunkName: "username" */ "@/views/username/UsernamePage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
