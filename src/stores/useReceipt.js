import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import ReceiptService from "@/services/ReceiptService";
import ProviderService from "@/services/ProviderService";
import EmployeeService from "@/services/EmployeeService";
import AccountService from "@/services/AccountService";
import MResource from "@/scripts/resource";

export const useReceipt = defineStore("receipt", () => {
  const data = ref(null);
  const currentPage = ref(1);
  const recordsPerPage = ref(20);
  const querySearch = ref("");
  const totalRecord = ref(0);
  const errors = ref(new Object());
  const timeOutSearch = ref(null);
  const timeOutSearchCombobox = ref(null);
  const route = useRouter();

  const msg = ref("");
  const isShow = ref(false);
  const statusToast = ref();
  const timeOut = ref(null);

  const isShowDialog = ref(false);

  const fieldFocus = ref("");

  const isDisableAll = ref(false);
  const isDisableApart = ref(false);

  const objMsgDeleteMultiple = ref(null);

  const isShowAlertDialog = ref(false);

  const listCurrentAccountant = ref([]);

  const pageLazyLoadDebt = ref(1);
  const pageLazyLoadReceive = ref(1);

  const isLoadingPage = ref(false);
  const isLoadingCombobox = ref(false);

  // const orderFocus = ["DateAccounting", "ReceiptDate", "ReceiptCode", "AccountDebtCode", "AccountBalanceCode"];

  const footerState = ref(-1);

  /**
   * Mô tả: đóng toast msg
   * created by : ttanh (17-08-2023)
   */
  function onClose() {
    isShow.value = false;
    window.clearTimeout(timeOut.value);
  }

  /**
   * Mô tả: mở toast
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

  const inputObj = ref(new Object());
  const selectedObj = ref(new Object());

  const listProvider = ref([]);
  const listEmployee = ref([]);

  const listAccountDebt = ref([]);
  const listAccountBalance = ref([]);

  // form

  /**
   * Mô tả: đóng form chi tiết
   * created by : ttanh (17-08-2023)
   */
  const closeForm = () => {
    inputObj.value = {};
    selectedObj.value = {};
    errors.value = {};
    listCurrentAccountant.value = [];
    route.push("/money/moneyList");
  };

  /**
   * Mô tả: mở form chi tiết
   * created by : ttanh (17-08-2023)
   */
  const openForm = () => {
    footerState.value = -1;
    errors.value = {};

    if (!inputObj.value.ReceiptDescription) {
      inputObj.value.ReceiptDescription = MResource.vi.receiptPage.payFor;
      selectedObj.value.ReceiptDescription = MResource.vi.receiptPage.payFor;
    }
    route.push("/paymentDetail");

    isDisableAll.value = false;
    isDisableApart.value = false;
  };

  /**
   * Mô tả: mở form chi tiết với dẽ liệu mặc định
   * created by : ttanh (17-08-2023)
   */
  const openDetailForm = async (id) => {
    const res = await ReceiptService.getById(id);
    selectedObj.value = { ...res.Data };
    inputObj.value = { ...res.Data };
    listCurrentAccountant.value = [...inputObj.value.Accountants].map((item) => {
      return { ...item };
    });
    if (inputObj.value.IsNoted == 0) {
      footerState.value = 0;
    } else if (inputObj.value.IsNoted == 1) {
      footerState.value = 1;
    }
    isDisableAll.value = true;
    route.push("/paymentDetail");
  };

  /**
   * Mô tả: kiểm tra trường rỗng
   * created by : ttanh (08-08-2023)
   */
  const checkEmpty = (obj = inputObj.value) => {
    if (!obj.DateAccounting) {
      errors.value.DateAccounting = [MResource.vi.receiptPage.notEmptyDateAccounting];
    }
    if (!obj.ReceiptDate) {
      errors.value.ReceiptDate = [MResource.vi.receiptPage.notEmptyDatePayment];
    }

    if (!obj.ReceiptCode) {
      errors.value.ReceiptCode = [MResource.vi.receiptPage.notEmptyPaymentCode];
    }

    if (!obj.Accountants || obj.Accountants.length == 0) {
      errors.value.DetailReceipt = [MResource.vi.receiptPage.needDetailDocument];
    } else if (obj.Accountants && obj.Accountants.length > 0) {
      obj.Accountants.map((item) => {
        if (!item?.AccountDebtCode) {
          errors.value.AccountDebtCode = [MResource.vi.receiptPage.notEmptyAccountDebt];
        }
        if (!item?.AccountBalanceCode) {
          errors.value.AccountBalanceCode = [MResource.vi.receiptPage.notEmptyAccountBalance];
        }
      });
    }

    if (!obj.ProviderId && obj.ProviderCode) {
      errors.value.ProviderId = [MResource.vi.receiptPage.notFoundProviderCode];
    }

    if (!obj.EmployeeId && obj.FullName) {
      errors.value.EmployeeId = [MResource.vi.receiptPage.notFoundEmployee];
    }
    if (!obj.AccountDebtId && obj.AccountDebtCode) {
      errors.value.AccountDebtCode = [MResource.vi.receiptPage.notFoundAccountDebt];
    }
    if (!obj.AccountBalanceId && obj.AccountBalanceCode) {
      errors.value.AccountBalanceCode = [MResource.vi.receiptPage.notFoundAccountBalance];
    }
  };

  /**
   * Mô tả: kiểm tra ngày
   * created by : ttanh (04-08-2023)
   */
  const checkDate = (obj = inputObj.value) => {
    if (obj.DateAccounting && obj.ReceiptDate && obj.DateAccounting < obj.ReceiptDate) {
      errors.value.DateAccounting = [MResource.vi.receiptPage.needDateAccountingMoreThan];
    }
  };

  /**
   * Mô tả: ghi sổ
   * created by : ttanh (17-08-2023)
   */
  const onNoted = async (id = inputObj.value.ReceiptId, obj = inputObj.value, currentIndex = null) => {
    errors.value = {};
    checkEmpty(obj);
    checkDate(obj);

    try {
      if (Object.keys(errors.value).length == 0) {
        obj.IsNoted = true;
        isLoadingPage.value = true;
        await ReceiptService.updateObj(id, obj);
        isLoadingPage.value = false;

        onOpen(MResource.vi.receiptPage.noteSuccess, MResource.vi.dialog.statusSuccess);
        errors.value = {};

        isDisableAll.value = true;
        isDisableApart.value = true;
        footerState.value = 1;
        if (currentIndex != null) {
          data.value[currentIndex].IsNoted = true;
        }
      } else {
        openDialog();
      }
    } catch (e) {
      isLoadingPage.value = false;
      obj.IsNoted = false;
      errors.value = { ...e };
      openDialog();
    }
  };

  /**
   * Mô tả: bỏ ghi
   * created by : ttanh (17-08-2023)
   */
  const onUnNoted = async (id = inputObj.value.ReceiptId, obj = inputObj.value, currentIndex = null) => {
    obj.IsNoted = false;
    isLoadingPage.value = true;
    await ReceiptService.updateObj(id, obj);
    isLoadingPage.value = false;

    errors.value = {};

    errors.value = {};
    if (currentIndex != null) {
      data.value[currentIndex].IsNoted = false;
    }

    // isDisableAll = true;
    // isDisableApart = true;
    footerState.value = 0;
  };

  //api receipt
  /**
   * Mô tả: tải lại trang
   * created by : ttanh (16-08-2023)
   */
  const reloadPage = async () => {
    currentPage.value = 1;
    await getList(recordsPerPage.value, 1, querySearch.value);
  };

  const exportExcel = async () => {
    isLoadingPage.value = true;
    await ReceiptService.exportExcel(MResource.vi.fileName.receiptExcel);
    isLoadingPage.value = false;
  };

  async function getList(pageSize, pageIndex, querySearch) {
    try {
      let query = `?pageSize=${pageSize}&pageIndex=${pageIndex}`;
      if (querySearch) {
        query += `&querySearch=${querySearch}`;
      }
      isLoadingPage.value = true;
      const res = await ReceiptService.getList(query);
      isLoadingPage.value = false;
      data.value = [...res.Data];
      totalRecord.value = res.TotalRecord;
    } catch (e) {
      isLoadingPage.value = false;
      errors.value = { ...e };
    }
  }

  /**
   * Mô tả: tạo phiếu chi
   * created by : ttanh (17-08-2023)
   */
  const createObj = async () => {
    try {
      if (Object.keys(errors.value) > 0) {
        return;
      }
      inputObj.value.IsNoted = true;
      isLoadingPage.value = true;
      const res = await ReceiptService.createObj(inputObj.value);
      isLoadingPage.value = false;
      selectedObj.value.ReceiptId = res.data.Data;
      inputObj.value.ReceiptId = res.data.Data;
      onOpen(MResource.vi.receiptPage.noteSuccess, MResource.vi.dialog.statusSuccess);

      await getList(recordsPerPage.value, currentPage.value, querySearch.value);
      listCurrentAccountant.value = [...inputObj.value.Accountants];
    } catch (e) {
      if (e.Data) {
        isLoadingPage.value = false;
        inputObj.value.IsNoted = false;
        selectedObj.value.IsNoted = false;
        selectedObj.value.ReceiptId = e.Data;
        inputObj.value.ReceiptId = e.Data;
        errors.value = { ...e.ErrorMsgs };
        listCurrentAccountant.value = [...inputObj.value.Accountants];

        await getList(recordsPerPage.value, currentPage.value, querySearch.value);
      } else {
        errors.value = { ...e };
      }
    }
  };

  /**
   * Mô tả: xóa bản ghi
   * created by : ttanh (17-08-2023)
   */
  const deleteObj = async (id) => {
    isLoadingPage.value = true;
    await ReceiptService.deleteObj(id);
    await getList(recordsPerPage.value, currentPage.value, querySearch.value);
    isLoadingPage.value = false;

    onOpen(MResource.vi.dialog.successDeleteToastMsg, MResource.vi.dialog.statusSuccess);
  };

  /**
   * Mô tả: xóa nhiều bản ghi
   * created by : ttanh (17-08-2023)
   */
  async function deleteMultipleObj(ids) {
    try {
      isLoadingPage.value = true;
      const res = await ReceiptService.deleteMultipleObj(ids);
      const invalidIds = [...res.data.Data];
      if (!invalidIds || invalidIds.length == 0) {
        onOpen(MResource.vi.dialog.successDeleteToastMsg, MResource.vi.dialog.statusSuccess);

        closeDialog();
      } else {
        objMsgDeleteMultiple.value = {
          deletedNum: `${MResource.vi.receiptPage.numSuccess} ${Array.from(ids).length - invalidIds.length}`,
          notDeleteNum: `${MResource.vi.receiptPage.numNotSuccess} ${invalidIds.length}`,
          reason: MResource.vi.receiptPage.reason,
        };
        const invalidObj = data.value.filter((item) => invalidIds.includes(item.ReceiptId));
        objMsgDeleteMultiple.value.invalidCode = MResource.vi.receiptPage.numDelete;
        invalidObj.map((item) => (objMsgDeleteMultiple.value.invalidCode += `<${item.ReceiptCode}> `));
        closeDialog();
        openAlertDialog();
      }
      await getList(recordsPerPage.value, currentPage.value, querySearch.value);
      isLoadingPage.value = false;
    } catch (e) {
      isLoadingPage.value = false;
      errors.value = { ...e };
      isLoadingPage.value = false;

      openDialog();
    }
  }

  /**
   * Mô tả: mở cảnh báo
   * created by : ttanh (17-08-2023)
   */
  const openAlertDialog = () => {
    isShowAlertDialog.value = true;
  };

  /**
   * Mô tả: đóng cảnh báo
   * created by : ttanh (17-08-2023)
   */
  const closeAlertDialog = () => {
    isShowAlertDialog.value = false;
  };

  watch(querySearch, (newValue) => {
    window.clearTimeout(timeOutSearch.value);
    timeOutSearch.value = setTimeout(async () => {
      isLoadingPage.value = true;
      await getList(recordsPerPage.value, 1, newValue);
      isLoadingPage.value = false;
    }, 500);
  });

  /**
   * Mô tả:  tìm kiếm ở combobox nhân viên
   * created by : ttanh (17-08-2023)
   */
  const searchComboboxEmployee = async (querySearch) => {
    window.clearTimeout(timeOutSearchCombobox.value);
    timeOutSearchCombobox.value = setTimeout(async () => {
      isLoadingCombobox.value = true;
      await getListEmployee(200, 1, querySearch);
      isLoadingCombobox.value = false;
    }, 300);
  };

  /**
   * Mô tả: tìm kiếm ở combobox nhà cung cấp
   * created by : ttanh (17-08-2023)
   */
  const searchComboboxProvider = async (querySearch) => {
    window.clearTimeout(timeOutSearchCombobox.value);
    if (querySearch) {
      timeOutSearchCombobox.value = setTimeout(async () => {
        isLoadingCombobox.value = true;
        await getListProvider(20, 1, querySearch);
        isLoadingCombobox.value = false;
      }, 300);
    } else {
      await getListProvider(20, 1);
    }
  };

  const currentIndexPageProvider = ref(1);
  /**
   * Mô tả: xử lý lazy load nhà cung cấp
   * created by : ttanh (17-08-2023)
   */
  const handleLazyLoadProvider = async (querySearch) => {
    if (currentIndexPageProvider.value == 1) {
      ++currentIndexPageProvider.value;
    }
    let query = `?pageSize=${20}&pageIndex=${currentIndexPageProvider.value}`;
    if (querySearch) {
      query += `&querySearch=${querySearch}`;
    }
    isLoadingCombobox.value = true;
    const res = await ProviderService.getList(query);
    isLoadingCombobox.value = false;

    if (res.Data?.length > 0) {
      listProvider.value = [...listProvider.value, ...res.Data];
      ++currentIndexPageProvider.value;
    }
  };

  /**
   * Mô tả: Tìm kiếm tài khoản nợ
   * created by : ttanh (17-08-2023)
   */
  const searchComboboxAccountDebt = async (querySearch) => {
    pageLazyLoadDebt.value = 1;
    window.clearTimeout(timeOutSearchCombobox.value);
    if (querySearch) {
      timeOutSearchCombobox.value = setTimeout(async () => {
        isLoadingCombobox.value = true;
        await getListAccountDebt(querySearch);
        isLoadingCombobox.value = false;
      }, 300);
    } else {
      await getListAccountDebt();
    }
  };

  /**
   * Mô tả: Tìm kiếm tài khoản có
   * created by : ttanh (17-08-2023)
   */
  const searchComboboxAccountBalance = async (querySearch) => {
    pageLazyLoadReceive.value = 1;
    window.clearTimeout(timeOutSearchCombobox.value);
    if (querySearch) {
      timeOutSearchCombobox.value = setTimeout(async () => {
        isLoadingCombobox.value = true;
        await getListAccountBalance(querySearch);
        isLoadingCombobox.value = false;
      }, 300);
    } else {
      await getListAccountBalance();
    }
  };

  // provider
  /**
   * Mô tả:  lấy danh sách nhà cung cấp
   * created by : ttanh (17-08-2023)
   */
  const getListProvider = async (pageSize = 40, pageIndex = 1, querySearch = null) => {
    try {
      let query = `?pageSize=${pageSize}&pageIndex=${pageIndex}`;
      if (querySearch) {
        query += `&querySearch=${querySearch}`;
      }
      const res = await ProviderService.getList(query);

      listProvider.value = [...res.Data];
    } catch (e) {
      errors.value = { ...e };
    }
  };

  // employee
  /**
   * Mô tả: lấy danh sách nhân viên
   * created by : ttanh (17-08-2023)
   */
  const getListEmployee = async (pageSize = 40, pageIndex = 1, querySearch) => {
    try {
      let query = `?recordsPerPage=${pageSize}&page=${pageIndex}`;
      if (querySearch) {
        query += `&querySearch=${querySearch}`;
      }
      const res = await EmployeeService.getList(query);

      listEmployee.value = [...res.Data];
    } catch (e) {
      errors.value = { ...e };
    }
  };

  // account

  /**
   * Mô tả: lấy danh sách tài khoản nợ
   * created by : ttanh (17-08-2023)
   */
  const getListAccountDebt = async (querySearch) => {
    const res = await AccountService.getAccountByObj(0, querySearch); //lấy tài khoản là nhà cung cấp
    listAccountDebt.value = [...res.Data];
  };

  /**
   * Mô tả: lấy danh sách tài khoản có
   * created by : ttanh (17-08-2023)
   */
  const getListAccountBalance = async (querySearch) => {
    let res = await AccountService.getAccountByObj(null, querySearch);

    listAccountBalance.value = [...res.Data];
  };

  // dialog
  /**
   * Mô tả: mở dialog
   * created by : ttanh (17-08-2023)
   */
  function openDialog() {
    isShowDialog.value = true;
  }

  /**
   * Mô tả: đóng dialog
   * created by : ttanh (17-08-2023)
   */
  function closeDialog() {
    isShowDialog.value = false;
  }

  return {
    data,
    currentPage,
    recordsPerPage,
    totalRecord,
    errors,
    querySearch,

    inputObj,
    selectedObj,
    footerState,
    isDisableAll,
    isDisableApart,

    listProvider,
    listEmployee,
    listAccountDebt,
    listAccountBalance,
    listCurrentAccountant,

    isShow,
    statusToast,
    msg,

    isShowDialog,

    fieldFocus,
    objMsgDeleteMultiple,
    isShowAlertDialog,

    isLoadingPage,
    isLoadingCombobox,

    getList,
    createObj,
    deleteObj,
    deleteMultipleObj,
    reloadPage,
    exportExcel,

    getListProvider,
    getListEmployee,
    getListAccountDebt,
    getListAccountBalance,
    searchComboboxEmployee,
    searchComboboxAccountBalance,
    searchComboboxProvider,
    searchComboboxAccountDebt,
    handleLazyLoadProvider,

    closeForm,
    openDetailForm,
    openForm,
    checkDate,
    checkEmpty,
    onNoted,
    onUnNoted,

    onClose,
    onOpen,
    openDialog,
    closeDialog,
    openAlertDialog,
    closeAlertDialog,
  };
});
