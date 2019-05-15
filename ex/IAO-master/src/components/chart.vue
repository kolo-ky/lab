<template lang="pug">
  .col-sm-12.align-self-center
    .file_download(style="text-align: right; padding-right: 2em;")
      a(href="#" @click.prevent="getDocument('xls')")
        | Скачать отчет
        img(src="../assets/doc_xls.png" style="display: inline-block;")
    .analiz_content_item
      .analiz_content_head
        .row.justify-content-md-center.analiz_content
          .col-md-6.align-self-center
            | {{ title }}
            img(src="../assets/print.png"
            @click="printVoucher").print-btn
          .col-md-6.align-self-center
            .analiz_select
              input(
                type="text"
                name="fname1"
                :placeholder="dateFormatting(respAxisX[0])"
                :value="pickedDate.from"
                :id="`datepicker${chartCount}`"
              )
            .analiz_select
              input(
                type="text"
                name="fname1"
                :placeholder="dateFormatting(respAxisX[respAxisX.length - 1])"
                :value="pickedDate.to"
                :id="`datepicker${chartCount + 1}`"
              )
      .analiz_content_img
        .preLoad(v-if="showPreLoad")
          img(src="../assets/25.svg")
        canvas(
          v-else
          :id="`myChart${chartCount}`"
        )
</template>

<script>
import jsPDF from 'jspdf';
import fileSaver from 'file-saver';
import { dateFormatting, dateForSend } from '../utils/date';

export default {
  name: 'chart',
  props: {
    chartCount: Number,
    type: String,
    apiUrl: String,
    title: String,
    chartType: String,
  },
  data() {
    return {
      respData: '',
      pickedDate: {
        to: '',
        from: '',
      },
      chart: '',
      timeout: '',
      showPreLoad: false,
    };
  },
  mounted() {
    const vm = this;
    $(`#datepicker${this.chartCount}`).datepicker({
      onSelect() {
        vm.pickedDate.from = this.value;
      },
    });
    $(`#datepicker${this.chartCount + 1}`).datepicker({
      onSelect() {
        vm.pickedDate.to = this.value;
      },
    });
    const requestParams = {
      request_id: this.$route.params.id,
      type: this.type,
    };
    if (this.pickedDate.from) {
      requestParams.from = this.pickedDate.from;
    }
    if (this.pickedDate.to) {
      requestParams.to = this.pickedDate.to;
    }
    this.showPreLoad = !this.showPreLoad;
    this.$http.post(this.apiUrl, requestParams)
      .then((resp) => {
        this.showPreLoad = !this.showPreLoad;
        this.respData = resp.data;
      })
      .then(() => {
        const ctx = document.getElementById(`myChart${vm.chartCount}`)
          .getContext('2d');
        this.chart = new Chart(ctx, {
          // The type of chart we want to create
          type: vm.chartType,
          // The data for our dataset
          data: {
            labels: vm.respAxisX,
            datasets: [{
              label: vm.title,
              backgroundColor: 'rgba(132,132,223,0.7)',
              borderColor: 'rgb(255, 99, 132)',
              data: vm.respAxisY,
            }],
          },
          // Configuration options go here
          options: {},
        });
      });
  },
  computed: {
    respAxisX() {
      const axisXData = [];
      if (this.respData.graph_data !== undefined) {
        this.respData.graph_data.forEach((elem) => {
          axisXData.push(dateFormatting(elem[0]));
        });
      }
      return axisXData;
    },
    respAxisY() {
      const axisYData = [];
      if (this.respData.graph_data !== undefined) {
        this.respData.graph_data.forEach((elem) => {
          axisYData.push(elem[1]);
        });
      }
      return axisYData;
    },
  },
  methods: {
    printVoucher() {
      const canvasImg = document.getElementById(`myChart${this.chartCount}`).toDataURL();
      // creates PDF from img
      const doc = new jsPDF('landscape');
      doc.setFontSize(20);
      doc.text(15, 15, 'Cool Chart');
      doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 150);
      doc.save('Report.pdf');
    },
    dateFormatting,
    dateForSend,
    getDocument(type) {
      const requestParams = {
        request_id: this.$route.params.id,
        type: this.type,
      };
      if (this.pickedDate.from) {
        requestParams.from = `${dateForSend(this.pickedDate.from)} 00:00`;
      }
      if (this.pickedDate.to) {
        requestParams.to = `${dateForSend(this.pickedDate.to)} 23:59`;
      }
      this.$http.post(`${this.apiUrl}/download`, requestParams, { responseType: 'blob' })
        .then((resp) => {
          fileSaver.saveAs(new Blob([resp.data]), `Report.${type}`);
        })
        .catch(err => err);
    },
  },
  watch: {
    pickedDate: {
      handler() {
        clearTimeout(this.timeout);
        const requestParams = {
          request_id: this.$route.params.id,
          type: this.type,
        };
        const vm = this;
        if (this.pickedDate.from) {
          requestParams.from = `${this.dateForSend(this.pickedDate.from)} 00:00`;
        }
        if (this.pickedDate.to) {
          requestParams.to = `${this.dateForSend(this.pickedDate.to)} 23:59`;
        }
        this.timeout = setTimeout(() => {
          vm.$http.post(vm.apiUrl, requestParams)
            .then((resp) => {
              this.respData = resp.data;
            })
            .then(() => {
              vm.chart.data.labels = vm.respAxisX;
              vm.chart.data.datasets.forEach((dataset) => {
                dataset.data = vm.respAxisY;
              });
              vm.chart.update();
            })
            .catch(err => err);
        }, 1000);
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="stylus">
.print-btn
  width 20px
  display inline-block
  margin 0 0 0 3%
</style>
