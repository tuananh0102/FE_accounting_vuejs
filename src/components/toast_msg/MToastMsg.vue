<template>
  <div class="toast-msg">
    <div class="toast-msg__main">
      <div class="toast-msg__left">
        <span class="wrapper-icon">
          <span :class="iconClass"></span>
        </span>
        <div class="toast-msg__message">
          <span :class="{ ...statusClass }">{{ status }}</span>
          <span class="msg-desc"> {{ desc }}</span>
        </div>
      </div>
      <div class="toast-msg__right">
        <span class="toast-msg__icon" @click="close"
          ><img class="base-icon" src="@/assets/icon/xmark-solid.svg" alt="close-icon"
        /></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MToastMsg",

  props: {
    iconClass: String,
    status: String,
    desc: String,
    statusClass: Object,
    close: Function,
  },
};
</script>

<style scoped>
.wrapper-icon {
  padding-right: 8px;
}
</style>
