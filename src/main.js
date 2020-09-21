import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./styles/index.scss";
import 'remixicon/fonts/remixicon.css'

createApp(App)
  .use(router)
  .mount("#app");
