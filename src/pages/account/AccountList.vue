<template>
  <AccountDetail
    v-if="isShowDetailForm"
    :mode="formMode"
    :account="account"
    :onShowForm="onShowDetailForm"
    :onCloseForm="onCloseDetailForm"
    :onShowToast="onShowToast"
    :reloadData="reloadData"
  ></AccountDetail>
  <div class="main">
    <div class="main__header">
      <div class="main__table-title">{{ $_MResource[$_LANG_CODE].table.account }}</div>
      <router-link class="back-link" to="/apps">
        <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon">
          <span class="icon-arrow__right--blue"></span>
        </span>
        <p>{{ $_MResource[$_LANG_CODE].accountPage.accountList.allApps }}</p>
      </router-link>
    </div>

    <div class="main__body">
      <MLoading v-if="isLoadingPage"></MLoading>
      <div class="main__top">
        <div class="main__top-left">
          <m-input
            :urlIcon="require('@/assets/icon/magnifying-glass-solid.svg')"
            :placeholder="$_MResource[$_LANG_CODE].placeholder.searchByCodeAndName"
            v-model="querySearch"
          ></m-input>
        </div>

        <div class="main__top-right">
          <button @click="toggleExpand" class="expand-btn" v-if="!isOpenAll">
            {{ $_MResource[$_LANG_CODE].accountPage.accountList.expand }}
          </button>
          <button @click="toggleExpand" class="expand-btn" v-if="isOpenAll">
            {{ $_MResource[$_LANG_CODE].accountPage.accountList.collapse }}
          </button>

          <span
            @click="async () => await reloadData()"
            :title="$_MResource[$_LANG_CODE].titleIcon.refresh"
            class="wrapper-icon mlr-6"
            ><span class="icon-reload"></span
          ></span>
          <span
            @click="async () => await exportExcel()"
            :title="$_MResource[$_LANG_CODE].titleIcon.excel"
            class="wrapper-icon mlr-6"
          >
            <span class="icon-excel"></span>
          </span>

          <div ref="btnUltity" class="mlr-6">
            <m-button round singleBtn typeBtn="sub-btn" class="border-default round-btn">
              <template #default>{{ $_MResource[$_LANG_CODE].button.convertAccount }}</template>
            </m-button>
          </div>

          <div ref="btnDropDownOption" class="ml-6">
            <m-button
              round
              urlIcon="icon-dropdown-white"
              typeBtn="regular-btn"
              :textBtnClick="() => onShowDetailForm($_MEnum.FormMode.add, {})"
            >
              <template #default>{{ $_MResource[$_LANG_CODE].button.addEmployee }}</template>
              <template #options>
                <p v-if="false" class="btn__options">
                  <span class="wrapper-text">{{ $_MResource[$_LANG_CODE].accountPage.accountList.importExcel }}</span>
                </p>
              </template>
            </m-button>
          </div>
        </div>
      </div>

      <!-- ---------table------------ -->
      <m-data-table :header="header" customRow ref="tableContainer">
        <template v-for="(row, indexRow) in data" :key="row.AccountId">
          <tr
            :class="{ medium: row.IsParent }"
            v-if="
              row.IsRoot ||
              (!parentNodes[row.AccountParentId]?.status && parentNodes[row.AccountParentId]?.showChildren)
            "
          >
            <td
              v-for="item in header"
              :key="item.id"
              :style="{ paddingLeft: item.fieldName == 'AccountCode' ? `${(row.Grade - 1) * 20}px` : '0px' }"
              @dblclick="onDbClickRow(row)"
              :class="item.className"
              :title="
                item.fieldName == 'AccountNature'
                  ? getNatureName(row)
                  : item.fieldName == 'AccountStatus'
                  ? getStatus(row)
                  : row[item.fieldName]
              "
            >
              <div class="display-flex pl-16">
                <div class="hiddenRec" v-if="item.fieldName == 'AccountCode' && !row.IsParent"></div>
                <span
                  @dblclick.stop
                  class="wrapper-icon mr-6"
                  v-if="item.fieldName == 'AccountCode' && row.IsParent"
                  @click.stop="async () => await toggleShowChildren(indexRow, row.AccountId)"
                >
                  <span
                    :class="{
                      'icon-square-plus': parentNodes[row.AccountId]?.status,
                      'icon-square-minus': !parentNodes[row.AccountId]?.status,
                    }"
                  ></span>
                </span>

                <p class="text-overflow__ellipsis">
                  {{
                    item.fieldName == "AccountNature"
                      ? getNatureName(row)
                      : item.fieldName == "AccountStatus"
                      ? getStatus(row)
                      : row[item.fieldName]
                  }}
                </p>
              </div>
            </td>

            <td class="align-center">
              <span class="table__function-name" @click.prevent="() => onDbClickRow(row)">Sửa</span>
              <div
                :ref="`btnDropDowns_${row.AccountId}`"
                @click.stop="toggleContextMenu($event, indexRow, row)"
                :style="{
                  border: currentIndexContextMenu === indexRow && isShowContextMenu ? '1px solid #007aff' : null,
                }"
                class="wrapper-icon"
              >
                <span class="dropdown-blue-icon"></span>
              </div>
            </td>
          </tr>
        </template>
      </m-data-table>
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
            :totalPage="Math.ceil(totalRoot / recordsPerPage)"
            :perPage="10"
            :currentPage="currentPage"
            @pageChanged="onPageChanged"
          ></m-pagination>
        </span>
      </div>
    </div>
  </div>
  <!-- <m-context-menu
    ref="contextMenu"
   
    :onClose="onCloseContextMenu"
    :topPosition="contextMenuY"
    :index="currentIndexContextMenu"
    :onDuplicated="onDuplicated"
    :onShowDialog="onShowDeleteDialog"
    class="contextMenu-account"
  ></m-context-menu> -->

  <ul
    v-if="isShowContextMenu"
    ref="contextMenu"
    class="context-menu contextMenu-account"
    :style="{ top: contextMenuY }"
  >
    <li @click="() => onDuplicated(currentIndexContextMenu)" class="context-menu__option option--copy">
      {{ $_MResource[$_LANG_CODE].button.duplicate }}
    </li>
    <li @click="onShowDeleteDialog" class="context-menu__option option--delete">
      {{ $_MResource[$_LANG_CODE].button.delete }}
    </li>
    <li
      v-if="this.data[this.currentIndexContextMenu]?.AccountStatus"
      @click="async () => toggleStatus(currentIndexContextMenu)"
      class="context-menu__option option--stop"
    >
      {{ $_MResource[$_LANG_CODE].button.stopUse }}
    </li>
    <li
      v-if="!this.data[this.currentIndexContextMenu]?.AccountStatus"
      @click="async () => toggleStatus(currentIndexContextMenu)"
      class="context-menu__option option--stop"
    >
      {{ $_MResource[$_LANG_CODE].button.use }}
    </li>
  </ul>

  <m-dialog
    v-if="isShowDeletedDialog"
    @onCancel="() => onCloseDialog()"
    @onSuccess="() => onAcceptDeletedDialog()"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionDelete"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    >{{ $_MResource[$_LANG_CODE].dialog.confirmDeleteMsg }} {{ $_MResource[$_LANG_CODE].table.record }}
    {{ ` <${this.data[currentIndexContextMenu]?.AccountCode}>?` }}</m-dialog
  >

  <m-dialog
    v-if="isShowUpdateAllDialog"
    @onCancel="async () => await onRefuseUpdateAll(currentIndexContextMenu)"
    @onSuccess="async () => await onAcceptUpdateAll(currentIndexContextMenu)"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionDelete"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
    :btnCancle="$_MResource[$_LANG_CODE].button.refuse"
    >{{ $_MResource[$_LANG_CODE].accountPage.accountList.updateAllQuestion }}</m-dialog
  >

  <m-dialog
    v-if="isShowErrorDialog"
    @onCancel="() => onCloseDialog()"
    @onSuccess="() => onCloseDialog()"
    title="Thông báo"
    iconClass="icon-warning-red"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    <span v-for="(key, index) in Object.keys(errors)" :key="index">
      <ul class="list-error">
        <li
          v-for="(item, index) in errors[key]"
          :key="index"
          :class="{ 'list-style-none ml--20': Object.keys(errors).length < 2 }"
        >
          {{ item }}
        </li>
      </ul>
    </span>
  </m-dialog>

  <m-toast-msg
    v-if="isShowToast"
    :statusClass="{ 'msg-status': true, success: isShowToast }"
    iconClass="icon-success"
    :desc="toastMsg"
    :status="$_MResource[$_LANG_CODE].dialog.statusSuccess"
    :close="closeToast"
  ></m-toast-msg>
