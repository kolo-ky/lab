<template lang="pug">
  .row.justify-content-md-center.row_content
    info-popup(
      v-if="showInfoPopup"
      :message="`Было созданно новое обращение №${this.id}`"
      @close="showInfoPopup = !showInfoPopup, $router.push('/')"
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
              th(scope='col') Ответственный – {{ this.$store.getters.getUsername }}
              th(scope='col')
              th(scope='col')
                | Дата создания – {{ new Date().toJSON().slice(0,10).replace(/-/g,'.') }}
      .odrachenie_form
        .odrachenie_header
          .odrachenie_header-left
            .nomer_zayavka
            a.btn_new_zayavka(href='#') НОВАЯ ЗАЯВКА
          .odrachenie_header-file
            .file_add
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
              input(type='text', placeholder='Название' v-model="requestname")
              br
              label Раздел поиска
              br
              p.dropdown-outer
                span.dropdown-current(
                  @click.stop="showDropdown"
                  :data-value="searchItems[0].value"
                ) {{ searchItems[0].name }}
                ul.dropdown
                  li(
                    v-for="item in searchItems"
                    :data-value="item.value"
                    @click.stop="setCurrentRequestType($event), clearKeywordsAndSocialList()"
                  ).dropdown__item {{ item.name }}
              label Ретроспектива
              br
              p.dropdown-outer
                span.dropdown-current(
                  @click.stop="showDropdown"
                  :data-value="setRetrospectiveDate(1)"
                ) 1 месяц
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
              template(v-if="requesttype === 'keywords'")
                label Ключевые слова
                  a.btn_dark_blue(
                    href="#"
                    @click.prevent="addKeyWord"
                  ) +
                br
                .key_words
                  .scroll2
                    key-word(
                      v-for="(word, index) in keyWordsList"
                      :key="index"
                      v-model="word.value"
                      @deleteWord="keyWordsList.splice(index, 1)"
                    )
              template(v-else)
                label Источник
                  a(
                    href="#"
                    @click.prevent="showNewResource = !showNewResource"
                  ).btn_dark_blue +
                br
                .source_ob.scroll10(v-if="socialList.length || socialListForSend.length")
                  social(
                    v-for="(itemForSend, index) in socialListForSend"
                    :key="index"
                    :item="itemForSend"
                    @deleteSocialItem="socialListForSend.splice(index, 1)"
                  )
                  social(
                    v-for="(item, index) in socialList"
                    :key="item.url"
                    :item="item"
                    @deleteSocialItem="socialList.splice(index, 1)"
                  )
              br
              label Содержание запроса
              br
              textarea(rows='4', cols='45', name='text' v-model="text_description")
              br
              input.btn_right(type='submit', value='Сохранить')
              br
</template>

<script>
import neponyatnayaHyeta from '@/verstka/jquery.mCustomScrollbar.concat.min';
import neponyatnayaHyetaReincarnation from '@/verstka/select';
import poeben from '@/verstka/strange';
import KeyWord from '../components/request/keyWord.vue';
import Attachments from '../components/request/attachments.vue';
import Social from '../components/request/social.vue';
import NewSource from '../components/modals/newSource.vue';
import InfoPopup from '../components/modals/infoPopup.vue';

export default {
  name: 'NewRequest',
  components: {
    InfoPopup,
    NewSource,
    Social,
    Attachments,
    KeyWord,
  },
  data() {
    return {
      showInfoPopup: false,
      showNewResource: false,
      keyWordsList: [],
      keywords: [],
      requestname: '',
      requesttype: 'keywords',
      retro: this.setRetrospectiveDate(1),
      text_description: '',
      id: '',
      files: [],
      filesForAttach: [],
      filesForAttachProperties: [],
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
    };
  },
  /* eslint-disable */
  methods: {
    addSocialItemAction(item) {
      this.socialListForSend.unshift(item);
      this.showNewResource = !this.showNewResource
    },
    clearKeywordsAndSocialList() {
      this.keyWordsList = [];
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
          this.socialListForSend.forEach((social) => {
            social.request_id = this.id;
            this.$http.post('/request/settings_sources_profiles_add', social)
              .then((resp) => {
                console.log(resp.data);
              })
              .catch(err => err);
          });
        })
        .then(() => {
          this.showInfoPopup = !this.showInfoPopup;
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
    addSours() {
      this.socialList.unshift({});
      neponyatnayaHyeta();
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
      current.innerText = target.innerText;
      this.requesttype = target.getAttribute('data-value');
      $event.target.parentElement.classList.toggle('dropdown--visible');
    },
    setCurrentRetrospective($event) {
      const target = $event.target;
      const current = target.parentElement.previousElementSibling;
      current.innerText = target.innerText;
      this.retro = target.getAttribute('data-value');
      $event.target.parentElement.classList.toggle('dropdown--visible');
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
  },
  mounted() {
    neponyatnayaHyetaReincarnation();
    neponyatnayaHyeta();
    poeben();
  },
};
</script>

<style lang="stylus">
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
    width 18%
    &--visible
      opacity 1
      visibility visible
    &-current
      color #777
      padding 10px
      font-size 16px
      width 18%
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
    &-i
      height 17px
      width 17px
      cursor pointer
</style>
