<template>
  <div class="layout-padding" @keyup.enter="login">
    <q-card inline flat class="fixed-center" style="width: 400px">
      <q-card-media>
        <img style="margin:auto;width:200px" src="statics/quasar_logo.svg">
      </q-card-media>

      <q-card-main>

        <div class="row gutter-sm">
          <div class="col-12">
            <q-input type="text" :float-label="$t('USERNAME')" v-model="username"></q-input>
          </div>
          <div class="col-12">
            <q-input :float-label="$t('PASSWORD')" type="password" v-model="password"></q-input>
          </div>
          <div class="col-12">
            <q-btn :loader="isInLogin" class="full-width" rounded big color="primary" :disabled="!username || !password" @click="login">
              {{$t('LOGIN')}}
            </q-btn>
          </div>
          <div class="col-12 text-negative text-center" v-show="error">
            {{errorMessage}}
          </div>
        </div>


      </q-card-main>
    </q-card>
  </div>
</template>

<script>
  import UserService from 'src/services/UserService';

  export default {
    data() {
      return {
        username: "",
        password: "",
        errorMessage: "",
        isInLogin: false,
        error: false
      }
    },
    methods: {
      async login() {
        this.isInLogin = true;
        try {
          await UserService.login({
            username: this.username,
            password: this.password
          });
          this.isInLogin = false;
          this.$router.replace('/');
        } catch (error) {
          this.isInLogin = false;
          this.errorMessage = this.$t('USERNAME_OR_PASSWORD_INVALID');
          this.error = true;
          console.log(error);
        }
      }
    }
  }
</script>

<style>

</style>
