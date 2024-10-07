<template>
  <div v-for="item in rooms">
    <BookingRoomOptions :item="item" :queries="this.$route.query" :availability="availability" />
  </div>
</template>

<script>
import cabanas from '../assets/cabanas.json';
import { useBookingStore } from '/stores/booking.js';

export default {
  data() {
    const useBooking = useBookingStore();
    const availability = useBooking.disponibilidad;
    return {
      rooms: cabanas.filter((item) => item.pick === true),
      useBooking,
      availability,
    };
  },
  mounted() {
    const dates = this.$route.query;
    this.useBooking.getAvailability(dates);
  },
};
</script>
