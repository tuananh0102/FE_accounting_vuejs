<template>
  <div class="overlay" ref="overlay"></div>
  <div
    @keyup.esc="onCloseChangeForm"
    class="detail-staff__container"
    @keydown.ctrl.prevent="onSave($event, onAddAndClose, onAddBtn)"
  >
    <div class="popup">
      <div class="popup__main">
        <div class="popup__top">
          <span class="popup__top-left">
            <h3 class="popup__header">{{ getCurrentForm.name }}</h3>
            <input
              ref="customerCheckbox"
              class="popup__checkbox"
              type="checkbox"
              id="customer"
              :value="true"
              v-model="employeeSelected.IsCustomer"
            />
            <label class="checkbox__label">{{ fields.isCustomer }}</label>
            <input
              class="popup__checkbox"
              type="checkbox"
              id="provider"
              :value="true"
              v-model="employeeSelected.IsProvider"
            />
            <label class="checkbox__label">{{ fields.isProvider }}</label>
          </span>
          <span class="popup__top-right">
            <i :title="$_MResource[$_LANG_CODE].titleIcon.help" tabindex="0" class="icon-question"></i>
            <span
              :title="$_MResource[$_LANG_CODE].titleIcon.close"
              tabindex="0"
              @click="onCloseChangeForm"
              class="popup__icon"
              ><i class="icon-close"></i
            ></span>
          </span>
        </div>

        <div class="popup__mid">
          <div class="two-cols">
            <div class="col-left">
              <div class="two-cols">
                <span class="popup__field flex-1">
                  <label class="label-input">{{ fields.EmployeeCode }} <span class="star-red">*</span></label>

                  <m-input
                    ref="EmployeeCode"
                    type="text"
                    v-model="employeeSelected.EmployeeCode"
                    :maxLength="maxLength.code"
                    :title="employeeErrors.EmployeeCode ? $_MResource[$_LANG_CODE].warning.invalidCode : ''"
                    :class="{
                      invalid:
                        employeeSelected.EmployeeCode == '' ||
                        (employeeErrors.EmployeeCode && employeeSelected.EmployeeCode == inValidData.EmployeeCode),
                    }"
                  ></m-input>
                </span>

                <span class="popup__field flex-1dot5 ml-8">
                  <label class="label-input">{{ fields.FullName }} <span class="star-red">*</span></label>

                  <m-input
                    ref="FullName"
                    type="text"
                    v-model="employeeSelected.FullName"
                    :maxLength="maxLength.name"
                    :title="employeeErrors.FullName ? employeeErrors.FullName[0] : ''"
                    :class="{
                      invalid:
                        employeeSelected.FullName == '' ||
                        (employeeErrors.FullName && employeeSelected.FullName == inValidData.FullName),
                    }"
                  ></m-input>
                </span>
              </div>
              <div class="popup__field">
                <label class="label-input">{{ fields.DepartmentId }} <span class="star-red">*</span></label>
                <m-combobox
                  ref="DepartmentId"
                  :inputClass="{
                    invalid:
                      (employeeErrors.DepartmentId && !employeeSelected.DepartmentName) ||
                      (employeeErrors.DepartmentId && employeeSelected.DepartmentName == inValidData.DepartmentName),
                  }"
                  :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                  :listSelections="listSelections"
                  :data="employeeSelected"
                  :title="employeeErrors.DepartmentId ? employeeErrors.DepartmentId[0] : ''"
                  idFieldObj="DepartmentId"
                  idFieldList="DepartmentId"
                  displayField="DepartmentName"
                  :cols="cols"
                  :reloadList="searchDepartment"
                  :placeholder="$_MResource[$_LANG_CODE].detailForm.placeholderDepartment"
                ></m-combobox>
              </div>

              <div class="popup__field">
                <label class="label-input">{{ fields.PositionName }}</label>
                <m-input
                  ref="PositionName"
                  type="text"
                  :maxLength="maxLength.name"
                  :title="employeeErrors.PositionName ? employeeErrors.PositionName[0] : ''"
                  v-model="employeeSelected.PositionName"
                  :class="{
                    invalid: employeeErrors.PositionName && employeeSelected.PositionName == inValidData.PositionName,
                  }"
                ></m-input>
              </div>
            </div>
            <div class="col-right">
              <div class="two-cols">
                <span class="popup__field flex-1">
                  <label class="label-input">{{ fields.DateOfBirth }} </label>

                  <m-input
                    ref="DateOfBirth"
                    type="date"
                    v-model="employeeSelected.DateOfBirth"
                    :title="employeeErrors.DateOfBirth ? employeeErrors.DateOfBirth[0] : ''"
                    :class="{
                      invalid: employeeErrors.DateOfBirth && employeeSelected.DateOfBirth == inValidData.DateOfBirth,
                    }"
                  ></m-input>
                </span>

                <span class="popup__field flex-1dot5" style="margin-left: 16px">
                  <label class="label-input">{{ fields.Gender }}</label>
                  <span class="popup__input-radio"
                    ><input class="popup__radio" type="radio" :value="0" v-model="employeeSelected.Gender" /><label
                      class="label-radio"
                      >Nam</label
                    >
                    <input class="popup__radio" type="radio" :value="1" v-model="employeeSelected.Gender" /><label
                      class="label-radio"
                      >Nữ</label
                    >

                    <input class="popup__radio" type="radio" :value="2" v-model="employeeSelected.Gender" /><label
                      class="label-radio"
                      >Khác</label
                    >
                  </span>
                </span>
              </div>

              <div class="two-cols">
                <span class="popup__field flex-1dot5">
                  <label class="label-input" :title="fields.title.identity">{{ fields.IdentityNumber }}</label>

                  <m-input
                    ref="IdentityNumber"
                    type="text"
                    :maxLength="maxLength.bankNumber"
                    v-model="employeeSelected.IdentityNumber"
                    :title="employeeErrors.IdentityNumber ? employeeErrors.IdentityNumber[0] : ''"
                    :class="{
                      invalid:
                        employeeErrors.IdentityNumber && employeeSelected.IdentityNumber == inValidData.IdentityNumber,
                    }"
                  ></m-input>
                </span>

                <span class="popup__field flex-1 ml-8">
                  <label class="label-input">{{ fields.IdentityDate }}</label>

                  <m-input
                    ref="IdentityDate"
                    type="date"
                    v-model="employeeSelected.IdentityDate"
                    :title="employeeErrors.IdentityDate ? employeeErrors.IdentityDate[0] : ''"
                    :class="{
                      invalid: employeeErrors.IdentityDate && employeeSelected.IdentityDate == inValidData.IdentityDate,
                    }"
                  ></m-input>
                </span>
              </div>

              <div class="popup__field">
                <label class="label-input">{{ fields.IdentityAddress }}</label>

                <m-input
                  ref="IdentityAddress"
                  type="text"
                  v-model="employeeSelected.IdentityAddress"
                  :maxLength="maxLength.address"
                  :title="employeeErrors.IdentityAddress ? employeeErrors.IdentityAddress[0] : ''"
                  :class="{
                    invalid:
                      employeeErrors.IdentityAddress && employeeSelected.IdentityAddress == inValidData.IdentityAddress,
                  }"
                ></m-input>
              </div>
            </div>
          </div>

          <div class="single-col">
            <div class="popup__field">
              <label class="label-input">{{ fields.Address }} </label>

              <m-input
                ref="Address"
                type="text"
                v-model="employeeSelected.Address"
                :maxLength="maxLength.address"
                :title="employeeErrors.Address ? employeeErrors.Address[0] : ''"
                :class="{
                  invalid: employeeErrors.Address && employeeSelected.Address == inValidData.Address,
                }"
              ></m-input>
            </div>
            <div class="list-popup-field">
              <div class="popup__field width-25per">
                <label class="label-input" :title="fields.title.phoneNumber">{{ fields.PhoneNumber }} </label>

                <m-input
                  ref="PhoneNumber"
                  type="text"
                  v-model="employeeSelected.PhoneNumber"
                  :maxLength="maxLength.phoneNumber"
                  :title="employeeErrors.PhoneNumber ? employeeErrors.PhoneNumber[0] : ''"
                  :class="{
                    invalid: employeeErrors.PhoneNumber && employeeSelected.PhoneNumber == inValidData.PhoneNumber,
                  }"
                ></m-input>
              </div>
              <div class="popup__field width-25per">
                <label class="label-input" :title="fields.title.phoneLandline">{{ fields.PhoneLandline }} </label>

                <m-input
                  ref="PhoneLandline"
                  type="text"
                  v-model="employeeSelected.PhoneLandline"
                  :maxLength="maxLength.phoneNumber"
                  :title="employeeErrors.PhoneLandline ? employeeErrors.PhoneLandline[0] : ''"
                  :class="{
                    invalid:
                      employeeErrors.PhoneLandline && employeeSelected.PhoneLandline == inValidData.PhoneLandline,
                  }"
                ></m-input>
              </div>
              <div class="popup__field width-25per">
                <label class="label-input">{{ fields.Email }} </label>

                <m-input
                  ref="Email"
                  type="email"
                  v-model="employeeSelected.Email"
                  :maxLength="maxLength.name"
                  :title="employeeErrors.Email ? employeeErrors.Email[0] : ''"
                  :class="{ invalid: employeeErrors.Email && employeeSelected.Email == inValidData.Email }"
                ></m-input>
              </div>
            </div>

            <div class="list-popup-field">
              <div class="popup__field width-25per">
                <label class="label-input">{{ fields.BankAccount }} </label>

                <m-input
                  ref="BankAccount"
                  type="text"
                  v-model="employeeSelected.BankAccount"
                  :maxLength="maxLength.bankNumber"
                  :title="employeeErrors.BankAccount ? employeeErrors.BankAccount[0] : ''"
                  :class="{
                    invalid: employeeErrors.BankAccount && employeeSelected.BankAccount == inValidData.BankAccount,
                  }"
                ></m-input>
              </div>
              <div class="popup__field width-25per">
                <label class="label-input">{{ fields.BankName }} </label>

                <m-input
                  ref="BankName"
                  type="text"
                  v-model="employeeSelected.BankName"
                  :maxLength="maxLength.address"
                  :class="{
                    invalid: employeeErrors.BankName && employeeSelected.BankName == inValidData.BankName,
                  }"
                ></m-input>
              </div>
              <div class="popup__field width-25per">
                <label class="label-input">{{ fields.BankBranch }} </label>

                <m-input
                  ref="BankBranch"
                  type="text"
                  v-model="employeeSelected.BankBranch"
                  :maxLength="maxLength.address"
                  :class="{
                    invalid: employeeErrors.BankBranch && employeeSelected.BankBranch == inValidData.BankBranch,
                  }"
                  @keydown.tab.prevent.stop="onTabNextTo($event, 'addBtn')"
                ></m-input>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="popup__footer">
        <div class="footer--left">
          <!-- <button class="base-btn sub-btn">
            <span class="btn__text btn__text--black">Hủy</span>
          </button> -->
          <m-button
            singleBtn
            typeBtn="sub-btn"
            ref="cancelBtn"
            @keydown.tab.prevent="processTab()"
            :textBtnClick="onCloseChangeForm"
            >{{ $_MResource[$_LANG_CODE].button.cancel }}</m-button
          >
        </div>
        <div class="footer--right">
          <m-button
            typeBtn="sub-btn"
            singleBtn
            ref="addBtn"
            :textBtnClick="() => onAddAndClose(employee)"
            :title="$_MResource[$_LANG_CODE].shortcut.save"
            @keydown.prevent.stop="onTabNextTo($event, 'saveAndNew')"
          >
            {{ $_MResource[$_LANG_CODE].button.save }}</m-button
          >

          <!-- <button type="button" class="base-btn regular-btn ml-8">
            <span class="btn__text">Cất và Thêm</span>
          </button> -->
          <m-button
            singleBtn
            ref="saveAndNew"
            typeBtn="regular-btn"
            @keydown.prevent.stop="onTabNextTo($event, 'cancelBtn')"
            :textBtnClick="async () => await onAddBtn(employee)"
            :title="$_MResource[$_LANG_CODE].shortcut.saveAndNew"
          >
            {{ $_MResource[$_LANG_CODE].button.saveAndNew }}</m-button
          >
        </div>
      </div>
    </div>
  </div>
  <m-dialog
    v-if="isShowDialog"
    @onCancel="() => onCloseWarningDialog()"
    @onSuccess="() => onCloseWarningDialog()"
    :title="$_MResource[$_LANG_CODE].dialog.title"
    iconClass="icon-warning-red"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    <span v-for="(error, index) in employeeErrors" :key="index">
      <ul class="list-error">
        <li v-for="(item, index) in error" :key="index">{{ item }}</li>
      </ul>
    </span>
  </m-dialog>

  <m-dialog
    v-if="isShowDuplicatedDialog"
    @onCancel="() => onCloseWarningDialog()"
    @onSuccess="() => onCloseWarningDialog()"
    :title="$_MResource[$_LANG_CODE].warning.invalidCode"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    {{ employeeErrors.EmployeeCode ? employeeErrors.EmployeeCode[0] : "" }}
  </m-dialog>

  <m-dialog
    v-if="isShowQuestionDialog"
    @onCancel="onCloseQuestionDialog"
    @onSuccess="onSuccessQuestionDialog"
    @onRefuse="onCloseEmployeeDetail"
    :btnRefuse="$_MResource[$_LANG_CODE].button.refuse"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionSave"
    iconClass="icon-question__blue"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    {{ $_MResource[$_LANG_CODE].dialog.descQuestionSave }}
  </m-dialog>
