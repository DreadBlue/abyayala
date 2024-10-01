<template>
  <v-container fluid class="pa-0">
    <v-row class="mx-0">
      <v-col cols="12" sm="6" class="d-none d-sm-flex">
        <GeneralBanner :cards="BannerMireserva" />
      </v-col>
      <v-col cols="12" sm="6">
        <GeneralValidation
          :formato="info"
          maxLength="3"
          v-model:fieldOne="idReserva"
          v-model:fieldTwo="correo"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useBookingStore } from '/stores/booking.js';

export default {
  data() {
    const useBooking = useBookingStore();
    const route = useRoute();
    return {
      useBooking,
      route,
      idReserva: '',
      correo: '',
      BannerMireserva: {
        card: {
          title: '',
          src: '/otros/panoramica.jpg',
          flex: 12,
          height: '700px',
        },
      },
    };
  },
  computed: {
    info() {
      return {
        InputUno: ['Codigo de reserva', 'Codigo de reserva', 'mdi-ticket'],
        InputDos: [
          'Correo titular',
          'Ingresa tu correo electronico',
          'mdi-email-outline',
        ],
        Descripcion:
          '¡Hola! Bienvenido a casa, desde aquí podrás enviar solicitudes para modificar tus fechas de reserva, el titular o realizar la reserva anticipada de tu menú de comidas durante tu estancia',
        Login: false,
        btn: ['Gestionar reserva', `/reserva-${this.idReserva}/${this.correo}`],
      };
    },
  },
  mounted() {
    this.useBooking.currentPath = this.route.path;
  },
};
</script>
