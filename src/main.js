import { createApp } from "vue";

import App from "./App.vue";
import { createPinia } from "pinia";

import router from "@/router/router";
import MResource from "@/scripts/resource";
import MEnum from "@/scripts/enum";

import MButton from "@/components/button/MButton.vue";
import MInput from "@/components/input/MInput.vue";
import MContextMenu from "@/components/context_menu/MContextMenu.vue";
import MDataTable from "@/components/data_table/MDataTable.vue";
import MDialog from "@/components/dialog/MDialog.vue";
import MToastMsg from "@/components/toast_msg/MToastMsg.vue";
import MPagination from "@/components/pagination/MPagination";
import MCombobox from "@/components/combobox/MCombobox";

const pinia = createPinia();
const app = createApp(App);

app.config.globalProperties.$_MResource = MResource;
app.config.globalProperties.$_MEnum = MEnum;
app.config.globalProperties.$_LANG_CODE = "vi";

app.component("m-button", MButton);
app.component("m-input", MInput);
app.component("m-context-menu", MContextMenu);
app.component("m-data-table", MDataTable);
app.component("m-dialog", MDialog);
app.component("m-toast-msg", MToastMsg);
app.component("m-pagination", MPagination);
app.component("m-combobox", MCombobox);

app.use(pinia);
app.use(router);

app.mount("#app");
