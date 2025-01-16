<template>
  <general-loader v-if="loading" :loading-text="loaderText" />
  <v-container v-if="!loading" fluid class="pa-0">
    <v-row>
      <v-col cols="12" md="3">
        <admin-request-filter />
      </v-col>
      <v-col cols="12" md="9">
        <admin-change-requests />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
});
</script>
