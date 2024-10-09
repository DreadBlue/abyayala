<template>
  <GeneralLoader v-if="paymentProcess" loadingText="Cargando" />
  <v-container fluid class="pa-0 px-3 px-sm-15 bg-mygrey" v-else>
    <v-row>
      <v-col cols="12" md="4" class="mt-md-8">
        <BookingDetailsBanner />
      </v-col>
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12" class="d-flex flex-column">
            <div>
              <BookingForm />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useBookingStore } from '/stores/booking.js';
import { useGeneralStore } from '/stores/general.js';

const useBooking = useBookingStore();
const useGeneral = useGeneralStore();
const checkIn = ref(useBooking.checkIn);
const checkOut = ref(useBooking.checkOut);
const route = useRoute();
const data = route.query
const paymentProcess = computed(() => {
  return useGeneral.loading;
})  ;

onBeforeMount(()=>{
    if (!data.cabana || !data.amount || !data.checkIn || !data.checkOut || !checkIn.value || !checkOut.value) {
    return navigateTo('/');
  };
});

</script>
