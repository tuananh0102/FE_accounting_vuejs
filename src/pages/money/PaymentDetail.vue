<template>
  <div class="payment-detail-container">
    <MLoading v-if="receipt.isLoadingPage"></MLoading>
    <div class="container__header">
      <div class="header__left">
        <div class="wrapper-title">
          <div class="wrapper-icon">
            <span class="icon-clock"></span>
          </div>
          <p class="header__title pr-12">{{ MResource.vi.receiptPage.payment }} {{ receipt.inputObj.ReceiptCode }}</p>
        </div>
        <div class="combobox">
          <span class="wrapper-input">
            <input
              class="base-input input-icon input-icon-search"
              type="text"
              id="search"
              placeholder="- Chọn giá trị -"
              :value="MResource.vi.receiptPage.paymentForProvider"
              readonly
            />

            <span @click.stop="onToggleShowBoardValue" class="wrapper-icon plr-12">
              <span class="combobox__icon-down"></span>
            </span>
          </span>
        </div>
      </div>
      <div class="header__right">
        <span class="wrapper-icon no-padding">
          <span class="icon-instruct"></span>
        </span>
        <span class="question pr-12">{{ MResource.vi.receiptPage.guide }}</span>
        <span class="wrapper-icon">
          <span class="icon-setting-bold"></span>
        </span>
        <span class="wrapper-icon">
          <span class="icon-question"></span>
        </span>
        <span class="wrapper-icon" @click="receipt.closeForm">
          <span class="icon-close"></span>
        </span>
      </div>
    </div>
    <div class="container__top">
      <div class="container__mid">
        <div class="container-info">
          <div class="basic-information w-3/4">
            <div class="right-separate w-4/5">
              <div class="two-cols">
                <span class="popup__field flex-1">
                  <label class="label-input">{{ MResource.vi.providerPage.fields.ProviderCode }}</label>
                  <m-combobox
                    :title="receipt.errors.ProviderId"
                    :listenObj="receipt.errors"
                    displayValueInput
                    :isInvalid="Object.keys(receipt.errors).includes('ProviderId')"
                    :disable="receipt.isDisableAll || receipt.isDisableApart"
                    :ref="orderRefs.ProviderId"
                    :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                    :listSelections="receipt.listProvider"
                    :data="receipt.inputObj"
                    :cols="colsProvider"
                    :reloadList="receipt.searchComboboxProvider"
                    @handleLazyLoad="async (input) => await receipt.handleLazyLoadProvider(input)"
                    :widthBoardValue="270"
                    idFieldList="ProviderId"
                    idFieldObj="ProviderId"
                    displayField="ProviderCode"
                    :isLoading="receipt.isLoadingCombobox"
                  ></m-combobox>
                </span>
                <span class="popup__field flex-1dot5 ml-8">
                  <label class="label-input">{{ MResource.vi.providerPage.fields.ProviderName }}</label>

                  <m-input
                    :maxLength="100"
                    :disable="receipt.isDisableAll"
                    v-model="receipt.inputObj.ProviderName"
                    type="text"
                  ></m-input>
                </span>
              </div>
              <div class="two-cols">
                <span class="popup__field flex-1">
                  <label class="label-input">{{ MResource.vi.receiptPage.receiver }}</label>
                  <m-input
                    :maxLength="100"
                    :disable="receipt.isDisableAll"
                    v-model="receipt.inputObj.ReceiptReceiver"
                    :class="{
                      invalid: false,
                    }"
                  ></m-input>
                </span>
                <span class="popup__field flex-1dot5 ml-8">
                  <label class="label-input">{{ MResource.vi.receiptPage.address }}</label>

                  <m-input
                    :maxLength="255"
                    :disable="receipt.isDisableAll"
                    v-model="receipt.inputObj.ReceiptAddress"
                    type="text"
                  ></m-input>
                </span>
              </div>

              <span class="popup__field">
                <label class="label-input">{{ MResource.vi.receiptPage.payReason }}</label>
                <m-input
                  :maxLength="255"
                  :disable="receipt.isDisableAll"
                  v-model="receipt.inputObj.ReceiptDescription"
                  :class="{
                    invalid: false,
                  }"
                ></m-input>
              </span>

              <div class="two-cols">
                <span class="popup__field flex-1">
                  <label class="label-input">{{ MResource.vi.receiptPage.employee }}</label>
                  <m-combobox
                    :listenObj="receipt.errors"
                    :isInvalid="Object.keys(receipt.errors).includes('EmployeeId')"
                    :displayValueInput="true"
                    :disable="receipt.isDisableAll"
                    :ref="orderRefs.EmployeeId"
                    :title="receipt.errors.EmployeeId"
                    :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                    :listSelections="receipt.listEmployee"
                    :data="receipt.inputObj"
                    :cols="colsEmployee"
                    :reloadList="receipt.searchComboboxEmployee"
                    :widthBoardValue="200"
                    idFieldList="EmployeeId"
                    idFieldObj="EmployeeId"
                    displayField="FullName"
                  ></m-combobox>
                </span>
                <span class="popup__field flex-1dot5 ml-8 small">
                  <label class="label-input">{{ MResource.vi.receiptPage.attach }}</label>

                  <div class="display-flex">
                    <m-input
                      :maxLength="11"
                      :disable="receipt.isDisableAll"
                      v-model="receipt.inputObj.ReceiptAttachNumber"
                      type="number"
                    ></m-input>
                    <p class="ml-6">{{ MResource.vi.receiptPage.rootDocuments }}</p>
                  </div>
                </span>
              </div>
            </div>
            <div class="left-separate w-1/5">
              <span class="popup__field flex-1">
                <label class="label-input">{{ MResource.vi.receiptPage.dateAccounting }}</label>
                <m-input
                  :ref="orderRefs.DateAccounting"
                  :disable="receipt.isDisableAll || receipt.isDisableApart"
                  v-model="receipt.inputObj.DateAccounting"
                  :listenObj="receipt.errors"
                  :title="receipt.errors.DateAccounting"
                  :isInvalid="Object.keys(receipt.errors).includes('DateAccounting')"
                  type="date"
                  :class="{
                    invalid: false,
                  }"
                ></m-input>
              </span>
              <span class="popup__field flex-1">
                <label class="label-input">{{ MResource.vi.receiptPage.datePayment }}</label>
                <m-input
                  :disable="receipt.isDisableAll || receipt.isDisableApart"
                  v-model="receipt.inputObj.ReceiptDate"
                  type="date"
                  :class="{
                    invalid: false,
                  }"
                ></m-input>
              </span>
              <span class="popup__field flex-1">
                <label class="label-input">{{ MResource.vi.receiptPage.numPayment }}</label>
                <m-input
                  :maxLength="19"
                  :disable="receipt.isDisableAll || receipt.isDisableApart"
                  :ref="orderRefs.ReceiptCode"
                  :title="receipt.errors.ReceiptCode"
                  v-model="receipt.inputObj.ReceiptCode"
                  :listenObj="receipt.errors"
                  :isInvalid="Object.keys(receipt.errors).includes('ReceiptCode')"
                  :class="{
                    invalid: false,
                  }"
                ></m-input>
              </span>
            </div>
          </div>
          <div class="summary-info w-1/4">
            <p class="mt-8">{{ MResource.vi.receiptPage.sum }}</p>
            <h1 :class="{ 'color-bold-red': receipt.inputObj.TotalMoney < 0 }">
              {{ formatMoney(receipt.inputObj.TotalMoney, false) }}
            </h1>
          </div>
        </div>
      </div>
      <div class="container__bottom">
        <div class="tab-detail">
          <h4>{{ MResource.vi.receiptPage.accounting }}</h4>
          <div class="display-flex">
            {{ MResource.vi.receiptPage.typeMoney }}
            <div class="combobox">
              <span class="wrapper-input">
                <input
                  class="base-input input-icon input-icon-search"
                  type="text"
                  id="search"
                  placeholder="- Chọn giá trị -"
                  value="VND"
                  readonly
                />

                <span @click.stop="onToggleShowBoardValue" class="wrapper-icon plr-12">
                  <span class="combobox__icon-down"></span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="bank-container">
          <table class="bank__table">
            <thead>
              <tr>
                <th></th>
                <th class="w-6/10">{{ MResource.vi.receiptPage.description }}</th>
                <th>{{ MResource.vi.receiptPage.accountDebt }}</th>
                <th>{{ MResource.vi.receiptPage.accountBalance }}</th>
                <th style="width: 15%">{{ MResource.vi.receiptPage.money }}</th>
                <th><div></div></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(accountant, index) in receipt.inputObj.Accountants" :key="accountant.AccountantId">
                <tr v-if="accountant.Flag != -1">
                  <td>#{{ index + 1 }}</td>
                  <td>
                    <div class="popup__field">
                      <m-input
                        :maxLength="255"
                        :disable="receipt.isDisableAll"
                        v-model="accountant.AccountantDescription"
                        type="text"
                      ></m-input>
                    </div>
                  </td>
                  <td>
                    <div class="popup__field">
                      <m-combobox
                        :displayValueInput="true"
                        :disable="receipt.isDisableAll || receipt.isDisableApart"
                        :ref="orderRefs.AccountDebtCode"
                        :title="receipt.errors[`AccountDebtCode${index}`]"
                        :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                        :listSelections="receipt.listAccountDebt"
                        :data="accountant"
                        :cols="colsAccountDebt"
                        :reloadList="receipt.searchComboboxAccountDebt"
                        :widthBoardValue="250"
                        idFieldList="AccountId"
                        idFieldObj="AccountDebtId"
                        displayField="AccountDebtCode"
                        :listenObj="receipt.errors"
                        :isInvalid="Object.keys(receipt.errors).includes(`AccountDebtCode${index}`)"
                      ></m-combobox>
                    </div>
                  </td>
                  <td>
                    <div class="popup__field">
                      <m-combobox
                        :displayValueInput="true"
                        :disable="receipt.isDisableAll || receipt.isDisableApart"
                        :ref="orderRefs.AccountBalanceCode"
                        :title="receipt.errors[`AccountBalanceCode${index}`]"
                        :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                        :listSelections="receipt.listAccountBalance"
                        :data="accountant"
                        :cols="colsAccountBalance"
                        :reloadList="receipt.searchComboboxAccountBalance"
                        :widthBoardValue="250"
                        idFieldList="AccountId"
                        idFieldObj="AccountBalanceId"
                        displayField="AccountBalanceCode"
                        :listenObj="receipt.errors"
                        :isInvalid="Object.keys(receipt.errors).includes(`AccountBalanceCode${index}`)"
                      ></m-combobox>
                    </div>
                  </td>
                  <td>
                    <div class="popup__field">
                      <m-input
                        :maxLength="14"
                        :disable="receipt.isDisableAll || receipt.isDisableApart"
                        v-model="accountant.AccountantMoney"
                        type="money"
                      ></m-input>
                    </div>
                  </td>
                  <td>
                    <span
                      class="wrapper-icon"
                      @click="
                        () => {
                          if (!receipt.isDisableAll && !receipt.isDisableApart) {
                            onDeleteAccountant(index);
                          }
                        }
                      "
                    >
                      <span class="icon-trash"></span>
                    </span>
                  </td>
                </tr>
              </template>
              <tr class="sum">
                <td colspan="5 ">
                  <h4 :class="{ 'color-bold-red': receipt.inputObj.TotalMoney < 0 }">
                    {{ formatMoney(receipt.inputObj.TotalMoney, false) }}
                  </h4>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div class="bank_btns">
            <m-button
              @keydown.tab.prevent.stop="onTabNextTo($event, 'deleteRow')"
              :isDisable="receipt.isDisableAll || receipt.isDisableApart"
              typeBtn="sub-btn"
              singleBtn
              ref="addBtn"
              :textBtnClick="() => onAddAccountant()"
              >{{ MResource.vi.providerPage.addLine }}</m-button
            >
            <m-button
              :isDisable="receipt.isDisableAll || receipt.isDisableApart"
              typeBtn="sub-btn"
              singleBtn
              :ref="refs.deleteRow"
              @keydown.tab.prevent.stop="onTabNextTo($event, 'addBtn')"
              class="mlr-12"
              :textBtnClick="() => onDeleteAccountant()"
              >{{ MResource.vi.providerPage.deleteAllLine }}</m-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="popup__footer">
      <div class="footer--left">
        <!-- <button class="base-btn sub-btn">
            <span class="btn__text btn__text--black">Hủy</span>
          </button> -->
        <m-button
          @keydown.tab.prevent.stop="onTabNextTo($event, 'providerCode')"
          singleBtn
          typeBtn="sub-btn"
          :ref="refs.cancelBtn"
          :textBtnClick="receipt.closeForm"
          >{{ $_MResource[$_LANG_CODE].button.cancel }}</m-button
        >
      </div>
      <!-- cất và in -->
      <div class="footer--right" v-if="receipt.footerState == -1">
        <m-button
          @keydown.tab.prevent.stop="onTabNextTo($event, 'addAndNewBtn')"
          typeBtn="sub-btn"
          singleBtn
          :ref="refs.addBtn"
          :textBtnClick="async () => await onSave()"
        >
          {{ $_MResource[$_LANG_CODE].button.save }}</m-button
        >

        <!-- <button type="button" class="base-btn regular-btn ml-8">
            <span class="btn__text">Cất và Thêm</span>
          </button> -->
        <div ref="btnDropDownOption" class="ml-6">
          <m-button
            urlIcon="icon-dropdown-white"
            :ref="refs.addAndNewBtn"
            typeBtn="regular-btn"
            :textBtnClick="receipt.openForm"
            @keydown.tab.prevent.stop="onTabNextTo($event, 'cancelBtn')"
          >
            <template #default>Cất và In</template>
            <template #options>
              <p v-if="false" class="btn__options">
                <span class="wrapper-text"></span>
              </p>
            </template>
          </m-button>
        </div>
      </div>
      <!-- sửa và ghi sổ -->
      <div class="footer--right" v-if="receipt.footerState == 0">
        <m-button
          @keydown.tab.prevent.stop="onTabNextTo($event, 'addAndNewBtn')"
          typeBtn="sub-btn"
          singleBtn
          :ref="refs.addBtn"
          :textBtnClick="onChange"
        >
          {{ MResource.vi.receiptPage.change }}</m-button
        >

        <!-- <button type="button" class="base-btn regular-btn ml-8">
            <span class="btn__text">Cất và Thêm</span>
          </button> -->
        <m-button
          @keydown.tab.prevent.stop="onTabNextTo($event, 'cancelBtn')"
          singleBtn
          :ref="refs.addAndNewBtn"
          typeBtn="regular-btn"
          :textBtnClick="receipt.onNoted"
        >
          {{ MResource.vi.receiptPage.noted }}</m-button
        >
      </div>
      <div class="footer--right" v-if="receipt.footerState == 1">
        <m-button
          @keydown.tab.prevent.stop="onTabNextTo($event, 'addAndNewBtn')"
          typeBtn="sub-btn"
          singleBtn
          :ref="refs.addBtn"
          :textBtnClick="onChange"
        >
          {{ MResource.vi.receiptPage.immediateChange }}</m-button
        >

        <!-- <button type="button" class="base-btn regular-btn ml-8">
            <span class="btn__text">Cất và Thêm</span>
          </button> -->
        <m-button
          @keydown.tab.prevent.stop="onTabNextTo($event, 'cancelBtn')"
          singleBtn
          :ref="refs.addAndNewBtn"
          typeBtn="regular-btn"
          :textBtnClick="receipt.onUnNoted"
        >
          {{ MResource.vi.receiptPage.unNote }}</m-button
        >
      </div>
    </div>
    <m-toast-msg
      v-if="receipt.isShow"
      :statusClass="{ 'msg-status': true, success: receipt.isShow }"
      iconClass="icon-success"
      :desc="receipt.msg"
      :status="receipt.statusToast"
      :close="receipt.onClose"
    ></m-toast-msg>
  </div>

  <m-dialog
    v-if="receipt.isShowDialog && Object.keys(receipt.errors).length > 0"
    @onCancel="() => closeDialog()"
    @onSuccess="() => closeDialog()"
    :title="$_MResource[$_LANG_CODE].dialog.title"
    :iconClass="{ 'icon-warning-red': true }"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    <span v-for="(error, index) in receipt.errors" :key="index">
      <template v-if="error != null">
        <ul class="list-error">
          <li
            :class="{ 'list-style-none': Object.keys(receipt.errors).length < 2 }"
            v-for="(item, index) in error"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </template>
    </span>
  </m-dialog>
