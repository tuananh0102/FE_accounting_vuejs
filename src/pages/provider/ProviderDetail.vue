<template>
  <div class="overlay" ref="overlay"></div>
  <div class="detail-staff__container provider__container">
    <div class="popup">
      <MLoading v-if="provider.isLoadingPage"></MLoading>
      <div class="popup__main">
        <div class="popup__top">
          <span class="popup__top-left">
            <h3 class="popup__header">{{ formName }}</h3>
            <input
              ref="customerCheckbox"
              class="popup__checkbox"
              type="radio"
              name="object"
              :value="false"
              v-model="provider.inputObj.ProviderIsPrivate"
            />
            <label class="checkbox__label">{{ MResource.vi.providerPage.organization }}</label>
            <input
              class="popup__checkbox"
              type="radio"
              name="object"
              :value="true"
              v-model="provider.inputObj.ProviderIsPrivate"
            />
            <label class="checkbox__label">{{ MResource.vi.providerPage.private }}</label>
          </span>
          <span class="popup__top-right">
            <span class="customer-checkbox">
              <input class="popup__checkbox" type="checkbox" name="customer" v-model="provider.inputObj.IsCustomer" />
              <label class="checkbox__label">{{ MResource.vi.providerPage.isCustomer }}</label>
            </span>
            <i :title="$_MResource[$_LANG_CODE].titleIcon.help" tabindex="0" class="icon-question"></i>
            <span
              :title="$_MResource[$_LANG_CODE].titleIcon.close"
              tabindex="0"
              class="popup__icon"
              @click="onCloseForm"
              ><i class="icon-close"></i
            ></span>
          </span>
        </div>

        <div class="popup__mid" v-if="!provider.inputObj.ProviderIsPrivate">
          <div class="two-cols">
            <div class="col-left">
              <div class="two-cols">
                <span class="popup__field flex-1">
                  <label class="label-input">{{ fields.ProviderTaxCode }} </label>

                  <m-input
                    :isFocus="!provider.inputObj.ProviderIsPrivate"
                    :ref="refs.ProviderTaxCode"
                    type="text"
                    v-model="provider.inputObj.ProviderTaxCode"
                    :maxLength="20"
                    :class="{
                      invalid:
                        Object.keys(provider.errors)?.includes('ProviderTaxCode') && !provider.inputObj.ProviderTaxCode,
                    }"
                  ></m-input>
                </span>

                <span class="popup__field flex-1dot5 ml-8">
                  <label class="label-input">{{ fields.ProviderCode }} <span class="star-red">*</span></label>

                  <m-input
                    ref="ProviderCode1"
                    type="text"
                    :title="provider.errors.ProviderCode"
                    :maxLength="19"
                    v-model="provider.inputObj.ProviderCode"
                    :class="{ invalid: Object.keys(provider.errors)?.includes('ProviderCode') && isFailProviderCode }"
                  ></m-input>
                </span>
              </div>

              <div class="popup__field">
                <label class="label-input">{{ fields.ProviderName }} <span class="star-red">*</span></label>
                <m-input
                  ref="ProviderName1"
                  type="text"
                  :title="provider.errors.ProviderName"
                  :maxLength="254"
                  v-model="provider.inputObj.ProviderName"
                  :class="{
                    invalid: Object.keys(provider.errors)?.includes('ProviderName') && !provider.inputObj.ProviderName,
                  }"
                ></m-input>
              </div>
              <div class="popup__field">
                <label class="label-input">{{ fields.ProviderAddress }}</label>
                <span class="wrapper-textarea">
                  <textarea maxLength="255" v-model="provider.inputObj.ProviderAddress"></textarea>
                </span>
              </div>
            </div>
            <div class="col-right">
              <div class="two-cols">
                <span class="popup__field flex-1">
                  <label class="label-input">{{ fields.ProvidePhone }} </label>

                  <m-input
                    :maxLength="20"
                    ref="ProviderPhone"
                    type="text"
                    v-model="provider.inputObj.ProviderPhone"
                  ></m-input>
                </span>

                <span class="popup__field flex-1dot5 ml-8">
                  <label class="label-input">{{ fields.ProviderWebsite }}</label>

                  <m-input
                    ref="ProviderWebsite"
                    :maxLength="255"
                    type="text"
                    v-model="provider.inputObj.ProviderWebsite"
                  ></m-input>
                </span>
              </div>

              <div class="popup__field">
                <label class="label-input">{{ fields.ListGroupId }}</label>
                <!-- <m-input ref="ListGroupId" type="text" v-model="provider.inputObj.ListGroupId"></m-input> -->
                <MMulSelectCombobox
                  listDisplayFieldName="ListGroupCode"
                  :data="groupData"
                  :headers="comboboxHeader"
                  idField="GroupId"
                  :obj="provider.inputObj"
                  listIdName="ListGroupId"
                  @onChangeInput="(input) => (inputSearch = input)"
                />
              </div>
              <div class="popup__field">
                <label class="label-input">{{ fields.EmployeeId }}</label>

                <m-combobox
                  :listenObj="provider.errors"
                  :isInvalid="Object.keys(provider.errors).includes('EmployeeId')"
                  :ref="orderRefs.EmployeeId"
                  :title="provider.errors.EmployeeId"
                  :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                  :listSelections="provider.employeeList"
                  :data="provider.inputObj"
                  :cols="cols"
                  @handleLazyLoad="async (input) => await provider.handleLazyLoadEmployee(input)"
                  :reloadList="provider.searchEmployee"
                  :widthBoardValue="100"
                  idFieldList="EmployeeId"
                  idFieldObj="EmployeeId"
                  displayField="FullName"
                  :isLoading="provider.isLoadingCombobox"
                ></m-combobox>
              </div>
            </div>
          </div>
        </div>

        <div class="popup__mid" v-if="provider.inputObj.ProviderIsPrivate">
          <div class="two-cols">
            <div class="col-left">
              <div class="two-cols">
                <span class="popup__field flex-1dot5">
                  <label class="label-input">{{ fields.ProviderCode }} <span class="star-red">*</span></label>

                  <m-input
                    :isFocus="true"
                    ref="ProviderCode2"
                    :title="provider.errors.ProviderCode"
                    type="text"
                    v-model="provider.inputObj.ProviderCode"
                    :class="{ invalid: Object.keys(provider.errors)?.includes('ProviderCode') && isFailProviderCode }"
                  ></m-input>
                </span>

                <span class="popup__field flex-1 ml-8">
                  <label class="label-input">{{ fields.ProviderTaxCode }} </label>

                  <m-input
                    ref="ProviderTaxCode"
                    type="text"
                    :maxLength="20"
                    v-model="provider.inputObj.ProviderTaxCode"
                    :class="{
                      invalid:
                        Object.keys(provider.errors)?.includes('ProviderTaxCode') && !provider.inputObj.ProviderTaxCode,
                    }"
                  ></m-input>
                </span>
              </div>

              <div class="popup__field">
                <label class="label-input">{{ fields.ProviderName }} <span class="star-red">*</span></label>
                <div class="two-cols">
                  <span class="popup__field flex-1">
                    <!-- <m-input type="text"></m-input> -->

                    <m-combobox
                      placeholder="Xưng hô"
                      :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                      :listSelections="listSalutation"
                      :data="provider.inputObj"
                      :reloadList="() => {}"
                      displayField="ContactSalutation"
                      idFieldList="ContactSalutation"
                      idFieldObj="ContactSalutation"
                      :cols="ContactSalutation"
                    ></m-combobox>
                  </span>

                  <span class="popup__field flex-1dot5 ml-8">
                    <m-input
                      ref="ProviderName2"
                      :title="provider.errors.ProviderName"
                      type="text"
                      :maxLength="255"
                      v-model="provider.inputObj.ProviderName"
                      :class="{
                        invalid:
                          Object.keys(provider.errors)?.includes('ProviderName') && !provider.inputObj.ProviderName,
                      }"
                    ></m-input>
                  </span>
                </div>
              </div>

              <div class="popup__field">
                <label class="label-input">{{ fields.ProviderAddress }}</label>
                <span class="wrapper-textarea">
                  <textarea maxLength="255" v-model="provider.inputObj.ProviderAddress"></textarea>
                </span>
              </div>
            </div>
            <div class="col-right">
              <div class="popup__field">
                <label class="label-input">{{ fields.ListGroupId }}</label>
                <!-- <m-input ref="ListGroupId" type="text" v-model="provider.inputObj.ListGroupId"></m-input> -->
                <MMulSelectCombobox
                  listDisplayFieldName="ListGroupCode"
                  :data="groupData"
                  :headers="comboboxHeader"
                  idField="GroupId"
                  :obj="provider.inputObj"
                  listIdName="ListGroupId"
                  @onChangeInput="(input) => (inputSearch = input)"
                />
              </div>
              <div class="popup__field">
                <label class="label-input">{{ fields.EmployeeId }}</label>
                <!-- <m-input ref="EmployeeId" type="text" v-model="provider.inputObj.EmployeeId"></m-input> -->
                <m-combobox
                  :listenObj="provider.errors"
                  :isInvalid="Object.keys(provider.errors).includes('EmployeeId')"
                  :ref="orderRefs.EmployeeId"
                  :title="provider.errors.EmployeeId"
                  :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                  :listSelections="provider.employeeList"
                  :data="provider.inputObj"
                  :cols="cols"
                  @handleLazyLoad="async (input) => await provider.handleLazyLoadEmployee(input)"
                  :reloadList="provider.searchEmployee"
                  :widthBoardValue="100"
                  idFieldList="EmployeeId"
                  idFieldObj="EmployeeId"
                  displayField="FullName"
                ></m-combobox>
              </div>
            </div>
          </div>
        </div>

        <div class="popup__options">
          <div class="options__title">
            <div
              class="btn-title"
              @click="() => onChangeIndexInfo(0)"
              :class="{ isSelected: currentIndexMoreInfo == 0 }"
            >
              <p class="title">{{ MResource.vi.providerPage.contactInfo }}</p>
            </div>
            <div
              class="btn-title"
              @click="() => onChangeIndexInfo(1)"
              :class="{ isSelected: currentIndexMoreInfo == 1 }"
            >
              <p class="title">{{ MResource.vi.providerPage.rulePayment }}</p>
            </div>
            <div
              class="btn-title"
              @click="() => onChangeIndexInfo(2)"
              :class="{ isSelected: currentIndexMoreInfo == 2 }"
            >
              <p class="title">{{ MResource.vi.providerPage.bank }}</p>
            </div>
            <div
              class="btn-title"
              @click="() => onChangeIndexInfo(3)"
              :class="{ isSelected: currentIndexMoreInfo == 3 }"
            >
              <p class="title">{{ MResource.vi.providerPage.otherAddress }}</p>
            </div>
            <div
              class="btn-title"
              @click="() => onChangeIndexInfo(4)"
              :class="{ isSelected: currentIndexMoreInfo == 4 }"
            >
              <p class="title">{{ MResource.vi.providerPage.note }}</p>
            </div>
          </div>
          <div class="options__information" :class="{ 'table-scroll': currentIndexMoreInfo == 2 }">
            <!-- thông tin liên hệ -->
            <div
              class="contact-container two-cols"
              v-if="currentIndexMoreInfo == 0 && !provider.inputObj.ProviderIsPrivate && !provider.inputObj.IsCustomer"
            >
              <div class="col-left">
                <div>
                  <label class="label-input">{{ MResource.vi.providerPage.contactPerson }}</label>
                  <div class="two-cols">
                    <span class="popup__field flex-1">
                      <!-- <m-input type="text"></m-input> -->
                      <m-combobox
                        placeholder="Xưng hô"
                        :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                        :listSelections="listSalutation"
                        :data="provider.inputObj"
                        :reloadList="() => {}"
                        displayField="ContactSalutation"
                        idFieldList="ContactSalutation"
                        idFieldObj="ContactSalutation"
                        :cols="ContactSalutation"
                      ></m-combobox>
                    </span>

                    <span class="popup__field flex-1dot5 ml-8">
                      <m-input
                        v-model="provider.inputObj.ContactFullName"
                        type="text"
                        :maxLength="50"
                        :placeholder="MResource.vi.providerPage.fullName"
                      ></m-input>
                    </span>
                  </div>
                </div>

                <div class="popup__field">
                  <m-input
                    v-model="provider.inputObj.ContactEmail"
                    :maxLength="100"
                    type="text"
                    placeholder="Email"
                  ></m-input>
                </div>
                <div class="two-cols">
                  <span class="popup__field flex-1">
                    <m-input
                      v-model="provider.inputObj.ContactPhone"
                      :maxLength="20"
                      type="text"
                      :placeholder="MResource.vi.providerPage.phone"
                    ></m-input>
                  </span>

                  <span class="popup__field flex-1 ml-8"> </span>
                </div>
              </div>
              <div class="col-right">
                <label class="label-input">{{ MResource.vi.providerPage.presentation }}</label>
                <div class="popup__field">
                  <m-input
                    @keydown.tab.prevent.stop="onTabNextTo($event, 'saveBtn')"
                    v-model="provider.inputObj.ContactRepresent"
                    type="text"
                    :maxLength="100"
                    :placeholder="MResource.vi.providerPage.presentation"
                  ></m-input>
                </div>
              </div>
            </div>

            <!-- tổ chức + khách hàng -->
            <div
              class="contact-container two-cols"
              v-if="currentIndexMoreInfo == 0 && !provider.inputObj.ProviderIsPrivate && provider.inputObj.IsCustomer"
            >
              <div class="col-left">
                <div>
                  <label class="label-input">{{ MResource.vi.providerPage.contactPerson }}</label>
                  <div class="two-cols">
                    <span class="popup__field flex-1">
                      <!-- <m-input type="text"></m-input> -->
                      <m-combobox
                        :placeholder="MResource.vi.providerPage.contactSalutation"
                        :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                        :listSelections="listSalutation"
                        :data="provider.inputObj"
                        :reloadList="() => {}"
                        displayField="ContactSalutation"
                        idFieldList="ContactSalutation"
                        idFieldObj="ContactSalutation"
                        :cols="ContactSalutation"
                      ></m-combobox>
                    </span>

                    <span class="popup__field flex-1dot5 ml-8">
                      <m-input
                        v-model="provider.inputObj.ContactFullName"
                        type="text"
                        :maxLength="100"
                        :placeholder="MResource.vi.providerPage.fullName"
                      ></m-input>
                    </span>
                  </div>
                </div>

                <div class="popup__field">
                  <m-input
                    :maxLength="100"
                    v-model="provider.inputObj.ContactEmail"
                    type="text"
                    placeholder="Email"
                  ></m-input>
                </div>
                <div class="two-cols">
                  <span class="popup__field flex-1">
                    <m-input
                      :maxLength="20"
                      v-model="provider.inputObj.ContactPhone"
                      type="text"
                      :placeholder="MResource.vi.providerPage.phone"
                    ></m-input>
                  </span>

                  <span class="popup__field flex-1 ml-8"> </span>
                </div>
                <div class="popup__field">
                  <label class="label-input">{{ MResource.vi.providerPage.presentation }}</label>
                  <m-input
                    v-model="provider.inputObj.ContactRepresent"
                    type="text"
                    :maxLength="100"
                    :placeholder="MResource.vi.providerPage.presentation"
                  ></m-input>
                </div>
              </div>
              <div class="col-right">
                <label class="label-input">{{ MResource.vi.providerPage.receiver }}</label>
                <div class="popup__field">
                  <m-input
                    :maxLength="50"
                    v-model="provider.inputObj.ReceiverName"
                    type="text"
                    :placeholder="MResource.vi.providerPage.fullName"
                  ></m-input>
                  <div class="popup__field">
                    <m-input
                      v-model="provider.inputObj.ReceiverEmails"
                      type="text"
                      :maxLength="255"
                      :placeholder="MResource.vi.providerPage.emails"
                    ></m-input>
                  </div>
                  <div class="popup__field">
                    <m-input
                      v-model="provider.inputObj.ReceiverPhone"
                      type="text"
                      :maxLength="20"
                      :placeholder="MResource.vi.providerPage.phone"
                    ></m-input>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->

            <div
              class="contact-container two-cols"
              v-if="currentIndexMoreInfo == 0 && provider.inputObj.ProviderIsPrivate"
            >
              <div class="col-left">
                <div>
                  <label class="label-input">{{ MResource.vi.providerPage.contactInfo }}</label>

                  <div class="popup__field">
                    <m-input
                      :maxLength="100"
                      v-model="provider.inputObj.ContactEmail"
                      type="text"
                      placeholder="Email"
                    ></m-input>
                  </div>
                </div>

                <div class="two-cols">
                  <span class="popup__field flex-1">
                    <m-input
                      :maxlength="20"
                      v-model="provider.inputObj.ContactPhone"
                      type="text"
                      :placeholder="MResource.vi.providerPage.mobilePhone"
                    ></m-input>
                  </span>
                  <span class="popup__field flex-1 ml-8"> </span>
                </div>
                <div class="two-cols">
                  <span class="popup__field flex-1">
                    <m-input
                      :maxLength="20"
                      v-model="provider.inputObj.ContactPhoneLandline"
                      type="text"
                      :placeholder="MResource.vi.providerPage.phoneLandline"
                    ></m-input>
                  </span>
                  <span class="popup__field flex-1 ml-8"> </span>
                </div>
                <div class="popup__field">
                  <label class="label-input">{{ MResource.vi.providerPage.presentation }}</label>
                  <m-input
                    @keydown.tab.prevent.stop="onTabNextTo($event, 'saveBtn')"
                    :maxLength="50"
                    v-model="provider.inputObj.ContactRepresent"
                    type="text"
                    :placeholder="MResource.vi.providerPage.presentation"
                  ></m-input>
                </div>
              </div>
              <div class="col-right">
                <label class="label-input">{{ MResource.vi.providerPage.identify }}</label>
                <div class="two-cols">
                  <div class="popup__field flex-1">
                    <m-input
                      type="text"
                      :maxLength="50"
                      v-model="provider.inputObj.PersonIdentity"
                      :placeholder="MResource.vi.providerPage.identify"
                    ></m-input>
                  </div>
                  <span class="popup__field flex-1 ml-8"> </span>
                </div>
                <div class="two-cols">
                  <span class="popup__field flex-1">
                    <m-input
                      type="date"
                      v-model="provider.inputObj.PersonIdentityDate"
                      :placeholder="MResource.vi.providerPage.identifyDate"
                    ></m-input>
                  </span>
                  <span class="popup__field flex-1 ml-8"> </span>
                </div>
                <div class="popup__field">
                  <m-input
                    @keydown.tab.prevent.stop="onTabNextTo($event, 'saveBtn')"
                    :maxLength="254"
                    v-model="provider.inputObj.PersonIdentityAddress"
                    type="text"
                    :placeholder="MResource.vi.providerPage.issuedBy"
                  ></m-input>
                </div>
              </div>
            </div>

            <!-- điều khoản thanh toán -->
            <div class="payment-rule-container" v-if="currentIndexMoreInfo == 1">
              <div class="payment-rule__top">
                <div class="popup__field">
                  <label class="label-input">{{ MResource.vi.providerPage.rulePayment }}</label>
                  <m-combobox
                    :listenObj="provider.errors"
                    displayValueInput
                    :title="provider.errors.RulePaymentCode"
                    :isInvalid="Object.keys(provider.errors).includes('RulePaymentCode')"
                    :ref="orderRefs.RulePaymentCode"
                    :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                    :listSelections="listRulePayment"
                    :data="provider.inputObj"
                    :cols="colsRulePayment"
                    :reloadList="() => {}"
                    :widthBoardValue="200"
                    idFieldList="RulePaymentCode"
                    idFieldObj="RulePaymentCode"
                    displayField="RulePaymentName"
                  ></m-combobox>
                </div>
                <div class="popup__field">
                  <label class="label-input">{{ MResource.vi.providerPage.debtDay }}</label>
                  <m-input :maxLength="11" v-model="provider.inputObj.RulePaymentDebtDay" type="number"></m-input>
                </div>
                <div class="popup__field">
                  <label class="label-input">{{ MResource.vi.providerPage.maxDebt }}</label>
                  <m-input :maxLength="18" v-model="provider.inputObj.RulePaymentMaxDebt" type="number"></m-input>
                </div>
              </div>

              <div class="payment-rul__bottom">
                <div class="popup__field" v-if="provider.inputObj.IsCustomer">
                  <label class="label-input">{{ MResource.vi.providerPage.accountReceivers }}</label>
                  <!-- <m-input ref="PositionName" type="text"></m-input> -->
                  <m-combobox
                    :ref="orderRefs.AccountReceiveCode"
                    :title="provider.errors.AccountReceiveCode"
                    :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                    displayValueInput
                    :listenObj="provider.errors"
                    :isInvalid="Object.keys(provider.errors).includes('AccountReceiveCode')"
                    :listSelections="listCustomerAccount"
                    :data="provider.inputObj"
                    :cols="colsCustomerAccount"
                    :reloadList="async (inputSearch) => await searchCustomerAccount(inputSearch)"
                    :widthBoardValue="200"
                    idFieldList="AccountId"
                    idFieldObj="AccountReceiveId"
                    displayField="AccountReceiveCode"
                  ></m-combobox>
                </div>
                <div class="popup__field">
                  <label class="label-input">{{ MResource.vi.providerPage.accountDebt }}</label>
                  <!-- <m-input ref="PositionName" type="text"></m-input> -->
                  <m-combobox
                    @keydown.tab.prevent.stop="onTabNextTo($event, 'saveBtn')"
                    :ref="orderRefs.AccountPaymentCode"
                    :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                    displayValueInput
                    :title="provider.errors.AccountPaymentCode"
                    :listenObj="provider.errors"
                    :isInvalid="Object.keys(provider.errors).includes('AccountPaymentCode')"
                    :listSelections="listProviderAccount"
                    :data="provider.inputObj"
                    :cols="colsProviderAccount"
                    :reloadList="async (inputSearch) => await searchProviderAccount(inputSearch)"
                    :widthBoardValue="200"
                    idFieldList="AccountId"
                    idFieldObj="AccountPaymentId"
                    displayField="AccountPaymentCode"
                  ></m-combobox>
                </div>
              </div>
            </div>

            <!-- Ghi chú -->
            <div class="popup__field note-container" v-if="currentIndexMoreInfo == 4">
              <label class="label-input">{{ MResource.vi.providerPage.note }}</label>
              <span class="wrapper-textarea">
                <textarea
                  @keydown.tab.prevent.stop="onTabNextTo($event, 'saveBtn')"
                  :maxLength="1000"
                  v-model="provider.inputObj.ContactNote"
                ></textarea>
              </span>
            </div>

            <!-- tài khoản ngân hàng -->
            <div class="bank-container" v-if="currentIndexMoreInfo == 2">
              <table class="bank__table">
                <thead>
                  <tr>
                    <th class="width-150">{{ MResource.vi.providerPage.bankNumber }}</th>
                    <th class="width-200">{{ MResource.vi.providerPage.bankName }}</th>
                    <th class="width-200">{{ MResource.vi.providerPage.branch }}</th>
                    <th class="width-250">{{ MResource.vi.providerPage.city }}</th>
                    <th><div></div></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(account, index) in provider.inputObj.BankAccounts" :key="index">
                    <td>
                      <div class="popup__field">
                        <m-input :maxLength="100" v-model="account.BankAccountNumber" type="text"></m-input>
                      </div>
                    </td>
                    <td>
                      <div class="popup__field">
                        <m-input :maxLength="254" v-model="account.BankName" type="text"></m-input>
                      </div>
                    </td>
                    <td>
                      <div class="popup__field">
                        <m-input :maxLength="254" v-model="account.BankBranch" type="text"></m-input>
                      </div>
                    </td>
                    <td>
                      <div class="popup__field">
                        <m-input :maxLength="254" v-model="account.BankCity" type="text"></m-input>
                      </div>
                    </td>
                    <td>
                      <span class="wrapper-icon" @click="() => onDeleteBankAccount(index)">
                        <span class="icon-trash"></span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="bank_btns">
                <m-button
                  @keydown.tab.prevent.stop="onTabNextTo($event, 'deleteRowBtn')"
                  typeBtn="sub-btn"
                  singleBtn
                  ref="addBtn"
                  :textBtnClick="() => onAddBankAccount()"
                  >{{ MResource.vi.providerPage.addLine }}</m-button
                >
                <m-button
                  @keydown.tab.prevent.stop="onTabNextTo($event, 'saveBtn')"
                  :ref="refs.deleteRowBtn"
                  typeBtn="sub-btn"
                  singleBtn
                  class="mlr-12"
                  :textBtnClick="() => onDeleteBankAccount()"
                  >{{ MResource.vi.providerPage.deleteAllLine }}</m-button
                >
              </div>
            </div>

            <!-- địa chỉ khác -->
            <div class="address-container" v-if="currentIndexMoreInfo == 3">
              <div class="two-cols">
                <div class="col-left">
                  <p>{{ MResource.vi.providerPage.location }}</p>
                  <div class="two-cols mt-4">
                    <span class="popup__field flex-1">
                      <m-combobox
                        ref="ProviderCountryId"
                        :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                        :listSelections="listCountry"
                        :data="provider.inputObj"
                        idFieldObj="ProviderCountryId"
                        idFieldList="LocationId"
                        displayField="ProviderCountry"
                        :cols="colsCountry"
                        :reloadList="() => {}"
                        :placeholder="MResource.vi.providerPage.country"
                      ></m-combobox>
                    </span>

                    <span class="popup__field flex-1 ml-8">
                      <!-- <m-input ref="FullName" type="text"></m-input> -->
                      <m-combobox
                        ref="ProviderCityId"
                        :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                        :listSelections="listCity"
                        :data="provider.inputObj"
                        idFieldObj="ProviderCityId"
                        idFieldList="LocationId"
                        displayField="ProviderCity"
                        :cols="colsCity"
                        :reloadList="() => {}"
                        :placeholder="MResource.vi.providerPage.cityCombobox"
                      ></m-combobox>
                    </span>
                  </div>
                  <div class="two-cols">
                    <span class="popup__field flex-1">
                      <!-- <m-input ref="FullName" type="text"></m-input> -->
                      <m-combobox
                        ref="ProviderDistrict"
                        :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                        :listSelections="listDistrict"
                        :data="provider.inputObj"
                        idFieldObj="ProviderDistrictId"
                        idFieldList="LocationId"
                        displayField="ProviderDistrict"
                        :cols="colsDistrict"
                        :reloadList="() => {}"
                        :placeholder="MResource.vi.providerPage.district"
                      ></m-combobox>
                    </span>

                    <span class="popup__field flex-1 ml-8">
                      <!-- <m-input ref="FullName" type="text"></m-input> -->
                      <m-combobox
                        :urlIcon="require('@/assets/icon/angle-down-solid.svg')"
                        :listSelections="listVillage"
                        :data="provider.inputObj"
                        idFieldObj="ProviderVillageId"
                        idFieldList="LocationId"
                        displayField="ProviderVillage"
                        :cols="colsVillage"
                        :reloadList="() => {}"
                        :placeholder="MResource.vi.providerPage.wards"
                      ></m-combobox>
                    </span>
                  </div>
                </div>
                <div class="col-right">
                  <div class="display-flex">
                    <p>{{ MResource.vi.providerPage.addressShip }}</p>
                    <span class="display-flex ml-20">
                      <input
                        class="popup__checkbox mr-6"
                        type="checkbox"
                        name="customer"
                        :value="true"
                        v-model="isSameAddress"
                      />
                      <label class="checkbox__label">{{ MResource.vi.providerPage.sameAddressProvider }}</label>
                    </span>
                  </div>
                  <div class="table__address">
                    <table>
                      <tr v-for="(address, index) in provider.inputObj.AddressShips" :key="address.AddressShipId">
                        <td>
                          <div class="popup__field">
                            <m-input :maxLength="254" v-model="address.Address" type="text"></m-input>
                          </div>
                        </td>
                        <td>
                          <span class="wrapper-icon" @click="() => onDeleteAddressShip(index)">
                            <span class="icon-trash"></span>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="bank_btns mt-8">
                    <m-button
                      @keydown.tab.prevent.stop="onTabNextTo($event, 'deleteRowBtn')"
                      typeBtn="sub-btn"
                      singleBtn
                      :textBtnClick="() => onAddAddressShip()"
                      >{{ MResource.vi.providerPage.addLine }}</m-button
                    >
                    <m-button
                      @keydown.tab.prevent.stop="onTabNextTo($event, 'saveBtn')"
                      :ref="refs.deleteRowBtn"
                      typeBtn="sub-btn"
                      singleBtn
                      :textBtnClick="() => onDeleteAddressShip()"
                      class="mlr-12"
                      >{{ MResource.vi.providerPage.deleteAllLine }}</m-button
                    >
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
            @keydown.tab.prevent.stop="onTabNextTo($event, 'ProviderTaxCode')"
            :textBtnClick="onCloseForm"
            singleBtn
            typeBtn="sub-btn"
            :ref="refs.cancelBtn"
            >{{ $_MResource[$_LANG_CODE].button.cancel }}</m-button
          >
        </div>
        <div class="footer--right">
          <m-button
            @keydown.tab.prevent.stop="onTabNextTo($event, 'saveAndNewBtn')"
            typeBtn="sub-btn"
            singleBtn
            :ref="refs.saveBtn"
            :textBtnClick="async () => await onAddAndClose()"
          >
            {{ $_MResource[$_LANG_CODE].button.save }}</m-button
          >

          <!-- <button type="button" class="base-btn regular-btn ml-8">
            <span class="btn__text">Cất và Thêm</span>
          </button> -->
          <m-button
            @keydown.tab.prevent.stop="onTabNextTo($event, 'cancelBtn')"
            singleBtn
            :ref="refs.saveAndNewBtn"
            typeBtn="regular-btn"
            :textBtnClick="async () => await onAddAndNew()"
          >
            {{ $_MResource[$_LANG_CODE].button.saveAndNew }}</m-button
          >
        </div>
      </div>
    </div>
  </div>
  <m-dialog
    v-if="isShowQuestionDialog"
    @onCancel="onCloseQuestionDialog"
    @onSuccess="async () => await onAddAndClose()"
    @onRefuse="() => provider.closeForm()"
    :btnRefuse="$_MResource[$_LANG_CODE].button.refuse"
    :title="$_MResource[$_LANG_CODE].dialog.titleQuestionSave"
    iconClass="icon-question__blue"
    :btnCancle="$_MResource[$_LANG_CODE].button.cancel"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    {{ $_MResource[$_LANG_CODE].dialog.descQuestionSave }}
  </m-dialog>

  <m-dialog
    v-if="provider.isShowDialog && Object.keys(provider.errors).length > 0"
    @onCancel="onCloseDialog"
    @onSuccess="onCloseDialog"
    :title="$_MResource[$_LANG_CODE].dialog.title"
    :iconClass="{ 'icon-warning-red': true }"
    :btnSuccess="$_MResource[$_LANG_CODE].button.accept"
  >
    <span v-for="(error, index) in provider.errors" :key="index">
      <ul class="list-error">
        <li
          :class="{ 'list-style-none': Object.keys(provider.errors).length < 2 }"
          v-for="(item, index) in error"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </span>
  </m-dialog>
