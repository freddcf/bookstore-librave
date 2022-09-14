<template>
  <div class="c400 login-recover d-flex justify-center align-center">
    <v-btn
      color="c400 c000--text"
      class="return-btn py-8"
      elevation="0"
      @click="$router.push('login')"
    >
      <PhArrowUUpLeft size="40" weight="bold" />
    </v-btn>
    <div class="login d-flex flex-column justify-center align-center">
      <h1 class="c000--text display-2 font-weight-bold mb-5">
        Recover Password
      </h1>
      <form class="form-inputs">
        <v-col cols="12" class="form-inputs-wrapper">
          <v-text-field
            class="form-input rounded-lg mb-3"
            v-model.trim="credentials.username"
            :error-messages="usernameErrors"
            @input="v$.credentials.username.$touch()"
            @blur="v$.credentials.username.$touch()"
            solo
            label="Username"
            color="c500"
          >
            <template v-slot:prepend-inner>
              <v-icon color="c400" class="mr-1">
                mdi-account-circle-outline
              </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            class="form-input rounded-lg mb-3"
            v-model.trim="credentials.email"
            :error-messages="emailErrors"
            @input="v$.credentials.email.$touch()"
            @blur="v$.credentials.email.$touch()"
            solo
            label="Email"
            color="c500"
          >
            <template v-slot:prepend-inner>
              <v-icon color="c400" class="mr-1"> mdi-email-outline </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            class="form-input rounded-lg mb-3"
            v-model.trim="credentials.password"
            :error-messages="passwordErrors"
            @input="v$.credentials.password.$touch()"
            @blur="v$.credentials.password.$touch()"
            solo
            label="Nova senha"
            color="c500"
          >
            <template v-slot:prepend-inner>
              <v-icon color="c400" class="mr-1">
                mdi-lock-alert-outline
              </v-icon>
            </template>
          </v-text-field>
          <v-btn
            block
            height="60px"
            color="c600 c000--text rounded-lg"
            class="title"
            @click="submit"
          >
            Restore
          </v-btn>
        </v-col>
      </form>
    </div>
  </div>
</template>

<script>
import { required, email } from '@vuelidate/validators';
import useValidate from '@vuelidate/core';
import { PhArrowUUpLeft } from 'phosphor-vue';
import userAccess from '@/services/userAccess';

export default {
  name: 'LoginRecoverView',
  components: {
    PhArrowUUpLeft,
  },
  data: () => ({
    credentials: {
      username: '',
      email: '',
      password: '',
    },
  }),
  setup: () => ({ v$: useValidate() }),
  validations() {
    return {
      credentials: {
        username: { required },
        email: { required, email },
        password: { required },
      },
    };
  },
  methods: {
    submit() {
      this.v$.$touch();
      if (!this.v$.$error) {
        this.recover();
      }
    },

    async recover() {
      await userAccess
        .recoverPassword(this.credentials)
        .then((res) => {
          this.$swal({
            title: 'Sucesso',
            text: res.data.message,
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            this.$swal({
              title: 'Senha alterada',
              text: 'Confirme para redirecionar',
              icon: 'info',
              allowOutsideClick: false,
            }).then(() => {
              this.$router.push('login');
            });
          });
        })
        .catch(() => {
          this.$swal({
            title: 'Opss...',
            text: 'Credenciais inválidas',
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Erro ao recuperar senha', '', 'error');
          });
        });
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.v$.credentials.username.$dirty) return errors;
      if (this.v$.credentials.username.required.$invalid)
        errors.push('Este campo é obrigatório');
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.v$.credentials.email.$dirty) return errors;
      if (this.v$.credentials.email.required.$invalid)
        errors.push('Este campo é obrigatório');
      if (this.v$.credentials.email.email.$invalid)
        errors.push('Email inválido');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.v$.credentials.password.$dirty) return errors;
      if (this.v$.credentials.password.required.$invalid)
        errors.push('Este campo é obrigatório');
      return errors;
    },
  },
};
</script>

<style scoped>
.login-recover {
  height: 100vh;
}
.form-inputs {
  width: 450px;
}
.form-input.v-text-field {
  font-size: 20px;
}
.v-input__prepend-inner .v-icon {
  font-size: 35px;
}

.return-btn {
  position: absolute;
  top: 50px;
  left: 50px;
}
</style>
