<template>
  <general-loader v-if="!loader" loading-text="Buscando disponibilidad..." />
  <div v-if="loader" v-for="item in rooms">
    <booking-room-options
      :item="item"
      :queries="this.$route.query"
      :availability="availability"
    />
  </div>
</template>

<script>
import cabanas from '../assets/cabanas.json';
import { useBookingStore } from '/stores/booking.js';

export default {
  data() {
    const useBooking = useBookingStore();
    return {
      rooms: cabanas.filter((item) => item.pick === true),
      useBooking,
      availability: {},
      loader: false,
    };
  },
  async mounted() {
    const dates = this.$route.query;
    this.availability = await this.useBooking.getAvailability(dates);
    this.loader = true;
  },
};
</script>
