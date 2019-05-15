<template>
  <el-row :gutter="24" v-if="feeds.length">
    <el-col :span="12" v-for="item in feeds" :key="item.id" class="feed">
      <el-card shadow="hover">
        <router-link to="/users" class="feed__link">
          {{item.threadname}}
        </router-link>

        <post-info :additional="item.additional"/>
        <feed-info :feed="item"/>
        <feed-chart :feed="item"/>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
// components
import PostInfo from "../PostInfo";
import FeedInfo from "../FeedInfo";
import FeedChart from "../FeedChart";

export default {
  name: "FeedCard",
  props: {
    feeds: {
      type: Array,
      required: true
    }
  },
  components: {
    PostInfo,
    FeedInfo,
    FeedChart
  }
};
</script>

<style>
.feed {
  margin-bottom: 20px;
}

.feed__link,
.feed__link:visited {
  display: inline-block;
  margin-bottom: 10px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
  text-decoration: none;
}

.feed__link:hover,
.feed__link:focus,
.feed__link:active {
  color: #1989fa;
}
</style>
