/**
 * Mô tả:  đưa ngày về dạng yyyy/MM/dd
 * created by : ttanh (01-07-2023)
 */
export default function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
