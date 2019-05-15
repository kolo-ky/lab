export default {
  custom: {
    login: {
      required: () => "Поле 'Логин' не должно быть пустым"
    },
    password: {
      required: () => "Поле 'Пароль' не должно быть пустым"
    }
  }
}
