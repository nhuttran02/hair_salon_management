import { createApp } from "vue";
import App from "./App.vue";

// Import CSS
import "./assets/app.css";
import router from "./router";
import store from "./store";

// PrimeVue imports
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Tooltip from "primevue/tooltip";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

// Tạo ứng dụng Vue
const app = createApp(App);

// Đăng ký các component PrimeVue
app.component("InputText", InputText);
app.component("Avatar", Avatar);
app.component("Menu", Menu);
app.component("DataTable", DataTable);
app.component("Column", Column);

// Đăng ký các directive PrimeVue
app.directive("tooltip", Tooltip);

// Sử dụng Vuex store và Vue Router
app.use(store);
app.use(router);

// Sử dụng PrimeVue với cấu hình theme
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.component("Toast", Toast);

// Mount ứng dụng
app.mount("#app");