</template>

<script setup>
import { useReceipt } from "@/stores/useReceipt";
import { onBeforeMount, computed, ref, onMounted, watch } from "vue";
import formatDate from "@/utils/formatDate";
import ReceiptService from "@/services/ReceiptService";

import formatMoney from "@/utils/formatMoney";
import getNotEmtpyNull from "@/utils/getNotEmtpyNull";
// import useListenKey from "@/composables/useListenKey";
import MEnum from "@/scripts/enum";
import MLoading from "@/components/loading/MLoading.vue";
import MResource from "@/scripts/resource";

const receipt = useReceipt();

const colsProvider = [
  {
    key: 0,
    width: 15,
    name: "Đối tượng",
    fieldList: "ProviderCode",
    fieldObj: "ProviderCode",
  },
  {
    key: 1,
    width: 30,
    name: "Đối tượng",
    fieldList: "ProviderName",
    fieldObj: "ProviderName",
  },
  {
    key: 2,
    width: 15,
    name: "Mã số thuế",
    fieldList: "ProviderTaxCode",
    fieldObj: "ProviderTaxCode",
  },
  {
    key: 3,
    width: 25,
    name: "Địa chỉ",
    fieldList: "ProviderAddress",
    fieldObj: "ReceiptAddress",
  },
  {
    key: 4,
    width: 15,
    name: "Điện thoại",
    fieldList: "ProviderPhone",
    fieldObj: "ProviderPhone",
  },
];

