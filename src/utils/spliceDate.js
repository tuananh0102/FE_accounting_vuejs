/**
 * Mô tả:  lấy 10 kí tự đầu
 * created by : ttanh (01-07-2023)
 */
export default function spliceDate(content) {
  if (typeof content == "string") return content.substring(0, 10);
  else return content;
}
