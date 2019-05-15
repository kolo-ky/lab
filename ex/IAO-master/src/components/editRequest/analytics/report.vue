<template lang="pug">
  .col-md-8.align-self-center.content_koment
    .row.justify-content-md-center.analiz_content
      chart(
        :chartCount="1"
        :apiUrl="'/stats'"
        :type="'likes'"
        :title="'Лайки'"
        :chartType="'bar'"
      )
      chart(
        :chartCount="3"
        :apiUrl="'/stats'"
        :type="'reposts'"
        :title="'Репосты'"
        :chartType="'bar'"
      )
</template>

<script>
import Chart from '../../chart.vue';

export default {
  name: 'report',
  components: { Chart },
  data() {
    return {
      chartCount: 1,
    };
  },
};
</script>

<style scoped>

</style>
