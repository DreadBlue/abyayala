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
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 text-sm-body-1" style="font-weight: 700"
              >CANTIDAD DE CABAÑAS
            </span>
            <v-select
              :items="opciones"
              :hide-details="true"
              variant="solo"
              class="v-col-1"
              v-model="amount"
            ></v-select>
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
            <v-col cols="6" class="d-flex justify-end">
              <v-text-field
                prepend-inner-icon="mdi-ticket"
                label="Código"
                variant="solo"
                :hide-details="true"
                v-model="voucher"
                @keyup.enter="discounts(voucher)"
                class="pl-15 ml-15 v-col-4"
              >
              </v-text-field>
            </v-col>
          </div>
          <div class="d-flex align-center py-3">
            <span class="text-body-2 text-sm-body-1" style="font-weight: 700"
              >ABONO
            </span>
            <v-text-field
              prepend-inner-icon="mdi-cash"
              label="Pago"
              variant="solo"
              :hide-details="true"
              v-model="precio"
              class="v-col-2"
            >
            </v-text-field>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useBookingStore } from "/stores/booking.js";

export default {
  data() {
    const useBooking = useBookingStore();
    return {
      useBooking,
      cabana: "Safari",
      amount: 0,
      checkIn: "2024-11-09",
      checkOut: "2024-11-11",
      precio: 0,
      voucher: "",
      descuentos: {
        AbyaCash: 95,
        sepsafari: 84.375,
        sepancestral: 88.0952381,
        test: 0.38,
      },
      opciones: [0, 1, 2, 3, 4, 5, 6],
    };
  },
  methods: {
    discounts(discount) {
      if (Object.hasOwn(this.descuentos, this.voucher)) {
        this.useBooking.updateDetails({
          precio: this.precio,
          amount: this.amount,
        });
      }
    },
  },
  mounted() {
    this.useBooking.updateDetails({
      checkIn: "2024-11-09",
      checkOut: "2024-11-11",
      cabana: "Safari",
    });
  },
  watch: {
    amount(newVal) {
      this.useBooking.updateDetails({ amountRooms: newVal });
    },
  },
};
</script>
