<template lang="pug">
  .col-md-8.align-self-center.content_koment
    .row.justify-content-md-center.analiz_content
      age-chart(
        :chartCount="1"
        :apiUrl="'/stats/age'"
        :type="'likes'"
        :title="'Анализ возрастной категории'"
        :chartType="'bar'"
      )
      age-pie(
        :chartCount="3"
        :apiUrl="'/stats/age'"
        :type="'likes'"
        :title="'Анализ самых активных участников'"
        :chartType="'pie'"
      )
</template>

<script>
import AgeChart from '../../ageChart.vue';
import AgePie from '../../agePie.vue';

export default {
  name: 'public',
  components: { AgePie, AgeChart },
};
</script>

<style scoped>

</style>
