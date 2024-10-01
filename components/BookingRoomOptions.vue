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
          v-if="disponibilidad[item.tipo] - item.cantidad == 0"
          class="d-flex justify-center pb-4 text-body-2 text-md-body-1"
          >Sin disponibilidad</span
        >
        <div class="text-center text-body-2 text-md-body-1">
          <v-btn
            @click="updateInfo(item)"
            :disabled="amount === 0"
            >RESERVAR</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import cabanas from '../assets/cabanas.json';
import { useBookingStore } from '/stores/booking.js';
import { useDisplay } from 'vuetify';

export default {
  setup() {
    const { smAndDown } = useDisplay();
    const reactiveHeight = ref('height: 450px');
    watch(
      smAndDown,
      (val) => {
        if (val == true) {
          reactiveHeight.value = 'height: auto';
        } else {
          reactiveHeight.value = 'height: 450px';
        }
      },
      {
        immediate: true,
      },
    );
    return { reactiveHeight };
  },
  props: {
    item: Object,
  },
  data() {
    const useBooking = useBookingStore();
    const router = useRouter();
    return {
      rooms: cabanas.filter((item) => item.pick === true),
      amount: 0,
      useBooking,
      disponibilidad: useBooking.disponibilidad,
      precio: 0,
      router,
    };
  },
  methods: {
    increase(cabana) {
      if (this.amount < cabana.cantidad - this.disponibilidad[cabana.tipo]) {
        this.amount++;
      }
    },
    decrease() {
      if (this.amount > 0) {
        this.amount--;
      }
    },
    updateInfo(item) {
      const dates = this.$route.query;
      this.router.push({
        path: '/reservar/datos',
        query: {
          ...dates,
          cabana: item.tipo,
          amount: this.amount,
        },
      });
      const newItem = {
        cabana: item.tipo,
        amountRooms: this.amount,
        precio: this.amount * item.precio,
      };
      this.useBooking.updateDetails(newItem);
    },
  },
};
</script>
