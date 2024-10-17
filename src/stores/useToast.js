import { defineStore } from "pinia";
import { ref } from "vue";

export const useToast = defineStore("toast", () => {
  const msg = ref("");
  const isShow = ref(false);
  const statusToast = ref();
  const timeOut = ref(null);

  function onClose() {
    isShow.value = false;
    window.clearTimeout(timeOut.value);
  }

  function onOpen(message, status) {
    msg.value = message;
    statusToast.value = status;

    timeOut.value = setTimeout(() => {
      isShow.value = false;
    }, 3000);
  }

  return { onClose, onOpen, statusToast, msg, isShow };
});
