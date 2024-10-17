<template>
  <div class="combobx mul-combobox" ref="mulCombobox">
    <div class="wrapper-combobox-input">
      <span :class="[{ 'wrapper-input': true }]">
        <span v-for="(item, index) in dupObj[props.listDisplayFieldName]" :key="item" class="wrapper-selected-item">
          <span class="selected-item"
            >{{ item }}
            <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon" @click="onRemove(item, index)">
              <span class="icon-close--small"></span> </span
          ></span>
        </span>
        <input
          ref="input"
          class="base-input"
          :placeholder="placeholder"
          :title="title"
          :value="inputType"
          @input="($event) => onChange($event.target.value)"
          @keydown="onEventKeyInput"
        />
      </span>

      <span :title="$_MResource[$_LANG_CODE].titleIcon.excel" class="wrapper-icon" @click="toggleListSelection">
        <span class="combobox__icon-down" :style="{ transform: `rotate(${degIcon}deg)` }"></span>
      </span>
    </div>

    <div class="list-selection" v-show="isShowListSelection" :style="{ width: `${width}%` }">
      <div class="table__title">
        <div v-for="header in headers" :key="header.fieldName" :style="{ width: `${header.width - 2}%` }">
          {{ header.displayName }}
        </div>
        <span
          class="wrapper-icon"
          style="
             {
              width: 4%;
            }
          "
        ></span>
      </div>
      <!-- <p v-if="listSelections.length <= 0" class="notfound">{{ $_MResource[$_LANG_CODE].warning.notFound }}</p> -->
      <div class="table__values" ref="listSelection">
        <div
          v-for="(selection, index) in data"
          @click="onSelect(index)"
          class="table__value"
          :key="index"
          :class="{ selected: currentIndexValue == index }"
        >
          <span v-for="header in headers" :key="header.fieldName" :style="{ width: `${header.width - 2}%` }">
            <p>{{ selection[header.fieldName] }}</p>
          </span>
          <span
            class="wrapper-icon"
            style="
               {
                width: 4%;
              }
            "
            ><img
              v-if="dupObj[props.listDisplayFieldName]?.includes(selection[props.headers[0].fieldName])"
              class="combobox__checked-icon"
              src="@/assets/icon/check-solid.svg"
              alt="icon-check"
          /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
import useClickOutSide from "@/composables/useClickOutSide";
import MEnum from "@/scripts/enum";

const mulCombobox = ref(null);

const inputType = ref("");

const isShowListSelection = ref(false);
const degIcon = ref(0);

const dupObj = ref(new Array());
const currentIndexValue = ref(0);

const listSelection = ref(null);

const props = defineProps({
  headers: {
    type: Array,
    default: new Array(),
  },
  width: {
    type: Number,
    default: 100,
  },
  data: {
    type: Array,
    default: new Array(),
  },
  obj: {
    type: Object,
    default: new Object(),
  },
  reloadList: {
    type: Function,
    default: () => {},
  },
  listDisplayFieldName: String,
  listIdName: String,
  idField: String,
  title: String,
  placeholder: String,
});

const emit = defineEmits(["onChangeInput"]);

/**
 * Mô tả: di chuyển scollbar theo item
 * created by : ttanh
 * created date: 05-06-2023
 */
const scrollToItem = (index) => {
  listSelection.value.scrollTop = 32 * index;
};

/**
 * Mô tả: xử lý sự kiện nút lên xuống
 * created by : ttanh
 * created date: 14-08-2023
 */

const onEventKeyInput = async ($event) => {
  const maxLength = props.data.length;
  if (maxLength < 0) {
    return;
  }

  if ($event.keyCode == MEnum.Key.arrowDown) {
    if (!isShowListSelection.value) {
      isShowListSelection.value = true;

      // this.currentIndexValue = 0;
    } else {
      if (currentIndexValue.value < maxLength - 1) {
        ++currentIndexValue.value;
      }
    }
  } else if ($event.keyCode == MEnum.Key.arrowUp) {
    if (isShowListSelection.value) {
      if (currentIndexValue.value > 0) {
        --currentIndexValue.value;
      }
    }
  } else if ($event.keyCode == MEnum.Key.enter) {
    onSelect(currentIndexValue.value);
  } else if ($event.keyCode == MEnum.Key.tab) {
    onSelect(currentIndexValue.value);
    isShowListSelection.value = false;
  } else if ($event.keyCode == MEnum.Key.backSpace) {
    if (dupObj.value[props.listIdName]?.length >= 0) {
      dupObj.value[props.listIdName].splice(dupObj.value[props.listIdName]?.length - 1, 1);
      dupObj.value[props.listDisplayFieldName].splice(dupObj.value[props.listDisplayFieldName]?.length - 1, 1);
    }
  }

  scrollToItem(currentIndexValue.value);
};

/**
 * Mô tả: sự kiện khi nhập
 * created by : ttanh (29-07-2023)
 */
const onChange = (input) => {
  inputType.value = input;
  isShowListSelection.value = true;
  currentIndexValue.value = 0;
  emit("onChangeInput", input);
};

/**
 * Mô tả: đóng mở bảng lựa chọn
 * created by : ttanh (29-07-2023)
 */
const toggleListSelection = () => {
  if (!isShowListSelection.value) {
    isShowListSelection.value = true;
    emit("onChangeInput", "");
    degIcon.value = 180;
  } else {
    isShowListSelection.value = false;
    degIcon.value = 0;
  }
};

const closeListSelection = () => {
  isShowListSelection.value = false;
  degIcon.value = 0;
};

/**
 * Mô tả: chọn một dòng
 * created by : ttanh (29-07-2023)
 */
const onSelect = (index) => {
  inputType.value = "";
  if (!dupObj.value[props.listIdName]) {
    dupObj.value[props.listIdName] = [];
  }
  if (!dupObj.value[props.listDisplayFieldName]) {
    dupObj.value[props.listDisplayFieldName] = [];
  }
  if (!dupObj.value[props.listIdName].includes(props.data[index][props.idField])) {
    dupObj.value[props.listDisplayFieldName].push(props.data[index][props.headers[0].fieldName]);
    dupObj.value[props.listIdName].push(props.data[index][props.idField]);
  } else {
    dupObj.value[props.listDisplayFieldName] = dupObj.value[props.listDisplayFieldName].filter(
      (item) => item != props.data[index][props.headers[0].fieldName]
    );
    dupObj.value[props.listIdName] = dupObj.value[props.listIdName].filter(
      (item) => item != props.data[index][props.idField]
    );
  }
};

const onRemove = (removeItem, index) => {
  dupObj.value[props.listDisplayFieldName] = dupObj.value[props.listDisplayFieldName].filter(
    (item) => item != removeItem
  );
  dupObj.value[props.listIdName].splice(index, 1);
};

watch(
  () => props.obj,
  (newValue) => {
    dupObj.value = newValue;
  }
);

// watch(
//   () => props.data,
//   (newValue) => {
//     for (let i = 0; i < newValue?.length; ++i) {
//       refs[`listValues${i}`] = ref(null);
//     }
//   }
// );

useClickOutSide(mulCombobox, closeListSelection);

onMounted(() => {
  dupObj.value = props.obj;
});
</script>

<style></style>
