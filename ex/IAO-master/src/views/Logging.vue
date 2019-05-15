<template lang="pug">
  .row.justify-content-md-center.row_content
    .col-sm-12.align-self-center.table_content_overflow
      .file_download(style="text-align: right;")
        a(href="#" @click.prevent="getDocument('xls')")
          | Скачать отчет
          img(src="../assets/doc_xls.png")
      .table_content.table_log
        table.table.table-striped
          thead
            tr
              th(
              cope='col'
              v-for="headerItem in headerItems"
              )
                span(v-html="headerItem.name")
                span
                  p.dropdown-outer(v-if="headerItem.enableFilter")
                    img.dropdown-i(
                      src="../assets/table_icone.png"
                      @click.stop="showDropdown"
                      :class="{'dropdown-i--active': headerItem.searchInColumnBy}"
                    )
                    span.dropdown
                      input(
                      type="text"
                      placeholder='Поиск'
                      v-model="headerItem.searchInColumnBy"
                      ).dropdown__input
                  p.dropdown-outer(v-if="headerItem.enableSort")
                    img.dropdown-i(
                      src="../assets/select_icone.png"
                      @click.stop="showDropdown"
                      :class="{'dropdown-i--active': headerItem.filterColumnBy.length}"
                    )
                    input(type="text" hidden)
                    ul.dropdown
                      li(
                      v-for="item in headerItem.listOfItemsForFilter"
                      @click.stop="selectDropdownItem($event, headerItem)"
                      :data-value="item.toString()"
                      ).dropdown__item.
                        {{ item === 'pause' ? 'Пауза' :
                           item === 'stop' ? 'Остановлено' :
                           item === 'run' ? 'Запущено' :
                           item === 'edited' ? 'Изменен' :
                           item === 'new' ? 'Новый' :
                           item === 'deleted' ? 'Выполнен' :
                           item === 'work' ? 'В работе' :
                           item === 'completed' ? 'Выполнен' :
                           item.toString() === 'true' ? 'Да' :
                           item.toString() === 'false' ? 'Нет' :
                           item }}
        .scroll
          table.table.table-striped
            tbody
              tr(v-for="log in multiFilter")
                td {{ log.date }}
                td {{ log.username }}
                td {{ log.number }}
                td {{ log.caption }}
                td {{ log.before }}
                td {{ log.after }}
    .btn.btn_blue(
      v-if="showMoreBtn"
      style="margin-top: 2em;"
      @click.stop="showMore"
    ) Показать еще
</template>

<script>
import { dateFormatting, dateToTime } from '../utils/date';
import fileSaver from 'file-saver';

