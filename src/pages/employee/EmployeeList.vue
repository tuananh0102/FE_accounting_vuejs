<template>
  <EmployeeDetail
    v-if="isShowEmployeeDetail"
    :onCloseEmployeeDetail="onCloseEmployeeDetail"
    :employee="employeeSelected"
    :onShowToast="onShowToast"
    :onShowFailToast="onShowFailToast"
    :onShowNewEmployeeForm="onShowNewEmployeeForm"
    :updateData="reloadData"
    :mode="mode"
  ></EmployeeDetail>

  <div class="main">
    <div class="main__header">
      <div class="main__table-title">{{ $_MResource[$_LANG_CODE].table.title }}</div>
      <router-link class="back-link" to="/apps">
        <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon">
          <span class="icon-arrow__right--blue"></span>
        </span>
        <p>Tất cả danh mục</p>
      </router-link>
    </div>

    <div class="main__body">
      <div class="background" v-if="isShowLoading">
        <span class="wrapper-loading"><img class="loading-icon" src="@/assets/icon/loading.svg" alt="loading" /></span>
      </div>
      <div class="main__top">
        <div class="main__top-left">
          <button
            ref="dropdownMultiFunction"
            class="wrapper"
            @click="toggleDropdownMulFunc"
            :disabled="!(checkedIds.size > 1)"
            :class="[{ normal: checkedIds.size > 1 }]"
          >
            <p>{{ $_MResource[$_LANG_CODE].button.doMultiple }}</p>
            <span class="wrapper-icon plr-12">
              <span class="combobox__icon-down" :style="{ transform: iconUp ? 'rotate(180deg)' : '' }"></span>
            </span>
          </button>
          <div
            class="options"
            v-if="isShowDropdownMultiFunction && checkedIds.size > 1"
            @click="() => (isShowDeletedDialog = true)"
          >
            <div>{{ $_MResource[$_LANG_CODE].button.delete }}</div>
          </div>
        </div>

        <div class="main__top-right">
          <m-input
            :urlIcon="require('@/assets/icon/magnifying-glass-solid.svg')"
            :placeholder="$_MResource[$_LANG_CODE].placeholder.searchByCodeAndName"
            v-model="inputSearch"
          ></m-input>
          <span :title="$_MResource[$_LANG_CODE].titleIcon.refresh" class="wrapper-icon mlr-6" @click="reloadData"
            ><span class="icon-reload"></span
          ></span>
          <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon mlr-6" @click="exportExcelFile">
            <span class="icon-excel"></span>
          </span>
          <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon mlr-6">
            <span class="icon-setting"></span>
          </span>

          <div ref="btnUltity" class="mlr-6">
            <m-button
              round
              singleBtn
              urlIcon="icon-dropdown__black"
              typeBtn="sub-btn"
              :textBtnClick="toggleUlity"
              class="border-black round-btn"
            >
              <template #default>{{ $_MResource[$_LANG_CODE].button.utility }}</template>
              <template #options>
                <p v-if="isShowUltity" class="btn__options">
                  <span class="wrapper-text">Đồng bộ với AMIS hệ thống</span>
                </p>
              </template>
            </m-button>
          </div>

          <div ref="btnDropDownOption" class="ml-6">
            <m-button
              round
              urlIcon="icon-dropdown-white"
              typeBtn="regular-btn"
              :textBtnClick="onShowNewEmployeeForm"
              :iconBtnClick="toggleDropDownOption"
            >
              <template #default>{{ $_MResource[$_LANG_CODE].button.addEmployee }}</template>
              <template #options>
                <p v-if="isShowDropDownOption" class="btn__options">
                  <span class="wrapper-text">Nhập từ Excel</span>
                </p>
              </template>
            </m-button>
          </div>
        </div>
      </div>

      <!-- ---------table------------ -->
      <m-data-table
        :header="header"
        :data="data"
        :onShowToast="onShowToast"
        :onShowFailToast="onShowFailToast"
        :decreaseTotalRecord="decreaseTotalRecord"
        :reloadData="reloadData"
        :checkRow="checkRow"
        :deleteObj="deleteObj"
        idField="EmployeeId"
        @onDbClickRow="
          (em) => {
            showEmployeeDetail(em);
          }
        "
        :onDuplicated="onDuplicated"
      ></m-data-table>

      <div class="table__bottom">
        <p class="table__bottom-left">
          {{ $_MResource[$_LANG_CODE].table.total }}: <b>{{ totalRecord }}</b>
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
            :totalPage="Math.ceil(totalRecord / recordsPerPage)"
            :perPage="10"
            :currentPage="currentPage"
            @pageChanged="onPageChanged"
          ></m-pagination>
        </span>
      </div>
    </div>
  </div>

  <m-toast-msg
    v-if="isShowToast"
    :statusClass="{ 'msg-status': true, success: isShowToast }"
    iconClass="icon-success"
    :desc="toastMsg"
    :status="$_MResource[$_LANG_CODE].dialog.statusSuccess"
    :close="closeToast"
  ></m-toast-msg>

  <m-toast-msg
    v-if="isShowFailToast"
    :statusClass="{ 'msg-status': true, fail: isShowFailToast }"
    iconClass="icon-fail"
    :desc="toastMsg"
    :status="$_MResource[$_LANG_CODE].dialog.statusFail"
    :close="closeToast"
  ></m-toast-msg>

  <m-dialog
    v-if="isShowDeletedDialog"
    @onCancel="() => onCloseDeletedDialog()"
    @onSuccess="() => onAcceptDeletedDialog()"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionDelete"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    >{{ $_MResource[$_LANG_CODE].dialog.confirmDeleteMsg }} {{ checkedIds.size }}
    {{ $_MResource[$_LANG_CODE].table.record }}?</m-dialog
  >

  <m-dialog
    v-if="isShowFailSystem"
    @onCancel="() => (isShowFailSystem = false)"
    :title="$_MResource[$_LANG_CODE].dialog.titleFailSystem"
    iconClass="icon-warning-red"
    >{{ $_MResource[$_LANG_CODE].dialog.failSystemMsg }}</m-dialog
  >
