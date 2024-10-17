<template>
  <div class="main main-money">
    <div class="main__header">
      <div class="wrapper-links">
        <div class="links">
          <router-link class="wrapper-link" to="/money">
            <span class="wrapper-link__title">{{ MResource.vi.receiptPage.process }}</span>
          </router-link>
          <router-link class="wrapper-link" to="/money/moneyList">
            <span class="wrapper-link__title">{{ MResource.vi.receiptPage.documents }}</span>
          </router-link>
          <router-link class="wrapper-link" to="/apps">
            <span class="wrapper-link__title">{{ MResource.vi.receiptPage.inspect }}</span>
          </router-link>
          <router-link class="wrapper-link" to="/apps">
            <span class="wrapper-link__title">{{ MResource.vi.receiptPage.castFlow }}</span>
          </router-link>
          <router-link class="wrapper-link" to="/apps">
            <span class="wrapper-link__title">{{ MResource.vi.receiptPage.report }}</span>
          </router-link>
        </div>
        <span class="wrapper-icon">
          <span class="icon-setting--small"></span>
        </span>
      </div>
    </div>

    <RouterView></RouterView>
  </div>
</template>

<script setup>
import MResource from "@/scripts/resource";
</script>
