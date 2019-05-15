<template lang="pug">
  .popup.popup--chart
    .popup__close(@click.stop="popupClose") Закрыть
    .section-title График обращений
    .user-info
      span {{ chartData.username }}
      span  c {{ pickedDate.from }} по {{ pickedDate.to }}
    canvas#myChart.popup__chart
</template>

<script>
export default {
  name: 'reportsChart',
  props: {
    chartData: {
      type: Object,
    },
    pickedDate: {
      type: Object,
    },
  },
  mounted() {
    const vm = this;
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
        labels: vm.chartData.timeLine,
        datasets: vm.setDataChart(),
      },
      // Configuration options go here
      options: {},
    });
  },
  methods: {
    popupClose() {
      this.$emit('popupClose');
    },
    setDataChart() {
      const datasetsArr = [];
      this.chartData.statuses.forEach((status) => {
        const obj = {};
        obj.label = status.statusName;
        obj.borderColor = this.getRandomColor();
        obj.fill = false;
        obj.data = status.yAxes;
        datasetsArr.push(obj);
      });
      return datasetsArr;
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
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
    &__chart
      width 600px
    &__close
      position absolute
      right 1em
      top 1em
      cursor pointer
</style>
