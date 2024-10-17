import Vue from "vue";

export const vLoading = {
  mounted(el, binding) {
    const loadingComponent = binding.value; // Nhận component MLoading từ binding.value
    const componentInstance = new Vue(loadingComponent).$mount();

    el.appendChild(componentInstance.$el);

    el.__v_loading_component = componentInstance;

    el.__v_loading_callback = function (isLoading) {
      componentInstance.$el.style.display = isLoading ? "block" : "none";
    };

    el.__v_loading_callback(binding.modifiers);
  },

  updated(el, binding) {
    el.__v_loading_callback(binding.modifiers);
  },

  unmounted(el) {
    el.__v_loading_component.$destroy();
    el.__v_loading_component.$el.remove();
    delete el.__v_loading_component;
    delete el.__v_loading_callback;
  },
};
