export const vFocus = {
  mounted(el, binding) {
    // if (binding.arg.first) {
    //   el.focus();
    // }

    if (binding.value) {
      el.focus();
    }
  },

  updated(el, binding) {
    if (binding.value) {
      el.focus();
    }
  },
};
