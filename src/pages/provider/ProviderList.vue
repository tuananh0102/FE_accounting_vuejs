<template>
  <ProviderDetail v-if="provider.isShowForm"></ProviderDetail>
  <div class="main">
    <div class="main__header">
      <div class="main__table-title">{{ $_MResource[$_LANG_CODE].table.provider }}</div>
      <router-link class="back-link" to="/apps">
        <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon">
          <span class="icon-arrow__right--blue"></span>
        </span>
        <p>{{ MResource.vi.accountPage.accountList.allApps }}</p>
      </router-link>
    </div>

    <div class="main__body">
      <MLoading v-if="provider.isLoadingPage"></MLoading>
      <div class="main__bonus">
        <div class="grid-3col">
          <div class="overview-data border-left--orange border-right-gray">
            <div class="top">
              <p>0,00</p>
              <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon">
                <span class="icon-filter--white"></span>
              </span>
            </div>
            <div class="bottom"><p>Nợ quá hạn</p></div>
          </div>
          <div class="overview-data border-left--gray border-right-gray">
            <div class="top">
              <p>28.023.342.234,71</p>
              <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon">
                <span class="icon-filter--white"></span>
              </span>
            </div>
            <div class="bottom"><p>Tổng nợ phải trả</p></div>
          </div>
          <div class="overview-data border-left--green border-right-gray">
            <div class="top">
              <p>0,00</p>
              <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon">
                <span class="icon-filter--white"></span>
              </span>
            </div>
            <div class="bottom"><p>Đã thanh toán</p></div>
          </div>
        </div>
      </div>

      <div class="separate-line">
        <div class="collapse-btn">
          <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon">
            <span class="combobox__icon-down" style="transform: rotate(180deg)"></span>
          </span>
        </div>
      </div>

      <div class="main__top">
        <div class="main__top-left">
          <span :title="$_MResource[$_LANG_CODE].titleIcon.refresh" class="wrapper-icon mlr-6 mt-4"
            ><span class="icon-arrowdown--solid"></span
          ></span>
          <button
            ref="dropdownMultiFunction"
            class="wrapper mlr-12"
            @click="toggleDropdownMulFunc"
            :disabled="!(checkedIds.size > 1)"
            :class="[{ normal: checkedIds.size > 1 }]"
          >
            <p>{{ $_MResource[$_LANG_CODE].button.doMultiple }}</p>
            <span class="wrapper-icon plr-12">
              <span class="combobox__icon-down"></span>
            </span>
          </button>
          <div class="options" v-if="isShowDropdownMultiFunction && true" @click="() => provider.openDialog()">
            <div>{{ $_MResource[$_LANG_CODE].button.delete }}</div>
          </div>

          <button class="wrapper" :disabled="false" :class="[{ normal: true }]">
            <p>Lọc</p>
            <span class="wrapper-icon plr-12">
              <span class="combobox__icon-down" :style="{ transform: iconUp ? 'rotate(180deg)' : '' }"></span>
            </span>
          </button>
        </div>

        <div class="main__top-right">
          <m-input
            v-model="provider.querySearch"
            :urlIcon="require('@/assets/icon/magnifying-glass-solid.svg')"
            placeholder="Tìm kiếm"
          ></m-input>
          <span
            @click="async () => await reloadPage()"
            :title="$_MResource[$_LANG_CODE].titleIcon.refresh"
            class="wrapper-icon mlr-6"
            ><span class="icon-reload"></span
          ></span>
          <span
            @click="async () => await provider.exportExcel()"
            :title="$_MResource[$_LANG_CODE].titleIcon.excel"
            class="wrapper-icon mlr-6"
          >
            <span class="icon-excel"></span>
          </span>
          <div ref="btnUltity" class="mlr-6">
            <m-button
              round
              singleBtn
              urlIcon="icon-dropdown__black"
              typeBtn="sub-btn"
              :textBtnClick="() => {}"
              class="border-black round-btn"
            >
              <template #default>{{ $_MResource[$_LANG_CODE].button.utility }}</template>
              <template #options>
                <p v-if="false" class="btn__options">
                  <span class="wrapper-text"></span>
                </p>
              </template>
            </m-button>
          </div>

          <div ref="btnDropDownOption" class="ml-6">
            <m-button
              round
              urlIcon="icon-dropdown-white"
              typeBtn="regular-btn"
              :textBtnClick="() => provider.openForm({}, $_MEnum.FormMode.add)"
            >
              <template #default>{{ $_MResource[$_LANG_CODE].button.addEmployee }}</template>
              <template #options>
                <p v-if="false" class="btn__options">
                  <span class="wrapper-text">{{ MResource.vi.accountPage.accountList.importExcel }}</span>
                </p>
              </template>
            </m-button>
          </div>
        </div>
      </div>

      <!-- ---------table------------ -->
      <m-data-table
        :header="header"
        :data="provider.data"
        :onShowToast="provider.onShowToast"
        :decreaseTotalRecord="() => {}"
        :reloadData="() => provider.getList(provider.recordsPerPage, provider.currentPage, provider.querySearch)"
        :checkRow="checkRow"
        :deleteObj="provider.deleteObj"
        codeField="ProviderCode"
        @onDbClickRow="
          async (em) => {
            await openDetailForm(em.ProviderId);
          }
        "
        :onDuplicated="provider.duplicateObj"
        idField="ProviderId"
      ></m-data-table>

      <div class="table__bottom">
        <p class="table__bottom-left">
          {{ $_MResource[$_LANG_CODE].table.total }}: <b>{{ provider.totalRecord }}</b>
          {{ $_MResource[$_LANG_CODE].table.record }}
        </p>
        <span class="table__bottom-right">
          <div class="combobox">
            <span class="wrapper-input">
              <input
                class="base-input input-icon input-icon-search"
                type="text"
                id="search"
                placeholder="- Chọn giá trị -"
                :value="boardValues[indexCurrentBoardValue].text"
                @click.stop="onToggleShowBoardValue"
                readonly
              />

              <span @click.stop="onToggleShowBoardValue" class="wrapper-icon plr-12">
                <span class="combobox__icon-down" :style="{ transform: iconUp ? 'rotate(180deg)' : '' }"></span>
              </span>
            </span>
            <div ref="boardValue" v-if="isShowBoardValue" class="board-value">
              <span
                :class="{ 'board-value__value': true, 'selected-value': indexCurrentBoardValue === index }"
                v-for="(boardValue, index) in boardValues"
                :key="index"
                @click="onChangeRecordsPerPage($event, boardValue.value, index)"
                >{{ boardValue.text }}</span
              >
            </div>
          </div>
          <!-- <span class="btn-back">Trước</span>
          <ul class="table__list-page">
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
          <span class="btn-next">Sau</span> -->
          <m-pagination
            :totalPage="Math.ceil(provider.totalRecord / provider.recordsPerPage)"
            :perPage="10"
            :currentPage="provider.currentPage"
            @pageChanged="onPageChanged"
          ></m-pagination>
        </span>
      </div>
    </div>
  </div>
  <m-toast-msg
    v-if="provider.isShow"
    :statusClass="{ 'msg-status': true, success: provider.isShow }"
    iconClass="icon-success"
    :desc="provider.msg"
    :status="provider.statusToast"
    :close="provider.onClose"
  ></m-toast-msg>

  <m-dialog
    v-if="provider.isShowDialog && Object.keys(provider.errors).length == 0"
    @onCancel="() => provider.closeDialog()"
    @onSuccess="() => onAcceptDeleteMul()"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionDelete"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    >{{ MResource.vi.providerPage.deleteQuestion }}</m-dialog
  >
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProviderDetail from "./ProviderDetail.vue";
import { useProvider } from "@/stores/useProvider";
import ProviderService from "@/services/ProviderService";
import useClickOutSide from "@/composables/useClickOutSide";
import MLoading from "@/components/loading/MLoading.vue";
import MResource from "@/scripts/resource";

