<template>
  <GeneralLoader v-if="!loaded" :loading-text="textLoaded" />
  <ManageBookingDetail v-if="loaded == true" :booking="booking.value" />
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
      info: [route.params.id, route.params.correo],
      booking: ref([]),
      loaded: ref(false),
      textLoaded: 'Buscando reserva',
    };
  },
  methods: {
    async sendRequest() {
      try {
        this.booking.value = await this.useAdmin.lookBooking(this.info);
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
