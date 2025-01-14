<template>
  <v-container fluid>
    <v-row>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
});
</script>
