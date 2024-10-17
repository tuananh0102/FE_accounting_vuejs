<template>
  <ul class="pages">
    <li class="page">
      <button
        class="page-btn"
        :class="{ notAllow: isInFirstPage }"
        @click="onClickPreviousPage"
        :disabled="isInFirstPage"
      >
        Trước
      </button>
    </li>

    <li class="page">
      <button class="page-btn num-btn" @click="onClickFirstPage" :disabled="currentPage === 1">1</button>
    </li>
    <li class="three-dot" v-if="dupStartPage > 2" @click="onClickShowPreviousPage">
      <p>...</p>
    </li>
    <!-- visible button start -->
    <li v-for="page in pages()" :key="page.name">
      <button class="page-btn num-btn" :disabled="page.isDisabled" @click="onClickPage($event, page.name)">
        {{ page.name }}
      </button>
    </li>
    <!-- visible button end -->
    <li class="three-dot" v-if="dupStartPage < totalPage - maxVisibleBtns" @click="onClickShowNextPage">
      <p>...</p>
    </li>
    <li class="page" v-if="totalPage > 1">
      <button class="page-btn num-btn" :disabled="currentPage === totalPage" @click="onClickLastPage">
        {{ totalPage }}
      </button>
    </li>
    <li class="page">
      <button class="page-btn" :class="{ notAllow: isInLastPage }" @click="onClickNextPage" :disabled="isInLastPage">
        Sau
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  data: () => {
    return {
      dupStartPage: -1, // copy from startPage
    };
  },
  props: {
    maxVisibleBtns: {
      type: Number,
      required: false,
      default: 3,
    },
    totalPage: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  computed: {
    /**
     * Mô tả: số trang bắt đầu
     * created by : ttanh
     * created date: 03-06-2023
     */
    startPage() {
      if (this.currentPage == 1 || this.currentPage == 2) {
        return 2;
      }

      if (this.currentPage == 3) {
        return 2;
      }

      //   if (this.maxVisibleBtns == this.totalPage - this.currentPage + 1) {
      //     return this.currentPage;
      //   }
      if (this.currentPage == this.totalPage) {
        return this.totalPage - this.maxVisibleBtns + 1;
      }
      return this.currentPage - 1;
    },

    /**
     * Mô tả: kiểm tra có đang ở đầu trang
     * created by : ttanh
     * created date: 03-06-2023
     */
    isInFirstPage() {
      return this.currentPage == 1;
    },
    /**
     * Mô tả: kiểm tra có dang ở cuối trang
     * created by : ttanh
     * created date: 03-06-2023
     */
    isInLastPage() {
      if (this.totalPage == 0) return true;
      return this.currentPage == this.totalPage;
    },
  },
  watch: {
    startPage: function (newValue) {
      this.dupStartPage = newValue;
    },
  },
  methods: {
    /**
     * Mô tả: đưa ra các trang để hiển thị
     * created by : ttanh
     * created date: 03-06-2023
     */
    pages() {
      const range = [];
      if (this.dupStartPage < 0) this.dupStartPage = this.startPage;
      for (let i = this.dupStartPage; i < Math.min(this.dupStartPage + this.maxVisibleBtns, this.totalPage); ++i) {
        range.push({
          name: i,
          isDisabled: i == this.currentPage,
        });
      }
      return range;
    },
    /**
     * Mô tả: lui 1 dải trang
     * created by : ttanh
     * created date: 03-06-2023
     */
    onClickShowPreviousPage() {
      this.dupStartPage = this.dupStartPage - this.maxVisibleBtns > 1 ? this.dupStartPage - this.maxVisibleBtns : 2;
    },

    /**
     * Mô tả: tiến 1 dải trang
     * created by : ttanh
     * created date: 03-06-2023
     */
    onClickShowNextPage() {
      this.dupStartPage =
        this.dupStartPage + this.maxVisibleBtns < this.totalPage - 1
          ? this.dupStartPage + this.maxVisibleBtns
          : this.totalPage - this.maxVisibleBtns + 1;
    },
    /**
     * Mô tả: đưa về đầu trang
     * created by : ttanh
     * created date: 03-06-2023
     */

    onClickFirstPage() {
      this.$emit("pageChanged", 1);
    },

    /**
     * Mô tả: dịch về trước 1 trang
     * created by : ttanh
     * created date: 03-06-2023
     */
    onClickPreviousPage() {
      this.$emit("pageChanged", this.currentPage - 1);
    },

    /**
     * Mô tả: dịch đến trang đã chọn
     * created by : ttanh
     * created date: 03-06-2023
     */
    onClickPage($event, page) {
      this.$emit("pageChanged", page);
    },

    /**
     * Mô tả: đưa về cuối trang
     * created by : ttanh
     * created date: 03-06-2023
     */
    onClickLastPage() {
      this.$emit("pageChanged", this.totalPage);
    },

    /**
     * Mô tả: dịch về sau trang
     * created by : ttanh
     * created date: 03-06-2023
     */
    onClickNextPage() {
      this.$emit("pageChanged", this.currentPage + 1);
    },
  },
};
</script>

<style scoped>
@import url(./pagination.css);
</style>
