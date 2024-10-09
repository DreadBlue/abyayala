<template>
  <general-loader v-if="loading" :loading-text="loaderText" />
  <v-container v-if="!loading" fluid class="pa-0">
    <v-row>
      <v-col cols="12" md="3">
        <manage-banner-filter />
      </v-col>
      <v-col cols="12" md="9">
        <manage-admin-bookings :bookings="bookings" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import dayjs from 'dayjs';
import { useBookingStore } from '/stores/booking.js';
import { useAdminStore } from '/stores/admin.js';

definePageMeta({
  middleware: 'auth',
});

const useBooking = useBookingStore();
const useAdmin = useAdminStore();
let bookings = ref([]);

let filters = ref({
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs(),
});

let loading = ref(true);
const loaderText = 'Cargando reservas';

const fetchBookings = async () => {
  try {
    bookings.value = await useAdmin.adminBookings(filters.value);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
  }
};
onMounted(() => {
  fetchBookings();
  useBooking.currentPath == useRoute().path;
});
watchEffect(() => {
  if (bookings.value.length != 0) {
    loading.value = false;
  }
});
</script>