export default {
  name: 'Logging',
  data() {
    return {
      showMoreBtn: 'true',
      logs: '',
      limit: 15,
      pageOffset: 1,
      headerItems: [
        {
          name: 'Дата изменений',
          dataBind: 'date',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        {
          name: 'Кем изменено',
          dataBind: 'username',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        {
          name: '№ обращения',
          dataBind: 'number',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        {
          name: 'Название',
          dataBind: 'caption',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        {
          name: 'Что было',
          dataBind: 'before',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: false,
          enableSort: false,
        },
        {
          name: 'Что стало',
          dataBind: 'after',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: false,
          enableSort: false,
        },
      ],
    };
  },
  mounted() {
    this.$http.post('/logs/display', {
      limit: this.limit,
      offset: this.pageOffset,
    })
      .then((resp) => {
        this.logs = resp.data.log;
        if (this.logs.length < this.limit) {
          this.showMoreBtn = !this.showMoreBtn;
        }
        this.logs.forEach((log) => {
          log.date = `${this.dateFormatting(log.date)} ${this.dateToTime(log.date)}`;
        });
        const vm = this;
        this.headerItems
          .forEach((item) => {
            vm.logs.forEach((log) => {
              if (item.listOfItemsForFilter.indexOf(log[item.dataBind]) === -1) {
                if (log[item.dataBind] !== null) {
                  item.listOfItemsForFilter.push(log[item.dataBind]);
                }
              }
            });
          });
      })
      .then(() => {
        this.sortFilters();
      })
      .catch(err => err);
  },
  updated() {
    $('.scroll').mCustomScrollbar({
      theme: 'inset-dark',
    });
  },
  methods: {
    dateFormatting,
    dateToTime,
    sortFilters() {
      this.headerItems.forEach((item) => {
        if (item.dataBind.indexOf('number') + 1) {
          item.listOfItemsForFilter.sort((a, b) => {
            if (a > b) return -1;
            if (a < b) return 1;
            if (a === b) return 0;
          });
        }
        else {
          item.listOfItemsForFilter.sort();
        }
      });
    },
    showMore() {
      this.pageOffset += 1;
      this.$http.post('/logs/display', {
        limit: this.limit,
        offset: this.pageOffset,
      })
        .then((resp) => {
          if (resp.data.log.length < this.limit) {
            this.showMoreBtn = !this.showMoreBtn;
          }
          if (resp.data.log.length) {
            resp.data.log.forEach((elem) => {
              elem.date = `${this.dateFormatting(elem.date)} ${this.dateToTime(elem.date)}`;
              this.logs.push(elem);
            });
            const vm = this;
            this.headerItems
              .forEach((item) => {
                vm.logs.forEach((log) => {
                  if (item.listOfItemsForFilter.indexOf(log[item.dataBind]) === -1) {
                    if (log[item.dataBind] !== null) {
                      item.listOfItemsForFilter.push(log[item.dataBind]);
                    }
                  }
                });
                this.sortFilters();
              });
          }
        })
        .catch(err => err);
    },
    showDropdown($event) {
      if ($event.target.parentElement.querySelector('.dropdown')
        .classList.contains('dropdown--visible')) {
        document.querySelectorAll('.dropdown--visible')
          .forEach((elem) => {
            elem.classList.remove('dropdown--visible');
          });
      } else {
        document.querySelectorAll('.dropdown--visible')
          .forEach((elem) => {
            elem.classList.remove('dropdown--visible');
          });
        $event.target.parentElement.querySelector('.dropdown')
          .classList
          .add('dropdown--visible');
      }
    },
    selectDropdownItem($event, headerItem) {
      if ($event.target.classList.contains('dropdown__item--checked')) {
        $event.target.classList.remove('dropdown__item--checked');
        headerItem.filterColumnBy
          .splice(headerItem.filterColumnBy.indexOf($event.target.getAttribute('data-value')), 1);
      } else {
        $event.target.classList.add('dropdown__item--checked');
        headerItem.filterColumnBy.push($event.target.getAttribute('data-value'));
      }
    },
    getDocument(type) {
      this.$http.post('/logs/display/download', {}, { responseType: 'blob' })
        .then((resp) => {
          fileSaver.saveAs(new Blob([resp.data]), `Report.${type}`);
        })
        .catch(err => err);
    },
  },
  computed: {
    search() {
      const objectOfSearch = {};
      this.headerItems.forEach((item) => {
        objectOfSearch[item.dataBind] = item.searchInColumnBy;
      });
      return objectOfSearch;
    },
    filters() {
      const objectOfFilters = {};
      this.headerItems.forEach((item) => {
        objectOfFilters[item.dataBind] = item.filterColumnBy;
      });
      return objectOfFilters;
    },
    multiFilter() {
      let filteredArray = [];
      const searchKeys = Object.keys(this.search);
      const searchArr = this.search;
      const filtersKeys = Object.keys(this.filters);
      const filtersArr = this.filters;

      if (this.logs) {
        filteredArray = this.logs
          .filter(item => searchKeys.every((key) => {
            if (item[key] === null && searchArr[key] !== '') {
              return false;
            }
            if (item[key] !== null && typeof item[key] === 'string' && searchArr[key] !== '') {
              return !!(item[key].toLowerCase().indexOf(searchArr[key].toLowerCase()) + 1);
            }
            return true;
          }))
          .filter(item => filtersKeys.every((key) => {
            if (filtersArr[key].length) {
              if (item[key] === null) {
                return false;
              }
              if (typeof item[key] === 'boolean') {
                let filterItemCoincided = false;
                filtersArr[key].forEach((filterItem) => {
                  if (filterItem.toString() === item[key].toString()) {
                    filterItemCoincided = true;
                  }
                });
                return filterItemCoincided;
              }
              if (typeof item[key] === 'string') {
                let filterItemCoincided = false;
                filtersArr[key].forEach((filterItem) => {
                  if (filterItem.toString() === item[key].toString()) {
                    filterItemCoincided = true;
                  }
                });
                return filterItemCoincided;
              }
            }
            return true;
          }));
      }
      return filteredArray;
    },
  },
};
</script>

<style lang="stylus">
.dropdown
  position absolute
  top 100%
  left 0
  font-size 16px
  border 1px solid #ccc
  border-top none
  background #e9e9e9
  list-style-type none
  padding 10px
  margin 0
  z-index 100
  box-sizing border-box
  border-radius 8px
  opacity 0
  visibility hidden
  max-height 200px
  overflow auto
  padding-right 20px
  &--visible
    opacity 1
    visibility visible
  &__item
    white-space nowrap
    padding 5px
    cursor pointer
    &--checked
      color blue
  &__input
    padding-left .6em
  &-outer
    margin 0 4px 0 0
    line-height 17px
    position relative
  &-i
    height 21px
    width 21px
    cursor pointer
    border 2px solid transparent
    border-radius 50%
    &--active
      border-color green
</style>
