<template>
  <v-container class="virtual-scroll-container">
    <v-row>
      <v-col cols="12" class="d-flex flex-column align-center">
        <span class="text-md-h4 text-h5 d-flex justify-center color-third"
          >SOLICITUDES</span
        >
        <v-table class="w-100 my-5">
          <thead>
            <tr>
              <th class="text-left">Selección</th>
              <th class="text-left">Estado</th>
              <th class="text-left">Número de reserva</th>
              <th class="text-left">Titular</th>
              <th class="text-left">Tipo de solicitud</th>
              <th class="text-left">Solicitud</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in solicitudes" :key="item.name">
              <td class="d-flex justify-center align-center">
                <v-checkbox v-model="solicitudes[index].answer"></v-checkbox>
              </td>
              <td>{{ item.status }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.nombre }}</td>
              <td>{{ item.tipo }}</td>
              <td>
                <div>
                  <span v-for="campo in item.solicitud">{{
                    campo.solicitud
                  }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
  <v-col class="d-flex justify-center ga-3">
    <v-btn class="bg-main" @click="requestAnswer('aprobar')">Aprobar</v-btn>
    <v-btn class="bg-second" @click="requestAnswer('rechazar')">Rechazar</v-btn>
  </v-col>
</template>

<script setup>
import { useAdminStore } from '/stores/admin.js';

const useAdmin = useAdminStore();
const solicitudes = ref({});
const answerRequest = ref({});

function requestAnswer(answer) {
  useAdmin.requestAnswer({ solicitudes: answerRequest.value, answer });
}

async function fetchRequests() {
  const requests = await useAdmin.fetchRequests();
  solicitudes.value = requests.data;
}

onMounted(async () => {
  fetchRequests();
});
</script>

<style scoped>
.virtual-scroll-container {
  height: 55vh;
  overflow-y: auto;
  position: relative;
}

.virtual-scroll-list {
  position: relative;
  width: 100%;
}

.virtual-scroll-item {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
}
</style>