</template>

<script setup>
import { useProvider } from "@/stores/useProvider";
import { ref, onBeforeMount, watch, computed } from "vue";

import EmployeeService from "@/services/EmployeeService";
import GroupService from "@/services/GroupService";
import AccountService from "@/services/AccountService";
import getNotEmptyNull from "@/utils/getNotEmtpyNull";
import MMulSelectCombobox from "@/components/mul_select_combobox/MMulSelectCombobox.vue";
import formatDate from "@/utils/formatDate";

import { rulePayments } from "@/dbJson/rule_payment";
import LocationService from "@/services/LocationService";
import ProviderService from "@/services/ProviderService";
import MEnum from "@/scripts/enum";
import useListenKey from "@/composables/useListenKey";
import MLoading from "@/components/loading/MLoading.vue";

import MResource from "@/scripts/resource";

const provider = useProvider();
const currentIndexMoreInfo = ref(0);

const isShowQuestionDialog = ref(false);

const listProviderAccount = ref(new Array());
const listCustomerAccount = ref(new Array());
const listCountry = ref(new Array());
const listCity = ref(new Array());
const listDistrict = ref(new Array());
const listVillage = ref(new Array());
const isFailProviderCode = ref(true);

const ProviderName1 = ref(null);
const ProviderCode1 = ref(null);

