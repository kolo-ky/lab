<template lang="pug">
  .row.justify-content-md-center.row_content
    info-popup(
      v-if="answerSend"
      :message="'Ваше сообщение отправлену оператору'"
      @close="answerSend = !answerSend"
    )
    info-popup(
      v-if="copyRSS"
      :message="`http://kom.glassen-it.com/api/rss/${ id }`"
      @close="copyRSS = !copyRSS"
    )
    yes-no-popup(
      v-if="deletePopupShow"
      :message="`Подтвердите удаление обращения №${ id }`"
      @agree="deleteRequest"
      @close="deletePopupShow = !deletePopupShow"
    )
    yes-no-popup(
      v-if="savePopupShow"
      :message="`Сохранить изменения в заявке №${ id }?`"
      @agree="createNewRequest(), savePopupShow = !savePopupShow"
      @close="savePopupShow = !savePopupShow"
    )
    new-source(
      v-if="showNewResource"
      :requesttype="requesttype"
      @addSocialItem="addSocialItemAction"
      @close="showNewResource = !showNewResource"
    )
    .col-sm-12.align-self-center
      .table_content
        table.table.table-striped
          thead
            tr
              th(scope='col') Ответственный – {{ this.owner || this.$store.getters.getUsername }}
              th(scope='col')
              th(scope='col') Дата создания –
                |  {{ dateFormatting(created_date) }}
      .odrachenie_form
        .odrachenie_header
          .odrachenie_header-left
            .nomer_zayavka {{ id }}
            a(
              href="#"
              @click.prevent="copyRSS = !copyRSS"
            ).btn_rss Получить RSS
            a.btn_new_zayavka.
              {{ status === 'edited' ? 'Измененная заявка' :
                 status === 'new' ? 'Новая заявка' :
                 status === 'deleted' ? 'Удалененная заявка' :
                 status === 'work' ? 'В работе' :
                 status === 'completed' ? 'Выполненая заявка': ''
              }}
          .odrachenie_header-file
            .file_add(v-if="!archived")
              p Добавить файл
              a.btn_dark_blue(
                href='#'
                @click.stop="addInputFile"
              ) +
            .file-list
              attachments(
                v-for="(file, index) in filesForAttachProperties"
                :fileParams="file"
                :key="file.upfile"
                @deleteFile="filesForAttachProperties.splice(index, 1)," +
                            "filesForAttach.splice(index, 1)"
                style="color: green"
              )
              attachments(
                v-for="file in files"
                :file="file"
                :key="file.link"
              )
        .row.justify-content-md-center
          .col-sm-12
            form(@submit.prevent="createNewRequest")
              label Название обращения
              br
              input(
                type='text'
                placeholder='Название'
                v-model="requestname"
                :disabled="archived")
              br
              label Раздел поиска
              br
              p.dropdown-outer
                span.dropdown-current(
                  @click.stop="!archived ? showDropdown($event) : false"
                  :data-value="searchItems[0].value"
                ) {{ searchItems[0].name }}
                ul.dropdown
                  li(
                    v-for="item in searchItems"
                    :data-value="item.value"
                    @click.prevent="setCurrentRequestType"
                  ).dropdown__item.searchItems {{ item.name }}
              template(v-if="requesttypeState")
                span Изменил {{ requesttypeState.username }}
                span Дата изменений - {{ dateFormatting(requesttypeState.date) }}
              br
              label Ретроспектива
              br
              p.dropdown-outer
                span.dropdown-current(
                  @click.stop="!archived ? showDropdown($event) : false"
                  :data-value="setRetrospectiveDate(1)"
                ) {{ retro.substring(0, retro.indexOf(' ')).split('-').reverse().join('.') }}
                ul.dropdown
                  li(
                    v-for="monthCount in 11"
                    :data-value="setRetrospectiveDate(monthCount), retro"
                    @click.prevent="setCurrentRetrospective"
                  ).dropdown__item.
                    {{ monthCount }}
                    {{ monthCount === 1 ? 'месяц' :
                       monthCount < 5 ? 'месяца' : 'месяцев' }}
                  li(
                      :data-value="setRetrospectiveDate(12)"
                      @click.prevent="setCurrentRetrospective"
                  ).dropdown__item 1 год
              template(v-if="retroState")
                span Изменил {{ retroState.username }}
                span Дата изменений - {{ dateFormatting(retroState.date) }}
              br
              template(v-if="requesttype === 'keywords'")
                label Ключевые слова
                a.btn_dark_blue(
                  href="#"
                  @click.prevent="addKeyWord"
                  v-if="!archived"
                ) +
                br
                .key_words
                  .scroll2
                    key-word(
                      v-for="(word, index) in keyWordsList"
                      :key="index"
                      :archived="archived"
                      v-model="word.value"
                      @deleteWord="keyWordsList.splice(index, 1)"
                    )
              template(v-else)
                label Источник
                  a(
                    href="#"
                    @click.prevent="showNewResource = !showNewResource"
                    v-if="!archived"
                  ).btn_dark_blue +
                br
                .source_ob.scroll10(v-if="socialList.length || socialListForSend.length")
                  social(
                    v-for="(itemForSend, index) in socialListForSend"
                    :key="index"
                    :archived="archived"
                    :item="itemForSend"
                    @deleteSocialItem="socialListForSend.splice(index, 1)"
                  )
                  social(
                    v-for="(item, index) in socialList"
                    :key="item.url"
                    :archived="archived"
                    :item="item"
                    @deleteSocialItem="socialListForDel.push(item.id), socialList.splice(index, 1)"
                  )
              label(v-if="keyWordsState.length") Отредактировано
              .key_words2
                .scroll2
                  key-words-state(
                    v-for="(state, index) in keyWordsState"
                    :key="index"
                    :state="state"
                  )
              .row
                .col-md-12.col-xl-6
                  label Содержание запроса
                  br
                  textarea(
                    rows='7'
                    cols='45'
                    name='text'
                    v-model="text_description"
                    :disabled="archived"
                  )
                .col-md-12.col-xl-6
                  .recommend_wrapper
                    label Рекомендации
                    br
                    .scroll2
                      .message(v-html="recomendations")
                    input(type="text" v-model="answer")
                    input(
                      type="submit"
                      @click.prevent="sendAnswer"
                      value="Отправить"
                    ).btn_blue
              .bottom_btn(v-if="!archived")
                input(
                  type="submit"
                  class="btn_right"
                  value="Удалить"
                  @click.prevent="deletePopupShow = !deletePopupShow"
                )
                input(
                  type="submit"
                  class="btn_right"
                  value="Сохранить"
                  @click.prevent="savePopupShow = !savePopupShow")
                input(
                  v-if="canplay.stop === true"
                  type="submit"
                  class="btn_right"
                  value="Остановить сбор"
                  @click.prevent="stopRequest"
                )
                router-link(:to="'/analytics/' + id + '/lenta'").btn_right Вывести аналитику
