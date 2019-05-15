<template lang="pug">
  .avatar
    img(
      v-if='!item.image'
      src='../../assets/no-photo.png').img-fluid
    img(
      v-else
      :src='item.image').img-fluid
    a.soc-link(
      :href="item.url" target="_blank"
      :class="item.network_name"
    )
    a(
      href="#"
      @click.prevent="$emit('deleteSocialItem')"
      v-if="!archived"
    ).soc-close
</template>

<script>
export default {
  name: 'social',
  props: {
    item: {
      type: Object,
      default() {
        return {
          id: '',
          profile_id: '',
          name: '',
          image: '',
          network_id: '',
          network_name: '',
          url: '',
        };
      },
    },
    itemForSend: {
      type: Object,
      default() {
        return {
          request_id: '',
          network_id: '',
          profile_id: '',
          source_type: '',
        };
      },
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    imageLink() {
      return this.item.image ? this.item.image : '../../assets/no-photo.png';
    },
  },
};
</script>

<style scoped lang="stylus">
.source_ob img
  width 40px
  height 40px
  border-radius 50%
</style>
