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
        canvas(
          :id="`myChart${chartCount}`"
        )
</template>

<script>
import { dateFormatting, dateForSend } from '../utils/date';
import fileSaver from 'file-saver';
import jsPDF from 'jspdf';

export default {
  name: 'ageChart',
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
            datasets: [
              {
                label: 'От 18 до 25',
                backgroundColor: 'rgba(132, 132, 223, 1)',
                borderColor: 'rgb(255, 99, 132)',
                data: vm.respAxisY1,
              },
              {
                label: 'От 26 до 40',
                backgroundColor: 'rgba(244, 241, 66, 1)',
                borderColor: 'rgb(168, 166, 43)',
                data: vm.respAxisY2,
              },
              {
                label: 'От 40',
                backgroundColor: 'rgba(147, 237, 64, 1)',
                borderColor: 'rgb(82, 137, 31)',
                data: vm.respAxisY3,
              },
              {
                label: 'Неизвестно',
                backgroundColor: 'rgba(73, 116, 255, 1)',
                borderColor: 'rgb(52, 83, 186)',
                data: vm.respAxisY4,
              },
            ],
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
        this.respData.graph_data['s18-25'].forEach((elem) => {
          axisXData.push(dateFormatting(elem[0]));
        });
      }
      return axisXData;
    },
    respAxisY1() {
      const axisYData = [];
      if (this.respData.graph_data !== undefined) {
        this.respData.graph_data['s18-25'].forEach((elem) => {
          axisYData.push(elem[1]);
        });
      }
      return axisYData;
    },
    respAxisY2() {
      const axisYData = [];
      if (this.respData.graph_data !== undefined) {
        this.respData.graph_data['s26-40'].forEach((elem) => {
          axisYData.push(elem[1]);
        });
      }
      return axisYData;
    },
    respAxisY3() {
      const axisYData = [];
      if (this.respData.graph_data !== undefined) {
        this.respData.graph_data.s40p.forEach((elem) => {
          axisYData.push(elem[1]);
        });
      }
      return axisYData;
    },
    respAxisY4() {
      const axisYData = [];
      if (this.respData.graph_data !== undefined) {
        this.respData.graph_data.u.forEach((elem) => {
          axisYData.push(elem[1]);
        });
      }
      return axisYData;
    },
    dateFrom() {
      if (this.respData.graph_data !== undefined) {
        return dateFormatting(this.respData.graph_data['s18-25'][0][0]);
      }
    },
    dateTo() {
      if (this.respData.graph_data !== undefined) {
        return dateFormatting(this.respData.graph_data['s18-25'][this.respData.graph_data['s18-25']
          .length - 1][0]);
      }
    },
  },
  methods: {
    dateFormatting,
    dateForSend,
    printVoucher() {
      const canvasImg = document.getElementById(`myChart${this.chartCount}`).toDataURL();
      // creates PDF from img
      const doc = new jsPDF('landscape');
      doc.setFontSize(20);
      doc.text(15, 15, 'Cool Chart');
      doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 150);
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
      this.$http.post('/stats/age/download', requestParams, { responseType: 'blob' })
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
              vm.chart.data.datasets[0].data = vm.respAxisY1;
              vm.chart.data.datasets[1].d1 = vm.respAxisY2;
              vm.chart.data.datasets[2].data = vm.respAxisY3;
              vm.chart.data.datasets[3].data = vm.respAxisY4;
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
  cursor pointer
</style>
