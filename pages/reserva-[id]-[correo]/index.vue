<template>
  <general-loader v-if="!loaded" :loading-text="textLoaded" />
  <customer-booking v-if="loaded == true" :booking="booking" />
</template>

<script>
import { useBookingStore } from '/stores/booking.js';
import { useAdminStore } from '/stores/admin.js';

export default {
  data() {
    const useBooking = useBookingStore();
    const useAdmin = useAdminStore();
    const route = useRoute();
    return {
      visible: false,
      useBooking,
      useAdmin,
      info: { id: route.params.id, email: route.params.correo },
      booking: ref(),
      loaded: ref(false),
      textLoaded: 'Buscando reserva',
    };
  },
  methods: {
    async lookBooking() {
      try {
        this.booking = await this.useBooking.lookBooking(this.info);
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
    this.lookBooking();
  },
};
</script>
