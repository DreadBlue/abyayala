<template>
  <v-container fluid>
    <v-row>
      <v-row>
        <v-col
          cols="12"
          md="5"
          sm="4"
          class="d-flex justify-xs-center justify-sm-end justify-center"
        >
          <v-sheet
            class="bg-second rounded text-center"
            style="max-height: 58px"
          >
            <v-container class="h-50">
              <v-row class="h-50 my-n5 color-white" style="font-weight: 700">
                <v-col cols="12">DISPONIBILIDAD</v-col>
              </v-row>
              <v-row class="h-50 mt-10 color-white">
                <v-col cols="12">Veamos tus fechas</v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-col>
        <v-col cols="5" md="2" sm="3" class="pa-0 py-sm-3">
          <GeneralDatePicker
            v-model="dateCheckIn"
            class="flex-grow-0 w-100 ml-5 ml-sm-0"
            labelInput="Check in"
            :min="min"
            :pickerWidth="reactiveHeight"
            @update:model-value="onCheckInSelected"
          />
        </v-col>
        <v-col cols="5" md="2" sm="3" class="pa-0 py-sm-3">
          <GeneralDatePicker
            v-model="dateCheckOut"
            class="flex-grow-0 w-100 ml-3 ml-sm-0"
            labelInput="Check out"
            :disabled="!dateCheckIn"
            :min="minOut"
            :pickerWidth="reactiveHeight"
            :show-picker="showCheckoutPicker"
            :min-month="minMonth"
            @update:show-picker="showCheckoutPicker = $event"
          />
        </v-col>
        <v-col cols="2" md="3" sm="2" class="pa-0 py-sm-3">
          <v-btn
            class="bg-second color-white"
            icon="mdi-calendar-search"
            :disabled="!(dateCheckIn && dateCheckOut)"
            @click="redirection"
          />
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script setup>
import { DateTime } from 'luxon';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { useDisplay } from 'vuetify';

const router = useRouter()
dayjs.extend(customParseFormat);
const { smAndUp } = useDisplay();
const reactiveHeight = ref('max-width: 85%');

const min = DateTime.local().toString().slice(0, 10);
let minMonth = 0;
const dateCheckIn = ref('');
const dateCheckOut = ref('');
const showCheckoutPicker = ref(false);

const minOut = computed(() => {
  if (!dateCheckIn.value) return '';
  const checkInDate = DateTime.fromFormat(dateCheckIn.value, 'dd-MM-yyyy');
  const nextDay = checkInDate.plus({ days: 1 });
  minMonth = nextDay.month - 1;
  return nextDay.toFormat('yyyy-MM-dd');
});

const onCheckInSelected = () => {
  dateCheckOut.value = '';
  nextTick(() => {
    showCheckoutPicker.value = true;
  });
};

const redirection = () => {
  const dates = {
    checkIn: dayjs(dateCheckIn.value, "DD-MM-YYYY").format("YYYY-MM-DD"),
    checkOut: dayjs(dateCheckOut.value, "DD-MM-YYYY").format("YYYY-MM-DD"),
  };
  router.push({ path: '/reservar', query: dates });
};

watch(smAndUp, (val) => {
  reactiveHeight.value = val ? 'max-width: 95%' : 'max-width: 85%';
}, { immediate: true });
</script>
