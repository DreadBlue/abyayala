<template>
  <GeneralLoader v-if="!loaded" :loading-text="textLoaded" />
  <ManageBookingDetail v-if="loaded == true" :booking="booking.value" />
</template>

<script>
import { useBookingStore } from '/stores/booking.js';

export default {
  data() {
    const useBooking = useBookingStore();
    const route = useRoute();
    return {
      visible: false,
      useBooking,
      info: [route.params.id, route.params.correo],
      booking: ref([]),
      loaded: ref(false),
      textLoaded: 'Buscando reserva',
    };
  },
  methods: {
    async sendRequest() {
      try {
        this.booking.value = await this.useBooking.lookBooking(this.info);
        if (this.booking.value == 'wrong information') {
          this.useBooking.fetchError = true;
          navigateTo(this.useBooking.currentPath);
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