const colsEmployee = [
  {
    key: 0,
    width: 24,
    name: "Mã nhân viên",
    fieldList: "EmployeeCode",
    fieldObj: "EmployeeCode",
  },
  {
    key: 1,
    width: 28,
    name: "Tên nhân viên",
    fieldList: "FullName",
    fieldObj: "FullName",
  },
  {
    key: 2,
    width: 24,
    name: "Đơn vị",
    fieldList: "DepartmentName",
  },
  {
    key: 3,
    width: 24,
    name: "Điện thoại di động",
    fieldList: "PhoneNumber",
  },
];

const colsAccountDebt = [
  {
    key: 0,
    width: 33,
    name: "Số tài khoản",
    fieldList: "AccountCode",
    fieldObj: "AccountDebtCode",
  },
  {
    key: 1,
    width: 66,
    name: "Tên tài khoản",
    fieldList: "AccountName",
  },
];

const colsAccountBalance = [
  {
    key: 0,
    width: 33,
    name: "Số tài khoản",
    fieldList: "AccountCode",
    fieldObj: "AccountBalanceCode",
  },
  {
    key: 1,
    width: 66,
    name: "Tên tài khoản",
    fieldList: "AccountName",
  },
];

const orderFocus = [
  "ProviderId",
  "DateAccounting",
  "ReceiptCode",
  "EmployeeId",
  // "AccountDebtCode",
  // "AccountBalanceCode",
];
const orderRefs = {};

