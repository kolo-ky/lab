<template lang="pug">
  .row.row_content
    reports-chart(
      @popupClose="showPopup = !showPopup"
      v-if="showPopup"
      :chartData="dataForPopupChart"
      :pickedDate="pickedDate"
    )
    .section-title Отчеты
    .otchet_tab
      .col-sm-12.align-self-center.table_content_overflow
        .analiz-download-wrapper
          .analiz-download
            .analiz_select
              input(
                type="text"
                name="fname1"
                placeholder="Начало"
                :value="pickedDate.from"
              )#datepicker1
            .analiz_select
              span по
              input(
                type="text"
                name="fname1"
                placeholder="Конец"
                :value="pickedDate.to"
              )#datepicker2
          .file_download(v-if="users.length") Экспорт в файл
            a(href="#" @click.prevent="getDocument('doc')")
              img(src="../assets/doc_doc.png")
            a(href="#" @click.prevent="getDocument('xls')")
              img(src="../assets/doc_xls.png")
            a(href="#" @click.prevent="getDocument('pdf')")
              img(src="../assets/doc_pdf.png")
      .table_content.table_log.table_otchet.js-accordion(v-if="users.length")
        .js-accordion-item(v-for="(user, index) in users")
          table.table.table-user
            thead(v-if="index === 0")
              tr
                th(scope="col")
                th(scope="col") Пользователь
                th(scope="col") Статус
                th(scope="col") Обращение
                th(scope="col") Общее количество<br>обращений
                th(scope="col") Дата изменения<br>статуса
                th(scope="col") Фактическое время<br>работы в статусе
            tbody
              tr
                td
                  .table_otchet-active
                    a(
                      href="#"
                      @click.prevent="showPopup = !showPopup, dataForPopupChartInit(user)"
                    ).graph__link
                    .js-accordion-indicator.js-accordion-item-link
                td.js-accordion-item-link {{ user.userName }}
                td.js-accordion-item-link
                td.js-accordion-item-link
                td.js-accordion-item-link {{ getRequestsCount(user) }}
                td.js-accordion-item-link
                td.js-accordion-item-link
          .js-accordion-item-content(v-if="getRequestsCount(user)")
            .js-accordion-2
              .js-accordion-item-2(v-for="status in user.statuses")
                .js-accordion-item-link-2
                  table.table.table-subtable
                    tbody
                      tr
                        td
                        td
                          .js-accordion-indicator
                        td.
                          {{ status.statusName }}
                        td
                        td {{ status.requests.length }}
                        td
                        td
                .js-accordion-item-content-2
                  table.table.table-striped
                    tbody
                      tr(v-for="request in status.requests")
                        td
                        td
                        td
                        td {{ request.requestName }}
                        td
                        td.
                          {{ dateFormatting(request.endDate) }}
                          {{ dateToTime(request.endDate) }}
                        td {{ sec2time(request.time) }}
      div(v-else) Необходимо выбрать даты для отчета
</template>

<script>
import fileSaver from 'file-saver';
import { dateFormatting, dateToTime, dateForSend, sec2time } from '../utils/date';
import { toggleAccordion, toggleAccordion2 } from '../utils/accordion';
import ReportsChart from '../components/modals/reportsChart.vue';