const ProviderName2 = ref(null);
const ProviderCode2 = ref(null);

const isSameAddress = ref(false);

const orderRefs = {
  GroupProvider: ref(null),
  EmployeeId: ref(null),
  RulePaymentCode: ref(null),
  AccountReceiveCode: ref(null),
  AccountPaymentCode: ref(null),
};

/**
 * Mô tả: đóng thông báo
 * created by : ttanh (17-08-2023)
 */
function onCloseDialog() {
  for (let i = 0; i < Object.keys(orderRefs).length; ++i) {
    if (Object.keys(provider.errors).includes(Object.keys(orderRefs)[i])) {
      orderRefs[Object.keys(orderRefs)[i]]?.value.focus();
      break;
    }
  }
  if (Object.keys(provider.errors).includes("ProviderName")) {
    if (provider.inputObj.ProviderIsPrivate) {
      ProviderName2.value.focus();
    } else {
      ProviderName1.value.focus();
    }
  }
  if (Object.keys(provider.errors).includes("ProviderCode")) {
    if (provider.inputObj.ProviderIsPrivate) {
      ProviderCode2.value.focus();
    } else {
      ProviderCode1.value.focus();
    }
  }

  provider.closeDialog();
}

const formName = computed(() => {
  if (provider.formMode == 0) {
    return "Thêm nhà cung cấp";
  } else {
    return "Sửa nhà cung cấp";
  }
});

