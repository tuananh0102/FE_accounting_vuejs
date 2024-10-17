<template>
  <div class="main__body">
    <div class="main__bonus">
      <div class="grid-3col">
        <div class="overview-data border-left--orange ml-6">
          <span>Tổng thu đầu năm đến hiện tại</span>
          <p class="question">5.232.254</p>
        </div>
        <div class="overview-data border-left--gray mlr-12">
          <span>Tổng thu đầu năm đến hiện tại</span>

          <p class="question">3.422.371</p>
        </div>
        <div class="overview-data border-left--green mr-6">
          <span>Tổng quỹ tồn tại</span>

          <p class="fail">(9.334.334)</p>
        </div>
      </div>
      <span class="sub-info mr-6 mt-4">Số liệu tính đến: 13h37</span>
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
          :class="[{ normal: true }]"
        >
          <p>{{ $_MResource[$_LANG_CODE].button.doMultiple }}</p>
          <span class="wrapper-icon plr-12">
            <span class="combobox__icon-down"></span>
          </span>
        </button>
        <div class="options" v-if="isShowDropdownMultiFunction && true" @click="() => receipt.openDialog()">
          <div>{{ $_MResource[$_LANG_CODE].button.delete }}</div>
        </div>

        <button class="wrapper" :disabled="false" :class="[{ normal: true }]">
          <p>Lọc</p>
          <span class="wrapper-icon plr-12">
            <span class="combobox__icon-down"></span>
          </span>
        </button>
        <!-- <m-combobox
          placeholder="Xưng hô"
          :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
          :listSelections="listType"
          :data="a"
          :reloadList="() => {}"
          displayField="Type"
          idFieldList="Type"
          idFieldObj="Type"
          :cols="typeNote"
        ></m-combobox> -->
      </div>

      <div class="main__top-right">
        <m-input
          :urlIcon="require('@/assets/icon/magnifying-glass-solid.svg')"
          placeholder="Tìm kiếm"
          v-model="receipt.querySearch"
        ></m-input>
        <span
          @click="async () => await receipt.reloadPage()"
          :title="$_MResource[$_LANG_CODE].titleIcon.refresh"
          class="wrapper-icon mlr-6"
          ><span class="icon-reload"></span
        ></span>
        <span
          @click="async () => await receipt.exportExcel()"
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
          <m-button round urlIcon="icon-dropdown-white" typeBtn="regular-btn" :textBtnClick="() => {}">
            <template #default>{{ MResource.vi.receiptPage.receiverMoney }}</template>
            <template #options>
              <p v-if="false" class="btn__options">
                <span class="wrapper-text">{{ MResource.vi.accountPage.accountList.importExcel }}</span>
              </p>
            </template>
          </m-button>
        </div>
        <div ref="btnDropDownOption" class="ml-6">
          <m-button round urlIcon="icon-dropdown-white" typeBtn="regular-btn" :textBtnClick="receipt.openForm">
            <template #default>{{ MResource.vi.receiptPage.pay }}</template>
            <template #options>
              <p v-if="false" class="btn__options">
                <span class="wrapper-text"></span>
              </p>
            </template>
          </m-button>
        </div>
      </div>
    </div>

    <!-- ------------table------------- -->
    <div ref="tableContainer" class="table-container" id="m-data-table">
      <table class="main__table">
        <thead>
          <tr>
            <th class="col-checkbox">
              <input type="checkbox" :checked="isAllChecked()" @click="checkAll" />
            </th>
            <th
              v-for="item in header"
              :class="item.className"
              :fieldName="item.fieldName"
              :key="item.id"
              :title="item.title ? item.title : null"
            >
              <span>{{ item.headerName.toUpperCase() }}</span>
            </th>

            <th class="width-150" style="text-align: center" v-if="header.length > 0">
              <p>{{ MResource.vi.receiptPage.function }}</p>
            </th>
          </tr>
        </thead>
        <tbody v-if="false">
          <tr>
            <td :colspan="header.length + 2">{{ MResource.vi.table.noData }}</td>
          </tr>
        </tbody>
        <tbody v-if="true">
          <tr
            v-for="(item, index) in receipt.data"
            :key="item.ReceiptId"
            :class="{ checked: checkRow()?.has(item.ReceiptId), 'noted-color': !item.IsNoted }"
          >
            <td class="col-checkbox" :class="{ checked: checkRow()?.has(item.ReceiptId) }">
              <input
                type="checkbox"
                :checked="checkRow()?.has(item.ReceiptId)"
                @click="() => checkRow(item.ReceiptId)"
              />
            </td>
            <td
              v-for="td in header"
              :key="td.ReceiptId"
              :class="[td.className, { 'red-color': td.type == 'money' && item.TotalMoney < 0 }]"
              @click="
                async () => {
                  if (td.fieldName == 'ReceiptCode') await receipt.openDetailForm(item.ReceiptId);
                }
              "
              @dblclick="
                async () => {
                  await receipt.openDetailForm(item.ReceiptId);
                }
              "
            >
              <p class="text-overflow__ellipsis" :title="formatData(td.type, item[td.fieldName])">
                {{ formatData(td.type, item[td.fieldName]) }}
              </p>
            </td>

            <td class="align-center" :class="{ checked: checkRow()?.has(item.ReceiptId) }" v-if="header.length > 0">
              <span
                class="table__function-name"
                @click="
                  async () => {
                    await receipt.openDetailForm(item.ReceiptId);
                  }
                "
                >{{ MResource.vi.receiptPage.show }}</span
              >
              <div
                :ref="dropdownRefs[index]"
                @click.stop="toggleContextMenu($event, index, item)"
                :style="{ border: currentIndexContextMenu === index && isShowContextMenu ? '1px solid #007aff' : null }"
                class="wrapper-icon"
              >
                <span class="dropdown-blue-icon"></span>
              </div>
            </td>
          </tr>
          <tr class="last-row">
            <td></td>
            <td class="text-align-center">
              <h4>{{ MResource.vi.receiptPage.sum }}</h4>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td class="right-to-left pr-8">
              <h4 :class="{ 'color-bold-red': sum < 0 }" :title="formatMoney(sum, false)">
                {{ formatMoney(sum, false) }}
              </h4>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table__bottom">
      <p class="table__bottom-left">
        {{ $_MResource[$_LANG_CODE].table.total }}: <b>{{ receipt.totalRecord }}</b>
        {{ $_MResource[$_LANG_CODE].table.record }}
      </p>
      <span class="table__bottom-right">
        <div class="combobox" ref="boardValue">
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
          :totalPage="Math.ceil(receipt.totalRecord / receipt.recordsPerPage)"
          :perPage="10"
          :currentPage="receipt.currentPage"
          @pageChanged="onPageChanged"
        ></m-pagination>
      </span>
    </div>
    <MLoading v-if="receipt.isLoadingPage"></MLoading>
  </div>
  <!-- <m-context-menu
    ref="contextMenu"
    v-if="isShowContextMenu"
    :onClose="onCloseContextMenu"
    :topPosition="contextMenuY"
    :index="currentIndexContextMenu"
    :onShowDialog="onShowDeleteDialog"
  ></m-context-menu> -->

  <span v-if="isShowContextMenu" class="money-list-context">
    <ul ref="contextMenu" class="context-menu" :style="{ top: contextMenuY }" v-if="!currentItem.IsNoted">
      <li @click="async () => await onNoted()" class="context-menu__option option--stop">
        {{ $_MResource[$_LANG_CODE].button.note }}
      </li>

      <li @click="onShowDeleteDialog" class="context-menu__option option--delete">
        {{ $_MResource[$_LANG_CODE].button.delete }}
      </li>
      <li @click="async () => await onDuplicate()" class="context-menu__option option--copy">
        {{ $_MResource[$_LANG_CODE].button.duplicate }}
      </li>
    </ul>

    <ul ref="contextMenu" class="context-menu" :style="{ top: contextMenuY }" v-if="currentItem.IsNoted">
      <li @click="async () => await onUnnoted()" class="context-menu__option option--stop">
        {{ $_MResource[$_LANG_CODE].button.unNote }}
      </li>

      <li @click="async () => await onDuplicate()" class="context-menu__option option--copy">
        {{ $_MResource[$_LANG_CODE].button.duplicate }}
      </li>
    </ul>
  </span>

  <m-dialog
    v-if="isShowDeleteDialog"
    @onCancel="() => onCancel()"
    @onSuccess="() => onSuccess(currentObjId)"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionDelete"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    >{{
      `${$_MResource[$_LANG_CODE].dialog.descQuestionDelete} <${receipt.data[currentIndexContextMenu].ReceiptCode}>?`
    }}</m-dialog
  >
  <m-toast-msg
    v-if="receipt.isShow"
    :statusClass="{ 'msg-status': true, success: receipt.isShow }"
    iconClass="icon-success"
    :desc="receipt.msg"
    :status="receipt.statusToast"
    :close="receipt.onClose"
  ></m-toast-msg>

  <m-dialog
    v-if="receipt.isShowDialog && Object.keys(receipt.errors).length == 0"
    @onCancel="() => receipt.closeDialog()"
    @onSuccess="() => onAcceptDeleteMul()"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionDelete"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    >{{ MResource.vi.providerPage.deleteQuestion }}</m-dialog
  >

  <m-dialog
    v-if="receipt.isShowDialog && Object.keys(receipt.errors).length > 0"
    @onCancel="() => receipt.closeDialog()"
    @onSuccess="() => receipt.closeDialog()"
    :title="$_MResource[$_LANG_CODE].dialog.title"
    :iconClass="{ 'icon-warning-red': true }"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    <span v-for="(error, index) in receipt.errors" :key="index">
      <ul class="list-error">
        <li
          :class="{ 'list-style-none': Object.keys(receipt.errors).length < 2 }"
          v-for="(item, index) in error"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </span>
  </m-dialog>

  <m-dialog
    v-if="receipt.isShowAlertDialog"
    @onCancel="() => receipt.closeAlertDialog()"
    @onSuccess="() => receipt.closeAlertDialog()"
    :title="$_MResource[$_LANG_CODE].dialog.titleDelete"
    :iconClass="{ 'icon-info': true }"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    <ul class="list-error">
      <li v-for="(item, index) in Object.keys(receipt.objMsgDeleteMultiple)" :key="index">
        {{ receipt.objMsgDeleteMultiple[item] }}
      </li>
    </ul>
  </m-dialog>
