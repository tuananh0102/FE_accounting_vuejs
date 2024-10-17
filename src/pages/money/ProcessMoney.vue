<template>
  <div class="main__process-money">
    <div class="main__left">
      <div class="main__left--top">
        <div class="wrapper-title">
          <p class="title">{{ MResource.vi.receiptPage.majorMoney.toUpperCase() }}</p>
        </div>
        <div class="wrapper-content">
          <div class="mi-process-cash"></div>
          <div class="face-btn face-btn--receive">
            <p class="title-btn">{{ MResource.vi.receiptPage.pay }}</p>
          </div>
          <div class="face-btn face-btn--payment">
            <p class="title-btn">{{ MResource.vi.receiptPage.receiverMoney }}</p>
          </div>
          <div class="face-btn face-btn--inventor">
            <p class="title-btn">{{ MResource.vi.receiptPage.inspectFund }}</p>
          </div>
        </div>
      </div>
      <div class="main__left--bottom">
        <div class="dictionary-item">
          <div class="dictionary-content">
            <div class="wrapper-icon">
              <span class="icon-customer--green"></span>
            </div>
            <p class="icon-text">{{ MResource.vi.receiptPage.customer }}</p>
          </div>
        </div>
        <div class="dictionary-item">
          <div class="dictionary-content">
            <div class="wrapper-icon">
              <span class="icon-provider--green"></span>
            </div>
            <p class="icon-text">{{ MResource.vi.receiptPage.provider }}</p>
          </div>
        </div>
        <div class="dictionary-item">
          <div class="dictionary-content">
            <div class="wrapper-icon">
              <span class="icon-employee--green"></span>
            </div>
            <p class="icon-text">{{ MResource.vi.receiptPage.employee }}</p>
          </div>
        </div>
        <div class="dictionary-item">
          <div class="dictionary-content">
            <div class="wrapper-icon">
              <span class="icon-inventory--green"></span>
            </div>
            <p class="icon-text">{{ MResource.vi.receiptPage.depositeRate }}</p>
          </div>
        </div>
        <div class="dictionary-item">
          <div class="dictionary-content">
            <div class="wrapper-icon">
              <span class="icon-setting--green"></span>
            </div>
            <p class="icon-text">{{ MResource.vi.receiptPage.options }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="main__right">
      <div class="wrapper-title">
        <p class="title">{{ MResource.vi.receiptPage.report.toUpperCase() }}</p>
      </div>
      <div class="favorite-record">
        <ul class="list-record">
          <li class="record">{{ MResource.vi.receiptPage.listMoneyDay }}</li>
          <li class="record">{{ MResource.vi.receiptPage.moneyFlow }}</li>
          <li class="record">{{ MResource.vi.receiptPage.detailAccounting }}</li>
        </ul>
      </div>
      <div class="right__footer">{{ MResource.vi.receiptPage.allReport }}</div>
    </div>
  </div>
</template>

<script setup>
import MResource from "@/scripts/resource";
</script>
