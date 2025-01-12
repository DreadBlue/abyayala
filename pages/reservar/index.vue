<template>
  <div v-for="item in rooms">
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
    };
  },
  async mounted() {
    const dates = this.$route.query;
    this.availability = await this.useBooking.getAvailability(dates);
    console.log(this.availability);
  },
};
</script>