watch(isSameAddress, () => {
  if (isSameAddress.value) {
    provider.inputObj.AddressShips = [{ Address: provider.inputObj.ProviderAddress }];
  }
});

watch(
  () => provider.inputObj.ProviderAddress,
  (newValue, oldValue) => {
    if (isSameAddress.value) {
      if (
        provider.inputObj.AddressShips &&
        provider.inputObj.AddressShips[0] &&
        provider.inputObj.AddressShips[0].Address == oldValue
      ) {
        provider.inputObj.AddressShips[0].Address = newValue;
      }
    }
  }
);

watch(
  () => provider.inputObj.ProviderCode,
  (newValue) => {
    if (newValue == "") {
      isFailProviderCode.value = true;
    } else if (Object.keys(provider.errors).includes("ProviderCode")) {
      isFailProviderCode.value = false;
    }
  }
);

watch(
  () => provider.inputObj.ProviderCountryId,
  async (newValue) => {
    provider.inputObj.ProviderCityId = null;
    provider.inputObj.ProviderDistrictId = null;
    provider.inputObj.ProviderVillageId = null;

    provider.inputObj.ProviderCity = null;
    provider.inputObj.ProviderDistrict = null;
    provider.inputObj.ProviderVillage = null;
    listCity.value = await getListLocation(1, newValue);
  }
);

