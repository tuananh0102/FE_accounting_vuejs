<template>
  <div class="header">
    <div class="header__container">
      <div class="header__left">
        <div class="header__logo">
          <div class="wrapper-icon">
            <img class="icon-application" src="@/assets/icon/sidebar/nine-dots.svg" alt="applications-icon" />
          </div>
          <div class="wrapper-icon">
            <span
              ><img class="website-logo" src="@/assets/icon/Logo_Module_TiengViet_White.66947422.svg" alt="logo"
            /></span>
            <!-- <span class="website-name">KẾ TOÁN</span> -->
          </div>
        </div>
        <div class="header__options">
          <span class="wrapper-icon">
            <img class="icon-bars" src="@/assets/icon/sidebar/bars-solid.svg" alt="bars-icon" />
          </span>
          <span class="company-name" :title="$_MResource[$_LANG_CODE].companyName.misa">
            <p class="company__text text-overflow__ellipsis">{{ $_MResource[$_LANG_CODE].companyName.misa }}</p>
            <span class="wrapper-icon"
              ><img class="icon-down" src="@/assets/icon/angle-down-solid.svg" alt="down-icon"
            /></span>
          </span>
        </div>
      </div>
      <div class="header__right">
        <!-- <span class="header__icon wrapper-icon">
          <img class="icon-bell" src="@/assets/icon/sidebar/bell-regular.svg" alt="bell-icon" />
        </span> -->
        <span :title="$_MResource[$_LANG_CODE].titleIcon.setting" class="wrapper-icon">
          <span class="icon-download"></span>
        </span>
        <m-input
          :urlIcon="require('@/assets/icon/magnifying-glass-solid.svg')"
          :placeholder="$_MResource[$_LANG_CODE].placeholder.searchByKey"
        ></m-input>
        <span :title="$_MResource[$_LANG_CODE].titleIcon.setting" class="wrapper-icon">
          <span class="icon-setting--black"></span>
        </span>
        <span :title="$_MResource[$_LANG_CODE].titleIcon.message" class="wrapper-icon">
          <span class="icon-message"></span>
        </span>
        <span :title="$_MResource[$_LANG_CODE].titleIcon.question" class="wrapper-icon">
          <span class="icon-question"></span>
        </span>
        <span :title="$_MResource[$_LANG_CODE].titleIcon.bell" class="wrapper-icon">
          <span class="icon-bell"></span>
        </span>
        <span class="header__user">
          <span class="wrapper-icon"><span class="avatar"></span></span>
          <span class="username">Trần Tuấn Anh</span>
          <span class="wrapper-icon"
            ><img class="icon-down" src="@/assets/icon/angle-down-solid.svg" alt="down-icon"
          /></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheHeader",
};
</script>

<style></style>
