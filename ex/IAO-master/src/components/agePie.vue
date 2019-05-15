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
            img(src="../assets/print.png" @click="printVoucher").print-btn
          .col-md-6.align-self-center
            .analiz_select
              input(
                type="text"
                name="fname1"
                :placeholder="dateFrom"
                :value="pickedDate.from"
                :id="`datepicker${chartCount}`"
              )
            .analiz_select
              input(
                type="text"
                name="fname1"
                :placeholder="dateTo"
                :value="pickedDate.to"
                :id="`datepicker${chartCount + 1}`"
              )
      .analiz_content_img
        .preLoad(v-if="showPreLoad")
          img(src="../assets/25.svg")
        .row.justify-content-md-center.analiz_content(v-else)
          .col-md-6.align-self-center
            canvas(
              :id="`myChart${chartCount}`"
            )
          .col-md-6.align-self-center
            canvas(:id="`myChart${chartCount + 10}`")
</template>

<script>
import { dateFormatting, dateForSend } from '../utils/date';
import fileSaver from 'file-saver';
import jsPDF from 'jspdf';

export default {
  name: 'agePie',
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
      chart2: '',
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
        this.respData = resp.data;
      })
      .then(() => {
        this.$http.post('/stats/sex', requestParams)
          .then((resp) => {
            this.showPreLoad = !this.showPreLoad;
            return resp;
          })
          .then((resp) => {
            const ctx = document.getElementById(`myChart${this.chartCount + 10}`).getContext('2d');
            this.chart2 = new Chart(ctx, {
              // The type of chart we want to create
              type: 'pie',
              // The data for our dataset
              data: {
                labels: ['М', 'Ж', 'Неизвестно'],
                datasets: [{
                  backgroundColor: ['rgb(25, 113, 255)', 'rgb(244, 244, 66)', 'rgb(255, 81, 24)'],
                  borderColor: 'rgb(255, 255, 255)',
                  data: Object.values(resp.data.additionalData.sex),
                },
                ],
              },
              // Configuration options go here
              options: {},
            });
          })
          .then(() => {
            const ctx = document.getElementById(`myChart${vm.chartCount}`)
              .getContext('2d');
            this.chart = new Chart(ctx, {
              // The type of chart we want to create
              type: vm.chartType,
              // The data for our dataset
              data: {
                labels: ['от 18-25', 'от 25-40', 'от 40', 'Не определено'],
                datasets: [
                  {
                    backgroundColor: ['rgba(132, 132, 223, 1)', 'rgba(244, 241, 66, 1)', 'rgba(147, 237, 64, 1)', 'rgba(73, 116, 255, 1)'],
                    borderColor: 'rgb(255, 255, 255)',
                    data: this.respChartData,
                  },
                ],
              },
            });
          });
      })
      .catch(err => err);
  },
  computed: {
    respChartData() {
      return Object.values(this.respData.additional_data.age);
    },
    dateFrom() {
      if (this.respData.graph_data !== undefined) {
        return dateFormatting(this.respData.graph_data['s18-25'][0][0]);
      }
      return '';
    },
    dateTo() {
      if (this.respData.graph_data !== undefined) {
        return dateFormatting(this.respData.graph_data['s18-25'][this.respData.graph_data['s18-25']
          .length - 1][0]);
      }
      return '';
    },
  },
  methods: {
    dateFormatting,
    dateForSend,
    printVoucher() {
      const canvasImg = document.getElementById(`myChart${this.chartCount}`).toDataURL();
      const canvasImg2 = document.getElementById(`myChart${this.chartCount + 10}`).toDataURL();
      // creates PDF from img
      const doc = new jsPDF('landscape');
      doc.setFontSize(20);
      doc.text(15, 15, 'Cool Chart');
      doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 150);
      doc.addPage();
      doc.addImage(canvasImg2, 'JPEG', 10, 10, 280, 150);
      doc.save('Report.pdf');
    },
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
      this.$http.post('/stats/sex/download', requestParams, { responseType: 'blob' })
        .then((resp) => {
          fileSaver.saveAs(new Blob([resp.data]), `Report.${type}`);
        })
        .catch(err => err);
    },
  },
  watch: {
    pickedDate: {
      handler(newValue, oldValue) {
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
              vm.chart.data.datasets[0].data = vm.respChartData;
              vm.chart.update();
            })
            .then(() => {
              vm.$http.post('/stats/sex', requestParams)
                .then((resp) => {
                  vm.chart2.data.datasets[0].data = Object.values(resp.data.additionalData.sex);
                  vm.chart2.update();
                });
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
  cursor pointer
</style>