const indexCurrentBoardValue = ref(1);
const isShowBoardValue = ref(false);
const iconUp = ref(false);

const checkedIds = ref(new Set());
const isShowDropdownMultiFunction = ref(false);

const dropdownMultiFunction = ref(null);
const boardValue = ref(null);

const header = [
  {
    id: 0,
    headerName: "Mã nhà cung cấp",
    className: ["width-150"],
    fieldName: "ProviderCode",
  },
  {
    id: 1,
    headerName: "Tên nhà cung cấp",
    className: ["width-200"],
    fieldName: "ProviderName",
  },
  {
    id: 2,
    headerName: "Địa chỉ",
    className: ["width-250"],
    fieldName: "ProviderAddress",
  },
  {
    id: 3,
    headerName: "Mã số thuế",
    className: ["width-200"],
    fieldName: "ProviderTaxCode",
  },
  {
    id: 4,
    headerName: "Điện thoại",
    className: ["width-200"],
    fieldName: "ProviderPhone",
  },
  {
    id: 5,
    headerName: "Website",
    className: ["width-200"],
    fieldName: "ProviderWebsite",
  },
];

const boardValues = [
  {
    value: 10,
    text: "10 bản ghi trên một trang",
  },
  {
    value: 20,
    text: "20 bản ghi trên một trang",
  },
  {
    value: 30,
    text: "30 bản ghi trên một trang",
  },
  {
    value: 40,
    text: "40 bản ghi trên một trang",
  },
  {
    value: 50,
    text: "50 bản ghi trên một trang",
  },
];
const provider = useProvider();

