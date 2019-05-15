<template lang="pug">
  .popup
    .popup__close(@click.stop="$emit('close')") Закрыть
    p.popup__message {{ message }}
    .row.justify-content-around
      .btn.btn_blue(@click.stop="$emit('close')") Продолжить
</template>

<script>
export default {
  name: 'infoPopup',
  props: {
    message: {
      type: String,
    },
  },
};
</script>

<style lang="stylus">
  .popup
    position fixed
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background #fff
    z-index 100
    padding 2em
    width 600px
    &__message
      text-align center
    &__close
      position absolute
      right 1em
      top 1em
      cursor pointer
</style>
