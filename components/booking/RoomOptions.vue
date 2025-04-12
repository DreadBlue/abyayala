<template>
  <v-container class="d-flex flex-column ga-15 pa-0 px-15 py-7" fluid>
    <v-row :class="`elevation-${5}`">
      <v-col cols="12" sm="6" :style="reactiveHeight" class="d-flex">
        <img
          :src="item.src"
          alt="Imagen cabaña"
          class="w-100"
          style="max-height: 100%; object-fit: cover"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <div class="text-center">
          <span class="text-h4 text-md-h3 color-second">
            {{ item.titulo.toUpperCase() }}</span
          >
        </div>
        <div
          class="d-flex flex-column align-center ga-3 text-body-2 text-md-body-1"
        >
          <div v-for="detalle in item.detalles">{{ detalle }}</div>
        </div>
        <div class="text-center py-5 text-body-2 text-md-body-1">
          <v-btn @click="decrease" class="mr-10"> - </v-btn>
          <span> {{ amount }} </span>
          <v-btn @click="increase(item)" class="ml-10"> + </v-btn>
        </div>
        <span
          v-if="availability[item.tipo] < 1"
          class="d-flex justify-center pb-4 text-body-2 text-md-body-1"
          >Sin disponibilidad</span
        >
        <span
          v-if="availability[item.tipo] > 0"
          class="d-flex justify-center pb-4 text-body-2 text-md-body-1"
          >Disponibilidad: {{ availability[item.tipo] }}</span
        >
        <div class="text-center text-body-2 text-md-body-1">
          <v-btn @click="redirection(item)" :disabled="amount === 0"
            >RESERVAR</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useBookingStore } from "/stores/booking.js";
import { useDisplay } from "vuetify";

export default {
  setup() {
    const useBooking = useBookingStore();
    const checkIn = computed(() => useBooking.checkIn);
    const checkOut = computed(() => useBooking.checkOut);
    const { smAndDown } = useDisplay();
    const reactiveHeight = ref("height: 450px");
    watch(
      smAndDown,
      (val) => {
        if (val == true) {
          reactiveHeight.value = "height: auto";
        } else {
          reactiveHeight.value = "height: 450px";
        }
      },
      {
        immediate: true,
      },
    );
    return { reactiveHeight, checkIn, checkOut };
  },
  props: {
    item: Object,
    availability: Object,
  },
  data() {
    const useBooking = useBookingStore();
    const router = useRouter();
    return {
      amount: 0,
      useBooking,
      precio: 0,
      router,
    };
  },
  methods: {
    increase(cabana) {
      if (this.amount < this.availability[cabana.tipo]) {
        this.amount++;
      }
    },
    decrease() {
      if (this.amount > 0) {
        this.amount--;
      }
    },
    calcularNoches(fechaInicio, fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      if (isNaN(inicio) || isNaN(fin)) {
        return "Por favor, ingresa fechas válidas.";
      }
      const diferenciaMilisegundos = fin - inicio;
      const noches = diferenciaMilisegundos / (1000 * 60 * 60 * 24);
      if (noches < 0) {
        return "La fecha de salida no puede ser anterior a la fecha de entrada.";
      }
      return noches;
    },
    redirection(item) {
      const dates = this.$route.query;
      const noches = this.calcularNoches(this.checkIn, this.checkOut);
      this.router.push({
        path: "/reservar/actividades",
        query: {
          ...dates,
          cabana: item.tipo,
          amount: this.amount,
          nights: noches,
        },
      });
      const newItem = {
        cabana: item.tipo,
        amountRooms: this.amount,
        precio: this.amount * item.precio * noches,
      };
      this.useBooking.updateDetails(newItem);
    },
  },
};
</script>