export default {
  name: 'Reports',
  components: { ReportsChart },
  data() {
    return {
      users: '',
      showPopup: false,
      dataForPopupChart: '',
      pickedDate: {
        from: '',
        to: '',
      },
      timeout: '',
      test: '',
    };
  },
  mounted() {
    const vm = this;
    $('#datepicker1').datepicker({
      onSelect() {
        vm.pickedDate.from = this.value;
      },
    });
    $('#datepicker2').datepicker({
      onSelect() {
        vm.pickedDate.to = this.value;
      },
    });
  },
  methods: {
    dateFormatting,
    dateToTime,
    dateForSend,
    dataForPopupChartInit(user) {
      const obj = {};
      obj.username = user.userName;
      obj.statuses = [];
      obj.timeLine = [];
      user.statuses.forEach((status, index) => {
        obj.statuses[index] = {
          statusName: status.statusName,
        };
        obj.statuses[index].initValue = 0;
        obj.statuses[index].endValue = 0;
        obj.statuses[index].endDate = [];
        obj.statuses[index].startDate = [];
        obj.statuses[index].yAxes = [];
        status.requests.forEach((request) => {
          if (dateFormatting(request.startDate) !== dateFormatting(request.endDate)) {
            if (dateFormatting(request.startDate) <= this.pickedDate.from) {
              obj.statuses[index].initValue += 1;
              if (!request.endDate || dateFormatting(request.endDate) >= this.pickedDate.to) {
                obj.statuses[index].endValue += 1;
              } else {
                // push date to timeLine
                if (obj.timeLine.indexOf(dateFormatting(request.endDate)) === -1) {
                  obj.timeLine.push(dateFormatting(request.endDate));
                }
                obj.statuses[index].endDate.push(dateFormatting(request.endDate));
              }
            } else {
              obj.statuses[index].startDate.push(dateFormatting(request.startDate));
              // push date to timeLine
              if (obj.timeLine.indexOf(dateFormatting(request.startDate)) === -1) {
                obj.timeLine.push(dateFormatting(request.startDate));
              }
              if (!request.endDate || dateFormatting(request.endDate) >= this.pickedDate.to) {
                obj.statuses[index].endValue += 1;
              } else {
                // push date to timeLine
                if (obj.timeLine.indexOf(dateFormatting(request.endDate)) === -1) {
                  obj.timeLine.push(dateFormatting(request.endDate));
                }
                obj.statuses[index].endDate.push(dateFormatting(request.endDate));
              }
            }
          }
        });
      });
      obj.timeLine = obj.timeLine.sort((a, b) => {
        const aDate = a.split('.').reverse().join('-');
        const bDate = b.split('.').reverse().join('-');
        return (new Date(aDate).getTime() - new Date(bDate).getTime());
      });
      obj.statuses.forEach((status) => {
        let count = status.initValue;
        status.yAxes.push(count);
        obj.timeLine.forEach((date) => {
          if (status.endDate.indexOf(date) + 1) {
            count -= 1;
            status.yAxes.push(count);
          } else if (status.startDate.indexOf(date) + 1) {
            count += 1;
            status.yAxes.push(count);
          } else {
            status.yAxes.push(count);
          }
        });
        status.yAxes.push(status.endValue);
      });
      obj.timeLine.unshift(this.pickedDate.from);
      obj.timeLine.push(this.pickedDate.to);
      this.dataForPopupChart = obj;
    },
    getRequestsCount(user) {
      let count = 0;
      user.statuses.forEach((elem) => {
        count += elem.requests.length;
      });
      return count;
    },
    sec2time,
    getDocument(type) {
      this.$http.post('/report/download', {
        from: `${this.dateForSend(this.pickedDate.from)} 00:00`,
        to: `${this.dateForSend(this.pickedDate.to)} 23:59`,
        format: type,
      }, { responseType: 'blob' })
        .then((resp) => {
          fileSaver.saveAs(new Blob([resp.data]), `Report.${type}`);
          this.test = resp.data;
        })
        .catch(err => err);
    },
  },
  watch: {
    pickedDate: {
      handler() {
        clearTimeout(this.timeout);
        const requestParams = {};
        if (this.pickedDate.from && this.pickedDate.to) {
          requestParams.from = `${this.dateForSend(this.pickedDate.from)} 00:00`;
          requestParams.to = `${this.dateForSend(this.pickedDate.to)} 23:59`;
          this.timeout = setTimeout(() => {
            this.$http.post('/report', requestParams)
              .then((resp) => {
                this.users = resp.data;
              })
              .catch(err => err);
          }, 1000);
        }
      },
      deep: true,
    },
  },
  updated() {
    this.$nextTick(() => {
      toggleAccordion();
      toggleAccordion2();
    });
  },
};
</script>