watch(
  () => provider.inputObj.ProviderCityId,
  async (newValue) => {
    provider.inputObj.ProviderDistrictId = null;
    provider.inputObj.ProviderVillageId = null;

    provider.inputObj.ProviderDistrict = null;
    provider.inputObj.ProviderVillage = null;

    listDistrict.value = await getListLocation(2, newValue);
  }
);

watch(
  () => provider.inputObj.ProviderDistrictId,
  async (newValue) => {
    provider.inputObj.ProviderVillageId = null;

    provider.inputObj.ProviderVillage = null;

    listVillage.value = await getListLocation(3, newValue);
  }
);

provider.ProviderVillage = computed(() => {
  const village = listVillage.value.find((item) => item.LocationId == provider.inputObj.ProviderVillageId);
  return village?.LocationName;
});

/**
 * Mô tả: lấy list vị trí địa lý
 * created by : ttanh (01-08-2023)
 */
const getListLocation = async (grade, parentId, querySearch) => {
  let query = `?grade=${grade}`;
  if (parentId) {
    query += `&parentId=${parentId}`;
  }
  if (querySearch) {
    query += `querySearch=${querySearch}`;
  }

  const res = await LocationService.getList(query);
  let location = [...res.Data];

  return location;
};

/**
 * Mô tả: đóng thông báo hỏi
 * created by : ttanh (17-08-2023)
 */