</template>

<script>
import neponyatnayaHyeta from '@/verstka/jquery.mCustomScrollbar.concat.min';
import neponyatnayaHyetaReincarnation from '@/verstka/select';
import poeben from '@/verstka/strange';
import { dateFormatting } from '@/utils/date';
import KeyWord from '../components/request/keyWord.vue';
import Attachments from '../components/request/attachments.vue';
import KeyWordsState from '../components/editRequest/keyWordsState.vue';
import Social from '../components/request/social.vue';
import NewSource from '../components/modals/newSource.vue';
import YesNoPopup from '../components/modals/yesNoPopup.vue';
import InfoPopup from '../components/modals/infoPopup.vue';

export default {
  name: 'EditRequest',
  components: {
    InfoPopup,
    YesNoPopup,
    KeyWordsState,
    Attachments,
    KeyWord,
    Social,
    NewSource,
  },
  data() {
    return {
      copyRSS: false,
      status: '',
      answer: '',
      answerSend: false,
      canplay: '',
      savePopupShow: false,
      deletePopupShow: false,
      showNewResource: false,
      owner: '',
      uid: '',
      created_date: '',
      username: '',
      archived: false,
      keyWordsList: [],
      keywords: [],
      requestname: '',
      requesttype: 'keywords',
      requesttypeState: {},
      recomendations: '',
      retro: this.setRetrospectiveDate(1),
      retroState: {},
      text_description: '',
      id: '',
      files: [],
      filesForAttach: [],
      filesForAttachProperties: [],
      keyWordsState: [],
      searchItems: [
        {
          name: 'наблюдение',
          value: 'keywords',
        },
        {
          name: 'персона',
          value: 'users',
        },
        {
          name: 'событие',
          value: 'groups',
        },
      ],
      socialList: [],
      socialListForSend: [],
      socialListForDel: [],
    };
  },
  /* eslint-disable */
  methods: {
    dateFormatting,
    sendAnswer() {
      this.$http.post('/requests/recomendationadd', {
        request_id: this.$route.params.id,
        message: this.answer,
      })
        .then(() => {
          this.answerSend = !this.answerSend;
          this.getRequest();
        })
        .catch(err => err);
    },
    stopRequest() {
      this.$http.post('/request/action', {
        id: this.id,
        play: 'stop',
      })
        .then(() => {
          this.$router.push('/');
        })
        .catch(err => err);
    },
    deleteRequest() {
      if (!this.archived) {
        this.$http.post('/request/delete', { id: this.id, })
          .then(() => {
            this.deletePopupShow = !this.deletePopupShow;
            this.$router.push('/')
          })
          .catch(err => err);
      }
    },
    addSocialItemAction(item) {
      this.socialListForSend.unshift(item);
      this.showNewResource = !this.showNewResource
    },
    createNewRequest() {
      let vm = this;
      this.keyWordsList.forEach(function (elem) {
        vm.keywords.push(elem.value);
      });
      let requestParams = {
        id: this.id,
        uid: '',
        requestname: this.requestname,
        requesttype: this.requesttype,
        retro: this.retro,
        keywords: this.keywords,
        text_description: this.text_description,
      };
      this.$http.post('/requests/save', requestParams)
        .then((resp) => {
          if (this.filesForAttach.length) {
            this.id = resp.data.id;
            this.filesForAttach.forEach((file) => {
              let formData = new FormData();
              formData.append('file', file);
              formData.append('request_id', this.id);
              this.$http.post('/request/addfile', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
                .then(() => {
                  console.log('success');
                })
                .catch((err) => {
                  console.log(':(');
                  return err;
                });
            });
          }
          this.socialListForSend.forEach((social) => {
            social.request_id = this.id;
            this.$http.post('/request/settings_sources_profiles_add', social)
              .then((resp) => {
                console.log(resp.data);
              })
              .catch(err => err);
          });
          this.socialListForDel.forEach((social) => {
            this.$http.post('/request/settings_sources_profiles_delete', { source_id: social})
              .then(() => {
                console.log(`item id ${social} deleted`);
              })
              .catch(err => err)
          })
        })
        .catch(err => err);
    },
    addInputFile($event) {
      let input = document.createElement('input');
      let vm = this;
      input.setAttribute('type', 'file');
      input.setAttribute('hidden','hidden');
      input.className = 'attach-file';
      input.setAttribute('name', 'file');
      input.addEventListener('change', function(e) {
        e.preventDefault();
        vm.filesForAttachProperties
          .unshift({
            name: e.target.files[0].name,
          });
        vm.filesForAttach
          .unshift(e.target.files[0]);
      }, false);
      let appendedElem = $event.target.parentElement.parentElement.parentElement.appendChild(input);
      appendedElem.click();
    },
    addKeyWord() {
      this.keyWordsList.unshift({ value: '' });
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
    setCurrentRequestType($event) {
      const target = $event.target;
      const current = target.parentElement.previousElementSibling;
      current.innerText = target.innerHTML;
      this.requesttype = target.getAttribute('data-value');
    },
    setCurrentRetrospective($event) {
      const target = $event.target;
      const current = target.parentElement.previousElementSibling;
      current.innerText = target.innerText;
      this.retro = target.getAttribute('data-value');
    },
    setRetrospectiveDate(monthCount) {
      const currentDate = new Date();
      let stringDate = '';
      const currentDateMinusMonthCount =
        new Date(new Date().setMonth(currentDate.getMonth() - monthCount));
      stringDate += `${currentDateMinusMonthCount.getFullYear()}-`;
      currentDateMinusMonthCount.getMonth() === 0 ?
        stringDate += '01-' :
        currentDateMinusMonthCount.getMonth() < 9 ?
          stringDate += `0${currentDateMinusMonthCount.getMonth() + 1}-` :
          stringDate += `${currentDateMinusMonthCount.getMonth() + 1}-`;
      currentDateMinusMonthCount.getDay() < 9 ?
        stringDate += `0${currentDateMinusMonthCount.getDay() + 1}` :
        stringDate += `${currentDateMinusMonthCount.getDay() + 1}`;
      currentDateMinusMonthCount.getHours() < 10 ?
        stringDate += ` 0${currentDateMinusMonthCount.getHours()}` :
        stringDate += ` ${currentDateMinusMonthCount.getHours()}`;
      currentDateMinusMonthCount.getMinutes() < 10 ?
        stringDate += `:0${currentDateMinusMonthCount.getMinutes()}` :
        stringDate += `:${currentDateMinusMonthCount.getMinutes()}`;
      return stringDate;
    },
    getRequest() {
      this.$http.post('/request/get', {
        request_id: this.$route.params.id
      })
        .then((resp) => {
          let data = resp.data;
          this.status = data.status;
          this.id = data.id;
          this.uid = data.uid;
          this.owner = data.owner;
          this.created_date = data.created_date;
          data.files.forEach((elem) => {
            this.files.push(elem);
          });
          this.requestname = data.requestname;
          this.requesttype = data.requesttype;
          this.retro = data.retro;
          this.text_description = data.text_description;
          data.keywords.forEach((elem) => {
            this.keyWordsList.push({
              value: elem,
            });
          });
          this.archived = data.archived === 'true';
          this.keyWordsState = data.changes.keywords;
          let vm = this;
          document.querySelectorAll('.searchItems').forEach((elem) => {
            if (elem.getAttribute('data-value') === vm.requesttype) {
              elem.click();
            }
          });
          this.retroState = data.changes.retro;
          this.requesttypeState = data.changes.requesttype;
          this.recomendations = data.recomendations;
          this.canplay = data.canplay;
        })
        .then(() => {
          this.$http.post('/request/allmembers',{
            request_id: this.id,
          })
            .then((resp) => {
              this.socialList = resp.data.members
            })
            .catch(err => err);
        })
        .catch(err => err);
      neponyatnayaHyetaReincarnation();
      neponyatnayaHyeta();
      poeben();
    },
  },
  created() {
    this.getRequest();
  },
  mounted() {
    if (localStorage.getItem('outside') === 'true') {
      this.$http.post('/requests/recomendationadd', {
        request_id: this.$route.params.id,
        message: 'Сообщение просмотрено',
      })
        .then(() => {
          this.getRequest();
        });
      localStorage.setItem('outside', false);
    }
  },
};
</script>

<style lang="stylus">
.changes-state
  display inline
.odrachenie_form
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
    width 100%
    &--visible
      opacity 1
      visibility visible
    &-current
      color #777
      padding 10px
      font-size 16px
      width 220px
      background #e9e9e9 url('../assets/select_icone.png') 90% center no-repeat
      display block
      border 1px solid #ccc
      transition all 0.5s ease
      border-radius 8px
      float left
      margin 0
      line-height 1.5em
      cursor pointer
    &__item
      white-space nowrap
      padding 5px
      cursor pointer
      &--checked
        color blue
    &__input
      padding-left .6em
    &-outer
      width 100%
      margin 0
      line-height 17px
      position relative
      margin-bottom 1rem
      display inline-block
    &-i
      height 17px
      width 17px
      cursor pointer
</style>
