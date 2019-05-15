<template lang="pug">
  .col-md-8.align-self-center.content_koment
    .row.align-items-center(style="margin-bottom: 15px")
      .analiz_select
        input(
        type="text"
        name="fname1"
        placeholder="Начало"
        :value="pickedDate.from"
        )#datepicker1
      .analiz_select
        span по
        input(
        type="text"
        name="fname1"
        placeholder="Конец"
        :value="pickedDate.to"
        )#datepicker2
      .sort_lenta
        p.dropdown-outer
          span(@click.stop="showDropdown").dropdown-current Сортировать по
          ul.dropdown
            li(
              v-for="elem in dataOrderTypes"
              :data-value="elem.type"
              @click.stop="setOrderType"
            ).dropdown__item {{ elem.text }}
        .sort(
          :class="[ order === 'desc' ? 'sort--reverse' : '']"
          @click.stop="changeSort"
        )
    .col-md-12.align-self-center.content_koment.scrol_lenta
      .row.justify-content-md-center.analiz_content
        .col-sm-12.align-self-center
          .preLoad(v-if="$store.getters.isShowPreLoad")
            img(src="../../../assets/25.svg")
          .lenta_content_item.scrol_lenta(v-else v-for="post in posts")
            .row.justify-content-md-center.align-content-start
              .col-sm-12.align-self-center
                .lenta_content_head
                  .row
                    .col-sm-8
                      a(:href="post.url" target="_blank")
                        img(:src="post.author_logo || '../../../assets/icone_2.png'")
                        | {{ post.author || 'Неизвестно' }}
                      br
                      span
                        img(
                          style="width: 20px; margin-right: 0;"
                          :src="require(`@/assets/${post.network_name}.png`)"
                        )
                      span
                        img(src="../../../assets/icone_1.png")
                        | {{ dateFormatting(post.created_date) }}
                      span
                        img(src="../../../assets/icone_3.png")
                        | {{ dateToTime(post.created_date) }}
                    .col-sm-4.align-self-end
                      span
                        img(src="../../../assets/show.png")
                        | {{ post.viewed }}
                      span
                        img(src="../../../assets/icone20.png")
                        | {{ post.likes }}
                      span
                        img(src="../../../assets/icone21.png")
                        | {{ post.commentaries }}
                      span
                        img(src="../../../assets/icone22.png")
                        | {{ post.reposts }}
                .row
                  .col-sm-6
                    .lenta_content_img(v-if="post.images.length")
                      img(:src="post.images[0]" )
                      a.fancybox.showMorePhotoIcon(
                        v-if="post.images[1]"
                        :data-fancybox="post.id"
                        :href="post.images[0]"
                      ) +{{ post.images.length - 1 }}
                    .hidden
                      template(v-for="(image, index) in post.images")
                        a.fancybox(
                          v-if="index !== 0"
                          :href="image"
                          :data-fancybox="post.id"
                        ).fancybox

                    p.
                      {{ post.text }}
                  .col-sm-6
                    comments(
                      v-if="post.commentsArr"
                      :postId="post.id"
                      :comments="post.commentsArr"
                    )
                .col-sm-12.align-self-center
                  span(v-if="!posts.length") Информация еще не собрана
                  .lenta_content_head(v-if="post.repost")
                    .row
                      .col-sm-6
                        a(:href="post.repost.url" target="_blank")
                          img(:src="post.repost.author_logo || '/img/icone_2.png'")
                          | {{ post.repost.author || 'Неизвестно' }}
                        span
                          img(src="../../../assets/icone_1.png")
                          | {{ dateFormatting(post.repost.created_date) }}
                        span
                          img(src="../../../assets/icone_3.png")
                          | {{ dateToTime(post.repost.created_date) }}
                      .col-sm-6
                        span
                          img(src="../../../assets/show.png")
                          | {{ post.repost.viewed }}
                        span
                          img(src="../../../assets/icone20.png")
                          | {{ post.repost.likes }}
                        span
                          img(src="../../../assets/icone21.png")
                          | {{ post.repost.commentaries }}
                        span
                          img(src="../../../assets/icone22.png")
                          | {{ post.repost.reposts }}
                      .col-sm-12
                        .lenta_content_img(v-if="post.repost.images.length")
                          img(:src="post.repost.images[0]")
                          a.fancybox.showMorePhotoIcon(
                            v-if="post.repost.images[1]"
                            :data-fancybox="post.repost.id"
                            :href="post.repost.images[0]"
                          ) +{{ post.repost.images.length - 1 }}
                        .hidden
                          template(v-for="(image, index) in post.repost.images")
                            a.fancybox(
                              v-if="index !== 0"
                              :href="image"
                              :data-fancybox="post.repost.id"
                            ).fancybox
                        p.repost__txt.
                          {{ post.repost.text }}
        .col-sm-12.align-self-center
          button(
            v-if="posts.length >= limit && showMoreBtn"
            type="button"
            @click.stop="loadMore"
          ).btn.btn-primary.btn-lg.btn-block Загрузить еще
