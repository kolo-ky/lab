<template lang="pug">
  .col-md-8.align-self-center.content_koment
    .file_download(style="text-align: right; padding-right: 2em;")
      a(href="#" @click.prevent="getDocument('xls')")
        | Скачать отчет
        img(src="../../../assets/doc_xls.png")
    .row.justify-content-md-center.content_koment_row
      span(v-if="!users.length") Информация еще не собрана
      .col-sm-3.align-self-center(v-for="user in users")
        .ychasnik
          a(:href="user.url" target="_blank").user__link
          img(:src="user.image")
          .name {{ user.username }}
          .range {{ user.coefficient }}
    .col-sm-12.align-self-center
      .row.justify-content-md-center
        button(
          v-if="users.length >= limit && showMoreBtn"
          type="button"
          @click.stop="loadMore"
        ).btn.btn-primary.btn-lg.btn-block Загрузить еще
</template>

<script>
import fileSaver from 'file-saver';

export default {
  name: 'list',
  data() {
    return {
      limit: 15,
      showMoreBtn: true,
      users: [],
      offset: 1,
    };
  },
  methods: {
    getDocument(type) {
      this.$http.post('/stats/analytics/download', {
        request_id: this.$route.params.id,
        offset: 1,
        limit: 1000,
      }, { responseType: 'blob' })
        .then((resp) => {
          fileSaver.saveAs(new Blob([resp.data]), `Report.${type}`);
        })
        .catch(err => err);
    },
    loadMore() {
      this.offset += 1;
      const requestData = {
        request_id: this.$route.params.id,
        limit: this.limit,
        offset: this.offset,
      };
      this.$http.post('/request/allmembers', requestData)
        .then((resp) => {
          resp.data.members.forEach((user) => {
            this.users.push(user);
          });
          if (resp.data.members.length < Number(this.limit)) {
            this.showMoreBtn = !this.showMoreBtn;
          }
        })
        .catch(err => err);
    },
  },
  created() {
    this.$http.post('/request/allmembers', {
      request_id: this.$route.params.id,
      limit: this.limit,
    })
      .then((resp) => {
        this.users = resp.data.members;
      })
      .catch(err => err);
  },
};
</script>

<style scoped lang="stylus">
.user__link
  position absolute
  left 0
  top 0
  width 100%
  height 100%
.ychasnik
  position relative
  img
    border-radius 50%
    width 60%
</style>
