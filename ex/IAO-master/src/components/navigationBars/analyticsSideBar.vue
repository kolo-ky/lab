<template lang="pug">
  .col-md-4
    .menu_left
      h2 № {{ $route.params.id }}
      ul
        router-link(to="lenta" tag="li")
          a Лента
        router-link(to="report" tag="li")
          a Сводка активности лайков, репостов
        router-link(to="comments" tag="li")
          a Сводка комментариев
        router-link(to="public" tag="li")
          a Анализ самых активных участников
        router-link(to="list" tag="li")
          a Список всех участников
        router-link(to="communication" tag="li")
          a Анализ связей источника
</template>

<script>
export default {
  name: 'analyticsSideBar',
};
</script>

<style scoped lang="stylus">

</style>
