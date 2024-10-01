<template>
  <GeneralLoader v-if="loaded" :loading-text="textLoader" />
  <v-container fluid v-if="!loaded">
    <v-row class="d-flex justify-center text-center">
      <v-col cols="12" class="d-flex flex-column align-center">
        <span class="text-h3 text-sm-h2 color-main">RESERVA CONFIRMADA</span>
        <!-- <span class="color-main text-subtitle-2 text-sm-subtitle pt-3"
          >Código de reserva: ABYA{{ idReserva }}</span
        > -->
      </v-col>
      <v-col
        cols="12"
        class="d-flex flex-column align-center text-body-2 text-sm-body-1 px-6 px-sm-3"
      >
        <span
          >¡A tu correo electronico recibirás toda la información de tu reserva!
        </span>
        <span
          >Revisa la carpeta de SPAM en caso de no encontrar la confirmación en
          tu bandeja de entrada.
        </span>
        <span
          >En el siguiente link podrás revisar el menú del restaurante.
        </span></v-col
      >
      <v-col cols="11" sm="8" md="5" class="d-flex justify-center text-center">
        <GeneralBanner :cards="BannerMenu" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useBookingStore } from '/stores/booking.js';
import { useDisplay } from 'vuetify';

const useBooking = useBookingStore();
const idReserva = computed(() => useBooking.idReserva);

const { smAndDown } = useDisplay();
const reactiveHeight = ref('height: 450px');

let loaded = ref(true);
const textLoader = 'Realizando reserva';

watch(
  smAndDown,
  (val) => {
    if (val == true) {
      reactiveHeight.value = 'height: 250px';
    } else {
      reactiveHeight.value = 'height: 450px';
    }
  },
  {
    immediate: true,
  },
);

watch(
  idReserva,
  (val) => {
    if (idReserva != '0') {
      loaded = false;
    }
  },
  {
    immediate: true,
  },
);

const BannerMenu = {
  card: {
    title: '',
    src: '/otros/menu1.jpg',
    flex: 12,
    height: reactiveHeight.value,
  },
};
</script>
