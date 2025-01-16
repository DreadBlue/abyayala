<template>
  <v-container fluid class="pa-0 px-3 px-sm-15 bg-mygrey">
    <v-row class="pt-3">
      <v-col cols="12" sm="7" md="9">
        <div class="text-h5 text-sm-h4 text-md-h3 color-main">
          GESTIONAR RESERVA
        </div>
        <div class="text-subtitle-2 text-sm-subtitle color-second pl-2">
          Nº DE RESERVA: {{ booking.id }}
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="5"
        md="3"
        class="d-flex flex-column justify-center align-center ga-3"
      >
        <v-btn
          class="bg-main color-white text-body-2 text-sm-body-1"
          @click="sendEmail"
          >Reenviar correo de confirmación</v-btn
        >
        <p v-if="correoReenviado" class="text-body-1 pt-2">
          ¡Correo reenviado!
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col cols="12">
            <img
              src="/assets/imgs/cabanas/ancestral.jpeg"
              alt="Foto de cabaña"
              style="width: 100%; max-height: 410px; object-fit: cover"
              class="rounded-lg"
            />
          </v-col>
          <v-col cols="12" class="d-none d-sm-flex flex-sm-column">
            <v-card elevation="3" class="mb-8 pa-5">
              <v-row>
                <v-col cols="12">
                  <span class="text-h5 text-sm-4 text-md-h3 color-third"
                    >DETALLES DE COMIDA</span
                  >
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    disabled
                    label="reserva de comida"
                    variant="solo"
                  >
                  </v-text-field>
                  <v-btn class="bg-third color-white">Reservar comida</v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card elevation="3" class="mb-8 pa-5">
          <v-row>
            <v-col>
              <span class="text-h5 text-sm-4 text-md-h3 color-third"
                >TITULAR DE RESERVA</span
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="item in CardUno" :cols="item[0]">
              <v-text-field
                :label="item[1]"
                :variant="item[3]"
                v-model="booking[item[4]]"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="text-h5 text-sm-4 text-md-h3 color-second"
                >DETALLES DE LA RESERVA</span
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="item in CardDos" :cols="item[0]">
              <v-text-field
                :label="item[1]"
                :variant="item[3]"
                v-model="booking[item[4]]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-space-between">
              <general-date-picker
                v-model="booking['Check in']"
                class="flex-grow-0"
                labelInput="Check in"
                :min="newDate"
                :pickerWidth="reactiveWidth"
              />
              <general-date-picker
                v-model="booking['Check out']"
                class="flex-grow-0"
                labelInput="Check out"
                :min="checkIn"
                :pickerWidth="reactiveWidth"
              />
            </v-col>
            <v-col cols="12" class="text-center">
              <v-text-field
                readonly
                label="Precio de reserva"
                variant="solo"
                v-model="booking.Valor"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-btn class="bg-third color-white" @click="sendChangeRequest()"
                >Solicitar cambios</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-flex d-sm-none flex-column">
        <v-card elevation="3" class="mb-8 pa-5">
          <v-row>
            <v-col cols="12">
              <span class="text-h5 text-sm-4 text-md-h3 color-third"
                >DETALLES DE COMIDA</span
              >
            </v-col>
            <v-col cols="12">
              <v-text-field disabled label="reserva de comida" variant="solo">
              </v-text-field>
              <v-btn class="bg-third color-white">Reservar comida</v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-card elevation="3" class="mb-8 pa-5">
          <v-row>
            <v-col cols="12" class="text-center">
              <span class="text-h5 text-sm-4 text-md-h3 color-second"
                >COMPROBANTE DE PAGO</span
              >
            </v-col>
            <v-col cols="12" class="d-flex flex-column align-center ga-8">
              <img
                :src="booking.urlInvoice"
                alt="Comprobante"
                height="200"
                width="100"
                style="object-fit: cover"
                @click="showModified(true)"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <GeneralImgPreview v-if="showPreview" :img="booking.urlInvoice" />
</template>

<script setup>
import dayjs from 'dayjs';
import { useDisplay } from 'vuetify';
import { useBookingStore } from '/stores/booking.js';
import { useGeneralStore } from '/stores/general.js';

const useBooking = useBookingStore();
const useGeneral = useGeneralStore();
const showPreview = computed(() => useGeneral.showPreview);

const props = defineProps({
  booking: Object,
});

const newDate = dayjs().format('YYYY-MM-DD');
let correoReenviado = ref(false);
const CardUno = {
  InputUno: ['12', 'Nombre completo', 'text', 'solo', 'Nombre'],
  InputDos: ['6', 'Número de celular', 'text', 'solo', 'Celular'],
  InputTres: ['6', 'Correo Electronico', 'text', 'solo', 'Correo'],
  InputCuatro: ['6', 'Número de cédula', 'text', 'solo', 'Cédula'],
  InputCinco: ['6', 'Acompañantes', 'text', 'solo', 'Cantidad de huespedes'],
};
const CardDos = {
  InputUno: [
    '12',
    'Nombres y cédulas de los acompañantes',
    'text',
    'solo',
    'Información de acompañantes',
  ],
  InputDos: ['6', 'Tipo de cabaña', 'text', 'solo', 'Tipo de cabaña'],
  InputTres: ['6', 'Número de cabañas', 'text', 'solo', 'Cantidad de cabañas'],
};

async function sendEmail() {
  try {
    await useBooking.sendEmail(props.booking);
  } catch (error) {
    console.error('Email error:', error);
  }
}

async function sendChangeRequest() {
  try {
    await useBooking.changeRequest(props.booking);
  } catch (error) {
    console.error('Email error:', error);
  }
}

function showModified(value) {
  useGeneral.updateState(value, 'showPreview');
}

const { name } = useDisplay();
const reactiveWidth = ref('height: 450px');
watch(
  name,
  (val) => {
    if (val == 'lg' || val == 'md') {
      reactiveWidth.value = 'width: 294px';
    } else if (val == 'sm' || val == 'xs') {
      reactiveWidth.value = 'width: 145px';
    }
  },
  {
    immediate: true,
  },
);
</script>