const onCloseQuestionDialog = () => {
  isShowQuestionDialog.value = false;
};

/**
 * Mô tả: thêm địa chỉ giao hàng
 * created by : ttanh (17-08-2023)
 */
const onAddAddressShip = () => {
  if (provider.inputObj.AddressShips && provider.inputObj.AddressShips.length > 0) {
    provider.inputObj.AddressShips.push({
      ...provider.inputObj.AddressShips[provider.inputObj.AddressShips.length - 1],
    });
  } else if (!provider.inputObj.AddressShips || provider.inputObj.AddressShips.length == 0) {
    provider.inputObj.AddressShips = [{}];
  }
};

/**
 * Mô tả: xóa địa chỉ giao hàng
 * created by : ttanh (17-08-2023)
 */
const onDeleteAddressShip = (index) => {
  if (index == null || index == undefined) {
    if (provider.inputObj.AddressShips && provider.inputObj.AddressShips.length > 0) {
      provider.inputObj.AddressShips.splice(0, provider.inputObj.AddressShips.length);
    }
  }

  if (provider.inputObj.AddressShips) {
    provider.inputObj.AddressShips.splice(index, 1);
  }
};

/**
 * Mô tả: thêm tài khoản ngân hàng
 * created by : ttanh (17-08-2023)
 */
const onAddBankAccount = () => {
  if (provider.inputObj.BankAccounts && provider.inputObj.BankAccounts.length > 0) {
    provider.inputObj.BankAccounts.push({
      ...provider.inputObj.BankAccounts[provider.inputObj.BankAccounts.length - 1],
    });
  } else if (!provider.inputObj.BankAccounts || provider.inputObj.BankAccounts.length == 0) {
    provider.inputObj.BankAccounts = [{}];
  }
};

/**
 * Mô tả: xóa tài khoản ngân hàng
 * created by : ttanh (17-08-2023)
 */
