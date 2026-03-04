import {createApp} from "vue";
import {Ako} from "./ako.ts";
import AkoBootView from "../view/views/AkoBootView.vue";

createApp(AkoBootView)
    .use(new Ako(), {baseUrl: "/api/ako/"})
    .mount("#app")