<template lang="pug">
  div
    input(type="text"  :value="state.text_before" disabled)
    input(tupe="text" :value="state.text_after" disabled)
    span {{ state.username }}
    span {{ state.date }}
    br
</template>

<script>
export default {
  name: 'keyWordsState',
  props: {
    state: {
      type: Object,
    },
  },
};
</script>

<style scoped>

</style>
