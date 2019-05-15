<template>
  <ul class="feeds-post-info">
    <li class="feeds-post-info__item">
      За сутки постов:
      <span class="feeds-post-info__item-count">
        {{dayCountPosts}}
      </span>
    </li>
    <li class="feeds-post-info__item">
      Всего постов:
      <span class="feeds-post-info__item-count">
        {{totalCountPosts}}
     </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "PostInfo",
  props: {
    additional: {
      type: Object,
      required: true
    }
  },
  computed: {
    totalCountPosts() {
      let total = 0;

      for (let key in this.additional.publications) {
        total += parseInt(this.additional.publications[key], 10);
      }

      return total;
    },
    dayCountPosts() {
      let dayCount = 0;
      if (!this.additional.publicationsgrowthdaily) {
        return dayCount;
      }

      const total = this.additional.publicationsgrowthdaily.total;
      const lastOfTotal = total[total.length - 1];

      return lastOfTotal[lastOfTotal.length - 1];
    }
  }
}
</script>

<style>
.feeds-post-info {
  display: flex;
  padding: 0;
  margin: 0 0 9px 0;
  font-family: "Roboto", "Arial", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  list-style: none;
}

.feeds-post-info__item {
  position: relative;
  padding-right: 10px;
}

.feeds-post-info__item:last-child {
  padding-right: 0;
  padding-left: 8px;
}

.feeds-post-info__item:first-child:after {
  position: absolute;
  right: 0;
  top: 0;
  font-weight: 700;
  content: "|";
}

.feeds-post-info__item-count {
  font-weight: 700;
}
</style>
