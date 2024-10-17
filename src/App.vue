<template>
  <div class="container" id="layout">
    <TheHeader></TheHeader>
    <TheSidebar></TheSidebar>
    <TheMain></TheMain>
  </div>
</template>

<script>
import TheHeader from "@/layout/TheHeader.vue";
import TheSidebar from "@/layout/TheSidebar.vue";
import TheMain from "@/layout/TheMain.vue";

export default {
  name: "App",
  components: { TheHeader, TheSidebar, TheMain },
};
</script>

<style>
@import url("@/css/main.css");
@import url("@/css/layout.css");
</style>
