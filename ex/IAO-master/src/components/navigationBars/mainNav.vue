<template lang="pug">
  .buttons_top
    a.btn_blue.btn_user-exit(href='#' @click.stop="logoutAction" title="Выход")
      | {{ this.$store.getters.getUsername }}
      img(src="../../assets/exit.png")
    router-link(
      to="/reports"
      v-if="$store.getters.getUserRole !== 'operator' && $store.getters.getUserRole !== 'admin'"
    ).btn_blue Отчеты
    router-link(
      to="/logging"
      v-if="$store.getters.getUserRole !== 'operator'"
    ).btn_blue Логирование
    router-link(
      v-if="$route.name === 'operator'"
      to="/new-request"
    ).btn_blue Добавить обращение
    router-link(
      v-else
      to="/"
    ).btn_blue Все заявки
</template>

<script>
import { AUTH_LOGOUT } from '@/store/actions/auth';

export default {
  name: 'mainNav',
  methods: {
    logoutAction($event) {
      $event.preventDefault();
      this.$store.dispatch(AUTH_LOGOUT)
        .then(() => {
          this.$router.push('/login');
        });
    },
  },
};
</script>