orderFocus.map((item) => {
  orderRefs[item] = ref(null);
});

const refs = {
  deleteRow: ref(null),
  addBtn: ref(null),
  addAndNewBtn: ref(null),
  cancelBtn: ref(null),
  providerCode: orderRefs.ProviderId,
};

watch(
  () => receipt.inputObj.ReceiptDescription,
  (newValue, oldValue) => {
    if (receipt.inputObj.Accountants && Object.keys(receipt.inputObj.Accountants).length > 0) {
      receipt.inputObj.Accountants?.map((accountant) => {
        if (oldValue == accountant?.AccountantDescription) {
          accountant.AccountantDescription = newValue;
        }
      });
    }
  }
);

watch(
  () => receipt.inputObj.ProviderId,
  (newValue) => {
    if (receipt.inputObj.ReceiptDescription?.startsWith(MResource.vi.receiptPage.payFor)) {
      receipt.inputObj.ReceiptDescription = MResource.vi.receiptPage.payFor + " " + receipt.inputObj.ProviderName;
    }
    if (newValue) {
      const provider = receipt.listProvider.find((p) => p.ProviderId == newValue);
      if (provider) {
        receipt.inputObj.EmployeeId = provider.EmployeeId;
        receipt.inputObj.FullName = provider.FullName;

        if (provider.IsCustomer) {
          receipt.inputObj.ReceiptReceiver = provider.ReceiverName;
        }
      }
    }
  }
);

