<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    variant="outlined"
    :append-inner-icon="icon"
    readonly
    :label="labelInput"
    :hide-details="true"
    :style="pickerWidth"
  >
    <v-menu
      v-model="showMenu"
      activator="parent"
      :location="location"
      :close-on-content-click="closeOnContentClick"
    >
      <v-date-picker
        :elevation="elevation"
        @update:model-value="date"
        :min="min"
        :month="minMonth"
      ></v-date-picker>
    </v-menu>
  </v-text-field>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'DateInput',
  props: {
    icon: {
      type: String,
      default: 'mdi-calendar-today',
    },
    location: {
      type: String as PropType<'top' | 'bottom'>,
      default: 'bottom',
    },
    elevation: {
      type: String,
      default: '6',
    },
    closeOnContentClick: {
      type: Boolean,
      default: false,
    },
    labelInput: {
      type: String,
      default: 'Escribe aquí',
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    min: {
      type: String,
      default: undefined,
    },
    pickerWidth: {
      type: String,
      default: 'max-width: 85%',
    },
    showPicker: {
      type: Boolean,
      default: false,
    },
    minMonth: {
      type: Number,
      default: undefined,
    },
  },
  emits: ['update:model-value', 'update:show-picker'],
  methods: {
    date(value: any) {
      this.$emit('update:model-value', dayjs(value).format('DD-MM-YYYY'));
      this.showMenu = false; // Close the menu after selecting a date
      this.$emit('update:show-picker', false); // Emit the closed state to the parent
    },
  },
  watch: {
    showPicker(newValue) {
      this.showMenu = newValue;
    },
    showMenu(newValue) {
      this.$emit('update:show-picker', newValue);
    }
  },
  data() {
    return {
      showMenu: this.showPicker,
    };
  },
});
</script>
