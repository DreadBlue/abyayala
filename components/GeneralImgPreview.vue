<template>
  <v-continer fluid class="imgOverlay">
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-col cols="5"></v-col>
        <v-col cols="3">
          <img :src="img" alt="recibo de pago" class="w-100" />
        </v-col>
        <v-col cols="4" class="d-flex justify-end">
          <p class="color-white text-body-1 pr-15" @click="showModified(false)">
            CERRAR
          </p>
        </v-col>
      </v-col>
    </v-row>
  </v-continer>
</template>

<script setup>
import { useGeneralStore } from '/stores/general.js';

const useGeneral = useGeneralStore();
function showModified(value) {
  useGeneral.updateState(value, 'showPreview');
}

const props = defineProps({
  img: String,
});
</script>