const onDeleteBankAccount = (index) => {
  if (index == null || index == undefined) {
    if (provider.inputObj.BankAccounts && provider.inputObj.BankAccounts.length > 0) {
      provider.inputObj.BankAccounts.splice(0, provider.inputObj.BankAccounts.length);
    }
  }

  if (provider.inputObj.BankAccounts) {
    provider.inputObj.BankAccounts.splice(index, 1);
  }
};

// const notEmptyField = ["ProviderCode", "ProviderName"];
// const orders = ["ProviderTaxCode", "ProviderCode", "ProviderName"];
const fields = MResource.vi.providerPage.fields;

const cols = [
  {
    key: 0,
    width: 33,
    name: "Mã nhân viên",
    fieldList: "EmployeeCode",
    fieldObj: "EmployeeCode",
  },
  {
    key: 1,
    width: 66,
    name: "Tên nhân viên",
    fieldList: "FullName",
    fieldObj: "FullName",
  },
];

const colsCountry = [
  {
    key: 0,
    width: 100,

    fieldList: "LocationName",
    fieldObj: "ProviderCountry",
  },
];

const colsCity = [
  {
    key: 0,
    width: 100,

    fieldList: "LocationName",
    fieldObj: "ProviderCity",
  },
];
const colsDistrict = [
  {
    key: 0,
    width: 100,

    fieldList: "LocationName",
    fieldObj: "ProviderDistrict",
  },
];
const colsVillage = [
  {
    key: 0,
    width: 100,

    fieldList: "LocationName",
    fieldObj: "ProviderVillage",
  },
];

const colsRulePayment = [
  {
    key: 0,
    width: 45,
    name: "Mã điều khoản thanh toán",
    fieldList: "RulePaymentCode",
    fieldObj: "RulePaymentCode",
  },
  {
    key: 1,
    width: 55,
    name: "Tên điều khoản thanh toán",
    fieldList: "RulePaymentName",
    fieldObj: "RulePaymentName",
  },
];

const ContactSalutation = [
  {
    key: 0,
    width: 100,
    fieldList: "ContactSalutation",
    fieldObj: "ContactSalutation",
  },
];

const colsProviderAccount = [
  {
    key: 0,
    width: 33,
    name: "Số tài khoản",
    fieldList: "AccountCode",
    fieldObj: "AccountPaymentCode",
  },
  {
    key: 1,
    width: 66,
    name: "Tên tài khoản",
    fieldList: "AccountName",
  },
];

const colsCustomerAccount = [
  {
    key: 0,
    width: 33,
    name: "Số tài khoản",
    fieldList: "AccountCode",
    fieldObj: "AccountReceiveCode",
  },
  {
    key: 1,
    width: 66,
    name: "Tên tài khoản",
    fieldList: "AccountName",
  },
];

const listSalutation = [
  {
    ContactSalutation: "Ông",
  },
  {
    ContactSalutation: "Bà",
  },
  {
    ContactSalutation: "Anh",
  },
  {
    ContactSalutation: "Chị",
  },
];

const comboboxHeader = [
  {
    fieldName: "GroupCode",
    displayName: "Mã nhóm KH/NCC",
    width: 33,
  },
  {
    fieldName: "GroupName",
    displayName: "Tên nhóm KH/NCC",
    width: 66,
  },
];

const listRulePayment = [...rulePayments];

const inputSearch = ref("");
const groupData = ref(null);

watch(inputSearch, (newValue) => {
  let query = `?pageSize=20&pageIndex=1&querySearch=${newValue}`;
  GroupService.getList(query)
    .then((res) => {
      groupData.value = [...res.Data];
    })
    .catch((e) => {
      console.log(e);
    });
});

watch(
  () => provider.inputObj.RulePaymentCode,
  (newValue) => {
    const rule = listRulePayment.find((item) => item.RulePaymentCode == newValue);

    provider.inputObj.RulePaymentDebtDay = rule?.RulePaymentDebtDay;
  }
);

// const isFocus = (field, orders, errors) => {
//   if (errors) {
//     if (Object.keys(errors).length > 0) {
//       for (let i = 0; i < orders?.length; ++i) {
//         if (Object.keys(errors).find((key) => key == orders[i])) {
//           if (orders[i] == field) {
//             console.log(field);
//             return true;
//           }
//           return false;
//         }
//       }
//       return false;
//     }
//   }
//   if (orders[0] == field) {
//     console.log(field);
//     return true;
//   } else {
//     return false;
//   }
// };
const timeOutSearchCombobox = ref(null);

/**
 * Mô tả: tìm kiếm tài khoản nhà cung cấp
 * created by : ttanh (17-08-2023)
 */
const searchProviderAccount = async (inputSearch) => {
  if (provider.inputObj.AccountPaymentCode) {
    window.clearTimeout(timeOutSearchCombobox.value);
    timeOutSearchCombobox.value = setTimeout(async () => {
      const res = await AccountService.getAccountByObj(0, inputSearch); //lấy tài khoản là nhà cung cấp
      listProviderAccount.value = [...res.Data];
    }, 300);
  } else {
    const res = await AccountService.getAccountByObj(0); //lấy tài khoản là nhà cung cấp
    listProviderAccount.value = [...res.Data];
  }
};

/**
 * Mô tả: tìm kiếm tài khoản khách hàng
 * created by : ttanh (17-08-2023)
 */
const searchCustomerAccount = async (inputSearch) => {
  if (provider.inputObj.AccountReceiveCode) {
    window.clearTimeout(timeOutSearchCombobox.value);
    timeOutSearchCombobox.value = setTimeout(async () => {
      const res = await AccountService.getAccountByObj(1, inputSearch); //lấy tài khoản là nhà cung cấp
      listCustomerAccount.value = [...res.Data];
    }, 300);
  } else {
    const res = await AccountService.getAccountByObj(1); //lấy tài khoản là nhà cung cấp
    listCustomerAccount.value = [...res.Data];
  }
};

const refs = {
  deleteRowBtn: ref(null),
  saveBtn: ref(null),
  saveAndNewBtn: ref(null),
  cancelBtn: ref(null),
  ProviderTaxCode: ref(null),
};
/**
 * Mô tả: sự kiện tab đến ô tiếp theo
 * created by : ttanh (14-08-2023)
 */
function onTabNextTo($event, ref) {
  if ($event.keyCode == MEnum.Key.tab) {
    if (refs[ref]) refs[ref].value.focus();
  }
}

/**
 * Mô tả: thay đổi hiển thị trên form
 * created by : ttanh (17-08-2023)
 */
const onChangeIndexInfo = (index) => {
  currentIndexMoreInfo.value = index;
};

