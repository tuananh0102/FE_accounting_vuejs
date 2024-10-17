<template>
  <div class="combobox single-combobox">
    <span
      :class="[
        {
          'wrapper-input': true,
          'focus-green': true,
          disable: disable,
          invalid: isBorderRed && isInvalid,
          ...inputClass,
        },
      ]"
    >
      <input
        :maxlength="100"
        :readonly="readonly"
        ref="input"
        class="base-input"
        :type="type"
        :placeholder="placeholder"
        :title="title ? title : ''"
        :disabled="disable"
        :value="!disable || displayValueInput ? dupObj[displayField] : ''"
        @input="($event) => onChange($event)"
        @keydown="onEventKeyInput"
      />

      <span class="wrapper-icon plr-8" v-if="urlIcon ? true : false" @click.stop="toggleBoardValue">
        <!-- <img src="@/assets/icon/magnifying-glass-solid.svg" alt=""> -->
        <span class="combobox__icon-down"></span>
      </span>
    </span>

    <div class="board-value" v-show="isshowBoardValue && cols.length < 2 && !disable">
      <!-- <span class="board-value__title"
        >- Chọn giá trị -
        <span class="wrapper-icon"
          ><img class="combobox__checked-icon" src="@/assets/icon/check-solid.svg" alt="icon-check" /></span
      ></span> -->
      <p v-if="listSelections.length <= 0 || !listSelections[0]" class="notfound">
        {{ $_MResource[$_LANG_CODE].warning.notFound }}
      </p>
      <template v-for="(selection, index) in listSelections" :key="index">
        <span
          ref="listValues"
          v-if="selection"
          @click="onSelect($event, index)"
          :class="[{ selected: currentIndexValue == index }]"
          class="board-value__value"
          >{{ selection[cols[0]?.fieldList] }}
          <!-- <span class="wrapper-icon" v-if="selectedItem[idField] == selection[idField]"
            ><img class="combobox__checked-icon" src="@/assets/icon/check-solid.svg" alt="icon-check"
          /></span> -->
        </span>
      </template>
    </div>

    <div
      class="list-selection"
      v-if="isshowBoardValue && cols && cols.length > 1 && !disable"
      :style="{ width: `${widthBoardValue}%` }"
    >
      <p v-if="listSelections.length <= 0" class="notfound">{{ $_MResource[$_LANG_CODE].warning.notFound }}</p>

      <div class="row-header" v-if="listSelections.length > 0">
        <div
          v-for="col in cols"
          class="table-selection__title medium pl-12"
          :key="col.key"
          :style="{ width: `${col.width}%` }"
        >
          {{ col.name }}
        </div>
      </div>

      <div class="table__values" ref="tableValues" @scroll="handleScroll">
        <span
          v-for="(selection, index) in listSelections"
          :ref="`listValues${index}`"
          @click="onSelect($event, index)"
          :class="[{ selected: currentIndexValue == index, medium: selection?.IsParent && treeField }]"
          class="board-value__value mulitple-col pl-12"
          :key="index"
        >
          <span
            class="text-overflow__ellipsis"
            v-for="(col, i) in cols"
            :key="col.key"
            :style="{
              paddingLeft: treeField && i == 0 ? `${(selection[treeField] - 1) * 8 + 12}px` : '12px',
              width: `${col.width}%`,
              maxWidth: `${col.width}%`,
            }"
          >
            {{ selection[col.fieldList] }}
          </span>
          <MLoading v-if="isLoading"></MLoading>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import useClickOutSide from "@/composables/useClickOutSide.js";
import { ref } from "vue";
import { vFocus } from "@/directives/vFocus";
import MLoading from "@/components/loading/MLoading.vue";

