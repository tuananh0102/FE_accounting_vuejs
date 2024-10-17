<template>
  <button
    :disabled="isDisable"
    ref="btn"
    class="base-btn"
    :class="[{ disable: isDisable, 'single-btn': singleBtn, 'btn-container': !singleBtn, 'round-btn': round }]"
    @click="
      async () => {
        if (singleBtn) await textBtnClick();
      }
    "
  >
    <button
      v-if="singleBtn"
      :class="[{ disable: isDisable, 'round-btn': round, [typeBtn]: singleBtn }]"
      class="btn--child"
    >
      <p class="btn__text">
        <slot></slot>
        <span v-if="urlIcon" class="wrapper-icon"> <span :class="urlIcon"></span> </span>
      </p>
    </button>

    <button
      :disabled="isDisable"
      v-if="!singleBtn"
      ref="btn"
      :class="[typeBtn, { disable: isDisable, 'btn-text--round': round, 'db-btn-left': !singleBtn }]"
      class="base-btn"
      @click="async () => await textBtnClick()"
    >
      <p class="btn__text"><slot></slot></p>
    </button>
    <button
      :disabled="isDisable"
      v-if="!singleBtn"
      class="base-btn btn-icon"
      :class="[typeBtn, { disable: isDisable, 'btn-icon--round': round, 'db-btn-right': !singleBtn }]"
      @click="iconBtnClick"
    >
      <span class="wrapper-icon">
        <span :class="urlIcon"></span>
      </span>
    </button>
    <slot name="options"></slot>
  </button>
</template>

<script>
export default {
  name: "MButton",
  methods: {
    focus() {
      this.$refs.btn.focus();
    },
  },
  props: {
    urlIcon: String,
    round: {
      type: Boolean,
      default: false,
    },
    typeBtn: {
      type: String,
      default: "sub-btn",
    },
    singleBtn: {
      type: Boolean,
      default: false,
    },
    textBtnClick: Function,
    iconBtnClick: Function,
    isDisable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style></style>
