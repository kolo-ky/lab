<template lang="pug">
  .operator_page
    yes-no-popup(
      v-if="deletePopupShow"
      :message="`Подтвердите удаление обращения №${clickedRequestIdForDelete.id}`"
      @agree="deleteRequest(clickedRequestIdForDelete)"
      @close="deletePopupShow = !deletePopupShow"
    )
    yes-no-popup(
      v-if="changeRequestStateShow"
      :message="clickedRequestStateForChangeMess"
      @agree="changeRequestState(clickedRequestIdForChange, clickedRequestStateForChange)"
      @close="changeRequestStateShow = !changeRequestStateShow"
    )
    .row.row_content
      .col-sm-12.align-self-center.table_content_overflow(style="min-height: 50vh;")
        .table_content.table_operator2
          table.table.table-striped
            thead
              tr
                th(
                  cope='col'
                  v-for="headerItem in headerItems"
                  v-if="showThUsername(headerItem)"
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
                        ).dropdown__item(
                          :class="{ click: headerItem.dataBind === 'archived' && !item}"
                        ).
                          {{ item === 'pause' ? 'Пауза' :
                             item === 'stop' ? 'Остановлено' :
                             item === 'run' ? 'Запущено' :
                             item === 'edited' ? 'Изменен' :
                             item === 'new' ? 'Новый' :
                             item === 'deleted' ? 'Удален' :
                             item === 'work' ? 'В работе' :
                             item === 'completed' ? 'Выполнен' :
                             headerItem.dataBind === 'create_date' ? dateFormatting(item) :
                             headerItem.dataBind === 'update_date' ? dateFormatting(item) :
                             item.toString() === 'true' ? 'Да' :
                             item.toString() === 'false' ? 'Нет' :
                             item }}
                th(scope='col')
            .preLoad(v-if="requestPending")
              img(src=  "../assets/25.svg")
            tbody.table_operator(v-else)
              tr(
                v-for="(item, index) in multiFilter"
                :key="item.id"
                v-if="index <= showItemsCount"
                @click.stop="showAnalytics(item, $event)"
                :style="`cursor: pointer; background-color: ${item.outside ? 'rgba(255,165,0,0.4)' : ''}`"
              )
                td {{ item.id }}
                td(v-if="$store.getters.getUserRole !== 'operator'") {{ item.username }}
                td
                  .row.justify-content-center
                    .request__state-change(
                      v-if="item.canplay.play"
                      @click.prevent="clickedRequestStateForChange = 'run'," +
                                     "changeRequestStateShow = !changeRequestStateShow," +
                                     "clickedRequestIdForChange = item.id," +
                                     "clickedRequestStateForChangeMess = 'Запустить заявку?'"
                    )
                      img(src="../assets/play.png")
                    .request__state-change(
                      v-if="item.canplay.pause"
                      @click.prevent="clickedRequestStateForChange = 'pause'," +
                                     "changeRequestStateShow = !changeRequestStateShow," +
                                     "clickedRequestIdForChange = item.id," +
                                     "clickedRequestStateForChangeMess = 'Поставить на паузу?'"
                    )
                      img(src="../assets/pause.png")
                    .request__state-change(
                      v-if="item.canplay.stop"
                      @click.prevent="clickedRequestStateForChange = 'stop'," +
                                     "changeRequestStateShow = !changeRequestStateShow," +
                                     "clickedRequestIdForChange = item.id," +
                                     "clickedRequestStateForChangeMess = 'Остановить?'"
                    )
                      img(src="../assets/stop.png")
                    .request__state(
                      v-if="item.play === 'run'"
                    ) Запущено
                    .request__state(
                      v-else-if="item.play === 'pause'"
                    ) Пауза
                    .request__state(
                      v-else="item.play === 'stop'"
                    ) Остановлено
                td {{ item.requestname }}
                <!--td {{ item.ready }}-->
                td(v-if="item.status === 'edited'") Изменен
                td(v-if="item.status === 'new'") Новый
                td(v-if="item.status === 'completed'") Выполнен
                td(v-if="item.status === 'deleted'") Удален
                td(v-if="item.status === 'work'") В работе
                td {{ dateFormatting(item.create_date) }}
                td {{ dateFormatting(item.update_date) }}
                td
                  .toggle-list.toggle-list--big-table.js-user-menu(v-if="item.files.length")
                    .toggle-list__toggle.js-fade-menu-toggle(@click.stop="toggleFadeMenu")
                    ul.toggle-list__list.js-fade-menu
                      li(v-for="file in item.files").toggle-list__item
                        a(:href="`${ url }${ file.link }`") {{ file.filename }}
                td(v-if="$store.getters.getUserRole === 'admin'")
                  input(type="checkbox"
                        :id="`checkbox${index}-2`"
                        :checked="item.undeletable"
                        )
                  label(
                    :for="`checkbox${index}-2`"
                    @click.stop="setAsUndeletable(item.id, item.undeletable)"
                  )
                td
                  input(type="checkbox"
                        :id="`checkbox${index}`"
                        :checked="item.archived"
                        :disabled="$store.getters.getUserRole !== 'admin'"
                        )
                  label(
                    :for="`checkbox${index}`"
                    @click.prevent="addToArchived(item.id, item.archived)"
                    :class="{'label__dis': $store.getters.getUserRole !== 'admin'}"
                  )
                td
                  a(
                    href="#"
                    @click.prevent="editRequest(item)"
                    style="position: relative; z-index: 10;"
                  )
                    img(src=  "../assets/edit.png")
                  a(
                    href="#"
                    @click.prevent="deletePopupShow = !deletePopupShow," +
                                   "clickedRequestIdForDelete = item"
                    v-if="item.status !== 'deleted' && !item.undeletable"
                  )
                    img(src=  "../assets/delete.png")
      a(
        v-if="multiFilter.length >= showItemsCount"
        href="#"
        @click.prevent="showMore"
      ).btn_blue Показать еще
