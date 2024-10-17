import BaseService from "./BaseService";

class AccountService extends BaseService {
  controller = "Account";

  async getChildren(parentId, parentCode) {
    let query = `${this.getBaseUrl()}/Children?parentId=${parentId}`;
    if (parentCode) {
      query += `$parentCode=${parentCode}`;
    }
    const res = await this.instance.get(query);
    return res.data;
  }

  async getSortedAccount(pageIndex, pageSize, inputSearch) {
    let query = `${this.getBaseUrl()}/SortedAccount?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (inputSearch) {
      query += `&queryInput=${inputSearch}`;
    }
    const res = await this.instance.get(query);
    return res.data;
  }

  async getAccountByObj(obj, querySearch) {
    let query = `${this.getBaseUrl()}/Object`;
    if (obj) {
      query += `?obj=${obj}`;
    }
    if (querySearch && obj) {
      query += `&querySearch=${querySearch}`;
    } else if (querySearch && !obj) {
      query += `?querySearch=${querySearch}`;
    }

    const res = await this.instance.get(query);
    return res.data;
  }

  async getExpandAccount(pageIndex, pageSize) {
    let query = `${this.getBaseUrl()}/ExpandAccount?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const res = await this.instance.get(query);
    return res.data;
  }

  async updateStatus(code, status) {
    let query = `${this.getBaseUrl()}/SingleStatus?code=${code}&status=${status}`;
    const res = await this.instance.put(query);
    return res;
  }

  async updateStatusMultiple(code, status) {
    let query = `${this.getBaseUrl()}/MultipleStatus?parentCode=${code}&status=${status}`;
    const res = await this.instance.put(query);
    return res;
  }
}

export default new AccountService();
