<template>
  <ul ref="contextMenu" class="context-menu" :style="{ top: topPosition }">
    <li @click="async () => await onDuplicatedContextMenu(index)" class="context-menu__option option--copy">
      {{ $_MResource[$_LANG_CODE].button.duplicate }}
    </li>
    <li @click="onDelete" class="context-menu__option option--delete">{{ $_MResource[$_LANG_CODE].button.delete }}</li>
    <li @click="onToggleStop" class="context-menu__option option--stop">
      {{ $_MResource[$_LANG_CODE].button.stopUse }}
    </li>
  </ul>
</template>

<script>
import useClickOutSide from "@/composables/useClickOutSide.js";
import { ref } from "vue";
export default {
  name: "MContextMenu",
  data() {
    return {
      y: "100px",

      isShowContextMenu: false,
      employees: [],
    };
  },

  props: {
    topPosition: String,
    onShowDialog: Function,
    onClose: Function,
    onDuplicated: Function,
    onToggleStop: {
      type: Function,
      default: () => {},
    },
    index: Number,
  },

  methods: {
    async onDuplicatedContextMenu(index) {
      await this.onDuplicated(index);
      this.onClose();
    },
    /**
     * Mô tả: hiển thị thống báo khi bấm xóa
     * created by : ttanh
     * created date: 29-05-2023
     */
    onDelete() {
      this.onShowDialog();
      this.onClose();
    },
  },

  setup(props) {
    const contextMenu = ref();
    useClickOutSide(contextMenu, props.onClose);
    return { contextMenu };
  },
};
</script>

<style></style>
