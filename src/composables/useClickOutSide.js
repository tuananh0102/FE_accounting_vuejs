import { onBeforeUnmount, onMounted } from "vue";

/**
 * Mô tả: xử lý click outside
 * created by : ttanh
 * created date: 05-06-2023
 */
export default function useClickOutSide(el, callback) {
  if (!el) return;
  let listener = (e) => {
    if (e.target == el.value || e.composedPath().includes(el.value)) {
      // click inside
      return;
    }
    callback();
  };
  onMounted(() => {
    window.addEventListener("click", listener);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("click", listener);
  });

  return listener;
}
