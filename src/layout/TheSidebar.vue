<template>
  <div class="sidebar">
    <div class="sidebar__container">
      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-home"></i>
        </span>
        <span class="sidebar__item-title">Tổng quan</span>
      </div>

      <router-link to="/money" class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-money"></i>
          <!-- <img
                class="sidebar__icon--default"
                src="/src/assets/icon/sidebar/user-solid.svg"
                alt="home-icon"
              /> -->
        </span>
        <span class="sidebar__item-title">Tiền mặt</span>
      </router-link>

      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-bank"></i>
        </span>
        <span class="sidebar__item-title">Hợp đồng</span>
      </div>

      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-bag"></i>
        </span>
        <span class="sidebar__item-title">Mua hàng</span>
      </div>

      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-shop"></i>
        </span>
        <span class="sidebar__item-title">Bán hàng</span>
      </div>

      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-note"></i>
        </span>
        <span class="sidebar__item-title">Quản lý đơn hàng</span>
      </div>

      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-container"></i>
        </span>
        <span class="sidebar__item-title">Kho</span>
      </div>
      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-tool"></i>
        </span>
        <span class="sidebar__item-title">Công cụ dụng cụ</span>
      </div>
      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-asset"></i>
        </span>
        <span class="sidebar__item-title">Tài sản cố định</span>
      </div>
      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-tax"></i>
        </span>
        <span class="sidebar__item-title">Thuế</span>
      </div>
      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-price"></i>
        </span>
        <span class="sidebar__item-title">Giá thành</span>
      </div>
      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-general"></i>
        </span>
        <span class="sidebar__item-title">Tổng hợp</span>
      </div>
      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default sidebar__icon-budget"></i>
        </span>
        <span class="sidebar__item-title">Ngân sách</span>
      </div>

      <div class="line"></div>

      <router-link to="/apps" class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default icon-options"></i>
        </span>
        <span class="sidebar__item-title">Danh mục</span>
      </router-link>
      <div class="sidebar__item">
        <span class="wrapper-icon mlr-12">
          <i class="sidebar__icon--default icon-knowledge"></i>
        </span>
        <span class="sidebar__item-title">Kiến thức</span>
      </div>
    </div>

    <!-- <div class="sidebar__footer">
          <span class="wrapper-icon mlr-12"
            ><img
              class="sidebar__icon--default icon--left"
              src="/src/assets/icon/angle-down-solid.svg"
              alt="arrow-left-icon"
            />
            <span class="sidebar__item-title ml-20">Thu gọn</span>
          </span>
        </div> -->
  </div>
</template>

<script>
export default {
  name: "TheSidebar",
};
</script>

<style></style>
