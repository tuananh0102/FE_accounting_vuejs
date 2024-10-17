<template>
  <span class="wrapper-input focus-green" :class="{ disable: disable, invalid: isBorderRed && isInvalid }">
    <input
      :disabled="disable"
      v-if="type != 'money' && type != 'number'"
      v-focus="isFocus"
      ref="input"
      class="base-input"
      :class="{ 'right-to-left': rightText }"
      :type="type"
      :placeholder="placeholder"
      :title="title"
      :max="max"
      :min="min"
      :maxlength="maxLength"
      :minLength="minLength"
      :value="modelValue"
      @input="($event) => onChange($event)"
    />

    <input
      :disabled="disable"
      v-money="number"
      v-if="type == 'number'"
      v-focus="isFocus"
      ref="input"
      class="base-input right-to-left"
      type="text"
      :placeholder="placeholder"
      :title="title"
      :max="max"
      :min="min"
      :maxlength="maxLength"
      :minLength="minLength"
      :value="modelValue"
      @input="($event) => onChange($event)"
    />

    <input
      :disabled="disable"
      v-if="type == 'money'"
      v-focus="isFocus"
      ref="input"
      class="base-input right-to-left"
      :class="{ 'red-color': textInput < 0 }"
      @focus="onConvertToNegative"
      @blur="formatNegativeMoney"
      type="text"
      :placeholder="placeholder"
      :title="title"
      :max="max"
      :min="min"
      :maxlength="maxLength"
      :minLength="minLength"
      :value="formatNumber"
      @input="($event) => onChange($event)"
    />

    <!-- <datepicker
      v-focus="isFocus"
      v-if="type == 'date'"
      :disabled="disable"
      ref="datepicker"
      auto-apply
      text-input
      :title="title"
      :model-value="modelValue"
      :min-date="minDate"
      :max-date="maxDate"
      @update:model-value="handleDateSelect"
      :locale="locale"
      model-type="yyyy-MM-dd"
      :placeholder="placeholder"
      :format="format"
      :clearable="false"
    >
      <template #input-icon> </template> -->

    <!-- <template #dp-input>
        <input
          ref="input"
          class="custom base-input dp__input dp__input_icon_pad"
          type="text"
          :value="formatData('date-reverse', modelValue)"
          placeholder="dd/mm/yyyy"
          @input="handleDateInput($event)"
        />

        <img class="img-calendar" src="../../assets/icon/calendar-regular.svg" alt="calendar" />
      </template> 
    </datepicker> -->

    <span class="wrapper-icon plr-8" v-if="urlIcon ? true : false">
      <!-- <img src="@/assets/icon/magnifying-glass-solid.svg" alt=""> -->
      <img class="search-icon" :src="urlIcon" alt="search-icon" />
    </span>
  </span>
</template>

<script>
// import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { VMoney } from "v-money";
import { ref } from "vue";

import formatData from "@/utils/formatData";
import formatMoney from "@/utils/formatMoney";
import { vFocus } from "@/directives/vFocus";
// import useClickOutSide from "@/composables/useClickOutSide";

