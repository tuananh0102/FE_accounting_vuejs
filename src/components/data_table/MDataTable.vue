<template>
  <div ref="tableContainer" class="table-container" id="m-data-table">
    <table class="main__table">
      <thead>
        <tr>
          <th class="col-checkbox" v-if="!customRow && header.length > 0">
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
            <p>{{ resource.functionHeader }}</p>
          </th>
        </tr>
      </thead>
      <tbody v-if="(data.length == 0 && header.length > 0 && !customRow) || (customRow && !hasRowTable)">
        <tr>
          <td :colspan="header.length + 2">{{ resource.noData }}</td>
        </tr>
      </tbody>
      <tbody v-if="!customRow && data.length > 0">
        <tr v-for="(item, index) in data" :key="item[idField]" :class="{ checked: checkRow()?.has(item[idField]) }">
          <td class="col-checkbox" :class="{ checked: checkRow()?.has(item[idField]) }">
            <input type="checkbox" :checked="checkRow()?.has(item[idField])" @click="() => checkRow(item[idField])" />
          </td>
          <td v-for="td in header" :key="td[idField]" :class="td.className" @dblclick="onDbClickRow($event, item)">
            <p class="text-overflow__ellipsis" :title="formatData(td.type, item[td.fieldName])">
              {{ formatData(td.type, item[td.fieldName]) }}
            </p>
          </td>

          <td class="align-center" :class="{ checked: checkRow()?.has(item[idField]) }" v-if="header.length > 0">
            <span class="table__function-name" @click="() => onDbClickRow($event, item)">Sửa</span>
            <div
              :ref="`btnDropDowns_${item[idField]}`"
              @click.stop="toggleContextMenu($event, index, item)"
              :style="{ border: currentIndexContextMenu === index && isShowContextMenu ? '1px solid #007aff' : null }"
              class="wrapper-icon"
            >
              <span class="dropdown-blue-icon"></span>
            </div>
          </td>
        </tr>
      </tbody>

      <tbody v-if="customRow">
        <slot></slot>
      </tbody>
    </table>
    <m-context-menu
      ref="contextMenu"
      v-if="isShowContextMenu"
      :onClose="onCloseContextMenu"
      :topPosition="contextMenuY"
      :index="currentIndexContextMenu"
      :onDuplicated="onDuplicated"
      :onShowDialog="onShowDialog"
    ></m-context-menu>
  </div>

  <m-dialog
    v-if="isShowDialog"
    @onCancel="() => onCancel()"
    @onSuccess="() => onSuccess(currentObjId)"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionDelete"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    >{{
      `${$_MResource[$_LANG_CODE].dialog.descQuestionDelete} <${data[currentIndexContextMenu][codeField]}>?`
    }}</m-dialog
  >
</template>

<script>
import formatData from "@/utils/formatData";

export default {
  name: "MDataTable",
  data() {
    return {
      isShowContextMenu: false,
      currentIndexContextMenu: -1,
      currentObjId: 0,
      contextMenuY: "",

      isShowDialog: false,
      resource: this.$_MResource[this.$_LANG_CODE].table,
    };
  },
  props: {
    customRow: {
      type: Boolean,
      default: false,
    },
    header: {
      type: Array,
      default: new Array(),
    },
    data: {
      type: Array,
      default: new Array(),
    },
    onShowToast: Function,
    onShowFailToast: Function,
    showLoading: Boolean,
    closeLoading: Boolean,
    decreaseTotalRecord: Function,
    reloadData: Function,
    onDuplicated: Function,
    checkRow: Function,
    deleteObj: Function,
    idField: String,
    codeField: String,
  },
  emits: ["onDbClickRow"],

  computed: {
    hasRowTable: function () {
      if (this.$slots.default) {
        return true;
      }
      return false;
    },
  },

  methods: {
    onShowDialog() {
      this.isShowDialog = true;
    },

    /**
     * Mô tả: đóng thông báo khi bấm cancle
     * created by : ttanh
     * created date: 29-05-2023
     */
    onCancel() {
      this.isShowDialog = false;
      this.onCloseContextMenu();
    },

    /**
     * Mô tả: thực hiện xóa khi bấm đồng ý
     * created by : ttanh
     * created date: 29-05-2023
     */
    async onSuccess(id) {
      try {
        this.isShowDialog = false;
        await this.deleteObj(id);

        this.onShowToast(this.$_MResource[this.$_LANG_CODE].dialog.successDeleteToastMsg);
        this.decreaseTotalRecord();
        this.reloadData();
        let isSelectedItem = this.checkRow().has(id);
        if (isSelectedItem) {
          this.checkRow(id);
        }
      } catch (e) {
        if (typeof e == "object" && Object.keys(e).includes("System"))
          this.onShowFailToast(this.$_MResource[this.$_LANG_CODE].dialog.failDeleteToastMsg);
      }
    },

    /**
     * Mô tả: kiểm tra toàn bộ hàng đã check chưa
     * created by : ttanh
     * created date: 25-06-2023
     */
    isAllChecked() {
      if (this.data && this.data.length > 0) {
        for (let i = 0; i < this.data.length; ++i) {
          if (this.data[i] && !this.checkRow()?.has(this.data[i][this.idField])) {
            return false;
          }
        }
        return true;
      }
      return false;
    },

    /**
     * Mô tả: check toàn bộ hàng
     * created by : ttanh
     * created date: 25-06-2023
     */
    checkAll() {
      if (this.isAllChecked()) {
        this.data.map((item) => {
          this.checkRow()?.delete(item[this.idField]);
        });
        return;
      }

      if (this.data && this.data.length > 0) {
        this.data.map((item) => {
          if (!this.checkRow().has(item[this.idField])) {
            this.checkRow(item[this.idField]);
          }
        });
      }
    },

    getBoundingClientRect() {
      const tableY = this.$refs.tableContainer.getBoundingClientRect().y;
      return { y: tableY };
    },

    /**
     * Mô tả: mở context-menu
     * created by : ttanh
     * created date: 29-05-2023
     */
    toggleContextMenu($event, index, item) {
      // const tableY = this.$refs.tableContainer.getBoundingClientRect().y;
      let tableY = 188;
      let str = `btnDropDowns_${item[this.idField]}`;

      const btnY = this.$refs[str][0].getBoundingClientRect().y;

      let totalY = btnY - tableY;

      this.contextMenuY = totalY + 65 + "px";

      if (totalY > 400) {
        totalY -= 50;
        this.contextMenuY = totalY + "px";
      }
      if (!this.isShowContextMenu) {
        this.currentIndexContextMenu = index;

        this.currentObjId = item[this.idField];
        this.isShowContextMenu = !this.isShowContextMenu;
      } else {
        if (this.currentIndexContextMenu === index) {
          this.isShowContextMenu = !this.isShowContextMenu;
        } else {
          this.currentIndexContextMenu = index;
          this.currentObjId = item[this.idField];
        }
      }
    },

    /**
     * Mô tả: đóng context menu
     * created by : ttanh
     * created date: 29-05-2023
     */
    onCloseContextMenu() {
      this.isShowContextMenu = false;
    },
    /**
     * Mô tả: định dạng lại dữ liệu
     * created by : ttanh
     * created date: 29-05-2023
     */
    formatData,

    /**
     * Mô tả: hiện thị form chi tiết nhân viên khi bấm dbclick vào 1 hàng
     * created by : ttanh
     * created date: 29-05-2023
     */
    onDbClickRow($event, item) {
      this.$emit("onDbClickRow", item);
    },
  },
};
</script>

<style>
.checked {
  background-color: #e6f2ff !important;
}
</style>