</template>

<script>
import EmployeeService from "@/services/EmployeeService.js";
import DepartmentService from "@/services/DepartmentService.js";
import formatDate from "@/utils/formatDate";
import formatData from "@/utils/formatData";
import spliceDate from "@/utils/spliceDate";

export default {
  name: "EmployeeDetail",

  data() {
    return {
      employeeSelected: {},
      employeeErrors: {},

      refs: [
        "EmployeeCode",
        "FullName",
        "DepartmentId",
        "PositionName",
        "DateOfBirth",
        "IdentityNumber",
        "IdentityDate",
        "IdentityAddress",
        "Address",
        "PhoneNumber",
        "PhoneLandline",
        "Email",
        "BankAccount",
        "BankName",
        "BankBranch",
      ],
      formMode: this.$_MEnum.FormMode.add,
      isShowDialog: false,
      isShowDuplicatedDialog: false,
      isShowQuestionDialog: false,
      inValidData: {
        EmployeeCode: "",
        DateOfBirth: "",
        IdentityDate: "",
        Email: "",
        DepartmentName: "",
      },
      listSelections: [],
      // searchListSelections: [],
      timeOutTypeSearch: null,
      maxLength: { ...this.$_MResource[this.$_LANG_CODE].maxLength },
      fields: this.$_MResource[this.$_LANG_CODE].fields,
      cols: [
        {
          key: 0,
          width: 100,

          fieldList: "DepartmentName",
          fieldObj: "DepartmentName",
        },
      ],
    };
  },

  created() {
    /**
     * Mô tả: nhân bản dữ liệu từ prop employee
     * created by : ttanh
     * created date: 29-05-2023
     */

    this.employeeSelected = { ...this.employee };
  },

  props: [
    "employee",
    "onCloseEmployeeDetail",
    "onShowToast",
    "updateData",
    "onShowFailToast",
    "mode",
    "onShowNewEmployeeForm",
  ],

  computed: {
    /**
     * Mô tả: đưa ra loại form
     * created by : ttanh
     * created date: 01-06-2023
     */
    getCurrentForm() {
      if (this.mode === this.$_MEnum.FormMode.add) {
        return this.$_MResource[this.$_LANG_CODE].newForm;
      }
      return this.$_MResource[this.$_LANG_CODE].detailForm;
    },
  },

  methods: {
    spliceDate,
    formatData,
    formatDate,

    /**
     * Mô tả: lưu bản ghi
     * created by : ttanh (01-07-2023)
     */
    onSave($event, save, saveAndNew) {
      if ($event.key == "s") {
        save(this.employee);
      }

      if ($event.key == "S") {
        saveAndNew(this.employee);
      }
    },

    /**
     * Mô tả: sự kiện tab đến ô tiếp theo
     * created by : ttanh (29-06-2023)
     */
    onTabNextTo($event, ref) {
      if ($event.keyCode == this.$_MEnum.Key.tab) {
        if (this.$refs[ref]) this.$refs[ref].focus();
      }
    },

    /**
     * Mô tả:  đưa ra max length message
     * created by : ttanh (29-06-2023)
     */
    getWarningMaxLengthMsg(item, maxLength) {
      return `${this.$_MResource[this.$_LANG_CODE].fields[item]} ${
        this.$_MResource.vi.warning.noGreaterThan
      } ${maxLength} ${this.$_MResource.vi.warning.char}`;
    },

    /**
     * Mô tả: kiểm tra max length
     * created by : ttanh
     * created date: 27-06-2023
     */
    isValidLength(item, maxLength) {
      if (!item) return true;
      if (item.length > maxLength) {
        return false;
      }
      return true;
    },

    /**
     * Mô tả: thêm một trường vào object
     * created by : ttanh
     * created date: 27-06-2023
     */
    addToObject(obj, key, value) {
      if (!obj[key] || obj[key].length < 1) {
        obj[key] = [value];
      } else {
        obj[key].push(value);
      }
    },

    /**
     * Mô tả: kiểm tra email có hợp lệ
     * created by : ttanh (01-07-2023)
     */
    isValidEmail(email) {
      if (!email) return true;
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },

    /**
     * Mô tả: kiểm tra ngày nhập có lớn hơn ngày hiện tại
     * created by : ttanh (01-07-2023)
     */
    isValidDate(date) {
      if (!date) {
        return true;
      }

      let formatedDate = this.formatDate(Date.now());

      if (formatedDate < date) {
        return false;
      }
      return true;
    },
    /**
     * Mô tả: validate
     * created by : ttanh
     * created date: 08-06-2023
     */

    validateForm() {
      this.employeeErrors = {};

      // validate
      this.refs.map((item) => {
        switch (item) {
          case "EmployeeCode":
            if (this.checkEmpty(this.employeeSelected[item])) {
              this.addToObject(
                this.employeeErrors,
                item,
                `${this.$_MResource[this.$_LANG_CODE].fields[item]} ${
                  this.$_MResource[this.$_LANG_CODE].warning.noEmpty
                }`
              );
            } else if (!this.isValidLength(this.employeeSelected[item], 20)) {
              this.addToObject(this.employeeErrors, item, this.getWarningMaxLengthMsg(item, 20));
              this.inValidData[item] = this.employeeSelected[item];
            }
            break;
          case "FullName":
            if (this.checkEmpty(this.employeeSelected[item])) {
              this.addToObject(
                this.employeeErrors,
                item,
                `${this.$_MResource[this.$_LANG_CODE].fields[item]} ${
                  this.$_MResource[this.$_LANG_CODE].warning.noEmpty
                }`
              );
            } else if (!this.isValidLength(this.employeeSelected[item], 100)) {
              this.addToObject(this.employeeErrors, item, this.getWarningMaxLengthMsg(item, 100));
              this.inValidData[item] = this.employeeSelected[item];
            }

            break;
          case "DepartmentId":
            if (!this.employeeSelected.DepartmentName) {
              this.addToObject(
                this.employeeErrors,
                item,
                `${this.$_MResource[this.$_LANG_CODE].fields[item]} ${
                  this.$_MResource[this.$_LANG_CODE].warning.noEmpty
                }`
              );

              this.inValidData[item] = this.employeeSelected[item];
              break;
            }
            if (this.listSelections.length < 1) {
              this.addToObject(this.employeeErrors, item, this.$_MResource[this.$_LANG_CODE].warning.invalidDepartment);

              this.inValidData.DepartmentName = this.employeeSelected.DepartmentName;

              break;
            }
            for (let i = 0; i < this.listSelections.length; ++i) {
              if (this.listSelections[i].DepartmentName == this.employeeSelected.DepartmentName) {
                break;
              } else if (i == this.listSelections.length - 1) {
                this.addToObject(
                  this.employeeErrors,
                  item,
                  this.$_MResource[this.$_LANG_CODE].warning.invalidDepartment
                );

                this.inValidData.DepartmentName = this.employeeSelected.DepartmentName;
              }
            }
            break;

          case "DateOfBirth":
            if (!this.isValidDate(this.employeeSelected[item])) {
              this.addToObject(
                this.employeeErrors,
                item,
                this.$_MResource[this.$_LANG_CODE].warning.invalidDateOfBirth
              );
              this.inValidData[item] = this.employeeSelected[item];
            }
            break;
          case "IdentityDate":
            if (!this.isValidDate(this.employeeSelected[item])) {
              this.addToObject(
                this.employeeErrors,
                item,
                this.$_MResource[this.$_LANG_CODE].warning.invalidIdentityDate
              );
              this.inValidData[item] = this.employeeSelected[item];
            }
            break;

          case "Email":
            if (!this.isValidEmail(this.employeeSelected[item])) {
              this.addToObject(this.employeeErrors, item, this.$_MResource[this.$_LANG_CODE].warning.invalidEmail);
              this.inValidData[item] = this.employeeSelected[item];
            }
            break;
          default:
            if (!this.isValidLength(this.employeeSelected[item], 255)) {
              this.addToObject(this.employeeErrors, item, this.getWarningMaxLengthMsg(item, 255));
              this.inValidData[item] = this.employeeSelected[item];
            }
            break;
        }
      });
    },

    /**
     * Mô tả: focus vào input không hợp lệ đầu tiên
     * created by : ttanh
     * created date: 02-06-2023
     */
    onFocusInvalidFirst() {
      Object.keys(this.employeeErrors)
        .reverse()
        .map((item) => {
          if (item != "DepartmentId") {
            this.$refs[item].focus();
            return;
          } else {
            this.$refs[item].focus();
          }
        });
    },

    /**
     * Mô tả: đóng thông báo lỗi
     * created by : ttanh
     * created date: 01-06-2023
     */
    onCloseWarningDialog() {
      this.isShowDialog = false;
      this.isShowDuplicatedDialog = false;
      this.onFocusInvalidFirst();
    },

    /**
     * Mô tả: đóng thông báo hỏi
     * created by : ttanh
     * created date: 09-06-2023
     */

    onCloseQuestionDialog() {
      this.isShowQuestionDialog = false;
      this.$refs.EmployeeCode.focus();
    },

    /**
     * Mô tả: kiểm tra trường rỗng
     * created by : ttanh
     * created date: 01-06-2023
     */
    checkEmpty(str) {
      if (!str) {
        return true;
      }

      return false;
    },

    /**
     * Mô tả: Thêm mới nhân viên
     * created by : ttanh
     * created date: 01-06-2023
     */
    async createEmployee() {
      if (!this.employeeSelected.DepartmentId) {
        this.listSelections.map((item) => {
          if (item.DepartmentName.trim() == this.employeeSelected.DepartmentName.trim()) {
            this.employeeSelected.DepartmentId = item.DepartmentId;
          }
        });
      }

      try {
        if (this.employeeSelected.DateOfBirth == "") {
          this.employeeSelected.DateOfBirth = null;
        }
        if (this.employeeSelected.IdentityDate == "") {
          this.employeeSelected.IdentityDate = null;
        }
        const res = await EmployeeService.createObj(this.employeeSelected);

        if (res.status == 201) {
          this.employeeErrors = {};

          this.onShowToast(this.$_MResource.vi.newForm.successMsg);

          this.updateData();
        }
      } catch (e) {
        this.employeeErrors = { ...e };
        let keys = Object.keys(this.employeeErrors);

        keys.map((key) => {
          this.inValidData[key] = this.employeeSelected[key];
        });
        if (keys.includes("EmployeeCode")) {
          this.isShowDuplicatedDialog = true;
        } else if (keys.includes("System")) {
          this.onShowFailToast(this.$_MResource.vi.newForm.failMsg);
        } else if (keys.length > 0) {
          this.isShowDialog = true;
        }

        // const exRes = handleEx(e, "EmployeeCode");
        // if (exRes && exRes.isShowFailToast) {
        // } else {
        //   this.employeeErrors = exRes.errorMsgs;
        //   let keys = exRes.keys;

        //   this.isShowDuplicatedDialog = exRes.isShowDuplicated;
        //   this.isShowDialog = exRes.isShowDialog;
        // }
      }
    },

    async updateEmployee(inputEmployee) {
      if (!this.employeeSelected.DepartmentId) {
        this.listSelections.map((item) => {
          if (item.DepartmentName.trim() == this.employeeSelected.DepartmentName.trim()) {
            this.employeeSelected.DepartmentId = item.DepartmentId;
          }
        });
      }
      try {
        if (this.employeeSelected.DateOfBirth == "") {
          this.employeeSelected.DateOfBirth = null;
        }
        if (this.employeeSelected.IdentityDate == "") {
          this.employeeSelected.IdentityDate = null;
        }

        const res = await EmployeeService.updateObj(inputEmployee.EmployeeId, this.employeeSelected);
        if (res.status == 200) {
          for (let field in this.employeeSelected) {
            if (inputEmployee[field] !== this.employeeSelected[field]) {
              inputEmployee[field] = this.employeeSelected[field];
            }
          }

          this.employeeErrors = {};

          this.onShowToast(this.$_MResource.vi.detailForm.successMsg);
        }
      } catch (e) {
        this.employeeErrors = { ...e };
        let keys = Object.keys(this.employeeErrors);

        keys.map((key) => {
          this.inValidData[key] = this.employeeSelected[key];
        });
        if (keys.includes("EmployeeCode")) {
          this.isShowDuplicatedDialog = true;
        } else if (keys.includes("System")) {
          this.onShowFailToast(this.$_MResource.vi.newForm.failMsg);
        } else if (keys.length > 0) {
          this.isShowDialog = true;
        }
      }
    },

    /**
     * Mô tả: thực hiện khi nhắn nút thêm
     * created by : ttanh
     * created date: 29-05-2023
     */
    async onAddBtn(inputEmployee) {
      // this.checkValidForm();

      this.validateForm();
      if (Object.keys(this.employeeErrors).length > 0) {
        this.isShowDialog = true;
        return false;
      }

      if (this.mode === this.$_MEnum.FormMode.add) {
        // nếu là form thêm mới nhân viên
        await this.createEmployee();

        if (Object.keys(this.employeeErrors).length > 0) {
          return false;
        }
        await this.onShowNewEmployeeForm();
        return true;
      } else {
        let strInputEm = JSON.stringify({
          ...inputEmployee,
          DateOfBirth: this.spliceDate(inputEmployee.DateOfBirth),
          IdentityDate: this.spliceDate(inputEmployee.IdentityDate),
        });
        // let strInputEm = JSON.stringify(inputEmployee);
        let strSelectedEm = JSON.stringify(this.employeeSelected);

        //nếu có sự thay đổi dữ liệu và đang là form chi tiết nhân viên
        if (strInputEm !== strSelectedEm) {
          await this.updateEmployee(inputEmployee);

          if (Object.keys(this.employeeErrors).length > 0) {
            return false;
          }

          await this.onShowNewEmployeeForm();

          return true;
        } else {
          await this.onShowNewEmployeeForm();
        }
      }
    },

    /**
     * Mô tả: xử lý sự kiện của nút cất
     * created by : ttanh
     * created date: 02-06-2023
     */
    onAddAndClose(inputEmployee) {
      this.onAddBtn(inputEmployee).then((res) => {
        res ? this.onCloseEmployeeDetail() : "";
      });
    },

    /**
     * Mô tả: xử lý tab btn
     * created by : ttanh
     * created date: 02-06-2023
     */
    processTab() {
      this.$refs.customerCheckbox.focus();
    },

    /**
     * Mô tả: xử lý khi đóng form thay đổi
     * created by : ttanh
     * created date: 09-06-2023
     */

    onCloseChangeForm() {
      let strEmployeeProp = JSON.stringify({
        ...this.employee,
        DateOfBirth: this.spliceDate(this.employee.DateOfBirth),
        IdentityDate: this.spliceDate(this.employee.IdentityDate),
      });
      let strEmployeeSelected = JSON.stringify(this.employeeSelected);

      if (
        (strEmployeeProp == "{}" && Object.keys(this.employeeSelected).length < 2) ||
        strEmployeeProp == strEmployeeSelected
      ) {
        this.onCloseEmployeeDetail();
      } else if (this.mode == this.$_MEnum.FormMode.add) {
        this.isShowQuestionDialog = true;
      } else if (this.mode == this.$_MEnum.FormMode.detail && strEmployeeProp != strEmployeeSelected) {
        this.isShowQuestionDialog = true;
      }
    },

    /**
     * Mô tả: xử lý đồng ý question dialog
     * created by : ttanh
     * created date: 09-06-2023
     */
    onSuccessQuestionDialog() {
      this.onAddAndClose(this.employee);

      this.isShowQuestionDialog = false;
    },

    /**
     * Mô tả: tìm kiếm department
     * created by : ttanh
     * created date: 27-06-2023
     */

    async searchDepartment(value) {
      clearTimeout(this.timeOutTypeSearch);
      if (value) {
        this.timeOutTypeSearch = setTimeout(() => {
          let inputSearch = `?name=${value}`;
          DepartmentService.getList(inputSearch)
            .then((res) => {
              this.listSelections = [...res.Data];
            })
            .catch((e) => {
              console.log(e);
            });
        }, 500);
      } else {
        const res = await DepartmentService.getList();

        if (res.Data.length < this.listSelections.length) {
          for (let i = 0; i < this.listSelections.length - res.Data.length; ++i) {
            this.listSelections.pop();
          }
        }

        res.Data.map((item, index) => {
          if (index < this.listSelections.length) {
            this.listSelections[index] = item;
          } else {
            this.listSelections.push(item);
          }
        });

        // this.listSelections = [...res.Data];
      }
    },
  },

  watch: {
    // "employeeSelected.DepartmentName"(newValue) {
    //   this.searchDepartment(newValue);
    // },
    employee(newValue) {
      this.employeeSelected = { ...newValue };
    },
  },

  mounted() {
    DepartmentService.getList()
      .then((res) => {
        this.listSelections = [...res.Data];
      })
      .catch((e) => {
        console.log(e);
      });

    this.$refs.EmployeeCode.focus();
  },
};
</script>

<style>
.popup__field .invalid {
  border: 1px solid red !important;
}

.popup__mid .popup__field .invalid:focus-within {
  border: 1px solid red !important;
}

.list-error {
  margin-left: 10px;
}

.custom {
  width: 100%;
  height: 32px;
}
</style>