export default {
  name: "MInput",

  // components: {
  //   datepicker: VueDatePicker,
  // },

  data() {
    return {
      dateValue: "",
      minDate: null,
      maxDate: null,
      locale: this.$_LANG_CODE,

      format: "dd/MM/yyyy",
      isBorderRed: false,

      money: {
        thousands: ".",
        precision: 0,
      },
      number: {
        thousands: ".",
        precision: 0,
      },
    };
  },

  props: {
    title: String,
    type: {
      type: String,
      default: "text",
    },
    placeholder: String,
    className: String,
    urlIcon: String,
    maxLength: Number,
    minLength: Number,
    max: Number,
    min: Number,
    modelValue: {
      type: String,
      default: "",
    },
    isFocus: Boolean,
    isInvalid: {
      type: Boolean,
      default: false,
    },

    disable: {
      type: Boolean,
      default: false,
    },
    rightText: {
      type: Boolean,
      default: false,
    },
    listenObj: Object,
  },

  created() {
    this.maxDate = new Date(Date.now());
    this.minDate = new Date(this.maxDate.getYear() - 100);
  },

  methods: {
    formatData,
    /**
     * Mô tả: xử lý khi chọn ngày
     * created by : ttanh (12-07-2023)
     */
    handleDateSelect(modelData) {
      this.dateValue = modelData;
      this.isBorderRed = false;

      this.$emit("update:modelValue", modelData);
    },

    /**
     * Mô tả: xử lý khi nhập ngày
     * created by : ttanh (12-07-2023)
     */
    handleDateInput($event) {
      this.isBorderRed = false;

      this.dateValue = $event.target.value;
      this.$emit("update:modelValue", $event.target.value);
    },

    focus() {
      this.$refs.input.focus();
    },
    onChange($event) {
      this.isBorderRed = false;

      if (this.type == "money") {
        let cleanedValue = $event.target.value.replace(/[^-0-9.]/g, "");

        if (cleanedValue.length > 1) {
          let tmp = "";
          for (let i = 1; i < cleanedValue.length; ++i) {
            if (cleanedValue[i] != "-") {
              tmp += cleanedValue[i];
            }
          }
          if (cleanedValue[0] == "-" && cleanedValue[1] != 0) {
            cleanedValue = "-" + tmp;
          }
          //   cleanedValue = cleanedValue
          //     .split(".")
          //     .join("")
          //     .split("")
          //     .filter((item, index) => item != "-" && index > 0)
          //     .join("");
          // }
        }
        $event.target.value = cleanedValue;
        this.formatNumber = formatMoney(cleanedValue.split(".").join(""));
        let number = +$event.target.value.split(".").join("");
        this.textInput = number;
        this.$emit("update:modelValue", number);
      } else if (this.type == "number") {
        let cleanedValue = $event.target.value.replace(/[^0-9.]/g, "");
        $event.target.value = cleanedValue;
        let number = cleanedValue.split(".").join("");
        this.$emit("update:modelValue", number);
      } else {
        this.$emit("update:modelValue", $event.target.value);
      }
    },
    onConvertToNegative() {
      if (parseInt(this.textInput) < 0) {
        this.formatNumber = `-${this.formatNumber.slice(1, this.formatNumber.length - 1)}`;
      }
    },
  },

  watch: {
    listenObj(newValue) {
      if (Object.keys(newValue).length == 0) {
        this.isBorderRed = false;
      } else {
        this.isBorderRed = true;
      }
    },

    isFocus(newValue) {
      console.log(newValue);
    },
  },

  directives: {
    focus: vFocus,
    money: VMoney,
  },

  setup() {
    const textInput = ref(0);
    const input = ref(null);
    const formatNumber = ref(0);

    const formatNegativeMoney = () => {
      if (parseInt(textInput.value) < 0) {
        formatNumber.value = `(${formatNumber.value.split("").slice(1).join("")})`;
      }
    };

    return { input, textInput, formatNumber, formatNegativeMoney };
  },

  mounted() {
    // if (this.isFocus) this.focus();

    this.textInput = this.modelValue;
    if (this.type == "money") {
      this.formatNumber = formatMoney(this.modelValue?.toString().split(".").join(""), false);
    } else {
      this.formatNumber = this.modelValue;
    }
  },
};
</script>

<style>
.dp__input_icon_pad {
  padding-left: 12px;
  height: 98%;
  border: none;
  background-color: transparent;
}

.wrapper-input .dp__input_icon {
  left: auto;
  right: 0;
  z-index: 1000;
}

.dp__input {
  font-family: Roboto;
  color: #000;
}
.img-calendar {
  height: 12px;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  padding-right: 8px;
}

.right-to-left {
  text-align: right;
}

.red-color {
  color: #ed1c24;
}
</style>
