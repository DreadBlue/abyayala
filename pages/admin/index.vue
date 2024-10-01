<template>
  <GeneralValidation
    :formato="info"
    v-model:fieldOne="correo"
    v-model:fieldTwo="password"
    :action="signIn"
    :loginError="loginResult"
  />
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useGeneralStore } from '/stores/general.js';

export default {
  setup() {
    definePageMeta({
      middleware: 'admin',
    });

    const useGeneral = useGeneralStore();
    const correo = ref('');
    const password = ref('');
    const auth = getAuth();
    const loginResult = ref(false);
    const signIn = async () => {
      try {
        await signInWithEmailAndPassword(auth, correo.value, password.value)
          .then((userCredential) => {
            const user = userCredential.user;
            useGeneral.updateState(true, 'signOutButton');
            return navigateTo('/admin/reservas');
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            loginResult.value = true;
          });
        return signIn;
      } catch (error) {
        console.error('Error signing in:', error.code, error.message);
      }
    };
    return { signIn, correo, password, loginResult };
  },
  data() {
    return {
      info: {
        InputUno: ['Cuenta', 'Correo electronico', 'mdi-email-outline'],
        InputDos: ['Contraseña', 'Ingresa tu contraseña', 'mdi-lock-outline'],
        Descripcion:
          'La sección de administración te permitirá gestionar todas las reservas realizadas por tus clientes y aplicar los cambios necesarios.',
        Login: true,
        btn: ['Ingresar', '/admin/reservas'],
        contrasena: true,
      },
    };
  },
};
</script>
