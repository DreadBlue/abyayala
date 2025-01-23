<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="text-center">
        <span class="color-main text-h4 text-sm-h3">DATOS DE RESERVA</span>
      </v-col>
      <v-col cols="12">
        <v-form>
          <v-container fluid>
            <v-row>
              <v-col
                v-for="input in inputs"
                :cols="input.colsMobile"
                :sm="input.cols"
              >
                <v-text-field
                  :label="input.label"
                  :variant="input.variant"
                  v-model="input.value"
                  :prepend-inner-icon="input.icon"
                  :type="input.type ? input.type : null"
                  :minlength="input.minLength ? input.minLength : null"
                  :min="input.min ? input.min : null"
                  :hide-spin-buttons="input.spin ? input.spin : null"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <span class="d-flex justify-center pt-3" v-if="warning"
              >Faltan datos</span
            >
          </v-container>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <span class="text-h4 text-sm-h3 color-main">METODOS DE PAGO</span>
      </v-col>
      <v-col cols="12" class="d-flex flex-column ga-2">
        <div>Transferencia bancaria</div>
        <div class="d-flex">
          <v-checkbox v-model="cash" :disabled="card"></v-checkbox>
          <v-file-input
            label="Comprobante de pago"
            variant="outlined"
            prepend-inner-icon="mdi-paperclip"
            :prepend-icon="null"
            v-model="invoice"
            @update:model-value="invoice"
          ></v-file-input>
        </div>
        <div>PSE / Tarjeta de crédito - debito</div>
        <div class="d-flex">
          <v-checkbox v-model="card" :disabled="cash"></v-checkbox>
          <div class="w-50">
            <img class="w-33" src="/otros/logo-bold.png" alt="logo bold" />
          </div>
        </div>
        <div class="text-center">
          <v-btn
            v-if="cash"
            class="bg-second color-white"
            @click="initiateCheckout('cash')"
            :disabled="!invoice.name"
            >PAGAR</v-btn
          >
          <v-btn
            v-if="card"
            class="bg-second color-white"
            @click="initiateCheckout('card')"
            >PAGAR</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/firebase.config';
import { useBookingStore } from '/stores/booking.js';
import { useGeneralStore } from '/stores/general.js';

const useGeneral = useGeneralStore();
const useBooking = useBookingStore();
const warning = computed(() => {
  return useGeneral.warning;
});

const card = ref(false);
const cash = ref(false);
const invoice = ref([]);

const inputs = reactive({
  name: {
    cols: '6',
    colsMobile: '12',
    label: 'Nombre y apellido',
    type: 'text',
    variant: 'solo',
    icon: 'mdi-account-edit',
    value: '',
  },
  phone: {
    cols: '6',
    colsMobile: '12',
    label: 'Número de celular',
    type: 'number',
    variant: 'solo',
    icon: 'mdi-cellphone',
    minLenght: '10',
    spin: true,
    value: '',
  },
  email: {
    cols: '6',
    colsMobile: '12',
    label: 'Correo Electronico',
    type: 'mail',
    variant: 'solo',
    icon: 'mdi-email',
    value: '',
  },
  documentId: {
    cols: '6',
    colsMobile: '8',
    label: 'Número de cédula / pasaporte',
    type: 'text',
    variant: 'solo',
    icon: 'mdi-card-account-details-outline',
    value: '',
  },
  guests: {
    cols: '3',
    colsMobile: '4',
    label: 'Acompañantes',
    type: 'number',
    variant: 'solo',
    icon: 'mdi-account-multiple',
    min: '0',
    spin: false,
    value: '',
  },
  guestsInfo: {
    cols: '9',
    colsMobile: '12',
    label: 'Nombres y cédulas de los acompañantes',
    type: 'text',
    variant: 'solo',
    icon: 'mdi-account-multiple',
    value: '',
  },
});

async function initiateCheckout(payment) {
  // this.useGeneral.updateDetails({loading: true});
  const amount = useBooking.precio;
  const orderId = 'ORDER' + Date.now() * 1e6;

  const generateHash = httpsCallable(functions, 'generateHash');

  try {
    const response = await generateHash({ orderId, amount });
    const { hash } = response.data;

    let item = {
      name: inputs.name.value,
      phone: inputs.phone.value,
      email: inputs.email.value,
      documentId: inputs.documentId.value,
      guests: inputs.guests.value,
      guestsInfo: inputs.guestsInfo.value,
      invoice: invoice.value,
    };

    const checkout = new BoldCheckout({
      orderId: orderId,
      currency: 'COP',
      amount: amount,
      apiKey: 'KhzLJ-jCnTupzgcld8RwAJb0LquXdO45i5JyG4FpouA',
      integritySignature: hash,
      description: 'Pago valor dinámico',
      redirectionUrl: 'https://abyayalahostel.com/reservar/confirmacion',
      renderMode: 'embedded',
    });

    if (Object.values(item).every((value) => value !== '')) {
      await useBooking.reservar(item);
      if (payment == 'card') {
        checkout.open();
      } else if (payment == 'cash') {
        return navigateTo('/reservar/confirmacion');
      }
    } else {
      this.useGeneral.updateDetails({ loading: false });
      this.useGeneral.updateDetails({ warning: true });
    }
  } catch (error) {
    console.error('Booking error:', error);
  }
}
</script>
