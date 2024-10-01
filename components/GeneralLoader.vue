<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        style="min-height: 50vh"
        class="d-flex flex-column align-center justify-center"
      >
        <div class="loader"></div>
        <p class="text-subtitle-2 pt-3 color-second">{{ loadingText }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  loadingText: String,
});
</script>
