<template>
  <ul class="feed-info">
    <li class="feed-info__item">
      Номер обращения:
      <span class="feed-info__item-count">{{feed.id}}</span>
    </li>
    <li class="feed-info__item">
      Автор:
      <span class="feed-info__item-author">{{feed.uid}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "FeedInfo",
  props: {
    feed: {
      type: Object,
      required: true
    }
  }
};
</script>

<style>
.feed-info {
  display: flex;
  padding: 0;
  margin: 0 0 10px 0;
  font-family: "Roboto", "Arial", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  list-style: none;
}

.feed-info__item {
  margin-right: 14px;
}

.feed-info__item:last-child {
  margin-right: 0;
}

.feed-info__item-count,
.feed-info__item-author {
  font-weight: 700;
}
</style>
