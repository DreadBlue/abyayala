<template>
  <v-container fluid class="pa-0">
    <v-row class="mx-3 mx-sm-0">
      <v-col cols="12" class="bg-grey h-100 rounded-lg px-7">
        <div class="py-3">
          <span class="text-body-2 text-sm-body-1" style="font-weight: 900"
            >DETALLES DE RESERVA</span
          >
        </div>
        <v-divider :thickness="4" class="border-opacity-50" />
        <div class="py-4">
          <div class="d-flex justify-space-between">
            <span class="text-body-2 text-sm-body-1" style="font-weight: 700"
              >TIPO DE CABAÑA
            </span>
            <span class="text-body-2 text-sm-body-1" style="font-weight: 400">{{
              cabana
            }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <span class="text-body-2 text-sm-body-1" style="font-weight: 700"
              >CANTIDAD DE CABAÑAS </span
            ><span
              class="text-body-2 text-sm-body-1"
              style="font-weight: 400"
              >{{ amount }}</span
            >
          </div>
          <div class="d-flex justify-space-between">
            <span class="text-body-2 text-sm-body-1" style="font-weight: 700"
              >FECHA DE ENTRADA </span
            ><span
              class="text-body-2 text-sm-body-1"
              style="font-weight: 400"
              >{{ checkIn }}</span
            >
          </div>
          <div class="d-flex justify-space-between pb-3">
            <span class="text-body-2 text-sm-body-1" style="font-weight: 700"
              >FECHA DE SALIDA </span
            ><span
              class="text-body-2 text-sm-body-1"
              style="font-weight: 400"
              >{{ checkOut }}</span
            >
          </div>
          <v-divider :thickness="4" class="border-opacity-50" />
          <div class="d-flex align-center pt-3 text-body-2 text-sm-body-1">
            <v-col cols="6" class="text-start">
              <span> ¿Tienes código de descuento? </span>
            </v-col>
            <v-col cols="6">
              <v-text-field
                prepend-inner-icon="mdi-ticket"
                label="Código"
                variant="solo"
                :hide-details="true"
                v-model="voucher"
                @keyup.enter="discounts(voucher)"
              >
              </v-text-field>
            </v-col>
          </div>
          <div class="d-flex justify-space-between py-3">
            <span class="text-body-2 text-sm-body-1" style="font-weight: 700"
              >PRECIO TOTAL </span
            ><span
              class="text-body-2 text-sm-body-1"
              style="font-weight: 400"
              >{{ useBooking.precio.toLocaleString('es-Co') }}</span
            >
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useBookingStore } from '/stores/booking.js';

export default {
  data() {
    const useBooking = useBookingStore();
    return {
      useBooking,
      cabana: useBooking.cabana,
      amount: useBooking.amountRooms,
      checkIn: useBooking.checkIn,
      checkOut: useBooking.checkOut,
      precio: useBooking.precio,
      voucher: '',
      descuentos: {
        AbyaCash: 95,
        sepsafari: 84.375,
        sepancestral: 88.0952381,
        test: 0.38
      },
    };
  },
  methods: {
    discounts(discount) {
      if (Object.hasOwn(this.descuentos, this.voucher)) {
        this.useBooking.updateDetails({
          precio: (this.precio * this.descuentos[discount]) / 100,
        });
      }
    },
  },
};
</script>