watch(
  () => receipt.inputObj.ProviderName,
  (newValue, oldValue) => {
    if (receipt.inputObj.ReceiptDescription?.endsWith(oldValue)) {
      receipt.inputObj.ReceiptDescription = MResource.vi.receiptPage.payFor + " " + newValue;
    }
  }
);
/**
 * Mô tả: đóng thông báo
 * created by : ttanh (17-08-2023)
 */
const closeDialog = () => {
  receipt.closeDialog();

  if (Object.keys(receipt.errors)?.length > 0) {
    for (let i = 0; i < orderFocus.length; ++i) {
      if (Object.keys(receipt.errors).includes(orderFocus[i])) {
        orderRefs[orderFocus[i]].value?.focus();
        break;
      }
    }
  }
};

receipt.inputObj.TotalMoney = computed(() => {
  if (receipt.inputObj.Accountants && receipt.inputObj.Accountants.length > 0) {
    let sum = 0;
    receipt.inputObj.Accountants.map((item) => {
      if (item.AccountantMoney && item.Flag != -1) {
        sum += +item.AccountantMoney;
      }
    });
    if (isNaN(sum)) return 0;
    return sum;
  }
  return 0;
});

/**
 * Mô tả: sự kiện bấm nút sửa
 * created by : ttanh (05-08-2023)
 */
