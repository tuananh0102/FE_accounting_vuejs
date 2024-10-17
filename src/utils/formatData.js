import formatMoney from "./formatMoney";

/**
 * Mô tả: định dạng lại dữ liệu
 * created by : ttanh
 * created date: 29-05-2023
 *
 */
export default function formatData(type, content) {
  switch (type) {
    case "gender":
      if (content == this.$_MEnum.Gender.male) return this.$_MResource.vi.gender.male;
      if (content == this.$_MEnum.Gender.female) return this.$_MResource.vi.gender.female;

      return this.$_MResource.vi.gender.other;

    case "date":
      return content ? content.substring(0, 10).split("-").reverse().join("/") : null;
    case "date-reverse":
      return content ? content.substring(0, 10).split("-").join("/") : null;
    case "money":
      return formatMoney(content, false);

    default:
      return content;
  }
}
