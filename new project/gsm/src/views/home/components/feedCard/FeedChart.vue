<template>
  <div class="feed-chart">
    <line-chart
      :chart-data="dataCollection"
      :options="options"
      :height="120"
    />
  </div>
</template>

<script>
// chart
import { LineChart } from '../../../components/charts/';

export default {
  name: "FeedChart",
  props: {
    feed: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      maxOffset: 68,
      dataForChart: null,
      dataCollection: {},
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 25,
            bottom: 0
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            ticks: {
              fontSize: 10,
              fontFamily: "Roboto",
              fontColor: "#B3BCCC",
              beginAtZero: true
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25,
              display: false,
            },
            gridLines: {
              zeroLineWidth: 0,
              color: "rgba(0, 0, 0, 0)",
            }
          }],
        },
        plugins: {
          datalabels: {
            display: false,
          },
        },
        tooltips: {
          mode: false,
          callbacks: {
            title: function() {},
            label: function() {}
          }
        },
        hover: {mode: null},
        animation: {
          pointerdown: false,
          onComplete: (animation) => {
            const chartWidth = animation.chart.scales["x-axis-0"].width;
            const pointsCount = this.dataCollection.datasets[0].data.length - 1;
            const nextStep = (chartWidth / pointsCount);

            const ctx = animation.chart.ctx;
            let step = 15;

            ctx.fillStyle = "#5E6D82";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            this.dataCollection.datasets.forEach(function (dataset) {
              dataset.data.forEach(function (point) {
                ctx.fillText(point, step, 15);
                step += nextStep;
              });
            });
          }
        }
      }
    };
  },
  mounted() {
    this.dataForChart = this.feed.additional.publicationsgrowthwithtrust;

    this.dataCollection = {
      labels: this.dataForChart.total.map(elem => elem[0]),
      datasets: [{
        label: "Негативные",
        borderColor: '#1989fa',
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: "#1989fa",
        pointBorderColor: "#1989fa",
        backgroundColor: "transparent",
        data: this.dataForChart.total.map(elem => elem[1]),
      }],
    };
  },
  components: {
    LineChart
  }
};
</script>

<style>
.feed-chart {
  margin-bottom: 20px;
  margin-left: -5px;
}
</style>
