import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./styles/index.scss";
import 'remixicon/fonts/remixicon.css'

let favicon = document.querySelector('#fav')
if (favicon && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  favicon.href = '/logo-dark.png'
}

createApp(App)
  .use(router)
  .mount("#app");
