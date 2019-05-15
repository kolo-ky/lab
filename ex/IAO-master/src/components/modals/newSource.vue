<template lang="pug">
  .mod_form2
    form(@submit.prevent="addSocialItem")
      h2 ДОБАВЛЕНИЕ ИСТОЧНИКА ДАННЫХ
      span.close(@click.stop="$emit('close')")
      .row.justify-content-md-center.row_content
        .col-sm-6.align-self-center
          | Выберите социальную сеть
        .col-sm-6.align-self-center
          p.dropdown-outer
            span.dropdown-current(
              @click.stop="showDropdown"
              :data-id="selectedSocialId"
            ) {{ selectedSocialName || '...' }}
            ul.dropdown
              li(
              v-for="social in referencesNetworks"
              :data-id="social.id"
              @click.prevent="selectSocial(social.id, social.name," +
                     "sourceTypeAvailable(social.source_types), $event)"
              v-if="sourceTypeAvailable(social.source_types)"
              ).dropdown__item {{ social.name }}
        .col-sm-6.align-self-center
          |  ID пользователя
        .col-sm-6.align-self-center
          span(v-if="error" style="color: red;") {{ error }}
          input(
            type='text'
            placeholder='id'
            v-model="socialId"
            @focus="error = ''"
            :class="{ error: error }"
          )
        br
        input.btn_right(type='submit', value='Сохранить')
        br
</template>

<script>
import axios from '../../axios/axios';

export default {
  name: 'newSource',
  props: {
    requesttype: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      socialId: '',
      selectedSocialId: '',
      selectedSocialName: '',
      referencesNetworks: [],
      selectedSourceType: '',
      error: '',
    };
  },
  created() {
    axios.post('/references/networks', {})
      .then((resp) => {
        this.referencesNetworks = resp.data;
        this.selectedSocialName = this.referencesNetworks[0].name;
        this.selectedSocialId = this.referencesNetworks[0].id;
      })
      .then(() => {
        this.selectedSourceType = this.sourceTypeAvailable(this.referencesNetworks[0].source_types);
      })
      .catch(err => err);
  },
  methods: {
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
    selectSocial(id, name, sourceTypeId, $event) {
      this.selectedSocialId = id;
      this.selectedSocialName = name;
      this.selectedSourceType = sourceTypeId;
      $event.target.parentElement.classList.toggle('dropdown--visible');
    },
    addSocialItem() {
      if (this.socialId) {
        const newSocialItemProps = {
          request_id: '',
          network_id: this.selectedSocialId,
          profile_id: this.socialId,
          source_type: this.selectedSourceType,
        };
        this.$emit('addSocialItem', newSocialItemProps);
      } else {
        this.error = 'Необходимо заполнить поле';
      }
    },
    sourceTypeAvailable(sourceType) {
      let sourceTypeIsAvailable = false;
      sourceType.forEach((type) => {
        if (type.type === 'user' && this.requesttype === 'users') {
          sourceTypeIsAvailable = type.id;
        } else if (type.type === 'group' && this.requesttype === 'groups') {
          sourceTypeIsAvailable = type.id;
        }
        return sourceTypeIsAvailable;
      });
      return sourceTypeIsAvailable;
    },
  },
};
</script>

<style lang="stylus" scoped>
input
  &.error
    border-color red
.close
  display block
  position absolute
  right .3em
  top .3em
  width 1.2em
  height 1.2em
  border-radius 50%
  border 1px solid black
  &:after
    content '+'
    display block
    position absolute
    left 49%
    top 51%
    transform translate(-50%, -50%) rotate(45deg)
    font-weight normal
    font-size 1.4em
.mod_form2
  position fixed
  left 50%
  top 50%
  transform translate(-50%, -50%)
  z-index 999999
input
  background-color #e9e9e9
  border-radius 6px
  border 1px solid #c5c5c5
  line-height 40px
  padding-left 10px
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
  width auto
  min-width 100%
  &--visible
    opacity 1
    visibility visible
  &-current
    color #777
    padding 10px 20px 10px 10px
    font-size 16px
    width auto
    background #e9e9e9 url('../../assets/select_icone.png') 90% center no-repeat
    display block
    border 1px solid #ccc
    transition all 0.5s ease
    border-radius 8px
    margin 0
    line-height 1.5em
    cursor pointer
  &__item
    width auto
    white-space nowrap
    padding 5px
    cursor pointer
    &--checked
      color blue
  &__input
    padding-left .6em
  &-outer
    margin 0
    line-height 17px
    position relative
    margin-bottom 1rem
  &-i
    height 17px
    width 17px
    cursor pointer
</style>