</template>

<script>
import { dateFormatting, dateToTime, dateForSend } from '@/utils/date';
import SHOW_PRELOAD from '@/store/actions/preLoad';
import Comments from './lenta/comments.vue';

export default {
  name: 'lenta',
  components: { Comments },
  data() {
    return {
      showMoreBtn: true,
      pickedDate: {
        from: '',
        to: '',
      },
      request_id: this.$route.params.id,
      posts: [],
      pageCount: 1,
      limit: 15,
      showComments: false,
      comments: '',
      orderType: 'date',
      order: 'desc',
      dataOrderTypes: [
        {
          type: 'date',
          text: 'По дате',
        },
        {
          type: 'commentaries',
          text: 'По кол-ву комментариев',
        },
        {
          type: 'likes',
          text: 'По кол-ву лайков',
        },
        {
          type: 'reposts',
          text: 'По кол-ву репостов',
        },
      ],
    };
  },
  methods: {
    dateFormatting,
    dateToTime,
    setOrderType($event) {
      const target = $event.target;
      const current = target.parentElement.previousElementSibling;
      current.innerText = target.innerText;
      this.orderType = target.getAttribute('data-value');
      $event.target.parentElement.classList.toggle('dropdown--visible');
      this.pageCount = 1;
      this.getData();
    },
    changeSort() {
      this.order === 'asc' ? this.order = 'desc' : this.order = 'asc';
      this.pageCount = 1;
      this.getData();
    },
    showDropdown($event) {
      if ($event.target.parentElement.querySelector('.dropdown')
        .classList.contains('dropdown--visible')) {
        document.querySelectorAll('.dropdown--visible')
          .forEach((elem) => {
            elem.classList.remove('dropdown--visible');
          });
      } else {
        document.querySelectorAll('.dropdown--visible')
          .forEach((elem) => {
            elem.classList.remove('dropdown--visible');
          });
        $event.target.parentElement.querySelector('.dropdown')
          .classList
          .add('dropdown--visible');
      }
    },
    loadMore() {
      this.pageCount += 1;
      const requestData = {
        request_id: this.$route.params.id,
        limit: this.limit,
        offset: this.pageCount,
        sort: {
          type: this.orderType,
          order: this.order,
        },
      };
      if (this.pickedDate.from && this.pickedDate.to) {
        requestData.from = `${dateForSend(this.pickedDate.from)} 00:00:00`;
        requestData.to = `${dateForSend(this.pickedDate.to)} 23:59:00`;
      }
      this.$http.post('/content/posts', requestData)
        .then((resp) => {
          const postArr = resp.data.posts;
          if (resp.data.posts.length < Number(this.limit)) {
            this.showMoreBtn = !this.showMoreBtn;
          }
          this.insertCommentsToPosts(postArr).forEach((post) => {
            this.posts.push(post);
          });
        })
        .catch(err => err);
    },
    getData() {
      this.$store.dispatch(SHOW_PRELOAD);
      const requestData = {
        request_id: this.$route.params.id,
        limit: this.limit,
        offset: this.pageCount,
        sort: {
          type: this.orderType,
          order: this.order,
        },
      };
      if (this.pickedDate.from && this.pickedDate.to) {
        requestData.from = `${dateForSend(this.pickedDate.from)} 00:00:00`;
        requestData.to = `${dateForSend(this.pickedDate.to)} 23:59:00`;
      }
      this.$http.post('/content/posts', requestData)
        .then((response) => {
          const postsArr = response.data.posts;
          this.posts = this.insertCommentsToPosts(postsArr);
        })
        .then(() => {
          this.$store.dispatch(SHOW_PRELOAD);
        })
        .catch(err => err);
    },
    insertCommentsToPosts(postsArr) {
      postsArr.forEach((post) => {
        if (!post.commentsArr && post.commentaries !== '0') {
          console.log(post.commentaries);
          post.commentsArr = [];
          const requestProps = {
            request_id: this.$route.params.id,
            offset: 1,
            limit: post.commentaries,
            post_id: post.id,
            owner_id: post.owner_id,
            filter:
              {
                network_id: post.network_id,
              },
          };
          this.$http.post('/content/allcommentaries', requestProps)
            .then((resp) => {
              resp.data.commentaries.forEach((comment) => {
                post.commentsArr.push(comment);
              });
            })
            .catch(err => err);
        }
      });
      return postsArr;
    },
  },
  mounted() {
    this.getData();
    const vm = this;
    $('#datepicker1').datepicker({
      onSelect() {
        vm.pickedDate.from = this.value;
      },
    });
    $('#datepicker2').datepicker({
      onSelect() {
        vm.pickedDate.to = this.value;
      },
    });
  },
  updated() {
    this.$nextTick(() => {
      $('.scrol_lenta').mCustomScrollbar({
        theme: 'inset-dark',
      });
      $('.fancybox').fancybox({});
    });
  },
  watch: {
    pickedDate: {
      handler() {
        if (this.pickedDate.from && this.pickedDate.to) {
          this.getData();
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus">
.sort_lenta
  margin-left auto
.lenta_content_head
  padding-bottom .3em
  & a img
    display inline-block
    margin-right 3%
    width 30px
    height 30px
    border-radius 50%
.lenta_content_head a
  display inline
  margin-right 3%
  font-size 13px
#datepicker1
  margin-left 2em
.lenta_content_img
  position relative
  display inline-block
  max-width 50%
  img
    max-height 160px
    max-width 100%
.showMorePhotoIcon
  display flex
  position absolute
  align-items center
  justify-content center
  top 0
  left 100%
  width auto
  height 100%
  text-align center
  color #ccc
  font-size 8em
  background transparent
  transition .3s linear
.sort
  display inline-block
  width 20px
  height 30px
  background url('../../../assets/sort-i.png') center center no-repeat
  background-size cover
  margin-left 1em
  cursor pointer
  transform rotate(180deg)
  &--reverse
    transform rotate(0deg)
    transform-origin center center
  &_lenta
    display flex
    align-items center
.lenta_content_item
  height 470px
  overflow hidden
.dropdown
  position absolute
  top 100%
  left 0
  font-size 16px
  border 1px solid #ccc
  border-top none
  background #e9e9e9
  list-style-type none
  padding 10px
  margin 0
  z-index 100
  box-sizing border-box
  border-radius 8px
  opacity 0
  visibility hidden
  min-width 100%
  &--visible
    opacity 1
    visibility visible
  &-current
    color #777
    padding 10px
    font-size 16px
    width auto
    background #e9e9e9 url('../../../assets/select_icone.png') 90% center no-repeat
    display block
    border 1px solid #ccc
    transition all 0.5s ease
    border-radius 8px
    float left
    margin 0
    line-height 1.5em
    cursor pointer
    padding-right 4em
  &__item
    white-space nowrap
    padding 5px
    cursor pointer
    &--checked
      color blue
  &__input
    padding-left .6em
  &-outer
    margin 0
    line-height 17px
    position relative
    display inline-block
  &-i
    height 17px
    width 17px
    cursor pointer
</style>
