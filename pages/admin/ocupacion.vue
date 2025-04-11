<template>
  <v-container>
    <v-row>
      <v-col cols="3"> 
        <admin-ocupation-banner/>
      </v-col>
      <v-col cols="9"> 
        <v-row>
          <v-col>
            <admin-ocupation/>
          </v-col>
        </v-row>
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