/**
 * Mô tả: tải lại trang
 * created by : ttanh (16-08-2023)
 */
const reloadPage = async () => {
  provider.currentPage = 1;
  await provider.getList(provider.recordsPerPage, 1, provider.querySearch);
};

/**
 * Mô tả: check hoặc uncheck row
 * created by : ttanh
 * created date: 29/07/2023
 */
const checkRow = (id) => {
  if (!id) {
    return checkedIds.value;
  }
  if (checkedIds.value.has(id)) {
    checkedIds.value.delete(id);
    return checkedIds.value;
  }
  checkedIds.value.add(id);
  return checkedIds.value;
};

/**
 * Mô tả: đóng dropdown
 * created by : ttanh
 * created date: 27-07-2023
 */
function onCloseDeltedMulFunc() {
  isShowDropdownMultiFunction.value = false;
}

/**
 * Mô tả: đóng chọn kích thước trang
 * created by : ttanh (17-08-2023)
 */
function onCloseBoardValue() {
  isShowBoardValue.value = false;
}

useClickOutSide(dropdownMultiFunction, onCloseDeltedMulFunc);
useClickOutSide(boardValue, onCloseBoardValue);

/**
 * Mô tả: chấp nhận xóa nhiều bản ghi
 * created by : ttanh (30-07-2023)
 */
const onAcceptDeleteMul = async () => {
  await provider.deleteMultipleObj(Array.from(checkedIds.value));
  checkedIds.value.clear();
  isShowDropdownMultiFunction.value = false;
};

/** đóng mở dropdown
 * Mô tả:
 * created by : ttanh
 * created date: 27-07-2023
 */
function toggleDropdownMulFunc() {
  isShowDropdownMultiFunction.value = !isShowDropdownMultiFunction.value;
}

/**
 * Mô tả: đóng mở board value
 * created by : ttanh (30-07-2023)
 */
function onToggleShowBoardValue() {
  isShowBoardValue.value = !isShowBoardValue.value;
  iconUp.value = !iconUp.value;
}

/**
 * Mô tả: thay đổi trang
 * created by : ttanh (17-08-2023)
 */
async function onPageChanged(page) {
  provider.currentPage = page;

  await provider.getList(provider.recordsPerPage, provider.currentPage, provider.querySearch);

  // this.onToggleShowBoardValue();
}

/**
 * Mô tả: thay đổi kích thước trang
 * created by : ttanh (17-08-2023)
 */
async function onChangeRecordsPerPage($event, value, index) {
  provider.recordsPerPage = value;
  indexCurrentBoardValue.value = index;
  provider.currentPage = 1;

  onToggleShowBoardValue();
  await provider.getList(provider.recordsPerPage, provider.currentPage, provider.querySearch);
}

/**
 * Mô tả: mở form chi tiết
 * created by : ttanh (29-07-2023)
 */
const openDetailForm = async (id) => {
  const res = await ProviderService.getById(id);
  provider.openForm(res.Data, 1);
};

onMounted(async () => {
  await provider.getList(20, 1);
});
</script>
<style></style>