</template>

<script setup>
import { useReceipt } from "@/stores/useReceipt";
import { onMounted, ref, onBeforeMount, watch } from "vue";
import formatData from "@/utils/formatData";
import formatMoney from "@/utils/formatMoney";
import useClickOutSide from "@/composables/useClickOutSide";
import ReceiptService from "@/services/ReceiptService";
import MLoading from "@/components/loading/MLoading.vue";
import MResource from "@/scripts/resource";
// const typeNote = [
//   {
//     key: 0,
//     width: 100,
//     fieldList: "Type",
//     fieldObj: "Type",
//   },
// ];

// const listType = [
//   {
//     Type: "Tất cả",
//   },
//   {
//     Type: "Phiếu thu",
//   },
//   {
//     Type: "Phiếu chi",
//   },
// ];

const receipt = useReceipt();

const indexCurrentBoardValue = ref(1);
const isShowBoardValue = ref(false);
const iconUp = ref(false);

const isShowDropdownMultiFunction = ref(false);

const tableContainer = ref(null);

const dropdownMultiFunction = ref(null);
const contextMenu = ref(null);

const header = [
  {
    id: 0,
    headerName: "Ngày hoạch toán",
    className: ["width-150", "text-align-center"],
    fieldName: "DateAccounting",
    type: "date",
  },

  {
    id: 1,
    headerName: "Số chứng từ",
    className: ["width-150", "receipt-number-color"],
    fieldName: "ReceiptCode",
  },
  {
    id: 7,
    headerName: "Ngày chứng từ",
    className: ["width-150"],
    fieldName: "ReceiptDate",
    type: "date",
  },
  {
    id: 2,
    headerName: "Diễn giải",
    className: ["width-250"],
    fieldName: "ReceiptDescription",
  },
  {
    id: 3,
    headerName: "Số tiền",
    className: ["width-150", "right-to-left", "pr-8"],
    fieldName: "TotalMoney",
    type: "money",
  },
  {
    id: 4,
    headerName: "Đối tượng",
    className: ["width-150"],
    fieldName: "ProviderName",
  },
  {
    id: 5,
    headerName: "Mã đối tượng",
    className: ["width-150"],
    fieldName: "ProviderCode",
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

const isShowContextMenu = ref(false);
const contextMenuY = ref(0);
const currentObjId = ref(null);
const currentIndexContextMenu = ref(0);
const isShowDeleteDialog = ref(false);

const currentItem = ref(null);

const checkedIds = ref(new Set());

const dropdownRefs = ref([]);

const sum = ref(0);

watch(
  () => receipt.data,
  () => {
    let total = 0;

    receipt.data?.map((item) => {
      if (item.TotalMoney != null && item.TotalMoney != undefined) {
        total += item.TotalMoney;
      }
    });
    sum.value = total;
  }
);

// sum.value = computed(() => {
//   let total = 0;

//   receipt.data?.map((item) => {
//     if (item.TotalMoney != null && item.TotalMoney != undefined) {
//       total += item.TotalMoney;
//     }
//   });
//   return total;
// }).value;

/**
 * Mô tả: chức năng nhân bản
 * created by : ttanh (17-08-2023)
 */
const onDuplicate = async () => {
  try {
    const res = await ReceiptService.getById(currentItem.value.ReceiptId);
    const duplicatedItem = { ...res.Data };
    const resCode = await ReceiptService.getNewcode();

    duplicatedItem.ReceiptCode = resCode.Data;
    duplicatedItem.ReceiptId = null;
    receipt.inputObj = { ...duplicatedItem };
    receipt.selectedObj = { ...duplicatedItem };

    receipt.openForm();
  } catch (e) {
    receipt.errors = { ...e };
  }
};

/**
 * Mô tả: đóng context menu
 * created by : ttanh
 * created date: 06-08-2023
 */
function onCloseContextMenu() {
  isShowContextMenu.value = false;
}

/**
 * Mô tả: hiển thị thông báo xóa
 * created by : ttanh (17-08-2023)
 */
function onShowDeleteDialog() {
  isShowDeleteDialog.value = true;
}

/**
 * Mô tả: chức năng ghi sổ
 * created by : ttanh (17-08-2023)
 */
const onNoted = async () => {
  const res = await ReceiptService.getById(currentItem.value.ReceiptId);
  const noteItem = { ...res.Data };

  noteItem.IsNoted = true;
  await receipt.onNoted(currentItem.value.ReceiptId, noteItem, currentIndexContextMenu.value);
  onCloseContextMenu();
};

/**
 * Mô tả: chức năng bỏ ghi
 * created by : ttanh (17-08-2023)
 */
const onUnnoted = async () => {
  const res = await ReceiptService.getById(currentItem.value.ReceiptId);
  const noteItem = { ...res.Data };
  noteItem.IsNoted = false;
  await receipt.onUnNoted(currentItem.value.ReceiptId, noteItem, currentIndexContextMenu.value);
  onCloseContextMenu();
};

/**
 * Mô tả: thực hiện xóa khi bấm đồng ý
 * created by : ttanh
 * created date: 29-05-2023
 */
async function onSuccess(id) {
  isShowDeleteDialog.value = false;
  await receipt.deleteObj(id);

  // let isSelectedItem = this.checkRow().has(id);
  // if (isSelectedItem) {
  //   this.checkRow(id);
  // }
}

/**
 * Mô tả: đóng thông báo khi bấm cancle
 * created by : ttanh
 * created date: 06-08-2023
 */
const onCancel = () => {
  isShowDeleteDialog.value = false;
  onCloseContextMenu();
};

/**
 * Mô tả: đóng dropdown
 * created by : ttanh
 * created date: 06-08-2023
 */
function onCloseDeltedMulFunc() {
  isShowDropdownMultiFunction.value = false;
}

/**
 * Mô tả: chấp nhận xóa nhiều bản ghi
 * created by : ttanh (06-08-2023)
 */
const onAcceptDeleteMul = async () => {
  await receipt.deleteMultipleObj(Array.from(checkedIds.value));
  checkedIds.value.clear();
  isShowDropdownMultiFunction.value = false;
};

/** đóng mở dropdown
 * Mô tả:
 * created by : ttanh
 * created date: 06-08-2023
 */
function toggleDropdownMulFunc() {
  isShowDropdownMultiFunction.value = !isShowDropdownMultiFunction.value;
}

watch(
  () => receipt.recordsPerPage,
  () => {
    for (let i = 0; i < receipt.recordsPerPage; ++i) {
      dropdownRefs.value.push(ref(null));
    }
  }
);

/**
 * Mô tả: đóng mở tab chức năng
 * created by : ttanh (17-08-2023)
 */
const toggleContextMenu = ($event, index, item) => {
  // console.log(item);
  const tableY = tableContainer.value.getBoundingClientRect().y;

  // const btnY =firstRow.value.getBoundingClientRect().y

  const btnY = dropdownRefs.value[index].value[0].getBoundingClientRect().y;
  tableY;
  let totalY = btnY + 20;

  contextMenuY.value = totalY + "px";

  if (totalY > 520) {
    // totalY += ;
    contextMenuY.value = totalY + "px";
  }
  currentObjId.value = item.ReceiptId;
  currentItem.value = { ...item };

  if (!isShowContextMenu.value) {
    currentIndexContextMenu.value = index;

    currentObjId.value = item.ReceiptId;
    currentItem.value = { ...item };

    isShowContextMenu.value = !isShowContextMenu.value;
  } else {
    if (currentIndexContextMenu.value === index) {
      isShowContextMenu.value = !isShowContextMenu.value;
    } else {
      currentIndexContextMenu.value = index;
      currentObjId.value = item.ReceiptId;
      currentItem.value = { ...item };
    }
  }
};

/**
 * Mô tả: sự kiện bấm checkbox
 * created by : ttanh (06-08-2023)
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
 * Mô tả: check toàn bộ hàng
 * created by : ttanh
 * created date: 25-06-2023
 */
const checkAll = () => {
  if (isAllChecked()) {
    receipt.data.map((item) => {
      checkRow()?.delete(item.ReceiptId);
    });
    return;
  }

  if (receipt.data && receipt.data.length > 0) {
    receipt.data.map((item) => {
      if (!checkRow().has(item.ReceiptId)) {
        checkRow(item.ReceiptId);
      }
    });
  }
};

/**
 * Mô tả: kiểm tra toàn bộ hàng đã check chưa
 * created by : ttanh
 * created date: 25-06-2023
 */
const isAllChecked = () => {
  if (receipt.data && receipt.data.length > 0) {
    for (let i = 0; i < receipt.data.length; ++i) {
      if (receipt.data[i] && !checkRow()?.has(receipt.data[i].ReceiptId)) {
        return false;
      }
    }
    return true;
  }
  return false;
};

/**
 * Mô tả: đóng mở board value
 * created by : ttanh (30-07-2023)
 */
function onToggleShowBoardValue() {
  isShowBoardValue.value = !isShowBoardValue.value;
  iconUp.value = !iconUp.value;
}

/**
 * Mô tả:  đóng bảng chọn trang
 * created by : ttanh (17-08-2023)
 */
function onCloseBoardValue() {
  isShowBoardValue.value = false;
  iconUp.value = false;
}

/**
 * Mô tả: thay đổi trang
 * created by : ttanh (17-08-2023)
 */
async function onPageChanged(page) {
  receipt.currentPage = page;

  await receipt.getList(receipt.recordsPerPage, receipt.currentPage, receipt.querySearch);
}

/**
 * Mô tả: thay đổi kích thước trang
 * created by : ttanh (17-08-2023)
 */
async function onChangeRecordsPerPage($event, value, index) {
  receipt.recordsPerPage = value;
  indexCurrentBoardValue.value = index;
  receipt.currentPage = 1;

  onToggleShowBoardValue();
  await receipt.getList(receipt.recordsPerPage, receipt.currentPage, receipt.querySearch);
}
const boardValue = ref(null);
useClickOutSide(dropdownMultiFunction, onCloseDeltedMulFunc);
useClickOutSide(contextMenu, onCloseContextMenu);
useClickOutSide(boardValue, onCloseBoardValue);

onBeforeMount(() => {
  for (let i = 0; i < receipt.recordsPerPage; ++i) {
    dropdownRefs.value.push(ref(null));
  }
});

onMounted(async () => {
  await receipt.getList(receipt.recordsPerPage, receipt.currentPage);
  sum.value = 0;
  receipt.data?.map((item) => {
    if (item.TotalMoney != null && item.TotalMoney != undefined) {
      sum.value += item.TotalMoney;
    }
  });
});
</script>

<style>
td.receipt-number-color {
  color: #0075c0;
}
td.receipt-number-color:hover {
  text-decoration: underline;
}

.noted-color {
  color: #14a200;
}
</style>
