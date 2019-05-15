<template lang="pug">
  .col-md-8.align-self-center.content_koment
    .scroll3
      .row.justify-content-md-center.content_koment_row
        .col-sm-12.align-self-center
          input(
            type="text"
            name="fname1"
            placeholder="Выбор даты"
            :value="pickedDate"
          )#datepicker1
        .col-md-6.align-self-center(v-for="comment in comments")
          .content_koment_txt.scroll5
            post-for-comment(
              :owner_id="Number(comment.owner_id)"
              :id="Number(comment.post_id)"
              :network_id="Number(comment.network_id)"
            )
            span
              a(:href="comment.author_url")
                img(:src="comment.author_logo").author__logo
                | {{ comment.author }}
            span
              img(src="../../../assets/icone_1.png")
              | {{ dateFormatting(comment.created_date) }}
            span
              img(src="../../../assets/icone_3.png")
              | {{ dateToTime(comment.created_date) }}
            h3
            p.
              {{ comment.text }}
            span.koment_like
              a(href="#")
                img(src="../../../assets/icone_4.png")
                span  {{ comment.likes }}
        .col-sm-12.align-self-center
          span(v-if="!comments.length && !requestPending") Информация еще не собрана
          .preLoad(v-if="requestPending")
              img(src=  "../../../assets/25.svg")
          button(
            v-if="comments.length >= limit && showMoreBtn"
            type="button"
            @click.stop="loadMore"
          ).btn.btn-primary.btn-lg.btn-block Загрузить еще
</template>

<script>
import { dateFormatting, dateToTime } from '@/utils/date';
import PostForComment from './comments/postForComment.vue';

export default {
  name: 'comments',
  components: { PostForComment },
  data() {
    return {
      comments: [],
      pickedDate: '',
      limit: 15,
      pageCount: 1,
      showMoreBtn: true,
      requestPending: false,
    };
  },
  methods: {
    dateFormatting,
    dateToTime,
    loadMore() {
      this.pageCount += 1;
      this.$http.post('/content/allcommentaries', {
        request_id: this.$route.params.id,
        limit: this.limit,
        offset: this.pageCount,
        sort: {
          type: 'likes',
          sort: 'desc',
        },
      })
        .then((resp) => {
          if (resp.data.commentaries.length < this.limit) {
            this.showMoreBtn = !this.showMoreBtn;
          }
          if (resp.data.commentaries.length) {
            resp.data.commentaries.forEach((comment) => {
              this.comments.push(comment);
            });
          }
        })
        .then(() => {
          $('.scroll5').mCustomScrollbar({
            theme: 'inset-dark',
          });
        })
        .catch(err => err);
    },
  },
  watch: {
    comments() {
      $('.scroll3').mCustomScrollbar({
        theme: 'inset-dark',
      });
    },
    pickedDate() {
      this.$http.post('/content/allcommentaries', {
        request_id: this.$route.params.id,
        limit: this.limit,
        offset: this.pageCount,
        from: `${this.pickedDate.split('.').reverse().join('-')} 00:00:01`,
        to: `${this.pickedDate.split('.').reverse().join('-')} 23:59:59`,
        sort: {
          type: 'likes',
          sort: 'desc',
        },
      })
        .then((resp) => {
          this.comments = resp.data.commentaries;
        })
        .catch(err => err);
    },
  },
  mounted() {
    const vm = this;
    $('#datepicker1').datepicker({
      onSelect() {
        vm.pickedDate = this.value;
      },
    });
    this.requestPending = true;
    this.$http.post('/content/allcommentaries', {
      request_id: this.$route.params.id,
      limit: this.limit,
      offset: this.pageCount,
      sort: {
        type: 'likes',
        sort: 'desc',
      },
    })
      .then((resp) => {
        this.comments = resp.data.commentaries;
        this.requestPending = false;
      })
      .then(() => {
        $('.scroll5').mCustomScrollbar({
          theme: 'inset-dark',
        });
      })
      .catch((err) => {
        this.requestPending = false;
        return err;
      });
  },
};
</script>

<style scoped lang="stylus">
.content_koment_txt
  height 440px
  overflow hidden
  padding 20px 10px 20px 20px
.author__logo
  width 20px
  height 20px
  border-radius 50%
</style>
