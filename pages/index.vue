<template>
  <home-banner />
  <home-rooms />
  <GeneralImagesBanner :styling="styling" :content="content" />
  <home-location />
</template>

<script>
import { useBookingStore } from '/stores/booking.js';

export default {
  setup() {
    const useBooking = useBookingStore();
    onMounted(async () => {
      useBooking.resetStates();
    });
  },
  data() {
    return {
      styling: {
        divStyle: 'max-height: 260px',
        imgClass: 'rounded-xl',
      },
      content: {
        imagen1: {
          src: 'otros/bargente.jpg',
        },
        imagen2: {
          src: 'otros/polar.jpeg',
        },
        imagen3: {
          src: 'otros/piscinachica.jpg',
        },
        imagen4: {
          src: 'otros/cena.jpg',
        },
        imagen5: {
          src: 'otros/aerea.jpg',
        },
        imagen6: {
          src: 'otros/panoramica.jpg',
        },
        imagen7: {
          src: 'otros/piscinagente.jpg',
        },
        imagen8: {
          src: 'otros/piscinasola.jpg',
        },
      },
    };
  },
};
</script>
