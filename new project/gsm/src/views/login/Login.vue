<template>
  <div class="login">
    <el-row type="flex" justify="center">
      <el-col :xs="20" :sm="10" :md="8" :lg="6" :xl="6">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span class="login__header-text-color">Вход в систему</span>
          </div>
          <el-form ref="form" :model="form" @submit.prevent.native="onSubmit">
            <el-form-item>
              <el-input
                name="login"
                v-validate="'required'"
                placeholder="Логин"
                v-model="form.login"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                name="password"
                v-validate="'required'"
                placeholder="Пароль"
                v-model="form.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type='submit'>Войти</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dictionary from "./validator/dictionary";
import notify from "../../helpers/notify";

export default {
  name: "Login",
  data() {
    return {
      form: {
        login: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$validator.validate().then(result => {
        if (result) {
          const {login, password} = this.form;
        } else {
          this.$validator.errors.items.forEach(item => {
            notify.call(this, item.msg, "error");
          });
        }
      });
    }
  },
  mounted () {
    this.$validator.localize('ru', dictionary);
  }
}
</script>

<style>
  @import "./css/style.css";
</style>