/**
 * Mô tả: validate dữ liệu trước khi lưu
 * created by : ttanh (17-08-2023)
 */
const validateForm = () => {
  provider.errors = {};

  if (!provider.inputObj.ProviderCode) {
    provider.errors.ProviderCode = [MResource.vi.providerPage.notEmtpyProviderCode];
  }

  if (!provider.inputObj.ProviderName) {
    provider.errors.ProviderName = [MResource.vi.providerPage.notEmptyProviderName];
  }

  const bankAccountNumber = provider.inputObj.BankAccounts?.map((item) => item?.BankAccountNumber);
  const bankAccountNumberSet = new Set(bankAccountNumber);

  if (bankAccountNumber?.length > bankAccountNumberSet?.size) {
    provider.errors.BankAccountNumber = [MResource.vi.providerPage.notDuplicateBankNumber];
  }

  // nhập tên mà không chọn
  if (provider.inputObj.RulePaymentName && !provider.inputObj.RulePaymentCode) {
    provider.errors.RulePaymentCode = [MResource.vi.providerPage.ruleNotFound];
  }

  if (provider.inputObj.FullName && !provider.inputObj.EmployeeId) {
    provider.errors.EmployeeId = [MResource.vi.providerPage.employeeNotFound];
  }

  if (provider.inputObj.AccountPaymentCode && !provider.inputObj.AccountPaymentId) {
    provider.errors.AccountPaymentCode = [MResource.vi.providerPage.accountDebtNotFound];
  }

  if (provider.inputObj.AccountReceiveCode && !provider.inputObj.AccountReceiveId) {
    provider.errors.AccountReceiveCode = [MResource.vi.providerPage.accountBalanceNotFound];
  }
};

/**
 * Mô tả: sự kiện thêm và làm mới form
 * created by : ttanh (17-08-2023)
 */
const onAddAndNew = async () => {
  provider.inputObj.Groups = [];
  if (provider.inputObj.ListGroupId && provider.inputObj.ListGroupId.length > 0) {
    for (let i = 0; i < provider.inputObj.ListGroupId.length; ++i) {
      if (provider.inputObj.ListGroupId[i]) {
        provider.inputObj.Groups.push({
          GroupId: provider.inputObj.ListGroupId[i],
          GroupCode: provider.inputObj.ListGroupCode[i],
        });
      }
    }
  }

  if (provider.inputObj.ProviderIsPrivate) {
    provider.inputObj.ReceiverEmails = null;
    provider.inputObj.ReceiverName = null;
    provider.inputObj.ReceiverPhone = null;
  } else if (!provider.inputObj.ProviderIsPrivate) {
    provider.inputObj.PersonIdentity = null;
    provider.inputObj.PersonIdentityAddress = null;
    provider.inputObj.PersonIdentityEmails = null;
    if (!provider.inputObj.IsCustomer) {
      provider.inputObj.ReceiverEmails = null;
      provider.inputObj.ReceiverName = null;
      provider.inputObj.ReceiverPhone = null;
    }
  }

  provider.inputObj.AddressShips = provider.inputObj.AddressShips?.filter((address) => Object.keys(address).length > 0);

  validateForm();

  if (provider.formMode == 0) {
    // thêm

    await provider.createObj(provider.inputObj);
  } else if (provider.formMode == 1) {
    await provider.updateObj(provider.selectedObj.ProviderId, provider.inputObj);
    if (Object.keys(provider.errors).length == 0) {
      provider.formMode = 0;
    }
  }
};

/**
 * Mô tả: sự kiện thêm và đóng form
 * created by : ttanh (17-08-2023)
 */
const onAddAndClose = async () => {
  await onAddAndNew();
  if (Object.keys(provider.errors).length == 0) {
    provider.closeForm();
  }
};

/**
 * Mô tả: đóng form
 * created by : ttanh (17-08-2023)
 */
const onCloseForm = () => {
  let strInput = JSON.stringify(getNotEmptyNull(provider.inputObj));
  let strSeletected = JSON.stringify(getNotEmptyNull(provider.selectedObj));

  if (strInput != strSeletected) {
    isShowQuestionDialog.value = true;
  } else {
    provider.closeForm();
  }
};

useListenKey("keyup", MEnum.Key.esc, onCloseForm);

onBeforeMount(async () => {
  if (provider.inputObj.Groups?.length > 0) {
    provider.inputObj.ListGroupId = provider.inputObj.Groups?.map((group) => group?.GroupId);
    provider.inputObj.ListGroupCode = provider.inputObj.Groups?.map((group) => group?.GroupCode);
    provider.selectedObj.ListGroupId = provider.inputObj.Groups?.map((group) => group?.GroupId);
    provider.selectedObj.ListGroupCode = provider.inputObj.Groups?.map((group) => group?.GroupCode);
  }

  if (provider.inputObj.RulePaymentCode) {
    provider.inputObj.RulePaymentName = listRulePayment.find(
      (item) => item.RulePaymentCode == provider.inputObj.RulePaymentCode
    )?.RulePaymentName;
  }

  if (provider.formMode == 1 && provider.inputObj.PersonIdentityDate) {
    provider.inputObj.PersonIdentityDate = formatDate(provider.inputObj.PersonIdentityDate);
  }

  if (provider.formMode == 0 && provider.inputObj.ProviderIsPrivate == undefined) {
    provider.inputObj.ProviderIsPrivate = false;
    provider.selectedObj.ProviderIsPrivate = false;
  }

  const queryEmployee = `?recordsPerPage=20&page=1`;

  EmployeeService.getList(queryEmployee).then((res) => {
    provider.employeeList = [...res.Data];
  });

  AccountService.getAccountByObj(0).then((res) => {
    listProviderAccount.value = [...res.Data];
  });

  AccountService.getAccountByObj(1).then((res) => {
    listCustomerAccount.value = [...res.Data];
  });

  let query = `?pageSize=20&pageIndex=1`;
  GroupService.getList(query)
    .then((res) => {
      groupData.value = [...res.Data];
    })
    .catch((e) => {
      console.log(e);
    });

  let queryLocation = `?grade=0`;
  LocationService.getList(queryLocation).then((res) => {
    listCountry.value = [...res.Data];
  });

  if (provider.formMode == 0) {
    const res = await ProviderService.getNewcode();
    provider.inputObj.ProviderCode = res.Data;
    provider.selectedObj.ProviderCode = res.Data;
  }
});
</script>
<style>
.isSelected {
  padding: 4px;
  background-color: #cce4f9;
}

.table__address {
  max-height: 122px;
  overflow: auto;
}
</style>
