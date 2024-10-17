import instance from "./instance";
import MResource from "@/scripts/resource";

class BaseService {
  controller = "";
  instance = instance;

  getBaseUrl() {
    return `/${this.controller}`;
  }

  async getById(id) {
    const res = await this.instance.get(this.getBaseUrl() + `/${id}`);
    return res.data;
  }

  /**
   * Mô tả: lấy toàn bộ nhận viên
   * created by : ttanh
   * created date: 29-05-2023
   */
  async getList(inputSearch) {
    const query = inputSearch ? inputSearch : "";
    const res = await this.instance.get(this.getBaseUrl() + query);

    return res.data;
  }

  /**
   * Mô tả: tạo nhân viên mới
   * created by : ttanh
   * created date: 29-05-2023
   */
  async createObj(newObj) {
    const res = await this.instance.post(this.getBaseUrl(), {
      ...newObj,
    });
    return res;
  }

  /**
   * Mô tả: cập nhật thông tin nhân viên
   * created by : ttanh
   * created date: 29-05-2023
   */
  async updateObj(objId, newObj) {
    const res = await this.instance.put(`${this.getBaseUrl()}/${objId}`, {
      ...newObj,
    });
    return res;
  }

  /**
   * Mô tả: xóa nhân viên theo id
   * created by : ttanh
   * created date: 29-05-2023
   */
  async deleteObj(objId) {
    const res = await this.instance.delete(`${this.getBaseUrl()}/${objId}`);
    return res;
  }

  async deleteMultipleObj(ids) {
    const res = await this.instance.delete(`${this.getBaseUrl()}`, {
      data: [...ids],
    });
    return res;
  }

  /**
   * Mô tả: lấy mã code mới
   * created by : ttanh (07-08-2023)
   */
  async getNewcode() {
    const res = await this.instance.get(this.getBaseUrl() + "/NewCode");
    return res.data;
  }

  /**
   * Mô tả: xuất file excel
   * created by : ttanh (16-08-2023)
   */
  async exportExcel(fileName = MResource.vi.fileName.employeeExcel) {
    const res = await this.instance.get(this.getBaseUrl() + "/ExcelFile", { responseType: "blob" });

    const file = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const href = window.URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    // Clean up resources

    return res;
  }
}

export default BaseService;
