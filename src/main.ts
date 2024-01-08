import './assets/main.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Vue, { createApp } from "vue";
import App from './App.vue';
import router from './router';
import { userStore } from './store/user-store';


const app = createApp(App);

app.use(router);
app.use(userStore);
app.mount('#app');