const onChange = async () => {
  receipt.footerState = -1;
  receipt.isDisableAll = false;

  if (receipt.inputObj.IsNoted == true) {
    receipt.isDisableApart = true;
  } else {
    receipt.isDisableApart = false;
  }
};

/**
 * Mô tả: sự kiện cất
 * created by : ttanh (05-08-2023)
 */
const onSave = async () => {
  receipt.errors = {};

  try {
    checkEmpty();
    checkDate();
    if (Object.keys(receipt.errors).length == 0) {
      receipt.inputObj.IsNoted = true;

      if (receipt.inputObj.ReceiptId) {
        for (let i = 0; i < receipt.listCurrentAccountant.length; ++i) {
          if (receipt.inputObj.Accountants[i].Flag == null || receipt.inputObj.Accountants[i].Flag == undefined) {
            let originObjStr = JSON.stringify(getNotEmtpyNull(receipt.listCurrentAccountant[i]));
            let updatedObj = JSON.stringify(getNotEmtpyNull(receipt.inputObj.Accountants[i]));
            if (originObjStr != updatedObj) {
              receipt.inputObj.Accountants[i].Flag = 0;
            }
          }
        }

        receipt.inputObj.Accoutants = receipt.inputObj.Accountants.filter(
          (item) => item.Flag != null || item.Flag != undefined
        );

        receipt.isLoadingPage = true;
        await ReceiptService.updateObj(receipt.inputObj.ReceiptId, receipt.inputObj);
        receipt.isLoadingPage = false;

        receipt.errors = {};
      } else {
        receipt.isLoadingPage = true;
        await receipt.createObj();
        receipt.isLoadingPage = false;
      }
      if (Object.keys(receipt.errors).length == 0) {
        if (receipt.inputObj.IsNoted == true) {
          if (!receipt.isDisableApart && !receipt.isDisableAll) {
            receipt.onOpen(MResource.vi.receiptPage.noteSuccess, MResource.vi.dialog.statusSuccess);
          }
          receipt.footerState = 1;
        } else if (!receipt.inputObj.IsNoted) {
          receipt.footerState = 0;
        }
        receipt.isDisableAll = true;
        receipt.isDisableApart = true;
      } else {
        receipt.isDisableAll = true;
        receipt.isDisableApart = true;
        receipt.footerState = 0;
        receipt.inputObj.IsNoted = false;

        receipt.openDialog();
      }
    } else {
      receipt.openDialog();
    }
  } catch (e) {
    receipt.isLoadingPage = false;
    receipt.errors = { ...e };
    receipt.isDisableAll = true;
    receipt.isDisableApart = true;
    receipt.inputObj.IsNoted = false;

    receipt.footerState = 0;
    receipt.openDialog();
  }
};

/**
 * Mô tả: thêm hạch toán
 * created by : ttanh (17-08-2023)
 */
