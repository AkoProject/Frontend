import {createApp} from "vue";
import {Ako} from "./ako.ts";
import AkoMainView from "../view/views/AkoMainView.vue";

const app = createApp(AkoMainView)

app.use(new Ako(), {baseUrl: "/api/ako/"})
    .mount("#app")