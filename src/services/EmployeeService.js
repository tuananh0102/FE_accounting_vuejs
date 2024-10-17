import BaseService from "@/services/BaseService";

class EmployeeService extends BaseService {
  controller = "Employees";

  // async getNewcode() {
  //   const res = await this.instance.get(this.getBaseUrl() + "/NewCode");
  //   return res.data;
  // }

  // async exportExcel() {
  //   const res = await this.instance.get(this.getBaseUrl() + "/ExcelFile", { responseType: "blob" });

  //   const file = new Blob([res.data], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });

  //   const href = window.URL.createObjectURL(file);

  //   const link = document.createElement("a");
  //   link.href = href;
  //   link.setAttribute("download", MResource.vi.fileName.employeeExcel);
  //   document.body.appendChild(link);
  //   link.click();

  //   // clean up "a" element & remove ObjectURL
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(href);

  //   // Clean up resources

  //   return res;
  // }
}

export default new EmployeeService();
