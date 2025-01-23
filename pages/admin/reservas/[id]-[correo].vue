<template>
  <GeneralLoader v-if="!loaded" :loading-text="textLoaded" />
  <admin-booking v-if="loaded == true" :booking="booking" />
</template>

<script>
import { useBookingStore } from '/stores/booking.js';

export default {
  setup() {
    definePageMeta({
      middleware: 'auth',
      layout: 'admin',
    });
  },
  data() {
    const useBooking = useBookingStore();
    const route = useRoute();
    return {
      visible: false,
      useBooking,
      info: { id: route.params.id, email: route.params.correo },
      booking: [],
      loaded: ref(false),
      textLoaded: 'Buscando reserva',
    };
  },
  methods: {
    async sendRequest() {
      try {
        this.booking = await this.useBooking.lookBooking(this.info);
        console.log(this.booking);
        if (this.booking.value == 'wrong information') {
          this.useBooking.fetchError = true;
          // navigateTo(this.useBooking.currentPath);
        } else if (this.booking.value !== 'wrong information') {
          this.loaded = true;
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      }
    },
  },
  mounted() {
    this.sendRequest();
  },
};
</script>
