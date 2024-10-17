<template>
  <div class="overlay" ref="overlay"></div>
  <div class="detail-account__container account-container" @keyup.esc="closeForm">
    <div class="popup">
      <div class="popup__main">
        <div class="popup__top">
          <span class="popup__top-left">
            <h3 class="popup__header">{{ getFormName }}</h3>
          </span>
          <span class="popup__top-right">
            <i :title="$_MResource[$_LANG_CODE].titleIcon.help" tabindex="0" class="icon-question"></i>
            <span :title="$_MResource[$_LANG_CODE].titleIcon.close" tabindex="0" class="popup__icon" @click="closeForm"
              ><i class="icon-close"></i
            ></span>
          </span>
        </div>

        <div class="popup__mid">
          <div class="mid__top">
            <div class="two-cols">
              <div class="two-cols flex-1">
                <span class="popup__field flex-1">
                  <label class="label-input"
                    >{{ $_MResource[$_LANG_CODE].accountPage.accountList.accountCode
                    }}<span class="star-red">*</span></label
                  >

                  <m-input
                    ref="AccountCode"
                    type="text"
                    :maxLength="20"
                    :title="errors.AccountCode"
                    :listenObj="errors"
                    :isInvalid="Object.keys(errors).includes('AccountCode')"
                    v-model="inputAccount.AccountCode"
                  ></m-input>
                </span>
                <div class="flex-1"></div>
              </div>

              <div class="flex-1"></div>
            </div>

            <div class="two-cols">
              <div class="popup__field flex-1">
                <label class="label-input"
                  >{{ $_MResource[$_LANG_CODE].accountPage.accountList.accountName
                  }}<span class="star-red">*</span></label
                >
                <m-input
                  ref="AccountName"
                  type="text"
                  :maxLength="100"
                  v-model="inputAccount.AccountName"
                  :title="errors.AccountName"
                  :listenObj="errors"
                  :isInvalid="Object.keys(errors).includes('AccountName')"
                ></m-input>
              </div>
              <div class="popup__field flex-1">
                <label class="label-input">{{ $_MResource[$_LANG_CODE].accountPage.accountList.englishName }}</label>
                <m-input
                  ref="AccountEnglishName"
                  type="text"
                  :maxLength="100"
                  v-model="inputAccount.AccountEnglishName"
                ></m-input>
              </div>
            </div>

            <div class="two-cols">
              <div class="two-cols flex-1">
                <span class="popup__field flex-1">
                  <label class="label-input">{{
                    $_MResource[$_LANG_CODE].accountPage.accountList.parentAccount
                  }}</label>

                  <m-combobox
                    ref="AccountParentId"
                    :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                    :listSelections="listSelections"
                    :data="inputAccount"
                    :cols="cols"
                    :reloadList="searchAccount"
                    @handleLazyLoad="async (input) => await handleLazyLoadAccount(input)"
                    :widthBoardValue="216"
                    idFieldList="AccountId"
                    idFieldObj="AccountParentId"
                    displayField="AccountParentCode"
                    treeField="Grade"
                  ></m-combobox>
                </span>
                <span class="popup__field flex-1">
                  <label class="label-input"
                    >{{ $_MResource[$_LANG_CODE].accountPage.accountList.nature }}<span class="star-red">*</span></label
                  >

                  <m-combobox
                    ref="AccountNature"
                    :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                    :listSelections="listAccountNature"
                    :data="inputAccount"
                    :reloadList="() => {}"
                    displayField="AccountNatureName"
                    idFieldList="AccountNatureId"
                    idFieldObj="AccountNature"
                    :cols="colsAccountNature"
                    :title="errors.AccountNature"
                    :listenObj="errors"
                    :isInvalid="Object.keys(errors).includes('AccountNature')"
                  ></m-combobox>
                </span>
              </div>

              <div class="flex-1"></div>
            </div>

            <span class="popup__field">
              <label class="label-input" :title="fields.title.identity">{{
                $_MResource[$_LANG_CODE].accountPage.accountList.description
              }}</label>

              <span class="wrapper-textarea">
                <textarea :maxlength="1000" v-model="inputAccount.AccountDescription"></textarea>
              </span>
            </span>
          </div>
          <div class="popup__bottom">
            <div class="bottom__dropdown">
              <div>
                <input type="checkbox" class="popup__checkbox" />
                <label class="ml-4">{{ $_MResource[$_LANG_CODE].accountPage.accountList.exceptionAccountant }}</label>
              </div>

              <div class="bottom__title">
                <span class="wrapper-icon">
                  <span class="icon-arrow-down--filled"></span>
                </span>
                <span class="title__text"> {{ $_MResource[$_LANG_CODE].accountPage.accountDetail.detailInspect }}</span>
              </div>
            </div>

            <div class="bottom__data">
              <div class="bottom__col">
                <div class="col__row">
                  <span class="row__title">
                    <input
                      type="checkbox"
                      class="popup__checkbox"
                      id="check-obj"
                      v-model="detailAccount.object"
                      @click="setDefalultObject(!detailAccount.object)"
                    />
                    <label style="cursor: pointer" for="check-obj">{{
                      $_MResource[$_LANG_CODE].accountPage.accountDetail.object
                    }}</label>
                  </span>
                  <div class="wrapper-dropdown">
                    <m-combobox
                      ref="AccountObject"
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="!detailAccount.object"
                      readonly
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
                <div class="col__row">
                  <span class="row__title">
                    <input type="checkbox" class="popup__checkbox" />
                    <label>{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.objectTHCP }}</label>
                  </span>

                  <div class="wrapper-dropdown">
                    <m-combobox
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
                <div class="col__row">
                  <span class="row__title">
                    <input type="checkbox" class="popup__checkbox" />
                    <label>{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.order }}</label>
                  </span>
                  <div class="wrapper-dropdown">
                    <m-combobox
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
                <div class="col__row">
                  <span class="row__title">
                    <input type="checkbox" class="popup__checkbox" />
                    <label>{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.purchaseContract }}</label>
                  </span>
                  <div class="wrapper-dropdown">
                    <m-combobox
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
                <div class="col__row">
                  <span class="row__title">
                    <input type="checkbox" class="popup__checkbox" />
                    <label>{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.department }}</label>
                  </span>
                  <div class="wrapper-dropdown">
                    <m-combobox
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
              </div>
              <div class="bottom__col">
                <div class="col__row">
                  <input type="checkbox" class="popup__checkbox" />
                  <label class="plr-8">{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.bank }}</label>
                  <!-- <span class="row__title">
                  </span> -->
                  <!-- <div class="wrapper-dropdown">
                   <m-combobox
                     
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div> -->
                </div>
                <div class="col__row">
                  <span class="row__title">
                    <input type="checkbox" class="popup__checkbox" />
                    <label>{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.construction }}</label>
                  </span>
                  <div class="wrapper-dropdown">
                    <m-combobox
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
                <div class="col__row">
                  <span class="row__title">
                    <input type="checkbox" class="popup__checkbox" />
                    <label>{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.paymentContract }}</label>
                  </span>
                  <div class="wrapper-dropdown">
                    <m-combobox
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
                <div class="col__row">
                  <span class="row__title">
                    <input type="checkbox" class="popup__checkbox" />
                    <label>{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.itemCP }}</label>
                  </span>
                  <div class="wrapper-dropdown">
                    <m-combobox
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
                <div class="col__row">
                  <span class="row__title">
                    <input
                      type="checkbox"
                      class="popup__checkbox"
                      @keydown.prevent.stop="onTabNextTo($event, 'addBtn')"
                    />
                    <label>{{ $_MResource[$_LANG_CODE].accountPage.accountDetail.code }}</label>
                  </span>
                  <div class="wrapper-dropdown">
                    <m-combobox
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listAccountObject"
                      :data="inputAccount"
                      :reloadList="() => {}"
                      displayField="AccountObjectName"
                      idFieldList="AccountObjectId"
                      idFieldObj="AccountObject"
                      :cols="colsAccountObject"
                      :disable="true"
                      :inputClass="{
                        invalid: Object.keys(errors).includes('AccountObject') && !inputAccount.AccountObject,
                      }"
                    ></m-combobox>
                  </div>
                </div>
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
            @keydown.prevent.stop="onTabNextTo($event, 'AccountCode')"
            :textBtnClick="closeForm"
            singleBtn
            typeBtn="sub-btn"
            ref="cancelBtn"
            >{{ $_MResource[$_LANG_CODE].button.cancel }}</m-button
          >
        </div>
        <div class="footer--right">
          <m-button
            @keydown.prevent.stop="onTabNextTo($event, 'saveAndNew')"
            typeBtn="sub-btn"
            singleBtn
            ref="addBtn"
            :title="$_MResource[$_LANG_CODE].shortcut.save"
            :textBtnClick="() => onSaveBtn(inputAccount)"
          >
            {{ $_MResource[$_LANG_CODE].button.save }}</m-button
          >

          <!-- <button type="button" class="base-btn regular-btn ml-8">
            <span class="btn__text">Cất và Thêm</span>
          </button> -->
          <m-button
            @keydown.prevent.stop="onTabNextTo($event, 'cancelBtn')"
            singleBtn
            ref="saveAndNew"
            typeBtn="regular-btn"
            :textBtnClick="async () => await onSaveAndNew(inputAccount)"
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
    <span v-for="(key, index) in Object.keys(errors)" :key="index">
      <ul class="list-error">
        <li
          v-for="(item, index) in errors[key]"
          :key="index"
          :class="{ 'list-style-none': Object.keys(errors).length < 2 }"
        >
          {{ item }}
        </li>
      </ul>
    </span>
  </m-dialog>

  <m-dialog
    v-if="isShowMajor"
    @onCancel="() => onCloseWarningDialog()"
    @onSuccess="() => onCloseWarningDialog()"
    title="Thông báo"
    iconClass="icon-warning"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    <span v-for="(key, index) in Object.keys(errors)" :key="index">
      <ul class="list-error">
        <li
          v-for="(item, index) in errors[key]"
          :key="index"
          :class="{ 'list-style-none': Object.keys(errors).length < 2 }"
        >
          {{ item }}
        </li>
      </ul>
    </span>
  </m-dialog>

  <m-dialog
    v-if="isShowQuestionDialog"
    @onCancel="onCloseQuestionDialog"
    @onSuccess="async () => await onSuccessQuestionDialog(inputAccount)"
    @onRefuse="onCloseForm"
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
import AccountService from "@/services/AccountService";
import getNotEmtpyNull from "@/utils/getNotEmtpyNull";

