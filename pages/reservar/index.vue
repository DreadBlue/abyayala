<template>
  <div v-for="item in rooms">
    <BookingRoomOptions :item="item" :queries="this.$route.query"/>
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
    };
  },
  mounted() {
    const dates = this.$route.query;
    this.useBooking.datesManagement(dates);
  },
};
</script>
