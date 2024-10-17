<template>
  <div class="main app-list">
    <div class="main__header">
      <div class="main__table-title">{{ $_MResource[$_LANG_CODE].table.app }}</div>
    </div>

    <div class="main__body">
      <div class="app-container">
        <div class="app-item">
          <div class="item__title">Đối tượng</div>
          <a href="" class="item__link">Khách hàng</a>
          <router-link to="/apps/providers" class="item__link">Nhà cung cấp</router-link>

          <router-link to="/apps/employees" class="item__link">Nhân viên</router-link>
          <a href="" class="item__link">Nhóm khách hàng, nhà cung cấp</a>
        </div>
        <div class="app-item">
          <div class="item__title">Vật tư hàng hóa</div>
          <a href="" class="item__link">Vật tư hàng hóa</a>
          <a href="" class="item__link">Kho</a>
          <a href="" class="item__link">Nhóm vật tư, hàng hóa, dịch vụ</a>
          <a href="" class="item__link">Đơn vị tính</a>
        </div>
        <div class="app-item">
          <div class="item__title">Tài khoản</div>
          <router-link to="/apps/accounts" class="item__link">Hệ thống tài khoản</router-link>
          <a href="" class="item__link">Tài khoản kết chuyển</a>
          <a href="" class="item__link">Nhân viên</a>
          <a href="" class="item__link">Tài khoản ngầm định</a>
        </div>
        <div class="app-item">
          <div class="item__title">Chi phí</div>
          <a href="" class="item__link">Đối tượng tập hợp chi phí</a>
          <a href="" class="item__link">Khoản mục chi phí</a>
          <a href="" class="item__link">Công trình</a>
          <a href="" class="item__link">Loại công trình</a>
        </div>
        <div class="app-item">
          <div class="item__title">Ngân hàng</div>
          <a href="" class="item__link">Ngân hàng</a>
          <a href="" class="item__link">Tài khoản ngân hàng</a>
        </div>
        <div class="app-item">
          <div class="item__title">Chi nhánh, phòng ban</div>
          <a href="" class="item__link">Cơ cấu tổ chức</a>
        </div>
        <div class="app-item">
          <div class="item__title">Tài sản</div>
          <a href="" class="item__link">Loại công cụ dụng cụ</a>
          <a href="" class="item__link">Loại tài sản cố định</a>
        </div>
        <div class="app-item">
          <div class="item__title">Thuế</div>
          <a href="" class="item__link">Biểu thuế tiêu thụ đặc biệt</a>
          <a href="" class="item__link">Biểu thuế tài nguyên</a>
        </div>
        <div class="app-item">
          <div class="item__title">Khác</div>
          <a href="" class="item__link">Điều khoản thanh toán</a>
          <a href="" class="item__link">Mục thu/chi</a>
          <a href="" class="item__link">Mã thống kê</a>
          <a href="" class="item__link">Loại tiền</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppList",
};
</script>

<style></style>