</template>

<script>
import { ref } from "vue";
import useClickOutSide from "@/composables/useClickOutSide";

import AccountDetail from "./AccountDetail.vue";

import AccountService from "@/services/AccountService";
import MLoading from "@/components/loading/MLoading.vue";
export default {
  name: "AccountList",
  components: { AccountDetail, MLoading },
  data() {
    return {
      header: this.$_MResource[this.$_LANG_CODE].table.headerAccountTable,
      data: [],
      isShowDetailForm: false,
      isOpenAll: false,
      isClickedExpand: false,
      formMode: null,
      account: {},
      isShowDeletedDialog: false,
      isShowToast: false,
      toastMsg: this.$_MResource[this.$_LANG_CODE].accountPage.accountList.deleteSuccess,
      timeOutToast: null,
      listAccountNature: [
        {
          AccountNatureId: 0,
          AccountNatureName: "Dư nợ",
        },
        {
          AccountNatureId: 1,
          AccountNatureName: "Dư có",
        },
        {
          AccountNatureId: 2,
          AccountNatureName: "Lưỡng tính",
        },
        {
          AccountNatureId: 3,
          AccountNatureName: "Không có số dư",
        },
      ],
      parentNodes: {},
      errors: {},
      currentPage: 1,
      recordsPerPage: 20,
      querySearch: "",
      timeOutSearch: null,
      indexCurrentBoardValue: 1,
      boardValues: this.$_MResource[this.$_LANG_CODE].table.recordsPerPage,
      totalRecord: 0,
      totalRoot: 0,
      contextMenuY: 0,
      currentIndexContextMenu: 0,
      isShowErrorDialog: false,
      currentObjId: null,
      isShowUpdateAllDialog: false,
      isLoadingPage: false,
      iconUp: false,
    };
  },

  watch: {
    querySearch(newValue) {
      window.clearTimeout(this.timeOutSearch);
      this.timeOutSearch = setTimeout(async () => {
        if (!newValue?.trim()) {
          this.isOpenAll = false;
          this.isClickedExpand = false;
          this.currentPage = 1;
          this.isLoadingPage = true;
          const res = await AccountService.getList(
            `?pageSize=${this.recordsPerPage}&pageIndex=${this.currentPage}&isRoot=true`
          );
          this.isLoadingPage = false;

          this.totalRecord = res.TotalRecord;
          this.totalRoot = res.TotalRoot;
          this.data = [...res.Data];
          this.parentNodes = this.getListParent(this.data);
        } else {
          this.currentPage = 1;
          this.isLoadingPage = true;

          const resData = await this.getAccountAndExpand(this.recordsPerPage, 1, newValue);
          this.isLoadingPage = false;

          this.data = resData;
          this.isOpenAll = true;
          this.isClickedExpand = true;
        }
      }, 300);
    },
  },

  methods: {
    /**
     * Mô tả: xuất file excel
     * created by : ttanh (17-08-2023)
     */
    async exportExcel() {
      this.isLoadingPage = true;
      await AccountService.exportExcel(this.$_MResource[this.$_LANG_CODE].fileName?.accountExcel);
      this.isLoadingPage = false;
    },

    /**
     * Mô tả: cập nhật 1 bản ghi
     * created by : ttanh (13-08-2023)
     */
    async onRefuseUpdateAll(index) {
      try {
        this.isLoadingPage = true;
        await AccountService.updateStatus(this.data[index].AccountCode, true);
        this.isLoadingPage = false;

        this.onCloseUpdateAllDialog();
        this.data[index].AccountStatus = true;
      } catch (e) {
        this.errors = { ...e };
      }
    },

    /**
     * Mô tả: cập nhật tài khoản và con của nó
     * created by : ttanh (13-08-2023)
     */
    async onAcceptUpdateAll(index) {
      try {
        this.isLoadingPage = true;
        await AccountService.updateStatusMultiple(this.data[index].AccountCode, true);
        this.isLoadingPage = false;
        this.onCloseUpdateAllDialog();
        this.data.map((item) => {
          if (item.AccountCode?.startsWith(this.data[index].AccountCode)) {
            item.AccountStatus = true;
          }
        });
      } catch (e) {
        this.isLoadingPage = false;
        this.errors = { ...e };
        this.isShowErrorDialog = true;
      }
    },

    /**
     * Mô tả: mở dialog hỏi cập nhật
     * created by : ttanh (13-08-2023)
     */
    openUpdateAllDialog() {
      this.isShowUpdateAllDialog = true;
    },

    /**
     * Mô tả: đóng dialog hỏi cập nhật
     * created by : ttanh (13-08-2023)
     */
    onCloseUpdateAllDialog() {
      this.isShowUpdateAllDialog = false;
    },

    /**
     * Mô tả: cập nhật trạng thái cho tài khoản
     * created by : ttanh (13-08-2023)
     */
    async toggleStatus(index) {
      const account = this.data[index];
      try {
        if (account.AccountStatus) {
          this.isLoadingPage = true;
          await AccountService.updateStatusMultiple(account.AccountCode, false);
          this.isLoadingPage = false;
          this.data.map((item) => {
            if (item.AccountCode?.startsWith(this.data[index].AccountCode)) {
              item.AccountStatus = false;
            }
          });
        } else {
          if (!account.IsParent) {
            this.isLoadingPage = true;
            await AccountService.updateStatus(account.AccountCode, true);
            this.isLoadingPage = false;
            this.data[index].AccountStatus = true;
          } else {
            this.openUpdateAllDialog();
          }
        }
      } catch (e) {
        this.isLoadingPage = false;
        this.errors = { ...e };
        this.isShowErrorDialog = true;
      }
    },

    /**
     * Mô tả: sửa bản ghi
     * created by : ttanh (12-08-2023)
     */
    onDbClickRow(account) {
      console.log(account);
      this.onShowDetailForm(1, { ...account });
    },
    /**
     * Mô tả: chức năng nhân bản
     * created by : ttanh (12-08-2023)
     */
    onDuplicated(index) {
      this.onShowDetailForm(0, { ...this.data[index] });
      this.isShowContextMenu = false;
    },

    /**
     * Mô tả: chấp nhận xóa
     * created by : ttanh (12-08-2023)
     */
    async onAcceptDeletedDialog() {
      this.isShowContextMenu = false;
      try {
        this.isLoadingPage = true;
        await AccountService.deleteObj(this.currentObjId);
        this.isLoadingPage = false;
        this.reloadData(this.currentPage);
        this.onShowToast("Xóa thành công! ");
        this.onCloseDialog();
      } catch (e) {
        this.errors = { ...e };
        this.isLoadingPage = false;

        this.isShowErrorDialog = true;
      }
    },

    /**
     * Mô tả: hiển thị cảnh báo xóa
     * created by : ttanh (12-08-2023)
     */
    onShowDeleteDialog() {
      this.isShowDeletedDialog = true;
      this.isShowContextMenu = false;
    },

    /**
     * Mô tả: mở context-menu
     * created by : ttanh
     * created date: 12-08-2023
     */
    toggleContextMenu($event, index, item) {
      // const tableY = this.$refs.tableContainer.getBoundingClientRect().y;
      let tableY = 46;
      let str = `btnDropDowns_${item.AccountId}`;

      const btnY = this.$refs[str][0].getBoundingClientRect().y;

      let totalY = btnY - tableY;

      this.contextMenuY = totalY + 65 + "px";

      if (totalY > 580) {
        totalY -= 50;
        this.contextMenuY = totalY + "px";
      }
      if (!this.isShowContextMenu) {
        this.currentIndexContextMenu = index;

        this.currentObjId = item.AccountId;
        this.isShowContextMenu = !this.isShowContextMenu;
      } else {
        if (this.currentIndexContextMenu === index) {
          this.isShowContextMenu = !this.isShowContextMenu;
        } else {
          this.currentIndexContextMenu = index;
          this.currentObjId = item.AccountId;
        }
      }
    },

    /**
     * Mô tả: mở dialog xác nhận
     * created by : ttanh (12-08-2023)
     */
    onCloseDialog() {
      this.isShowErrorDialog = false;
      this.isShowDeletedDialog = false;
    },

    /**
     * Mô tả: thay đổi trang
     * created by : ttanh (11-08-2023)
     */
    async onPageChanged(page) {
      this.currentPage = page;
      if (this.querySearch) {
        this.isLoadingPage = true;
        const resData = await this.getAccountAndExpand(this.recordsPerPage, this.currentPage, this.querySearch);
        this.isLoadingPage = false;
        this.data = resData;
        this.isOpenAll = true;
        this.isClickedExpand = true;
      } else {
        this.isLoadingPage = true;
        const res = await AccountService.getList(
          `?pageSize=${this.recordsPerPage}&pageIndex=${this.currentPage}&isRoot=true`
        );
        this.isLoadingPage = false;
        this.isOpenAll = false;
        this.isClickedExpand = false;
        this.data = [...res.Data];
        this.parentNodes = this.getListParent(this.data);
      }

      // this.onToggleShowBoardValue();
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
      this.isOpenAll = false;
      this.isClickedExpand = false;

      if (!this.querySearch) {
        this.isLoadingPage = true;
        const res = await AccountService.getList(
          `?pageSize=${this.recordsPerPage}&pageIndex=${this.currentPage}&isRoot=true`
        );
        this.isLoadingPage = false;
        this.data = [...res.Data];
        this.parentNodes = this.getListParent(this.data);
        this.totalRecord = res.TotalRecord;
        this.totalRoot = res.TotalRoot;
      } else {
        this.isLoadingPage = true;
        const resData = await this.getAccountAndExpand(this.recordsPerPage, this.currentPage, this.querySearch);
        this.isLoadingPage = false;
        this.data = resData;
        this.parentNodes = this.getListParent(this.data, true);
        // this.totalRecord = resData.TotalRecord;
        // this.totalRoot = resData.TotalRoot;
      }

      this.onToggleShowBoardValue();
    },

    /**
     * Mô tả: cập nhật trạng thái hiển thị con của các nút con
     * created by : ttanh (10-08-2023)
     * params: status: trạng thái hiển thị children. true: hiển thị, false: không hiển thị
     * params: clickStatus: trạng thái của nút cộng/trừ: true: nút cộng, false: nút trừ
     */
    updateStatusShowChildren(parentId, status, clickStatus) {
      if (this.parentNodes[parentId]) {
        this.parentNodes[parentId].showChildren = status;
        if (clickStatus != null && clickStatus != undefined) {
          this.parentNodes[parentId].status = clickStatus;
        }

        Object.keys(this.parentNodes).map((key) => {
          if (this.parentNodes[key].parentId == parentId) {
            this.updateStatusShowChildren(key, status, clickStatus);
          }
        });
      }
    },

    /**
     * Mô tả: hiện tài khoản con
     * created by : ttanh (10-08-2023)
     */
    async toggleShowChildren(index, id) {
      // nếu đang là dấu cộng và chưa bấm
      if (this.parentNodes[id]?.status) {
        if (!this.parentNodes[id]?.isClicked) {
          // nối tài khoản con vào list data, ngay sau tài khoản cha của nó
          this.isLoadingPage = true;
          const res = await AccountService.getChildren(id);
          this.isLoadingPage = false;
          this.parentNodes = { ...this.parentNodes, ...this.getListParent(res.Data) };
          const children = [...res.Data];
          this.parentNodes[id].isClicked = true;
          this.data.splice(index + 1, 0, ...children);
        }
        // cập nhật trạng thái hiển thị con và nút bám
        this.parentNodes[id].status = false;
        this.updateStatusShowChildren(id, true);
      } else {
        this.parentNodes[id].status = true;
        this.updateStatusShowChildren(id, false);
      }
    },

    /**
     * Mô tả: lấy tên trạng thái
     * created by : ttanh (10-08-2023)
     */
    getStatus(row) {
      if (row.AccountStatus) {
        return this.$_MResource[this.$_LANG_CODE].accountPage.accountList.use;
      }
      return this.$_MResource[this.$_LANG_CODE].accountPage.accountList.stop;
    },
    /**
     * Mô tả:  lấy tên tính chất
     * created by : ttanh (10-08-2023)
     */
    getNatureName(row) {
      for (let i = 0; i < this.listAccountNature.length; ++i) {
        if (row.AccountNature == this.listAccountNature[i].AccountNatureId) {
          return this.listAccountNature[i].AccountNatureName;
        }
      }
      return "";
    },
    /**
     * Mô tả:  lấy những bản ghi là cha
     * created by : ttanh (10-08-2023)
     */
    getListParent(list, status = false) {
      const parentNodes = {};
      for (let i = 0; i < list?.length; ++i) {
        if (list[i].IsParent) {
          parentNodes[list[i].AccountId] = {
            status: !status,
            isClicked: status,
            showChildren: status,
            parentId: list[i].AccountParentId ? list[i].AccountParentId : null,
          };
        }
      }

      return parentNodes;
    },

    /**
     * Mô tả:  mở toast msg
     * created by : ttanh (11-08-2023)
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
     * Mô tả: đóng toast
     * created by : ttanh (11-08-2023)
     */
    closeToast() {
      window.clearTimeout(this.timeOutToast);
      this.isShowToast = false;
    },

    /**
     * Mô tả: xóa dòng
     * created by : ttanh (11-08-2023)
     */
    async deleteRow(id) {
      try {
        this.isLoadingPage = true;
        await AccountService.deleteObj(id);
        this.isLoadingPage = false;
        this.onShowToast(this.$_MResource[this.$_LANG_CODE].accountPage.accountList.deleteSuccess);
      } catch (e) {
        this.errors = { ...e };
        this.isShowErrorDialog = true;
      }
    },

    /**
     * Mô tả: tải lại
     * created by : ttanh (11-08-2023)
     */
    async reloadData(page = 1) {
      try {
        this.isLoadingPage = true;
        const res = await AccountService.getList(`?pageSize=${this.recordsPerPage}&pageIndex=${page}&isRoot=true`);
        this.isLoadingPage = false;
        this.querySearch = "";
        this.currentPage = page;
        this.data = [...res.Data];

        this.parentNodes = this.getListParent(this.data);
        this.totalRecord = res.TotalRecord;
        this.totalRoot = res.TotalRoot;
      } catch (e) {
        console.log(e);
      }
    },

    /**
     * Mô tả: mở form chi tiết
     * created by : ttanh (11-08-2023)
     */
    onShowDetailForm(mode, account) {
      this.isShowDetailForm = true;
      this.formMode = mode;
      this.account = account;
    },

    /**
     * Mô tả: đóng form chi tiết
     * created by : ttanh (11-08-2023)
     */
    onCloseDetailForm() {
      this.isShowDetailForm = false;
    },

    /**
     * Mô tả: lấy tài khoản theo tìm kiếm và mở rộng con
     * created by : ttanh (11-08-2023)
     */
    async getAccountAndExpand(pages, pageIndex, querySearch) {
      this.isLoadingPage = true;
      const res = await AccountService.getSortedAccount(pageIndex, pages, querySearch);
      this.isLoadingPage = false;
      this.totalRecord = res.TotalRecord;
      this.totalRoot = res.TotalRoot;
      this.parentNodes = this.getListParent([...res.Data], true);
      this.isClickedExpand = true;
      this.isOpenAll = true;
      return [...res.Data];
    },

    /**
     * Mô tả: mở rộng cong]
     * created by : ttanh (11-08-2023)
     */
    async toggleExpand() {
      if (!this.isOpenAll && !this.isClickedExpand) {
        this.isLoadingPage = true;
        const res = await AccountService.getExpandAccount(this.currentPage, this.recordsPerPage);
        this.isLoadingPage = false;
        this.data = [...res.Data];
        this.isClickedExpand = true;
        this.isOpenAll = true;
        this.parentNodes = this.getListParent(this.data, true);
      } else if (!this.isOpenAll && this.isClickedExpand) {
        this.isOpenAll = true;
        Object.keys(this.parentNodes).map((node) => {
          this.updateStatusShowChildren(node, true, false);
        });
      } else if (this.isOpenAll) {
        this.isOpenAll = false;
        Object.keys(this.parentNodes).map((node) => {
          this.updateStatusShowChildren(node, false, true);
        });
      }
    },
  },

  created() {
    AccountService.getList(`?pageSize=${this.recordsPerPage}&pageIndex=1&isRoot=true`).then((res) => {
      this.data = [...res.Data];

      this.parentNodes = this.getListParent(this.data);
      this.totalRecord = res.TotalRecord;
      this.totalRoot = res.TotalRoot;
    });
  },

  setup() {
    const isShowBoardValue = ref(false);
    const boardValue = ref(null);
    const contextMenu = ref(null);
    const isShowContextMenu = ref(false);

    /**
     * Mô tả: đóng context menu
     * created by : ttanh
     * created date: 12-08-2023
     */
    function onCloseContextMenu() {
      isShowContextMenu.value = false;
    }

    /**
     * Mô tả: đóng mở bảng chọn số bản ghi trên một trang
     * created by : ttanh
     * created date: 11-08-2023
     */
    function onToggleShowBoardValue() {
      isShowBoardValue.value = !isShowBoardValue.value;
      // iconUp?.value = !iconUp?.value;
    }

    /**
     * Mô tả: đóng board value
     * created by : ttanh
     * created date: 07-06-2023
     */
    function onCloseBoardValue() {
      isShowBoardValue.value = false;
      // iconUp?.value = false;
    }

    useClickOutSide(boardValue, onCloseBoardValue);
    useClickOutSide(contextMenu, onCloseContextMenu);

    return {
      boardValue,
      isShowBoardValue,
      onCloseBoardValue,
      onToggleShowBoardValue,
      onCloseContextMenu,
      isShowContextMenu,
    };
  },
};
</script>

<style>
.expand-btn {
  border: none;
  background-color: #fff;
  color: #0075c0;
  padding: 0 6px;
  cursor: pointer;
}

.hiddenRec {
  display: inline-block;
  width: 21px;
  height: 15px;
}

.ml--20 {
  margin-left: -20px;
}

.contextMenu-account {
  right: 56px;
}
</style>