</template>

<script>
import EmployeeService from "@/services/EmployeeService.js";
import EmployeeDetail from "@/pages/employee/EmployeeDetail.vue";
import useClickOutSide from "@/composables/useClickOutSide.js";
import { ref } from "vue";
export default {
  name: "EmployeeList",

  components: { EmployeeDetail },

  data() {
    return {
      // isShowBoardValue: false,
      // iconUp: false,
      isShowEmployeeDetail: false,
      isShowDeletedDialog: false,

      employeeSelected: {},
      data: [],
      toastMsg: "",
      timeOutToast: null,
      isShowToast: false,
      inputSearch: "",
      timeOutTypeSearch: null,
      currentPage: 1,
      recordsPerPage: 10,
      indexCurrentBoardValue: 0,
      totalRecord: 0,

      isShowLoading: false,
      isShowFailSystem: false,
      checkedIds: new Set(),
      isShowFailToast: false,
      boardValues: this.$_MResource[this.$_LANG_CODE].table.recordsPerPage,

      // header của table
      header: this.$_MResource[this.$_LANG_CODE].table.header,
      mode: this.$_MEnum.FormMode.detail,
    };
  },
  methods: {
    /**
     * Mô tả: xóa bản ghi
     * created by : ttanh (09-07-2023)
     */
    async deleteObj(id) {
      await EmployeeService.deleteObj(id);

      // this.reloadData();
    },
    /**
     * Mô tả: xuất ra file excel
     * created by : ttanh (02-07-2023)
     */
    async exportExcelFile() {
      try {
        this.isShowLoading = true;
        await EmployeeService.exportExcel();
        this.isShowLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * Mô tả: đóng thông báo xóa nhiều bản ghi
     * created by : ttanh
     * created date: 25-06-2023
     */
    onCloseDeletedDialog() {
      this.isShowDeletedDialog = false;
    },

    /**
     * Mô tả: chấp nhận thông báo xóa nhiều bản ghi
     * created by : ttanh
     * created date: 25-06-2023
     */
    async onAcceptDeletedDialog() {
      try {
        const res = await EmployeeService.deleteMultipleObj(this.checkedIds);
        if (res.status == 200) {
          this.reloadData();

          this.onShowToast(
            `${this.$_MResource[this.$_LANG_CODE].dialog.delete} ${this.checkedIds.size} ${
              this.$_MResource[this.$_LANG_CODE].table.record
            } ${this.$_MResource[this.$_LANG_CODE].dialog.success}`
          );
          this.isShowDeletedDialog = false;
          this.checkedIds.clear();
          this.isShowDropdownMultiFunction = false;
        }
      } catch (e) {
        if (typeof e == "object" && Object.keys(e).includes("System")) {
          this.onShowFailToast(this.$_MResource[this.$_LANG_CODE].dialog.failDeleteToastMsg);
          this.isShowDeletedDialog = false;
          this.checkedIds.clear();
          this.isShowDropdownMultiFunction = false;
        }
      }
    },

    /**
     * Mô tả: check hoặc uncheck row
     * created by : ttanh
     * created date: 25-06-2023
     */
    checkRow(id) {
      if (!id) {
        return this.checkedIds;
      }
      if (this.checkedIds.has(id)) {
        this.checkedIds.delete(id);
        return this.checkedIds;
      }
      this.checkedIds.add(id);
      return this.checkedIds;
    },

    /**
     * Mô tả: chức năng nhân bản
     * created by : ttanh
     * created date: 25-06-2023
     */
    onDuplicated(index) {
      this.duplicatedEmployee = { ...this.data[index] };
      EmployeeService.getNewcode()
        .then((res) => {
          this.duplicatedEmployee.EmployeeCode = res.Data;
          this.showEmployeeDetail({ ...this.duplicatedEmployee });
          this.mode = this.$_MEnum.FormMode.add;
          this.isShowEmployeeDetail = true;
        })
        .catch((e) => {
          if (typeof e == "object" && Object.keys(e).includes("System")) this.isShowFailSystem = true;
        });
    },

    decreaseTotalRecord() {
      --this.totalRecord;
    },
    /**
     * Mô tả: tải lại dữ liệu
     * created by : ttanh
     * created date: 18-06-2023
     */
    reloadData() {
      if (this.currentPage > Math.ceil(this.totalRecord / this.recordsPerPage)) {
        --this.currentPage;
      }
      const query = `?querySearch=${this.inputSearch}&recordsPerPage=${this.recordsPerPage}&page=${this.currentPage}`;
      this.isShowLoading = true;
      EmployeeService.getList(query)
        .then((res) => {
          this.data = res.Data;
          this.totalRecord = res.TotalRecord;
          this.isShowLoading = false;
        })
        .catch((e) => {
          if (typeof e == "object" && Object.keys(e).includes("System")) this.isShowFailSystem = true;
        });
    },
    /**
     * Mô tả: mở form đăng ký
     * created by : ttanh
     * created date: 29-05-2023
     */
    async onShowNewEmployeeForm() {
      try {
        this.mode = this.$_MEnum.FormMode.add;
        const res = await EmployeeService.getNewcode();

        this.employeeSelected = { EmployeeCode: res.Data };
        this.isShowEmployeeDetail = true;
      } catch (e) {
        console.log(e);
        this.isShowEmployeeDetail = true;

        this.employeeSelected = {};
      }
    },

    /**
     * Mô tả: đóng form đăng ký
     * created by : ttanh
     * created date: 29-05-2023
     */
    onCloseEmployeeDetail() {
      this.isShowEmployeeDetail = false;
    },

    /**
     * Mô tả: mở form chi tiết nhân viên
     * created by : ttanh
     * created date: 29-05-2023
     */
    showEmployeeDetail(em) {
      this.employeeSelected = em;
      this.mode = this.$_MEnum.FormMode.detail;
      this.isShowEmployeeDetail = true;
    },

    /**
     * Mô tả: cập nhật lại toàn bộ danh sách bản ghi
     * created by : ttanh
     * created date: 29-05-2023
     */

    updateData(data) {
      this.data = data;
    },

    /**
     * Mô tả: hiển thị toast msg
     * created by : ttanh
     * created date: 29-05-2023
     */
    onShowToast(msg) {
      this.closeToast();
      this.toastMsg = msg;
      this.isShowToast = true;
      this.timeOutToast = setTimeout(() => {
        this.isShowToast = false;
      }, 3000);
    },

    /**
     * Mô tả: hiển thị toast thống báo thất bại
     * created by : ttanh (01-07-2023)
     */
    onShowFailToast(msg) {
      this.closeToast();
      this.toastMsg = msg;
      this.isShowFailToast = true;
      this.timeOutToast = setTimeout(() => {
        this.isShowFailToast = false;
      }, 3000);
    },

    /**
     * Mô tả: đóng toast msg
     * created by : ttanh
     * created date: 24-06-2023
     */
    closeToast() {
      window.clearTimeout(this.timeOutToast);
      this.isShowToast = false;
      this.isShowFailToast = false;
    },

    async onPageChanged(page) {
      this.currentPage = page;
      try {
        const query = `?querySearch=${this.inputSearch}&page=${this.currentPage}&recordsPerPage=${this.recordsPerPage}`;
        this.isShowLoading = true;
        const res = await EmployeeService.getList(query);
        this.data = res.Data;
        this.isShowLoading = false;

        // this.onToggleShowBoardValue();
      } catch (e) {
        if (typeof e == "object" && Object.keys(e).includes("System")) this.isShowFailSystem = true;
      }
    },
    /**
     * Mô tả: thay đổi dố lượng bản ghi trong bảng
     * created by : ttanh
     * created date: 03-06-2023
     */
    async onChangeRecordsPerPage($event, value, index) {
      this.recordsPerPage = value;
      this.indexCurrentBoardValue = index;
      this.currentPage = 1;
      try {
        const query = `?name=${this.inputSearch}&$page=1&recordsPerPage=${value}`;
        this.onToggleShowBoardValue();
        const res = await EmployeeService.getList(query);
        this.data = res.Data;
      } catch (e) {
        if (typeof e == "object" && Object.keys(e).includes("System")) this.isShowFailSystem = true;
      }
    },

    /**
     * Mô tả: tìm kiếm bản ghi
     * created by : ttanh
     * created date: 27-06-2023
     */
    searchRecords(newValue) {
      clearTimeout(this.timeOutTypeSearch);
      this.timeOutTypeSearch = setTimeout(async () => {
        try {
          this.currentPage = 1;
          const query = `?querySearch=${newValue}&recordsPerPage=${this.recordsPerPage}&page=${this.currentPage}`;

          this.isShowLoading = true;
          const res = await EmployeeService.getList(query);
          this.data = res.Data;
          this.totalRecord = res.TotalRecord;
          this.isShowLoading = false;
        } catch (e) {
          if (typeof e == "object" && Object.keys(e).includes("System")) this.isShowFailSystem = true;
        }
      }, 600);
    },
  },
  watch: {
    inputSearch: function (newValue) {
      this.searchRecords(newValue);
    },
  },

  setup() {
    const boardValue = ref();
    const btnUltity = ref();
    const btnDropDownOption = ref();
    const isShowBoardValue = ref(false);
    const isShowUltity = ref(false);
    const iconUp = ref(false);

    const isShowDropDownOption = ref(false);
    const isShowDropdownMultiFunction = ref(false);
    const dropdownMultiFunction = ref();
    /**
     * Mô tả: đóng mở bảng chọn số bản ghi trên một trang
     * created by : ttanh
     * created date: 29-05-2023
     */
    function onToggleShowBoardValue() {
      isShowBoardValue.value = !isShowBoardValue.value;
      iconUp.value = !iconUp.value;
    }

    /**
     * Mô tả: đóng mở dropdown
     * created by : ttanh (17-07-2023)
     */
    function toggleDropDownOption() {
      isShowDropDownOption.value = !isShowDropDownOption.value;
    }

    function onCloseDropDownOption() {
      isShowDropDownOption.value = false;
    }

    /**
     * Mô tả: đóng mở ultity
     * created by : ttanh (17-07-2023)
     */
    function toggleUlity() {
      isShowUltity.value = !isShowUltity.value;
    }

    function onCloseUltity() {
      isShowUltity.value = false;
    }

    /**
     * Mô tả: đóng board value
     * created by : ttanh
     * created date: 07-06-2023
     */
    function onCloseBoardValue() {
      isShowBoardValue.value = false;
      iconUp.value = false;
    }

    /**
     * Mô tả: đóng dropdown
     * created by : ttanh
     * created date: 25-06-2023
     */
    function onCloseDeltedMulFunc() {
      isShowDropdownMultiFunction.value = false;
    }

    /** đóng mở dropdown
     * Mô tả:
     * created by : ttanh
     * created date: 25-06-2023
     */
    function toggleDropdownMulFunc() {
      isShowDropdownMultiFunction.value = !isShowDropdownMultiFunction.value;
    }

    useClickOutSide(boardValue, onCloseBoardValue);
    useClickOutSide(dropdownMultiFunction, onCloseDeltedMulFunc);
    useClickOutSide(btnDropDownOption, onCloseDropDownOption);
    useClickOutSide(btnUltity, onCloseUltity);

    return {
      boardValue,
      btnUltity,
      isShowBoardValue,
      iconUp,
      isShowUltity,
      btnDropDownOption,
      onToggleShowBoardValue,
      dropdownMultiFunction,
      isShowDropdownMultiFunction,
      isShowDropDownOption,
      onCloseDeltedMulFunc,
      toggleDropdownMulFunc,
      toggleDropDownOption,
      toggleUlity,
    };
  },

  mounted() {
    /**
     * Mô tả: gọi api lấy toàn bộ nhân viên
     * created by : ttanh
     * created date: 29-05-2023
     */

    const query = `?recordsPerPage=${this.recordsPerPage}&page=1`;
    this.isShowLoading = true;
    EmployeeService.getList(query)
      .then((res) => {
        this.data = res.Data;
        this.totalRecord = res.TotalRecord;
        this.isShowLoading = false;
      })
      .catch((e) => {
        if (typeof e == "object" && Object.keys(e).includes("System")) this.isShowFailSystem = true;
      });

    // EmployeeService.getList()
    //   .then((data) => {
    //     this.data = data;
    //     this.totalPage = this.data.length;
    //   })
    //   .catch((e) => console.log(e));
  },
};
</script>

<style>
.main__top-right .single-btn .round-btn.sub-btn {
  border: none;
}
</style>
