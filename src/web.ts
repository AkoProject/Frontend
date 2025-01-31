import {createApp} from "vue";
import {Ako} from "./ako.ts";
import AkoBootView from "../view/views/AkoBootView.vue";

const app = createApp(AkoBootView)

app.use(new Ako(), {baseUrl: "/api/ako/"})
    .mount("#app")