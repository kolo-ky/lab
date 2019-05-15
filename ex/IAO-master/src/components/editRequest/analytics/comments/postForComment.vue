<template lang="pug">
 div
   div(v-if="showPost")
     span
       a(:href="post.author_url")
         img(:src="post.author_logo").author__logo
         | {{ post.page_name }}
     span
       img(src="../../../../assets/icone_1.png")
       | {{ dateFormatting(post.created_date) }}
     span
       img(src="../../../../assets/icone_3.png")
       | {{ dateToTime(post.created_date) }}
     p {{ post.text }}
   button(
     v-if="!showPost"
     type="button"
     @click.stop="loadPost"
     style="margin-bottom: 1em;"
   ).btn.btn-primary.btn-lg.btn-block Загрузить пост
   button(
     v-if="showPost"
     type="button"
     @click="showPostInit"
     style="margin-bottom: 1em;"
   ).btn.btn-primary.btn-lg.btn-block Скрыть пост
</template>

<script>
import { dateFormatting, dateToTime } from '@/utils/date';

export default {
  name: 'postForComment',
  props: {
    owner_id: {
      type: Number,
    },
    id: {
      type: Number,
    },
    network_id: {
      type: Number,
    },
  },
  data() {
    return {
      showPost: false,
      post: '',
    };
  },
  methods: {
    loadPost() {
      this.$http.post('/content/posts', {
        request_id: this.$route.params.id,
        offset: 1,
        limit: 20,
        id: this.id,
        owner_id: this.owner_id,
        filter: {
          network_id: 1,
        },
      })
        .then((resp) => {
          this.post = resp.data.posts[0];
          this.showPost = !this.showPost;
        })
        .then(() => {
        })
        .catch(err => err);
    },
    showPostInit($event) {
      this.showPost = !this.showPost;
      console.log($event.target);
    },
    dateFormatting,
    dateToTime,
  },
};
</script>

<style scoped lang="stylus">
.author__logo
  width 20px
  height 20px
  border-radius 50%
</style>
