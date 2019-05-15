<template lang="pug">
  #app.body_fon()
    info-popup(
      v-if="showInfoPopup"
      :message="archivingStatus"
      @close="showInfoPopup = !showInfoPopup, $router.push('/')"
    )
    section.content
      .container
        template(v-if="$router.currentRoute.name !== 'login'")
          main-nav
          a(
            v-if="$store.getters.getUserRole === 'operator'"
            href="/docs/manual.docx"
            style="width: 200px; line-height: 30px; margin: 0 15px 15px auto;"
            download
          ).btn.btn_blue Скачать инструкцию
        router-view
</template>

<script>
import axios from '@/axios/axios';
import { NO_AUTH, AUTH_CHECK } from '@/store/actions/auth';
import MainNav from './components/navigationBars/mainNav.vue';
import InfoPopup from './components/modals/infoPopup';

export default {
  components: { InfoPopup, MainNav },
  data() {
    return {
      archivingStatus: '',
      showInfoPopup: false,
    };
  },
  created() {
    axios.interceptors.response.use(undefined, (err) => {
      if (err.response.status === 401) {
        this.$store.dispatch(NO_AUTH);
        this.$router.push('/login');
      }
      if (err.response.status === 400) {
        this.archivingStatus = err.response.data.title;
        this.showInfoPopup = !this.showInfoPopup;
      }
    });
  },
  mounted() {
    document.addEventListener('click', (event) => {
      if (event.target.tagName !== 'INPUT') {
        document.querySelectorAll('.dropdown--visible')
          .forEach((elem) => {
            elem.classList.remove('dropdown--visible');
          });
      }
    });
  },
};

</script>

<style lang="stylus">
.btn_blue
  &:active
    transform translate(0, 1px)
.preLoad
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center
  margin 0 auto
.btn_right
  cursor pointer
  &:active
    transform translate(0, 1px)
</style>
