<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-row>
          <v-col cols="12">
            <span class="color-main text-h4 text-sm-h3">DATOS DE RESERVA</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-form>
              <v-container fluid>
                <v-row>
                  <v-col v-for="item in Inputs" :cols="item[4]" :sm="item[0]">
                    <v-text-field
                      :label="item[1]"
                      :variant="item[3]"
                      v-model="item[7]"
                      :prepend-inner-icon="item[5]"
                      :type="item[6].type ? item[6].type : null"
                      :minlength="item[6].minl ? item[6].minl : null"
                      :min="item[6].min ? item[6].min : null"
                      :hide-spin-buttons="item[6].spin ? item[6].spin : null"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <span class="d-flex justify-center pt-3" v-if="warning">Faltan datos</span>
              </v-container>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <v-container fluid>
    <v-row>
      <v-col cols="12" class="text-center">
        <span class="text-h4 text-sm-h3 color-main">METODOS DE PAGO</span>
      </v-col>
    </v-row>
    <v-row>
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

<script>
import { useBookingStore } from '/stores/booking.js';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default {
  setup() {
    const useGeneral = useGeneralStore();
    const warning = computed(() => {
      return useGeneral.warning;
    });
    return { warning, useGeneral}
  },
  data() {
    const useBooking = useBookingStore();
    return {
      card: false,
      cash: false,
      invoice: [],
      Inputs: {
        InputUno: [
          '6',
          'Nombre y apellido',
          'text',
          'solo',
          '12',
          'mdi-account-edit',
          { type: 'text' },
          '',
        ],
        InputDos: [
          '6',
          'Número de celular',
          'number',
          'solo',
          '12',
          'mdi-cellphone',
          { type: 'number', minl: '10', spin: true },
          '',
        ],
        InputTres: [
          '6',
          'Correo Electronico',
          'text',
          'solo',
          '12',
          'mdi-email',
          { type: 'mail' },
          '',
        ],
        InputCuatro: [
          '6',
          'Número de cédula / pasaporte',
          'text',
          'solo',
          '8',
          'mdi-card-account-details-outline',
          { type: 'text' },
          '',
        ],
        InputCinco: [
          '3',
          'Acompañantes',
          'text',
          'solo',
          '4',
          'mdi-account-multiple',
          { type: 'number', min: '0', spin: false },
          '',
        ],
        InputSeis: [
          '9',
          'Nombres y cédulas de los acompañantes',
          'text',
          'solo',
          '12',
          'mdi-account-multiple',
          { type: 'text' },
          '',
        ],
      },
      useBooking,
    };
  },
  methods: {
    async initiateCheckout(payment) {
      this.useGeneral.updateDetails({loading: true});
      const amount = this.useBooking.precio;
      const functions = getFunctions();
      const orderId = 'ORDER' + Date.now() * 1e6;


      const generateHash = httpsCallable(functions, 'generateHash');

      try {
        const response = await generateHash({ orderId, amount });
        const { hash } = response.data;

        let item = {
          nombre: this.Inputs.InputUno[7],
          celular: this.Inputs.InputDos[7],
          correo: this.Inputs.InputTres[7],
          cedula: this.Inputs.InputCuatro[7],
          acompanantes: this.Inputs.InputCinco[7],
          infoAcompanantes: this.Inputs.InputSeis[7],
          invoice: this.invoice,
        };

        const checkout = new BoldCheckout({
          orderId: orderId,
          currency: 'COP',
          amount: amount,
          // apiKey: 'KhzLJ-jCnTupzgcld8RwAJb0LquXdO45i5JyG4FpouA',
          apiKey: 'FeCNwHajYokCj6t2VQrednNaNP5L7c4g4cS2BAAxopw',
          integritySignature: hash,
          description: 'Pago valor dinámico',
          // redirectionUrl: 'http://localhost:3000/reservar/confirmacion',
          redirectionUrl: 'https://www.abyayalahostel.com/reservar/confirmacion',
        });

        if (Object.values(item).every((value) => value !== '')) {
          await this.useBooking.reservar(item);
          if (payment == 'card') {
            checkout.open();
          } else if (payment == 'cash') {
            return navigateTo('/reservar/confirmacion');
          }
        } else {
          this.useGeneral.updateDetails({loading: false});
          this.useGeneral.updateDetails({warning: true});
        }
      } catch (error) {
        console.error('Error al generar el hash:', error);
      }
    },
  },
};
</script>
