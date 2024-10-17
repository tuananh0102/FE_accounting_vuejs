import { defineStore } from "pinia";
import useForm from "@/composables/useForm";
import { ref, watch } from "vue";

import ProviderService from "@/services/ProviderService";
import EmployeeService from "@/services/EmployeeService";
import MResource from "@/scripts/resource";

// import { useToast } from "./useToast";

export const useProvider = defineStore("provider", () => {
  const { isShowForm, formMode, inputObj, selectedObj, closeForm, openForm } = useForm();
  // const { statusToast, msg, isShow } = storeToRefs(useToast);
  // const { onOpen, onClose } = useToast();

  // const toast = useToast();

  const data = ref();
  const errors = ref(new Object());
  const totalRecord = ref(0);
  const recordsPerPage = ref(20);
  const currentPage = ref(1);
  const querySearch = ref("");
  const timeOutSearch = ref(null);
  const employeeList = ref([]);

  const msg = ref("");
  const isShow = ref(false);
  const statusToast = ref();
  const timeOut = ref(null);

  const isLoadingPage = ref(false);
  const isLoadingCombobox = ref(false);

  const orderRefs = {
    ProviderCode: ref(null),
    ProviderName: ref(null),
  };

  const isShowDialog = ref(false);

  /**
   * Mô tả: mở thông báo
   * created by : ttanh (17-08-2023)
   */
  function openDialog() {
    isShowDialog.value = true;
  }

  /**
   * Mô tả: đóng thông báo
   * created by : ttanh (17-08-2023)
   */
  function closeDialog() {
    isShowDialog.value = false;
  }

  /**
   * Mô tả: mở toast msg
   * created by : ttanh (17-08-2023)
   */
  function onClose() {
    isShow.value = false;
    window.clearTimeout(timeOut.value);
  }

  /**
   * Mô tả: đóng toast msg
   * created by : ttanh (17-08-2023)
   */
  function onOpen(message, status) {
    msg.value = message;
    statusToast.value = status;
    isShow.value = true;

    timeOut.value = setTimeout(() => {
      isShow.value = false;
    }, 3000);
  }

  watch(querySearch, (newValue) => {
    window.clearTimeout(timeOutSearch.value);
    timeOutSearch.value = setTimeout(async () => {
      isLoadingPage.value = true;
      await getList(recordsPerPage.value, 1, newValue);
      isLoadingPage.value = false;
    }, 500);
  });

  // watch(
  //   () => inputObj.value?.FullName,
  //   () => {
  //     window.clearTimeout(timeOutSearch);
  //     timeOutSearch.value = setTimeout(async () => {
  //       const query = `?querySearch=${inputObj.value?.FullName}&recordsPerPage=${20}&page=${1}`;
  //       const res = await EmployeeService.getList(query);
  //       employeeList.value = [...res.Data];
  //     }, 300);
  //   }
  // );

  const currentIndexPageEmployee = ref(1);
  /**
   * Mô tả: xử lý lazy loading
   * created by : ttanh (17-08-2023)
   */
  const handleLazyLoadEmployee = async (querySearch) => {
    if (currentIndexPageEmployee.value == 1) {
      ++currentIndexPageEmployee.value;
    }
    let query = `?recordsPerPage=${20}&page=${currentIndexPageEmployee.value}`;
    if (querySearch) {
      query += `&querySearch=${querySearch}`;
    }
    isLoadingCombobox.value = true;
    const res = await EmployeeService.getList(query);
    isLoadingCombobox.value = false;

    if (res.Data?.length > 0) {
      employeeList.value = [...employeeList.value, ...res.Data];
      ++currentIndexPageEmployee.value;
    }
  };

  /**
   * Mô tả: tìm kiếm nhân viên
   * created by : ttanh (17-08-2023)
   */
  const searchEmployee = async (querySearch) => {
    currentIndexPageEmployee.value = 1;
    let query = `?recordsPerPage=${20}&page=${currentIndexPageEmployee.value}`;
    let res;
    if (querySearch) {
      window.clearTimeout(timeOutSearch.value);
      timeOutSearch.value = setTimeout(async () => {
        query = `?recordsPerPage=${20}&page=${1}&querySearch=${querySearch}`;
        isLoadingCombobox.value = true;
        res = await EmployeeService.getList(query);
        isLoadingCombobox.value = false;

        employeeList.value = [...res.Data];
      }, 300);
    } else {
      query = `?recordsPerPage=${20}&page=${1}`;
      isLoadingCombobox.value = true;

      res = await EmployeeService.getList(query);
      isLoadingCombobox.value = false;

      employeeList.value = [...res.Data];
    }
  };

  watch(isShowForm, (newValue) => {
    if (!newValue) {
      errors.value = {};
    }
  });

  /**
   * Mô tả:  lấy danh sách nhà cung cấp
   * created by : ttanh (17-08-2023)
   */
  async function getList(pageSize, pageIndex, querySearch) {
    try {
      let query = `?pageSize=${pageSize}&pageIndex=${pageIndex}`;
      if (querySearch) {
        query += `&querySearch=${querySearch}`;
      }
      isLoadingPage.value = true;
      const res = await ProviderService.getList(query);
      isLoadingPage.value = false;

      data.value = [...res.Data];
      totalRecord.value = res.TotalRecord;
    } catch (e) {
      isLoadingPage.value = false;
      errors.value = { ...e };
    }
  }

  /**
   * Mô tả: xóa nhà cung cấp
   * created by : ttanh (17-08-2023)
   */
  async function deleteObj(objId) {
    try {
      isLoadingPage.value = true;
      await ProviderService.deleteObj(objId);
      --totalRecord.value;
      await getList(recordsPerPage.value, currentPage.value, querySearch.value);
      isLoadingPage.value = false;

      onOpen(MResource.vi.accountPage.accountList.deleteSuccess, MResource.vi.dialog.statusSuccess);
    } catch (e) {
      errors.value = { ...e };
      isLoadingPage.value = false;

      openDialog();
    }
  }

  /**
   * Mô tả: xóa nhiều bản ghi
   * created by : ttanh (17-08-2023)
   */
  async function deleteMultipleObj(ids) {
    try {
      isLoadingPage.value = true;

      await ProviderService.deleteMultipleObj(ids);
      await getList(recordsPerPage.value, currentPage.value, querySearch.value);
      onOpen(MResource.vi.accountPage.accountList.deleteSuccess, MResource.vi.dialog.statusSuccess);

      isLoadingPage.value = false;

      closeDialog();
    } catch (e) {
      isLoadingPage.value = false;

      errors.value = { ...e };
      openDialog();
    }
  }

  /**
   * Mô tả: thêm mới nhà cung cấp
   * created by : ttanh (17-08-2023)
   */
  async function createObj(newObj) {
    try {
      if (Object.keys(errors.value).length > 0) {
        openDialog();

        return;
      }
      isLoadingPage.value = true;
      await ProviderService.createObj(newObj);
      await getList(recordsPerPage.value, currentPage.value, querySearch.value);
      const res = await ProviderService.getNewcode();
      isLoadingPage.value = false;

      selectedObj.value = { ProviderCode: res.Data, ProviderIsPrivate: false };
      inputObj.value = { ProviderCode: res.Data, ProviderIsPrivate: false };
      onOpen(MResource.vi.accountPage.accountDetail.addSuccess, MResource.vi.dialog.statusSuccess);
      errors.value = {};
    } catch (e) {
      errors.value = { ...e };
      isLoadingPage.value = false;

      openDialog();
    }
  }

  /**
   * Mô tả: cập nhật nhà cung câp
   * created by : ttanh (17-08-2023)
   */
  async function updateObj(objId, newObj) {
    try {
      if (Object.keys(errors.value).length > 0) {
        openDialog();
        return;
      }
      isLoadingPage.value = true;

      await ProviderService.updateObj(objId, newObj);
      await getList(recordsPerPage.value, currentPage.value, querySearch.value);
      await getList(recordsPerPage.value, currentPage.value, querySearch.value);
      const res = await ProviderService.getNewcode();
      isLoadingPage.value = false;

      selectedObj.value = { ProviderCode: res.Data, ProviderIsPrivate: false };
      inputObj.value = { ProviderCode: res.Data, ProviderIsPrivate: false };

      selectedObj.value = { ProviderIsPrivate: false };
      inputObj.value = { ProviderIsPrivate: false };
      onOpen(MResource.vi.accountPage.accountDetail.changeSuccess, MResource.vi.dialog.statusSuccess);

      errors.value = {};
    } catch (e) {
      isLoadingPage.value = false;

      errors.value = { ...e };
      openDialog();
    }
  }

  /**
   * Mô tả: xuất file excel
   * created by : ttanh (17-08-2023)
   */
  const exportExcel = async () => {
    isLoadingPage.value = true;
    await ProviderService.exportExcel(MResource.vi.fileName.providerExcel);
    isLoadingPage.value = false;
  };

  /**
   * Mô tả: chức năng nhân bản
   * created by : ttanh (17-08-2023)
   */
  const duplicateObj = async (index) => {
    isLoadingPage.value = true;

    const res = await ProviderService.getById(data.value[index].ProviderId);
    const resCode = await ProviderService.getNewcode();
    isLoadingPage.value = false;

    inputObj.value = { ...res.Data, ProviderCode: resCode.Data };
    selectedObj.value = { ...res.Data, ProviderCode: resCode.Data };
    openForm(inputObj.value, 0);
  };

  /**
   * Mô tả: đóng form chi tiết
   * created by : ttanh (17-08-2023)
   */
  function closeProviderForm() {
    closeForm();

    isShowDialog.value = false;
    errors.value = {};
  }

  return {
    isShowForm,
    data,
    formMode,
    inputObj,
    selectedObj,
    errors,
    totalRecord,
    recordsPerPage,
    currentPage,
    querySearch,
    msg,
    statusToast,
    isShow,
    isShowDialog,
    orderRefs,
    employeeList,

    isLoadingCombobox,
    isLoadingPage,
    closeForm: closeProviderForm,
    openForm,
    getList,
    deleteObj,
    createObj,
    deleteMultipleObj,
    updateObj,
    onClose,
    onOpen,
    openDialog,
    closeDialog,
    duplicateObj,
    searchEmployee,
    handleLazyLoadEmployee,
    exportExcel,
  };
});
