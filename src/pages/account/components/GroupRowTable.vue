<template>
  <template v-for="(row, indexRow) in sortedData" :key="row[props.idSelectionField]">
    <tr
      :class="{ medium: row.IsParent }"
      v-if="row.IsRoot || (!parentNodes[row.AccountParentId].status && parentNodes[row.AccountParentId].showChildren)"
    >
      <template v-for="key in headerFields" :key="key">
        <td
          :style="{ paddingLeft: key == props.firstCol ? `${(row.Grade - 1) * 20}px` : '0px' }"
          @dblclick="onDbClickRow(row)"
        >
          <div class="display-flex pl-16">
            <div class="hiddenRec" v-if="key == props.firstCol && !row.IsParent"></div>
            <span
              @dblclick.stop
              class="wrapper-icon mr-6"
              v-if="key == props.firstCol && row.IsParent"
              @click.stop="() => toggleShowChildren(row[idName])"
            >
              <span
                :class="{
                  'icon-square-plus': parentNodes[row[idName]]?.status,
                  'icon-square-minus': !parentNodes[row[idName]]?.status,
                }"
              ></span>
            </span>

            {{ key == "AccountNature" ? getNatureName(row) : key == "AccountStatus" ? getStatus(row) : row[key] }}
          </div>
        </td>
      </template>
      <td class="align-center">
        <span class="table__function-name" @click.prevent="() => onDbClickRow(row)">Sửa</span>
        <div
          :ref="`firstRow_${indexRow}`"
          @click.stop="toggleContextMenu($event, indexRow, row)"
          :style="{ border: currentIndexContextMenu === indexRow && isShowContextMenu ? '1px solid #007aff' : null }"
          class="wrapper-icon"
        >
          <span class="dropdown-blue-icon"></span>
        </div>
      </td>
    </tr>
  </template>

  <Teleport to="#m-data-table">
    <m-context-menu
      ref="contextMenu"
      v-if="isShowContextMenu"
      :onClose="onCloseContextMenu"
      :topPosition="contextMenuY"
      :index="currentIndexContextMenu"
      :onShowDialog="onShowDialog"
    ></m-context-menu>
  </Teleport>

  <m-dialog
    v-if="isShowDialog"
    @onCancel="() => onCancel()"
    @onSuccess="() => onSuccess(currentObjId)"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionDelete"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    >{{
      `${$_MResource[$_LANG_CODE].dialog.descQuestionDelete} <${data[currentIndexContextMenu]?.AccountCode}>?`
    }}</m-dialog
  >

  <m-dialog
    v-if="isShowErrorDialog"
    @onCancel="() => onCloseWarningDialog()"
    @onSuccess="() => onCloseWarningDialog()"
    title="Không thể xóa"
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
</template>

<script setup>
import { ref, defineProps, onBeforeMount, watch, defineEmits } from "vue";

const isShowContextMenu = ref(false);
const isShowDialog = ref(false);
const contextMenuY = ref("");
const firstRow_0 = ref(null);
const currentIndexContextMenu = ref(0);
const currentObjId = ref();

const errors = ref();

const headerFields = ref(null);

const parentNodes = ref(new Object());

const sortedData = ref(null);

const currentId = ref(0);

const isShowErrorDialog = ref(false);

const emit = defineEmits(["dbClickRow"]);

