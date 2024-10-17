/**
 * Mô tả: định dạng tiền
 * created by : ttanh (18-08-2023)
 */
export default function formatMoney(content, useMinus = true) {
  let formatContent = "";
  let prefix = "";
  if (content?.toString()[0] == "-") {
    prefix = "-";
  }
  let tmp = content?.toString();
  if (prefix) {
    tmp = tmp.split("").slice(1).join("");
  }
  let count = 0;
  let length = tmp?.length;
  if (tmp?.length > 3) {
    for (let i = length - 1; i >= 0; --i) {
      formatContent += tmp[i];
      if (count % 3 == 2 && i != 0) {
        formatContent += ".";
      }
      ++count;
    }
    if (prefix && !useMinus) {
      return `(${formatContent.split("").reverse().join("")})`;
    } else if (prefix && useMinus) {
      return `-${formatContent.split("").reverse().join("")}`;
    } else {
      return formatContent.split("").reverse().join("");
    }
  } else {
    return content;
  }
}