const onAddAccountant = () => {
  if (receipt.inputObj.Accountants && receipt.inputObj.Accountants.length > 0) {
    receipt.inputObj.Accountants.push({
      ...receipt.inputObj.Accountants[receipt.inputObj.Accountants.length - 1],
      Flag: 1,
    });
  } else if (!receipt.inputObj.Accountants || receipt.inputObj.Accountants.length == 0) {
    receipt.inputObj.Accountants = [{}];
  }
};

/**
 * Mô tả: xóa hoach toán
 * created by : ttanh (17-08-2023)
 */
const onDeleteAccountant = (index) => {
  if (index == null || index == undefined) {
    if (receipt.inputObj.Accountants && receipt.inputObj.Accountants.length > 0) {
      receipt.inputObj.Accountants = receipt.inputObj.Accountants.filter((item) => item.Flag != 1);
      receipt.inputObj.Accountants?.map((item) => (item.Flag = -1));
    }
  }

  if (receipt.inputObj.Accountants) {
    if (receipt.inputObj.Accountants[index]) {
      if (receipt.inputObj.Accountants[index].Flag != 1) {
        receipt.inputObj.Accountants[index].Flag = -1;
      } else {
        receipt.inputObj.Accountants.splice(index, 1);
      }
    }
  }
};

/**
 * Mô tả: kiểm tra trường rỗng
 * created by : ttanh (08-08-2023)
 */
const checkEmpty = () => {
  if (!receipt.inputObj.DateAccounting) {
    receipt.errors.DateAccounting = [MResource.vi.receiptPage.notEmptyDateAccounting];
  }
  if (!receipt.inputObj.ReceiptDate) {
    receipt.errors.ReceiptDate = [MResource.vi.receiptPage.notEmptyDatePayment];
  }

  if (!receipt.inputObj.ReceiptCode) {
    receipt.errors.ReceiptCode = [MResource.vi.receiptPage.notEmptyPaymentCode];
  }

  if (!receipt.inputObj.Accountants || receipt.inputObj.Accountants.length == 0) {
    receipt.errors.DetailReceipt = [MResource.vi.receiptPage.needDetailDocument];
  } else if (receipt.inputObj.Accountants && receipt.inputObj.Accountants.length > 0) {
    let isHasError = false;
    for (let i = 0; i < receipt.inputObj.Accountants.length; ++i) {
      if (!receipt.inputObj.Accountants[i]?.AccountDebtCode) {
        if (!isHasError) {
          receipt.errors[`AccountDebtCode${i}`] = [MResource.vi.receiptPage.notEmptyAccountDebt];
          isHasError = true;
        } else {
          receipt.errors[`AccountDebtCode${i}`] = null;
        }
      }
    }
    isHasError = false;
    for (let i = 0; i < receipt.inputObj.Accountants.length; ++i) {
      if (!receipt.inputObj.Accountants[i]?.AccountBalanceCode) {
        if (!isHasError) {
          receipt.errors[`AccountBalanceCode${i}`] = [MResource.vi.receiptPage.notEmptyAccountBalance];
          isHasError = true;
        } else {
          receipt.errors[`AccountBalanceCode${i}`] = null;
        }
      }
    }
  }

  if (!receipt.inputObj.ProviderId && receipt.inputObj.ProviderCode) {
    receipt.errors.ProviderId = [MResource.vi.receiptPage.notFoundProviderCode];
  }

  if (!receipt.inputObj.EmployeeId && receipt.inputObj.FullName) {
    receipt.errors.EmployeeId = [MResource.vi.receiptPage.notFoundEmployee];
  }
  let isHasError = false;
  if (receipt.inputObj?.Accountants?.length > 0) {
    for (let i = 0; i < receipt.inputObj.Accountants.length; ++i) {
      if (!receipt.inputObj.Accountants[i]?.AccountDebtId && receipt.inputObj.Accountants[i]?.AccountDebtCode) {
        if (!isHasError) {
          receipt.errors[`AccountDebtCode${i}`] = [MResource.vi.receiptPage.notFoundAccountDebt];
          isHasError = true;
        } else {
          receipt.errors[`AccountDebtCode${i}`] = null;
        }
      }
    }
    isHasError = false;
    for (let i = 0; i < receipt.inputObj.Accountants.length; ++i) {
      if (!receipt.inputObj.Accountants[i]?.AccountBalanceId && receipt.inputObj.Accountants[i]?.AccountBalanceCode) {
        if (!isHasError) {
          receipt.errors[`AccountBalanceCode${i}`] = [MResource.vi.receiptPage.notFoundAccountBalance];
          isHasError = true;
        } else {
          receipt.errors[`AccountBalanceCode${i}`] = null;
        }
      }
    }
  }
};

