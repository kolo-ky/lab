<template lang="pug">
  .file-list__item
    p.file_name.icon_pdf(title='test.pdf') {{ this.file.filename || this.fileParams.name }}
    .file-list__control
      a.icon_download(:href="`${ url }${ file.link }`" v-if="file.filename")
        img(src="../../assets/download.png")
      a.icon_delete(href='#' @click.stop="$emit('deleteFile')")
        img(src="../../assets/delete.png")
</template>

<script>
import { API_URL } from '../../axios/axios';

export default {
  name: 'attachments',
  data() {
    return {
      url: API_URL,
    };
  },
  props: {
    file: {
      type: Object,
      default() {
        return {
          filename: '',
          date: '',
          size: '',
          link: '',
        };
      },
    },
    fileParams: {
      type: Object,
      default() {
        return {
          name: '',
        };
      },
    },
  },
};
</script>

<style>
.icon_download img{
  max-width: 100%;
}
.icon_delete img{
  max-width: 100%;
}
</style>
