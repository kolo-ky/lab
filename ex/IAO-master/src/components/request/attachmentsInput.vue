<template lang="pug">
  input(type="file" @change="test" hidden).attach-file
</template>

<script>
export default {
  name: 'attachmentsInput',
  mounted() {
    this.click();
  },
};
</script>

<style scoped>

</style>
