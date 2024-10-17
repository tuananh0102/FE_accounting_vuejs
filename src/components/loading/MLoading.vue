<template>
  <div class="background-loading">
    <span class="wrapper-loading"><img class="loading-icon" src="@/assets/icon/loading.svg" alt="loading" /></span>
  </div>
</template>

<script setup></script>
<style>
.background-loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  opacity: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