/**
 * Mô tả: kiểm tra ngày
 * created by : ttanh (04-08-2023)
 */
const checkDate = () => {
  if (
    receipt.inputObj.DateAccounting &&
    receipt.inputObj.ReceiptDate &&
    receipt.inputObj.DateAccounting < receipt.inputObj.ReceiptDate
  ) {
    receipt.errors.DateAccounting = [MResource.vi.receiptPage.needDateAccountingMoreThan];
  }
};

/**
 * Mô tả: sự kiện tab đến ô tiếp theo
 * created by : ttanh (14-08-2023)
 */
function onTabNextTo($event, ref) {
  if ($event.keyCode == MEnum.Key.tab) {
    if (refs[ref]) refs[ref].value.focus();
  }
}

// useListenKey("keyup", MEnum.Key.esc, receipt.closeForm);

onBeforeMount(async () => {
  await receipt.getListProvider();
  await receipt.getListEmployee();
  await receipt.getListAccountDebt();
  await receipt.getListAccountBalance();

  if (!receipt.inputObj.ReceiptCode) {
    const res = await ReceiptService.getNewcode();
    receipt.inputObj.ReceiptCode = res.Data;
    receipt.selectedObj.ReceiptCode = res.Data;
    receipt.inputObj.ReceiptDescription = MResource.vi.receiptPage.payFor;
    receipt.selectedObj.ReceiptDescription = MResource.vi.receiptPage.payFor;
  }

  if (receipt.inputObj.DateAccounting) {
    receipt.inputObj.DateAccounting = formatDate(receipt.inputObj.DateAccounting);
    receipt.selectedObj.DateAccounting = formatDate(receipt.selectedObj.DateAccounting);
    receipt.inputObj.ReceiptDate = formatDate(receipt.inputObj.ReceiptDate);
    receipt.selectedObj.ReceiptDate = formatDate(receipt.selectedObj.ReceiptDate);
  }

  if (receipt.inputObj.Employee) {
    receipt.inputObj.FullName = receipt.inputObj.Employee?.FullName;
    receipt.selectedObj.FullName = receipt.selectedObj.Employee?.FullName;
    receipt.inputObj.EmployeeId = receipt.inputObj.Employee?.EmployeeId;
    receipt.selectedObj.EmployeeId = receipt.selectedObj.Employee?.EmployeeId;
  }

  if (!receipt.inputObj.DateAccounting) {
    receipt.inputObj.DateAccounting = new Date().toJSON().slice(0, 10);
    (receipt.inputObj.ReceiptDate = new Date().toJSON().slice(0, 10)),
      (receipt.selectedObj.DateAccounting = new Date().toJSON().slice(0, 10));
    receipt.selectedObj.ReceiptDate = new Date().toJSON().slice(0, 10);
  }

  if (!receipt.inputObj.ReceiptId && (!receipt.inputObj.Accountants || receipt.inputObj.Accountants.length == 0)) {
    receipt.inputObj.Accountants = [
      {
        AccountantDescription: MResource.vi.receiptPage.payFor,
        AccountDebtCode: receipt.listAccountDebt[0]?.AccountCode,
        AccountDebtId: receipt.listAccountDebt[0]?.AccountId,
        AccountBalanceCode: receipt.listAccountBalance[0]?.AccountCode,
        AccountBalanceId: receipt.listAccountBalance[0]?.AccountId,
      },
    ];
    receipt.selectedObj.Accountants = [
      {
        AccountantDescription: MResource.vi.receiptPage.payFor,
        AccountDebtCode: receipt.listAccountDebt[0]?.AccountCode,
        AccountDebtId: receipt.listAccountDebt[0]?.AccountId,
        AccountBalanceCode: receipt.listAccountBalance[0]?.AccountCode,
        AccountBalanceId: receipt.listAccountBalance[0]?.AccountId,
        AccountantMoney: 0,
      },
    ];
  }
});

onMounted(() => {
  orderRefs.ProviderId.value.focus();
});
</script>

<style></style>
