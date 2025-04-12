<template>
  <v-form>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6" class="d-flex">
          <GeneralBanner :cards="BannerMireserva" />
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <v-row class="text-center">
            <v-col class="pb-sm-15 pb-3" cols="12">
              <span class="text-sm-h2 text-h3 color-second"
                >PASARELA DE PAGOS</span
              >
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Nombre completo"
                variant="solo"
                v-model="name"
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Número de celular"
                variant="solo"
                v-model="phone"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Correo eletronico"
                variant="solo"
                v-model="email"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Concepto del pago"
                variant="solo"
                v-model="concept"
              />
            </v-col>
            <v-col cols="6" sm="6">
              <v-text-field
                label="Número de reserva"
                variant="solo"
                v-model="idReserva"
              />
            </v-col>
            <v-col cols="6" sm="6">
              <v-text-field
                label="Valor del pago"
                variant="solo"
                v-model="formattedValue"
                :hide-spin-buttons="true"
              />
            </v-col>
            <v-col>
              <v-btn class="bg-second color-white" @click="generatePayment()">{{
                btnLabel
              }}</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <span class="d-flex justify-center pt-3" v-if="warning"
        >Faltan datos</span
      >
    </v-container>
  </v-form>
</template>

<script setup>
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/firebase.config";

const name = ref("");
const btnLabel = ref("PAGAR");
const phone = ref("");
const email = ref("");
const concept = ref("");
const idReserva = ref("");
const rawValue = ref(0);
const formattedValue = computed({
  get() {
    const cleanValue = String(rawValue.value || 0).replace(/[^\d.]/g, "");
    return Number(rawValue.value || 0).toLocaleString("es-CO");
  },
  set(value) {
    rawValue.value = value.replace(/\D/g, "");
  },
});

const generateHash = httpsCallable(functions, "generateHash");
const warning = ref(false);

async function generatePayment() {
  btnLabel.value = "Cargando...";
  const orderId = "ORDER" + Date.now() * 1e6;
  const response = await generateHash({ orderId, amount: rawValue.value });
  const { hash } = response.data;

  const checkout = new BoldCheckout({
    orderId: orderId,
    currency: "COP",
    amount: rawValue.value,
    apiKey: "KhzLJ-jCnTupzgcld8RwAJb0LquXdO45i5JyG4FpouA",
    integritySignature: hash,
    description: "Pago valor dinámico",
    renderMode: "embedded",
    redirectionUrl: "http://localhost:3000/reservar/confirmacion",
  });

  checkout.open();
}

const BannerMireserva = {
  card: {
    title: "",
    src: "/otros/bargente.jpg",
    flex: 12,
    height: "700px",
  },
};
</script>