</template>

<script>
import axios, { API_URL } from '@/axios/axios';
import { dateFormatting } from '@/utils/date';
import YesNoPopup from '../components/modals/yesNoPopup.vue';

export default {
  components: { YesNoPopup },
  data() {
    return {
      requestPending: false,
      changeRequestStateShow: false,
      clickedRequestStateForChange: '',
      clickedRequestIdForChange: '',
      clickedRequestStateForChangeMess: '',
      archivingStatus: '',
      showInfoPopup: false,
      deletePopupShow: false,
      clickedRequestIdForDelete: '',
      url: API_URL,
      showItemsCount: 15,
      headerItems: [
        {
          name: '№<br>обращения',
          dataBind: 'id',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        {
          name: 'Ответственный',
          dataBind: 'username',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        {
          name: 'Состояние',
          dataBind: 'play',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: false,
          enableSort: true,
        },
        {
          name: 'Название',
          dataBind: 'requestname',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        // {
        //   name: '% загрузки<br>ретроспективы',
        //   dataBind: 'ready',
        //   listOfItemsForFilter: [],
        //   filterColumnBy: [],
        //   searchInColumnBy: '',
        //   enableFilter: false,
        //   enableSort: false,
        // },
        {
          name: 'Статус',
          dataBind: 'status',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: false,
          enableSort: true,
        },
        {
          name: 'Дата<br>создания',
          dataBind: 'create_date',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        {
          name: 'Дата<br>изменения',
          dataBind: 'update_date',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: true,
          enableSort: true,
        },
        {
          name: 'Файлы',
          dataBind: 'files',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: false,
          enableSort: false,
        },
        {
          name: 'Запрет удаления',
          dataBind: 'undeletable',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: false,
          enableSort: true,
        },
        {
          name: 'Архив',
          dataBind: 'archived',
          listOfItemsForFilter: [],
          filterColumnBy: [],
          searchInColumnBy: '',
          enableFilter: false,
          enableSort: true,
        },
      ],
      requests: '',
    };
  },
  mounted() {
    this.getRequests().then(() => { this.clickOnElem(); });
  },
  methods: {
    sortFilters() {
      this.headerItems.forEach((item) => {
        // enable filter for date items, if they name contains 'date'
        if (item.dataBind.indexOf('date') + 1) {
          item.listOfItemsForFilter.sort((a, b) => {
            const aDate = a.split('.').reverse().join('-');
            const bDate = b.split('.').reverse().join('-');
            return (new Date(aDate).getTime() - new Date(bDate).getTime());
          });
          item.listOfItemsForFilter.reverse();
        }
        else if (item.dataBind.indexOf('id') + 1) {
          return false;
        }
        else {
          item.listOfItemsForFilter.sort();
        }
      });
    },
    editRequest(item) {
      if (item.outside === true) {
        console.log(item.outside);
        localStorage.setItem('outside', true);
      }
      this.$router.push(`/edit-request/${item.id}`);
    },
    clickOnElem() {
      document.querySelector('.click').click();
    },
    addToArchived(id, archived) {
      if (this.$store.getters.getUserRole === 'admin') {
        this.$http.post('/request/archivation', {
          id,
          archiv: !archived,
        })
          .then(() => {
            this.getRequests();
          })
          .catch(() => {
            this.getRequests();
          });
      }
    },
    getRequests() {
      return new Promise((resolve, reject) => {
        this.requestPending = true;
        axios.post('/requests/get', {})
          .then((resp) => {
            this.requests = resp.data;
            const vm = this;
            this.headerItems
              .forEach((item) => {
                vm.requests.forEach((request) => {
                  if (item.dataBind === 'create_date' || item.dataBind === 'update_date') {
                    request[item.dataBind] = this.dateFormatting(request[item.dataBind]);
                  }
                  if (item.listOfItemsForFilter.indexOf(request[item.dataBind]) === -1) {
                    if (request[item.dataBind] !== null && request[item.dataBind] !== '') {
                      item.listOfItemsForFilter.push(request[item.dataBind]);
                    }
                  }
                });
              });
            this.requestPending = false;
            resolve();
          })
          .then(() => {
            this.sortFilters();
          })
          .catch((err) => {
            reject(err);
            this.requestPending = false;
          });
      });
    },
    showAnalytics(elem, event) {
      if (event.target.tagName !== 'IMG' &&
          event.target.tagName !== 'LABEL' &&
          event.target.tagName !== 'INPUT' &&
          !event.target.classList.contains('toggle-list__toggle')) {
        this.$router.push(`/analytics/${elem.id}/lenta`);
      }
    },
    changeRequestState(id, status) {
      this.$http.post('/request/action', {
        id,
        play: status,
      })
        .then(() => {
          this.changeRequestStateShow = !this.changeRequestStateShow;
          this.getRequests();
        })
        .catch(err => err);
    },
    showThUsername(headerItem) {
      if (headerItem.dataBind === 'username') {
        if (this.$store.getters.getUserRole === 'operator') {
          return false;
        }
        return true;
      }
      if (headerItem.dataBind === 'undeletable') {
        if (this.$store.getters.getUserRole === 'admin') {
          return true;
        }
        return false;
      }
      return true;
    },
    toggleFadeMenu($event) {
      const target = $event.target;
      const list = target.parentElement;
      list.classList.toggle('active');
    },
    dateFormatting,
    showMore() {
      this.showItemsCount += 15;
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
    deleteRequest(item) {
      if (!item.archived) {
        axios.post('/request/delete', { id: item.id })
          .then(() => {
            this.deletePopupShow = !this.deletePopupShow;
            this.getRequests();
          })
          .catch(err => err);
      }
    },
    setAsUndeletable(id, undeletable) {
      this.$http.post('/request/undeletable', { id, undeletable: !undeletable })
        .then(() => {
          console.log('success');
          this.getRequests();
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

      if (this.requests) {
        filteredArray = this.requests
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
.label__dis
  cursor initial
  opacity .6
.request
  &__state
    margin-top .1em
    &-change
      cursor pointer
.toggle-list--big-table.active .toggle-list__list
  display block
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
