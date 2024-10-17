/**
 * Mô tả: loại bỏ trường null hoặc rỗng
 * created by : ttanh (28-07-2023)
 */

export default function getNotEmtpyNull(obj) {
  const outObj = {};
  if (typeof obj == "object") {
    Object.keys(obj)
      .filter((key) => obj[key] != null && obj[key] != "")
      .map((key) => {
        outObj[key] = obj[key];
      });
  }

  return outObj;
}
