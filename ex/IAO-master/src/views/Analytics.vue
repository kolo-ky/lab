<template lang="pug">
  .row.justify-content-md-center
    analytics-side-bar
    router-view
</template>

<script>
import AnalyticsSideBar from '../components/navigationBars/analyticsSideBar.vue';

export default {
  name: 'Analytics',
  components: { AnalyticsSideBar },
};
</script>

<style scoped lang="stylus">

</style>