const props = defineProps({
  data: {
    type: Array,
    default: new Array(),
  },
  idName: String,
  firstCol: String,
  header: Array,
  addChildren: Function,
  tableContainer: null,
  deleteRow: Function,
  reloadData: Function,

  isOpenAll: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.data,
  () => {
    console.log("ref");
    if (!props.isOpenAll) {
      parentNodes.value = {};
      sortedData.value = [...props.data];
      sortedData.value.map((item) => {
        if (item.IsParent) {
          parentNodes.value[item[props.idName]] = {
            status: true,
            isClicked: false,
            showChildren: false,
            parentId: item.ParentAccountId ? item.ParentAccountId : null,
          };
        }
      });
    }
  }
);

watch(
  () => props.data.length,
  (newValue, oldValue) => {
    console.log(`new: ${newValue}, old: ${oldValue}`);
    if (!props.isOpenAll && newValue > 1) {
      for (let i = oldValue; i < newValue; ++i) {
        if (props.data[i].IsParent) {
          parentNodes.value[props.data[i].AccountId] = {
            status: true,
            isClicked: false,
            showChildren: false,
            parentId: props.data[i].AccountParentId,
          };
        }
      }

      let started = sortedData.value.length;

      let parentIndex = sortedData.value.findIndex((item) => item.AccountId == currentId.value);

      sortedData.value = sortedData.value
        .slice(0, parentIndex + 1)
        .concat(props.data.slice(started), sortedData.value.slice(parentIndex + 1));
    } else if (!props.isOpenAll && newValue <= 1) {
      console.log("reset");
      console.log(props.data.length);
      parentNodes.value = {};
      sortedData.value = [...props.data];
      sortedData.value.map((item) => {
        if (item.IsParent) {
          parentNodes.value[item[props.idName]] = {
            status: true,
            isClicked: false,
            showChildren: false,
            parentId: item.ParentAccountId ? item.ParentAccountId : null,
          };
        }
      });
    }
  }
);

watch(
  () => props.isOpenAll,
  (newValue) => {
    if (newValue) {
      if (sortedData.value.length != props.data.length) {
        sortedData.value = [...props.data];
        sortedData.value.map((item) => {
          if (item.IsParent) {
            parentNodes.value[item[props.idName]] = {
              status: true,
              isClicked: true,
              showChildren: true,
              parentId: !item.IsRoot ? item.AccountParentId : null,
            };
          }
        });
      }

      Object.keys(parentNodes.value).map((key) => {
        parentNodes.value[key].showChildren = true;
        parentNodes.value[key].isClicked = true;
        parentNodes.value[key].status = false;
      });
    } else {
      Object.keys(parentNodes.value).map((key) => {
        parentNodes.value[key].showChildren = false;
        parentNodes.value[key].status = true;
      });
    }
  }
);

const listAccountNature = [
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
];

const getNatureName = (row) => {
  for (let i = 0; i < listAccountNature.length; ++i) {
    if (row.AccountNature == listAccountNature[i].AccountNatureId) {
      return listAccountNature[i].AccountNatureName;
    }
  }
  return "";
};

const onCloseWarningDialog = () => {
  isShowErrorDialog.value = false;
};

const getStatus = (row) => {
  if (row.AccountStatus) {
    return "Sử dụng";
  }
  return "Ngừng sử dụng";
};

const onCancel = () => {
  isShowDialog.value = false;
};

const onShowDialog = () => {
  isShowDialog.value = true;
};

const onSuccess = async (id) => {
  try {
    await props.deleteRow(id);
    await props.reloadData();
    isShowDialog.value = false;
  } catch (e) {
    isShowDialog.value = false;

    isShowErrorDialog.value = true;
    errors.value = { ...e };
  }
};

const onDbClickRow = (item) => {
  emit("dbClickRow", item);
};

const updateStatusShowChildren = (parentId, status) => {
  if (parentNodes.value[parentId]) {
    parentNodes.value[parentId].showChildren = status;

    Object.keys(parentNodes.value).map((key) => {
      if (parentNodes.value[key].parentId == parentId) {
        updateStatusShowChildren(key, status);
      }
    });
  }
};

const toggleShowChildren = (id) => {
  if (parentNodes.value[id].status) {
    if (!parentNodes.value[id].isClicked) {
      parentNodes.value[id].isClicked = true;
      props.addChildren(id);

      currentId.value = id;
    }

    parentNodes.value[id].status = false;
    updateStatusShowChildren(id, true);
  } else {
    parentNodes.value[id].status = true;
    updateStatusShowChildren(id, false);
  }
};

const onCloseContextMenu = () => {
  isShowContextMenu.value = false;
};

const toggleContextMenu = ($event, index, item) => {
  // console.log(item);
  const tableY = props.tableContainer.getBoundingClientRect().y;

  // const btnY =firstRow.value.getBoundingClientRect().y

  const firstRowY = firstRow_0.value[0].getBoundingClientRect().y;
  const btnY = firstRowY + index * 48;

  let totalY = btnY - tableY;

  contextMenuY.value = totalY + 69 + "px";

  if (totalY > 400) {
    totalY -= 80;
    contextMenuY.value = totalY + "px";
  }
  currentObjId.value = item.AccountId;

  if (!isShowContextMenu.value) {
    currentIndexContextMenu.value = index;

    currentObjId.value = item.AccountId;
    console.log(item);
    isShowContextMenu.value = !isShowContextMenu.value;
  } else {
    if (currentIndexContextMenu.value === index) {
      isShowContextMenu.value = !isShowContextMenu.value;
    } else {
      currentIndexContextMenu.value = index;
      currentObjId.value = item.AccountId;
      console.log(item);
    }
  }
};
onBeforeMount(() => {
  headerFields.value = props.header.map((item) => item.fieldName);

  sortedData.value = [...props.data];

  sortedData.value.map((item) => {
    if (item.IsParent) {
      parentNodes.value[item[props.idName]] = {
        status: true,
        isClicked: false,
        showChildren: false,
        parentId: item.ParentAccountId ? item.ParentAccountId : null,
      };
    }
  });
});
</script>
<style></style>
