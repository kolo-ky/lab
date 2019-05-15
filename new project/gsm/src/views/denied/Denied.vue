<template>
  <el-container class="not-found">
    <el-row type="flex" justify="center">
      <el-col :xs="20" :sm="10" :md="8" :lg="6" :xl="6">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span class="not-found__header-text-color">
              404 Ошибка доступа
            </span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="backToFeeds">К лентам</el-button>
          </div>
          Извините, но у вас нет прав для доступа к контенту этой страницы. Для их получения обратитесь к
          администратору системы.
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    backToFeeds() {
      this.$router.push("/");
    }
  }
}
</script>

<style>
  @import "./css/style.css";
</style>
