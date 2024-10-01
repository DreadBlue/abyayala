<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="/assets/imgs/logoMain.png"
    ></v-img>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-2 text-medium-emphasis font-raleway">
        {{ formato.InputUno[0] }}
      </div>

      <v-text-field
        density="compact"
        :placeholder="formato.InputUno[1]"
        :prepend-inner-icon="formato.InputUno[2]"
        variant="outlined"
        :model-value="fieldOne"
        @keyup.enter="signInIf"
        @input="$emit('update:fieldOne', $event.target.value)"
        :maxlength="maxLength"
      ></v-text-field>

      <div
        class="text-subtitle-2 text-medium-emphasis d-flex align-center justify-space-between font-raleway"
      >
        {{ formato.InputDos[0] }}

        <a
          v-if="formato.Login"
          class="text-caption text-decoration-none text-blue font-raleway"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          ¿Olvidaste tu contraseña?</a
        >
      </div>

      <v-text-field
        v-if="formato.contrasena"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        :placeholder="formato.InputDos[1]"
        :prepend-inner-icon="formato.InputDos[2]"
        variant="outlined"
        @click:append-inner="visible = !visible"
        :model-value="fieldTwo"
        @input="$emit('update:fieldTwo', $event.target.value)"
        @keyup.enter="signInIf"
      ></v-text-field>

      <v-text-field
        v-if="!formato.contrasena"
        density="compact"
        :placeholder="formato.InputDos[1]"
        :prepend-inner-icon="formato.InputDos[2]"
        variant="outlined"
        :model-value="fieldTwo"
        @input="$emit('update:fieldTwo', $event.target.value)"
        @keyup.enter="signInIf"
      ></v-text-field>

      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text
          v-if="formato.Descripcion"
          class="text-medium-emphasis text-caption font-raleway"
        >
          {{ formato.Descripcion }}
        </v-card-text>
      </v-card>

      <p
        v-if="miReservaError"
        class="bg-red text-center rounded mb-2 text-body-2"
      >
        Reserva no encontrada, verifica la información.
      </p>
      <p v-if="loginError" class="bg-red text-center rounded mb-2 text-body-2">
        Información de inicio de sesión incorrecta.
      </p>
      <v-btn
        class="mb-8 font-raleway"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="signInIf"
        :disabled="fieldOne == '' || fieldTwo == ''"
      >
        {{ formato.btn[0] }}
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import { useBookingStore } from '/stores/booking.js';

export default {
  props: {
    formato: Object,
    fieldOne: String,
    fieldTwo: String,
    maxLength: {
      type: String,
      default: undefined,
    },
    action: Function,
    loginError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const useBooking = useBookingStore();
    const route = useRoute();
    return {
      visible: false,
      useBooking,
      disabledBtn: true,
      miReservaError: useBooking.fetchError,
      adminError: useBooking.loginError,
    };
  },
  emits: ['update:fieldOne', 'update:fieldTwo'],
  methods: {
    signInIf() {
      if (this.action && this.fieldOne !== '' && this.fieldTwo !== '') {
        this.action();
      } else if (!this.action && this.fieldOne !== '' && this.fieldTwo !== '') {
        return navigateTo(this.formato.btn[1]);
      }
    },
    // credentials(value) {
    //   this.$emit('update:model-value', value);
    // },
  },
};
</script>