import MEnum from "@/scripts/enum";
export default {
  name: "AccountDetail",

  data() {
    return {
      fields: this.$_MResource[this.$_LANG_CODE].fields,
      errors: {},
      maxLength: { ...this.$_MResource[this.$_LANG_CODE].maxLength },
      inputAccount: {},
      fieldsAccountForm: { ...this.$_MResource[this.$_LANG_CODE].fieldsAccountForm },
      listSelections: [],
      isShowMajor: false,
      querySearchAccount: "",
      pageLazyLoad: 1,
      isShowQuestionDialog: false,
      listAccountNature: this.$_MResource[this.$_LANG_CODE].listAccountNature,
      listAccountObject: this.$_MResource[this.$_LANG_CODE].listAccountObject,
      detailAccount: {
        object: false,
      },
      isShowDialog: false,
      timeOutTypeSearch: null,

      colsAccountNature: [
        {
          key: 0,
          width: 100,
          fieldList: "AccountNatureName",
          fieldObj: "AccountNatureName",
        },
      ],
      colsAccountObject: [
        {
          key: 0,
          width: 100,
          fieldList: "AccountObjectName",
          fieldObj: "AccountObjectName",
        },
      ],

      cols: [
        {
          key: 0,
          width: 33,
          name: "Số tài khoản",
          fieldList: "AccountCode",
          fieldObj: "AccountParentCode",
        },
        {
          key: 1,
          width: 66,
          name: "Tên tài khoản",
          fieldList: "AccountName",
        },
      ],
      orderRef: ["AccountCode", "AccountName", "AccountNature"],
    };
  },

  props: {
    account: Object,
    onCloseForm: Function,
    mode: Number,
    onShowForm: Function,
    onShowToast: Function,
    reloadData: Function,
  },

  computed: {
    getFormName: function () {
      if (this.mode == this.$_MEnum.FormMode.add) {
        return this.$_MResource[this.$_LANG_CODE].addAccountForm.name;
      } else if (this.mode == this.$_MEnum.FormMode.detail) {
        return this.$_MResource[this.$_LANG_CODE].detailAccountForm.name;
      }
      return "";
    },
  },

  methods: {
    /**
     * Mô tả: sự kiện tab đến ô tiếp theo
     * created by : ttanh (14-08-2023)
     */
    onTabNextTo($event, ref) {
      if ($event.keyCode == this.$_MEnum.Key.tab) {
        if (this.$refs[ref]) this.$refs[ref].focus();
      }
    },
    /**
     * Mô tả: chấp nhận lưu
     * created by : ttanh (13-08-2023)
     */
    async onSuccessQuestionDialog(inputAccount) {
      await this.onSaveBtn(inputAccount);
      this.onCloseQuestionDialog();
    },
    /**
     * Mô tả: sự kiện đóng form
     * created by : ttanh (13-08-2023)
     */
    closeForm() {
      let accountStr = JSON.stringify(getNotEmtpyNull(this.account));
      let inputAccountStr = JSON.stringify(getNotEmtpyNull(this.inputAccount));
      if (accountStr == inputAccountStr) {
        this.onCloseForm();
      } else {
        this.isShowQuestionDialog = true;
      }
    },

    /**
     * Mô tả: đóng question dialog
     * created by : ttanh (13-08-2023)
     */
    onCloseQuestionDialog() {
      this.isShowQuestionDialog = false;
    },
    /**
     * Mô tả: dặt mặc định cho đối tượng của tài khoản
     * created by : ttanh (12-08-2023)
     */
    setDefalultObject(isSet) {
      if (isSet) {
        this.inputAccount.AccountObject = 0;
        this.inputAccount.AccountObjectName = this.$_MResource[this.$_LANG_CODE].accountPage.accountDetail.provider;
      } else {
        this.inputAccount.AccountObject = null;
        this.inputAccount.AccountObjectName = "";
      }
    },

    /**
     * Mô tả: xử lý lazy load
     * created by : ttanh (12-08-2023)
     */
    async handleLazyLoadAccount(querySearch) {
      if (this.pageLazyLoad == 1) {
        ++this.pageLazyLoad;
      }
      let query = `?pageSize=${20}&pageIndex=${this.pageLazyLoad}`;
      if (querySearch) {
        query += `&inputSearch=${querySearch}`;
      }
      const res = await AccountService.getList(query);
      if (res.Data?.length > 0) {
        this.listSelections = [...this.listSelections, ...res.Data];
        ++this.pageLazyLoad;
      }
    },

    /**
     * Mô tả: tìm kiếm tài khoản
     * created by : ttanh (12-08-2023)
     */
    searchAccount(value) {
      this.pageLazyLoad = 1;
      let query = `?pageSize=20&pageIndex=${this.pageLazyLoad}`;
      if (value) {
        clearTimeout(this.timeOutTypeSearch);

        this.timeOutTypeSearch = setTimeout(() => {
          query += `&inputSearch=${value}`;
          AccountService.getList(query)
            .then((res) => {
              this.listSelections = [...res.Data];
            })
            .catch((e) => {
              console.log(e);
            });
        }, 300);
      } else {
        AccountService.getList(query).then((res) => {
          this.listSelections = [...res.Data];
        });
      }

      // this.listSelections = [...res.Data];
    },

    /**
     * Mô tả: validate các trường không được để trống
     * created by : ttanh (12-08-2023)
     */
    validateEmtpyField(keys, inputAccount) {
      keys.map((key) => {
        if (inputAccount[key] === null || inputAccount[key] === "" || inputAccount[key] === undefined) {
          this.errors[key] = [`${this.fieldsAccountForm[key]} không được để trống`];
        }
      });
    },

    /**
     * Mô tả: validate form
     * created by : ttanh (12-08-2023)
     */
    validateForm(inputAccount) {
      this.errors = {};
      if (this.inputAccount.AccountCode?.length < 3) {
        this.errors.AccountCode = [
          this.$_MResource[this.$_LANG_CODE].accountPage.accountDetail.invalidLengthAccountCode,
        ];
      } else if (this.inputAccount.AccountCode?.length > 3 && !this.inputAccount.AccountParentCode) {
        this.errors.AccountCode = [
          this.$_MResource[this.$_LANG_CODE].accountPage.accountDetail.invalidAccountCodeAndParent,
        ];
      }
      this.validateEmtpyField(["AccountCode", "AccountName", "AccountNature"], inputAccount);

      if (Object.keys(this.errors).length > 0) {
        return;
      }
      if (
        inputAccount.AccountParentCode &&
        inputAccount.AccountCode &&
        !inputAccount.AccountCode.startsWith(inputAccount.AccountParentCode)
      ) {
        this.errors.AccountCode = [
          this.$_MResource[this.$_LANG_CODE].accountPage.accountDetail.inValidFormatAccountCode,
        ];
        return;
      }

      if (this.mode == MEnum.FormMode.detail && this.inputAccount.AccountId == this.inputAccount.AccountParentId) {
        this.errors.AccountCode = [this.$_MResource[this.$_LANG_CODE].accountPage.accountDetail.notChooseSelf];
      }

      // if (
      //   this.inputAccount.AccountCode &&
      //   this.inputAccount.AccountParentCode &&
      //   this.inputAccount.AccountCode.length - this.inputAccount.AccountParentCode.length > 1
      // ) {
      //   this.errors.AccountCode = [
      //     this.$_MResource[this.$_LANG_CODE].accountPage.accountDetail.invalidLengthAccountAndParent,
      //   ];
      //   return;
      // }
    },

    /**
     * Mô tả: đóng thông báo
     * created by : ttanh (17-08-2023)
     */
    onCloseWarningDialog() {
      this.isShowDialog = false;
      this.isShowMajor = false;
      for (let i = 0; i < this.orderRef.length; ++i) {
        if (Object.keys(this.errors).includes(this.orderRef[i])) {
          this.$refs[this.orderRef[i]]?.focus();
          break;
        }
      }
    },

    /**
     * Mô tả: lưu và tạo mới form
     * created by : ttanh (17-08-2023)
     */
    async onSaveAndNew(inputAccount) {
      this.validateForm(inputAccount);

      if (Object.keys(this.errors).length > 0) {
        this.isShowDialog = true;
      } else if (this.mode == this.$_MEnum.FormMode.add) {
        try {
          inputAccount.AccountStatus = true;
          await AccountService.createObj(inputAccount);
          this.onShowToast(this.$_MResource[this.$_LANG_CODE].accountPage.accountDetail.addSuccess);
          await this.reloadData();
        } catch (e) {
          this.errors = { ...e };
          this.isShowMajor = true;
        }
      } else if (this.mode == this.$_MEnum.FormMode.detail) {
        try {
          await AccountService.updateObj(this.account.AccountId, inputAccount);
          this.onShowToast(this.$_MResource[this.$_LANG_CODE].accountPage.accountDetail.changeSuccess);
          await this.reloadData();
        } catch (e) {
          this.errors = { ...e };
          this.isShowMajor = true;
        }
      }

      if (Object.keys(this.errors).length == 0) {
        this.onShowForm(0, {});
        this.inputAccount = {};
      }
    },

    /**
     * Mô tả: sự kiện lưu
     * created by : ttanh (17-08-2023)
     */
    async onSaveBtn(inputAccount) {
      await this.onSaveAndNew(inputAccount);
      if (Object.keys(this.errors).length == 0) {
        this.onCloseForm();
      }
    },
  },

  mounted() {
    this.$refs.AccountCode.focus();
    this.inputAccount = { ...this.account };
    console.log(this.inputAccount);
    if (this.inputAccount.AccountObject != null && this.inputAccount.AccountObject != undefined) {
      this.detailAccount.object = true;
    }
    this.listAccountNature.map((item) => {
      if (item.AccountNatureId == this.inputAccount.AccountNature) {
        this.inputAccount.AccountNatureName = item.AccountNatureName;
      }
    });
    this.listAccountObject.map((item) => {
      if (item.AccountObjectId == this.inputAccount.AccountObject) {
        this.inputAccount.AccountObjectName = item.AccountObjectName;
      }
    });

    let query = `?pageSize=20&pageIndex=1`;
    AccountService.getList(query).then((res) => {
      this.listSelections = [...res.Data];
      // this.inputAccount.AccountParentCode = this.listSelections.find(
      //   (item) => item.AccountId == this.inputAccount.AccountParentId
      // )?.AccountCode;
    });
    if (this.inputAccount.AccountParentId && !this.inputAccount.AccountParentCode) {
      AccountService.getById(this.inputAccount.AccountParentId).then((res) => {
        this.inputAccount.AccountParentCode = res.Data.AccountCode;
      });
    }

    // AccountService.getSortedAccount(1, 12).then((res) => {
    //   Object.keys(res.Data).map((key) => {
    //     this.listSelections.push(...res.Data[key]);
    //   });
    // });
  },
};
</script>

<style>
.list-style-none {
  list-style: none;
}
</style>
