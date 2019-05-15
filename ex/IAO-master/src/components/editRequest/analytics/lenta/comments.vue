<template lang="pug">
  div
    .lenta_coment(v-if="showCommentsState" v-for="comment in comments")
      .lenta_coment_foto(style="width: 40px; height: 40px;")
        a(
          :href="comment.author_url"
          target="_blank"
          style="display: block;"
        )
          img(:src="comment.author_logo" style="width: 30px; height: 30px; margin: 0")
      .lenta_coment_h
        div {{ comment.text }}
        span.lenta_coment_time
          | {{ dateFormatting(comment.created_date) }} {{ dateToTime(comment.created_date) }}
        span.lenta_coment_link
        span.lenta_coment_like
          img(src="../../../../assets/icone_4.png")
          |  {{ comment.likes }}
    button(
      v-if="!showCommentsState"
      type="button"
      @click.stop="showCommentsState = !showCommentsState"
    ).btn.btn-primary.btn-lg.btn-block Загрузить комментарии
</template>

<script>
import { dateFormatting, dateToTime } from '@/utils/date';

export default {
  name: 'comments',
  props: {
    postId: {
      type: String,
    },
    comments: {
      type: Array,
    },
  },
  data() {
    return {
      showCommentsState: false,
    };
  },
  methods: {
    dateFormatting,
    dateToTime,
  },
};
</script>

<style scoped lang="stylus">
.lenta_coment_foto
  img
    border-radius 50%
</style>
