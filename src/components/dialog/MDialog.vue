<template>
  <div class="overlay"></div>
  <div class="dialog">
    <div class="dialog__container">
      <div class="dialog__top" v-if="title">
        <h3 class="dialog__header">{{ title }}</h3>

        <div @click="onCancel" class="dialog__icon">
          <button class="empty-btn" ref="empty" @keydown.tab.prevent="() => onTabNexto('refuse')"></button>
          <button class="close-btn" ref="closeBtn" tabindex="-1" @keydown.tab.prevent="() => onTabNexto('refuse')">
            <img class="base-icon" src="@/assets/icon/xmark-solid.svg" alt="close-icon" />
          </button>
        </div>
      </div>
      <div class="dialog__mid">
        <span class="wrapper-icon">
          <span :class="iconClass"></span>
        </span>
        <span class="dialog__desc">
          <slot></slot>
        </span>
      </div>
      <div class="dialog__bottom" :class="{ reverse: !btnCancle }">
        <button
          @click="onCancel"
          class="base-btn sub-btn"
          v-if="btnCancle"
          ref="cancel"
          @keydown.tab.prevent="() => onTabNexto('success')"
        >
          <span class="btn__text btn__text--black">{{ btnCancle }}</span>
        </button>
        <div class="dialog__bottom--right">
          <button
            @click="onRefuse"
            class="base-btn sub-btn"
            v-if="btnRefuse"
            tabindex="0"
            ref="refuse"
            @keydown.tab.prevent="() => onTabNexto('cancel')"
          >
            <span class="btn__text btn__text--black">{{ btnRefuse }}</span>
          </button>
          <button
            @click="onSuccess"
            class="base-btn regular-btn ml-8"
            v-if="btnSuccess"
            ref="success"
            @keydown.tab.prevent="() => onTabNexto('closeBtn')"
          >
            <span class="btn__text">{{ btnSuccess }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MDialog",
  emits: ["onCancel", "onSuccess", "onRefuse"],
  props: {
    title: String,
    iconClass: String,
    desc: String,
    btnSuccess: String,
    btnCancle: String,
    btnRefuse: String,
    // isShow: Boolean,
  },
  methods: {
    /**
     * Mô tả: sự kiện đóng
     * created by : ttanh (01-07-2023)
     */
    onCancel() {
      this.$emit("onCancel");
    },

    /**
     * Mô tả:  sự kiện thành công
     * created by : ttanh (01-07-2023)
     */
    onSuccess() {
      this.$emit("onSuccess");
    },

    /**
     * Mô tả: sự kiện từ chối
     * created by : ttanh (01-07-2023)
     */
    onRefuse() {
      this.$emit("onRefuse");
    },

    /**
     * Mô tả: nhấn tab sẽ focus vào ô mong muốn
     * created by : ttanh (01-07-2023)
     */
    onTabNexto(ref) {
      if (this.$refs[ref]) {
        this.$refs[ref].focus();
      }
    },
  },

  mounted() {
    this.$refs.empty.focus();
  },
};
</script>

<style scoped>
.reverse {
  flex-direction: row-reverse;
}
.overlay {
  z-index: 19;
}

.empty-btn {
  outline: none;
  border: none;
}

.close-btn {
  border: none;
  background-color: #fff;
}

.close-btn:focus {
  outline: 2px solid #bdbdbd;
}
</style>
