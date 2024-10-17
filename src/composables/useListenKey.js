import { onMounted, onBeforeUnmount } from "vue";

export default function useListenKey(keyEvent, keyCode, callback) {
  onMounted(() => {
    window.addEventListener(keyEvent, ($event) => {
      if ($event.keyCode == keyCode) {
        callback();
      }
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener(keyEvent, ($event) => {
      if ($event.keyCode == keyCode) {
        callback();
      }
    });
  });
}
