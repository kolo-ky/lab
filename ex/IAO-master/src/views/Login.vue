<template lang="pug">
  div.auth-block
    vue-particles(
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    )
    .auth-info
      .auth-info-logo
        img.auth-info-img(src="../assets/logo.svg")
      .auth-info-text.
        Государственная информационная система Санкт-Петербурга<br/>
        «Интегрированная система информационно-аналитического обеспечения<br/>
        деятельности исполнительных органов государственной власти Санкт-Петербурга»
    .auth-form
      form.auth-login(@submit.prevent="loginRequest")
        label Пользователь
        input(
          type='text'
          name='name'
          placeholder='user'
          v-model='login'
          :class="{ 'mod_form__error': $store.getters.authStatus === 'error' }"
        )
        label Пароль
        input(
          type='password',
          name='pass',
          placeholder='************'
          v-model='password'
          :class="{ 'mod_form__error': $store.getters.authStatus === 'error' }"
        )
        p(
          v-if="$store.getters.authStatus === 'error'"
        ).mod_form__error-txt
          | Неправильное имя пользователя или пароль
        input(type='submit', value='Войти')
</template>

<script>
import { AUTH_REQUEST } from '@/store/actions/auth';
import VueParticles from 'vue-particles/src/vue-particles/vue-particles.vue';

export default {
  name: 'Login',
  components: { VueParticles },
  data() {
    return {
      login: '',
      password: '',
    };
  },
  methods: {
    loginRequest() {
      const { login, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { login, password })
        .then(() => {
          this.$router.push('/');
        })
        .catch(err => err);
    },
  },
  mounted() {
  },
};
</script>

<style lang="stylus">
.login
  position absolute
  left 0
  top 0
  width 100vw
  height 100vh
  background #464545
  & .mod_form
    .login__btn
      background transparent
      border 2px solid #fff
      transition .2s linear
      &:hover
        background #fff
        color #464545
    .login__input
      background transparent
      border 2px solid #fff
.mod_form
  padding 2em
  position absolute
  left 50%
  top 50%
  transform translate(-50%, -50%)
  width auto
  background transparent
.mod_form .mod_form__error
  border 1px solid red
.mod_form__error-txt
  color red
  text-align center
  font-size .8em
/* cyrillic-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fCRc4AMP6lbBP.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fABc4AMP6lbBP.woff2) format('woff2');
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fCBc4AMP6lbBP.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fBxc4AMP6lbBP.woff2) format('woff2');
  unicode-range: U+0370-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fCxc4AMP6lbBP.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fChc4AMP6lbBP.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
html
  font-family "Roboto", sans-serif
  margin 0
  padding 0

canvas
  margin 0 0 -10px
  padding 0

.auth-block
  z-index 0
  position absolute
  left 0
  top 0
  margin 0
  padding 0
  background-image -webkit-gradient(linear, left top, left bottom, from(#374050), to(#798696))
  background-image linear-gradient(to bottom, #374050 0%, #798696 100%)
  background-color #798696
  height 100vh
  width 100vw
  min-width 850px
  min-height 500px
  overflow auto

.auth-info
  overflow hidden
  top 0
  position absolute
  z-index 30
  width 60%
  min-width 525px
  height 100vh
  float left
  min-height 500px

.auth-info-logo
  height 50%

.auth-info-img
  width 50%
  min-width 400px
  position absolute
  bottom 50%
  left 25%

.auth-info-text
  height 50%
  top 100%
  min-width 400px
  color white
  text-align center
  font-size 20px
  font-family "Georgia", serif

.auth-form
  overflow hidden
  top 0
  right 0
  width 40%
  min-width 320px
  height 100vh
  background rgba(55, 64, 80, 0.51)
  position absolute
  text-align center
  color white
  min-height 500px

.auth-login
  position absolute
  top 40%
  height 200px
  margin-left 10%
  width 80%
  font-size 18px


.auth-login label
  display none

.auth-login input
  text-align center
  height 40px
  color white
  cursor pointer
  overflow hidden
  margin-top 10px
  font-size 16px
  outline none
  background-color Transparent
  background-repeat no-repeat

.auth-login input::-webkit-input-placeholder
  text-align center

.auth-login input[type="text"], .auth-login input[type="password"]
  width 100%
  border 1px solid white
  border-radius 6px

.auth-login input[type="submit"]
  border none

.auth-login input:hover[type="submit"]
  color white
  border 1px solid white

.auth-login input[type="text"]::-webkit-input-placeholder, .auth-login input[type="password"]::-webkit-input-placeholder
  color white
  opacity 0.5
</style>