export default {
  name: "MInput",
  data() {
    return {
      currentIndexValue: 0,
      dupObj: {},
      selectedItem: {},
      isReloadList: true,
      isBorderRed: true,
      currentSearch: "",
    };
  },
  components: { MLoading },
  props: {
    title: String,
    type: String,
    placeholder: String,
    className: String,
    urlIcon: String,
    modelValue: String,
    isFocus: {
      type: Boolean,
      default: false,
    },
    twoColBoard: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    listSelections: Array,
    inputClass: Object,
    data: Object,
    displayField: String,
    reloadList: Function,
    widthBoardValue: {
      type: Number,
      default: 100,
    },
    cols: Array,
    idFieldList: String,
    idFieldObj: String,
    treeField: String,
    isInvalid: {
      type: Boolean,
      default: false,
    },
    listenObj: Object,
    displayValueInput: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "input",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 100,
    },
  },
  directives: {
    focus: vFocus,
  },
  created() {
    this.dupObj = this.data;
  },
  watch: {
    // listSelections: function () {
    //   this.currentIndexValue = 0;
    // },
    data: function (newValue) {
      this.dupObj = newValue;
    },
    listenObj: function (newValue) {
      if (Object.keys(newValue).length == 0) {
        this.isBorderRed = false;
      } else {
        this.isBorderRed = true;
      }
    },
  },
  methods: {
    /**
     * Mô tả: focus vào input
     * created by : ttanh
     * created date: 27-06-2023
     */
    focus() {
      this.$refs.input.focus();
    },
    /** đóng board value
     * Mô tả:
     * created by : ttanh
     * created date: 04-06-2023
     */
    showBoardValue() {
      this.isshowBoardValue = true;
    },
    handleScroll() {
      const cbb = this.$refs.tableValues;
      const remainingSpace = cbb?.scrollHeight - (cbb?.scrollTop + cbb?.clientHeight);
      // Kiểm tra xem đã scroll đến cuối combobox chưa
      if (remainingSpace <= 10 && remainingSpace > 0) {
        // Gọi API để lấy thêm dữ liệu
        this.$emit("handleLazyLoad", this.currentSearch);
      }
    },
    /**
     * Mô tả: xử lý sự kiện nút lên xuống
     * created by : ttanh
     * created date: 05-06-2023
     */
    async onEventKeyInput($event) {
      const maxLength = this.listSelections.length;

      if (maxLength < 0) {
        return;
      }
      if ($event.keyCode == this.$_MEnum.Key.arrowDown) {
        if (!this.isshowBoardValue) {
          // await this.reloadList();
          // for (let i = 0; i < this.listSelections.length; ++i) {
          //   if (this.listSelections[i][this.idFieldList] == this.dupObj[this.idFieldObj]) {
          //     let tmp = this.listSelections;
          //     let itemTmp = this.listSelections[i];
          //     tmp.splice(i, 1);
          //     tmp.unshift(itemTmp);
          //     break;
          //   }
          // }
          let tmp = this.listSelections;
          let tmpItem = this.listSelections[this.currentIndexValue];
          tmp.splice(this.currentIndexValue, 1);
          tmp.unshift(tmpItem);
          // this.isReloadList = false;
          this.currentIndexValue = 0;
          this.showBoardValue();
          this.dupObj[this.idFieldObj] = this.listSelections[this.currentIndexValue]
            ? this.listSelections[this.currentIndexValue][this.idFieldList]
            : null;
          this.cols.map((item) => {
            this.dupObj[item.fieldObj] = this.listSelections[this.currentIndexValue]
              ? this.listSelections[this.currentIndexValue][item.fieldList]
              : null;
          });
          // this.currentIndexValue = 0;
        } else {
          this.handleScroll();
          if (this.currentIndexValue < maxLength - 1) {
            ++this.currentIndexValue;
            this.dupObj[this.idFieldObj] = this.listSelections[this.currentIndexValue]
              ? this.listSelections[this.currentIndexValue][this.idFieldList]
              : null;
            this.cols.map((item) => {
              this.dupObj[item.fieldObj] = this.listSelections[this.currentIndexValue]
                ? this.listSelections[this.currentIndexValue][item.fieldList]
                : null;
            });
          }
        }
      } else if ($event.keyCode == this.$_MEnum.Key.arrowUp) {
        if (this.isshowBoardValue) {
          if (this.currentIndexValue > 0) {
            --this.currentIndexValue;
            this.dupObj[this.idFieldObj] = this.listSelections[this.currentIndexValue]
              ? this.listSelections[this.currentIndexValue][this.idFieldList]
              : null;
            this.cols.map((item) => {
              this.dupObj[item.fieldObj] = this.listSelections[this.currentIndexValue]
                ? this.listSelections[this.currentIndexValue][item.fieldList]
                : null;
            });
          }
        }
      } else if ($event.keyCode == this.$_MEnum.Key.enter) {
        if (this.isshowBoardValue) {
          this.onSelect($event, this.currentIndexValue);
        }
      } else if ($event.keyCode == this.$_MEnum.Key.tab) {
        if (this.isshowBoardValue) {
          this.onSelect($event, this.currentIndexValue);
        }
      }
      this.scrollToItem(this.currentIndexValue);
    },
    /**
     * Mô tả: thay đổi value của input khi nhập
     * created by : ttanh
     * created date: 05-06-2023
     */
    async onChange($event) {
      this.dupObj[this.displayField] = $event.target.value;
      this.isBorderRed = false;
      this.dupObj[this.idFieldObj] = null;
      this.currentSearch = $event.target.value;
      await this.reloadList($event.target.value);
      this.isReloadList = true;
      this.currentIndexValue = 0;
      this.showBoardValue();
    },
    /**
     * Mô tả: di chuyển scollbar theo item
     * created by : ttanh
     * created date: 05-06-2023
     */
    scrollToItem(index) {
      this.$nextTick(() => {
        // this.$refs.tableValues.scrollTop = 32 * index;
        if (this.$refs.listValues) {
          const element = this.$refs[`listValues${index}`];
          if (element) {
            element[0]?.scrollIntoView();
          }
        }
      });
    },
    /**
     * Mô tả: xử lý sự kiện  chọn
     * created by : ttanh
     * created date: 05-06-2023
     */
    onSelect($event, index) {
      this.isBorderRed = false;
      this.closeBoardValue();
      this.currentIndexValue = index;
      this.selectedItem = this.listSelections[index];
      this.isReloadList = true;
      this.dupObj[this.idFieldObj] = this.listSelections[index][this.idFieldList];
      this.cols.map((item) => {
        this.dupObj[item.fieldObj] = this.listSelections[index][item.fieldList];
      });
    },
  },
  emits: ["handleLazyLoad"],
  setup() {
    const isshowBoardValue = ref(false);
    const input = ref(null);
    /**
     * Mô tả: mở board value
     * created by : ttanh
     * created date: 04-06-2023
     */
    function closeBoardValue() {
      isshowBoardValue.value = false;
    }
    /**
     * Mô tả: toggle boardvalue
     * created by : ttanh
     * created date: 05-06-2023
     */
    function toggleBoardValue() {
      isshowBoardValue.value = !isshowBoardValue.value;
    }
    useClickOutSide(input, closeBoardValue);
    return { isshowBoardValue, closeBoardValue, toggleBoardValue, input };
  },
};
</script>

<style>
/* .wrapper-icon {
  border-left: 1px solid #ccc;
} */
.notfound {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: #ccc;
}

.selected {
  background-color: #f2f2f2;
  color: #50b83c;
}

.disable {
  background-color: #eff0f2;
  cursor: alias;
}

.disable input {
  background-color: #eff0f2;
}

.disable:hover input {
  background-color: #eff0f2;
}

.disable .wrapper-icon {
  cursor: default;
}
</style>
